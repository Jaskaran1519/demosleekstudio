import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = ({ className, children, ...props }: ContainerProps) => {
  return (
    <div 
      className={cn("mx-auto w-full max-w-[1800px] min-h-screen  lg:px-8 xl:px-10 mt-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}; 