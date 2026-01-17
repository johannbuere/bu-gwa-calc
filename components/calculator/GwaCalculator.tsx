"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { AcademicYear, Session } from "../../lib/types";
import { exportData, importData } from "../../lib/utils";
import AcademicYearCard from "./AcademicYearCard";
import LatinGwaCalculator from "./LatinGwaCalculator";
import AddTab from "../icons/AddTab";
import {
  Plus,
  RotateCcw,
  SquareDashed,
  Import,
  Download,
  Trash2,
  Save,
  GraduationCap,
  LogOut,
} from "lucide-react";

export default function GwaCalculator() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [viewMode, setViewMode] = useState<"current" | "saved">("current");
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [selectedYearIds, setSelectedYearIds] = useState<Set<string>>(
    new Set()
  );




  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState("My Session");
  const [showLatinCalculator, setShowLatinCalculator] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem("bu-gwa-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Handle new format: Session[]
        if (Array.isArray(parsed) && parsed.length > 0 && "academicYears" in parsed[0]) {
            setSavedSessions(parsed);
        }
        // Handle legacy format: { timestamp, data } or AcademicYear[]
        else {
             // Migrate legacy data to a session
             let legacyYears: AcademicYear[] = [];
             let timestamp = Date.now();

             if (parsed.data && Array.isArray(parsed.data)) {
                 legacyYears = parsed.data;
                 timestamp = parsed.timestamp || timestamp;
             } else if (Array.isArray(parsed)) {
                 legacyYears = parsed;
             }

             if (legacyYears.length > 0) {
                 const migratedSession: Session = {
                     id: crypto.randomUUID(),
                     createdAt: timestamp,
                     name: "Restored Session",
                     academicYears: legacyYears
                 };
                 setSavedSessions([migratedSession]);
             }
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveToLocalStorage = () => {
    // Check if we are updating an existing session
    const existingIndex = activeSessionId 
        ? savedSessions.findIndex(s => s.id === activeSessionId)
        : -1;

    let newSessions = [...savedSessions];
    let sessionIdToUse = activeSessionId || crypto.randomUUID();

    const currentSessionData: Session = {
        id: sessionIdToUse,
        createdAt: existingIndex !== -1 ? savedSessions[existingIndex].createdAt : Date.now(), // Keep original creation time if updating
        name: sessionName, // Use current editable name
        academicYears: academicYears
    };

    if (existingIndex !== -1) {
        // Update existing
        newSessions[existingIndex] = currentSessionData;
        alert("Existing session updated!");
    } else {
        // Create new
        newSessions.push(currentSessionData);
        setActiveSessionId(sessionIdToUse);
        alert("New session saved!");
    }
    
    localStorage.setItem("bu-gwa-data", JSON.stringify(newSessions));
    setSavedSessions(newSessions);
  };

  const restoreSession = (session: Session) => {
    setAcademicYears(session.academicYears);
    setActiveSessionId(session.id);
    setSessionName(session.name || "Restored Session");
    setViewMode("current");
    alert("Session restored to workspace!");
  };

  const clearSavedData = () => {
    if (confirm("Are you sure you want to delete all saved sessions?")) {
      localStorage.removeItem("bu-gwa-data");
      setSavedSessions([]);
    }
  };

  const deleteSession = (sessionId: string) => {
      if(confirm("Delete this session?")) {
          const newSessions = savedSessions.filter(s => s.id !== sessionId);
          localStorage.setItem("bu-gwa-data", JSON.stringify(newSessions));
          setSavedSessions(newSessions);
          
          if (activeSessionId === sessionId) {
              setActiveSessionId(null);
          }
      }
  }

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

  const closeSession = () => {
      // Just unload the workspace, don't delete/modify saved data
      setAcademicYears([]);
      setActiveSessionId(null);
      setSessionName("My Session");
  };

  const resetAllYears = () => {
    if(confirm("Resetting workspace will disconnect from the current saved session. Continue?")) {
        setAcademicYears([]);
        setActiveSessionId(null);
        setSessionName("My Session");
    }
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
      {/* Tab Switcher & Toggle Container */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex bg-navbg p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode("current")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "current"
                ? "bg-white text-navbg shadow-sm"
                : "text-white hover:text-white-100"
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setViewMode("saved")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "saved"
                ? "bg-white text-navbg shadow-sm"
                : "text-white hover:text-white-100"
            }`}
          >
            Saved
            {savedSessions.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  viewMode === "saved"
                    ? "bg-navbg/10 text-navbg"
                    : "bg-white text-navbg"
                }`}
              >
                {savedSessions.length}
              </span>
            )}
          </button>
        </div>

        {/* Latin Calculator Circular Toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold transition-colors ${showLatinCalculator ? "text-yellow-600" : "text-gray-500"}`}>
            Enable Latin Honor Calculator?
          </span>
          <button
            onClick={() => setShowLatinCalculator(!showLatinCalculator)}
            className={`h-11 w-11 rounded-full flex items-center justify-center transition-all shadow-md group ${
              showLatinCalculator
                ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400"
                : "bg-white text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
            }`}
            title={showLatinCalculator ? "Hide Latin Calculator" : "Show Latin Calculator"}
          >
            <GraduationCap size={22} className="transition-transform group-hover:scale-110" />
          </button>
        </div>  
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
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              >
                Clear All Sessions
              </button>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSessions.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                No saved sessions found.
              </div>
            ) : (
              savedSessions.map((session) => (
              // Saved Session Card
              <div key={session.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-secondary to-primary p-4 text-white">
                  <h3 className="font-bold text-lg truncate" title={session.name || "Saved Session"}>{session.name || "Saved Session"}</h3>
                  <p className="text-blue-100 text-xs">
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500">Academic Years</span>
                    <span className="font-semibold text-gray-800">
                      {session.academicYears.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500">Semesters</span>
                    <span className="font-semibold text-gray-800">
                      {session.academicYears.reduce(
                        (acc, ay) => acc + ay.semesters.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500">Subjects</span>
                    <span className="font-semibold text-gray-800">
                      {session.academicYears.reduce(
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
                    session.academicYears.forEach((ay) => {
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
                    onClick={() => deleteSession(session.id)}
                    className="flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => restoreSession(session)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Import size={14} /> Restore
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // CURRENT WORKSPACE VIEW
        <div className="bg-gray-50/50 border border-gray-200 rounded-3xl p-4 sm:p-6 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
            accept=".json"
          />

          {/* Session Header - Only visible when data exists */}
          {academicYears.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
               <div>
                   <input
                       type="text"
                       value={sessionName}
                       onChange={(e) => setSessionName(e.target.value)}
                       className="text-2xl sm:text-3xl font-bold text-foreground bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-300 focus:border-gray-300 rounded-lg px-2 -ml-2 w-full sm:w-auto min-w-[200px] placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                       placeholder="Untitled Session"
                   />
                   <p className="text-sm text-gray-500 px-2">Current Session</p>
               </div>
               <button
                  onClick={closeSession}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                  title="Close Session (Unload)"
               >
                  <LogOut size={16} />
                  Close Session
               </button>
            </div>
          )}

          {academicYears.length === 0 ? (
            // Empty State
        <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center py-20 px-4 text-center min-h-[400px]">
          <div className="bg-gray-50 p-4 rounded-full mb-6">
            <AddTab />
          </div>

          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Session Content
          </h3>
          <p className="text-gray-500 max-w-xs mb-8">
            Start your session by adding an academic year.
          </p>

          <button
            onClick={addAcademicYear}
            className="bg-foreground hover:bg-backup-black text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-gray-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-lg">+</span> Add Academic Year
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
    </div>
      )}

      {/* Render Latin Calculator Below Workspace */}
      {showLatinCalculator && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
               <GraduationCap size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-gray-800">Latin Honors Calculator</h3>
               <p className="text-sm text-gray-500">Calculate eligibility for Summa, Magna, and Cum Laude</p>
             </div>
           </div>
           
           <LatinGwaCalculator
              initialSession={{
                  id: activeSessionId || "temp",
                  createdAt: Date.now(),
                  name: sessionName,
                  academicYears: academicYears
              }}
              savedSessions={savedSessions}
              onBack={() => setShowLatinCalculator(false)}
              onLoadSession={restoreSession}
          />
        </div>
      )}
    </div>
  );
}
