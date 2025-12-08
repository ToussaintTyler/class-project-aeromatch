const questions = [
    { q: "You prefer flying that feels…", options: ["Fast", "Steady", "Technical"] },
    { q: "Your ideal flight path is…", options: ["Long range", "Short hops", "High altitude"] },
    { q: "Favorite aviation topic?", options: ["Speed", "Safety", "Engineering"] },
    { q: "Pick a cockpit style:", options: ["Digital glass", "Simple analog", "Experimental"] },
    { q: "You value…", options: ["Power", "Efficiency", "Innovation"] },
    { q: "Dream job:", options: ["Pilot", "Flight Attendant", "Aerospace Engineer"] },
    { q: "Your personality is…", options: ["Bold", "Calm", "Analytical"] },
    { q: "Pick a sky:", options: ["Sunset", "Blue sky", "Starry night"] },
    { q: "Choose a sound:", options: ["Jet roar", "Prop hum", "Wind tunnel"] },
    { q: "Your aviation goal:", options: ["Adventure", "Service", "Discovery"] }
];

let currentQuestion = 0;
let scores = { jet: 0, prop: 0, engineer: 0 };

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");

loadQuestion();

function loadQuestion() {
    let q = questions[currentQuestion];
    questionEl.textContent = q.q;
    answersEl.innerHTML = "";

    q.a.forEach((answer) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = () => nextQuestion(answer);
        answersEl.appendChild(btn);
    });

    updateProgress();
}

function nextQuestion(choice) {
    if (choice === questions[currentQuestion].a[0]) score++;

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        showResult();
    } else {
        loadQuestion();
    }
}

function updateProgress() {
    let percent = ((currentQuestion) / questions.length) * 100;
    progressBar.style.width = percent + "%";
    progressText.textContent = Math.floor(percent) + "%";
}

function showResult() {

    let result = "";

    if (scores.jet > scores.prop && scores.jet > scores.engineer) {
        result = "✈️ Airline Commercial Pilot — Bold, fast, and ready for global operations!";
    }
    else if (scores.prop > scores.jet && scores.prop > scores.engineer) {
        result = "🛩️ Private Pilot — Calm, steady, and connected to the pure joy of flying.";
    }
    else {
        result = "🛠️ Aircraft Engineer — Analytical, innovative, and built for problem-solving.";
    }

    document.getElementById("quiz-screen").innerHTML = `
        <div class="result">
            <h3>Your AeroMatch:</h3>
            <p>${result}</p>
        </div>
        <button onclick="location.reload()">Restart Quiz</button>
    `;
}

function drawGauge(canvasId, label, value, max, color) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 250, 250);

    let center = 125;
    let radius = 110;

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#111";
    ctx.fill();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for (let i = 0; i <= max; i += max / 20) {
        let angle = (i / max) * Math.PI * 1.5 - Math.PI * 0.75;
        let x1 = center + Math.cos(angle) * radius;
        let y1 = center + Math.sin(angle) * radius;
        let x2 = center + Math.cos(angle) * (radius - 15);
        let y2 = center + Math.sin(angle) * (radius - 15);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    let angle = (value / max) * Math.PI * 1.5 - Math.PI * 0.75;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + Math.cos(angle) * (radius - 20),
               center + Math.sin(angle) * (radius - 20));
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(label, center, 230);
    ctx.fillText(value, center, 200);
}

setInterval(() => {
    drawGauge("airspeedGauge", "Airspeed (kts)", 320, 500, "#00aaff");
    drawGauge("altitudeGauge", "Altitude (ft)", 28000, 40000, "#00ff99");
    drawGauge("headingGauge", "Heading (°)", 270, 360, "#ffcc00");
}, 2000);
