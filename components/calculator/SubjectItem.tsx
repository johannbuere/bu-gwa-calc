"use client";

import { Subject } from "../../lib/types";
import { Trash2 } from "lucide-react";

interface SubjectItemProps {
  subject: Subject;
  onChange: (updated: Subject) => void;
  onDelete: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export default function SubjectItem({
  subject,
  onChange,
  onDelete,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
}: SubjectItemProps) {
  return (
    <div className="w-full bg-white border border-foreground border rounded-xl p-5 mb-4 shadow-sm relative transition-all hover:shadow-md grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-3 sm:block">
      {/* Top Row: Code, Units, Grade, Delete */}
      <div className="contents sm:flex sm:flex-row sm:items-center sm:gap-4 sm:mb-4">
        {isSelectMode && (
          <div className="flex items-center row-start-1 col-start-1 sm:row-auto sm:col-auto">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          </div>
        )}
        {/* Code Input */}
        <div className={`relative row-start-1 ${isSelectMode ? "col-start-2" : "col-start-1 col-span-2"} sm:col-span-1 sm:col-start-auto sm:row-start-auto`}>
          <input
            type="text"
            value={subject.code}
            onChange={(e) => onChange({ ...subject, code: e.target.value })}
            className="w-36 h-9 px-3 border border-gray-400 rounded text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 truncate"
            placeholder="CODE0001"
          />
        </div>

        {/* Units Input */}
        <div className="flex items-center gap-2 sm:ml-8 row-start-3 col-span-3 sm:col-span-1 sm:row-start-auto sm:col-start-auto">
          <span className="text-gray-700 text-sm font-medium">Units:</span>
          <input
            type="number"
            min="0"
            max="12"
            value={subject.units || ""}
            onChange={(e) =>
              onChange({ ...subject, units: parseFloat(e.target.value) || 0 })
            }
            className="w-16 h-9 px-1 border border-gray-400 rounded text-center text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Grade Input */}
        <div className="flex items-center gap-2 sm:ml-8 row-start-4 col-span-3 sm:col-span-1 sm:row-start-auto sm:col-start-auto">
          <span className="text-gray-700 text-sm font-medium">Grade:</span>
          <input
            type="number"
            min="1.0"
            max="5.0"
            step="0.1"
            value={subject.grade || ""}
            onChange={(e) =>
              onChange({ ...subject, grade: parseFloat(e.target.value) || 0 })
            }
            disabled={subject.isInc || subject.isDropped}
            className={`w-20 h-9 px-1 border border-gray-400 rounded text-center text-sm font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all ${
              subject.isInc || subject.isDropped
                ? "bg-gray-100 text-gray-400"
                : "text-foreground"
            }`}
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group row-start-1 col-start-3 sm:ml-auto sm:row-start-auto sm:col-start-auto"
          title="Remove Subject"
        >
          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Row: Subject Description & Status Toggles */}
      <div className="contents sm:flex sm:flex-row sm:items-start sm:gap-4">
        {/* Subject Description Input */}
        <input
          type="text"
          value={subject.description || ""}
          onChange={(e) =>
            onChange({ ...subject, description: e.target.value })
          }
          className="flex-1 w-full h-12 px-3 border border-gray-400 rounded text-3xl font-bold text-gray-800 placeholder-gray-400 outline-none focus:border-primary transition-all truncate row-start-2 col-span-3 sm:row-start-auto sm:col-start-auto"
          placeholder="Subject"
        />

        {/* Status Toggles (Radios style) */}
        <div className="flex flex-col gap-2 pt-1 sm:min-w-[100px] row-start-5 col-span-3 sm:row-start-auto sm:col-start-auto">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                subject.isInc
                  ? "border-black"
                  : "border-gray-500 group-hover:border-black"
              }`}
            >
              <input
                type="checkbox"
                checked={subject.isInc}
                onChange={(e) =>
                  onChange({
                    ...subject,
                    isInc: e.target.checked,
                    isDropped: e.target.checked ? false : subject.isDropped,
                  })
                }
                className="hidden"
              />
              {subject.isInc && (
                <div className="w-2.5 h-2.5 bg-black rounded-full" />
              )}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                subject.isInc ? "text-black" : "text-gray-600"
              }`}
            >
              INC
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                subject.isDropped
                  ? "border-black"
                  : "border-gray-500 group-hover:border-black"
              }`}
            >
              <input
                type="checkbox"
                checked={subject.isDropped}
                onChange={(e) =>
                  onChange({
                    ...subject,
                    isDropped: e.target.checked,
                    isInc: e.target.checked ? false : subject.isInc,
                  })
                }
                className="hidden"
              />
              {subject.isDropped && (
                <div className="w-2.5 h-2.5 bg-black rounded-full" />
              )}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                subject.isDropped ? "text-black" : "text-gray-600"
              }`}
            >
              Dropped
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
