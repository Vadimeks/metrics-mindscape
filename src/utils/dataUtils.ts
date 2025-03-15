
import { DataEntry, Parameter } from '@/context/DataContext';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Calculate correlation between two parameters
export const calculateCorrelation = (
  data: DataEntry[],
  param1: string,
  param2: string
): number => {
  // Extract values for the two parameters
  const values1: number[] = [];
  const values2: number[] = [];

  data.forEach(entry => {
    const parameter1 = entry.parameters.find(p => p.name === param1);
    const parameter2 = entry.parameters.find(p => p.name === param2);

    if (parameter1 && parameter2) {
      const value1 = typeof parameter1.value === 'string' 
        ? parseFloat(parameter1.value) 
        : parameter1.value;
      
      const value2 = typeof parameter2.value === 'string' 
        ? parseFloat(parameter2.value) 
        : parameter2.value;

      if (!isNaN(value1) && !isNaN(value2)) {
        values1.push(value1);
        values2.push(value2);
      }
    }
  });

  // Need at least 2 pairs of values to calculate correlation
  if (values1.length < 2) {
    return 0;
  }

  // Calculate Pearson correlation coefficient
  const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

  let numerator = 0;
  let denominator1 = 0;
  let denominator2 = 0;

  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    
    numerator += diff1 * diff2;
    denominator1 += diff1 * diff1;
    denominator2 += diff2 * diff2;
  }

  if (denominator1 === 0 || denominator2 === 0) {
    return 0;
  }

  return numerator / Math.sqrt(denominator1 * denominator2);
};

// Get unique parameter names from all entries
export const getUniqueParameters = (data: DataEntry[]): string[] => {
  const paramSet = new Set<string>();
  
  data.forEach(entry => {
    entry.parameters.forEach(param => {
      paramSet.add(param.name);
    });
  });
  
  return Array.from(paramSet);
};

// Generate analysis text based on correlation
export const generateAnalysisText = (correlation: number, param1: string, param2: string): string => {
  const absCorrelation = Math.abs(correlation);
  let strength = '';
  let direction = correlation > 0 ? 'positive' : 'negative';
  
  if (absCorrelation > 0.7) {
    strength = 'strong';
  } else if (absCorrelation > 0.3) {
    strength = 'moderate';
  } else {
    strength = 'weak';
  }

  let text = '';
  
  if (absCorrelation < 0.1) {
    text = `There appears to be little to no relationship between ${param1} and ${param2}.`;
  } else {
    text = `There is a ${strength} ${direction} correlation (${correlation.toFixed(2)}) between ${param1} and ${param2}. `;
    
    if (direction === 'positive') {
      text += `This means that as ${param1} increases, ${param2} tends to increase as well.`;
    } else {
      text += `This means that as ${param1} increases, ${param2} tends to decrease.`;
    }
  }
  
  return text;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
