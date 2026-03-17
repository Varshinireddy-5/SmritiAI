import { motion } from 'motion/react';

export function AnimatedBackground() {
  // Generate random positions and colors for floating orbs - Enhanced with more glow
  const orbs = [
    { size: 320, color: 'rgba(135, 206, 235, 0.2)', x: '10%', y: '20%', duration: 20, glow: 'rgba(135, 206, 235, 0.4)' },
    { size: 270, color: 'rgba(168, 85, 247, 0.15)', x: '80%', y: '60%', duration: 25, glow: 'rgba(168, 85, 247, 0.3)' },
    { size: 240, color: 'rgba(255, 0, 110, 0.12)', x: '50%', y: '80%', duration: 22, glow: 'rgba(255, 0, 110, 0.35)' },
    { size: 300, color: 'rgba(0, 255, 136, 0.12)', x: '70%', y: '30%', duration: 28, glow: 'rgba(0, 255, 136, 0.3)' },
    { size: 240, color: 'rgba(255, 166, 0, 0.15)', x: '30%', y: '50%', duration: 24, glow: 'rgba(255, 166, 0, 0.3)' },
    { size: 200, color: 'rgba(0, 217, 255, 0.15)', x: '85%', y: '15%', duration: 26, glow: 'rgba(0, 217, 255, 0.35)' },
    { size: 260, color: 'rgba(212, 165, 255, 0.12)', x: '15%', y: '70%', duration: 27, glow: 'rgba(212, 165, 255, 0.3)' },
    { size: 220, color: 'rgba(255, 107, 157, 0.1)', x: '90%', y: '40%', duration: 23, glow: 'rgba(255, 107, 157, 0.3)' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            boxShadow: `0 0 80px ${orb.glow}, 0 0 120px ${orb.glow}`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.6, 0.9, 0.5, 0.6],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Floating particles - Enhanced with glow */}
      {Array.from({ length: 50 }).map((_, i) => {
        const colors = [
          { bg: 'rgba(135, 206, 235, 0.8)', shadow: 'rgba(135, 206, 235, 1)' },
          { bg: 'rgba(168, 85, 247, 0.7)', shadow: 'rgba(168, 85, 247, 1)' },
          { bg: 'rgba(255, 0, 110, 0.6)', shadow: 'rgba(255, 0, 110, 1)' },
          { bg: 'rgba(0, 255, 136, 0.7)', shadow: 'rgba(0, 255, 136, 1)' },
          { bg: 'rgba(255, 166, 0, 0.6)', shadow: 'rgba(255, 166, 0, 1)' },
        ];
        const color = colors[i % colors.length];
        const size = Math.random() > 0.5 ? 'w-1 h-1' : 'w-1.5 h-1.5';
        
        return (
          <motion.div
            key={`particle-${i}`}
            className={`absolute ${size} rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: color.bg,
              boxShadow: `0 0 4px ${color.shadow}, 0 0 8px ${color.shadow}`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Gradient mesh overlay - Enhanced */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 0, 110, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 10% 80%, rgba(0, 255, 136, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 90% 20%, rgba(255, 166, 0, 0.15) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(135, 206, 235, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(135, 206, 235, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
