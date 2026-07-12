'use client';

const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }: { width?: string; height?: string; className?: string }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
);

export default Skeleton;
