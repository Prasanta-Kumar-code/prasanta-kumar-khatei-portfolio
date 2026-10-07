import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

/** Consistent h2 + eyebrow label for every section (SR-friendly labelling). */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const headingId = `${id}-heading`;
  return (
    <div className={cn("mb-12 max-w-2xl md:mb-16", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow mb-4 text-xs font-semibold text-primary">{eyebrow}</p>
      <h2
        id={headingId}
        className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
