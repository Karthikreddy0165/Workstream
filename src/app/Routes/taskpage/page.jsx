"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User, Calendar, Folder, CheckSquare } from "lucide-react";
import UpdateStatus from "../../../components/UpdateStatus";
import { useProjectData } from "@/context/Context";
import ChatBox from "../../../components/Chatbox";

const priorityBorders = {
  LOW: "border-l-emerald-500",
  MEDIUM: "border-l-yellow-500",
  HIGH: "border-l-orange-500",
  CRITICAL: "border-l-red-500",
};

const priorityTexts = {
  LOW: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  MEDIUM: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  HIGH: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  CRITICAL: "text-red-500 bg-red-500/10 border-red-500/20",
};

const TaskDetails = ({ task, projectName, taskId }) => {
  const assignees = task.assignees.map((assignee) => assignee.name).join(", ") || "Unassigned";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const { projectId, taskState, setTaskState } = useProjectData();

  const onClose = async (status) => {
    if (status === task.status) {
      return;
    }
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus: status }), 
      });
      const json = await res.json();
      if (json.message === "successfully updated status") {
        setTaskState(!taskState);
        setIsModalOpen(false);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setIsModalOpen(false);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`border p-8 ${priorityBorders[task.priority]} border-l-4 shadow-sm flex flex-col justify-between h-full rounded-2xl
      dark:bg-slate-900/40 dark:border-slate-850
      light:bg-white light:border-slate-200`}>
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-xl font-bold tracking-tight dark:text-slate-100 light:text-slate-800">{task.title}</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase shrink-0 ${priorityTexts[task.priority]}`}>
            {task.priority.toLowerCase()}
          </span>
        </div>
        
        <p className="text-sm leading-relaxed mb-8 whitespace-pre-line dark:text-slate-400 light:text-slate-600">
          {task.description || "No description provided."}
        </p>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border rounded-xl mb-8
          dark:bg-slate-950/45 dark:border-slate-855
          light:bg-slate-50 light:border-slate-150">
          <div className="flex items-center text-sm gap-3">
            <Folder className="text-blue-500 w-5 h-5" />
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 block font-semibold uppercase">Project</span>
              <span className="font-medium dark:text-slate-200 light:text-slate-800">{projectName}</span>
            </div>
          </div>
          <div className="flex items-center text-sm gap-3">
            <User className="text-blue-500 w-5 h-5" />
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 block font-semibold uppercase">Assignees</span>
              <span className="font-medium dark:text-slate-200 light:text-slate-800">{assignees}</span>
            </div>
          </div>
          <div className="flex items-center text-sm gap-3">
            <CheckSquare className="text-blue-500 w-5 h-5" />
            <div>
              <span className="text-xs text-slate-455 dark:text-slate-500 block font-semibold uppercase">Status</span>
              <span className="font-medium dark:text-slate-200 light:text-slate-800 capitalize">{task.status.toLowerCase()}</span>
            </div>
          </div>
          <div className="flex items-center text-sm gap-3">
            <Calendar className="text-blue-500 w-5 h-5" />
            <div>
              <span className="text-xs text-slate-455 dark:text-slate-500 block font-semibold uppercase">Deadline</span>
              <span className="font-medium dark:text-slate-200 light:text-slate-800">
                {new Date(task.deadline).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t dark:border-slate-800/60 light:border-slate-200/60 flex justify-end">
        <button
          onClick={toggleModal}
          className="py-2.5 px-6 rounded-lg text-white font-bold text-xs bg-blue-600 hover:bg-blue-500 transition-all focus:outline-none"
        >
          Update Task
        </button>
      </div>

      {isModalOpen && (
        <UpdateStatus toggleModal={toggleModal} projectId={projectId} onClose={onClose} onCancel={onCancel} />
      )}
    </div>
  );
};

const TaskContent = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const [task, setTask] = useState(null);
  const { projectDetails, setNavbarState, taskState } = useProjectData();

  useEffect(() => {
    async function getTaskData() {
      try {
        setNavbarState(true);
        const res = await fetch(`/api/tasks/${taskId}`);
        const json = await res.json();
        setTask(json.data);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    }

    if (taskId) {
      getTaskData();
    }
  }, [taskId, setNavbarState, taskState]);

  if (!task) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-slate-500 text-sm">
        Loading task details...
      </div>
    );
  }

  const projectName = projectDetails?.find(p => p.projectId === task.projectId)?.projectName || "Unknown Project";

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      <div className="lg:w-[60%] flex flex-col">
        <TaskDetails task={task} projectName={projectName} taskId={taskId} />
      </div>
      <div className="lg:w-[40%] flex flex-col">
        <ChatBox taskId={taskId} />
      </div>
    </div>
  );
};

const TaskPage = () => {
  return (
    <div className="min-h-screen p-8 transition-colors duration-200
      dark:bg-slate-950 light:bg-slate-50 bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading search context...</div>}>
        <TaskContent />
      </Suspense>
    </div>
  );
};

export default TaskPage;
