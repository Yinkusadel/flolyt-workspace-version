import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquareText, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Chip } from "@/components/ui/chip";

const EYEBROW_CLASS = "font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase";

type NotificationsTab = "general" | "imessage";
const TABS: { key: NotificationsTab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "imessage", label: "iMessage" },
];

function TabBar({ active, onChange }: { active: NotificationsTab; onChange: (tab: NotificationsTab) => void }) {
  return (
    <div className="border-b border-line">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <p className={EYEBROW_CLASS}>{children}</p>;
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  indent,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indent?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 px-4 py-3.5",
        indent && "pl-8"
      )}
    >
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-[11px] text-ink-3">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5 shrink-0"
      />
    </label>
  );
}

function GeneralTab() {
  const [popupOnReply, setPopupOnReply] = useState(true);
  const [emailOnWarmReply, setEmailOnWarmReply] = useState(true);
  const [emailOnAnyReply, setEmailOnAnyReply] = useState(false);
  const [emailMorningRecap, setEmailMorningRecap] = useState(true);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionHeading>While you're online</SectionHeading>
        <div className="rounded-card border border-line bg-paper-2">
          <ToggleRow
            label="Show a browser alert"
            description="Pop up a notification on this device as soon as a reply finishes generating."
            checked={popupOnReply}
            onCheckedChange={setPopupOnReply}
          />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading>Email updates</SectionHeading>
        <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
          <ToggleRow
            label="Notify me on warm replies"
            description="An email the moment someone responds with interest, linking straight back to that thread. Just for you — teammates aren't copied."
            checked={emailOnWarmReply}
            onCheckedChange={setEmailOnWarmReply}
          />
          <ToggleRow
            label="Also notify me on other replies"
            description="Extend that email to neutral, uncertain, or declined responses too. Still just for you."
            checked={emailOnAnyReply}
            onCheckedChange={setEmailOnAnyReply}
            indent
          />
          <ToggleRow
            label="Send my morning recap"
            description="A summary of the day ahead, delivered by email even on days you skip the app."
            checked={emailMorningRecap}
            onCheckedChange={setEmailMorningRecap}
          />
        </div>
      </section>
    </div>
  );
}

function ImessageTab() {
  const [replyWorthAnswering, setReplyWorthAnswering] = useState(false);
  const [waitingOnYou, setWaitingOnYou] = useState(false);
  const [shortRecap, setShortRecap] = useState(false);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionHeading>Texts</SectionHeading>
        <div className="rounded-card border border-line bg-paper-2 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <MessageSquareText className="size-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[12.5px] font-semibold text-ink">Your number</p>
                  <Chip tone="neutral">Not linked yet</Chip>
                </div>
                <p className="mt-1 text-[11px] text-ink-3">
                  Text this workspace once from your phone and we'll route future alerts back to that
                  same thread.
                </p>
              </div>
            </div>
            <Button type="button" size="sm" className="shrink-0">
              <Smartphone className="size-3.5" />
              Link my number
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading>What triggers a text</SectionHeading>
        <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
          <ToggleRow
            label="A reply that's worth a look"
            description="Fires the instant a lead sends something that needs a response. Only affects you."
            checked={replyWorthAnswering}
            onCheckedChange={setReplyWorthAnswering}
          />
          <ToggleRow
            label="Something's waiting on your sign-off"
            description="A drafted message needs your approval before it goes out — bundled to at most once a day."
            checked={waitingOnYou}
            onCheckedChange={setWaitingOnYou}
          />
          <ToggleRow
            label="Today's short version"
            description="Reply count and the one thing worth doing next, sent once and only on days there's something to say."
            checked={shortRecap}
            onCheckedChange={setShortRecap}
          />
        </div>
      </section>
    </div>
  );
}

export default function NotificationsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: NotificationsTab = searchParams.get("tab") === "imessage" ? "imessage" : "general";
  const setActiveTab = (tab: NotificationsTab) => {
    setSearchParams(tab === "general" ? {} : { tab }, { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Notifications</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Choose how and when you want to hear about activity in your workspace.
        </p>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "general" && <GeneralTab />}
      {activeTab === "imessage" && <ImessageTab />}
    </div>
  );
}
