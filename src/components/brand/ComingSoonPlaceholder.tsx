import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonPlaceholderProps {
  title?: string;
}

export default function ComingSoonPlaceholder({
  title = "This feature",
}: ComingSoonPlaceholderProps) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Construction className="w-7 h-7 text-violet-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Coming Soon
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {title} is currently under development and will be available in a
          future update.
        </p>
      </CardContent>
    </Card>
  );
}
