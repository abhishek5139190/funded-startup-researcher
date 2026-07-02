interface PillMultiSelectProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function PillMultiSelect({ label, options, selected, onChange }: PillMultiSelectProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
