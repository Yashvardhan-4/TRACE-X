# TRACE-X: Temporal Risk & Activity Correlation Engine

### Institutional Operating System for Financial Crime & Insider Risk Investigation

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](backend/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?logo=fastapi&logoColor=white)](backend/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-000000?logo=next.js&logoColor=white)](frontend/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](frontend/)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12.0.0-FF0072)](frontend/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](frontend/)

---

## 1. Executive Summary & Thesis

Traditional Anti-Money Laundering (AML) solutions monitor financial transaction networks in isolation. User & Entity Behavior Analytics (UEBA) monitor internal corporate IT and IAM access logs in isolation. 

Organized financial crime syndicates exploit this structural disconnect through **insider-enabled money laundering**: compromised or collusive bank employees use legitimate branch entitlements to bypass velocity controls, modify customer KYC records, and suppress 24-hour beneficiary cooling periods moments before high-velocity mule disbursements execute.

**TRACE-X** resolves this institutional blind spot by constructing a **Temporal Heterogeneous Risk Graph**:
$$\text{Employee} \xrightarrow{\text{Privilege}} \text{Action} \xrightarrow{\text{Modify}} \text{Customer Profile} \xrightarrow{\text{Bypass}} \text{Beneficiary Cooling} \xrightarrow{\text{Disburse}} \text{Mule Network}$$

