"use client";
import TaskBoard from '../../../components/task-board';
import SearchBar from "../../../components/SearchBar";
import { useDataContext } from '@/context/dataContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
    const router = useRouter();
    const { isLoggedIn } = useDataContext();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen transition-colors duration-200 dark:bg-slate-950 light:bg-slate-50/50 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1400px] mx-auto px-6 py-6">
                <SearchBar />
                <TaskBoard />
            </div>
        </div>
    );
}
