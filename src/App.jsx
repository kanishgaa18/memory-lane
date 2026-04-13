/*

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, Star, Camera, Coffee, Gift, Sparkles, Lock, Unlock, CheckCircle2, FileText, ArrowRight, XCircle, Maximize2, Sun, Anchor, UserCircle, Map, Zap, Award, Eye } from 'lucide-react';


const memories = [
  {
    date: "The Beginning",
    title: "A Shared Path Starts",
    desc: "Every life needs someone to lean on, and the day we met, I found the person who would become my greatest strength.",
    image: "/images/img01.jpg"
  },
  {
    date: "A Lasting Bond",
    title: "A Constant Presence",
    desc: "In a world that is always changing, your presence is the one thing I can always count on.",
    image: "/images/img02.png"
  },
  {
    date: "Little Joys",
    title: "Late Night Talks",
    desc: "The best conversations aren't planned. They happen over a warm cup and quiet hours of understanding.",
    image: "/images/img03.png"
  },
  {
    date: "Strength",
    title: "Your Unwavering Support",
    desc: "When the world feels heavy, you are my anchor. Your belief in me is the greatest gift I've ever known.",
    image: "/images/img04.jpg"
  },
  {
    date: "Adventure",
    title: "Exploring Together",
    desc: "Whether it's a new city or a new challenge, every journey is better because we are navigating it side-by-side.",
    image: "/images/img05.jpg"
  },
  {
    date: "Pure Energy",
    title: "Laughing Until It Hurts",
    desc: "Thank you for the moments where we lose track of time and find ourselves in fits of uncontrollable laughter.",
    image: "/images/img06.jpg"
  },
  {
    date: "The Future",
    title: "Hand in Hand",
    desc: "As we look ahead, I see a lifetime of shared dreams and mutual respect. You are the reason my world shines so bright.",
    image: "/images/img07.jpg"
  },
  {
    date: "Celebrating You",
    title: "The Person Who Matters Most",
    desc: "To my favorite person: May your year be as wonderful and bright as the light and strength you bring to my life.",
    image: "/images/img08.jpeg"
  }
];

// 2. OPTIMIZED PARTICLE (Minimal JS for Mobile)
const ParticleItem = ({ p, mouseX, mouseY, windowSize, isMobile }) => {
  const fallProgress = useMotionValue(0);
  
  useEffect(() => {
    const controls = animate(fallProgress, 1, { 
      duration: p.duration, 
      repeat: Infinity, 
      ease: "linear", 
      delay: p.delay 
    });
    return () => controls.stop();
  }, [fallProgress, p.duration, p.delay]);
  
  const baseY = useTransform(fallProgress, [0, 1], [-50, windowSize.height + 50]);
  const baseX = (parseFloat(p.left) / 100) * windowSize.width;
  
  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);

  useEffect(() => {
    if (isMobile) return;
    const unsubscribe = mouseX.on("change", (latestX) => {
      const latestY = mouseY.get();
      const currentY = baseY.get();
      const dx = baseX - latestX;
      const dy = currentY - latestY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 180) {
        const force = (1 - distance / 180) * 40; 
        const angle = Math.atan2(dy, dx);
        repelX.set(Math.cos(angle) * force);
        repelY.set(Math.sin(angle) * force);
      } else {
        repelX.set(0); 
        repelY.set(0);
      }
    });
    return () => unsubscribe();
  }, [mouseX, mouseY, baseY, baseX, repelX, repelY, isMobile]);

  const finalX = useTransform(repelX, (v) => baseX + v);
  const finalY = useTransform([baseY, repelY], ([y, ry]) => y + ry);
  const opacity = useTransform(fallProgress, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0]);

  return (
    <motion.div 
      className="absolute pointer-events-none z-[1]" 
      style={{ 
        x: finalX, 
        y: finalY, 
        opacity, 
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    >
        <motion.div
           animate={{ 
             scale: isMobile ? [1, 1.1, 1] : [1, 1.2, 1],
             filter: isMobile ? "brightness(1)" : ["brightness(1)", "brightness(1.3)", "brightness(1)"]
           }}
           transition={{ duration: p.shimmerSpeed, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.type === 'heart' ? (
            <Heart fill="currentColor" size={isMobile ? p.size * 0.8 : p.size} className="text-white/60 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]" />
          ) : (
            <div 
              style={{ width: p.size / 1.8, height: p.size / 1.8 }} 
              className="rounded-full bg-white/80 shadow-[0_0_10px_white]" 
            />
          )}
        </motion.div>
    </motion.div>
  );
};

const GlobalParticles = ({ mouseX, mouseY, isMobile }) => {
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const count = isMobile ? 18 : 70; 
  const particles = useMemo(() => [...Array(count)].map((_, i) => ({ 
    id: i, 
    left: `${Math.random() * 100}%`, 
    duration: Math.random() * 6 + 10, 
    delay: Math.random() * -20, 
    size: Math.random() * 6 + 4, 
    shimmerSpeed: Math.random() * 2 + 1,
    type: i % 8 === 0 ? 'heart' : 'snow' 
  })), [count]);

  if (windowSize.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] w-full h-full">
      {particles.map((p) => <ParticleItem key={p.id} p={p} mouseX={mouseX} mouseY={mouseY} windowSize={windowSize} isMobile={isMobile} />)}
    </div>
  );
};

function App() {
  const [started, setStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };
    if (window.innerWidth >= 768) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cinzel:wght@400;700&family=Dancing+Script:wght@400;700&family=Montserrat:wght@300;400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleVerify = () => {
    const correctAnswer = "vaandu"; 
    if (answer.toLowerCase().trim() === correctAnswer) {
      setIsVerified(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b041a] text-slate-200 font-['Montserrat'] selection:bg-purple-900/30 overflow-x-hidden">
      <GlobalParticles mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-violet-500 origin-left z-50 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ scaleX }} />

      <AnimatePresence>
        {!started && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0b041a] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <motion.div 
              initial={{ scale: 1.1 }} 
              animate={{ scale: isMobile ? 1.1 : [1.1, 1.2, 1.1], rotate: isMobile ? 0 : [0, 0.5, 0] }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
              className="absolute inset-0 z-0 opacity-30 will-change-transform" 
              style={{ 
                backgroundImage: `url('/images/intro.jpg')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                transform: 'translateZ(0)'
              }} 
            />
            <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                <span className="text-violet-400 uppercase tracking-[0.3em] md:tracking-[0.5em] text-[9px] md:text-[10px] mb-4 font-bold drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">A Birthday Present</span>
                <h1 className="text-5xl md:text-7xl font-['Dancing_Script'] text-white mb-6 leading-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">To My <br/> <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-white to-violet-300">Bundle of Joy!</span></h1>
                <div className="w-12 md:w-16 h-px bg-white/20 mb-10 shadow-[0_0_10px_white]" />
                
                <button onClick={() => { setStarted(true); window.scrollTo(0, 0); }} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-95">Enter Memory Lane</button>
                <span className="fixed bottom-8 text-[9px] uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/20 font-bold">Created for You</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {started && (
        <div className="relative z-10">
          <header className="min-h-[80vh] md:min-h-screen flex items-center justify-center p-6 text-center">
            <div className="max-w-4xl py-12 md:py-20">
                <h1 className="text-2xl md:text-5xl font-['Dancing_Script'] text-white mb-8 md:mb-10 leading-tight px-4">Happiest birthday to my bundle of Joy!!!</h1>
                <p className="text-base md:text-xl italic text-violet-100/90 leading-relaxed mb-10 md:mb-12 font-['Playfair_Display'] px-4 md:px-12 backdrop-blur-sm py-4 rounded-3xl">
                  "In a world of noise, your presence is my favorite melody. I want to see you smiling every day. You are my constant support and the person I hold in the highest regard. Thank you for being the shoulder I lean on; I promise to always be there for you. Wishing you a happy, healthy, and prosperous birthday—I thank God to have you in my life. May your day be as beautiful and kind as your heart."
                </p>
                <motion.div animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }} className="flex flex-col items-center gap-2">
                  <span className="text-violet-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">Scroll to see our journey</span>
                  <ArrowRight size={16} className="rotate-90 text-violet-400" />
                </motion.div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto py-12 md:py-20 px-4 md:px-6 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/40 to-transparent -translate-x-1/2 z-0" />
            
            {memories.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                className={`flex items-center justify-center relative mb-24 md:mb-40 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-[90%] md:w-[45%] text-center z-10 ${
                  i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}>
                  <div className="rounded-xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0b041a] backdrop-blur-md hover:border-violet-500/30 transition-all duration-500 group transform-gpu">
                    
                    <div className="w-full overflow-hidden relative">
                      <img 
                        src={m.image} 
                        alt="" 
                        className="w-full h-auto grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 block" 
                        loading="lazy" 
                      />
                    </div>
                    <div className="p-5 md:p-8 relative">
                      <span className="text-violet-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">{m.date}</span>
                      <h3 className="text-lg md:text-2xl font-bold text-white mt-1 md:mt-2 mb-2 md:mb-4">{m.title}</h3>
                      <p className="text-slate-300 italic text-sm md:text-lg leading-relaxed font-['Playfair_Display']">"{m.desc}"</p>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>

          <footer className="py-20 md:py-32 flex items-center justify-center p-6 min-h-screen">
             <AnimatePresence mode="wait">
               {!isVerified ? (
                 <motion.div key="verification" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 text-center max-w-lg w-full relative transform-gpu">
                    <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-px h-16 md:h-20 bg-gradient-to-t from-violet-500/50 to-transparent" />
                    <Lock className="text-violet-400 mx-auto mb-6" size={32} />
                    <h2 className="text-xl md:text-3xl font-['Cinzel'] font-bold text-white mb-2">Verification</h2>
                    <p className="text-slate-400 mb-8 font-['Playfair_Display'] italic text-base md:text-xl px-2">"What is nick name you call me?"</p>
                    <motion.div animate={error ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
                      <input 
                        type="text" 
                        value={answer} 
                        onChange={(e) => setAnswer(e.target.value)} 
                        placeholder="Type your answer..." 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-center focus:outline-none focus:border-violet-500 transition-all mb-4 text-sm md:text-base shadow-inner" 
                      />
                    </motion.div>
                    <button onClick={handleVerify} className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all hover:bg-violet-500 active:scale-95 text-xs md:text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">Verify to Access Gift</button>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="success" 
                   initial={{ opacity: 0, y: 30 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   className="flex flex-col items-center w-full max-w-2xl px-4 text-center"
                 >
                    <Award className="text-yellow-500 mx-auto mb-6 animate-bounce" size={48} />
                    <h2 className="text-2xl md:text-4xl font-['Cinzel'] font-bold text-white mb-4">Verification Success!</h2>
                    <p className="text-slate-300 font-['Playfair_Display'] italic text-base md:text-lg mb-10">
                      "the thing inside might make you feel angry with me, but what is inside was inspired by the goodness I see in you. I have done what I felt I was able to do for you now....and also I am very much happy to dedicate  this to you on your birthday"
                    </p>
                    
                    <AnimatePresence mode="wait">
                      {!isRevealed ? (
                        <motion.button
                          key="reveal-btn"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsRevealed(true)}
                          className="bg-white text-indigo-950 font-bold px-12 py-5 rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 group transition-all"
                        >
                          <Eye size={20} className="group-hover:scale-125 transition-transform" />
                          Reveal My Gift
                        </motion.button>
                      ) : (
                        <motion.div
                          key="certificate"
                          initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
                          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          className="relative group w-full max-w-lg md:max-w-xl mx-auto"
                        >
                           <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                           <div className="relative bg-[#0b041a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                              <img 
                                src="/images/certificate.png" 
                                alt="Certificate" 
                                className="w-full h-auto object-cover transform transition duration-1000 group-hover:scale-105 block"
                                loading="lazy"
                              />
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </motion.div>
               )}
             </AnimatePresence>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;*/






