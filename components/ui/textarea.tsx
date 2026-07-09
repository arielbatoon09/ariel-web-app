import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function RichTextarea({ value, onChange, placeholder, className, disabled }: RichTextareaProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync value from props to editor if it changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleInput();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-input bg-muted/20 p-1 dark:bg-muted/10">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          disabled={disabled}
          className="rounded p-1 text-foreground transition hover:bg-muted dark:hover:bg-muted/30"
          title="Bold"
        >
          <Bold className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          disabled={disabled}
          className="rounded p-1 text-foreground transition hover:bg-muted dark:hover:bg-muted/30"
          title="Italic"
        >
          <Italic className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          disabled={disabled}
          className="rounded p-1 text-foreground transition hover:bg-muted dark:hover:bg-muted/30"
          title="Underline"
        >
          <Underline className="size-3.5" />
        </button>
        <div className="mx-1 h-4 w-px bg-input" />
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          disabled={disabled}
          className="rounded p-1 text-foreground transition hover:bg-muted dark:hover:bg-muted/30"
          title="Bullet List"
        >
          <List className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          disabled={disabled}
          className="rounded p-1 text-foreground transition hover:bg-muted dark:hover:bg-muted/30"
          title="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        data-placeholder={placeholder}
        className="prose prose-sm dark:prose-invert min-h-32 max-w-none overflow-y-auto p-2.5 text-sm select-text focus:outline-none"
        style={{ outline: "none" }}
      />
    </div>
  );
}

export { Textarea, RichTextarea };
