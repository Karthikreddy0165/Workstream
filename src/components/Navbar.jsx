"use client";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateIssue from "./CreateIssue";
import { useProjectData } from '../context/Context';
import { useDataContext } from '@/context/dataContext';
import ProfileModal from "./profileModal";
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon } from "lucide-react";

const SidebarNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projectDetails, setProjectDetails, projectId, setProjectId, navbarState, showInsights, setShowInsights } = useProjectData();
  const [projectOption, setProjectOption] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userData, theme, toggleTheme } = useDataContext();

  const handleDashBoardClick = () => {
    router.push('/Routes/Dashboard');
  };

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await fetch(`/api/projects`);
        const json = await res.json();
        setProjectOption(json.data || []);

        if (json.data && json.data.length > 0) {
          const details = json.data.map((project) => ({
            projectId: project.id,
            projectName: project.name,
          }));
          setProjectDetails(details);
          setProjectId(json.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    getProjects();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (pathname === '/' || pathname === '/Routes/signup' || !isLoggedIn) {
    return null;
  }

  const initials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="w-full">
      <nav className="w-full h-16 border-b flex justify-between items-center px-6 transition-colors duration-200
        dark:bg-slate-900/90 dark:border-slate-800/80 dark:text-white
        light:bg-white light:border-slate-200 light:text-slate-900 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        
        {/* Left Side */}
        {!navbarState ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4 pr-4 border-r dark:border-slate-800 border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black text-white">W</div>
              <span className="text-sm font-bold tracking-tight">Workstream</span>
            </div>

            {/* Project Selector */}
            <select
              className="border py-1.5 px-3 rounded-lg text-sm focus:outline-none transition-all font-medium cursor-pointer
                dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200
                light:bg-slate-50 light:border-slate-200 light:text-slate-700"
              onChange={(e) => setProjectId(e.target.value)}
              value={projectId}
            >
              {projectOption && projectOption.length > 0 ? (
                projectOption.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              ) : (
                <option value="">No projects</option>
              )}
            </select>

            {/* Insights Toggle */}
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={`flex items-center py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all focus:outline-none ${
                showInsights
                  ? "bg-blue-600/10 border-blue-600/30 text-blue-500"
                  : "dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 light:bg-slate-50 light:border-slate-200 light:text-slate-500 light:hover:bg-slate-100"
              }`}
            >
              <span className="mr-1.5 font-sans">Insights</span>
            </button>

            {/* Create Issue */}
            <button
              onClick={toggleModal}
              className="flex items-center py-1.5 px-3.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold text-xs transition-all focus:outline-none"
            >
              <FaPlus className="mr-1.5 text-[10px]" />
              New Issue
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4 pr-4 border-r dark:border-slate-800 border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black text-white">W</div>
              <span className="text-sm font-bold tracking-tight">Workstream</span>
            </div>
            <button
              className="flex items-center py-1.5 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold text-xs transition-all focus:outline-none"
              onClick={handleDashBoardClick}
            >
              Back to Board
            </button>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border focus:outline-none transition-all
              dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200
              light:bg-slate-50 light:border-slate-200 light:text-slate-600 light:hover:text-slate-900"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            className="flex items-center gap-2 border py-1.5 px-3 rounded-lg transition-all focus:outline-none
              dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-800
              light:bg-slate-50 light:border-slate-200 light:hover:bg-slate-100"
            onClick={() => setOpenProfile(true)}
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              {initials}
            </div>
            <span className="text-xs font-medium hidden md:inline">{userData?.name || 'Profile'}</span>
          </button>
        </div>
      </nav>

      {isModalOpen && (
        <CreateIssue toggleModal={toggleModal} projectId={projectId} />
      )}
      {openProfile && <ProfileModal setOpenProfile={setOpenProfile} />}
    </div>
  );
};

export default SidebarNavbar;
