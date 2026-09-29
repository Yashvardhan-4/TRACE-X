from typing import Dict, Any, List

SCENARIO_DEFINITIONS: List[Dict[str, Any]] = [
    {
        "scenario_id": "SCN_INSD_01",
        "case_id": "TX-48291",
        "name": "Privilege-to-Proceeds Beneficiary Manipulation",
        "typology": "Insider-Enabled AML",
        "ground_truth": "SUSPICIOUS",
        "severity": "CRITICAL",
        "simulated_exposure_inr": 970000.0,
        "involves_employee": True,
        "description": "Employee E104 (Relationship Manager) logged in at 02:11 AM off-shift, modified customer C782's KYC, added foreign beneficiary B992 via privilege override P17, followed 17 minutes later by a ₹9.7L transfer split across mule accounts.",
        "primary_employee": {
            "employee_id": "EMP_E104",
            "name": "Vikram Malhotra",
            "role": "Relationship Manager",
            "branch": "BR-NARIMAN-POINT",
            "email": "v.malhotra@bankcorp.in"
        },
        "primary_customer": {
            "customer_id": "CUST_C782",
            "name": "Rajesh V. Sharma",
            "account": "ACC_A221",
            "historical_avg": 74000.0,
            "monthly_income": 125000.0
        },
        "beneficiary": {
            "beneficiary_id": "BEN_B992",
            "name": "Apex Global Ventures FZE",
            "account": "ACC_MULE_B992"
        },
        "mule_accounts": [
            {"account": "ACC_A391", "name": "Karan Singhania (Mule 1)", "amount": 485000.0},
            {"account": "ACC_A441", "name": "Meera Merchant (Mule 2)", "amount": 485000.0}
        ],
        "attack_chain": [
            {"step": 1, "time": "02:11:04", "delta": 0, "actor": "EMP_E104", "action": "LOGIN", "desc": "Employee login from non-corporate IP (182.74.92.14) outside shift hours"},
            {"step": 2, "time": "02:17:22", "delta": 6, "actor": "EMP_E104", "action": "VIEW_CUSTOMER", "desc": "Unscheduled access to high-net-worth customer profile C782"},
            {"step": 3, "time": "02:23:45", "delta": 12, "actor": "EMP_E104", "action": "MODIFY_KYC", "desc": "Override mobile number verification token using permission P08"},
            {"step": 4, "time": "02:25:10", "delta": 14, "actor": "EMP_E104", "action": "ADD_BENEFICIARY", "desc": "Bypass 24-hr cooling period to register Apex Global Ventures (B992) using privilege P17"},
            {"step": 5, "time": "02:42:30", "delta": 31, "actor": "CUST_C782", "action": "TRANSFER_OUT", "desc": "Immediate outward transfer of ₹9,70,000 (13.1x customer monthly baseline)"},
            {"step": 6, "time": "02:47:15", "delta": 36, "actor": "BEN_B992", "action": "SPLIT_TRANSFER", "desc": "Structuring split: ₹4,85,000 dispatched to Mule Account A391"},
            {"step": 7, "time": "02:49:02", "delta": 38, "actor": "BEN_B992", "action": "SPLIT_TRANSFER", "desc": "Structuring split: ₹4,85,000 dispatched to Mule Account A441"},
            {"step": 8, "time": "02:54:18", "delta": 43, "actor": "ACC_A391", "action": "CASH_WITHDRAWAL", "desc": "ATM cash withdrawal and immediate wallet off-ramp"}
        ],
        "evidence_dna": {
            "insider_risk": 96.0,
            "privilege_exposure": 94.0,
            "structuring": 91.0,
            "network_anomaly": 88.0,
            "temporal_correlation": 95.0,
            "profile_deviation": 84.0,
            "device_anomaly": 78.0
        },
        "composite_risk_score": 94.2,
        "confidence_score": 0.96
    },
    {
        "scenario_id": "SCN_STRUC_02",
        "case_id": "TX-48284",
        "name": "Multi-Branch Micro-Smurfing Under PAN Mandate",
        "typology": "Structuring / Smurfing",
        "ground_truth": "SUSPICIOUS",
        "severity": "HIGH",
        "simulated_exposure_inr": 490000.0,
        "involves_employee": True,
        "description": "Teller T042 processed 10 cash deposits of ₹49,000 each within 25 minutes across linked accounts to circumvent the mandatory ₹50,000 PAN verification threshold.",
        "primary_employee": {
            "employee_id": "EMP_T042",
            "name": "Deepak Joshi",
            "role": "Head Cashier",
            "branch": "BR-FORT-MUMBAI",
            "email": "d.joshi@bankcorp.in"
        },
        "primary_customer": {
            "customer_id": "CUST_C319",
            "name": "Sunil Traders",
            "account": "ACC_ST902",
            "historical_avg": 22000.0,
            "monthly_income": 95000.0
        },
        "evidence_dna": {
            "insider_risk": 72.0,
            "privilege_exposure": 68.0,
            "structuring": 98.0,
            "network_anomaly": 81.0,
            "temporal_correlation": 89.0,
            "profile_deviation": 76.0,
            "device_anomaly": 45.0
        },
        "composite_risk_score": 86.4,
        "confidence_score": 0.92
    },
    {
        "scenario_id": "SCN_DORM_03",
        "case_id": "TX-48281",
        "name": "Dormant Account Reactivation & Offshore Drain",
        "typology": "Dormant Account Awakening",
        "ground_truth": "SUSPICIOUS",
        "severity": "HIGH",
        "simulated_exposure_inr": 1850000.0,
        "involves_employee": True,
        "description": "Savings account dormant for 260 days was manually reactivated by Branch Operations Manager without customer in-person verification; ₹18.5L incoming wire was drained within 2 hours.",
        "primary_employee": {
            "employee_id": "EMP_M019",
            "name": "Sunita Rao",
            "role": "Branch Operations Manager",
            "branch": "BR-PUNE-CAMP",
            "email": "s.rao@bankcorp.in"
        },
        "primary_customer": {
            "customer_id": "CUST_C504",
            "name": "Pranav Deshmukh",
            "account": "ACC_PD411",
            "historical_avg": 12000.0,
            "monthly_income": 45000.0
        },
        "evidence_dna": {
            "insider_risk": 88.0,
            "privilege_exposure": 85.0,
            "structuring": 42.0,
            "network_anomaly": 91.0,
            "temporal_correlation": 86.0,
            "profile_deviation": 95.0,
            "device_anomaly": 60.0
        },
        "composite_risk_score": 89.1,
        "confidence_score": 0.94
    },
    {
        "scenario_id": "SCN_MULE_04",
        "case_id": "TX-48277",
        "name": "Fan-In / Fan-Out Distributed Mule Network",
        "typology": "Layering & Mule Network",
        "ground_truth": "SUSPICIOUS",
        "severity": "CRITICAL",
        "simulated_exposure_inr": 3400000.0,
        "involves_employee": False,
        "description": "12 disparate accounts wired ₹2.8L each into central hub account within 90 minutes (Fan-In); hub account immediately dispersed funds to 18 prepaid card accounts (Fan-Out).",
        "primary_employee": None,
        "primary_customer": {
            "customer_id": "CUST_C991",
            "name": "Zenith Consultancy",
            "account": "ACC_ZC882",
            "historical_avg": 45000.0,
            "monthly_income": 180000.0
        },
        "evidence_dna": {
            "insider_risk": 15.0,
            "privilege_exposure": 10.0,
            "structuring": 92.0,
            "network_anomaly": 99.0,
            "temporal_correlation": 94.0,
            "profile_deviation": 89.0,
            "device_anomaly": 82.0
        },
        "composite_risk_score": 91.7,
        "confidence_score": 0.95
    },
    {
        "scenario_id": "SCN_LEGIT_05",
        "case_id": "TX-48260",
        "name": "High-Value Festive Seasonal Business Surge",
        "typology": "Seasonal Merchant Inflow",
        "ground_truth": "LEGITIMATE",
        "severity": "LOW",
        "simulated_exposure_inr": 1250000.0,
        "involves_employee": True,
        "description": "Jewellery merchant processed a legitimate festive Diwali season RTGS payment of ₹12.5L. RM approved credit limit increase during standard branch hours with valid GST filings and invoice verification.",
        "primary_employee": {
            "employee_id": "EMP_E104",
            "name": "Vikram Malhotra",
            "role": "Relationship Manager",
            "branch": "BR-NARIMAN-POINT",
            "email": "v.malhotra@bankcorp.in"
        },
        "primary_customer": {
            "customer_id": "CUST_C112",
            "name": "Kalyan Jewellers Franchise",
            "account": "ACC_KJ101",
            "historical_avg": 850000.0,
            "monthly_income": 4500000.0
        },
        "evidence_dna": {
            "insider_risk": 8.0,
            "privilege_exposure": 12.0,
            "structuring": 5.0,
            "network_anomaly": 6.0,
            "temporal_correlation": 10.0,
            "profile_deviation": 14.0,
            "device_anomaly": 4.0
        },
        "composite_risk_score": 8.5,
        "confidence_score": 0.98
    },
    {
        "scenario_id": "SCN_LEGIT_06",
        "case_id": "TX-48255",
        "name": "Corporate Scheduled Monthly Payroll Disbursement",
        "typology": "Batch Payroll",
        "ground_truth": "LEGITIMATE",
        "severity": "LOW",
        "simulated_exposure_inr": 5400000.0,
        "involves_employee": False,
        "description": "Automated batch salary disbursement of ₹54 Lakhs disbursed to 142 registered employee accounts on the 1st of the month via Corporate Banking API with existing automated standing instructions.",
        "primary_employee": None,
        "primary_customer": {
            "customer_id": "CUST_C808",
            "name": "Infosolutions Pvt Ltd",
            "account": "ACC_INF77",
            "historical_avg": 5200000.0,
            "monthly_income": 22000000.0
        },
        "evidence_dna": {
            "insider_risk": 4.0,
            "privilege_exposure": 5.0,
            "structuring": 8.0,
            "network_anomaly": 11.0,
            "temporal_correlation": 6.0,
            "profile_deviation": 5.0,
            "device_anomaly": 2.0
        },
        "composite_risk_score": 5.2,
        "confidence_score": 0.99
    },
    {
        "scenario_id": "SCN_LEGIT_07",
        "case_id": "TX-48250",
        "name": "Emergency Hospital ICU Medical Settlement",
        "typology": "Emergency Medical Transfer",
        "ground_truth": "LEGITIMATE",
        "severity": "LOW",
        "simulated_exposure_inr": 650000.0,
        "involves_employee": True,
        "description": "Urgent hospital bill settlement of ₹6.5 Lakhs paid via IMPS at 01:30 AM to Lilavati Hospital. Approved through customer net banking OTP with customer service helpdesk verification call.",
        "primary_employee": {
            "employee_id": "EMP_H008",
            "name": "Ananya Sharma",
            "role": "Customer Service Representative",
            "branch": "BR-CALL-CENTER",
            "email": "a.sharma@bankcorp.in"
        },
        "primary_customer": {
            "customer_id": "CUST_C445",
            "name": "Dr. Arvind Kulkarni",
            "account": "ACC_AK204",
            "historical_avg": 95000.0,
            "monthly_income": 350000.0
        },
        "evidence_dna": {
            "insider_risk": 9.0,
            "privilege_exposure": 14.0,
            "structuring": 4.0,
            "network_anomaly": 5.0,
            "temporal_correlation": 12.0,
            "profile_deviation": 18.0,
            "device_anomaly": 6.0
        },
        "composite_risk_score": 11.0,
        "confidence_score": 0.97
    }
]
