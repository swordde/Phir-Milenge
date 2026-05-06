/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useMemo, useState, useEffect, useCallback } from 'react';

const PARTICLE_COUNT = 150;

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function GoldenParticle({ particle }: { particle: Particle; key?: any }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: ['0vh', '110vh'],
        opacity: [0, particle.opacity, particle.opacity, 0],
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        delay: particle.delay,
        ease: "linear"
      }}
      style={{
        position: 'absolute',
        left: `${particle.x}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: '#eab308',
        borderRadius: '50%',
        boxShadow: '0 0 8px #fef08a, 0 0 15px #eab308',
        filter: 'blur(1px)',
        zIndex: 1,
      }}
    />
  );
}

function ShimmerBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 20,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black to-transparent z-10" />
      {particles.map((p) => (
        <GoldenParticle key={p.id} particle={p} />
      ))}
    </div>
  );
}

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle fullscreen on 'f' key
      if (event.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  return (
    <main 
      className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans cursor-pointer"
      onClick={toggleFullscreen}
    >
      <ShimmerBackground />
      
      <div className="relative z-20 text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.5, duration: 2.5, ease: "easeOut" }}
            className="text-2xl md:text-4xl lg:text-5xl font-light uppercase text-gold-light/90"
          >
            2026
          </motion.p>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tight md:tracking-normal uppercase leading-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-b from-gold-light via-gold-default to-gold-dark drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]">
              Phir Milenge
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 1.5, duration: 2 }}
            className="h-px max-w-[200px] md:max-w-md bg-linear-to-r from-transparent via-gold-default to-transparent mx-auto mt-8"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Presentation hint */}
      <div className="fixed bottom-6 w-full text-center pointer-events-none">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 3 }}
          className="text-[10px] uppercase tracking-widest text-gold-light"
        >
          Click or press 'F' for Fullscreen
        </motion.p>
      </div>
    </main>
  );
}

