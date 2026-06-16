'use client';

import { Terminal } from 'lucide-react';

interface ParameterControlProps {
  dayOfWeek: string;
  scheduledMenu: string;
  expectedAttendance: number;
  weatherCondition: string;
  temperature: number;
  loading: boolean;
  onDayChange: (val: string) => void;
  onMenuChange: (val: string) => void;
  onAttendanceChange: (val: number) => void;
  onWeatherChange: (val: string) => void;
  onTemperatureChange: (val: number) => void;
  onSubmit: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEATHERS = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Hot', 'Cold', 'Mild', 'Windy'];

const MENU_SUGGESTIONS = [
  'Grilled chicken with rice and vegetables',
  'Pepperoni pizza with side salad',
  'Spaghetti with marinara and garlic bread',
  'Fresh salad bar with grilled chicken',
  'Turkey sandwich with soup of the day',
  'Beef tacos with rice and beans',
  'Fish filet with mashed potatoes',
  'Vegetable stir-fry with noodles',
  'Mac and cheese with broccoli',
  'Chicken tenders with french fries',
];

export function ParameterControl({
  dayOfWeek, scheduledMenu, expectedAttendance, weatherCondition, temperature,
  loading, onDayChange, onMenuChange, onAttendanceChange, onWeatherChange,
  onTemperatureChange, onSubmit,
}: ParameterControlProps) {
  return (
    <div className="terminal-panel animate-fade-in">
      <div className="terminal-header flex items-center gap-2">
        <Terminal className="h-3.5 w-3.5 text-emerald-500" />
        <span>Parameter Control Room</span>
        <span className="text-emerald-700 ml-auto text-[10px] tracking-normal">set input parameters</span>
      </div>
      <div className="terminal-content space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="day_of_week" className="terminal-label">
              <span className="text-emerald-500/50">$</span> day_of_week
            </label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={dayOfWeek}
              onChange={(e) => onDayChange(e.target.value)}
              className="terminal-select"
            >
              {DAYS.map((d) => (
                <option key={d} value={d} className="bg-gray-900 text-emerald-300">{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="weather_condition" className="terminal-label">
              <span className="text-emerald-500/50">$</span> weather_condition
            </label>
            <select
              id="weather_condition"
              name="weather_condition"
              value={weatherCondition}
              onChange={(e) => onWeatherChange(e.target.value)}
              className="terminal-select"
            >
              {WEATHERS.map((w) => (
                <option key={w} value={w} className="bg-gray-900 text-emerald-300">{w}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="scheduled_menu" className="terminal-label">
              <span className="text-emerald-500/50">$</span> scheduled_menu
            </label>
          <div className="flex gap-1 flex-wrap mb-2">
            {MENU_SUGGESTIONS.slice(0, 5).map((m) => (
              <button
                key={m}
                onClick={() => onMenuChange(m)}
                className={`text-[10px] px-2 py-0.5 border transition-colors ${
                  scheduledMenu === m
                    ? 'border-emerald-500/50 text-emerald-300 bg-emerald-700/20'
                    : 'border-emerald-800/30 text-emerald-600 hover:text-emerald-400 hover:border-emerald-700/50'
                }`}
              >
                {m.split(' ').slice(0, 3).join(' ')}...
              </button>
            ))}
          </div>
          <input
            id="scheduled_menu"
            name="scheduled_menu"
            type="text"
            value={scheduledMenu}
            onChange={(e) => onMenuChange(e.target.value)}
            placeholder="e.g., Grilled chicken with rice and vegetables"
            className="terminal-input"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="expected_attendance" className="terminal-label">
              <span className="text-emerald-500/50">$</span> expected_attendance <span className="text-emerald-600">[{expectedAttendance}]</span>
            </label>
            <input
              id="expected_attendance"
              name="expected_attendance"
              type="range"
              min={50}
              max={800}
              step={10}
              value={expectedAttendance}
              onChange={(e) => onAttendanceChange(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-emerald-500
                         [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(52,211,153,0.3)]"
            />
            <div className="flex justify-between text-[10px] text-emerald-700 mt-1">
              <span>50</span>
              <span>800</span>
            </div>
          </div>

          <div>
            <label htmlFor="temperature_f" className="terminal-label">
              <span className="text-emerald-500/50">$</span> temperature_f <span className="text-emerald-600">[{temperature}°F]</span>
            </label>
            <input
              id="temperature_f"
              name="temperature_f"
              type="range"
              min={20}
              max={110}
              step={1}
              value={temperature}
              onChange={(e) => onTemperatureChange(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-emerald-500
                         [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(52,211,153,0.3)]"
            />
            <div className="flex justify-between text-[10px] text-emerald-700 mt-1">
              <span>20°F</span>
              <span>110°F</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-emerald-800/20">
          <button
            onClick={onSubmit}
            disabled={loading || !scheduledMenu.trim()}
            className="terminal-btn-primary flex-1"
          >
            {loading ? (
              <>
                <span className="inline-block h-3 w-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>processing prediction...</span>
              </>
            ) : (
              <>
                <span className="text-emerald-500/70">&gt;</span>
                <span>run waste prediction</span>
                <span className="ml-2 text-[9px] text-emerald-700 border border-emerald-700/40 px-1 py-0.5">Ctrl+Enter</span>
              </>
            )}
          </button>
          <div className="text-[10px] text-emerald-700 text-right leading-tight">
            <div>ENGINE: LLAMA-3-8B</div>
            <div>MODE: FEW-SHOT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
