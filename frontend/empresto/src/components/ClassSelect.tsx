import { Icon } from '@iconify/react';
import {
  CLASS_GRADES,
  CLASS_LETTERS,
  parseClassValue,
  formatClassValue,
} from '../utils/classOptions';

interface ClassSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export default function ClassSelect({ value, onChange, disabled, error }: ClassSelectProps) {
  const { grade, letter } = parseClassValue(value);

  const handleGradeChange = (newGrade: string) => {
    onChange(formatClassValue(newGrade, newGrade ? letter : ''));
  };

  const handleLetterChange = (newLetter: string) => {
    onChange(formatClassValue(grade, newLetter));
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative flex-1 min-w-0">
          <select
            value={grade}
            onChange={(e) => handleGradeChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2.5 rounded-xl text-sm text-gray-800 outline-none appearance-none pr-7 transition-all truncate ${
              error
                ? 'border border-red-500 bg-red-50/30'
                : 'border border-transparent bg-gray-100/80 focus:bg-white focus:ring-2 focus:ring-emerald-800'
            } ${disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}`}
          >
            <option value="">Série...</option>
            <optgroup label="Fundamental">
              {CLASS_GRADES.slice(0, 9).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </optgroup>
            <optgroup label="Ensino Médio">
              {CLASS_GRADES.slice(9).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </optgroup>
          </select>
          <Icon
            icon="lucide:chevron-down"
            className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        <div className="relative w-16 shrink-0">
          <select
            value={letter}
            onChange={(e) => handleLetterChange(e.target.value)}
            disabled={disabled || !grade}
            className={`w-full px-2 py-2.5 rounded-xl text-sm text-center text-gray-800 outline-none appearance-none pr-5 transition-all ${
              error
                ? 'border border-red-500 bg-red-50/30'
                : 'border border-transparent bg-gray-100/80 focus:bg-white focus:ring-2 focus:ring-emerald-800'
            } ${disabled || !grade ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}`}
          >
            <option value="">-</option>
            {CLASS_LETTERS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <Icon
            icon="lucide:chevron-down"
            className="w-3.5 h-3.5 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}
