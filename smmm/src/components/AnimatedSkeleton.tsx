import { motion } from 'motion/react';

interface AnimatedSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function AnimatedSkeleton({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = variant === 'text' ? '1rem' : '4rem',
  count = 1,
}: AnimatedSkeletonProps) {
  const skeletonClass = variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded-md' : 'rounded-lg';

  const Skeleton = () => (
    <motion.div
      className={`bg-gradient-to-r from-white/5 via-white/10 to-white/5 ${skeletonClass} ${className} relative overflow-hidden`}
      style={{ width, height }}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
  );

  if (count === 1) {
    return <Skeleton />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton />
        </motion.div>
      ))}
    </div>
  );
}
