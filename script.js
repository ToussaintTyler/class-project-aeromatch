const questions = [
    { q: "Do you prefer high-speed aircraft or slow/stable ones?", a: ["High Speed", "Stable"] },
    { q: "Would you rather fly solo or with a crew?", a: ["Solo", "With crew"] },
    { q: "Do you enjoy complex systems?", a: ["Yes", "No"] },
    { q: "Do you prefer long flights or short hops?", a: ["Long", "Short"] },
    { q: "What motivates you most?", a: ["Adventure", "Precision"] },
    { q: "Pick a sky:", a: ["Clear Blue", "Stormy Challenge"] },
    { q: "Pick a role:", a: ["Pilot", "Engineer"] },
    { q: "Pick a mission:", a: ["Passenger Flight", "Cargo"] },
    { q: "Pick a style:", a: ["Modern Glass Cockpit", "Classic Analog"] },
    { q: "Pick a future path:", a: ["Commercial", "Military"] }
];

let currentQuestion = 0;
let score = 0;

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
    document.getElementById("quiz-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");

    if (score > 7) resultText.textContent = "You are a Boeing 787 Dreamliner — modern, efficient, and built for long-haul!";
    else if (score > 4) resultText.textContent = "You are a Boeing 737 — reliable, balanced, a perfect all-rounder!";
    else resultText.textContent = "You are a Cessna 172 — calm, stable, and perfect for training!";
}

document.getElementById("getWeatherBtn").onclick = async () => {
    let icao = document.getElementById("icaoInput").value.toUpperCase();

    if (!icao) return;

    let url = `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`;

    let res = await fetch(url);
    let data = await res.json();

    if (data && data[0]) {
        document.getElementById("weatherOutput").textContent = data[0].rawOb;
    } else {
        document.getElementById("weatherOutput").textContent = "No METAR found.";
    }
};

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
