"use client";
import { useRouter } from 'next/navigation';
import { useProjectData } from '../context/Context';
import { useState, useEffect } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';

const TaskCard = ({ task, onStatusChange }) => {
  const router = useRouter();
  const ending = task.title.length > 35 ? "..." : '';
  const displayTitle = task.title.slice(0, 35) + ending;

  const handleClick = () => {
    router.push(`/Routes/taskpage?taskId=${task.id}`);
  };

  return (
    <div 
      className="premium-card p-4 mb-4 cursor-pointer rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:-translate-y-0.5"
      onClick={handleClick}
    >
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-sm transition-all dark:text-slate-200 light:text-slate-800 dark:hover:text-blue-400 light:hover:text-blue-600">
            {displayTitle}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border
            dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400
            light:bg-slate-100 light:border-slate-200 light:text-slate-500">
            {task.taskType || "TASK"}
          </span>
        </div>
        
        {task.description && (
          <p className="text-xs mb-4 line-clamp-2 dark:text-slate-400 light:text-slate-500">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t dark:border-slate-800/60 light:border-slate-200/60 gap-4">
        {/* Priority Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase ${
          task.priority === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
          task.priority === 'HIGH' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
          task.priority === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500' :
          'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-500'
        }`}>
          {task.priority.toLowerCase()}
        </span>

        {/* Quick status actions */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {task.status === "TODO" && (
            <button
              onClick={() => onStatusChange(task.id, "IN_PROGRESS")}
              className="text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded px-2.5 py-1 transition-all"
            >
              Start Work
            </button>
          )}

          {task.status === "IN_PROGRESS" && (
            <div className="flex gap-1">
              <button
                onClick={() => onStatusChange(task.id, "TODO")}
                className="text-[10px] font-bold border rounded px-2 py-1 transition-all
                  dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800
                  light:bg-slate-100 light:border-slate-200 light:text-slate-600 light:hover:bg-slate-200"
              >
                Back
              </button>
              <button
                onClick={() => onStatusChange(task.id, "DONE")}
                className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded px-2.5 py-1 transition-all"
              >
                Done
              </button>
            </div>
          )}

          {task.status === "DONE" && (
            <button
              onClick={() => onStatusChange(task.id, "IN_PROGRESS")}
              className="text-[10px] font-bold border rounded px-2.5 py-1 transition-all
                dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800
                light:bg-slate-100 light:border-slate-200 light:text-slate-600 light:hover:bg-slate-200"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TaskBoard() {
  const { projectId, state, setState, setNavbarState, setdisplayTasks, displayTasks, setTasks, showInsights, projectDetails } = useProjectData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllTasks = async () => {
      if (typeof window === "undefined") return;
      setNavbarState(false);
      if (!projectId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/tasks`);
        const json = await res.json();
        setdisplayTasks(json.data || []); 
        setTasks(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getAllTasks();
  }, [projectId, state]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      });

      if (res.ok) {
        setState(!state);
      } else {
        console.error("Failed to update status on server");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const todoTasks = displayTasks.filter((task) => task.status === "TODO"); 
  const inProgressTasks = displayTasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = displayTasks.filter((task) => task.status === "DONE"); 

  if (!projectId) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center p-8 rounded-2xl max-w-md border
          dark:bg-slate-900/40 dark:border-slate-800/80
          light:bg-white light:border-slate-200/80">
          <h2 className="text-xl font-bold mb-2 dark:text-blue-400 light:text-blue-600">Select a Project</h2>
          <p className="text-sm dark:text-slate-400 light:text-slate-500">Choose or create a project from the top navigation bar to view your workflow board.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {showInsights && (
        <AnalyticsDashboard 
          tasks={displayTasks} 
          projectDetails={projectDetails} 
          projectId={projectId} 
        />
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {[
          { title: "To Do", tasks: todoTasks, indicatorColor: "bg-blue-500" },
          { title: "In Progress", tasks: inProgressTasks, indicatorColor: "bg-amber-500" },
          { title: "Completed", tasks: doneTasks, indicatorColor: "bg-emerald-500" }
        ].map((section, index) => (
          <div 
            key={index} 
            className="border p-5 rounded-2xl flex flex-col min-h-[500px] max-h-[800px] overflow-hidden transition-all duration-200
              dark:bg-slate-900/20 dark:border-slate-800/60
              light:bg-slate-50 light:border-slate-200"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b dark:border-slate-800/60 light:border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${section.indicatorColor}`} />
                <h2 className="font-bold tracking-wide text-sm dark:text-slate-200 light:text-slate-700">
                  {section.title}
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold border
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400
                light:bg-white light:border-slate-200 light:text-slate-500">
                {section.tasks.length}
              </span>
            </div>
            
            <div className="overflow-y-auto flex-grow pr-1 custom-scrollbar">
              {loading ? (
                <div className="text-center py-10 text-slate-500 text-sm">Loading tasks...</div>
              ) : section.tasks.length > 0 ? (
                section.tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange} 
                  />
                ))
              ) : (
                <div className="text-center py-20 border border-dashed rounded-xl dark:border-slate-800/60 light:border-slate-300">
                  <span className="text-xs font-semibold block uppercase dark:text-slate-500 light:text-slate-400">No Tasks</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
