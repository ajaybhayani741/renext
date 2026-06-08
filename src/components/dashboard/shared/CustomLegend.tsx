import React from 'react';

interface CustomLegendProps {
  mapping: Record<string, string>; // Short label -> Long label
}

const CustomLegend: React.FC<CustomLegendProps> = ({ mapping }) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-2 border-t border-slate-100 justify-center">
      {Object.entries(mapping).map(([short, long]) => (
        <div key={short} className="flex items-center text-xs text-slate-600">
          <span className="font-bold mr-1 text-slate-800">{short}:</span>
          <span>{long}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
