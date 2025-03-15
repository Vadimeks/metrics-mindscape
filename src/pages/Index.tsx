
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import DataEntry from '@/components/DataEntry';
import Analysis from '@/components/Analysis';
import { DataProvider, useData } from '@/context/DataContext';

const IndexContent: React.FC = () => {
  const { activeSection } = useData();
  const dataEntryRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSection === 'dataEntry' && dataEntryRef.current) {
      dataEntryRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (activeSection === 'analysis' && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section id="hero">
        <Hero />
      </section>
      
      <section id="dataEntry" ref={dataEntryRef}>
        <DataEntry />
      </section>
      
      <section id="analysis" ref={analysisRef}>
        <Analysis />
      </section>
      
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-2">
                <span className="text-white font-medium">D</span>
              </div>
              <span className="font-medium text-lg text-gray-900">DataInsight</span>
            </div>
            <p className="text-gray-500 text-sm text-center mb-6 max-w-md">
              Track your personal metrics, analyze correlations, and gain actionable insights to improve your life.
            </p>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
            <p className="mt-8 text-gray-400 text-sm">© {new Date().getFullYear()} DataInsight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <DataProvider>
      <IndexContent />
    </DataProvider>
  );
};

export default Index;
