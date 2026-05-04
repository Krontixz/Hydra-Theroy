// --- Supabase Config (Replace with your actual keys from Step 1) ---
const SB_URL = "https://your-project-id.supabase.co";
const SB_KEY = "your-anon-public-key";

let steps = 0;
let headsValue = 3;
let currentUser = "";

const busyBeaverValues = { 1: 1, 2: 4, 3: 6, 4: 107, 5: 47176870 };

async function startGame() {
    const name = document.getElementById('username-input').value;
    if (name.trim().length < 2) return alert("Name too short!");
    currentUser = name;
    document.getElementById('login-screen').style.display = "none";
    document.getElementById('game-container').style.display = "block";
    document.getElementById('user-display').innerText = currentUser;
    
    // Fetch global scores immediately on login
    fetchGlobalLeaderboard();
}

function chop() {
    steps++;
    if (typeof headsValue === 'number') {
        headsValue--;
        headsValue += (steps * 2); 
        updateDisplay();
    }
}

function applyBusyBeaver() {
    let n = prompt("Enter Busy Beaver State (1-5):");
    if (busyBeaverValues[n]) {
        headsValue += busyBeaverValues[n];
        updateDisplay();
    } else if (n > 5) {
        headsValue = "BEYOND_LOGIC";
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('step-count').innerText = steps.toLocaleString();
    const comp = document.getElementById('complexity');
    comp.innerText = (typeof headsValue === 'number') ? headsValue.toLocaleString() : "UNCOMPUTABLE";
    
    let icons = "";
    if (typeof headsValue === 'number') {
        let count = Math.min(headsValue, 30);
        for(let i=0; i<count; i++) icons += "🐉";
        document.getElementById('heads').innerText = icons + (headsValue > 30 ? "..." : "");
    }
}

// --- NEW SUPABASE GLOBAL LOGIC ---

async function saveRecord() {
    // 1. Send data to Supabase
    const response = await fetch(`${SB_URL}/rest/v1/leaderboard`, {
        method: 'POST',
        headers: {
            'apikey': SB_KEY,
            'Authorization': `Bearer ${SB_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name: currentUser, score: steps })
    });

    if (response.ok) {
        alert("Global Record Saved!");
        fetchGlobalLeaderboard();
    } else {
        alert("Error saving to global database.");
    }
}

async function fetchGlobalLeaderboard() {
    // 2. Fetch top 10 scores from Supabase
    const response = await fetch(`${SB_URL}/rest/v1/leaderboard?select=name,score&order=score.desc&limit=10`, {
        headers: {
            'apikey': SB_KEY,
            'Authorization': `Bearer ${SB_KEY}`
        }
    });

    const data = await response.json();
    renderLeaderboard(data);
}

function renderLeaderboard(data) {
    const display = document.getElementById('leaderboard-content');
    if (!data || data.length === 0) {
        display.innerHTML = "<p>No global records yet.</p>";
        return;
    }

    let html = "<ul style='list-style:none; padding:0; text-align:left;'>";
    data.forEach((entry, i) => {
        html += `<li style='margin-bottom:8px;'>
            <span style='color:#4ecca3'>#${i+1}</span> 
            <strong>${entry.name}</strong>: 
            ${entry.score.toLocaleString()} steps
        </li>`;
    });
    html += "</ul>";
    display.innerHTML = html;
}

// Automatically refresh global scores every 15 seconds
setInterval(fetchGlobalLeaderboard, 15000);
