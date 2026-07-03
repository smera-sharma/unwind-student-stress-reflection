import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Breathe In'); // 'Breathe In', 'Hold', 'Exhale'
  const [timeLeft, setTimeLeft] = useState(4);

  // Cyclic Phase timer loop
  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // State machine phase transition bounds
            if (phase === 'Breathe In') {
              setPhase('Hold');
              return 4;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 6;
            } else {
              setPhase('Breathe In');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Breathe In');
    setTimeLeft(4);
  };

  // Determine circle scale styling based on phase
  const getScaleClass = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'Breathe In') return 'scale-125 duration-[4000ms]';
    if (phase === 'Hold') return 'scale-125 duration-0';
    return 'scale-100 duration-[6000ms]';
  };

  const getPhaseColor = () => {
    if (phase === 'Breathe In') return 'text-[#6B8E7A]';
    if (phase === 'Hold') return 'text-[#89A8B2]';
    return 'text-[#C8BBA5]';
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {/* Header Info */}
      <div className="text-center space-y-2 select-none">
        <span className="text-xs font-semibold text-[#89A8B2] tracking-wider uppercase block">Breathing Session</span>
        <h3 className={`text-xl font-bold transition-colors duration-500 ${getPhaseColor()}`}>
          {phase} ({timeLeft}s)
        </h3>
      </div>

      {/* Breathing Ring with clean CSS scaling transitions */}
      <div className="relative w-48 h-48 flex items-center justify-center select-none">
        {/* Ring backdrop */}
        <div className="absolute w-28 h-28 rounded-full border border-slate-100" />
        
        {/* Pulsing Guide Ring */}
        <div 
          className={`absolute w-24 h-24 rounded-full bg-[#6B8E7A]/15 border border-[#6B8E7A]/30 transition-transform ease-in-out ${getScaleClass()}`} 
        />
        
        {/* Ring status prompt */}
        <div className="relative z-10 text-xs font-bold text-[#6B8E7A] uppercase tracking-widest animate-pulse">
          {phase === 'Breathe In' ? 'Inhale' : phase === 'Hold' ? 'Hold' : 'Exhale'}
        </div>
      </div>

      {/* Session Controls */}
      <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
        <Button 
          variant={isActive ? 'outline' : 'primary'} 
          className="flex-1"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-[#E5E7EB] hover:bg-slate-50 text-[#2F3A3F]"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default BreathingExercise;
