import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Button } from './ui/button';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  glowColor?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  glowColor = '#87ceeb',
  type = 'button',
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className="inline-block"
    >
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        className={`relative overflow-hidden ${className}`}
        disabled={disabled}
        type={type}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        
        {/* Glow pulse effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            boxShadow: `0 0 20px ${glowColor}`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}
