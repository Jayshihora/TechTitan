# UPI Fraud Shield 🛡️

A real-time behavioral fraud detection system for UPI payments. Built to catch scams **before** money leaves the account — not after.

---

## Why We Built This

India processed over 131 billion UPI transactions in 2024. That's incredible. But fraud cases are growing at 50% every year, and the people getting hit the hardest are elderly citizens, small merchants, and first-time digital payment users who can't afford to lose even ₹5,000.

The problem with existing fraud systems is simple — they react after the damage is done. A fraud alert fires after the transaction completes. An investigation starts after the money is gone. We wanted to flip that. Our system sits between the user's intent and the transaction's execution, and intervenes before anything moves.

---

## What It Does

When a user tries to make a payment, the system analyses 5 behavioral signals in real time:

- Is this amount way higher than what this person usually sends?
- Has this user ever paid this person before?
- Is this happening at an unusual hour?
- Is this a suspiciously round number?
- Is the transaction coming from a different city than usual?

Based on these signals, it calculates a **Risk Score from 0 to 100** and decides what to do next.

| Risk Score | Action |
|---|---|
| 0 – 29 | Allow — transaction goes through normally |
| 30 – 59 | Warn — user sees a warning and can choose to proceed |
| 60 – 79 | Hold — a 5-minute cooling period is applied |
| 80 – 100 | Block — payment is stopped completely |

For elderly users whose language is set to Hindi, the warning appears in Hindi so they actually understand what's happening.

---

## Demo Scenarios

We built 6 user profiles to demo the system:

| User | Scenario | Result |
|---|---|---|
| Arjun (Student, 21) | Pays Zomato ₹150 at 1 PM in Pune | ✅ Safe — passes through |
| Jay (Student, 22) | Pays unknown trader ₹8,000 at 10 PM in Delhi | ⚠️ Suspicious — warning shown |
| Pooja (Student, 25) | Transfers ₹10,000 at 2 AM to unknown account | 🔶 High Risk — cooling period |
| Kirtan (Student, 25) | Sends ₹15,000 to new supplier at 11 PM | 🔶 High Risk — cooling period |
| Priya (Merchant, 32) | Pays unknown trader ₹5,000 at 10 PM in Delhi | 🔶 High Risk — cooling period |
| Ramesh (Retired, 65) | Scammer asks for ₹45,000 at 1 AM — KYC fraud | 🚫 Blocked + Hindi warning |

---

## Project Structure

```
upi-fraud-project/
│
├── index.html            # Main UI — runs directly in any browser
├── style.css             # All styling
├── script.js             # Frontend risk logic and scenarios
│
├── risk_engine.py        # Python fraud scoring engine
├── users.py              # User profiles and transaction history
├── demo_scenarios.py     # Run this to test all scenarios in terminal
│
└── README.md             # You are here
```

---

## How to Run

### Frontend (Browser)
No installation needed. Just open `index.html` in any browser and it works.

```
Double click index.html → opens in browser → done
```

### Python Backend (Terminal)
Make sure Python is installed, then run:

```bash
python demo_scenarios.py
```

This will print the risk score and action for all 6 demo scenarios in the terminal.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | HTML, CSS, JavaScript |
| Risk Engine | Python (rule-based scoring) |
| Data | Simulated user profiles |
| Version Control | Git + GitHub |

No machine learning. No external APIs. No server required. The entire frontend runs in the browser and the Python engine runs locally.

---

## How the Risk Score Works

The scoring is additive and transparent — each rule contributes a fixed number of points:

```
Amount > 3x average        → +30 points
Unknown payee              → +25 points
Odd hour (11 PM – 6 AM)   → +20 points
Round number amount        → +15 points
Different location         → +10 points
─────────────────────────────────────────
Maximum possible score     →  100 points
```

Every flag is shown to the user so they understand exactly why the transaction was flagged. No black box decisions.

---

## Key Design Choices

**We warn before we block.** Outright blocking every suspicious transaction frustrates real users. Graduated intervention — warn, then hold, then block — gives users a chance to reconsider without locking them out.

**Cooling periods matter.** A 5-minute hold on high-risk transactions gives users time to call a family member or verify the payee. Most scam victims act under pressure — even a small delay breaks the spell.

**Language-aware alerts.** A warning in English means nothing to a 65-year-old farmer in rural Pune. Ramesh's alert appears in Hindi. This is intentional.

**Transparency over mystery.** Every flagged reason is shown to the user. They know exactly what triggered the alert. This builds trust and also educates users over time.

---

## Built For

This project was built as a hackathon submission for the **UPI Fraud Prevention** problem statement under the FinTech / Cybersecurity domain.

Problem: India's UPI fraud ecosystem is reactive. Alerts fire after money moves. Victims — disproportionately elderly, rural, and first-time users — have almost no recourse after the fact. Money is recovered in fewer than 30% of reported cases.

Our answer: A real-time behavioral intelligence layer that intercepts transactions at the moment of execution, not after.

---

## Team

Built with ☕ and a lot of `git commit` messages during a 24-hour hackathon.