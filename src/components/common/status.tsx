import { cn } from '@/lib/utils';

const Status = ({ className, status }: { className?: string; status: 'eliminated' | 'not eliminated' }) => {
  return (
    <button
      className={cn(`${status === 'eliminated' ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-medium px-3 py-1 rounded-full`, className)}
    >
      {status === 'eliminated' ? 'Eliminated' : 'Not Eliminated'}
    </button>
  );
};

export default Status;
