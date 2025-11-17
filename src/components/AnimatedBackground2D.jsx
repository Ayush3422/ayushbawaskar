import { useEffect, useRef } from 'react';

/**
 * Fallback 2D background with similar visual effect
 * Use this if 3D backgrounds cause issues
 */
const AnimatedBackground2D = ({ variant = 'neural' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const connections = [];

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particleCount = variant === 'grid' ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 60 + 180, // Cyan to purple range
      });
    }

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      if (variant === 'neural' || variant === 'full') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const opacity = (1 - distance / 150) * 0.3;
              ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw and update particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw grid effect
      if (variant === 'grid' || variant === 'full' || variant === 'dataflow') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.lineWidth = 1;

        const gridSize = 50;
        const time = Date.now() * 0.0005;

        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          for (let y = 0; y < canvas.height; y += gridSize) {
            const wave = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time) * 5;
            if (y === 0) {
              ctx.moveTo(x, y + wave);
            } else {
              ctx.lineTo(x, y + wave);
            }
          }
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      style={{ background: 'transparent' }}
    />
  );
};

export default AnimatedBackground2D;
