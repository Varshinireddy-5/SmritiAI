import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedProgressProps {
  value: number; // 0-100
  className?: string;
  barColor?: string;
  backgroundColor?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export function AnimatedProgress({
  value,
  className = '',
  barColor = '#87ceeb',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  height = '8px',
  showLabel = false,
  animated = true,
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Progress</span>
          <motion.span
            className="text-sm font-black text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            key={displayValue}
          >
            {Math.round(displayValue)}%
          </motion.span>
        </div>
      )}
      
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor,
        }}
      >
        {/* Background shimmer */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
        
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full relative overflow-hidden"
          style={{
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}80, 0 0 20px ${barColor}40`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{
            duration: 1,
            ease: 'easeOut',
            type: 'spring',
            stiffness: 50,
            damping: 15,
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
