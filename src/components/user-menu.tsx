import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Bell,
  Boxes,
  Bot,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Database,
  IdCard,
  LogOut,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/utils/auth-context";
import useLogout from "@/features/auth/use-logout";
import { useGetCreditBalance } from "@/features/ai-credits/use-get-credit-balance";

type MenuLink = { label: string; href: string; icon: LucideIcon };

const DATA_LINKS: MenuLink[] = [
  { label: "Data sources", href: "/data-sources", icon: Database },
  { label: "Data health", href: "/data-health", icon: Activity },
  { label: "Schema", href: "/schema", icon: Boxes },
  { label: "Identity", href: "/identity", icon: IdCard },
];

const SETTINGS_LINKS: MenuLink[] = [
  { label: "Members", href: "/members", icon: Users },
  // { label: "Security", href: "/security", icon: Lock },
  { label: "Audit log", href: "/audit-log", icon: ScrollText },
  // { label: "Data and residency", href: "/data-and-residency", icon: Globe },
  { label: "Notifications", href: "/notifications", icon: Bell },
  // { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Plan and billing", href: "/plan-and-billing", icon: CreditCard },
  { label: "Agents", href: "/agents", icon: Bot },
  // { label: "Developers", href: "/developers", icon: Code2 },
  // { label: "Embedding", href: "/embedding", icon: Frame },
  // { label: "Your view", href: "/your-view", icon: Eye },
  // { label: "Language", href: "/language", icon: Languages },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

type Section = "data" | "settings";

function SectionToggle({
  label,
  icon: Icon,
  expanded,
  onToggle,
}: {
  label: string;
  icon: LucideIcon;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        onToggle();
      }}
    >
      <Icon className="size-4" />
      {label}
      {expanded ? (
        <ChevronDown className="ml-auto size-4" />
      ) : (
        <ChevronRight className="ml-auto size-4" />
      )}
    </DropdownMenuItem>
  );
}

function SectionLinks({ links }: { links: MenuLink[] }) {
  return (
    <>
      {links.map((link) => (
        <DropdownMenuItem key={link.href} inset asChild>
          <Link to={link.href}>
            <link.icon className="size-4" />
            {link.label}
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
}

export function UserMenu() {
  const { user } = useAuth();
  const { logout, isPending } = useLogout();
  const [expanded, setExpanded] = useState<Section | null>(null);
  const { data: creditBalance, isLoading: isCreditBalanceLoading } = useGetCreditBalance();

  if (!user) return null;

  const toggle = (section: Section) =>
    setExpanded((current) => (current === section ? null : section));

  return (
    <DropdownMenu onOpenChange={(open) => !open && setExpanded(null)}>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Account menu"
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-ink text-[10px] font-semibold text-paper">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-(--radix-popper-available-height) w-56 overflow-y-auto">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-[12.5px] font-semibold text-ink">{user.name}</p>
          {user.email && <p className="mt-0.5 truncate text-[11px] text-ink-3">{user.email}</p>}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold text-ink">Credits</span>
            <Link
              to="/plan-and-billing"
              className="rounded-control bg-paper px-2 py-1 text-[10px] font-medium text-ink-3 transition-colors hover:bg-line hover:text-ink"
            >
              Add credits
            </Link>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[12px] font-medium text-ink">
              <span>Available</span>
              <span className="font-mono tabular-nums">
                {isCreditBalanceLoading ? "…" : (creditBalance?.data.totalAvailable ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-ink-4">
              <span>Free monthly credits</span>
              <span className="font-mono tabular-nums">
                {isCreditBalanceLoading ? "…" : (creditBalance?.data.monthlyFreeLimit ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-ink-4">
              <span>Daily limit</span>
              <span className="font-mono tabular-nums">
                {isCreditBalanceLoading ? "…" : (creditBalance?.data.dailyFreeLimit ?? 0)}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <SectionToggle
          label="Data"
          icon={Database}
          expanded={expanded === "data"}
          onToggle={() => toggle("data")}
        />
        {expanded === "data" && <SectionLinks links={DATA_LINKS} />}

        <SectionToggle
          label="Settings"
          icon={Settings}
          expanded={expanded === "settings"}
          onToggle={() => toggle("settings")}
        />
        {expanded === "settings" && <SectionLinks links={SETTINGS_LINKS} />}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          <LogOut className="size-4" />
          {isPending ? "Signing out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
