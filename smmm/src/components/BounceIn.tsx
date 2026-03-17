import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface BounceInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function BounceIn({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = '' 
}: BounceInProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
        duration,
      }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ 
  children, 
  delay = 0, 
  className = '' 
}: BounceInProps) {
  return (
    <motion.div
      className={className}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ 
  children, 
  delay = 0, 
  className = '' 
}: BounceInProps) {
  return (
    <motion.div
      className={className}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInScale({ 
  children, 
  delay = 0, 
  className = '' 
}: BounceInProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
