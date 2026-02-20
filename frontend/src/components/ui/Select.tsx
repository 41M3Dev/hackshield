import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full rounded-lg border px-4 py-2.5 text-sm
            bg-white dark:bg-slate-800/60
            text-slate-900 dark:text-slate-100
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-400 dark:border-red-500'
              : 'border-slate-300 dark:border-slate-600'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
