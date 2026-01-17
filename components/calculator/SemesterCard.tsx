"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { Semester, Subject } from "../../lib/types";
import SubjectItem from "./SubjectItem";
import { exportData, importData } from "../../lib/utils";
import AddTab from "../icons/AddTab";
import {
  Plus,
  SquareDashed,
  RotateCcw,
  Import,
  Download,
  Save,
  Trash2,
  EllipsisVertical,
  Copy,
} from "lucide-react";
import NavArrowDown from "../icons/NavArrowDown";
import { useNotification } from "../../components/ui/NotificationProvider";

interface SemesterCardProps {
  semester: Semester;
  onUpdate: (updated: Semester) => void;
  onDelete: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onSave: () => void;
}

export default function SemesterCard({
  semester,
  onUpdate,
  onDelete,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
  onSave,
}: SemesterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubjectSelectMode, setIsSubjectSelectMode] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set()
  );

  const { notify } = useNotification();

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

  // GWA Calculation Logic
  const { gwa, totalUnits } = useMemo(() => {
    let weightedSum = 0;
    let validUnits = 0;

    semester.subjects.forEach((subj) => {
      // Exclude INC and Dropped
      if (subj.isInc || subj.isDropped) return;
      // Exclude incomplete data
      if (!subj.grade || !subj.units) return;

      weightedSum += subj.grade * subj.units;
      validUnits += subj.units;
    });

    const calculatedGwa = validUnits > 0 ? weightedSum / validUnits : 0;
    // Round to 4 decimal places
    return {
      gwa: Math.round(calculatedGwa * 10000) / 10000,
      totalUnits: validUnits,
    };
  }, [semester.subjects]);

  const addSubject = () => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      code: "",
      description: "",
      units: 0,
      grade: 0,
      isInc: false,
      isDropped: false,
    };
    onUpdate({
      ...semester,
      subjects: [...semester.subjects, newSubject],
    });
  };

  const updateSubject = (index: number, updatedSubj: Subject) => {
    const newSubjects = [...semester.subjects];
    newSubjects[index] = updatedSubj;
    onUpdate({ ...semester, subjects: newSubjects });
  };

  const deleteSubject = (index: number) => {
    const newSubjects = semester.subjects.filter((_, i) => i !== index);
    onUpdate({ ...semester, subjects: newSubjects });
  };

  // Reset function for dropdown
  const resetSemester = () => {
    onUpdate({ ...semester, subjects: [] });
  };

  const toggleSubjectSelectMode = () => {
    setIsSubjectSelectMode(!isSubjectSelectMode);
    setSelectedSubjects(new Set());
  };

  const toggleSubjectSelection = (subjectId: string) => {
    const newSelected = new Set(selectedSubjects);
    if (newSelected.has(subjectId)) {
      newSelected.delete(subjectId);
    } else {
      newSelected.add(subjectId);
    }
    setSelectedSubjects(newSelected);
  };

  const deleteSelectedSubjects = () => {
    const newSubjects = semester.subjects.filter(
      (subj) => !selectedSubjects.has(subj.id)
    );
    onUpdate({ ...semester, subjects: newSubjects });
    setSelectedSubjects(new Set());
    setIsSubjectSelectMode(false);
  };

  const handleExport = () => {
    exportData(semester, `${semester.name}.json`);
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
        Array.isArray(importedData.subjects)
      ) {
        onUpdate({ ...semester, ...importedData, id: semester.id }); // Keep original ID
        notify("Semester imported!", "success");
      } else {
        notify("Invalid semester file", "error");
      }
    } catch (error) {
      console.error("Import error:", error);
      notify("Failed to import file", "error");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full bg-muted border border-black rounded-xl shadow-sm mb-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".json"
      />
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 bg-gray-50/50 border-black rounded-t-xl ${isExpanded ? "border-b" : "rounded-b-xl"}`}>
        <div className="flex items-center gap-4">
          {isSelectMode ? (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          ) : (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <NavArrowDown
                className={`w-5 h-5 transition-transform duration-300 text-foreground ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
          <h3 className="text-lg font-bold text-foreground">{semester.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Visual Action Bar (like in design) */}
          <div className="flex items-center bg-white border border-foreground rounded-lg mr-2 relative ">
            {isExpanded && (
              <>
                <button
                  onClick={addSubject}
                  className="flex border-r items-center gap-1 px-3 py-2 hover:bg-gray-50 hover:rounded-l-lg text-sm font-medium text-gray-700"
                >
                  <Plus size="16" />
                  <span className="hidden sm:inline">Add</span>
                </button>
                <button
                  onClick={resetSemester}
                  className="flex border-r items-center gap-1 px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700"
                >
                  <RotateCcw size={16} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={toggleSubjectSelectMode}
                  className={`flex border-r items-center gap-1 px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 ${
                    isSubjectSelectMode ? "bg-gray-100" : ""
                  }`}
                >
                  <SquareDashed size={16} />
                  <span className="hidden sm:inline">
                    {isSubjectSelectMode ? "Cancel" : "Select"}
                  </span>
                </button>
              </>
            )}
            <button
              ref={triggerRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-1 px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 ${
                isExpanded ? "hover:rounded-r-lg" : "hover:rounded-lg"
              }`}
            >
              <EllipsisVertical size={17} />
            </button>

            {/* Popup Menu */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute divide-y right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-foreground z-50 py-2 animate-in fade-in zoom-in-95 duration-200"
              >
                <button
                  onClick={() => {
                    onSave();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-sm px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <Save size={20} />
                  <span className="font-medium">Save</span>
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
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            {isSubjectSelectMode && selectedSubjects.size > 0 && (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={deleteSelectedSubjects}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  Delete Selected ({selectedSubjects.size})
                </button>
              </div>
            )}
            {semester.subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-medium">
                No subjects yet
              </div>
            ) : (
              semester.subjects.map((subj, index) => (
                <SubjectItem
                  key={subj.id}
                  subject={subj}
                  onChange={(updated) => updateSubject(index, updated)}
                  onDelete={() => deleteSubject(index)}
                  isSelectMode={isSubjectSelectMode}
                  isSelected={selectedSubjects.has(subj.id)}
                  onToggleSelect={() => toggleSubjectSelection(subj.id)}
                />
              ))
            )}
          </div>

          {/* GWA Results Bar */}
          <div className="mt-8 bg-white border-2 border-primary rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between text-primary shadow-[4px_4px_0px_0px_var(--primary)]">
            <div className="text-xl font-medium">
              Your GWA is <span className="font-bold">{gwa.toFixed(4)}</span>{" "}
              with <span className="font-bold">{totalUnits} units</span>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => {
                  const text = `Your GWA is ${gwa.toFixed(
                    4
                  )} with ${totalUnits} units`;
                  navigator.clipboard.writeText(text);
                  notify("Result copied to clipboard!", "success");
                }}
                className="bg-gray-100 hover:bg-primary p-2 rounded-lg transition-colors border border-primary group"
                title="Copy to clipboard"
              >
                <Copy size={18} className="text-primary group-hover:text-white"/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
