import React from 'react';
import Logo from '../UI/Logo';

/** Shown while a shared resume loads: same silhouette as the real app, so nothing jumps. */
const AppSkeleton = ({ label = 'Loading your resume' }) => (
    <div className="flex h-[100dvh] flex-col bg-canvas" role="status" aria-label={label}>
        <div className="flex h-14 items-center gap-3 border-b border-line bg-panel px-4">
            <Logo />
            <div className="flex-1" />
            <div className="skeleton h-9 w-24" />
            <div className="skeleton h-9 w-32" />
        </div>
        <div className="flex min-h-0 flex-1">
            <div className="hidden w-[400px] space-y-3 border-r border-line bg-panel p-5 md:block">
                <div className="skeleton h-9 w-full" />
                <div className="skeleton h-7 w-40" />
                {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
            <div className="canvas-dots flex flex-1 justify-center overflow-hidden px-6 pt-10">
                <div className="skeleton aspect-[210/297] w-full max-w-[640px] !rounded-sm shadow-paper" />
            </div>
        </div>
        <span className="sr-only">{label}</span>
    </div>
);

export default AppSkeleton;
