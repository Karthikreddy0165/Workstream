"use client";
import { useState } from "react";

const UpdateStatus = ({ onClose, onCancel, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus || "IN_PROGRESS");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4" onClick={onCancel}>
      <div className="border rounded-2xl w-full max-w-xs shadow-2xl transition-all duration-200
        dark:bg-slate-900 dark:border-slate-800
        light:bg-white light:border-slate-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 pb-3 border-b dark:border-slate-800/60 light:border-slate-200/60">
          <h2 className="text-sm font-bold dark:text-slate-100 light:text-slate-800">Update Status</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            {[
              { value: "TODO", label: "To Do", color: "blue" },
              { value: "IN_PROGRESS", label: "In Progress", color: "amber" },
              { value: "DONE", label: "Completed", color: "emerald" }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                  status === option.value
                    ? 'bg-blue-600/10 dark:bg-blue-500/10 border-blue-600/30'
                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  status === option.value
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-slate-300 dark:border-slate-700'
                }`}>
                  {status === option.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-sm font-medium dark:text-slate-200 light:text-slate-800">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 text-xs font-medium border rounded-lg transition-all
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200
                light:bg-white light:border-slate-200 light:text-slate-600 light:hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onClose(status)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
