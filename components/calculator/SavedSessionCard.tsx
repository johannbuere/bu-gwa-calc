"use client";

import { Session } from "../../lib/types";
import { Trash2, Import } from "lucide-react";

interface SavedSessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
  onRestore: (session: Session) => void;
}

export default function SavedSessionCard({
  session,
  onDelete,
  onRestore,
}: SavedSessionCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-black overflow-hidden group hover:bg-gray-50 transition-colors">
      <div className="bg-white p-4 border-b-2 border-black">
        <h3
          className="font-bold text-lg truncate text-foreground"
          title={session.name || "Saved Session"}
        >
          {session.name || "Saved Session"}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {new Date(session.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm py-1 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Academic Years</span>
          <span className="font-bold text-foreground">
            {session.academicYears.length}
          </span>
        </div>
        <div className="flex justify-between text-sm py-1 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Semesters</span>
          <span className="font-bold text-foreground">
            {session.academicYears.reduce(
              (acc, ay) => acc + ay.semesters.length,
              0
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm py-1 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Subjects</span>
          <span className="font-bold text-foreground">
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
          const overallGwa = totalUnits > 0 ? weightedSum / totalUnits : 0;
          return (
            <div className="flex justify-between text-sm py-1 pt-2 font-black text-primary">
              <span>Overall GWA</span>
              <span>
                {overallGwa.toFixed(4)} ({totalUnits} units)
              </span>
            </div>
          );
        })()}
      </div>
      <div className="p-4 bg-gray-50 border-t-2 border-black flex gap-3">
        <button
          onClick={() => onDelete(session.id)}
          className="flex-1 py-2.5 text-xs font-bold text-red-600 bg-white border-2 border-black hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} /> Delete
        </button>
        <button
          onClick={() => onRestore(session)}
          className="flex-1 py-2.5 text-xs font-bold text-white bg-black border-2 border-black hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Import size={14} /> Restore
        </button>
      </div>
    </div>
  );
}
