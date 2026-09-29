import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.ddl import (
    Employee, Role, Permission, RolePermission,
    Customer, Account, Beneficiary, Transaction,
    EmployeeActivityLog, Case, Alert, EvidenceItem
)
from app.scenarios.definitions import SCENARIO_DEFINITIONS

FIRST_NAMES = ["Aarav", "Aditi", "Rohan", "Pooja", "Vikram", "Sneha", "Karan", "Ananya", "Rahul", "Priya", "Nikhil", "Meera", "Siddharth", "Deepika", "Arjun", "Kavita", "Gaurav", "Divya", "Amit", "Shreya"]
LAST_NAMES = ["Sharma", "Verma", "Malhotra", "Patel", "Mehta", "Deshmukh", "Singhania", "Merchant", "Joshi", "Rao", "Nair", "Iyer", "Banerjee", "Chatterjee", "Bose", "Kulkarni", "Kapadia", "Bhatia"]
BRANCHES = ["BR-NARIMAN-POINT", "BR-FORT-MUMBAI", "BR-BKC-MUMBAI", "BR-PUNE-CAMP", "BR-CONNAUGHT-PLACE", "BR-MG-ROAD-BLR", "BR-JUBILEE-HILLS-HYD"]

PERMISSIONS_CONFIG = [
    ("P01", "PERM_VIEW_CUSTOMER_PROFILE", "View sensitive customer KYC and account profile", 0.15),
    ("P02", "PERM_VIEW_TX_HISTORY", "View complete historical statement and counter-parties", 0.15),
    ("P03", "PERM_UPDATE_CONTACT_INFO", "Modify registered phone number or email address", 0.65),
    ("P04", "PERM_REACTIVATE_DORMANT", "Override dormancy lock on un-serviced account", 0.85),
    ("P05", "PERM_APPROVE_TX_OVERRIDE", "Override standard daily velocity / transaction amount limits", 0.90),
    ("P06", "PERM_MODIFY_BENEFICIARY", "Add, edit or whitelist transfer beneficiary account", 0.88),
    ("P07", "PERM_BYPASS_COOLING_PERIOD", "Bypass 24-hour mandatory cooling period for new beneficiaries", 0.95),
    ("P08", "PERM_OVERRIDE_OTP_TOKEN", "Bypass or regenerate SMS/Token two-factor verification", 0.98),
]

ROLES_CONFIG = [
    ("ROLE_RM", "Relationship Manager", ["P01", "P02", "P03", "P06", "P07"]),
    ("ROLE_TELLER", "Head Cashier / Teller", ["P01", "P02", "P05"]),
    ("ROLE_BOM", "Branch Operations Manager", ["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08"]),
    ("ROLE_AUDIT", "Compliance & Audit Officer", ["P01", "P02"]),
    ("ROLE_CSR", "Customer Service Specialist", ["P01", "P03"]),
]

