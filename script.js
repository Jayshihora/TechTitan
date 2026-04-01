const users = {
  arjun: {
    name: "Arjun (Student, 21)",
    past_amounts: [50, 100, 200, 150, 800, 700, 900, 1100],
    known_payees: ["Zomato", "Friend Rohit", "College Canteen", "Swiggy", "Zepto", "Blinkit"],
    usual_location: "Pune",
    language: "english"
  },
  jay: {
    name: "Jay (Student, 22)",
    past_amounts: [50, 150, 250, 500, 800, 600, 1000],
    known_payees: ["Zomato", "Friend Rohit", "College Canteen", "Swiggy", "Zepto", "Blinkit"],
    usual_location: "Pune",
    language: "english"
  },
  pooja: {
    name: "Pooja (Student, 25)",
    past_amounts: [500, 1100, 2000, 1500, 800],
    known_payees: ["Zomato", "Friend Rohit", "College Canteen", "Swiggy", "Zepto", "Blinkit"],
    usual_location: "Pune",
    language: "english"
  },
  kirtan: {
    name: "Kirtan (Student, 25)",
    past_amounts: [500, 1100, 2100, 1500, 600, 550, 450, 700],
    known_payees: ["Zomato", "Friend Rohit", "College Canteen", "Swiggy", "Zepto", "Blinkit"],
    usual_location: "Pune",
    language: "english"
  },
  priya: {
    name: "Priya (Merchant, 32)",
    past_amounts: [1000, 2000, 1500, 800, 1200],
    known_payees: ["Wholesaler Raju", "Rent Landlord", "Staff Salary"],
    usual_location: "Mumbai",
    language: "english"
  },
  ramesh: {
    name: "Ramesh (Retired, 65)",
    past_amounts: [200, 500, 150, 300, 450, 600, 250],
    known_payees: ["Kirana Store", "Son Amit", "Electricity Board"],
    usual_location: "Pune",
    language: "hindi"
  }
};

const scenes = [
  { user: "arjun", payee: "Zomato",               amount: 150,   hour: 13, location: "Pune"   },
  { user: "jay",   payee: "Unknown Trader",        amount: 8000,  hour: 22, location: "Delhi"  },
  { user: "pooja", payee: "Random Account",        amount: 10000, hour: 2,  location: "Mumbai" },
  { user: "kirtan",payee: "New Supplier",          amount: 15000, hour: 23, location: "Delhi"  },
  { user: "priya", payee: "Unknown Trader",        amount: 5000,  hour: 22, location: "Delhi"  },
  { user: "ramesh",payee: "Bank Verification Dept",amount: 45000, hour: 1,  location: "Delhi"  }
];

function loadScene(i) {
  const s = scenes[i];
  document.getElementById('user-select').value = s.user;
  document.getElementById('payee').value    = s.payee;
  document.getElementById('amount').value   = s.amount;
  document.getElementById('hour').value     = s.hour;
  document.getElementById('location').value = s.location;
  reset();
}

function onUserChange() {
  reset();
}

function scoreIt(user, payee, amount, hour, location) {
  const avg = user.past_amounts.reduce((a, b) => a + b, 0) / user.past_amounts.length;
  let score = 0;
  const reasons = [];

  if (amount > avg * 3) {
    score += 30;
    reasons.push("Amount is much higher than this person normally sends");
  }
  if (!user.known_payees.includes(payee)) {
    score += 25;
    reasons.push("This payee has never received money from this user");
  }
  if (hour >= 23 || hour <= 6) {
    score += 20;
    reasons.push("Transaction is happening at an odd hour");
  }
  if (amount % 1000 === 0) {
    score += 15;
    reasons.push("Round number — a common pattern seen in fraud");
  }
  if (location !== user.usual_location) {
    score += 10;
    reasons.push("Location is different from where this user usually pays");
  }

  return { score: Math.min(score, 100), reasons };
}

function analyse() {
  const userId   = document.getElementById('user-select').value;
  const payee    = document.getElementById('payee').value.trim();
  const amount   = parseInt(document.getElementById('amount').value);
  const hour     = parseInt(document.getElementById('hour').value);
  const location = document.getElementById('location').value.trim();

  if (!payee || isNaN(amount) || isNaN(hour) || !location) {
    alert("Please fill in all fields before analysing.");
    return;
  }

  const user = users[userId];
  const { score, reasons } = scoreIt(user, payee, amount, hour, location);

  let color, icon, title, sub, btnText;

  if (score < 30) {
    color = "green";  icon = "✅";
    title = "Looks completely safe";
    sub   = "No suspicious signals found";
    btnText = "Confirm Payment";
  } else if (score < 60) {
    color = "yellow"; icon = "⚠️";
    title = "Something seems off";
    sub   = "Please double check before paying";
    btnText = "Proceed Anyway";
  } else if (score < 80) {
    color = "orange"; icon = "🔶";
    title = "High risk detected";
    sub   = "A 5-minute hold has been applied";
    btnText = "I Understand";
  } else {
    color = "red";    icon = "🚫";
    title = "Payment blocked";
    sub   = "This matches a known scam pattern";
    btnText = "Blocked";
  }

  const card = document.getElementById('result-card');
  card.className = "result-card show " + color;

  document.getElementById('result-icon').textContent  = icon;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent   = sub;
  document.getElementById('score-value').textContent  = score + " / 100";

  const fill = document.getElementById('score-fill');
  fill.style.width = score + "%";
  fill.style.background =
    color === "green"  ? "#5a9e20" :
    color === "yellow" ? "#c08010" :
    color === "orange" ? "#c05010" : "#bb2222";

  const ul = document.getElementById('reason-list');
  ul.innerHTML = reasons.length
    ? reasons.map(r => `<li>${r}</li>`).join("")
    : "<li>No red flags found</li>";

  const hindi = document.getElementById('hindi-box');
  hindi.style.display = (user.language === "hindi" && score >= 80) ? "block" : "none";

  const btn = document.getElementById('confirm-btn');
  btn.textContent = btnText;
  btn.disabled    = score >= 80;
}

function reset() {
  const card = document.getElementById('result-card');
  card.className = "result-card";
  document.getElementById('score-fill').style.width = "0%";
  document.getElementById('reason-list').innerHTML = "";
  document.getElementById('hindi-box').style.display = "none";
  const btn = document.getElementById('confirm-btn');
  btn.textContent = "Confirm";
  btn.disabled = false;
}

loadScene(0);