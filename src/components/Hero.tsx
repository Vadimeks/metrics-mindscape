
import React, { useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const { setActiveSection } = useData();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateHero = () => {
      if (containerRef.current) {
        containerRef.current.classList.add('animate-fade-in');
      }
    };
    
    // Small delay for dramatic effect
    setTimeout(animateHero, 100);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 opacity-0"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-block mb-6">
          <div className="flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            <span className="mr-1.5 flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Track. Analyze. Improve.
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900">
          Understand Your Data.<br />Achieve Your Goals.
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Discover the power of data-driven insights. Track your personal metrics, analyze correlations, and gain actionable knowledge to improve your life.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="w-full sm:w-auto text-base px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all rounded-xl"
            onClick={() => setActiveSection('dataEntry')}
          >
            Enter Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto text-base px-8 py-6 border-gray-300 bg-white hover:bg-gray-50 rounded-xl"
            onClick={() => setActiveSection('analysis')}
          >
            View Analysis
          </Button>
        </div>
      </div>
      
      {/* Abstract background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full filter blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/2"></div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-gray-500 mb-2">Scroll Down</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 12L12 17L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
