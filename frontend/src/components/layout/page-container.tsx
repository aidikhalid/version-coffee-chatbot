import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex px-4 pt-4 items-center justify-center">
      <div className="w-full md:max-w-6xl h-full min-h-[460px] md:max-h-[650px] 2xl:max-h-[800px] bg-background border border-primary rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
