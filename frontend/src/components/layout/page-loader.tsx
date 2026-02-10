import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [showBackendMessage, setShowBackendMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackendMessage(true);
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="h-full grid place-items-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <p className="text-muted-foreground">Loading...</p>
        {showBackendMessage && (
          <p className="text-muted-foreground">
            This may take a moment. Please wait.
          </p>
        )}
      </div>
    </div>
  );
}

export default PageLoader;
