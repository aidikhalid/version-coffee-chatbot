import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "../profile/avatars";
import { deleteUserChats } from "@/api/chat";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export function UserMenu() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const deleteChatsMutation = useMutation({
    mutationFn: deleteUserChats,
    onMutate: async () => {
      // Cancel ongoing queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ["chats"] });
    },
    onSuccess: () => {
      // Refetch chats after deletion
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success("Chats deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete chats.");
    },
  });

  const handleDeleteChats = () => {
    deleteChatsMutation.mutate();
  };

  const handleLogout = async () => {
    try {
      await auth?.logout();
      // Clear all queries on logout
      queryClient.clear();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserAvatar />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem variant="destructive" onClick={handleDeleteChats}>
          Clear Conversation
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