import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, Star, Camera, Coffee, Gift, Sparkles, Lock, Unlock, CheckCircle2, FileText, ArrowRight, XCircle, Maximize2, Sun, Anchor, UserCircle, Map, Zap, Award, Eye } from 'lucide-react';

/**
 * 1. DATA: Milestone memories
 * IMPORTANT: Move your 'images' folder into the 'public' folder of your project.
 * Example: public/images/beginning.jpg
 */
const memories = [
  {
    date: "15/03/24",
    title: "Ending a tragic day with my first selfie",
    desc: "You were scared it was something serious problem for me…but here we were back from the hospital, taking a casual selfie like nothing happened.",
    image: "/images/img01.jpg"
  },
  {
    date: "15/04/24",
    title: "It's your Birthday!!!",
    desc: "No count for how many times I’ve watched this full series...messed up a lot on that day, yet it remains the most beautiful one I can’t recreate.",
    image: "/images/img02.png"
  },
  {
    date: "24/05/24",
    title: "Smiling outside, breaking inside",
    desc: "Started the day helping you for your interview…ended it by messing up by my mistake I have done and losing your words for two days.",
    image: "/images/img03.png"
  },
  {
    date: "27/08/24",
    title: "Quick click between a busy day",
    desc: "Middle of the most chaotic day...I made sure to take a picture with you, scared you’d go silent if I clicked with someone else without you.",
    image: "/images/img04.jpg"
  },
  {
    date: "04/10/24",
    title: "One fine day together",
    desc: "After so many compromises and plans, we made this trip happen…and now it’s one of the sweetest memories with you. With your permission, plan this again..",
    image: "/images/img05.jpg"
  },
  {
    date: "11/01/25",
    title: "Celebrations ahead",
    desc: "Skipped internship plans with my friends…just to spend some quality time with you in college before you go for your maternity leave and completed the celebration.",
    image: "/images/img06.jpg"
  },
  {
    date: "31/01/25",
    title: "Half smiles, half heavy heart",
    desc: "Sent you for your exam, secretly arranged everything for the first time…eyes full of happy tears, but heart breaking inside knowing you’re leaving.. lost the most beautiful pic of the day.",
    image: "/images/img07.jpg"
  },
  {
    date: "02/05/25",
    title: "Meeting after a long gap",
    desc: "Got to know about your arrival just 3 days before…couldn’t let you be empty-handed after your birthday. Crossed one sleepless night by preparing for NPTEL and finishing your gift.",
    image: "/images/img08.jpg"
  },
  {
    date: "01/06/25",
    title: "Arraival tiny human ",
    desc: "All your confusion, nervousness and health struggles have now turned into happiness in your hands, with countless prayers and blessings. An unforgettable visit!",
    image: "/images/img09.jpg"
  },
  {
    date: "13/01/26",
    title: "Another snap together",
    desc: "Things don’t feel the same as previous in this picture…I miss the old version of us. Maybe it’s my fault.I’m sorry for the hurt I caused with my confused, foolish mind...please don't leave me.",
    image: "/images/img10.jpeg"
  }
];

