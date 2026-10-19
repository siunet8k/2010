/**
 * Vy's Little Planet - Interactive Journey Experience
 * Author: Expert Frontend Developer & Creative Coder
 */

// ==========================================
// 1. STATE & GLOBAL CONFIGURATION
// ==========================================
let currentPhase = 1;
const totalPhases = 4;
let audioPlaying = false;
let audioContext = null;

// ==========================================
// 2. CANVAS COSMIC STARFIELD & SHOOTING STARS
// ==========================================
const cosmicCanvas = document.getElementById('cosmic-canvas');
const ctx = cosmicCanvas.getContext('2d');

let stars = [];
let shootingStars = [];
let width = (cosmicCanvas.width = window.innerWidth);
let height = (cosmicCanvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = cosmicCanvas.width = window.innerWidth;
  height = cosmicCanvas.height = window.innerHeight;
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
  initStars();
});

function initStars() {
  stars = [];
  const starCount = Math.floor((width * height) / 3200);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: ['#ffffff', '#bb86fc', '#03dac6', '#ff7597'][Math.floor(Math.random() * 4)]
    });
  }
}

function spawnShootingStar() {
  if (shootingStars.length < 2 && Math.random() < 0.015) {
    shootingStars.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * (height * 0.4),
      length: Math.random() * 90 + 50,
      speed: Math.random() * 7 + 5,
      angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
      life: 1
    });
  }
}

function renderCosmicScene() {
  ctx.clearRect(0, 0, width, height);

  // Render Twinkling Stars
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.alpha += s.speed * s.direction;
    if (s.alpha >= 1) { s.alpha = 1; s.direction = -1; }
    else if (s.alpha <= 0.15) { s.alpha = 0.15; s.direction = 1; }

    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Render Shooting Stars
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    const endX = ss.x + Math.cos(ss.angle) * ss.length;
    const endY = ss.y + Math.sin(ss.angle) * ss.length;

    const grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
    grad.addColorStop(0.6, `rgba(187, 134, 252, ${ss.life * 0.6})`);
    grad.addColorStop(1, 'rgba(3, 218, 198, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.life -= 0.016;

    if (ss.life <= 0 || ss.x > width || ss.y > height) {
      shootingStars.splice(i, 1);
    }
  }

  requestAnimationFrame(renderCosmicScene);
}

