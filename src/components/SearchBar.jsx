"use client";

import { useProjectData } from '@/context/Context'
import { useState, useEffect } from 'react'

export default function SearchBar() {
  const { tasks, displayTasks, setdisplayTasks } = useProjectData()
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query) {
      setdisplayTasks([...tasks].filter((task) => {
        return task.title.toLowerCase().includes(query.toLowerCase()) || 
          (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
      }))
    }
  }

  useEffect(() => {
    if (query === '') {
      setdisplayTasks(tasks);
    }
  }, [query, tasks, setdisplayTasks]);

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition-all border
            dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:ring-2 dark:focus:ring-blue-500/40
            light:bg-white light:border-slate-200 light:text-slate-900 light:placeholder-slate-400 light:focus:ring-2 light:focus:ring-blue-600/20"
        />
        {query && (
          <button 
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}