// 2. OPTIMIZED PARTICLE (Enhanced Visibility for Mobile)
const ParticleItem = ({ p, mouseX, mouseY, windowSize, isMobile }) => {
  const fallProgress = useMotionValue(0);
  
  useEffect(() => {
    const controls = animate(fallProgress, 1, { 
      duration: p.duration, 
      repeat: Infinity, 
      ease: "linear", 
      delay: p.delay 
    });
    return () => controls.stop();
  }, [fallProgress, p.duration, p.delay]);
  
  const baseY = useTransform(fallProgress, [0, 1], [-50, windowSize.height + 50]);
  const baseX = (parseFloat(p.left) / 100) * windowSize.width;
  
  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);

  useEffect(() => {
    if (isMobile) return;
    const unsubscribe = mouseX.on("change", (latestX) => {
      const latestY = mouseY.get();
      const currentY = baseY.get();
      const dx = baseX - latestX;
      const dy = currentY - latestY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 180) {
        const force = (1 - distance / 180) * 40; 
        const angle = Math.atan2(dy, dx);
        repelX.set(Math.cos(angle) * force);
        repelY.set(Math.sin(angle) * force);
      } else {
        repelX.set(0); 
        repelY.set(0);
      }
    });
    return () => unsubscribe();
  }, [mouseX, mouseY, baseY, baseX, repelX, repelY, isMobile]);

  const finalX = useTransform(repelX, (v) => baseX + v);
  const finalY = useTransform([baseY, repelY], ([y, ry]) => y + ry);
  // Increased opacity for better visibility
  const opacity = useTransform(fallProgress, [0, 0.1, 0.9, 1], [0, 0.9, 0.9, 0]);

  return (
    <motion.div 
      className="absolute pointer-events-none z-[1]" 
      style={{ 
        x: finalX, 
        y: finalY, 
        opacity, 
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    >
        <motion.div
           animate={{ 
             scale: [1, 1.1, 1],
             filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"]
           }}
           transition={{ duration: p.shimmerSpeed, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.type === 'heart' ? (
            <Heart fill="currentColor" size={p.size} className="text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          ) : (
            <div 
              style={{ width: p.size / 1.5, height: p.size / 1.5 }} 
              className="rounded-full bg-white shadow-[0_0_12px_white]" 
            />
          )}
        </motion.div>
    </motion.div>
  );
};

const GlobalParticles = ({ mouseX, mouseY, isMobile }) => {
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Increased density for mobile visibility
  const count = isMobile ? 40 : 80; 
  
  const particles = useMemo(() => [...Array(count)].map((_, i) => ({ 
    id: i, 
    left: `${Math.random() * 100}%`, 
    duration: Math.random() * 6 + 10, 
    delay: Math.random() * -20, 
    size: Math.random() * 8 + 6, // Slightly larger particles
    shimmerSpeed: Math.random() * 2 + 1,
    type: i % 6 === 0 ? 'heart' : 'snow' 
  })), [count]);

  if (windowSize.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] w-full h-full">
      {particles.map((p) => <ParticleItem key={p.id} p={p} mouseX={mouseX} mouseY={mouseY} windowSize={windowSize} isMobile={isMobile} />)}
    </div>
  );
};

function App() {
  const [started, setStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };
    if (window.innerWidth >= 768) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cinzel:wght@400;700&family=Dancing+Script:wght@400;700&family=Montserrat:wght@300;400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleVerify = () => {
    const correctAnswer = "vaandu"; 
    if (answer.toLowerCase().trim() === correctAnswer) {
      setIsVerified(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b041a] text-slate-200 font-['Montserrat'] selection:bg-purple-900/30 overflow-x-hidden">
      <GlobalParticles mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-violet-500 origin-left z-50 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ scaleX }} />

      <AnimatePresence>
        {!started && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0b041a] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <motion.div 
              initial={{ scale: 1.1 }} 
              animate={{ scale: isMobile ? 1.1 : [1.1, 1.2, 1.1], rotate: isMobile ? 0 : [0, 0.5, 0] }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
              className="absolute inset-0 z-0 opacity-30 will-change-transform" 
              style={{ 
                backgroundImage: `url('/images/intro.jpg')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                transform: 'translateZ(0)'
              }} 
            />
            <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                <span className="text-violet-400 uppercase tracking-[0.3em] md:tracking-[0.5em] text-[9px] md:text-[10px] mb-4 font-bold drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">A Birthday Present</span>
                <h1 className="text-5xl md:text-7xl font-['Dancing_Script'] text-white mb-6 leading-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">To My <br/> <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-white to-violet-300">Bundle of Joy!!!</span></h1>
                
                
                <button onClick={() => { setStarted(true); window.scrollTo(0, 0); }} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-95">Enter Memory Lane</button>
                <span className="fixed bottom-8 text-[9px] uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/20 font-bold">Created for You</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {started && (
        <div className="relative z-10">
          <header className="min-h-[80vh] md:min-h-screen flex items-center justify-center p-6 text-center">
            <div className="max-w-4xl py-12 md:py-20">
                <h1 className="text-2xl md:text-5xl font-['Dancing_Script'] text-white mb-8 md:mb-10 leading-tight px-4">Happiest Birthday to My Bundle of Joy!!!</h1>
                <p className="text-base md:text-xl italic text-violet-100/90 leading-relaxed mb-10 md:mb-12 font-['Playfair_Display'] px-4 md:px-12 backdrop-blur-sm py-4 rounded-3xl">
                  "In a world of noise...your presence is my favorite melody. I want to see you smiling every day. You are my constant support and the person I hold in the highest regard. Thank you for being the shoulder I lean on and I promise to always be there for you. Wishing you a happy, healthy and prosperous birthday. I thank God to have you in my life. May your day be as beautiful and kind as your heart. I am thankful to you as always!!!"
                </p>
                <motion.div animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }} className="flex flex-col items-center gap-2">
                  <span className="text-violet-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">Scroll to see our journey</span>
                  <ArrowRight size={16} className="rotate-90 text-violet-400" />
                </motion.div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto py-12 md:py-20 px-4 md:px-6 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/40 to-transparent -translate-x-1/2 z-0" />
            
            {memories.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                className={`flex items-center justify-center relative mb-24 md:mb-40 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-[90%] md:w-[45%] text-center z-10 ${
                  i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}>
                  <div className="rounded-xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0b041a] backdrop-blur-md hover:border-violet-500/30 transition-all duration-500 group transform-gpu">
                    {/* Image container now adjusts to image height */}
                    <div className="w-full overflow-hidden relative">
                      <img 
                        src={m.image} 
                        alt="" 
                        className="w-full h-auto grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 block" 
                        loading="lazy" 
                      />
                    </div>
                    <div className="p-5 md:p-8 relative">
                      <span className="text-violet-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">{m.date}</span>
                      <h3 className="text-lg md:text-2xl font-bold text-white mt-1 md:mt-2 mb-2 md:mb-4">{m.title}</h3>
                      <p className="text-slate-300 italic text-sm md:text-lg leading-relaxed font-['Playfair_Display']">"{m.desc}"</p>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>

          <footer className="py-20 md:py-32 flex items-center justify-center p-6 min-h-screen">
             <AnimatePresence mode="wait">
               {!isVerified ? (
                 <motion.div key="verification" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 text-center max-w-lg w-full relative transform-gpu">
                    <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-px h-16 md:h-20 bg-gradient-to-t from-violet-500/50 to-transparent" />
                    <Lock className="text-violet-400 mx-auto mb-6" size={32} />
                    <h2 className="text-xl md:text-3xl font-['Cinzel'] font-bold text-white mb-2">Verification</h2>
                    <p className="text-slate-400 mb-8 font-['Playfair_Display'] italic text-base md:text-xl px-2">"What is nick name you call me?"</p>
                    <motion.div animate={error ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
                      <input 
                        type="text" 
                        value={answer} 
                        onChange={(e) => setAnswer(e.target.value)} 
                        placeholder="Type your answer..." 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-center focus:outline-none focus:border-violet-500 transition-all mb-4 text-sm md:text-base shadow-inner" 
                      />
                    </motion.div>
                    <button onClick={handleVerify} className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all hover:bg-violet-500 active:scale-95 text-xs md:text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">Verify to Access Gift</button>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="success" 
                   initial={{ opacity: 0, y: 30 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   className="flex flex-col items-center w-full max-w-2xl px-4 text-center"
                 >
                    <Award className="text-yellow-500 mx-auto mb-6 animate-bounce" size={48} />
                    <h2 className="text-2xl md:text-4xl font-['Cinzel'] font-bold text-white mb-4">Verification Success!</h2>
                    <p className="text-slate-300 font-['Playfair_Display'] italic text-base md:text-lg mb-10">
                      "The thing inside might make you feel angry with me or you may think I am a fool, but what is inside was inspired by the goodness I see in you. I have done what I felt I was able to do for you now....and also I am very much happy to dedicate  this to you on your birthday"
                    </p>
                    
                    <AnimatePresence mode="wait">
                      {!isRevealed ? (
                        <motion.button
                          key="reveal-btn"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsRevealed(true)}
                          className="bg-white text-indigo-950 font-bold px-12 py-5 rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 group transition-all"
                        >
                          <Eye size={20} className="group-hover:scale-125 transition-transform" />
                          Reveal My Gift
                        </motion.button>
                      ) : (
                        <motion.div
                          key="certificate"
                          initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
                          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          className="relative group w-full max-w-lg md:max-w-xl mx-auto"
                        >
                           <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                           <div className="relative bg-[#0b041a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                              <img 
                                src="/images/certificate.png" 
                                alt="Certificate" 
                                className="w-full h-auto object-cover transform transition duration-1000 group-hover:scale-105 block"
                                loading="lazy"
                              />
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </motion.div>
               )}
             </AnimatePresence>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;