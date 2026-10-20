/**
 * HAPPY 20.10 FOR "DỢ HÚIIII" - CLEAN & ELEGANT EDITION
 * Interactive Real Photo Card with "Tình Cờ Yêu Em" Soundtrack
 */

// State
let isPlaying = false;
let ytPlayer = null;
let ytReady = false;
let audioCtx = null;

// ==========================================
// 1. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initMagicCanvas();
  initMusicPlayer();
  initCardInteractions();
});

// YouTube Iframe API Callback
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: 'KSe4k0WrpjY', // "Tình Cờ Yêu Em" - Kuun Đức Nam ft. Linh Thộn
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: 'KSe4k0WrpjY'
    },
    events: {
      onReady: () => {
        ytReady = true;
      }
    }
  });
};

// ==========================================
// 2. MUSIC PLAYER ("TÌNH CỜ YÊU EM")
// ==========================================
function initMusicPlayer() {
  const musicPill = document.getElementById('music-pill');
  if (!musicPill) return;

  musicPill.addEventListener('click', () => {
    toggleMusic();
  });
}

function toggleMusic() {
  const musicPill = document.getElementById('music-pill');
  const musicStatus = document.getElementById('music-status');
  const localAudio = document.getElementById('local-audio');

  isPlaying = !isPlaying;

  if (isPlaying) {
    musicPill.classList.add('playing');
    musicStatus.textContent = 'Đang phát: Tình Cờ Yêu Em 🎵';

    // Try local audio first if available, otherwise use YouTube player
    let localPlayed = false;
    if (localAudio && localAudio.src) {
      localAudio.play()
        .then(() => { localPlayed = true; })
        .catch(() => { localPlayed = false; });
    }

    // If local audio is not active or failed, play YouTube
    setTimeout(() => {
      if (!localPlayed && ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
      }
    }, 200);

    // Audio chime feedback
    playSweetChime();
    fireHeartBurst();
  } else {
    musicPill.classList.remove('playing');
    musicStatus.textContent = 'Bấm để phát nhạc 🎵';

    if (localAudio) localAudio.pause();
    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      ytPlayer.pauseVideo();
    }
  }
}

// ==========================================
// 3. CARD & PHOTO INTERACTIONS
// ==========================================
function initCardInteractions() {
  const cardArt = document.getElementById('card-art');
  const wishBox = document.getElementById('wish-box');
  const loveCard = document.getElementById('love-card');

  // Clicking on photo or wish box launches hearts
  function triggerLoveReaction(e) {
    e.stopPropagation();
    fireHeartBurst();
    playSweetChime();

    // Auto-start music if not playing yet
    if (!isPlaying) {
      toggleMusic();
    }
  }

  if (cardArt) cardArt.addEventListener('click', triggerLoveReaction);
  if (wishBox) wishBox.addEventListener('click', triggerLoveReaction);

  // Gentle 3D tilt effect on card mousemove (Desktop)
  if (loveCard && window.innerWidth > 768) {
    loveCard.addEventListener('mousemove', (e) => {
      const rect = loveCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -6;
      const tiltY = (x / rect.width) * 6;
      loveCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    loveCard.addEventListener('mouseleave', () => {
      loveCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

// Gentle Heart Burst Confetti
function fireHeartBurst() {
  if (typeof confetti !== 'function') return;

  confetti({
    particleCount: 35,
    spread: 75,
    origin: { y: 0.5 },
    colors: ['#ff1461', '#ff758c', '#ffd166', '#ffffff']
  });
}

// ==========================================
// 4. SOUND EFFECTS & CHIMES (WEB AUDIO API)
// ==========================================
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSweetChime() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.3);
    }, idx * 100);
  });
}

function playTone(freq, duration = 0.2) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch (e) {
    // Silently continue if audio context is blocked
  }
}

// ==========================================
// 5. MAGIC CANVAS: FALLING PETALS & MOUSE TRAIL
// ==========================================
function initMagicCanvas() {
  const canvas = document.getElementById('magic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Falling particles
  const particles = [];
  const particleCount = 26;

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(width, height, true));
  }

  // Interactive mouse/touch trail
  const trail = [];
  function addTrail(x, y) {
    if (Math.random() < 0.4) {
      trail.push({
        x: x,
        y: y,
        size: Math.random() * 6 + 4,
        alpha: 1,
        color: ['#ff758c', '#ffd166', '#ff4b72', '#ffffff'][Math.floor(Math.random() * 4)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.6
      });
    }
  }

  window.addEventListener('mousemove', (e) => addTrail(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      addTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Falling particles
    for (let p of particles) {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * p.speedX;
      p.angle += p.angleSpeed;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        Object.assign(p, createParticle(width, height, false));
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;

      if (p.type === 'heart') {
        drawHeart(ctx, 0, 0, p.size, p.color);
      } else {
        drawPetal(ctx, 0, 0, p.size, p.color);
      }

      ctx.restore();
    }

    // Mouse sparkles trail
    for (let i = trail.length - 1; i >= 0; i--) {
      const s = trail[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.022;

      if (s.alpha <= 0) {
        trail.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function createParticle(w, h, initialRandomY) {
  const isHeart = Math.random() < 0.35;
  return {
    x: Math.random() * w,
    y: initialRandomY ? Math.random() * h : -25,
    size: Math.random() * 10 + 7,
    speedY: Math.random() * 1.0 + 0.6,
    speedX: Math.random() * 0.7 + 0.3,
    angle: Math.random() * Math.PI * 2,
    angleSpeed: Math.random() * 0.02 + 0.01,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.03,
    alpha: Math.random() * 0.5 + 0.3,
    type: isHeart ? 'heart' : 'petal',
    color: isHeart
      ? (Math.random() < 0.6 ? '#ff6b8b' : '#ff4b72')
      : (Math.random() < 0.5 ? '#ffb3c6' : '#ffe5ec')
  };
}

function drawPetal(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.55, Math.PI / 4, 0, 2 * Math.PI);
  ctx.fill();
}

function drawHeart(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  const d = size * 0.5;
  ctx.moveTo(x, y + d * 0.7);
  ctx.bezierCurveTo(x, y, x - d, y, x - d, y - d * 0.5);
  ctx.bezierCurveTo(x - d, y - d * 1.2, x, y - d * 1.2, x, y - d * 0.5);
  ctx.bezierCurveTo(x, y - d * 1.2, x + d, y - d * 1.2, x + d, y - d * 0.5);
  ctx.bezierCurveTo(x + d, y, x, y, x, y + d * 0.7);
  ctx.fill();
}
