
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { user, setActiveSection } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md subtle-shadow" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => setActiveSection('hero')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-2">
            <span className="text-white font-medium">D</span>
          </div>
          <span className={cn(
            "font-medium text-lg transition-all duration-300",
            scrolled ? "text-gray-900" : "text-gray-800"
          )}>DataInsight</span>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="lg:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={cn(
              "w-5 h-0.5 bg-gray-700 transition-all duration-300",
              menuOpen && "transform rotate-45 translate-y-0.5"
            )}></span>
            <span className={cn(
              "w-5 h-0.5 bg-gray-700 mt-1 transition-all duration-300",
              menuOpen && "opacity-0"
            )}></span>
            <span className={cn(
              "w-5 h-0.5 bg-gray-700 mt-1 transition-all duration-300",
              menuOpen && "transform -rotate-45 -translate-y-1.5"
            )}></span>
          </div>
        </button>
        
        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a 
            onClick={() => setActiveSection('hero')} 
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Home
          </a>
          <a 
            onClick={() => setActiveSection('dataEntry')} 
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Enter Data
          </a>
          <a 
            onClick={() => setActiveSection('analysis')} 
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Analysis
          </a>
          {user.isLoggedIn ? (
            <Button variant="outline" className="hover:bg-gray-100">
              My Account
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hover:bg-gray-100">
                Log In
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Sign Up
              </Button>
            </div>
          )}
        </nav>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 pt-20",
        menuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col items-center space-y-6 p-8">
          <a 
            onClick={() => {
              setActiveSection('hero');
              setMenuOpen(false);
            }} 
            className="text-gray-800 text-lg hover:text-blue-600 cursor-pointer"
          >
            Home
          </a>
          <a 
            onClick={() => {
              setActiveSection('dataEntry');
              setMenuOpen(false);
            }} 
            className="text-gray-800 text-lg hover:text-blue-600 cursor-pointer"
          >
            Enter Data
          </a>
          <a 
            onClick={() => {
              setActiveSection('analysis');
              setMenuOpen(false);
            }} 
            className="text-gray-800 text-lg hover:text-blue-600 cursor-pointer"
          >
            Analysis
          </a>
          {user.isLoggedIn ? (
            <Button 
              variant="outline" 
              className="w-full justify-center hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              My Account
            </Button>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-center hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Button>
              <Button 
                className="w-full justify-center bg-blue-500 hover:bg-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
