"use client";
import { useState, useEffect } from "react";
import { useProjectData } from "../context/Context";

export default function CreateIssue({ toggleModal, projectId }) {
  const today = new Date();
  today.setHours(24);
  const { state, setState } = useProjectData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('TODO');
  const [taskType, setTaskType] = useState('FEATURE');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        if (json.data) {
          setTeamMembers(json.data);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchTeam();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const issueData = {
      title,
      description,
      deadline: `${deadline}T00:00:00.000Z`,
      status,
      taskType,
      priority,
      assignees,
    };

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        setState(!state);
        toggleModal();
      } else {
        alert("Error creating task");
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAssignee = (userId) => {
    if (assignees.includes(userId)) {
      setAssignees(assignees.filter(id => id !== userId));
    } else {
      setAssignees([...assignees, userId]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4" onClick={toggleModal}>
      <div className="rounded-2xl border w-full max-w-lg overflow-y-auto max-h-[90vh] custom-scrollbar shadow-2xl transition-all duration-200
        dark:bg-slate-900 dark:border-slate-800
        light:bg-white light:border-slate-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b dark:border-slate-800/60 light:border-slate-200/60">
          <h2 className="text-base font-bold dark:text-slate-100 light:text-slate-800">Create Task</h2>
          <button onClick={toggleModal} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Type</label>
              <select className="w-full p-2.5 rounded-lg text-sm focus:outline-none border
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200
                light:bg-slate-50 light:border-slate-200 light:text-slate-700" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                <option value="FEATURE">Feature</option>
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="ISSUE">Issue</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</label>
              <select className="w-full p-2.5 rounded-lg text-sm focus:outline-none border
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200
                light:bg-slate-50 light:border-slate-200 light:text-slate-700" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Title</label>
            <input
              type="text"
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none border
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-600
                light:bg-slate-50 light:border-slate-200 light:text-slate-800 light:placeholder-slate-400"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none border min-h-[80px] resize-none
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-600
                light:bg-slate-50 light:border-slate-200 light:text-slate-800 light:placeholder-slate-400"
              placeholder="Describe the details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Deadline</label>
            <input
              type="date"
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none border
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200
                light:bg-slate-50 light:border-slate-200 light:text-slate-800"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={today.toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Assignees */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Assign To ({assignees.length} selected)
            </label>
            <div className="border rounded-lg p-2 max-h-[140px] overflow-y-auto custom-scrollbar space-y-1
              dark:bg-slate-950 dark:border-slate-800
              light:bg-slate-50 light:border-slate-200">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <label key={member.id} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all text-sm ${
                    assignees.includes(member.id)
                      ? 'bg-blue-600/10 dark:bg-blue-500/10 border dark:border-blue-500/30 border-blue-200'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                  }`}>
                    <input
                      type="checkbox"
                      checked={assignees.includes(member.id)}
                      onChange={() => toggleAssignee(member.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                      assignees.includes(member.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 text-transparent'
                    }`}>
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium block truncate dark:text-slate-200 light:text-slate-800">{member.name}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">{member.email}</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400 light:bg-white light:border-slate-200 light:text-slate-500">
                      {member.role}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Loading team...</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={toggleModal}
              className="px-4 py-2 text-sm font-medium border rounded-lg transition-all
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200
                light:bg-white light:border-slate-200 light:text-slate-600 light:hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all disabled:opacity-50"
              disabled={loading}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
