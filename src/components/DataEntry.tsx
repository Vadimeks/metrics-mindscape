
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Plus, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateId } from '@/utils/dataUtils';
import { toast } from 'sonner';
import DataTable from './DataTable';

const DEFAULT_PARAMETERS = [
  'Weight', 'Calories', 'Steps', 'Sleep Hours', 'Heart Rate', 'Water Intake'
];

const DataEntry: React.FC = () => {
  const { addEntry, user } = useData();
  const [date, setDate] = useState<Date>(new Date());
  const [parameters, setParameters] = useState<{ id: string; name: string; value: string }[]>([
    { id: generateId(), name: 'Weight', value: '' }
  ]);
  const [newParamName, setNewParamName] = useState('');
  const [showCustomParamInput, setShowCustomParamInput] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimationClass('animate-scale-in');
  }, []);

  const handleAddParameter = () => {
    if (parameters.length >= 5 && !user.isLoggedIn) {
      toast("Guest users are limited to 5 parameters per entry. Please sign up for more.");
      return;
    }
    
    setParameters([...parameters, { id: generateId(), name: '', value: '' }]);
  };

  const handleRemoveParameter = (id: string) => {
    setParameters(parameters.filter(param => param.id !== id));
  };

  const handleParameterChange = (id: string, field: 'name' | 'value', value: string) => {
    setParameters(
      parameters.map(param => 
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const handleAddCustomParam = () => {
    if (!newParamName.trim()) return;
    
    const paramExists = parameters.some(p => p.name.toLowerCase() === newParamName.toLowerCase());
    
    if (paramExists) {
      toast.error('This parameter already exists!');
      return;
    }
    
    setParameters([...parameters, { id: generateId(), name: newParamName, value: '' }]);
    setNewParamName('');
    setShowCustomParamInput(false);
  };

  const handleSubmit = () => {
    // Validate input
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    if (parameters.length === 0) {
      toast.error('Please add at least one parameter');
      return;
    }

    const invalidParams = parameters.filter(
      p => !p.name || p.value === ''
    );

    if (invalidParams.length > 0) {
      toast.error('Please fill in all parameter names and values');
      return;
    }

    // Create new entry
    const newEntry = {
      id: generateId(),
      date,
      parameters: parameters.map(p => ({
        id: p.id,
        name: p.name,
        value: isNaN(parseFloat(p.value)) ? p.value : parseFloat(p.value)
      }))
    };

    // Add entry and notify
    addEntry(newEntry);
    toast.success('Data saved successfully!');

    // Reset form with one empty parameter
    setParameters([{ id: generateId(), name: 'Weight', value: '' }]);
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${animationClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Data Input
          </div>
          <h2 className="text-3xl font-bold mb-4">Track Your Metrics</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Record your daily metrics to start building your personal dataset. The more data you provide, the more accurate your analysis will be.
          </p>
        </div>

        <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Date selection */}
              <div className="md:col-span-4">
                <Label htmlFor="date" className="text-sm font-medium mb-2 block">
                  Date
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date || new Date());
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Parameter inputs */}
              <div className="md:col-span-8 space-y-4">
                {parameters.map((param, index) => (
                  <div key={param.id} className="flex space-x-2 items-start animate-fade-in">
                    <div className="flex-1">
                      <Label htmlFor={`param-name-${param.id}`} className="text-sm font-medium mb-2 block">
                        Parameter
                      </Label>
                      <Select
                        value={param.name}
                        onValueChange={(value) => handleParameterChange(param.id, 'name', value)}
                      >
                        <SelectTrigger id={`param-name-${param.id}`} className="w-full">
                          <SelectValue placeholder="Select parameter" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="max-h-[200px] overflow-y-auto z-50 bg-white">
                          {DEFAULT_PARAMETERS.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                          {/* Custom parameter option */}
                          <SelectItem value="custom" className="text-blue-600">
                            + Add Custom Parameter
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <Label htmlFor={`param-value-${param.id}`} className="text-sm font-medium mb-2 block">
                        Value
                      </Label>
                      <Input
                        id={`param-value-${param.id}`}
                        value={param.value}
                        onChange={(e) => handleParameterChange(param.id, 'value', e.target.value)}
                        placeholder="Enter value"
                        type="text"
                      />
                    </div>
                    
                    {parameters.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => handleRemoveParameter(param.id)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Custom parameter input */}
                {showCustomParamInput && (
                  <div className="flex space-x-2 items-center mt-4 animate-fade-in">
                    <Input
                      value={newParamName}
                      onChange={(e) => setNewParamName(e.target.value)}
                      placeholder="New parameter name"
                      className="flex-1"
                    />
                    <Button onClick={handleAddCustomParam} variant="secondary">
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCustomParamInput(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}

                {/* Add parameter button */}
                <div className="flex space-x-4 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleAddParameter}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Parameter
                  </Button>
                  
                  {!showCustomParamInput && (
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomParamInput(true)}
                      className="flex items-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Custom Parameter
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-8">
                <Save className="mr-2 h-4 w-4" />
                Save Data
              </Button>
            </div>

            {!user.isLoggedIn && user.guestEntriesCount > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p>
                  <strong>Guest mode:</strong> You've recorded {user.guestEntriesCount}/7 entries. Create an account to save unlimited data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table Section */}
        <div className="mt-12">
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
