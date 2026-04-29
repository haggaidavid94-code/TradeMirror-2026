import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton = ({ className = '', width, height, variant = 'rect' }: SkeletonProps) => {
  const baseClasses = "bg-slate-100 dark:bg-slate-800 animate-pulse relative overflow-hidden";
  const variantClasses = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-md h-3 w-full"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow space-y-6 ${className}`}>
    <div className="flex justify-between items-center">
      <Skeleton width={120} height={20} />
      <Skeleton width={24} height={24} variant="circle" />
    </div>
    <div className="space-y-3">
      <Skeleton height={40} width="60%" />
      <Skeleton height={16} width="40%" />
    </div>
    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-4">
      <Skeleton height={60} className="flex-1" />
      <Skeleton height={60} className="flex-1" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 ${className}`}>
    <div className="flex items-center gap-4 flex-1">
      <Skeleton width={40} height={40} />
      <div className="space-y-2">
        <Skeleton width={100} height={14} />
        <Skeleton width={60} height={10} />
      </div>
    </div>
    <div className="flex gap-8">
      <Skeleton width={60} height={14} />
      <Skeleton width={80} height={14} />
      <Skeleton width={40} height={14} />
    </div>
  </div>
);

export const MetricSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow space-y-4 ${className}`}>
    <Skeleton width={80} height={12} />
    <Skeleton width={120} height={32} />
    <Skeleton width={100} height={10} />
  </div>
);
