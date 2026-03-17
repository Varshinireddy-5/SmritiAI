import { motion } from 'motion/react';

interface GlowingOrbProps {
  color?: string;
  size?: number;
  className?: string;
  animate?: boolean;
}

export function GlowingOrb({ 
  color = '#87ceeb', 
  size = 200,
  className = '',
  animate = true 
}: GlowingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, ${color}20 40%, transparent 70%)`,
      }}
      animate={animate ? {
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.7, 0.4],
        rotate: [0, 180, 360],
      } : {}}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function OrbCluster() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <GlowingOrb color="#87ceeb" size={300} className="top-[-150px] left-[-150px]" />
      <GlowingOrb color="#a855f7" size={250} className="top-[20%] right-[-100px]" />
      <GlowingOrb color="#00ff88" size={200} className="bottom-[10%] left-[10%]" />
      <GlowingOrb color="#ff006e" size={280} className="bottom-[-140px] right-[20%]" />
    </div>
  );
}
