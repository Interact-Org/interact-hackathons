import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2', className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-slate-300 dark:bg-slate-800/[0.8] block rounded-lg"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            onClick={item.onClick}
            className="w-full text-center gap-2 hover:ring-2 border-0 cursor-pointer bg-white rounded-md flex flex-col justify-center items-center transition-ease-300"
          >
            <CardTitle className="text-2xl md:text-5xl font-bold text-primary_text">{item.title}</CardTitle>
            <CardDescription className="text-xs md:text-base text-primary_text">{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl h-full w-full p-10 overflow-hidden bg-black border border-neutral-200 border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 dark:border-neutral-800',
        className
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
};
export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn('text-zinc-100 font-bold tracking-wide', className)}>{children}</h4>;
};
export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn('mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm', className)}>{children}</p>;
};