By correlating insider access deviations directly with downstream transaction topologies, TRACE-X reconstructs the complete evidence-backed attack chain, isolates structural dependencies via counterfactual graph perturbation ($G' = G \setminus \{e_{\text{insider}}\}$), and compiles audit-grade dossiers ready for regulatory submission.

```
                    HETEROGENEOUS CORRELATION PIPELINE
 ┌──────────────────────────┐             ┌──────────────────────────┐
 │  Internal Core Banking   │             │   Transaction Switch     │
 │  - Finacle / Flexcube    │             │   - NEFT / RTGS / IMPS   │
 │  - Active Directory IAM  │             │   - Mule Account Clusters│
 └─────────────┬────────────┘             └────────────┬─────────────┘
               │                                       │
               ▼                                       ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │               TRACE-X Graph & Feature Synthesis                   │
 │   - Entity Resolution & Attribute Normalization                   │
 │   - Temporal Decay Alignment: S(t) = exp(-λ Δt)                   │
 │   - Capability Risk Score: CapScore = 1 - ∏(1 - w(p))             │
 └─────────────────────────────────┬─────────────────────────────────┘
                                   │
                                   ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                  7 Specialized Forensic Engines                   │
 │   [1] Structuring Engine    [2] Profile Z-Score    [3] Off-Hours  │
 │   [4] Privilege Exposure    [5] Flow NetworkX      [6] Temporal   │
 │   [7] Evidence Vector Fusion & Counterfactual Perturbation (G')   │
 └─────────────────────────────────┬─────────────────────────────────┘
                                   │
                                   ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                   Investigation Studio & Output                   │
 │   - Interactive Graph Visualizer (@xyflow/react)                  │
 │   - Dynamic Counterfactual Perturbation (Δ Risk Score)            │
 │   - Grounded Investigator Copilot (Audit Ledger RAG)              │
 │   - Statutory Audit Dossier Export (FATF-RBA / RBI-FRM Spec)      │
 └───────────────────────────────────────────────────────────────────┘
```

---

## 2. Mathematical & Algorithmic Formulation

### 2.1. Temporal Decay Proximity
Legitimate employee administrative actions often occur hours or days removed from regular account activity. In insider-enabled AML, privileged overrides precede high-value outflows within minutes. TRACE-X computes the temporal proximity score $S(\Delta t) \in [0, 1]$ using an exponential decay kernel:
$$S(\Delta t) = \exp\left(-\lambda \cdot \max(0, \Delta t - t_{\text{slack}})\right)$$
where $\Delta t = |t_{\text{disbursement}} - t_{\text{action}}|$, $\lambda = 0.05 \text{ min}^{-1}$, and $t_{\text{slack}} = 2.0 \text{ min}$.

### 2.2. Cumulative Privilege Exposure
Bank employees accumulate overlapping privileges across internal operational roles. When an employee exercises elevated entitlements outside their baseline profile, the capability risk score is modeled as the joint probability of privilege abuse:
$$\text{CapScore}(P_{\text{exercised}}) = 1 - \prod_{p \in P_{\text{exercised}}} \left(1 - w(p)\right)$$
where $w(p) \in [0, 1]$ represents the intrinsic regulatory sensitivity weight of privilege $p$ (e.g., $w(\text{P07: Cooling Bypass}) = 0.92$, $w(\text{P03: KYC Override}) = 0.85$).

### 2.3. Multi-Dimensional Composite Risk Fusion
Alert prioritization synthesizes signals across 7 normalized forensic dimensions:
$$R_{\text{composite}} = \sum_{i=1}^7 w_i \cdot s_i, \quad \sum_{i=1}^7 w_i = 1.0$$
where $s_i \in [0, 100]$ represents the output score of Engine $i$, and weights are calibrated against banking risk baselines:
- Insider Activity ($w_1 = 0.20$)
- Privilege Exposure ($w_2 = 0.18$)
- Transaction Structuring ($w_3 = 0.18$)
- Network Topology ($w_4 = 0.14$)
- Temporal Proximity ($w_5 = 0.14$)
- Baseline $Z$-Score Deviation ($w_6 = 0.10$)
- Access Anomalies ($w_7 = 0.06$)

### 2.4. Counterfactual Graph Perturbation ($G' = G \setminus \{e_{\text{insider}}\}$)
To evaluate whether an insider's intervention was **structurally necessary** to the execution of the laundering chain (rather than merely co-occurring), TRACE-X evaluates graph reachability under edge perturbation:
1. Define the observed graph $G = (V, E)$, with observed risk $R(G)$.
2. Construct the perturbed counterfactual graph $G' = (V, E \setminus E_{\text{insider\_action}})$, where edges corresponding to privileged overrides (such as cooling period bypasses or approval overrides) are severed.
3. Apply automated banking controls to $G'$: when cooling period bypass $e_{\text{cooling}}$ is severed, automated 24-hour holds freeze downstream beneficiary transfers.
4. Recompute reachability and composite risk score $R(G')$.
5. The structural dependency differential is defined as:
$$\Delta R = R(G) - R(G')$$
If $\Delta R \ge 70.0\%$, the insider's action is classified as **structurally indispensable** to the laundering execution.

---

## 3. The 7 Specialized Forensic Engines

| Engine | Designation | Methodology | Key Indicators |
| :--- | :--- | :--- | :--- |
| **Engine 1** | **Transaction Anomaly & Structuring** | Sliding-window threshold aggregation & cycle detection | Multi-tranche structuring below ₹5,00,000 threshold, round-tripping, fan-in / fan-out velocity spikes |
| **Engine 2** | **Customer Profile Baseline** | Historical rolling $Z$-score & novelty distance | Transfer amounts exceeding $10\times$ monthly baseline ($Z > 3.5$), unverified foreign beneficiary additions |
| **Engine 3** | **Insider Behavioral Deviation** | Shift matrix & access telemetry analysis | Off-hours core banking access (02:11 AM IST), non-corporate external IP subnet, cross-branch profile lookups |
| **Engine 4** | **Privilege Exposure & Abuse** | Cumulative entitlement sensitivity modeling | Capability override combinations (`P03: KYC Modification` + `P07: Cooling Bypass` + `P17: Velocity Override`) |
| **Engine 5** | **Money Flow Topology** | In-memory NetworkX directed graph analytics | Mule network routing, layering chains, intermediate hub centrality, terminal crypto off-ramp sinks |
| **Engine 6** | **Temporal Activity Correlation** | Causal event sequence alignment & decay modeling | Strict chronological sequencing ($t_{\text{login}} < t_{\text{kyc}} < t_{\text{cooling}} < t_{\text{transfer}}$) with $\Delta t < 20 \text{ min}$ |
| **Engine 7** | **Evidence DNA & Fusion** | Normalized vector synthesis & claim extraction | 7-dimensional forensic radar, auditable evidence ledger, and counterfactual delta computation |

---

## 4. Scenario Benchmark Lab & Digital Twin

TRACE-X includes a pre-seeded digital banking twin featuring **187 employees**, **8,431 customer accounts**, **2,417 transaction logs**, and an empirical testbed of **7 curated forensic scenarios**:

```
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                      BENCHMARK CONCORDANCE MATRIX (TESTBED EVALUATION)                 │
 ├──────────────┬───────────────────────────────────────────┬──────────────┬──────────────┤
 │ Scenario ID  │ Typology Description                      │ Ground Truth │ Verdict      │
 ├──────────────┼───────────────────────────────────────────┼──────────────┼──────────────┤
 │ SCN_INSD_01  │ Privilege-to-Proceeds Beneficiary Bypassed│ SUSPICIOUS   │ SUSPICIOUS   │
 │ SCN_STRUC_02 │ Multi-Branch Micro-Smurfing Under PAN     │ SUSPICIOUS   │ SUSPICIOUS   │
 │ SCN_DORM_03  │ Dormant Account Reactivation & Drain      │ SUSPICIOUS   │ SUSPICIOUS   │
 │ SCN_MULE_04  │ Fan-In / Fan-Out Distributed Mule Network │ SUSPICIOUS   │ SUSPICIOUS   │
 │ SCN_LEGIT_05 │ High-Value Festive Seasonal Business Surge│ LEGITIMATE   │ LEGITIMATE   │
 │ SCN_LEGIT_06 │ Corporate Scheduled Monthly Payroll Batch │ LEGITIMATE   │ LEGITIMATE   │
 │ SCN_LEGIT_07 │ Emergency ICU Hospital Medical Wire       │ LEGITIMATE   │ LEGITIMATE   │
 └──────────────┴───────────────────────────────────────────┴──────────────┴──────────────┘
```

> **Validation Scope Notice:** Performance figures (100% Precision, 100% Recall, 0.0% False Positive Rate) reflect concordance against this curated 7-scenario prototype validation testbed. Institutional deployments evaluate continuously against historical multi-year audit logs.

---

## 5. Technology Stack & Architecture

### Backend Core
- **Framework:** FastAPI 0.111.0 with async Starlette routing
- **Data Layer:** SQLAlchemy 2.0 ORM with SQLite (PostgreSQL production-ready)
- **Graph Engine:** NetworkX 3.3 in-memory directed heterogeneous graph processing
- **Validation:** Pydantic v2 strict type schemas
- **Telemetry & Hashing:** SHA-256 cryptographic audit chaining for regulatory reports

### Frontend Cockpit
- **Framework:** Next.js 14.2.35 (React 18 App Router, Server Components)
- **Language:** TypeScript 5.4 with strict compiler verification
- **Graph Visualization:** `@xyflow/react` (React Flow 12) with custom institutional entity nodes
- **Styling:** Tailwind CSS 3.4 with near-black design tokens (`#090A0B`, `#111214`, `#18191C`)
- **Iconography:** Lucide React
- **Micro-Interactions:** Physics-based spring animations, progress tracking, and accessible drawers

---

## 6. Repository Structure

```
TRACE-X/
├── backend/
│   ├── app/
│   │   ├── api/                     # REST API route handlers
│   │   │   └── v1/
│   │   │       ├── cases.py         # Case ledger & detail endpoints
│   │   │       ├── graph.py         # Directed graph topology generation
│   │   │       ├── counterfactual.py# G' perturbation & risk simulation
│   │   │       ├── scenarios.py     # Scenario benchmark runner
│   │   │       ├── copilot.py       # Grounded evidence Q&A engine
│   │   │       └── reports.py       # Regulatory audit dossier generation
│   │   ├── core/                    # Engine configurations & database session
│   │   ├── engines/                 # The 7 Detection Engines + Copilot
│   │   │   ├── transaction_engine.py
│   │   │   ├── baseline_engine.py
│   │   │   ├── insider_engine.py
│   │   │   ├── privilege_engine.py
│   │   │   ├── graph_engine.py
│   │   │   ├── temporal_engine.py
│   │   │   ├── fusion_engine.py
│   │   │   └── copilot_engine.py
│   │   ├── models/                  # SQLAlchemy ORM schemas & Pydantic models
│   │   ├── scenarios/               # Synthetic digital twin scenarios
│   │   └── utils/
│   │       └── seed_data.py         # Deterministic mock database seeder
│   ├── requirements.txt             # Python dependencies
│   └── main.py                      # FastAPI entrypoint & lifespan
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Institutional layout wrapper
│   │   │   ├── page.tsx             # Command Center
│   │   │   ├── cases/
│   │   │   │   ├── page.tsx         # Investigation Queue
│   │   │   │   └── [id]/page.tsx    # Investigation Studio (Centerpiece)
│   │   │   ├── sandbox/page.tsx     # Counterfactual Sandbox
│   │   │   └── scenarios/page.tsx   # Scenario Benchmark Lab
│   │   ├── components/
│   │   │   ├── graph/               # Custom React Flow nodes & graph canvas
│   │   │   ├── evidence/            # Evidence DNA vector & claim cards
│   │   │   ├── timeline/            # Attack sequence chronological timeline
│   │   │   ├── copilot/             # Grounded slide-over drawer
│   │   │   ├── dossier/             # Printable compliance dossier modal
│   │   │   └── layout/              # Header & Sidebar navigation rail
│   │   ├── lib/                     # API client & utility functions
│   │   └── types/                   # Unified TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── docker-compose.yml               # Multi-container deployment specification
├── start.ps1                        # PowerShell one-click launcher
├── start.bat                        # Windows CMD one-click launcher
├── LICENSE                          # Apache 2.0 License
└── README.md                        # Institutional technical documentation
```

---

## 7. Quick Start & Installation

### Option A: One-Click Launch (Windows / PowerShell)
```powershell
.\start.ps1
```
*(Or execute `start.bat`)*

This script automatically provisions Python virtual environments, installs requirements, seeds the SQLite database, installs npm packages, and boots both servers concurrently:
- **FastAPI Backend:** [http://localhost:8000](http://localhost:8000) (Swagger documentation: [http://localhost:8000/docs](http://localhost:8000/docs))
- **Investigation Cockpit:** [http://localhost:3000](http://localhost:3000)

---

### Option B: Manual Setup

#### Step 1: Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the forensic database
python -m app.utils.seed_data

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Step 2: Frontend Setup
```bash
cd frontend

# Install npm packages
npm install

# Run the development server
npm run dev
```

---

### Option C: Production Docker Deployment
```bash
docker-compose up --build
```

---

## 8. REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/v1/cases` | `GET` | List all forensic cases with composite risk scores and exposure metrics |
| `GET /api/v1/cases/{case_id}` | `GET` | Retrieve case metadata, evidence ledger, and attack chain narrative |
| `GET /api/v1/cases/{case_id}/graph` | `GET` | Generate heterogeneous directed graph topology (nodes and edges) |
| `POST /api/v1/cases/{case_id}/counterfactual` | `POST` | Simulate graph perturbation $G' = G \setminus \{e_{\text{insider}}\}$ and compute risk delta |
| `POST /api/v1/cases/{case_id}/copilot` | `POST` | Ask grounded natural-language forensic questions against the verified evidence store |
| `GET /api/v1/cases/{case_id}/dossier` | `GET` | Generate structured, compliance-grade regulatory audit report |
| `GET /api/v1/scenarios` | `GET` | List all 7 synthetic digital twin scenarios |
| `POST /api/v1/scenarios/benchmark/summary` | `POST` | Run the complete benchmark testbed and output confusion matrix |

---

## 9. Regulatory & Statutory Alignment

TRACE-X is designed in accordance with statutory compliance and AML directives:
- **FATF Recommendation 10 & 16:** Rigorous Customer Due Diligence (CDD), beneficial ownership transparency, and wire transfer origin-to-destination traceability.
- **Reserve Bank of India (RBI) Master Directions on Frauds (2024):** Mandatory early detection of staff connivance, segregation of duties, off-hours access monitoring, and immediate SAR filing.
- **FinCEN BSA / Suspicious Activity Reporting (SAR):** Automated generation of narrative chronologies and evidentiary attachments supporting law enforcement subpoenas.

---

## 10. License & Attribution

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for complete details.

Developed for institutional financial-crime analysis and insider threat risk reduction.
