import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Coffee } from "lucide-react";

export function UserAvatar() {
  const auth = useAuth();
  return (
    <Avatar>
      {/* <AvatarImage src={auth?.user?.image || undefined} alt="User" /> */}
      <AvatarFallback>
        {auth?.user?.name?.slice(0, 1) || "U"}
        {auth?.user?.name?.split(" ")[1]?.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
}

export function AIAvatar() {
  return (
    <Avatar>
      <Coffee className="size-full p-1 text-black" />
    </Avatar>
  );
}
