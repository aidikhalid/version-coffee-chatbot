import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { resetDatabase } from "@/api/database";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function ResetDatabase() {
  const queryClient = useQueryClient();

  const resetDatabaseMutation = useMutation({
    mutationFn: resetDatabase,
    onSuccess: () => {
      // Clear all cached data after database reset
      queryClient.clear();
      toast.success("Database reset successfully.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    },
  });

  const handleResetDatabase = () => {
    resetDatabaseMutation.mutate();
  };

  return (
    <Button
      variant="destructive"
      className="w-full"
      onClick={handleResetDatabase}
      disabled={resetDatabaseMutation.isPending}
    >
      {resetDatabaseMutation.isPending ? <Spinner /> : "RESET DATABASE"}
    </Button>
  );
}

export default ResetDatabase;
