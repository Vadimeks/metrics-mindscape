
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateCorrelation, getUniqueParameters, generateAnalysisText, formatDate } from '@/utils/dataUtils';
import { toast } from 'sonner';

const Analysis: React.FC = () => {
  const { dataEntries, setActiveSection } = useData();
  const [parameter1, setParameter1] = useState<string>('');
  const [parameter2, setParameter2] = useState<string>('');
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [animationClass, setAnimationClass] = useState('');

  const uniqueParameters = getUniqueParameters(dataEntries);

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimationClass('animate-slide-in-up');
  }, []);

  // Reset selected parameters if data entries change
  useEffect(() => {
    if (dataEntries.length === 0) {
      setParameter1('');
      setParameter2('');
      setCorrelation(null);
      setAnalysisText('');
      setChartData([]);
    } else if (uniqueParameters.length > 0 && !parameter1) {
      setParameter1(uniqueParameters[0]);
    }
  }, [dataEntries, uniqueParameters, parameter1]);

  // Prepare chart data when parameters change
  useEffect(() => {
    if (parameter1 && parameter2 && dataEntries.length > 0) {
      const newChartData = dataEntries.map(entry => {
        const param1Value = entry.parameters.find(p => p.name === parameter1)?.value || null;
        const param2Value = entry.parameters.find(p => p.name === parameter2)?.value || null;
        
        return {
          date: formatDate(entry.date),
          [parameter1]: param1Value,
          [parameter2]: param2Value,
        };
      });
      
      setChartData(newChartData);
      
      // Calculate correlation
      const correlationValue = calculateCorrelation(dataEntries, parameter1, parameter2);
      setCorrelation(correlationValue);
      
      // Generate analysis text
      const text = generateAnalysisText(correlationValue, parameter1, parameter2);
      setAnalysisText(text);
    }
  }, [parameter1, parameter2, dataEntries]);

  if (dataEntries.length < 2) {
    return (
      <div className={`min-h-screen pt-24 pb-16 px-4 ${animationClass}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              Analysis
            </div>
            <h2 className="text-3xl font-bold mb-4">Insights from Your Data</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track correlations between different parameters to understand what influences your results.
            </p>
          </div>
          
          <Card className="bg-white shadow-md border-0 rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Not enough data for analysis</h3>
              <p className="text-gray-500 mb-6">
                You need at least 2 data entries to perform correlation analysis.
              </p>
              <Button 
                onClick={() => setActiveSection('dataEntry')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enter Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${animationClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Analysis
          </div>
          <h2 className="text-3xl font-bold mb-4">Insights from Your Data</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track correlations between different parameters to understand what influences your results.
          </p>
        </div>

        <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden mb-8">
          <CardHeader>
            <CardTitle>Parameter Correlation</CardTitle>
            <CardDescription>
              Select two parameters to analyze their relationship
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="parameter1" className="text-sm font-medium mb-2 block">
                  First Parameter
                </Label>
                <Select
                  value={parameter1}
                  onValueChange={setParameter1}
                >
                  <SelectTrigger id="parameter1" className="w-full">
                    <SelectValue placeholder="Select parameter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto z-50 bg-white">
                    {uniqueParameters.map((param) => (
                      <SelectItem key={param} value={param}>
                        {param}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="parameter2" className="text-sm font-medium mb-2 block">
                  Second Parameter
                </Label>
                <Select
                  value={parameter2}
                  onValueChange={setParameter2}
                >
                  <SelectTrigger id="parameter2" className="w-full">
                    <SelectValue placeholder="Select parameter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto z-50 bg-white">
                    {uniqueParameters
                      .filter(param => param !== parameter1)
                      .map((param) => (
                        <SelectItem key={param} value={param}>
                          {param}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {parameter1 && parameter2 && correlation !== null && (
              <div className="mt-6 animate-fade-in">
                <div className="mb-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value) => [value, '']} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey={parameter1}
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          dot={{ r: 4 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey={parameter2}
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg">
                  <h4 className="font-medium text-lg mb-2">Analysis</h4>
                  <p className="text-gray-700">{analysisText}</p>
                  
                  <div className="mt-4 flex items-center">
                    <div className="mr-2 text-gray-700 font-medium">Correlation Strength:</div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const absCorrelation = Math.abs(correlation);
                        const filled = i < Math.ceil(absCorrelation * 5);
                        
                        return (
                          <div 
                            key={i}
                            className={`w-4 h-4 rounded-full mr-1 ${
                              filled 
                                ? correlation > 0 
                                  ? 'bg-blue-500' 
                                  : 'bg-red-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="ml-2 text-sm text-gray-500">
                      {Math.abs(correlation) < 0.3 
                        ? 'Weak' 
                        : Math.abs(correlation) < 0.7 
                          ? 'Moderate' 
                          : 'Strong'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Analysis Tips</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• A positive correlation means as one parameter increases, the other tends to increase too.</li>
                  <li>• A negative correlation means as one parameter increases, the other tends to decrease.</li>
                  <li>• Correlation doesn't necessarily imply causation.</li>
                  <li>• More data points will provide more accurate analysis results.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;