// ==========================================
// 3. FULLSCREEN PARTICLE EXPLOSION (VIRTUAL HUG)
// ==========================================
const fxCanvas = document.getElementById('fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
fxCanvas.width = window.innerWidth;
fxCanvas.height = window.innerHeight;

let fxParticles = [];

class HugParticle {
  constructor(originX, originY) {
    this.x = originX;
    this.y = originY;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 1;
    this.gravity = 0.06;
    this.friction = 0.985;
    this.alpha = 1;
    this.scale = Math.random() * 0.8 + 0.6;
    this.rotation = Math.random() * Math.PI;
    this.rotSpeed = (Math.random() - 0.5) * 0.08;
    this.isHeart = Math.random() > 0.35;
    this.color = ['#ff7597', '#ff8da9', '#ffd166', '#ffffff', '#bb86fc'][Math.floor(Math.random() * 5)];
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= 0.009;
  }

  draw(context) {
    context.save();
    context.globalAlpha = Math.max(0, this.alpha);
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scale, this.scale);

    if (this.isHeart) {
      // Draw Heart Path
      context.fillStyle = this.color;
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(-10, -10, -18, 5, 0, 18);
      context.bezierCurveTo(18, 5, 10, -10, 0, 0);
      context.fill();
    } else {
      // Draw glowing light spark
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(0, 0, 4, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
}

function triggerHeartExplosion() {
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 2;
  for (let i = 0; i < 90; i++) {
    fxParticles.push(new HugParticle(originX, originY));
  }
}

function renderFxScene() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  for (let i = fxParticles.length - 1; i >= 0; i--) {
    const p = fxParticles[i];
    p.update();
    p.draw(fxCtx);
    if (p.alpha <= 0) {
      fxParticles.splice(i, 1);
    }
  }
  requestAnimationFrame(renderFxScene);
}

// ==========================================
// 4. PHASE NAVIGATION & STORY FLOW
// ==========================================
function goToPhase(targetPhase) {
  if (targetPhase < 1 || targetPhase > totalPhases || targetPhase === currentPhase) return;

  const currentSection = document.getElementById(`phase-${currentPhase}`);
  const targetSection = document.getElementById(`phase-${targetPhase}`);

  // Animation via GSAP
  if (typeof gsap !== 'undefined') {
    gsap.to(currentSection, {
      opacity: 0,
      y: -20,
      scale: 0.98,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        currentSection.classList.remove('active');
        targetSection.classList.add('active');

        gsap.fromTo(
          targetSection,
          { opacity: 0, y: 25, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power2.out' }
        );
      }
    });
  } else {
    currentSection.classList.remove('active');
    targetSection.classList.add('active');
  }

  currentPhase = targetPhase;
  updateIndicators();
}

function updateIndicators() {
  const dots = document.querySelectorAll('.indicator-dot');
  dots.forEach((dot, index) => {
    if (index + 1 === currentPhase) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// ==========================================
// 5. INTERACTION: MODAL & VIRTUAL HUG
// ==========================================
const wishModal = document.getElementById('wish-modal');
const btnTriggerWish = document.getElementById('btn-trigger-wish');
const closeWishModalBtn = document.getElementById('close-wish-modal');
const btnTriggerHug = document.getElementById('btn-trigger-hug');
const hugBanner = document.getElementById('hug-banner');

btnTriggerWish.addEventListener('click', () => {
  wishModal.classList.add('open');
});

function closeWishModal() {
  wishModal.classList.remove('open');
}

closeWishModalBtn.addEventListener('click', closeWishModal);

wishModal.addEventListener('click', (e) => {
  if (e.target === wishModal) closeWishModal();
});

btnTriggerHug.addEventListener('click', () => {
  triggerHeartExplosion();
  hugBanner.classList.add('show');
  playHarmonicTone(); // plays sweet chime
});

function dismissHugBanner() {
  hugBanner.classList.remove('show');
}

// Keyboard ESC to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWishModal();
    dismissHugBanner();
  }
});

// ==========================================
// 6. AUDIO & HARMONIC FALLBACK (WEB AUDIO API)
// ==========================================
const bgAudio = document.getElementById('bg-audio');
const musicBtn = document.getElementById('music-btn');
const audioWaves = document.getElementById('audio-waves');
const musicIcon = document.getElementById('music-icon');

function toggleMusic() {
  if (!audioPlaying) {
    bgAudio.play().then(() => {
      audioPlaying = true;
      audioWaves.classList.add('playing');
      musicIcon.textContent = '💖';
    }).catch(() => {
      // Fallback: If external source is blocked, use Web Audio synthesiser
      initWebAudioSynth();
      audioPlaying = true;
      audioWaves.classList.add('playing');
      musicIcon.textContent = '✨';
    });
  } else {
    bgAudio.pause();
    if (ambientSynthInterval) clearInterval(ambientSynthInterval);
    audioPlaying = false;
    audioWaves.classList.remove('playing');
    musicIcon.textContent = '🎵';
  }
}

musicBtn.addEventListener('click', toggleMusic);

// Peaceful Ambient Synthesizer Fallback
let ambientSynthInterval = null;
function initWebAudioSynth() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C

  function playChime() {
    if (!audioPlaying) return;
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 4);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 4.2);
  }

  playChime();
  ambientSynthInterval = setInterval(playChime, 2400);
}

function playHarmonicTone() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.8);
  } catch (err) {
    // Graceful no-op if audio context is not yet enabled
  }
}

// ==========================================
// 7. INITIALIZATION ON DOM CONTENT LOADED
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  renderCosmicScene();
  renderFxScene();

  // Subtle interactive 3D tilt effect on desktop
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(800px) rotateX(${-y * 0.05}deg) rotateY(${x * 0.05}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // Touch Swipe navigation support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 70) {
      if (diff < 0 && currentPhase < totalPhases) {
        goToPhase(currentPhase + 1); // Swipe left -> next phase
      } else if (diff > 0 && currentPhase > 1) {
        goToPhase(currentPhase - 1); // Swipe right -> prev phase
      }
    }
  }
});