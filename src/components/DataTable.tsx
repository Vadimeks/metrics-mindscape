
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, RefreshCw } from 'lucide-react';
import { formatDate } from '@/utils/dataUtils';
import { toast } from 'sonner';

const DataTable: React.FC = () => {
  const { dataEntries, removeEntry, clearAllData } = useData();
  const [confirmClear, setConfirmClear] = useState(false);

  // If no data, show empty state
  if (dataEntries.length === 0) {
    return (
      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl">Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No data entries yet</p>
            <p className="text-sm text-gray-400">Start by adding some data using the form above</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get all unique parameter names across all entries
  const allParameters = Array.from(
    new Set(
      dataEntries.flatMap(entry => 
        entry.parameters.map(param => param.name)
      )
    )
  );

  // Handle entry deletion
  const handleDeleteEntry = (id: string) => {
    removeEntry(id);
    toast.success('Entry deleted successfully');
  };

  // Handle clear all data
  const handleClearAll = () => {
    if (confirmClear) {
      clearAllData();
      setConfirmClear(false);
      toast.success('All data cleared successfully');
    } else {
      setConfirmClear(true);
      // Auto-reset after 3 seconds
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Data</h3>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearAll}
          className={confirmClear ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          {confirmClear ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Confirm Clear
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </>
          )}
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              {allParameters.map(param => (
                <th key={param} scope="col" className="px-6 py-3">{param}</th>
              ))}
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataEntries.map(entry => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatDate(entry.date)}
                </td>
                {allParameters.map(paramName => {
                  const param = entry.parameters.find(p => p.name === paramName);
                  return (
                    <td key={paramName} className="px-6 py-4">
                      {param ? param.value : '—'}
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
