import { ReactNode, useState } from 'react';
import { motion } from 'motion/react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  flipOnHover?: boolean;
  flipOnClick?: boolean;
}

export function FlipCard({
  front,
  back,
  className = '',
  flipOnHover = false,
  flipOnClick = true,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (flipOnClick) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleHover = (hover: boolean) => {
    if (flipOnHover) {
      setIsFlipped(hover);
    }
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
      >
        {/* Front */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </div>
  );
}
