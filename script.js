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

const lerp = (a,b,t)=> a + (b-a)*t;
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

const airspeed = { value: 140, target: 140, max: 320 };  
const altitude = { value: 8200, target: 8200, max: 40000 }; 
const heading  = { value: 45, target: 45, max: 360 }; 

setInterval(()=>{

  airspeed.target  = clamp(airspeed.target  + (Math.random()-0.45)*12, 30, airspeed.max);
  altitude.target  = clamp(altitude.target  + (Math.random()-0.5)*400, 0, altitude.max);
  heading.target   = (heading.target + (Math.random()-0.5)*18 + 360) % 360;
}, 1500);

const airCanvas = document.getElementById('airspeedCanvas');
const airCtx = airCanvas.getContext('2d');

function drawAirspeed(ctx, state){
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);

  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.beginPath();
  ctx.arc(0,0,88,0,Math.PI*2);
  ctx.fillStyle = '#041726';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  const start = -Math.PI*0.75, end = Math.PI*0.75;
  const span = end - start;
  const steps = 10;
  for(let i=0;i<=steps;i++){
    const ang = start + (i/steps)*span;
    const inner = 70, outer = 78;
    ctx.beginPath();
    const ix = inner*Math.cos(ang), iy=inner*Math.sin(ang);
    const ox = outer*Math.cos(ang), oy=outer*Math.sin(ang);
    ctx.moveTo(ix,iy);
    ctx.lineTo(ox,oy);
    ctx.stroke();
  }

  const pct = clamp(state.value / state.max, 0, 1);
  const angle = start + pct*span;
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo((outer-10)*Math.cos(angle),(outer-10)*Math.sin(angle));
  ctx.strokeStyle = '#ff5a5a';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.font = '20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(state.value)} kt`, 0, 48);

  const greenEnd = 0.65, amberEnd=0.85;
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.strokeStyle = '#2ecc71';
  ctx.arc(0,0,86, start, start + Math.min(pct, greenEnd)*span);
  ctx.stroke();

  if(pct>greenEnd){
    ctx.beginPath();
    ctx.strokeStyle = '#f1c40f';
    ctx.arc(0,0,86, start + greenEnd*span, start + Math.min(pct, amberEnd)*span);
    ctx.stroke();
  }

  if(pct>amberEnd){
    ctx.beginPath();
    ctx.strokeStyle = '#e74c3c';
    ctx.arc(0,0,86, start + amberEnd*span, start + pct*span);
    ctx.stroke();
  }

  ctx.restore();
}

const altCanvas = document.getElementById('altitudeCanvas');
const altCtx = altCanvas.getContext('2d');

function drawAltitude(ctx, state){
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle = '#031827';
  ctx.fillRect(0,0,w,h);

  const centerY = h/2;
  const pixelsPer100ft = 0.5;
  const value = state.value;

  const step = 100;
  const pxPerStep = pixelsPer100ft * (step/100);

  const ticksOnScreen = Math.ceil(h / pxPerStep) + 4;
  const firstTickValue = Math.floor(value / step) * step - (ticksOnScreen/2)*step;

  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.fillStyle = 'white';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';

  for(let i=0;i<ticksOnScreen;i++){
    const tickVal = firstTickValue + i*step;
    const dy = centerY + ( (tickVal - value) / step ) * pxPerStep;
    if(dy < -20 || dy > h+20) continue;

    if(tickVal % 1000 === 0){
      ctx.fillText(String(Math.round(tickVal/1000)), 6, dy+4);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(44, dy);
      ctx.lineTo(w-6, dy);
      ctx.stroke();
    } else {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w-26, dy);
      ctx.lineTo(w-6, dy);
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#061a2a';
  ctx.fillRect(12, centerY-24, 92, 48);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeRect(12, centerY-24, 92, 48);

  ctx.fillStyle = 'var(--accent, #00b4ff)';
  ctx.font = '18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(value)} ft`, 58, centerY+6);
}

const hdgCanvas = document.getElementById('headingCanvas');
const hdgCtx = hdgCanvas.getContext('2d');

function drawHeading(ctx, state){
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.save();
  ctx.translate(w/2, h/2);

  const radius = 88;

  ctx.beginPath();
  ctx.arc(0,0,radius,0,Math.PI*2);
  ctx.fillStyle = '#021826';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.stroke();

  const headingDeg = state.value;
  const tickCount = 36;
  ctx.save();
  ctx.rotate(-headingDeg * Math.PI/180);

  for(let i=0;i<tickCount;i++){
    const ang = i*(Math.PI*2/tickCount);
    const inner = radius-10, outer = radius-2;
    ctx.beginPath();
    ctx.moveTo(inner*Math.cos(ang), inner*Math.sin(ang));
    ctx.lineTo(outer*Math.cos(ang), outer*Math.sin(ang));
    ctx.lineWidth = (i%3===0)?3:1.2;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.stroke();

    if(i%3===0){
      ctx.save();
      ctx.translate((radius-28)*Math.cos(ang),(radius-28)*Math.sin(ang));
      ctx.rotate(headingDeg * Math.PI/180);
      const label = (360 - (i*10)) % 360;
      const text = label===0? 'N' : label===90? 'E' : label===180? 'S' : label===270? 'W' : String(label);
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, 0, 4);
      ctx.restore();
    }
  }
  ctx.restore();
    
  ctx.beginPath();
  ctx.moveTo(0, -radius + 6);
  ctx.lineTo(-8, -radius + 22);
  ctx.lineTo(8, -radius + 22);
  ctx.closePath();
  ctx.fillStyle = '#ffde59';
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = '18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(headingDeg)}°`, 0, 68);

  ctx.restore();
}

function updateState(dt){

  airspeed.value  = lerp(airspeed.value,  airspeed.target,  0.06);
  altitude.value  = lerp(altitude.value,  altitude.target,  0.06);

  const diff = ((((heading.target - heading.value) % 360) + 540) % 360) - 180;
  heading.value = (heading.value + diff * 0.06 + 360) % 360;
}

let last = performance.now();
function animate(now){
  const dt = now - last;
  last = now;

  updateState(dt);

  drawAirspeed(airCtx, airspeed);
  drawAltitude(altCtx, altitude);
  drawHeading(hdgCtx, heading);

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.gaugeState = { airspeed, altitude, heading };

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
