import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  calculateCorrelation,
  getUniqueParameters,
  generateAnalysisText,
  formatDate,
} from "@/utils/dataUtils";
import { toast } from "sonner";

const Analysis: React.FC = () => {
  const { dataEntries, setActiveSection } = useData();
  const [parameter1, setParameter1] = useState<string>("");
  const [parameter2, setParameter2] = useState<string>("");
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimationClass("animate-slide-in-up");
  }, []);

  useEffect(() => {
    if (dataEntries.length === 0) {
      setParameter1("");
      setParameter2("");
      setCorrelation(null);
      setAnalysisText("");
      setChartData([]);
    } else {
      const uniqueParams = getUniqueParameters(dataEntries);
      if (uniqueParams.length > 0 && !parameter1) {
        setParameter1(uniqueParams[0]);
      }
    }
  }, [dataEntries, parameter1]);

  useEffect(() => {
    if (parameter1 && parameter2 && dataEntries.length > 0) {
      const newChartData = dataEntries.map((entry) => {
        const param1Value =
          entry.parameters.find((p) => p.name === parameter1)?.value || null;
        const param2Value =
          entry.parameters.find((p) => p.name === parameter2)?.value || null;

        return {
          date: formatDate(entry.date),
          [parameter1]: param1Value,
          [parameter2]: param2Value,
        };
      });

      setChartData(newChartData);

      const correlationValue = calculateCorrelation(
        dataEntries,
        parameter1,
        parameter2
      );
      setCorrelation(correlationValue);

      const text = generateAnalysisText(
        correlationValue,
        parameter1,
        parameter2
      );
      setAnalysisText(text);
    }
  }, [parameter1, parameter2, dataEntries]);

  if (dataEntries.length < 2) {
    return (
      <div className={`min-h-screen pt-24 pb-16 px-4 ${animationClass}`}>
        {/* ... ваш код для выпадку, калі дадзеных недастаткова ... */}
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${animationClass}`}>
      {/* ... ваш код для выпадку, калі дадзеных дастаткова ... */}
    </div>
  );
};

export default Analysis;
