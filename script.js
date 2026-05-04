let steps = 0;
let headsValue = 3;

// Known Busy Beaver values (Sigma function)
// Sigma(1) = 1
// Sigma(2) = 4
// Sigma(3) = 6
// Sigma(4) = 107
// Sigma(5) >= 47,176,870
const busyBeaverValues = {
    1: 1,
    2: 4,
    3: 6,
    4: 107,
    5: 47176870
};

function chop() {
    steps++;
    if (headsValue > 0) {
        headsValue--;
        // The Hydra growth rule
        headsValue += (steps * 2); 
        updateDisplay();
    } else {
        alert("The Hydra is defeated! But the number of steps is now your record.");
    }
}

function applyBusyBeaver() {
    let input = prompt("Enter a Busy Beaver number (1-5) to boost the Hydra:");
    let n = parseInt(input);

    if (busyBeaverValues[n]) {
        headsValue += busyBeaverValues[n];
        alert(`Power Up! Sigma(${n}) added ${busyBeaverValues[n]} heads.`);
        updateDisplay();
    } else if (n > 5) {
        // Since Sigma(6) is unknown and massive, we use BigInt notation
        headsValue = "BEYOND_CALCULATION"; 
        document.getElementById('heads').innerText = "♾️🔥🐉🔥♾️";
        document.getElementById('complexity').innerText = "Larger than Graham's Number";
        alert("You've entered the non-computable zone! Sigma(6) is too big for this browser.");
    } else {
        alert("Please enter a number between 1 and 5.");
    }
}

function updateDisplay() {
    document.getElementById('step-count').innerText = steps;
    document.getElementById('complexity').innerText = headsValue;
    
    let icons = "";
    // Only draw icons if the number is small enough to not crash the page
    if (typeof headsValue === 'number') {
        let displayCount = Math.min(headsValue, 50);
        for(let i=0; i < displayCount; i++) {
            icons += "🐉";
        }
        document.getElementById('heads').innerText = icons + (headsValue > 50 ? "..." : "");
    }
}
