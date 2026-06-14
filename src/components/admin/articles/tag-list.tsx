// 🏷️ Article tag chips — uses <Badge> shadcn component, no raw <span>.
import { Badge } from "@/components/ui/badge";

export default function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {tags.slice(0, 3).map((t) => (
        <Badge key={t} variant="secondary">{t}</Badge>
      ))}
    </div>
  );
}
