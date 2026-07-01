import React from "react";

export default function AnalyticsDashboard({ tasks, projectDetails, projectId }) {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const totalTasks = projectTasks.length;

  const todoTasks = projectTasks.filter((t) => t.status === "TODO").length;
  const inProgressTasks = projectTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneTasks = projectTasks.filter((t) => t.status === "DONE").length;

  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const criticalCount = projectTasks.filter((t) => t.priority === "CRITICAL").length;
  const highCount = projectTasks.filter((t) => t.priority === "HIGH").length;
  const mediumCount = projectTasks.filter((t) => t.priority === "MEDIUM").length;
  const lowCount = projectTasks.filter((t) => t.priority === "LOW").length;

  const featureCount = projectTasks.filter((t) => t.taskType === "FEATURE").length;
  const bugCount = projectTasks.filter((t) => t.taskType === "BUG").length;
  const taskCount = projectTasks.filter((t) => t.taskType === "TASK").length;
  const issueCount = projectTasks.filter((t) => t.taskType === "ISSUE").length;

  const developerWorkload = {};
  projectTasks.forEach((task) => {
    if (task.assignees && task.assignees.length > 0) {
      task.assignees.forEach((assignee) => {
        developerWorkload[assignee.name] = (developerWorkload[assignee.name] || 0) + 1;
      });
    }
  });

  const activeProjectName = projectDetails?.find((p) => p.projectId === projectId)?.projectName || "Active Project";

  return (
    <div className="border rounded-2xl p-6 mb-8 shadow-sm transition-all duration-200
      dark:bg-slate-900/40 dark:border-slate-800/80
      light:bg-white light:border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold dark:text-slate-100 light:text-slate-800">
            Sprint Insights — {activeProjectName}
          </h2>
          <p className="text-xs dark:text-slate-400 light:text-slate-550">Metrics and workload analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 light:text-slate-500">Progress:</span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full overflow-hidden mb-8 border dark:bg-slate-950 dark:border-slate-850 light:bg-slate-100 light:border-slate-200">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Breakdown Card */}
        <div className="border rounded-xl p-5 dark:bg-slate-950/20 dark:border-slate-800/60 light:bg-slate-50/50 light:border-slate-200">
          <h3 className="text-xs font-semibold dark:text-slate-400 light:text-slate-500 mb-4 uppercase tracking-wider">Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 dark:text-slate-300 light:text-slate-650">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                To Do
              </span>
              <span className="font-bold dark:text-slate-200 light:text-slate-800">{todoTasks}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 dark:text-slate-300 light:text-slate-650">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                In Progress
              </span>
              <span className="font-bold dark:text-slate-200 light:text-slate-800">{inProgressTasks}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 dark:text-slate-300 light:text-slate-650">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Completed
              </span>
              <span className="font-bold dark:text-slate-200 light:text-slate-800">{doneTasks}</span>
            </div>
            <div className="border-t dark:border-slate-800/60 light:border-slate-200/60 pt-2 flex justify-between items-center text-xs font-bold dark:text-slate-300 light:text-slate-700">
              <span>Total Tasks</span>
              <span>{totalTasks}</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown Card */}
        <div className="border rounded-xl p-5 dark:bg-slate-950/20 dark:border-slate-800/60 light:bg-slate-50/50 light:border-slate-200">
          <h3 className="text-xs font-semibold dark:text-slate-400 light:text-slate-500 mb-4 uppercase tracking-wider">Priority Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border p-2.5 rounded-lg text-center dark:bg-slate-900/40 dark:border-slate-850 light:bg-white light:border-slate-200">
              <span className="text-[10px] text-red-500 block font-bold mb-0.5 uppercase tracking-wide">Critical</span>
              <span className="text-base font-bold dark:text-slate-250 light:text-slate-800">{criticalCount}</span>
            </div>
            <div className="border p-2.5 rounded-lg text-center dark:bg-slate-900/40 dark:border-slate-850 light:bg-white light:border-slate-200">
              <span className="text-[10px] text-orange-500 block font-bold mb-0.5 uppercase tracking-wide">High</span>
              <span className="text-base font-bold dark:text-slate-250 light:text-slate-800">{highCount}</span>
            </div>
            <div className="border p-2.5 rounded-lg text-center dark:bg-slate-900/40 dark:border-slate-850 light:bg-white light:border-slate-200">
              <span className="text-[10px] text-amber-600 dark:text-amber-500 block font-bold mb-0.5 uppercase tracking-wide">Medium</span>
              <span className="text-base font-bold dark:text-slate-250 light:text-slate-800">{mediumCount}</span>
            </div>
            <div className="border p-2.5 rounded-lg text-center dark:bg-slate-900/40 dark:border-slate-850 light:bg-white light:border-slate-200">
              <span className="text-[10px] text-green-600 dark:text-green-500 block font-bold mb-0.5 uppercase tracking-wide">Low</span>
              <span className="text-base font-bold dark:text-slate-250 light:text-slate-800">{lowCount}</span>
            </div>
          </div>
        </div>

        {/* Issue Type & Workload */}
        <div className="border rounded-xl p-5 dark:bg-slate-950/20 dark:border-slate-800/60 light:bg-slate-50/50 light:border-slate-200">
          <h3 className="text-xs font-semibold dark:text-slate-400 light:text-slate-500 mb-4 uppercase tracking-wider">Type Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="dark:text-slate-350 light:text-slate-650">Features</span>
              <span className="font-semibold px-2 py-0.5 rounded border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 light:bg-white light:border-slate-100">{featureCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="dark:text-slate-350 light:text-slate-650">Bugs</span>
              <span className="font-semibold px-2 py-0.5 rounded border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 light:bg-white light:border-slate-100">{bugCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="dark:text-slate-350 light:text-slate-650">Tasks</span>
              <span className="font-semibold px-2 py-0.5 rounded border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 light:bg-white light:border-slate-100">{taskCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="dark:text-slate-350 light:text-slate-650">Issues</span>
              <span className="font-semibold px-2 py-0.5 rounded border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 light:bg-white light:border-slate-100">{issueCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Workload Section */}
      {Object.keys(developerWorkload).length > 0 && (
        <div className="mt-6 pt-5 border-t dark:border-slate-800/80 light:border-slate-200">
          <h3 className="text-xs font-semibold dark:text-slate-400 light:text-slate-500 mb-3 uppercase tracking-wider">Assignee Workloads</h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(developerWorkload).map(([name, count]) => (
              <div
                key={name}
                className="flex items-center gap-2 border px-3 py-1.5 rounded-full text-xs font-medium
                  dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300
                  light:bg-white light:border-slate-200 light:text-slate-700"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{name}</span>
                <span className="font-bold border px-1.5 py-0.5 rounded-full text-[10px]
                  dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400
                  light:bg-slate-50 light:border-slate-150 light:text-slate-500">
                  {count} {count === 1 ? "task" : "tasks"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