def seed_complete_synthetic_twin(db: Session):
    """Generates the full digital twin universe with rich baseline data and scenario cases."""
    print("[Digital Twin] Seeding RBAC permissions and roles...")
    
    # 1. Permissions
    perm_map = {}
    for code_id, code_name, desc, weight in PERMISSIONS_CONFIG:
        perm = db.query(Permission).filter(Permission.permission_id == code_id).first()
        if not perm:
            perm = Permission(permission_id=code_id, code=code_name, description=desc, risk_weight=weight)
            db.add(perm)
        perm_map[code_id] = perm
    db.commit()

    # 2. Roles & RolePermissions
    for role_id, role_name, granted_perms in ROLES_CONFIG:
        role = db.query(Role).filter(Role.role_id == role_id).first()
        if not role:
            role = Role(role_id=role_id, role_name=role_name, description=f"Institutional role: {role_name}")
            db.add(role)
            db.commit()
        for p_id in granted_perms:
            rp = db.query(RolePermission).filter(
                RolePermission.role_id == role_id,
                RolePermission.permission_id == p_id
            ).first()
            if not rp:
                db.add(RolePermission(role_id=role_id, permission_id=p_id))
    db.commit()

    print("[Digital Twin] Seeding background employee baseline (187 employees)...")
    # 3. Employees
    # First inject scenario-specific employees
    seeded_emp_ids = set()
    for scn in SCENARIO_DEFINITIONS:
        p_emp = scn.get("primary_employee")
        if p_emp and p_emp["employee_id"] not in seeded_emp_ids:
            role_id = "ROLE_RM" if "Manager" in p_emp["role"] else ("ROLE_TELLER" if "Cashier" in p_emp["role"] else "ROLE_BOM")
            emp = db.query(Employee).filter(Employee.employee_id == p_emp["employee_id"]).first()
            if not emp:
                emp = Employee(
                    employee_id=p_emp["employee_id"],
                    name=p_emp["name"],
                    email=p_emp["email"],
                    department="Retail & Commercial Banking",
                    role_id=role_id,
                    assigned_branch_id=p_emp["branch"],
                    standard_shift_start="09:00:00",
                    standard_shift_end="18:00:00",
                    risk_level="WATCHLIST" if scn["ground_truth"] == "SUSPICIOUS" else "STANDARD"
                )
                db.add(emp)
            seeded_emp_ids.add(p_emp["employee_id"])
    db.commit()

    # Add remaining background employees up to 187
    roles_list = ["ROLE_RM", "ROLE_TELLER", "ROLE_BOM", "ROLE_AUDIT", "ROLE_CSR"]
    for i in range(1, 188):
        emp_id = f"EMP_E{i:03d}"
        if emp_id in seeded_emp_ids:
            continue
        existing = db.query(Employee).filter(Employee.employee_id == emp_id).first()
        if existing:
            continue
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        emp = Employee(
            employee_id=emp_id,
            name=f"{fname} {lname}",
            email=f"{fname.lower()}.{lname.lower()}{i}@bankcorp.in",
            department=random.choice(["Wealth Management", "Retail Operations", "Treasury", "Card Services"]),
            role_id=random.choice(roles_list),
            assigned_branch_id=random.choice(BRANCHES),
            standard_shift_start="09:00:00",
            standard_shift_end="18:00:00",
            risk_level="STANDARD"
        )
        db.add(emp)
        seeded_emp_ids.add(emp_id)
    db.commit()

    print("[Digital Twin] Seeding customers, accounts, and background transactions...")
    # 4. Scenario Primary Customers & Accounts
    for scn in SCENARIO_DEFINITIONS:
        p_cust = scn.get("primary_customer")
        if p_cust:
            cust = db.query(Customer).filter(Customer.customer_id == p_cust["customer_id"]).first()
            if not cust:
                cust = Customer(
                    customer_id=p_cust["customer_id"],
                    name=p_cust["name"],
                    risk_tier="HIGH" if scn["ground_truth"] == "SUSPICIOUS" else "LOW",
                    monthly_income_inr=p_cust.get("monthly_income", 100000.0),
                    historical_avg_tx_inr=p_cust.get("historical_avg", 50000.0),
                    historical_std_tx_inr=p_cust.get("historical_avg", 50000.0) * 0.25,
                    home_branch_id="BR-NARIMAN-POINT",
                    kyc_status="OVERRIDDEN" if scn["ground_truth"] == "SUSPICIOUS" else "VERIFIED"
                )
                db.add(cust)
                db.commit()
            
            acc = db.query(Account).filter(Account.account_number == p_cust["account"]).first()
            if not acc:
                acc = Account(
                    account_number=p_cust["account"],
                    customer_id=p_cust["customer_id"],
                    account_type="SAVINGS",
                    status="DORMANT" if "Dormant" in scn["name"] else "ACTIVE",
                    balance_inr=2450000.0 if scn["ground_truth"] == "SUSPICIOUS" else 850000.0
                )
                db.add(acc)
                db.commit()

    # 5. Background Customers and Accounts
    existing_cust_count = db.query(Customer).count()
    if existing_cust_count < 50:
        for i in range(existing_cust_count + 1, 60):
            cid = f"CUST_C{i:03d}"
            acc_num = f"ACC_A{i:03d}"
            fname = random.choice(FIRST_NAMES)
            lname = random.choice(LAST_NAMES)
            c = Customer(
                customer_id=cid,
                name=f"{fname} {lname}",
                risk_tier="LOW",
                monthly_income_inr=float(random.randint(40000, 250000)),
                historical_avg_tx_inr=float(random.randint(10000, 60000)),
                historical_std_tx_inr=5000.0,
                home_branch_id=random.choice(BRANCHES),
                kyc_status="VERIFIED"
            )
            db.add(c)
            db.commit()
            a = Account(
                account_number=acc_num,
                customer_id=cid,
                account_type="SAVINGS",
                status="ACTIVE",
                balance_inr=float(random.randint(50000, 800000))
            )
            db.add(a)
        db.commit()

    print("[Digital Twin] Seeding Showcase Case #TX-48291 and Scenario Cases...")
    # 6. Inject Showcase Scenario Case TX-48291
    now = datetime.now(timezone.utc)
    base_time = now - timedelta(hours=3)

    for scn in SCENARIO_DEFINITIONS:
        existing_case = db.query(Case).filter(Case.case_id == scn["case_id"]).first()
        if not existing_case:
            case_obj = Case(
                case_id=scn["case_id"],
                title=f"{scn['name']} - Alert #{scn['case_id']}",
                severity=scn["severity"],
                composite_risk_score=scn["composite_risk_score"],
                confidence_score=scn["confidence_score"],
                status="NEW" if scn["ground_truth"] == "SUSPICIOUS" else "CLOSED_FALSE_POSITIVE",
                assigned_investigator="Senior AML Special Investigations" if scn["ground_truth"] == "SUSPICIOUS" else "Automated Screening",
                primary_employee_id=scn.get("primary_employee", {}).get("employee_id") if scn.get("primary_employee") else None,
                primary_customer_id=scn.get("primary_customer", {}).get("customer_id") if scn.get("primary_customer") else None,
                total_exposure_inr=scn["simulated_exposure_inr"],
                typology=scn["typology"],
                attack_chain_summary=scn["description"],
                evidence_dna_json=scn["evidence_dna"]
            )
            db.add(case_obj)
            db.commit()

            # Seed specific Alert records for each case
            if scn["ground_truth"] == "SUSPICIOUS":
                db.add(Alert(
                    alert_id=f"ALT_{scn['case_id']}_01",
                    case_id=scn["case_id"],
                    source_system="TRANSACTION_MONITORING",
                    alert_name=f"{scn['typology']} Flagged",
                    severity=scn["severity"],
                    created_at=base_time + timedelta(minutes=45)
                ))
                if scn["involves_employee"]:
                    db.add(Alert(
                        alert_id=f"ALT_{scn['case_id']}_02",
                        case_id=scn["case_id"],
                        source_system="INSIDER_RISK",
                        alert_name="Privileged Off-Hours Override Detected",
                        severity="CRITICAL",
                        created_at=base_time + timedelta(minutes=15)
                    ))
                    db.add(Alert(
                        alert_id=f"ALT_{scn['case_id']}_03",
                        case_id=scn["case_id"],
                        source_system="ACCESS_AUDIT",
                        alert_name="Cooling Period Security Bypass",
                        severity="HIGH",
                        created_at=base_time + timedelta(minutes=16)
                    ))

            # Specific evidence items for showcase case TX-48291
            if scn["case_id"] == "TX-48291":
                # Beneficiary creation
                ben_obj = db.query(Beneficiary).filter(Beneficiary.beneficiary_id == "BEN_B992").first()
                if not ben_obj:
                    ben_obj = Beneficiary(
                        beneficiary_id="BEN_B992",
                        customer_id="CUST_C782",
                        beneficiary_account_number="ACC_MULE_B992",
                        beneficiary_name="Apex Global Ventures FZE",
                        added_via="ADMIN_OVERRIDE",
                        authorized_by_employee_id="EMP_E104",
                        created_at=base_time + timedelta(minutes=14),
                        is_active=True
                    )
                    db.add(ben_obj)
                    db.commit()

                # Activity logs for Employee E104
                evt_login = EmployeeActivityLog(
                    event_id="EVT_4481",
                    employee_id="EMP_E104",
                    action_type="LOGIN",
                    target_entity_type="EMPLOYEE",
                    target_entity_id="EMP_E104",
                    permission_used=None,
                    timestamp=base_time,
                    ip_address="182.74.92.14",
                    device_id="DEV_UNRECOGNIZED_LINUX_99",
                    branch_id="REMOTE_VPN",
                    is_off_hours=True
                )
                evt_view = EmployeeActivityLog(
                    event_id="EVT_4483",
                    employee_id="EMP_E104",
                    action_type="VIEW_CUSTOMER",
                    target_entity_type="CUSTOMER",
                    target_entity_id="CUST_C782",
                    permission_used="P01",
                    timestamp=base_time + timedelta(minutes=6),
                    ip_address="182.74.92.14",
                    device_id="DEV_UNRECOGNIZED_LINUX_99",
                    branch_id="REMOTE_VPN",
                    is_off_hours=True
                )
                evt_kyc = EmployeeActivityLog(
                    event_id="EVT_4485",
                    employee_id="EMP_E104",
                    action_type="MODIFY_KYC",
                    target_entity_type="CUSTOMER",
                    target_entity_id="CUST_C782",
                    permission_used="P03",
                    timestamp=base_time + timedelta(minutes=12),
                    ip_address="182.74.92.14",
                    device_id="DEV_UNRECOGNIZED_LINUX_99",
                    branch_id="REMOTE_VPN",
                    is_off_hours=True
                )
                evt_override = EmployeeActivityLog(
                    event_id="EVT_4487",
                    employee_id="EMP_E104",
                    action_type="ADD_BENEFICIARY",
                    target_entity_type="BENEFICIARY",
                    target_entity_id="BEN_B992",
                    permission_used="P07",
                    timestamp=base_time + timedelta(minutes=14),
                    ip_address="182.74.92.14",
                    device_id="DEV_UNRECOGNIZED_LINUX_99",
                    branch_id="REMOTE_VPN",
                    is_off_hours=True
                )
                db.add_all([evt_login, evt_view, evt_kyc, evt_override])
                db.commit()

                # Transactions
                tx_main = Transaction(
                    transaction_id="TX_99182",
                    source_account="ACC_A221",
                    destination_account="ACC_MULE_B992",
                    amount_inr=970000.0,
                    channel="RTGS",
                    timestamp=base_time + timedelta(minutes=31),
                    status="FLAGGED",
                    ip_address="182.74.92.14",
                    device_id="DEV_UNRECOGNIZED_LINUX_99"
                )
                tx_split_1 = Transaction(
                    transaction_id="TX_99183",
                    source_account="ACC_MULE_B992",
                    destination_account="ACC_A391",
                    amount_inr=485000.0,
                    channel="IMPS",
                    timestamp=base_time + timedelta(minutes=36),
                    status="SUCCESS",
                    ip_address="103.21.244.2",
                    device_id="DEV_MULE_CLIENT_01"
                )
                tx_split_2 = Transaction(
                    transaction_id="TX_99184",
                    source_account="ACC_MULE_B992",
                    destination_account="ACC_A441",
                    amount_inr=485000.0,
                    channel="IMPS",
                    timestamp=base_time + timedelta(minutes=38),
                    status="SUCCESS",
                    ip_address="103.21.244.5",
                    device_id="DEV_MULE_CLIENT_02"
                )
                db.add_all([tx_main, tx_split_1, tx_split_2])
                db.commit()

                # Detailed Evidence Claims
                evidence_data = [
                    ("Engine 1 (Transaction Anomaly)", "Transaction TX-99182 is split into 2 structured tranches of ₹4,85,000 each within a 2-minute window to avoid ₹5,00,000 internal SAR threshold.", 9.8, "TRANSACTION", "TX_99182", base_time + timedelta(minutes=31), "RULE_STRUCTURING_WINDOW"),
                    ("Engine 2 (Customer Baseline)", "Amount of ₹9,70,000 is 13.1x higher than Customer C782's historical mean monthly transfer volume of ₹74,000 (Z-score: +4.2).", 13.1, "CUSTOMER", "CUST_C782", base_time + timedelta(minutes=31), "MODEL_CUSTOMER_ZSCORE"),
                    ("Engine 3 (Insider Behavior)", "Employee E104 accessed customer profile at 02:11 AM IST outside normal branch operational window (09:00 - 18:00) from an unrecognized Linux user-agent.", 4.5, "EMPLOYEE_LOG", "EVT_4481", base_time, "RULE_OFF_HOURS_ACCESS"),
                    ("Engine 4 (Privilege Exposure)", "Employee exercised Capability P07 (Cooling Period Bypass) and P03 (KYC Override), unlocking direct outward routing to foreign corporate entity.", 1.0, "EMPLOYEE_LOG", "EVT_4487", base_time + timedelta(minutes=14), "MATRIX_PRIVILEGE_ATTACK_SURFACE"),
                    ("Engine 5 (Money Flow Graph)", "Recipient accounts A391 and A441 belong to a previously flagged shell entity cluster sharing common subnets and rapid cash-out topologies.", 3.2, "TRANSACTION", "TX_99183", base_time + timedelta(minutes=36), "GRAPH_MULE_COMMUNITY"),
                    ("Engine 6 (Temporal Correlation)", "Critical causal delta: Exactly 17 minutes elapsed between Employee E104's beneficiary override (02:25 AM) and the outward wire initiation (02:42 AM). Proximity decay confidence: 95%.", 17.0, "EMPLOYEE_LOG", "EVT_4487", base_time + timedelta(minutes=14), "ENGINE_TEMPORAL_DECAY"),
                    ("Engine 7 (Explainability)", "Multi-engine deterministic evidence synthesis confirms an insider-assisted structuring and layering typology with 7 congruent forensic vectors.", 7.0, "CASE", "TX-48291", base_time + timedelta(minutes=45), "SYNTHESIS_EVIDENCE_DNA")
                ]

                for eng_name, claim_text, dev_factor, src_type, src_id, ev_ts, rule_ref in evidence_data:
                    ev_item = EvidenceItem(
                        evidence_id=f"EV_{scn['case_id']}_{src_id}_{rule_ref[:8]}",
                        case_id=scn["case_id"],
                        engine_name=eng_name,
                        claim=claim_text,
                        deviation_factor=dev_factor,
                        source_event_type=src_type,
                        source_event_id=src_id,
                        event_timestamp=ev_ts,
                        rule_or_model_ref=rule_ref,
                        payload_json={"rule": rule_ref, "source_id": src_id}
                    )
                    db.add(ev_item)
                db.commit()

    db.commit()
    print("[Digital Twin] Seeding complete! Pre-loaded cases and digital twin universe ready.")
