import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-36 w-full resize-y rounded-xl border border-border-strong bg-background/60 px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-subtle-foreground",
      "hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/30",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
