'use client';

import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
            {...props}
        />
    );
};

// Card skeleton for dashboard
export const CardSkeleton = () => {
    return (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
            {/* Type badge */}
            <Skeleton className="w-16 h-5 rounded-full mb-3" />

            {/* Title */}
            <Skeleton className="w-3/4 h-6 mb-2" />

            {/* Description lines */}
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-5/6 h-4 mb-4" />

            {/* Tags */}
            <div className="flex gap-2">
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-20 h-6 rounded-full" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-20 h-8 rounded-lg" />
            </div>
        </div>
    );
};

// Knowledge detail skeleton
export const DetailSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Skeleton className="w-32 h-8 mb-6" />

            {/* Header card */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex-1">
                        <Skeleton className="w-24 h-5 rounded-full mb-2" />
                        <Skeleton className="w-2/3 h-8 mb-2" />
                        <Skeleton className="w-40 h-4" />
                    </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-6">
                    <Skeleton className="w-20 h-7 rounded-full" />
                    <Skeleton className="w-24 h-7 rounded-full" />
                    <Skeleton className="w-16 h-7 rounded-full" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-4/5 h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                </div>
            </div>

            {/* AI Summary skeleton */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="w-32 h-5" />
                </div>
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-5/6 h-4 mb-2" />
                <Skeleton className="w-4/5 h-4" />
            </div>
        </div>
    );
};

// Dashboard grid skeleton
export const DashboardSkeleton = () => {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
};

// Table row skeleton
export const TableRowSkeleton = () => {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
                <Skeleton className="w-1/3 h-5 mb-1" />
                <Skeleton className="w-1/2 h-4" />
            </div>
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-24 h-4" />
        </div>
    );
};
