import { motion } from 'motion/react';

interface PulseBeamProps {
  color?: string;
  delay?: number;
}

export function PulseBeam({ color = '#87ceeb', delay = 0 }: PulseBeamProps) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
