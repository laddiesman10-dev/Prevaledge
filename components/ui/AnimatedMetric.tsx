
import React from 'react';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

interface AnimatedMetricProps {
  value: string;
  label: string;
}

const AnimatedMetric: React.FC<AnimatedMetricProps> = ({ value, label }) => {
  // Extract number and suffix (e.g., "+", "%")
  const numericValue = parseFloat(value.replace(/,/g, ''));
  const prefix = value.match(/^[+~-]/)?.[0] || '';
  const suffix = value.match(/%$/)?.[0] || '';
  
  const animatedValue = useAnimatedNumber(isNaN(numericValue) ? 0 : numericValue, 2000);

  return (
    <div className="flex flex-col">
      <p className="text-3xl sm:text-4xl font-bold text-blue-400">
        {prefix}
        {animatedValue.toLocaleString()}
        {suffix}
      </p>
      <p className="text-xs sm:text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
};

export default AnimatedMetric;
