import { AIAvatar, UserAvatar } from "../profile/avatars";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { Spinner } from "../ui/spinner";

const md = new MarkdownIt();

export function ChatItem({
  role,
  content,
  useSpinner = false,
}: {
  role: "user" | "assistant";
  content: string;
  useSpinner?: boolean;
}) {
  return role === "user" ? (
    <div className="flex mt-4 justify-end">
      <div className="md:max-w-[calc(100%-3.75rem)] flex justify-end border border-card rounded-xl overflow-hidden">
        <div className="px-4 md:px-6 py-4 bg-secondary">
          <div
            className="md:text-lg text-secondary-foreground max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(md.render(content)),
            }}
          />
        </div>
        <div className="w-15 p-4 bg-card">
          <UserAvatar />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex mt-4">
      <div className="md:max-w-[calc(100%-3.75rem)] flex border border-primary rounded-xl overflow-hidden">
        <div className="w-15 p-4 bg-primary">
          <AIAvatar />
        </div>
        <div className="px-4 md:px-6 py-4 bg-secondary flex items-center gap-2">
          {useSpinner && <Spinner />}
          <div
            className="md:text-lg text-secondary-foreground max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(md.render(content)),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
