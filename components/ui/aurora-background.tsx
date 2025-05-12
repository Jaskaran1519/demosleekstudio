"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-[#f5efe6] text-slate-950 dark:bg-[#e8d9c5]",
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              // Enhanced brown-themed aurora colors
              "--brown-aurora":
                "repeating-linear-gradient(100deg,#d9b99a 10%,#c4a075 15%,#b18a5b 20%,#d5bd93 25%,#c2a47c 30%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,#000 0%,#000 7%,transparent 10%,transparent 12%,#000 16%)",
              "--white-gradient":
                "repeating-linear-gradient(100deg,#fff 0%,#fff 7%,transparent 10%,transparent 12%,#fff 16%)",
              
              "--white": "#fff",
              "--black": "#000",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] 
              [background-image:var(--white-gradient),var(--brown-aurora)] 
              [background-size:300%,_200%] 
              [background-position:50%_50%,50%_50%] 
              opacity-45 blur-[10px] 
              will-change-transform 
              after:absolute after:inset-0 
              after:[background-image:var(--white-gradient),var(--brown-aurora)] 
              after:[background-size:200%,_100%] 
              after:[background-attachment:fixed] 
              after:mix-blend-multiply 
              after:content-[""] 
              dark:[background-image:var(--dark-gradient),var(--brown-aurora)] 
              dark:opacity-50 
              after:dark:[background-image:var(--dark-gradient),var(--brown-aurora)]`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            )}
            // Add enhanced animation duration for more noticeable effect
            style={{
              animation: "aurora 15s linear infinite",
            }}
          ></div>
        </div>
        {children}
      </div>
      {/* Add keyframes for enhanced aurora animation */}
      <style jsx global>{`
        @keyframes aurora {
          0% {
            background-position: 0% 0%, 0% 0%;
          }
          50% {
            background-position: 100% 100%, 100% 100%;
          }
          100% {
            background-position: 0% 0%, 0% 0%;
          }
        }
        .animate-aurora {
          animation: aurora 15s linear infinite;
        }
      `}</style>
    </main>
  );
};