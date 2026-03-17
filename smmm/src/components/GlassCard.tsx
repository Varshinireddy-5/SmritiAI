import React, { useState } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  neonColor?: 'cyan' | 'purple' | 'pink' | 'green';
}

export function GlassCard({ children, className = '', onClick, neonColor = 'cyan' }: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const neonColors = {
    cyan: {
      border: 'rgba(135, 206, 235, 0.3)',
      hoverBorder: '#87ceeb',
      hoverShadow: '0 0 30px rgba(135,206,235,0.5), 0 0 50px rgba(135,206,235,0.3)',
      innerGlow: 'inset 0 0 30px rgba(135,206,235,0.05)',
      gradient: 'rgba(135, 206, 235, 0.1)',
    },
    purple: {
      border: 'rgba(212, 165, 255, 0.3)',
      hoverBorder: '#d4a5ff',
      hoverShadow: '0 0 30px rgba(212,165,255,0.5), 0 0 50px rgba(212,165,255,0.3)',
      innerGlow: 'inset 0 0 30px rgba(212,165,255,0.05)',
      gradient: 'rgba(212, 165, 255, 0.1)',
    },
    pink: {
      border: 'rgba(255, 0, 110, 0.3)',
      hoverBorder: '#ff006e',
      hoverShadow: '0 0 30px rgba(255,0,110,0.5), 0 0 50px rgba(255,0,110,0.3)',
      innerGlow: 'inset 0 0 30px rgba(255,0,110,0.05)',
      gradient: 'rgba(255, 0, 110, 0.1)',
    },
    green: {
      border: 'rgba(0, 255, 136, 0.3)',
      hoverBorder: '#00ff88',
      hoverShadow: '0 0 30px rgba(0,255,136,0.5), 0 0 50px rgba(0,255,136,0.3)',
      innerGlow: 'inset 0 0 30px rgba(0,255,136,0.05)',
      gradient: 'rgba(0, 255, 136, 0.1)',
    },
  };

  const colors = neonColors[neonColor];

  return (
    <motion.div
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer' : ''} ${className} relative overflow-hidden`}
      style={{
        background: 'rgba(15, 30, 50, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isHovered ? colors.hoverBorder : colors.border}`,
        borderRadius: '1rem',
        boxShadow: isHovered 
          ? `${colors.hoverShadow}, ${colors.innerGlow}`
          : `0 0 15px rgba(135, 206, 235, 0.1), ${colors.innerGlow}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -3, 
        scale: 1.01,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors.gradient}, transparent 50%)`,
        }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.gradient}, transparent)`,
        }}
        animate={isHovered ? {
          x: ['-100%', '100%'],
          opacity: [0, 0.5, 0],
        } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}