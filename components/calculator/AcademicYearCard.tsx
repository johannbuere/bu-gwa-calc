"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AcademicYear, Semester } from "../../lib/types";
import SemesterCard from "./SemesterCard";
import { exportData, importData } from "../../lib/utils";
import MenuLeft from "../icons/MenuLeft";
import AddTab from "../icons/AddTab";
import NavArrowDown from "../icons/NavArrowDown";
import {
  SquareMenu,
  Plus,
  SquareDashed,
  RotateCcw,
  Import,
  Download,
  Save,
  Trash2,
  EllipsisVertical,
} from "lucide-react";

interface AcademicYearCardProps {
  academicYear: AcademicYear;
  onUpdate: (updated: AcademicYear) => void;
  onDelete: () => void;
  isGlobalSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onSave: () => void;
}

export default function AcademicYearCard({
  academicYear,
  onUpdate,
  onDelete,
  isGlobalSelectMode = false,
  isSelected = false,
  onToggleSelect,
  onSave,
}: AcademicYearCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedSemesters, setSelectedSemesters] = useState<Set<string>>(
    new Set()
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const addSemester = () => {
    const semesterCount = academicYear.semesters.length;
    let semesterName = "1st Semester";
    if (semesterCount === 1) semesterName = "2nd Semester";
    else semesterName = `${semesterCount + 1}th Semester`;

    const newSemester: Semester = {
      id: crypto.randomUUID(),
      name: semesterName,
      subjects: [
        {
          id: crypto.randomUUID(),
          code: "",
          description: "",
          units: 0,
          grade: 0,
          isInc: false,
          isDropped: false,
        },
      ],
    };

    onUpdate({
      ...academicYear,
      semesters: [...academicYear.semesters, newSemester],
    });
  };

  const updateSemester = (index: number, updatedSem: Semester) => {
    const newSemesters = [...academicYear.semesters];
    newSemesters[index] = updatedSem;
    onUpdate({ ...academicYear, semesters: newSemesters });
  };

  const deleteSemester = (index: number) => {
    const newSemesters = academicYear.semesters.filter((_, i) => i !== index);
    onUpdate({ ...academicYear, semesters: newSemesters });
  };

  const resetAllSemesters = () => {
    onUpdate({ ...academicYear, semesters: [] });
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedSemesters(new Set());
  };

  const toggleSemesterSelection = (semesterId: string) => {
    const newSelected = new Set(selectedSemesters);
    if (newSelected.has(semesterId)) {
      newSelected.delete(semesterId);
    } else {
      newSelected.add(semesterId);
    }
    setSelectedSemesters(newSelected);
  };

  const deleteSelectedSemesters = () => {
    const newSemesters = academicYear.semesters.filter(
      (sem) => !selectedSemesters.has(sem.id)
    );
    onUpdate({ ...academicYear, semesters: newSemesters });
    setSelectedSemesters(new Set());
    setIsSelectMode(false);
  };

  const handleExport = () => {
    exportData(academicYear, `${academicYear.name}.json`);
    setIsMenuOpen(false);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importData(file);
      // Validate imported data (basic check)
      if (
        importedData &&
        typeof importedData.name === "string" &&
        Array.isArray(importedData.semesters)
      ) {
        onUpdate({ ...academicYear, ...importedData, id: academicYear.id }); // Keep ID
      } else {
        alert("Invalid academic year file");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import file");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full bg-white border border-foreground rounded-lg shadow-sm mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".json"
      />
      {/* Header */}
      <div
        className={`flex border-b border-gray-300 items-center justify-between px-3 py-3 sm:px-6 sm:py-4 bg-white
          text-white ${
          isExpanded ? "rounded-t-xl" : "rounded-lg"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {isGlobalSelectMode ? (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          ) : (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isExpanded ? <MenuLeft className="fill-foreground" /> : <SquareMenu className="stroke-foreground" />}
            </button>
          )}
          {/* Academic Year Selector using custom UI instead of native select */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                onBlur={() =>
                  setTimeout(() => setIsYearDropdownOpen(false), 200)
                } // Delay to allow click
                className="flex items-center gap-2 bg-foreground hover:bg-backup-black px-2 py-1.5 sm:px-3 rounded-lg border border-foreground transition-colors font-bold tracking-wide text-sm sm:text-base"
              >
                {academicYear.name}
                <NavArrowDown
                  className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${
                    isYearDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Custom Options Dropdown */}
              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                  {Array.from({ length: 31 }, (_, i) => {
                    const startYear = 2000 + i;
                    const endYear = startYear + 1;
                    const value = `${startYear}-${endYear}`;
                    const isSelected = academicYear.name === value;

                    return (
                      <button
                        key={startYear}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                          isSelected
                            ? "text-primary bg-primary/5"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          onUpdate({ ...academicYear, name: value });
                          setIsYearDropdownOpen(false);
                        }}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* Semester Count Badge */}
          <div className="text-backup-black px-2 py-1.5 sm:px-3 rounded-lg border border-backup-black font-bold text-sm shadow-sm whitespace-nowrap">
            {academicYear.semesters.length}<span className="hidden sm:inline"> Semesters</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Top Bar Actions */}
          <div className="flex items-center bg-white rounded-lg text-gray-800 border border-foreground relative">
            {isExpanded && (
              <>
                <button
                  onClick={addSemester}
                  className="flex border-r items-center gap-1 px-3 py-2 hover:bg-gray-100 hover:rounded-l-lg text-sm font-semibold group"
                >
                  <Plus size="17" />
                  <span className="hidden sm:inline">Add a Semester</span>
                </button>
                <button
                  onClick={resetAllSemesters}
                  className="flex border-r items-center gap-1 px-3 py-2 hover:bg-gray-100 text-sm font-semibold"
                >
                  <RotateCcw size="17" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={toggleSelectMode}
                  className={`flex border-r items-center gap-1 px-3 py-2 hover:bg-gray-100 text-sm font-semibold ${
                    isSelectMode ? "bg-gray-100" : ""
                  }`}
                >
                  <SquareDashed size="17" />
                  <span className="hidden sm:inline">
                    {isSelectMode ? "Cancel" : "Select"}
                  </span>
                </button>
              </>
            )}
            <button
              ref={triggerRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-gray-100 text-sm font-semibold ${
                isExpanded ? "hover:rounded-r-lg" : "hover:rounded-lg"
              }`}
            >
              <EllipsisVertical size="17" />
            </button>

            {/* Popup Menu */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute divide-y right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-foreground z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200"
              >
                <button
                  onClick={() => {
                    onSave();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-sm px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <Save size={20} />
                  <span className="font-medium">Save Academic Year</span>
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-sm px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <Import size={20} />
                  <span className="font-medium">Import</span>
                </button>
                <button
                  onClick={handleExport}
                  className="w-full text-left text-sm px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <Download size={20} />
                  <span className="font-medium">Export</span>
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-sm px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-500"
                >
                  <Trash2 size={20} />
                  <span className="font-medium">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-foreground bg-muted/30">
          {academicYear.semesters.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No semesters added yet.</p>
            </div>
          ) : (
            <>
              {isSelectMode && selectedSemesters.size > 0 && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={deleteSelectedSemesters}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <Trash2 size={18} />
                    Delete Selected ({selectedSemesters.size})
                  </button>
                </div>
              )}
              {academicYear.semesters.map((sem, index) => (
                <SemesterCard
                  key={sem.id}
                  semester={sem}
                  onUpdate={(updated) => updateSemester(index, updated)}
                  onDelete={() => deleteSemester(index)}
                  isSelectMode={isSelectMode}
                  isSelected={selectedSemesters.has(sem.id)}
                  onToggleSelect={() => toggleSemesterSelection(sem.id)}
                  onSave={onSave}
                />
              ))}
            </>
          )}
        </div>
      )}

    </div>
  );
}
