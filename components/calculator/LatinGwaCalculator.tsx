"use client";

import { useState, useEffect } from "react";
import { Session, AcademicYear } from "../../lib/types";
import { X, Trophy, AlertTriangle, Link as LinkIcon, Edit, Copy, BadgePlus, BadgeMinus, ChevronDown, ChevronRight } from "lucide-react";
import LatinHonorResults from "./LatinHonorResults";

interface LatinGwaCalculatorProps {
  initialSession: Session;
  savedSessions: Session[];
  onLoadSession: (session: Session) => void;
  // onBack prop removed as it's no longer needed for the header
  onBack?: () => void; // Keeping optional if needed for compatibility, but mainly unused now
}

export default function LatinGwaCalculator({
  initialSession,
  savedSessions,
  onLoadSession,
}: LatinGwaCalculatorProps) {
  const [data, setData] = useState<AcademicYear[]>([]);
  const [isFreeStyle, setIsFreeStyle] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  
  // Modals
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSavedSessionPicker, setShowSavedSessionPicker] = useState(false);

  // Collapsible State (Tracking COLLAPSED items so default is EXPANDED)
  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(new Set());
  const [collapsedSemesters, setCollapsedSemesters] = useState<Set<string>>(new Set());

  const toggleYear = (id: string) => {
    const newCollapsed = new Set(collapsedYears);
    if (newCollapsed.has(id)) newCollapsed.delete(id);
    else newCollapsed.add(id);
    setCollapsedYears(newCollapsed);
  };

  const toggleSemester = (id: string) => {
    const newCollapsed = new Set(collapsedSemesters);
    if (newCollapsed.has(id)) newCollapsed.delete(id);
    else newCollapsed.add(id);
    setCollapsedSemesters(newCollapsed);
  };

  // Removed automatic sync effect to satisfy user requirement:
  // "The Session is also NOT automatically Linked"
  // BUT: "It should only be ONE TIME of linking and everythings synce up to the current session"
  useEffect(() => {
    if (isLinked && !isFreeStyle && initialSession) {
      setData(initialSession.academicYears);
    }
  }, [initialSession, isLinked, isFreeStyle]);

  // --- Logic ---

  const calculateOverallGWA = () => {
    if (!isLinked && !isFreeStyle) return { gwa: 0, totalUnits: 0, hasFailure: false };
    
    let totalUnits = 0;
    let weightedSum = 0;
    let hasFailure = false;

    data.forEach((ay) => {
      ay.semesters.forEach((sem) => {
        sem.subjects.forEach((sub) => {
          if (sub.grade > 0 && sub.units > 0 && !sub.isDropped && !sub.isInc) {
            totalUnits += sub.units;
            weightedSum += sub.grade * sub.units;

            // Check failures
            if (sub.grade > 3.0) {
              hasFailure = true;
            }
          }
           if(sub.grade > 3.0 && sub.grade <= 5.0) {
              hasFailure = true;
           }
        });
      });
    });

    const gwa = totalUnits > 0 ? weightedSum / totalUnits : 0;
    return { gwa, totalUnits, hasFailure };
  };

  const getLatinHonor = (gwa: number, hasFailure: boolean) => {
    if (gwa === 0) return null;
    if (hasFailure) return { title: "Disqualified", color: "text-red-500", message: "Grade lower than 3.0 found." };

    if (gwa <= 1.25) return { title: "SUMMA CUM LAUDE", color: "text-blue-500", message: "Highest Honors" };
    if (gwa <= 1.45) return { title: "MAGNA CUM LAUDE", color: "text-blue-500", message: "High Honors" };
    if (gwa <= 1.75) return { title: "CUM LAUDE", color: "text-blue-500", message: "Honors" };

    return { title: "No Honors", color: "text-gray-500", message: "GWA requirement not met." };
  };

  const { gwa, totalUnits, hasFailure } = calculateOverallGWA();
  const honor = getLatinHonor(gwa, hasFailure);

  // --- Handlers ---

  const handleLinkToCurrent = () => {
    // Re-link to the workspace session
    setIsFreeStyle(false);
    setIsLinked(true);
    setData(initialSession.academicYears);
    setShowLinkModal(false);
  };

  const handleLinkFromSaved = () => {
    setShowLinkModal(false);
    setShowSavedSessionPicker(true);
  };

  const handleLoadSavedSession = (session: Session) => {
    onLoadSession(session);
    setIsFreeStyle(false); 
    setIsLinked(true);
    setData(session.academicYears); 
    setShowSavedSessionPicker(false);
  };

  const handleEditConfirm = () => {
    setIsFreeStyle(true);
    setShowEditModal(false);
    if (data.length === 0) {
       setData([{
          id: crypto.randomUUID(),
          name: "1st Year",
          semesters: [
              { id: crypto.randomUUID(), name: "First Semester", subjects: [] }
          ]
       }]);
    }
  };
  
  const updateSemesterOverride = (ayIndex: number, semIndex: number, field: 'gwa' | 'units', value: number) => {
      const newData = [...data];
      const semester = newData[ayIndex].semesters[semIndex];
      
      const currentUnits = semester.subjects.reduce((acc, s) => acc + s.units, 0);
      const currentGwa = currentUnits > 0 ? (semester.subjects.reduce((acc, s) => acc + (s.grade * s.units), 0) / currentUnits) : 0;
      
      const newUnits = field === 'units' ? value : currentUnits;
      const newGwa = field === 'gwa' ? value : currentGwa;

      semester.subjects = [{
          id: crypto.randomUUID(),
          code: "MANUAL",
          description: "Manual Entry",
          units: newUnits,
          grade: newGwa,
          isInc: false,
          isDropped: false
      }];
      
      setData(newData);
  };

  const addYear = () => {
      const name = `${data.length + 1}${getOrdinalSuffix(data.length + 1)} Year`;
      setData([...data, {
          id: crypto.randomUUID(),
          name: name,
          semesters: [{ id: crypto.randomUUID(), name: "First Semester", subjects: [] }]
      }]);
  };

  const deleteYear = (ayIndex: number) => {
      const newData = [...data];
      newData.splice(ayIndex, 1);
      setData(newData);
  };
  
  const addSemester = (ayIndex: number) => {
      const newData = [...data];
      const semCount = newData[ayIndex].semesters.length;
      let semName = "Next Semester";
      if (semCount === 0) semName = "First Semester";
      else if (semCount === 1) semName = "Second Semester";
      else if (semCount === 2) semName = "Summer";

      newData[ayIndex].semesters.push({
          id: crypto.randomUUID(),
          name: semName,
          subjects: []
      });
      setData(newData);
  };

  const deleteSemester = (ayIndex: number, semIndex: number) => {
      const newData = [...data];
      newData[ayIndex].semesters.splice(semIndex, 1);
      setData(newData);
  };

  // Helper
  const getOrdinalSuffix = (i: number) => {
      const j = i % 10, k = i % 100;
      if (j == 1 && k != 11) return "st";
      if (j == 2 && k != 12) return "nd";
      if (j == 3 && k != 13) return "rd";
      return "th";
  }


  return (
    <div className="w-full max-w-5xl">
       {/* Header Section */}
       <div className="mb-6">

          <h2 className="text-3xl font-bold text-foreground">
            Latin Honor Calculator
          </h2>
          <p className="text-gray-600">
            Compute your final GWA and instantly check your Latin honor 
          </p>
          <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-border drop-shadow-sm hover:bg-gray-100 text-gray-800 rounded-lg font-bold transition-colors shadow-sm"
              >
                  <LinkIcon size={18} />
                  Link to a Session
              </button>
              <button 
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-border 
                drop-shadow-sm hover:bg-gray-100 text-gray-800 rounded-lg font-bold transition-colors shadow-sm"
              >
                  <Edit size={18} />
                  {isFreeStyle ? "Editing Mode" : "Edit Grade"}
              </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Left Column: List (Data) */}
           <div className="md:col-span-2 space-y-6">
               {data.map((ay, ayIndex) => (
                   <div key={ay.id} className="border-2 border-black rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                       
                       {/* Year Header */}
                       <div 
                         className="flex justify-between items-center px-4 py-3 border-b-2 border-black bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                         onClick={() => toggleYear(ay.id)}
                       >
                           <div className="flex items-center gap-2">
                               {collapsedYears.has(ay.id) ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                               <h3 className="font-black text-xl text-black">{ayIndex + 1}{getOrdinalSuffix(ayIndex + 1)} Year</h3>
                           </div>
                           
                           {isFreeStyle && (
                               <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                   <button 
                                     onClick={addYear}
                                     className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black border border-black rounded-md font-bold text-sm transition-all"
                                   >
                                       <BadgePlus size={16} />
                                       Add Year
                                   </button>
                                   <button 
                                     onClick={() => deleteYear(ayIndex)}
                                     className="p-1 hover:bg-red-50 text-black hover:text-red-600 transition-colors"
                                     title="Remove Year"
                                   >
                                       <BadgeMinus size={20} />
                                   </button>
                               </div>
                           )}
                       </div>

                       {/* Year Content */}
                       {!collapsedYears.has(ay.id) && (
                       <div className="p-4 space-y-4">
                           {ay.semesters.map((sem, semIndex) => {
                               // Calculate display values
                               const semUnits = sem.subjects.reduce((acc, s) => acc + s.units, 0);
                               const semGwa = semUnits > 0 
                                   ? sem.subjects.reduce((acc, s) => acc + (s.grade * s.units), 0) / semUnits 
                                   : 0;

                               return (
                                   <div key={sem.id} className="border border-black rounded-lg overflow-hidden bg-blue-50/10">
                                       
                                       {/* Semester Header */}
                                       <div 
                                         className="flex justify-between items-center px-4 py-2 bg-blue-100/30 border-b border-black cursor-pointer hover:bg-blue-100/50 transition-colors"
                                         onClick={() => toggleSemester(sem.id)}
                                       >
                                           <div className="flex items-center gap-2">
                                               {collapsedSemesters.has(sem.id) ? <ChevronRight size={18} className="text-gray-700"/> : <ChevronDown size={18} className="text-gray-700"/>}
                                               <span className="font-bold text-gray-800">{sem.name}</span>
                                           </div>
                                           {isFreeStyle && (
                                               <button 
                                                 onClick={(e) => {
                                                   e.stopPropagation();
                                                   deleteSemester(ayIndex, semIndex);
                                                 }}
                                                 className="text-gray-500 hover:text-red-500 transition-colors"
                                               >
                                                   <BadgeMinus size={18} />
                                               </button>
                                           )}
                                       </div>

                                       {/* Semester Inputs */}
                                       {!collapsedSemesters.has(sem.id) && (
                                       <div className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="font-bold text-lg text-black">Grade</label>
                                                <input 
                                                    type="number" 
                                                    step="0.0001"
                                                    disabled={!isFreeStyle}
                                                    value={semGwa > 0 ? semGwa.toFixed(4) : ""} 
                                                    onChange={(e) => updateSemesterOverride(ayIndex, semIndex, 'gwa', parseFloat(e.target.value) || 0)}
                                                    className={`w-36 h-10 bg-white border border-gray-200 rounded text-center font-black text-xl text-black focus:ring-2 focus:ring-black focus:border-black ${isFreeStyle ? 'placeholder-gray-200' : ''}`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label className="font-bold text-lg text-black">Units</label>
                                                <input 
                                                    type="number" 
                                                    disabled={!isFreeStyle}
                                                    value={semUnits > 0 ? semUnits : ""}
                                                    onChange={(e) => updateSemesterOverride(ayIndex, semIndex, 'units', parseFloat(e.target.value) || 0)}
                                                    className={`w-36 h-10 bg-white border border-gray-200 rounded text-center font-black text-xl text-black focus:ring-2 focus:ring-black focus:border-black ${isFreeStyle ? 'placeholder-gray-200' : ''}`}
                                                    placeholder="0"
                                                />
                                            </div>
                                       </div>
                                       )}
                                   </div>
                               );
                           })}

                           {/* Add Semester Button */}
                           {isFreeStyle && (
                               <button 
                                onClick={() => addSemester(ayIndex)}
                                className="w-full py-2 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-black rounded-lg text-black font-bold transition-all active:scale-[0.99]"
                               >
                                   <BadgePlus size={18} />
                                   Add Semester
                               </button>
                           )}
                       </div>
                       )}
                   </div>
               ))}
               
               {/* Empty State */}
               {data.length === 0 && (
                   <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                       <p className="text-gray-400 font-medium mb-4 text-center">No academic data loaded. <br/>Either link your current session or edit manually</p>
                   </div>
               )}
           </div>

           {/* Right Column: Results */}
           <div className="md:col-span-1">
               <LatinHonorResults gwa={gwa} honor={honor} />
           </div>
       </div>


       {/* Modals */}

       {/* Link Session Modal */}
       {showLinkModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-xl border-2 border-black w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                       <h3 className="text-xl font-bold text-black  tracking-tight">Link to a Session</h3>
                       <button onClick={() => setShowLinkModal(false)} className="p-1 hover:bg-gray-200 rounded-lg border-2 border-transparent hover:border-black transition-all">
                           <X size={20} className="text-black"/>
                       </button>
                   </div>
                   <div className="p-6 space-y-6">
                       <button onClick={handleLinkToCurrent} className="w-full text-left group">
                           <div className="p-4 border-2 border-black rounded-xl bg-white group-hover:bg-blue-50 transition-all flex items-center gap-4 mb-2 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                               <div className="p-2 bg-blue-100 rounded-lg border-2 border-black">
                                   <LinkIcon size={20} className="text-black" />
                               </div>
                               <span className="font-bold text-lg text-black">Link to Current</span>
                           </div>
                           <p className="text-sm text-gray-600 pl-1">
                               The Latin Honor Calculator will be linked to the BU GWA Calculator session above
                           </p>
                       </button>
                       
                       <div className="border-t-2 border-dashed border-gray-200"></div>

                       <button onClick={handleLinkFromSaved} className="w-full text-left group">
                           <div className="p-4 border-2 border-black rounded-xl bg-white group-hover:bg-green-50 transition-all flex items-center gap-4 mb-2 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                               <div className="p-2 bg-green-100 rounded-lg border-2 border-black">
                                   <LinkIcon size={20} className="text-black" />
                               </div>
                               <span className="font-bold text-lg text-black">Link from Saved</span>
                           </div>
                           <p className="text-sm text-gray-600 pl-1">
                               Import a saved session into BU GWA Calculator. This enables The Latin Honor Calculator to compute that sessions overall GWA
                           </p>
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* Edit Grade Modal */}
       {showEditModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-xl border-2 border-black w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                       <h3 className="text-xl font-bold text-black  tracking-tight">Edit Grade</h3>
                       <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-200 rounded-lg border-2 border-transparent hover:border-black transition-all">
                           <X size={20} className="text-black"/>
                       </button>
                   </div>
                   
                   <div className="p-8 text-center">
                       <div className="w-16 h-16 bg-yellow-100 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6">
                           <Edit size={32} className="text-black" />
                       </div>
                       <p className="text-black text-lg font-medium leading-relaxed mb-8">
                           Enabling this will make the Latin Honor Calculator separate from the GWA Calculator. You may add your own years, semesters, units, and grades freely.
                       </p>
                   
                       <div className="flex gap-4">
                           <button 
                               onClick={handleEditConfirm}
                               className="flex-1 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg border-2 border-transparent hover:-translate-y-0.5 transition-all shadow-sm"
                           >
                               Continue
                           </button>
                           <button 
                               onClick={() => setShowEditModal(false)}
                               className="flex-1 py-3 bg-white hover:bg-gray-50 text-black font-bold rounded-lg border-2 border-black hover:-translate-y-0.5 transition-all shadow-sm"
                           >
                               Cancel
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Saved Session Picker (Reused logic roughly) */}
       {showSavedSessionPicker && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl border-2 border-black w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[80vh]">
               <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                   <h3 className="text-xl font-black text-black uppercase tracking-tight">Pick a Saved Session</h3>
                   <button onClick={() => setShowSavedSessionPicker(false)} className="p-1 hover:bg-gray-200 rounded-lg border-2 border-transparent hover:border-black transition-all">
                       <X size={20} className="text-black"/>
                   </button>
               </div>
               
               <div className="overflow-y-auto p-4 space-y-3 flex-1">
                   {savedSessions.length === 0 ? (
                       <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                           No saved sessions found.
                       </div>
                   ) : (
                       savedSessions.map(session => (
                           <button 
                             key={session.id}
                             onClick={() => handleLoadSavedSession(session)}
                             className="w-full text-left bg-white hover:bg-blue-50 border-2 border-black rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                           >
                               <div className="flex justify-between items-center mb-1">
                                   <span className="font-bold text-black text-lg">{session.name || "Untitled Session"}</span>
                                   <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded border border-black">{new Date(session.createdAt).toLocaleDateString()}</span>
                               </div>
                           </button>
                       ))
                   )}
               </div>
            </div>
         </div>
       )}

    </div>
  );
}
