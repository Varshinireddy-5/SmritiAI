import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const particles: Particle[] = [];
    const particleCount = 60;

    class Particle {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      distance: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * (Math.max(width, height) / 2);
        this.speed = 0.002 + Math.random() * 0.005;
        this.radius = Math.random() * 3 + 1;
        const colors = ['#00d4ff', '#b45aff', '#ff006e', '#39ff14'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.angle += this.speed;
        this.x = width / 2 + Math.cos(this.angle) * this.distance;
        this.y = height / 2 + Math.sin(this.angle) * this.distance;
        
        // Perspective effect (optional)
        // this.radius = (this.y / height) * 3 + 1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Nebular Clouds
    const blobs: Blob[] = [];
    
    class Blob {
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;
        color: string;
        
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 200 + 100;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            const colors = ['rgba(0, 212, 255, 0.05)', 'rgba(180, 90, 255, 0.05)', 'rgba(255, 0, 110, 0.03)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
        }
        
        draw() {
            if (!ctx) return;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 5; i++) {
        blobs.push(new Blob());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw dark background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Draw Blobs
      blobs.forEach(blob => {
          blob.update();
          blob.draw();
      });

      // Draw Spiral Particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Connect nearby particles for web effect (optional, maybe too busy for "spiral")
      // Let's keep it clean spiral for now.

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]/80" />
    </motion.div>
  );
}
