"use client";

import { useState, useRef, useEffect } from "react";
import { AcademicYear, Session } from "../../lib/types";
import { exportData, importData } from "../../lib/utils";
import AcademicYearCard from "./AcademicYearCard";
import LatinGwaCalculator from "./LatinGwaCalculator";
import SavedSessionCard from "./SavedSessionCard";
import LatinHonorToggle from "./LatinHonorToggle";
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
import { useNotification } from "../../components/ui/NotificationProvider";

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

  const { notify, confirmAction } = useNotification();




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
        
        if (Array.isArray(parsed) && parsed.length > 0 && "academicYears" in parsed[0]) {
            setSavedSessions(parsed);
        }
       
        else {
             
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
        createdAt: existingIndex !== -1 ? savedSessions[existingIndex].createdAt : Date.now(), 
        name: sessionName, 
        academicYears: academicYears
    };

    if (existingIndex !== -1) {
        newSessions[existingIndex] = currentSessionData;
        notify("Existing session updated!", "success");
    } else {
        newSessions.push(currentSessionData);
        setActiveSessionId(sessionIdToUse);
        notify("New session saved!", "success");
    }
    
    localStorage.setItem("bu-gwa-data", JSON.stringify(newSessions));
    setSavedSessions(newSessions);
  };

  const restoreSession = (session: Session) => {
    setAcademicYears(session.academicYears);
    setActiveSessionId(session.id);
    setSessionName(session.name || "Restored Session");
    setViewMode("current");
    notify("Session restored to workspace!", "info");
  };

  const clearSavedData = () => {
    confirmAction("Are you sure you want to delete all saved sessions?", () => {
      localStorage.removeItem("bu-gwa-data");
      setSavedSessions([]);
      notify("All saved sessions cleared.", "success");
    });
  };

  const deleteSession = (sessionId: string) => {
      confirmAction("Delete this session?", () => {
          const newSessions = savedSessions.filter(s => s.id !== sessionId);
          localStorage.setItem("bu-gwa-data", JSON.stringify(newSessions));
          setSavedSessions(newSessions);
          
          if (activeSessionId === sessionId) {
              setActiveSessionId(null);
          }
          notify("Session deleted.", "success");
      });
  }

  const addAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    let nextName = `${currentYear}-${currentYear + 1}`;

    if (academicYears.length > 0) {
      const last = academicYears[academicYears.length - 1];
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
      setAcademicYears([]);
      setActiveSessionId(null);
      setSessionName("My Session");
  };

  const resetAllYears = () => {
    confirmAction("Resetting workspace will disconnect from the current saved session. Continue?", () => {
        setAcademicYears([]);
        setActiveSessionId(null);
        setSessionName("My Session");
        notify("Workspace reset.", "info");
    });
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
        notify("Data imported successfully", "success");
      } else {
        notify("Invalid file format", "error");
      }
    } catch (error) {
      console.error(error);
      notify("Failed to import", "error");
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
              <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-black rounded-xl bg-gray-50">
                No saved sessions found.
              </div>
            ) : (
              savedSessions.map((session) => (
              // Saved Session Card
                <SavedSessionCard
                  key={session.id}
                  session={session}
                  onDelete={deleteSession}
                  onRestore={restoreSession}
                />
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

          {/* Session Header */}
          {academicYears.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
               <div>
                   <input
                       type="text"
                       value={sessionName}
                       onChange={(e) => setSessionName(e.target.value)}
                       className="text-2xl sm:text-3xl font-bold text-foreground bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-300 focus:border-gray-300 rounded-lg px-2 -ml-2 w-full sm:w-auto min-w-[200px] placeholder-gray-400"
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

      {/* Toggle Section */}
      <LatinHonorToggle 
        isEnabled={showLatinCalculator} 
        onToggle={() => setShowLatinCalculator(!showLatinCalculator)} 
      />

      {/* Render Latin Calculator Below Workspace */}
      {showLatinCalculator && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
