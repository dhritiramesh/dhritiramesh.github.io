// ===============================
// Typing Animation
// ===============================

const nameElement = document.querySelector(".animated-name");

if (nameElement) {
  const nameText = nameElement.textContent;
  nameElement.textContent = "";

  let i = 0;

  function typeName() {
    if (i < nameText.length) {
      nameElement.textContent += nameText.charAt(i);
      i++;
      setTimeout(typeName, 110);
    }
  }

  typeName();
}


// ===============================
// Animated Neural Network
// ===============================

// ===============================
// Animated Neural Network
// ===============================

const canvas = document.getElementById("network-canvas");

if (canvas) {

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const mouse = {
    x: null,
    y: null,
    radius: 170
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particles = [];

  const SMALL = 34;
  const MEDIUM = 10;
  const LARGE = 3;

  class Particle {

  constructor(type) {

    this.type = type;

    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    if (type === "large") {

      this.baseRadius = 4.8 + Math.random();
      this.speed = 0.16;
      this.glow = 22;

    } else if (type === "medium") {

      this.baseRadius = 3 + Math.random() * 0.8;
      this.speed = 0.22;
      this.glow = 15;

    } else {

      this.baseRadius = 1.8 + Math.random() * 0.8;
      this.speed = 0.30;
      this.glow = 10;

    }

    this.radius = this.baseRadius;

    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;

    this.phase = Math.random() * Math.PI * 2;
  }

update(time) {

  this.x += this.vx;
  this.y += this.vy;

  // Screen wrap
  if (this.x < -5) this.x = canvas.width + 5;
  if (this.x > canvas.width + 5) this.x = -5;

  if (this.y < -5) this.y = canvas.height + 5;
  if (this.y > canvas.height + 5) this.y = -5;

  // Slight organic drift for hub nodes
  if (this.type === "large") {
    this.x += Math.sin(time * 0.00035 + this.phase) * 0.12;
    this.y += Math.cos(time * 0.00035 + this.phase) * 0.12;
  }

  // Mouse interaction
  if (mouse.x !== null) {

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {

      const force = (mouse.radius - dist) / mouse.radius;

      this.x += dx * force * 0.004;
      this.y += dy * force * 0.004;
    }
  }

  // Breathing effect
  this.radius =
    this.baseRadius +
    Math.sin(time * 0.0014 + this.phase) * 0.25;
}

  draw() {

    ctx.beginPath();

    if (this.type === "large") {
      ctx.fillStyle = "rgba(220,190,255,1)";
    } else if (this.type === "medium") {
      ctx.fillStyle = "rgba(210,180,240,0.95)";
    } else {
      ctx.fillStyle = "rgba(200,162,200,0.9)";
    }

    ctx.shadowBlur = this.glow;
    ctx.shadowColor = "rgba(200,162,200,0.85)";

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fill();

    ctx.shadowBlur = 0;
  }

}

  for (let i = 0; i < SMALL; i++) {
    particles.push(new Particle("small"));
}

for (let i = 0; i < MEDIUM; i++) {
    particles.push(new Particle("medium"));
}

for (let i = 0; i < LARGE; i++) {
    particles.push(new Particle("large"));
}

function connectParticles() {

  for (let i = 0; i < particles.length; i++) {

    for (let j = i + 1; j < particles.length; j++) {

      let maxDistance = 155;

      if (
        particles[i].type === "large" ||
        particles[j].type === "large"
      ) {
        maxDistance = 215;
      }
      else if (
        particles[i].type === "medium" ||
        particles[j].type === "medium"
      ) {
        maxDistance = 180;
      }

      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance) {

        const opacity = (1 - dist / maxDistance) * 0.18;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(200,162,200,${opacity})`;
        ctx.lineWidth = 1;

        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);

        ctx.stroke();
      }
    }
  }
}

  function drawCursorConnections() {

    if (mouse.x === null) return;

    // Cursor glow
    const gradient = ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      24
    );

    gradient.addColorStop(0, "rgba(200,162,200,0.8)");
    gradient.addColorStop(1, "rgba(200,162,200,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Cursor node
    ctx.beginPath();
    ctx.fillStyle = "#E8D4F0";
    ctx.arc(mouse.x, mouse.y, 3.2, 0, Math.PI * 2);
    ctx.fill();

    particles.forEach((particle) => {

      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {

        const opacity = (1 - dist / mouse.radius) * 0.55;

        ctx.beginPath();

        ctx.strokeStyle = `rgba(200,162,200,${opacity})`;

        ctx.lineWidth = 1.2;

        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(particle.x, particle.y);

        ctx.stroke();
      }

    });
  }

function animate(time) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update(time);
  });

  connectParticles();

  particles.forEach((particle) => {
    particle.draw();
  });

  drawCursorConnections();

  requestAnimationFrame(animate);
}

  animate(0);

}
