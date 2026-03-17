import { motion } from 'motion/react';

interface ShimmerTextProps {
  text: string;
  className?: string;
  shimmerColor?: string;
}

export function ShimmerText({ 
  text, 
  className = '', 
  shimmerColor = '#87ceeb' 
}: ShimmerTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.div
        className="absolute inset-0 z-20"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor}80 50%, transparent 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}
