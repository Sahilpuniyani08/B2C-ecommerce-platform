import { ShoppingBag, PackageSearch, Inbox, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: "bag" | "package" | "inbox" | "error";
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  bag: ShoppingBag,
  package: PackageSearch,
  inbox: Inbox,
  error: AlertCircle,
};

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#f5f0e8] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-olive" />
      </div>
      <h3 className="font-semibold text-olive text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-olive max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
