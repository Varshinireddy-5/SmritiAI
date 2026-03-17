import { useState, useRef } from 'react';
import { Calendar, Filter, Play, ChevronRight, Zap, Activity, Clock } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'motion/react';

// Types for our data
interface TimelineEvent {
  id: number;
  date: string;
  year: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  hasAudio: boolean;
  color: string;
  icon?: React.ReactNode;
}

export function Timeline() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll progress for the main line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const categories = [
    { id: 'all', label: 'All', color: '#ffffff' },
    { id: 'health', label: 'Health', color: '#ff006e' },
    { id: 'finance', label: 'Finance', color: '#39ff14' },
    { id: 'government', label: 'Government', color: '#b45aff' },
    { id: 'family', label: 'Family', color: '#00d4ff' },
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      date: 'Feb 1',
      year: '2026',
      category: 'health',
      title: 'Blood Pressure Checkup',
      description: 'Visited Dr. Sharma at City Hospital. BP reading: 130/85. Prescribed new medication.',
      confidence: 95,
      hasAudio: true,
      color: '#ff006e',
      icon: <Activity />
    },
    {
      id: 2,
      date: 'Jan 28',
      year: '2026',
      category: 'finance',
      title: 'Pension Payment Received',
      description: 'Monthly pension of ₹5,000 credited to bank account.',
      confidence: 98,
      hasAudio: false,
      color: '#39ff14',
      icon: <Zap />
    },
    {
      id: 3,
      date: 'Jan 25',
      year: '2026',
      category: 'government',
      title: 'Ration Card Renewal',
      description: 'Submitted documents at local office for ration card renewal. Expected completion in 15 days.',
      confidence: 92,
      hasAudio: true,
      color: '#b45aff',
      icon: <Clock />
    },
    {
      id: 4,
      date: 'Jan 20',
      year: '2026',
      category: 'family',
      title: 'Daughter\'s School Admission',
      description: 'Completed admission process at St. Mary\'s School. Paid first term fee of ₹3,500.',
      confidence: 97,
      hasAudio: false,
      color: '#00d4ff',
      icon: <Calendar />
    },
    {
      id: 5,
      date: 'Jan 15',
      year: '2026',
      category: 'finance',
      title: 'Loan to Ramesh',
      description: 'Lent ₹2,000 to Ramesh. Agreed to return by end of February.',
      confidence: 88,
      hasAudio: true,
      color: '#39ff14',
      icon: <Zap />
    },
  ];

  const filteredEvents =
    selectedCategory === 'all'
      ? timelineEvents
      : timelineEvents.filter((event) => event.category === selectedCategory);

  return (
    <div ref={containerRef} className="relative min-h-screen pb-20 overflow-hidden">
      
      {/* Moving Background Blocks - Parallax Decoration */}
      <MovingBlocks />

      <div className="relative z-10 max-w-4xl mx-auto space-y-12 px-4">
        
        {/* Header Section with 3D tilt effect */}
        <motion.div
          initial={{ opacity: 0, y: -50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative perspective-1000"
        >
          <div
            className="p-8 rounded-3xl backdrop-blur-2xl overflow-hidden relative group"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 45, 0.8), rgba(20, 20, 30, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Animated Glow in Header */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Activity size={40} className="text-cyan-400" />
                </motion.div>
                Life Timeline
              </h2>
              
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold tracking-wide hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <Filter size={18} />
                <span>Filter View</span>
              </motion.button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 relative z-10">
              {categories.map((cat) => (
                <CategoryPill 
                  key={cat.id} 
                  cat={cat} 
                  isSelected={selectedCategory === cat.id} 
                  onClick={() => setSelectedCategory(cat.id)} 
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline Content */}
        <div className="relative pl-4 md:pl-8">
          
          {/* Central Progress Line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                className="w-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500"
                style={{ height: "100%", scaleY, transformOrigin: "top" }}
             />
          </div>

          <div className="space-y-12 md:space-y-24 py-10">
             {filteredEvents.map((event, index) => (
                <TimelineCard key={event.id} event={event} index={index} />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual timeline cards
function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ opacity, x, scale }}
      className="relative pl-12 md:pl-20"
    >
      {/* Connection Line to Dot */}
      <div className="absolute left-8 md:left-12 top-10 w-4 md:w-8 h-[2px] bg-white/20" />

      {/* Timeline Node/Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute left-[26px] md:left-[42px] top-7 w-4 h-4 rounded-full z-20"
        style={{
          background: event.color,
          boxShadow: `0 0 15px ${event.color}, 0 0 30px ${event.color}`,
          border: '2px solid white',
        }}
      >
        <div className="absolute inset-0 animate-ping opacity-50 rounded-full" style={{ background: event.color }} />
      </motion.div>

      {/* The Cinematic Card */}
      <SpotlightCard color={event.color}>
        <div className="flex flex-col md:flex-row gap-6">
           
           {/* Date Block */}
           <div className="flex-shrink-0 flex md:flex-col items-center justify-center gap-1 md:gap-0 p-4 rounded-xl bg-black/20 border border-white/5 min-w-[100px] text-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 text-white">{event.year}</span>
              <span className="text-2xl md:text-3xl font-black text-white">{event.date}</span>
           </div>

           {/* Content */}
           <div className="flex-grow">
              <div className="flex items-start justify-between mb-2">
                 <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border"
                      style={{ color: event.color, borderColor: `${event.color}40`, backgroundColor: `${event.color}10` }}
                    >
                      {event.category}
                    </span>
                 </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                {event.title}
              </h3>
              
              <p className="text-white/70 leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Footer / Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${event.confidence}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: event.color }}
                           />
                        </div>
                        <span className="text-xs font-bold text-white">{event.confidence}%</span>
                      </div>
                   </div>
                </div>

                {event.hasAudio && (
                   <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group/btn"
                   >
                      <Play size={16} className="text-white ml-0.5 group-hover/btn:text-cyan-400 transition-colors" />
                   </motion.button>
                )}
              </div>
           </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// Spotlight Effect Card
function SpotlightCard({ children, color }: { children: React.ReactNode; color: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="group relative border border-white/10 bg-gray-900/40 overflow-hidden rounded-3xl"
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${color}25,
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 p-6 md:p-8 backdrop-blur-md">
        {children}
      </div>
    </motion.div>
  );
}

// Filter Pill Component
function CategoryPill({ cat, isSelected, onClick }: { cat: any; isSelected: boolean; onClick: () => void }) {
   return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-5 py-2 rounded-xl font-medium text-sm transition-all relative overflow-hidden ${
          isSelected ? 'text-white' : 'text-white/60 hover:text-white'
        }`}
        style={
          isSelected
            ? {
                background: `${cat.color}20`,
                border: `1px solid ${cat.color}60`,
                boxShadow: `0 0 20px ${cat.color}30`,
              }
            : {
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }
        }
      >
         {isSelected && (
            <motion.div 
               layoutId="pill-active"
               className="absolute inset-0 bg-white/10 z-0"
               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
         )}
         <span className="relative z-10 flex items-center gap-2">
            {cat.label}
         </span>
      </motion.button>
   );
}

// Background Floating Blocks Component
function MovingBlocks() {
   return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {[...Array(6)].map((_, i) => (
            <FloatingBlock key={i} index={i} />
         ))}
      </div>
   );
}

function FloatingBlock({ index }: { index: number }) {
   const randomX = Math.random() * 100;
   const randomY = Math.random() * 100;
   const size = 100 + Math.random() * 300;
   const duration = 20 + Math.random() * 20;
   
   return (
      <motion.div
         animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
         }}
         transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: index * 2,
         }}
         className="absolute rounded-3xl backdrop-blur-3xl opacity-[0.03]"
         style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
            width: size,
            height: size,
            background: index % 2 === 0 ? '#00d4ff' : '#b45aff',
            border: '1px solid white',
         }}
      />
   );
}
