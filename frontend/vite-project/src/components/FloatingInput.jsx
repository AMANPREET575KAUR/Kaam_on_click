import { useState } from "react";

function FloatingInput({ label, type = "text", onChange, icon: Icon = null }) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
              focus ? "text-zinc-900" : "text-zinc-400"
            }`}
          >
            <Icon size={18} strokeWidth={1.5} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={handleChange}
          className={`w-full bg-zinc-50 border rounded-xl py-2.5 px-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all duration-150 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 ${
            Icon ? "pl-10" : ""
          } ${
            focus ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-300"
          }`}
          placeholder={label}
        />
      </div>
    </div>
  );
}

export default FloatingInput;