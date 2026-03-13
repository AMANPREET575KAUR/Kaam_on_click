import { Check } from "lucide-react";

const ServiceSelector = ({ services, selectedServices, onToggle }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service);

          return (
            <button
              key={service}
              onClick={() => onToggle(service)}
              type="button"
              className={`rounded-lg px-3.5 py-1.5 text-sm transition-all duration-150 border flex items-center gap-1.5 ${
                isSelected
                  ? "border-zinc-900 bg-zinc-900 text-white font-medium"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              {service}
              {isSelected && <Check size={14} className="text-white" />}
            </button>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <p className="mt-2.5 text-xs text-zinc-500">
          {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

export default ServiceSelector;
