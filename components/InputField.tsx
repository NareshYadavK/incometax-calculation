
import React from 'react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon?: string;
  placeholder?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, value, onChange, icon = "₹", placeholder = "0", type = "number" 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-slate-500 sm:text-sm">{icon}</span>
        </div>
        <input
          type={type}
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full pl-7 pr-4 py-2 border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border transition-colors"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
