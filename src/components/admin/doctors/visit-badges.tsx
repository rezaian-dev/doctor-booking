// 🏷️ Visit type badges — uses <Badge> shadcn component, no raw <span>.
import { Badge } from "@/components/ui/badge";

interface VisitBadgesProps {
  online: boolean;
  inPerson: boolean;
}

export default function VisitBadges({ online, inPerson }: VisitBadgesProps) {
  if (!online && !inPerson) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {inPerson && <Badge variant="success">حضوری</Badge>}
      {online  && <Badge variant="default">آنلاین</Badge>}
    </div>
  );
}
