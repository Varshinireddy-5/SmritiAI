import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  color?: string;
  size?: number;
  className?: string;
  animate?: 'pulse' | 'bounce' | 'spin' | 'wiggle' | 'float' | 'none';
  glowColor?: string;
  onClick?: () => void;
}

export function AnimatedIcon({
  icon: Icon,
  color = '#87ceeb',
  size = 24,
  className = '',
  animate = 'none',
  glowColor,
  onClick,
}: AnimatedIconProps) {
  const glowStyle = glowColor || color;

  const animations = {
    pulse: {
      animate: {
        scale: [1, 1.2, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    bounce: {
      animate: {
        y: [0, -10, 0],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    spin: {
      animate: {
        rotate: [0, 360],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
    wiggle: {
      animate: {
        rotate: [0, 10, -10, 10, 0],
      },
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeInOut',
      },
    },
    float: {
      animate: {
        y: [0, -5, 0],
        x: [0, 2, 0],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    none: {
      animate: {},
      transition: {},
    },
  };

  const animationProps = animations[animate];

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.1 } : {}}
      whileTap={onClick ? { scale: 0.9 } : {}}
    >
      <motion.div
        className="relative"
        {...animationProps}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            filter: 'blur(8px)',
            opacity: 0.5,
          }}
          animate={{
            boxShadow: [
              `0 0 10px ${glowStyle}`,
              `0 0 20px ${glowStyle}`,
              `0 0 10px ${glowStyle}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon size={size} color={color} />
        </motion.div>

        {/* Main icon */}
        <Icon size={size} color={color} className="relative" />
      </motion.div>
    </motion.div>
  );
}
