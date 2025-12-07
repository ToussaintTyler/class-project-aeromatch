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

let index = 0;
let scores = { jet: 0, prop: 0, engineer: 0 };



function renderQuestion() {
    const container = document.getElementById("quiz-screen");

    if (index >= questions.length) return showResult();

    let q = questions[index];
    let percent = Math.floor((index / questions.length) * 100);

    container.innerHTML = `
        <div class="progress-text">${percent}% Complete</div>
        <div class="progress-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>

        <div class="question">${q.q}</div>

        ${q.options.map((opt, i) => `
            <button onclick="select(${i})">${opt}</button>
        `).join("")}
    `;

    setTimeout(() => {
        document.getElementById("progress-bar").style.width = percent + "%";
    }, 50);
}

function select(choice) {
    if (choice === 0) scores.jet++;
    if (choice === 1) scores.prop++;
    if (choice === 2) scores.engineer++;

    index++;
    renderQuestion();
}



function showResult() {
    let result =
        scores.jet > scores.prop && scores.jet > scores.engineer
            ? "🚀 F-16 Fighter Jet — Fast, fearless, built for speed!"
        : scores.prop > scores.jet && scores.prop > scores.engineer
            ? "🛩️ Cessna 172 — Calm, steady, and reliable."
        : "🛠️ Aerospace Engineer — Analytical innovator.";

    document.getElementById("quiz-screen").innerHTML = `
        <div class="result">
            <h3>Your AeroMatch:</h3>
            <p>${result}</p>
        </div>
        <button onclick="location.reload()">Restart Quiz</button>
    `;
}

renderQuestion();



function drawGauge(ctx, value, max, label) {
    const r = 60;
    ctx.clearRect(0, 0, 150, 150);

    ctx.beginPath();
    ctx.arc(75, 75, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();

    const angle = (value / max) * (Math.PI * 1.5) - (Math.PI * 0.75);
    ctx.beginPath();
    ctx.moveTo(75, 75);
    ctx.lineTo(75 + r * Math.cos(angle), 75 + r * Math.sin(angle));
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "14px sans-serif";
    ctx.fillText(label, 50, 140);
}

setInterval(() => {
    drawGauge(airspeedGauge.getContext("2d"), Math.random() * 160, 160, "Airspeed");
    drawGauge(altimeterGauge.getContext("2d"), Math.random() * 10000, 10000, "Altitude");
    drawGauge(compassGauge.getContext("2d"), Math.random() * 360, 360, "Heading");
}, 1000);




async function fetchWeather() {
    const icao = document.getElementById("icaoInput").value.toUpperCase();
    if (!icao) return;

    const url = `https://aviationweather.gov`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById("weatherOutput").textContent =
            JSON.stringify(data[0], null, 2);

    } catch (e) {
        document.getElementById("weatherOutput").textContent = "Error fetching weather.";
    }
}