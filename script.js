// ===== Efek petir di background =====
const canvas = document.getElementById('lightning');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let bolts = [];

function makeBolt() {
  const x = Math.random() * canvas.width;
  const pts = [{ x, y: 0 }];
  let cx = x, cy = 0;
  while (cy < canvas.height * (0.4 + Math.random() * 0.5)) {
    cx += (Math.random() - 0.5) * 70;
    cy += 20 + Math.random() * 35;
    pts.push({ x: cx, y: cy });
  }
  bolts.push({ pts, life: 1 });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bolts.forEach(b => {
    ctx.beginPath();
    b.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = `rgba(160, 220, 255, ${b.life})`;
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 18;
    ctx.lineWidth = 2;
    ctx.stroke();
    b.life -= 0.05;
  });
  bolts = bolts.filter(b => b.life > 0);
  requestAnimationFrame(draw);
}
draw();
setInterval(() => { if (Math.random() < 0.6) makeBolt(); }, 1800);

// ===== Navigasi tab =====
const tabs = ['tab1', 'tab2', 'tab3'].map(id => document.getElementById(id));
const bgVideo = document.getElementById('bgVideo');

// Volume video (0 sampai 1)
const VIDEO_VOLUME = 1;

function showTab(n) {
  tabs.forEach((t, i) => t.classList.toggle('active', i === n));
  document.body.classList.toggle('greeting', n === 2);
  if (n === 2) {
    bgVideo.currentTime = 0;
    bgVideo.muted = false;
    bgVideo.volume = VIDEO_VOLUME;
    bgVideo.play().catch(() => {});
  } else {
    bgVideo.pause();
  }
}

// Tab 1 -> Tab 2
document.getElementById('startBtn').addEventListener('click', () => {
  makeBolt(); makeBolt();
  showTab(1);
});

// Tab 2: pilihan
const warn = document.getElementById('warn');
const narutoBtn = document.getElementById('narutoBtn');
const sasukiBtn = document.getElementById('sasukiBtn');
const card = document.querySelector('.card');

const warnings = [
  'Eits, nggak boleh! Pilih Sasuki aja. 😤',
  'Salah, bro. Yang benar tuh Sasuki! ⚡',
  'Sekali lagi pencet Naruto, petirnya nyambar nih. Pilih Sasuki!'
];
let narutoClicks = 0;

function shakeCard() {
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

narutoBtn.addEventListener('click', () => {
  warn.textContent = warnings[Math.min(narutoClicks, warnings.length - 1)];
  warn.classList.add('bad');
  narutoClicks++;
  shakeCard();
  makeBolt(); makeBolt(); makeBolt();
});

// Tombol Naruto menghindar saat didekati (hanya di perangkat dengan mouse)
narutoBtn.addEventListener('mouseenter', () => {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const dx = (Math.random() - 0.5) * 120;
  const dy = (Math.random() - 0.5) * 60;
  narutoBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

// Tab 2 -> Tab 3 (+ video bersuara)
sasukiBtn.addEventListener('click', () => {
  showTab(2);
  confetti();
});

// Tombol suara video
const videoSoundBtn = document.getElementById('videoSoundBtn');
videoSoundBtn.addEventListener('click', () => {
  bgVideo.muted = !bgVideo.muted;
  videoSoundBtn.textContent = bgVideo.muted ? '🔇 Suara video: mati' : '🔊 Suara video: nyala';
});

// ===== Confetti =====
function confetti() {
  const colors = ['#8b5cf6', '#7dd3fc', '#f0abfc', '#ffffff', '#6366f1'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
    c.style.animationDelay = Math.random() * 0.8 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6500);
  }
}