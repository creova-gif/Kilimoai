import { motion } from "motion/react";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "text" | "stat";
  count?: number;
}

export function LoadingSkeleton({ variant = "card", count = 1 }: LoadingSkeletonProps) {
  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-5/6 animate-pulse" />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
      </div>
    </div>
  );

  const TextSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-lg w-4/5 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-lg w-3/5 animate-pulse" />
    </div>
  );

  const StatSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  const components = {
    card: CardSkeleton,
    list: ListSkeleton,
    text: TextSkeleton,
    stat: StatSkeleton
  };

  const Component = components[variant];

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Component />
        </motion.div>
      ))}
    </div>
  );
}
