"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { AcademicYear } from "../../lib/types";
import { exportData, importData } from "../../lib/utils";
import AcademicYearCard from "./AcademicYearCard";
import AddTab from "../icons/AddTab";
import {
  Plus,
  RotateCcw,
  SquareDashed,
  Import,
  Download,
  Trash2,
  Save,
} from "lucide-react";

export default function GwaCalculator() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [viewMode, setViewMode] = useState<"current" | "saved">("current");
  const [savedAcademicYears, setSavedAcademicYears] = useState<AcademicYear[]>(
    []
  );
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [selectedYearIds, setSelectedYearIds] = useState<Set<string>>(
    new Set()
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem("bu-gwa-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Handle new format: { timestamp, data }
        if (parsed.data && Array.isArray(parsed.data)) {
          setSavedAcademicYears(parsed.data);
          setLastSaved(parsed.timestamp);
        }
        // Handle old format: Array directly
        else if (Array.isArray(parsed)) {
          setSavedAcademicYears(parsed);
          setLastSaved(null); // Unknown date
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveToLocalStorage = () => {
    const timestamp = Date.now();
    const dataToSave = {
      timestamp,
      data: academicYears,
    };
    localStorage.setItem("bu-gwa-data", JSON.stringify(dataToSave));
    setSavedAcademicYears(academicYears);
    setLastSaved(timestamp);
    alert("Progress saved locally!");
  };

  const restoreFromSaved = () => {
    setAcademicYears(savedAcademicYears);
    setViewMode("current");
    alert("Restored saved data to workspace!");
  };

  const clearSavedData = () => {
    if (confirm("Are you sure you want to delete your saved data?")) {
      localStorage.removeItem("bu-gwa-data");
      setSavedAcademicYears([]);
    }
  };

  const addAcademicYear = () => {
    // Determine next year logic
    const currentYear = new Date().getFullYear();
    let nextName = `${currentYear}-${currentYear + 1}`;

    if (academicYears.length > 0) {
      // Simple logic: take the last one and increment
      // Or just default to current. For now, let's just make it simple or allow edit?
      // Design shows dropdown for year. I'll just auto-gen for now.
      const last = academicYears[academicYears.length - 1];
      // Parse "YYYY-YYYY"
      const matches = last.name.match(/(\d{4})-(\d{4})/);
      if (matches) {
        const start = parseInt(matches[1]) + 1;
        const end = parseInt(matches[2]) + 1;
        nextName = `${start}-${end}`;
      }
    }

    const newAy: AcademicYear = {
      id: crypto.randomUUID(),
      name: nextName,
      semesters: [],
    };
    setAcademicYears([...academicYears, newAy]);
  };

  const updateAcademicYear = (index: number, updatedAy: AcademicYear) => {
    const newAys = [...academicYears];
    newAys[index] = updatedAy;
    setAcademicYears(newAys);
  };

  const deleteAcademicYear = (index: number) => {
    const newAys = academicYears.filter((_, i) => i !== index);
    setAcademicYears(newAys);
  };

  const resetAllYears = () => {
    setAcademicYears([]);
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedYearIds(new Set());
  };

  const toggleYearSelection = (id: string) => {
    const newSet = new Set(selectedYearIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedYearIds(newSet);
  };

  const deleteSelectedYears = () => {
    const newAys = academicYears.filter((ay) => !selectedYearIds.has(ay.id));
    setAcademicYears(newAys);
    setSelectedYearIds(new Set());
    setIsSelectMode(false);
  };

  const handleExport = () => {
    exportData({ academicYears }, "My_Grades_Education_Overview.json");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importData(file);
      if (data && Array.isArray(data.academicYears)) {
        setAcademicYears(data.academicYears);
      } else {
        alert("Invalid file format");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to import");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-4xl mt-8 mb-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">
          BU GWA Calculator
        </h2>
        <p className="text-gray-600">
          Calculate your General Weighted Average based on Bicol University
          standards
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setViewMode("current")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === "current"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Workspace
        </button>
        <button
          onClick={() => setViewMode("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === "saved"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Saved
          {savedAcademicYears.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              {savedAcademicYears.length}
            </span>
          )}
        </button>
      </div>

      {viewMode === "saved" ? (
        // SAVED DATA VIEW
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-backup-black">Saved Backup</h3>
              <p className="text-backup-black text-sm mt-1">
                This is data saved in your browser storage. Restore it to edit in
                your workspace.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={clearSavedData}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 hidden"
              >
                Clear Saved
              </button>
              <button
                onClick={restoreFromSaved}
                disabled={savedAcademicYears.length === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hidden"
              >
                <Import size={18} />
                Restore to Workspace
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedAcademicYears.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                No saved data found.
              </div>
            ) : (
              // Saved Session Card
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-secondary to-primary p-4 text-white">
                  <h3 className="font-bold text-lg">Saved Session</h3>
                  <p className="text-blue-100 text-xs">
                    {lastSaved
                      ? new Date(lastSaved).toLocaleString()
                      : "Unknown Date"}
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500">Academic Years</span>
                    <span className="font-semibold text-gray-800">
                      {savedAcademicYears.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500">Semesters</span>
                    <span className="font-semibold text-gray-800">
                      {savedAcademicYears.reduce(
                        (acc, ay) => acc + ay.semesters.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500">Subjects</span>
                    <span className="font-semibold text-gray-800">
                      {savedAcademicYears.reduce(
                        (acc, ay) =>
                          acc +
                          ay.semesters.reduce(
                            (sAcc, sem) => sAcc + sem.subjects.length,
                            0
                          ),
                        0
                      )}
                    </span>
                  </div>
                  {/* Calculate Overall Summary */}
                  {(() => {
                    let totalUnits = 0;
                    let weightedSum = 0;
                    savedAcademicYears.forEach((ay) => {
                      ay.semesters.forEach((sem) => {
                        sem.subjects.forEach((sub) => {
                          if (
                            !sub.isInc &&
                            !sub.isDropped &&
                            sub.units > 0 &&
                            sub.grade > 0
                          ) {
                            totalUnits += sub.units;
                            weightedSum += sub.grade * sub.units;
                          }
                        });
                      });
                    });
                    const overallGwa =
                      totalUnits > 0 ? weightedSum / totalUnits : 0;
                    return (
                      <div className="flex justify-between text-sm py-1 pt-2 font-bold text-primary">
                        <span>Overall GWA</span>
                        <span>
                          {overallGwa.toFixed(4)} ({totalUnits} units)
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={clearSavedData}
                    className="flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={restoreFromSaved}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Import size={14} /> Restore
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // CURRENT WORKSPACE VIEW
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
            accept=".json"
          />

          {academicYears.length === 0 ? (
            // Empty State
        // Empty State
        <div className="border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center py-20 px-4 text-center min-h-[500px]">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
            <AddTab />
          </div>

          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Academic Year Found
          </h3>
          <p className="text-gray-500 max-w-xs mb-8">
            Add an academic year to begin calculating your grades. Save
          </p>

          <button
            onClick={addAcademicYear}
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-lg">+</span> Add
          </button>
        </div>
      ) : (
        // List State
        <div className="flex flex-col gap-6">
          {/* Visual Action Bar */}
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={addAcademicYear}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add</span>
              </button>
              <button
                onClick={resetAllYears}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                title="Reset All"
              >
                <RotateCcw size={18} />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={toggleSelectMode}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors ${
                  isSelectMode ? "bg-gray-100 text-primary" : ""
                }`}
              >
                <SquareDashed size={18} />
                <span className="hidden sm:inline">
                  {isSelectMode ? "Cancel" : "Select"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isSelectMode && selectedYearIds.size > 0 ? (
                <button
                  onClick={deleteSelectedYears}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Delete Selected</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                  >
                    <Import size={18} />
                    <span className="hidden sm:inline">Import</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    onClick={saveToLocalStorage}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                  >
                    <Save size={18} />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {academicYears.map((ay, index) => (
            <AcademicYearCard
              key={ay.id}
              academicYear={ay}
              onUpdate={(updated) => updateAcademicYear(index, updated)}
              onDelete={() => deleteAcademicYear(index)}
              isGlobalSelectMode={isSelectMode}
              isSelected={selectedYearIds.has(ay.id)}
              onToggleSelect={() => toggleYearSelection(ay.id)}
              onSave={saveToLocalStorage}
            />
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
