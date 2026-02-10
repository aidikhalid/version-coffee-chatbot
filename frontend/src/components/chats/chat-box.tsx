import { useEffect, useRef, useState } from "react";
import ChatItem from "./chat-item";
import { fetchUserChats, sendChatRequest } from "@/api/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowUpRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface ChatBoxProps {
  onClose: () => void;
}

export function ChatBox({ onClose }: ChatBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [streamingContent, setStreamingContent] = useState("");

  // Tanstack Query: Fetch chat messages
  const {
    data: chatMessages = [],
    isLoading,
    error,
  } = useQuery<
    Array<{
      role: "user" | "assistant";
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }>
  >({
    queryKey: ["chats"],
    queryFn: fetchUserChats,
  });

  // Tanstack Query: Send chat message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      // Reset streaming content
      setStreamingContent("");

      // Call streaming API with chunk handler
      return await sendChatRequest(newMessage, (chunk) => {
        setStreamingContent((prev) => prev + chunk);
      });
    },
    onMutate: async (newMessage) => {
      // Cancel ongoing queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      // Save current state for rollback
      const previousChats = queryClient.getQueryData(["chats"]);

      // Optimistically add user message immediately
      queryClient.setQueryData(
        ["chats"],
        (
          old: Array<{
            role: "user" | "assistant";
            content: string;
            createdAt: Date;
            updatedAt: Date;
          }> = [],
        ) => [
          ...old,
          {
            role: "user",
            content: newMessage,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      );

      return { previousChats };
    },
    onSuccess: async () => {
      // Refetch to get complete response from server
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      // Clear streaming content AFTER refetch completes to avoid flicker
      setStreamingContent("");
    },
    onError: (_error, _variables, context) => {
      // Rollback user message if send failed
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
      setStreamingContent("");
      toast.error("Failed to send message.");
    },
  });

  const handleSubmit = () => {
    if (!inputRef.current?.value) return;

    const userMessage = inputRef.current.value;
    inputRef.current.value = "";

    // Use mutation to send message
    sendMessageMutation.mutate(userMessage);
  };

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load chats.");
    }
  }, [error]);

  // Track if this is the first load
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (chatMessages.length === 0) return;

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        block: "end",
        behavior: isFirstLoad.current ? "auto" : "smooth",
      });

      // After first scroll, set to false
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    });
  }, [chatMessages.length]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (streamingContent) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          block: "end",
          behavior: "smooth",
        });
      });
    }
  }, [streamingContent]);

  return (
    <div className="fixed bottom-20 right-4 md:right-8 w-[calc(100%-2rem)] md:w-[28rem] h-[32rem] bg-background border border-border rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted">
        <h2 className="text-lg font-bold text-primary">Chat with us</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full">
          <div className="p-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <Spinner />
                <p className="text-muted-foreground">Loading chats...</p>
              </div>
            )}
            {chatMessages.length > 0 ? (
              <>
                {chatMessages.map((message, index) => (
                  <ChatItem
                    key={index}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {sendMessageMutation.isPending && streamingContent && (
                  <ChatItem role="assistant" content={streamingContent} />
                )}
                {sendMessageMutation.isPending && !streamingContent && (
                  <ChatItem
                    role="assistant"
                    content="Thinking..."
                    useSpinner={true}
                  />
                )}
              </>
            ) : (
              <>
                {!isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground text-center">
                      Ask a question or start a conversation.
                    </p>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} className="pt-4" />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <Card className="shadow-none border-0 p-0">
          <CardContent className="flex gap-2 p-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex gap-2 w-full"
            >
              <Input
                placeholder="Enter your message..."
                ref={inputRef}
                disabled={isLoading || sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading || sendMessageMutation.isPending}
              >
                <ArrowUpRight />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ChatBox;
