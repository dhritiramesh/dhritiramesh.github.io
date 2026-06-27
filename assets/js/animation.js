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
    radius: 150
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
  const particleCount = 42;

  class Particle {

    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;

      this.radius = 2 + Math.random() * 2.5;
    }

    update() {

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      if (mouse.x !== null) {

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          this.x -= dx * 0.0025;
          this.y -= dy * 0.0025;
        }
      }
    }

    draw() {

      ctx.beginPath();

      ctx.fillStyle = "rgba(200,162,200,0.95)";

      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(200,162,200,0.7)";

      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      ctx.fill();

      ctx.shadowBlur = 0;
    }

  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {

    const maxDistance = 150;

    for (let a = 0; a < particles.length; a++) {

      for (let b = a + 1; b < particles.length; b++) {

        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {

          const opacity = 1 - distance / maxDistance;

          ctx.beginPath();

          ctx.strokeStyle = `rgba(200,162,200,${opacity * 0.22})`;

          ctx.lineWidth = 1;

          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);

          ctx.stroke();

        }

      }

    }

  }

  function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connectParticles();

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);

  }

  animate();

}
