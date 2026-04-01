# risk_engine.py — Fraud scoring logic

from users import users

def calculate_risk(user_id, transaction):
    
    # Get this user's history
    user = users[user_id]
    score = 0
    reasons = []

    # --- RULE 1: Amount too high? ---
    avg_amount = sum(user["past_amounts"]) / len(user["past_amounts"])
    if transaction["amount"] > avg_amount * 3:
        score += 30
        reasons.append("Amount is much higher than your usual payments")

    # --- RULE 2: Never paid this person before? ---
    if transaction["payee"] not in user["known_payees"]:
        score += 25
        reasons.append("You have NEVER paid this person before")

    # --- RULE 3: Odd time of transaction? ---
    if transaction["hour"] >= 23 or transaction["hour"] <= 6:
        score += 20
        reasons.append("This transaction is happening at an unusual time")

    # --- RULE 4: Round number? ---
    if transaction["amount"] % 1000 == 0:
        score += 15
        reasons.append("Suspiciously round amount — scammers often request this")

    # --- RULE 5: Different location? ---
    if transaction.get("location") != user["usual_location"]:
        score += 10
        reasons.append("Transaction from an unusual location")

    return score, reasons


def get_action(score):
    if score < 30:
        return "ALLOW", "✅ Transaction looks safe"
    elif score < 60:
        return "WARN", "⚠️ This transaction looks suspicious"
    elif score < 80:
        return "COOLING PERIOD", "🟠 Wait 5 minutes before proceeding"
    else:
        return "BLOCK", "🚫 HIGH RISK — This looks like a scam!"


def get_warning_message(action, user_id, reasons):
    user = users[user_id]
    
    # Hindi warning for elderly users
    if user["language"] == "hindi" and action == "BLOCK":
        return "रुकिए! यह लेनदेन खतरनाक लग रहा है। कृपया अपने परिवार से पूछें।"
    
    # English for others
    msg = f"Alert for {user['name']}:\n"
    msg += "\n".join([f"  - {r}" for r in reasons])
    return msg