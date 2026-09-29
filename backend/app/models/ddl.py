from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Time,
    ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, nullable=False)
    department = Column(String(64), nullable=False)
    role_id = Column(String(32), ForeignKey("roles.role_id"), nullable=False)
    assigned_branch_id = Column(String(32), nullable=False)
    standard_shift_start = Column(String(8), default="09:00:00")
    standard_shift_end = Column(String(8), default="18:00:00")
    risk_level = Column(String(16), default="STANDARD")  # STANDARD, ELEVATED, WATCHLIST
    created_at = Column(DateTime, default=utc_now)

    role = relationship("Role", back_populates="employees")
    activity_logs = relationship("EmployeeActivityLog", back_populates="employee")

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(String(32), primary_key=True)
    role_name = Column(String(64), unique=True, nullable=False)
    description = Column(Text)

    employees = relationship("Employee", back_populates="role")
    permissions = relationship("RolePermission", back_populates="role")

class Permission(Base):
    __tablename__ = "permissions"

    permission_id = Column(String(32), primary_key=True)
    code = Column(String(64), unique=True, nullable=False)  # e.g., PERM_MODIFY_BENEFICIARY
    description = Column(Text)
    risk_weight = Column(Float, default=0.50)

    role_permissions = relationship("RolePermission", back_populates="permission")

class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(String(32), ForeignKey("roles.role_id"), primary_key=True)
    permission_id = Column(String(32), ForeignKey("permissions.permission_id"), primary_key=True)

    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="role_permissions")

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    risk_tier = Column(String(16), default="LOW")  # LOW, MEDIUM, HIGH, PEP
    monthly_income_inr = Column(Float, default=50000.0)
    historical_avg_tx_inr = Column(Float, default=15000.0)
    historical_std_tx_inr = Column(Float, default=5000.0)
    home_branch_id = Column(String(32), nullable=False)
    kyc_status = Column(String(24), default="VERIFIED")  # VERIFIED, PENDING, OVERRIDDEN, EXPIRED
    kyc_last_updated = Column(DateTime, default=utc_now)

    accounts = relationship("Account", back_populates="customer")
    beneficiaries = relationship("Beneficiary", back_populates="customer")

class Account(Base):
    __tablename__ = "accounts"

    account_number = Column(String(32), primary_key=True, index=True)
    customer_id = Column(String(32), ForeignKey("customers.customer_id"), nullable=False)
    account_type = Column(String(24), default="SAVINGS")  # SAVINGS, CURRENT, NRE, CORPORATE
    status = Column(String(16), default="ACTIVE")  # ACTIVE, DORMANT, FROZEN, SUSPENDED
    balance_inr = Column(Float, default=0.0)
    last_activity_at = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    customer = relationship("Customer", back_populates="accounts")
    outgoing_transactions = relationship("Transaction", foreign_keys="Transaction.source_account", back_populates="source")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    beneficiary_id = Column(String(32), primary_key=True, index=True)
    customer_id = Column(String(32), ForeignKey("customers.customer_id"), nullable=False)
    beneficiary_account_number = Column(String(32), nullable=False)
    beneficiary_name = Column(String(128), nullable=False)
    added_via = Column(String(24), default="NET_BANKING")  # NET_BANKING, BRANCH_PORTAL, ADMIN_OVERRIDE
    authorized_by_employee_id = Column(String(32), ForeignKey("employees.employee_id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    is_active = Column(Boolean, default=True)

    customer = relationship("Customer", back_populates="beneficiaries")

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String(48), primary_key=True, index=True)
    source_account = Column(String(32), ForeignKey("accounts.account_number"), nullable=False)
    destination_account = Column(String(32), nullable=False, index=True)
    amount_inr = Column(Float, nullable=False)
    channel = Column(String(24), default="IMPS")  # NEFT, RTGS, IMPS, UPI, CASH
    timestamp = Column(DateTime, nullable=False, default=utc_now, index=True)
    status = Column(String(16), default="SUCCESS")  # SUCCESS, FLAGGED, BLOCKED, REVERSED
    ip_address = Column(String(45), nullable=True)
    device_id = Column(String(64), nullable=True)

    source = relationship("Account", foreign_keys=[source_account], back_populates="outgoing_transactions")

class EmployeeActivityLog(Base):
    __tablename__ = "employee_activity_logs"

    event_id = Column(String(48), primary_key=True, index=True)
    employee_id = Column(String(32), ForeignKey("employees.employee_id"), nullable=False, index=True)
    action_type = Column(String(64), nullable=False)  # LOGIN, VIEW_CUSTOMER, MODIFY_KYC, ADD_BENEFICIARY, APPROVE_OVERRIDE
    target_entity_type = Column(String(32), nullable=False)  # CUSTOMER, ACCOUNT, BENEFICIARY, TRANSACTION
    target_entity_id = Column(String(64), nullable=False)
    permission_used = Column(String(32), ForeignKey("permissions.permission_id"), nullable=True)
    timestamp = Column(DateTime, nullable=False, default=utc_now, index=True)
    ip_address = Column(String(45), nullable=False)
    device_id = Column(String(64), nullable=False)
    branch_id = Column(String(32), nullable=False)
    is_off_hours = Column(Boolean, default=False)

    employee = relationship("Employee", back_populates="activity_logs")

class Case(Base):
    __tablename__ = "cases"

    case_id = Column(String(32), primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    severity = Column(String(16), default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    composite_risk_score = Column(Float, nullable=False)  # 0.0 to 100.0
    confidence_score = Column(Float, nullable=False)      # 0.0 to 1.0
    status = Column(String(24), default="NEW")  # NEW, UNDER_REVIEW, ESCALATED, FALSE_POSITIVE, CONFIRMED
    assigned_investigator = Column(String(128), nullable=True)
    primary_employee_id = Column(String(32), ForeignKey("employees.employee_id"), nullable=True)
    primary_customer_id = Column(String(32), ForeignKey("customers.customer_id"), nullable=True)
    total_exposure_inr = Column(Float, default=0.0)
    typology = Column(String(64), default="Insider-Enabled AML")
    attack_chain_summary = Column(Text, nullable=False)
    evidence_dna_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    alerts = relationship("Alert", back_populates="case", cascade="all, delete-orphan")
    evidence_items = relationship("EvidenceItem", back_populates="case", cascade="all, delete-orphan")

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(String(48), primary_key=True, index=True)
    case_id = Column(String(32), ForeignKey("cases.case_id"), nullable=False)
    source_system = Column(String(32), nullable=False)  # TRANSACTION_MONITORING, INSIDER_RISK, ACCESS_AUDIT
    alert_name = Column(String(128), nullable=False)
    severity = Column(String(16), default="HIGH")
    created_at = Column(DateTime, default=utc_now)

    case = relationship("Case", back_populates="alerts")

class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    evidence_id = Column(String(48), primary_key=True, index=True)
    case_id = Column(String(32), ForeignKey("cases.case_id"), nullable=False)
    engine_name = Column(String(64), nullable=False)
    claim = Column(Text, nullable=False)
    deviation_factor = Column(Float, nullable=True)  # e.g., 11.7x baseline
    source_event_type = Column(String(32), nullable=False)  # TRANSACTION, EMPLOYEE_LOG, KYC_CHANGE
    source_event_id = Column(String(64), nullable=False)
    event_timestamp = Column(DateTime, nullable=False)
    rule_or_model_ref = Column(String(64), nullable=False)
    payload_json = Column(JSON, default=dict)

    case = relationship("Case", back_populates="evidence_items")
