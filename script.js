let steps = 0;
let headsValue = 3;
let currentUser = "";

const busyBeaverValues = {
    1: 1, 2: 4, 3: 6, 4: 107, 5: 47176870
};

function startGame() {
    const name = document.getElementById('username-input').value;
    if (name.trim().length < 2) return alert("Name too short!");
    currentUser = name;
    document.getElementById('login-screen').style.display = "none";
    document.getElementById('game-container').style.display = "block";
    document.getElementById('user-display').innerText = currentUser;
    renderLeaderboard();
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

// THE LEADERBOARD LOGIC
function saveRecord() {
    let data = JSON.parse(localStorage.getItem('global_scores')) || [];
    data.push({ name: currentUser, score: steps });
    data.sort((a, b) => b.score - a.score);
    localStorage.setItem('global_scores', JSON.stringify(data.slice(0, 10)));
    alert("Record Uploaded to Local Cache!");
    renderLeaderboard();
}

function renderLeaderboard() {
    const display = document.getElementById('leaderboard-content');
    const data = JSON.parse(localStorage.getItem('global_scores')) || [];
    
    if (data.length === 0) {
        display.innerHTML = "<p>No records yet. Be the first!</p>";
        return;
    }

    // Creating clean, symbol-free text
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
