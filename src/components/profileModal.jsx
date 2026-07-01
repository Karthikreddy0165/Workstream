"use client";
import { useDataContext } from "@/context/dataContext"
import { useRouter } from "next/navigation";

export default function ProfileModal({ setOpenProfile }) {
  const { userData, setUserData, setIsLoggedIn } = useDataContext(); 
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData({});
    setIsLoggedIn(false);
    router.push("/");
  }

  const initials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4" onClick={() => setOpenProfile(false)}>
      <div className="border rounded-2xl w-full max-w-sm shadow-2xl transition-all duration-200
        dark:bg-slate-900 dark:border-slate-800
        light:bg-white light:border-slate-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6 border-b dark:border-slate-800/60 light:border-slate-200/60">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white mb-3 shadow-lg shadow-blue-500/10">
            {initials}
          </div>
          <h2 className="text-lg font-bold dark:text-slate-100 light:text-slate-800">{userData?.name || "User"}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{userData?.email || ""}</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center py-2.5 px-3 rounded-lg border
            dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300
            light:bg-slate-50 light:border-slate-200 light:text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Role</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded border dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-100">
              {userData?.role || "—"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 px-3 rounded-lg border
            dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300
            light:bg-slate-50 light:border-slate-200 light:text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Email</span>
            <span className="text-xs font-medium">{userData?.email || "—"}</span>
          </div>

          <div className="flex justify-between items-center py-2.5 px-3 rounded-lg border
            dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300
            light:bg-slate-50 light:border-slate-200 light:text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Account ID</span>
            <span className="text-xs font-mono">{userData?.id ? userData.id.slice(-8) : "—"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-6 pt-2">
          <button
            onClick={() => setOpenProfile(false)}
            className="flex-1 px-4 py-2.5 text-xs font-medium border rounded-lg transition-all
              dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200
              light:bg-white light:border-slate-200 light:text-slate-600 light:hover:bg-slate-50"
          >
            Close
          </button>
          <button 
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 border border-red-500/10 rounded-lg transition-all"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
