import {
  ACQUISITION_QUALITY,
  ADA,
  AMARA,
  IFEOMA,
  KUNLE,
  ORCHESTRATOR,
  PRICE_MARGIN,
  RAVI,
  REPEAT_DECAY,
  SAM,
  TUNDE,
  ZAINAB,
} from "@/pages/rooms/data";
import type { RoomDetail } from "@/pages/rooms/room/types";

/**
 * Full room-detail content, sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-rooms/R12–R39.
 * Only "second-order-never-happened" gets the full treatment (every
 * subpage); the other four rooms exist to demo the closed/restricted/
 * recovering states each subpage's shared template branches on.
 */

const SECOND_ORDER: RoomDetail = {
  id: "second-order-never-happened",
  title: "Second order never happened",
  status: "open",
  headline: "War room",
  subtitle: "War room · 148,000 customers · cohort Mar–May · owner Ifeoma Nwosu",
  agentsChipCount: 3,
  humans: [IFEOMA, TUNDE, AMARA, RAVI],
  atRisk: "₦412M at risk",
  owner: IFEOMA,

  runStatus: { state: "working", detail: "turn 4, 4.2M rows scanned" },

  thread: [
    {
      kind: "message",
      id: "t1",
      actor: { kind: "agent", agent: REPEAT_DECAY },
      time: "07:44",
      lines: ["Second orders fell 11 points the week the delivery fee moved. n=1.24M, held 20 weeks."],
      chip: { label: "Causal finding", tone: "ultra" },
      toolCall: "read orders · 4.2M rows · 1.9s",
    },
    {
      kind: "message",
      id: "t2",
      actor: { kind: "human", person: AMARA },
      time: "07:31",
      lines: ["@Ifeoma can we hold wave one until the fee fix ships Thursday?"],
    },
    {
      kind: "message",
      id: "t3",
      actor: { kind: "human", person: RAVI },
      time: "07:47",
      lines: ["Real exposure is closer to ₦386M once we net off refunds."],
    },
    {
      kind: "message",
      id: "t4",
      actor: { kind: "human", person: IFEOMA },
      time: "08:02",
      lines: ["Holding wave one to Friday. No discount in wave one — that is the test."],
    },
  ],

  decisionDoc: {
    revisionLabel: "Revision 4 of 4",
    statement:
      "Hold wave one to Friday and send it with no offer, because that is the only version of this that tells us whether price was ever the problem.",
    draftedBy: REPEAT_DECAY,
    decidedBy: { person: IFEOMA, time: "08:02" },
    statusChip: { label: "decided", tone: "teal" },
    guardrailsBody: "Frequency cap 1 of 2 used. Quiet hours in each market's local time. No offer in wave one.",
    liveEditing: { person: AMARA, note: "Amara is editing this section right now" },
    suggestion: {
      agent: REPEAT_DECAY,
      body: "Exclude the 6,000 already in Thursday's win-back — sending both would breach the cap on 2 August.",
    },
    whatWouldChange: "Wave one reactivates below 12% — then price is a factor and Tunde is right.",
    revisions: [
      { id: "r4", name: "Amara Okeke", nameTone: "amber", note: "editing guardrails now", current: true },
      { id: "r3", name: "Ifeoma Nwosu", nameTone: "teal", note: 'decided · added "no discount in wave one"' },
      { id: "r2", name: "Repeat & Decay", nameTone: "ultra", note: "added impact and cost of waiting" },
      { id: "r1", name: "Repeat & Decay", nameTone: "ultra", note: "first draft · 07:48" },
    ],
  },

  evidenceEyebrow: "Evidence · what each statement is allowed to claim",
  evidenceClaims: [
    {
      chip: { label: "Causal finding", tone: "ultra" },
      body: "Second-order rate fell 11 points the week the fee moved. Before/after cohort, n=1.24M, 20 weeks. UK and Ghana held flat and did not ship the fee.",
      meta: "orders · 4 Mar – 2 Aug · high confidence",
      metaTone: "ultra",
    },
    {
      chip: { label: "Strong association", tone: "neutral" },
      body: "Cohorts with a failed first delivery reorder 31 points lower. Associated with, not shown to cause — these customers also skew to two Lagos postcodes.",
      meta: "delivery · 12,800 customers · trailing 12 months",
      metaTone: "neutral",
    },
    {
      chip: { label: "Strong association", tone: "neutral" },
      body: "Customers who saw the fee and completed checkout anyway reorder at 34%. The fee is a filter once it is expected, not a deterrent.",
      meta: "orders · 41,900 customers",
      metaTone: "neutral",
    },
    {
      chip: { label: "Insufficient evidence", tone: "amber" },
      body: "No read on competitor pricing in the same window. No market price feed is connected.",
      meta: "would resolve: connect a market price source",
      metaTone: "amber",
    },
    {
      chip: { label: "Insufficient evidence", tone: "amber" },
      body: "No read on whether the fee changed basket size, because basket contents are not in the orders feed.",
      meta: "would resolve: map order_lines · 41 days overdue",
      metaTone: "amber",
    },
  ],

  evidenceFinding: {
    id: "causal-finding",
    title: "Causal finding",
    subtitle: "Second orders fell 11 points in the week of 4 March · n=1.24M · held 20 weeks",
    stats: [
      { label: "Confidence", value: "High", tone: "ink", note: "4 of 5 inputs current" },
      { label: "Sample", value: "1.24M customers", tone: "ink", note: "not a subset" },
      { label: "Held for", value: "20 weeks", tone: "teal", note: "and counting" },
      { label: "Comparison group", value: "2 markets", tone: "teal", note: "UK and Ghana" },
    ],
    claimHeading: "Second orders fell 11 points in the week of 4 March and have not recovered",
    claimBody:
      "Cohorts acquired before 4 March reach a 37.4% second-order rate at 90 days. Cohorts acquired after reach 27.2%. The UK and Ghana, where the fee did not ship until June, held at 37.6% across the same period. The step is dated to a single week and has held flat for twenty since.",
    causalTests: [
      { test: "Is there a dated change?", result: "Yes · release 2024.3.11, 4 March, delivery fee moved to checkout", passes: "yes", passesTone: "teal" },
      { test: "Is the effect dated to it?", result: "Yes · the break is one week wide, not a gradual slope", passes: "yes", passesTone: "teal" },
      { test: "Is there a group that did not get it?", result: "Yes · UK and Ghana, 138,000 customers, fee shipped in June", passes: "yes", passesTone: "teal" },
      { test: "Did that group hold?", result: "Yes · 37.6% against 37.4% before · no measurable movement", passes: "yes", passesTone: "teal" },
      { test: "Is there a plausible alternative?", result: "Channel mix · Acquisition Quality attributes 3.2 of the 11 points", passes: "partly", passesTone: "amber" },
      { test: "Has anything else changed in the window?", result: "Discount depth on 16 March · after the break, not before", passes: "yes, ruled out", passesTone: "teal" },
    ],
    readings: [
      {
        eyebrow: "Repeat & Decay",
        agent: REPEAT_DECAY,
        heading: "Most of the 11 points is the fee",
        body: "Attributes 7.1 points to the fee and 3.9 to everything else. Built from the held-back markets, which is the strongest comparison available.",
        footer: "high confidence",
        tone: "ultra",
      },
      {
        eyebrow: "Acquisition Quality",
        agent: ACQUISITION_QUALITY,
        heading: "Nearer two thirds",
        body: "Attributes 7.1 to the fee too, but argues 3.2 of the remainder is guest-share dilution rather than unexplained — which changes what you would do about it.",
        footer: "agrees on the fee, differs on the rest",
        tone: "amber",
      },
      {
        eyebrow: "How it is presented",
        agent: ORCHESTRATOR,
        heading: "Both, with their evidence",
        body: "The Orchestrator put both readings in the doc rather than averaging them. They agree on the number that matters and differ on the residual — averaging would have hidden that they agree.",
        footer: "not resolved, and not hidden",
        tone: "neutral",
      },
    ],
  },

  log: [
    { time: "08:14", actor: { kind: "human", person: IFEOMA }, actorTone: "teal", action: "Approved the reactivation sequence", annotation: "under your identity · re-auth", annotationTone: "ink" },
    { time: "08:12", actor: { kind: "agent", agent: REPEAT_DECAY }, actorTone: "ultra", action: "Wrote decision doc, revision 4", annotation: "autosaved", annotationTone: "ink" },
    { time: "08:09", actor: { kind: "human", person: AMARA }, actorTone: "ink", action: "Edited guardrails", annotation: "added quiet hours", annotationTone: "ink" },
    { time: "08:02", actor: { kind: "human", person: IFEOMA }, actorTone: "ink", action: "Decided: hold wave one, no offer", annotation: "resolves the conflict", annotationTone: "ink" },
    { time: "07:58", actor: { kind: "human", person: IFEOMA }, actorTone: "amber", action: "Deferred the 20% discount", annotation: "dissent recorded · Tunde", annotationTone: "amber" },
    { time: "07:52", actor: { kind: "agent", agent: ORCHESTRATOR }, actorTone: "amber", action: "Raised a conflict, did not pick", annotation: "growth vs finance", annotationTone: "ink" },
    { time: "07:49", actor: { kind: "agent", agent: REPEAT_DECAY }, actorTone: "neutral", action: "read orders · 4.2M rows · 1.9s", annotation: "tool call", annotationTone: "ink" },
    { time: "07:47", actor: { kind: "human", person: RAVI }, actorTone: "ink", action: "Commented on exposure", annotation: "₦386M net of refunds", annotationTone: "ink" },
    { time: "07:44", actor: { kind: "agent", agent: REPEAT_DECAY }, actorTone: "ultra", action: "Posted causal finding", annotation: "n=1.24M", annotationTone: "ink" },
    { time: "07:41", actor: { kind: "agent", agent: REPEAT_DECAY }, actorTone: "neutral", action: "Run 8f2c started", annotation: "triggered by threshold", annotationTone: "ink" },
    { time: "07:40", actor: { kind: "system", label: "System" }, actorTone: "rose", action: "Second-order rate crossed −10 pts", annotation: "opened this room", annotationTone: "ink" },
  ],

  playsCountLabel: "5 · 1 needs you",
  playsBoard: [
    {
      id: "reactivate-100000",
      title: "Reactivate 100,000 in three waves",
      reach: "100,000",
      proposedBy: { kind: "agent", agent: REPEAT_DECAY },
      stateLabel: "needs approval",
      stateTone: "amber",
      whoDecides: IFEOMA,
      waiting: "19 hrs",
      waitingTone: "rose",
      effect: "₦258M",
      effectTone: "rose",
    },
    {
      id: "show-fees",
      title: "Show fees before checkout",
      reach: "all",
      proposedBy: { kind: "human", person: ZAINAB },
      stateLabel: "in progress",
      stateTone: "ultra",
      whoDecides: SAM,
      waiting: "ships Thu",
      waitingTone: "ink",
      effect: "prevents recurrence",
      effectTone: "teal",
    },
    {
      id: "reactivation-discount",
      title: "20% reactivation discount",
      reach: "100,000",
      proposedBy: { kind: "agent", agent: REPEAT_DECAY },
      stateLabel: "deferred",
      stateTone: "neutral",
      whoDecides: IFEOMA,
      waiting: "—",
      waitingTone: "ink",
      effect: "dissent recorded",
      effectTone: "amber",
    },
    {
      id: "exclude-6000",
      title: "Exclude the 6,000 double-contacted",
      reach: "6,000",
      proposedBy: { kind: "agent", agent: REPEAT_DECAY },
      stateLabel: "approved with edits",
      stateTone: "teal",
      whoDecides: IFEOMA,
      waiting: "—",
      waitingTone: "ink",
      effect: "avoids a cap breach",
      effectTone: "teal",
    },
    {
      id: "retry-cards",
      title: "Retry cards at 09:00 local",
      reach: "12,400",
      proposedBy: { kind: "agent", agent: { initials: "IC", name: "Involuntary Churn" } },
      stateLabel: "approved",
      stateTone: "teal",
      whoDecides: RAVI,
      waiting: "—",
      waitingTone: "ink",
      effect: "₦18M recovered",
      effectTone: "teal",
    },
    {
      id: "credit-42000",
      title: "Offer ₦500 credit to the 42,000 unreachable",
      reach: "0",
      reachTone: "rose",
      proposedBy: { kind: "agent", agent: REPEAT_DECAY },
      stateLabel: "rejected",
      stateTone: "rose",
      whoDecides: IFEOMA,
      waiting: "—",
      waitingTone: "ink",
      effect: "they cannot be reached",
      effectTone: "rose",
    },
  ],

  proposal: {
    id: "reactivate-100000",
    title: "Reactivate 100,000 in three waves",
    subtitle: "Proposed by Repeat & Decay 07:41 · waiting on Ifeoma Nwosu · ₦258M recoverable",
    waitingHours: "19 hours",
    decayNote:
      "Roughly 4,100 customers pass the 90-day mark every day and their response rate falls from 16.1% to 4.2% when they do.",
    settings: [
      { label: "Audience", value: "100,000 · reachable, after exclusions", source: "built in this room", sourceTone: "ink" },
      { label: "Waves", value: "3 × 33,000 · Fri, Mon, Thu", source: "proposed by Repeat & Decay", sourceTone: "ultra" },
      { label: "Channel", value: "email, then push for non-openers after 48 hrs", source: "consent checked per person", sourceTone: "teal" },
      { label: "Offer", value: "none in wave one · this is the test", source: "Ifeoma, 08:02", sourceTone: "ink" },
      { label: "Message", value: "the fee now shows at basket · here is what changed", source: "drafted · editable", sourceTone: "ink" },
      { label: "Holdout", value: "10% · 10,000 not contacted", source: "set at room creation", sourceTone: "teal" },
      { label: "Quiet hours", value: "respected in each market's local time", source: "guardrail · cannot be overridden", sourceTone: "amber" },
      { label: "Frequency cap", value: "1 of 2 used this week", source: "6,000 already excluded", sourceTone: "amber" },
      { label: "Runs under", value: "your identity · re-auth required", source: "logged against your name", sourceTone: "rose" },
    ],
    outlook: [
      {
        eyebrow: "If it works",
        agent: REPEAT_DECAY,
        heading: "16,100 second orders · ₦258M",
        body: "16.1% response, taken from the Kenya no-offer campaign in June rather than from the discounted Thursday win-back. Measured against the holdout over 28 days.",
        footer: "the number this is judged on",
        tone: "teal",
      },
      {
        eyebrow: "If it fails",
        heading: "Below 12% means price was the barrier",
        body: "Written into the decision doc before the wave was built. Below 12% and Tunde's deferred discount becomes the right call, and the room says so rather than re-explaining the result.",
        footer: "committed in advance",
        tone: "amber",
      },
      {
        eyebrow: "What cannot be undone",
        heading: "A sent message",
        body: "Wave one reaches 33,000 people on Friday at 08:00 local. It can be stopped up to the send, held mid-flight from the stop screen, and not recalled after delivery.",
        footer: "stop is one tap from here",
        tone: "rose",
      },
    ],
  },

  conflict: {
    id: "c1",
    title: "Two recommendations conflict",
    raisedBy: ORCHESTRATOR,
    raisedAt: "07:52",
    owner: IFEOMA,
    columns: { left: "Growth · Repeat & Decay", right: "Finance · Price & Margin" },
    rows: [
      { label: "Recommends", left: "20% off in wave one", right: "No offer in wave one", agreed: "no", agreedTone: "rose" },
      { label: "Because", left: "Discounting recovers volume fastest at day 60–90", right: "94,000 already never pay full price", agreed: "both true", agreedTone: "amber" },
      { label: "Evidence", left: "Thursday win-back · +4.1 pts vs holdout", right: "Discount-only cohort · 11.1% repeat", agreed: "both measured", agreedTone: "teal" },
      { label: "Expected recovery", left: "18,400 second orders", right: "16,100 second orders", agreed: "−2,300", agreedTone: "amber" },
      { label: "Expected margin", left: "Unavailable · no COGS", right: "Unavailable · no COGS", agreed: "neither can say", agreedTone: "rose" },
      { label: "Long-run effect", left: "Teaches the cohort to wait for a discount", right: "Tests whether price mattered at all", agreed: "the real difference", agreedTone: "amber" },
    ],
    resolve: [
      {
        eyebrow: "Choose one",
        heading: "And the other becomes a recorded dissent",
        body: "Whichever you pick, the other agent's position and whoever backed it stay attached to the decision — named, dated, and cited if this comes up again.",
        footer: "what Ifeoma did at 08:02",
        tone: "teal",
      },
      {
        eyebrow: "Ask for a third reading",
        heading: "Send it back with a question",
        body: '"Split the fee effect from channel mix" queues a run. The conflict stays open while it runs and nothing is decided in the meantime.',
        footer: "one queued now",
        tone: "ultra",
      },
      {
        eyebrow: "Escalate",
        heading: "If it is above your authority",
        body: "A discount of this size needs Ravi. Escalating moves the decision, not the room — the conflict, the evidence and both readings travel with it.",
        footer: "goes to Ravi, not to a queue",
        tone: "amber",
      },
    ],
  },

  dissent: {
    by: TUNDE,
    recordedAt: "07:58, before the decision was made",
    quote:
      "We are leaving volume on the table. The no-offer test is clean but it costs us a quarter to learn something we could have learned alongside a discount.",
    workspaceRows: [
      {
        quote: "We are leaving volume on the table",
        room: "Second order never happened",
        by: TUNDE,
        recorded: "07:58 today",
        status: { label: "open", tone: "amber" },
        outcome: { label: "measured at close", tone: "ultra" },
      },
      {
        quote: "Midnight retries are fine, it is the cards",
        room: "Cards failing on renewal night",
        by: KUNLE,
        recorded: "2 Apr",
        status: { label: "closed", tone: "teal" },
        outcome: { label: "no · ₦62M recovered", tone: "rose" },
      },
      {
        quote: "Ghana is a land-grab, CAC is the wrong lens",
        room: "Ghana signups convert at 4%",
        by: TUNDE,
        recorded: "11 Aug",
        status: { label: "open", tone: "amber" },
        outcome: { label: "unresolved", tone: "neutral" },
      },
    ],
  },

  guardrails: [
    { name: "Frequency cap", setting: "2 messages per customer per week", appliesTo: "everyone", appliesToTone: "ink", setBy: undefined, overridable: { label: "no", tone: "rose" } },
    { name: "Quiet hours", setting: "21:00–07:00 in each market's local time", appliesTo: "everyone", appliesToTone: "ink", overridable: { label: "no", tone: "rose" } },
    { name: "Opt-out and erasure", setting: "excluded permanently, before any audience is built", appliesTo: "everyone", appliesToTone: "ink", overridable: { label: "never", tone: "rose" } },
    { name: "No offer in wave one", setting: "no discount, no credit, no free delivery", appliesTo: "this room", appliesToTone: "amber", setBy: IFEOMA, overridable: { label: "by Ifeoma", tone: "amber" } },
    { name: "Holdout", setting: "10% · 10,000 customers not contacted", appliesTo: "this room", appliesToTone: "amber", overridable: { label: "no · would void the result", tone: "rose" } },
    { name: "Throughput ceiling", setting: "35,000 sends per hour · delivery mesh limit", appliesTo: "everyone", appliesToTone: "ink", overridable: { label: "no", tone: "rose" } },
    { name: "Send window", setting: "08:00–18:00 local only", appliesTo: "this room", appliesToTone: "amber", setBy: AMARA, overridable: { label: "by Amara", tone: "amber" } },
  ],
  guardrailStops: [
    { when: "07:44", what: "6,000 customers in Thursday's win-back", affected: "6,000", guardrail: "frequency cap", instead: "Excluded from the audience before approval" },
    { when: "07:44", what: "2,400 opted out or erasure requested", affected: "2,400", guardrail: "opt-out", instead: "Excluded permanently, in every room" },
    { when: "08:14", what: "Wave one at 33,000 in one hour", affected: "33,000", guardrail: "throughput", instead: "Split across 58 minutes automatically" },
    { when: "08:14", what: "Kenya recipients at 08:00 WAT", affected: "4,100", guardrail: "quiet hours", instead: "Held to 08:00 EAT · one hour later" },
  ],

  runs: [
    { id: "8f2c-11", agent: REPEAT_DECAY, started: "08:16", turns: "4", rowsRead: "4.2M", state: { label: "running", tone: "ultra" }, result: "—", resultTone: "ink" },
    { id: "8f2c-10", agent: ACQUISITION_QUALITY, started: "08:09", turns: "2", rowsRead: "890k", state: { label: "queued", tone: "amber" }, result: "waits on 11", resultTone: "ink" },
    { id: "8f2c-09", agent: REPEAT_DECAY, started: "07:58", turns: "3", rowsRead: "1.9M", state: { label: "cancelled", tone: "neutral" }, result: "by Ifeoma · redirected", resultTone: "ink" },
    { id: "8f2c-08", agent: PRICE_MARGIN, started: "07:51", turns: "1", rowsRead: "0", rowsReadTone: "rose", state: { label: "failed", tone: "rose" }, result: "COGS source missing", resultTone: "rose" },
    { id: "8f2c-07", agent: REPEAT_DECAY, started: "07:44", turns: "6", rowsRead: "4.2M", state: { label: "done", tone: "teal" }, result: "causal finding", resultTone: "teal" },
    { id: "8f2c-06", agent: ORCHESTRATOR, started: "07:52", turns: "1", rowsRead: "—", state: { label: "done", tone: "teal" }, result: "raised a conflict", resultTone: "amber" },
  ],

  steering: {
    turn: "4 of an expected 6",
    queued: "1 · from Ravi",
    appliedAt: "turn 5",
    rowsRead: "4.3M",
    elapsed: "3m 41s",
    cost: "₦18 in compute",
    actions: [
      { label: "Add a constraint", tone: "ultra", body: '"Net off refunds" · applied at the next turn, not the current one' },
      { label: "Ask a question", tone: "ultra", body: "Answered in the thread without stopping the run" },
      { label: "Redirect it", tone: "amber", body: '"Look at Kenya instead" · the current turn finishes first' },
      { label: "Cancel it", tone: "amber", body: "Partial work is kept and marked partial" },
      { label: "Pause the agent entirely", tone: "rose", body: "Stops it in every room, not just this one" },
    ],
  },

  peoplePermissions: [
    { person: IFEOMA, role: { label: "decision owner", tone: "ultra" }, canApprove: "up to 100,000", canApproveTone: "teal", added: "2 Aug", addedBy: "opened it", seesCohort: { label: "yes", tone: "amber" } },
    { person: TUNDE, role: { label: "participant", tone: "neutral" }, canApprove: "up to 5,000", canApproveTone: "amber", added: "2 Aug", addedBy: "Ifeoma", seesCohort: { label: "yes", tone: "amber" } },
    { person: AMARA, role: { label: "participant", tone: "neutral" }, canApprove: "up to 5,000", canApproveTone: "amber", added: "2 Aug", addedBy: "Ifeoma", seesCohort: { label: "yes", tone: "amber" } },
    { person: RAVI, role: { label: "approver", tone: "ultra" }, canApprove: "any discount", canApproveTone: "teal", added: "2 Aug", addedBy: "routing rule", seesCohort: { label: "yes", tone: "amber" } },
    { person: ADA, role: { label: "observer", tone: "neutral" }, canApprove: "over 100,000", canApproveTone: "teal", added: "automatic", addedBy: "above ₦25M", seesCohort: { label: "yes", tone: "amber" } },
  ],
  agentPermissions: [
    { agent: REPEAT_DECAY, does: "Owns the reading · repeat rate, cohorts, response", role: { label: "lead", tone: "ultra" }, reads: "orders, delivery", canAct: { label: "propose only", tone: "amber" } },
    { agent: ACQUISITION_QUALITY, does: "Channel mix · half this cohort was decided upstream", role: { label: "supporting", tone: "neutral" }, reads: "orders, ad spend", canAct: { label: "propose only", tone: "amber" } },
    { agent: ORCHESTRATOR, does: "Arbitrates disagreement · never picks a side", role: { label: "automatic", tone: "neutral" }, reads: "everything in the room", canAct: { label: "cannot propose", tone: "teal" } },
    { agent: PRICE_MARGIN, does: "Would price a discount · blocked on COGS", role: { label: "optional", tone: "neutral" }, reads: "billing", canAct: { label: "blocked", tone: "rose" } },
  ],

  cohortSample: [
    { customer: "Chidi O.", acquired: "14 Mar", firstOrder: "₦8,400", since: "151 days", market: "NG", firstDelivery: { label: "on time", tone: "teal" }, contactable: { label: "yes", tone: "teal" } },
    { customer: "Amina B.", acquired: "2 Apr", firstOrder: "₦3,100", since: "132 days", market: "NG", firstDelivery: { label: "on time", tone: "teal" }, contactable: { label: "erasure requested", tone: "rose" } },
    { customer: "Tobi A.", acquired: "19 Mar", firstOrder: "₦12,900", since: "146 days", market: "NG", firstDelivery: { label: "late", tone: "amber" }, contactable: { label: "opted out", tone: "rose" } },
    { customer: "Ngozi E.", acquired: "8 May", firstOrder: "₦5,600", since: "96 days", market: "NG", firstDelivery: { label: "on time", tone: "teal" }, contactable: { label: "yes", tone: "teal" } },
    { customer: "Kwame A.", acquired: "21 Apr", firstOrder: "GHS 210", since: "113 days", market: "GH", firstDelivery: { label: "failed", tone: "rose" }, contactable: { label: "yes", tone: "teal" } },
    { customer: "Grace M.", acquired: "3 Mar", firstOrder: "KES 1,940", since: "162 days", market: "KE", firstDelivery: { label: "on time", tone: "teal" }, contactable: { label: "capped this week", tone: "amber" } },
  ],

  collisionRows: [
    { room: "Thursday win-back", team: "Marketing", overlap: "31,900", overlapTone: "rose", theirSend: "Thu 09:00", yourSend: "Fri 08:00", gap: "23 hrs", gapTone: "rose", verdict: { label: "breaches cap", tone: "rose" } },
    { room: "Discount-only buyers", team: "Sales", overlap: "9,400", overlapTone: "amber", theirSend: "Fri 14:00", yourSend: "Fri 08:00", gap: "6 hrs", gapTone: "rose", verdict: { label: "breaches cap", tone: "rose" } },
    { room: "Lagos delivery apology", team: "Support", overlap: "4,100", overlapTone: "amber", theirSend: "Wed 11:00", yourSend: "Fri 08:00", gap: "45 hrs", gapTone: "teal", verdict: { label: "allowed", tone: "teal" } },
    { room: "Kenya referral push", team: "Marketing", overlap: "1,900", overlapTone: "neutral", theirSend: "Mon 09:00", yourSend: "Fri 08:00", gap: "4 days", gapTone: "teal", verdict: { label: "allowed", tone: "teal" } },
  ],
  closeForm: {
    summary: "Open 41 days · 4 people · 3 agents · 6 plays · 1 recorded dissent",
    ledger: [
      { label: "At risk when opened", value: "₦412M", tone: "rose" },
      { label: "Reachable", value: "100,000 of 148,000", tone: "amber" },
      { label: "Contacted", value: "90,000 · 10,000 held back", tone: "ink" },
      { label: "Second orders in the contacted group", value: "16,380 · 18.2%", tone: "teal" },
      { label: "Second orders in the holdout", value: "620 · 6.2%", tone: "ink" },
      { label: "Lift", value: "12.0 points", tone: "teal" },
      { label: "Recovered", value: "₦318M", tone: "teal" },
      { label: "Excluded as unattributable", value: "₦24M · the Kenya overlap", tone: "ink" },
      { label: "Measured over", value: "12 Aug – 9 Sep · 28 days", tone: "ink" },
    ],
    closingTitle:
      "Wave one came in at 18.2% and the prediction said below 12% would mean price was the barrier",
    closingBody:
      "It did not. Tunde's recorded dissent is checked automatically at close and marked as not borne out — with his original wording kept, because being wrong about this once is information and deleting it is not.",
  },

  mergeCandidate: {
    title: "Two rooms, one cause",
    subtitle: "91,400 customers in both · ₦188M being counted twice",
    rows: [
      { label: "Opened", left: "2 Aug by Repeat & Decay", right: "11 Aug by Product Reason", agreed: "9 days apart", agreedTone: "neutral" },
      { label: "Owner", left: "Ifeoma Nwosu · Marketing", right: "Zainab Yusuf · Product", agreed: "two teams", agreedTone: "amber" },
      { label: "Population", left: "148,000", right: "308,000", agreed: "91,400 in both", agreedTone: "rose" },
      { label: "At risk", left: "₦412M", right: "₦124M", agreed: "₦188M counted twice", agreedTone: "rose" },
      { label: "Root cause found", left: "The 4 March delivery fee", right: "The 4 March delivery fee", agreed: "identical", agreedTone: "rose" },
      { label: "What each would do", left: "Recover the people already lost", right: "Stop losing the next ones", agreed: "complementary", agreedTone: "teal" },
      { label: "Plays", left: "6 · one awaiting approval", right: "2 · one shipped", agreed: "no conflict", agreedTone: "teal" },
    ],
    keepBody:
      "Nothing is deleted. The merged room carries two decision docs side by side with their original authors, dates and dissent intact — and both threads interleaved by time.",
    reconcileBody:
      "364,600 customers, not 456,000. ₦348M at risk, not ₦536M. The double count disappears from every rollup, including the value ledger and Ada's board export.",
    decideBody:
      "Ifeoma and Zainab cannot both own it. The merge asks who, in front of both of them, and records the other as a named participant rather than quietly demoting them.",
  },

  collisionOptions: [
    {
      label: "Exclude them",
      heading: "Send to 58,700 instead",
      body: "The other four rooms keep their audiences. Yours shrinks by 41%, and the excluded customers enter wave two automatically once the cap window clears — nine days later.",
      footer: "recommended · costs you 9 days",
      tone: "teal",
    },
    {
      label: "Take priority",
      heading: "You send, they exclude",
      body: "Your room is worth ₦412M against their ₦46M combined. Taking priority needs Ada, and the four other owners are told immediately, with the reason and your name.",
      footer: "needs Ada · notifies 4 owners",
      tone: "amber",
    },
    {
      label: "Reschedule yours",
      heading: "Move wave one to Monday",
      body: "Clears every collision without excluding anybody. Costs three days, in which roughly 12,300 customers pass the 90-day mark and become much harder to reach.",
      footer: "clean, but ₦6.3M of decay",
      tone: "neutral",
    },
  ],
};

const WEEKEND_PUSH_FATIGUE: RoomDetail = {
  id: "weekend-push-fatigue",
  title: "Weekend push fatigue",
  status: "recovering",
  headline: "Reopened",
  subtitle: "Reopened 4 July by an agent · second opening · the first one is intact",
  agentsChipCount: 1,
  humans: [IFEOMA],
  atRisk: "₦12M at risk",
  owner: IFEOMA,
  reopenedCompare: [
    { label: "Why it opened", first: "Unsubscribes up 31% over 2 weeks", second: "Unsubscribes up 28% over 3 weeks", changed: "similar", changedTone: "amber" },
    { label: "Population", first: "94,000 push-enabled customers", second: "112,000", changed: "+19%", changedTone: "amber" },
    { label: "What was decided", first: "Reduce weekend push 3 → 1", second: "Not yet decided", changed: "—", changedTone: "neutral" },
    { label: "Outcome", first: "Unmeasurable · no holdout possible", second: "—", changed: "—", changedTone: "neutral" },
    { label: "Can it be measured this time?", first: "No", second: "Yes · frequency is now per-customer", changed: "the constraint was fixed", changedTone: "teal" },
    { label: "Owner", first: "Ifeoma Nwosu", second: "Ifeoma Nwosu", changed: "same", changedTone: "neutral" },
  ],
  reopenedCarries: [
    { label: "The first decision doc", value: "read-only · not overwritten, not merged", tone: "teal" },
    { label: "The first evidence", value: "still cited · marked as from the first opening", tone: "ink" },
    { label: "The first outcome", value: "unmeasurable · and the reason why", tone: "amber" },
    { label: "Anything the first opening obliged", value: "one handoff · shipped in May", tone: "teal" },
    { label: "A fresh thread and fresh plays", value: "the working surfaces start empty", tone: "ink" },
    { label: "The same room ID", value: "so every link ever pasted still resolves here", tone: "ink" },
  ],
};

const UK_CHECKOUT_LATENCY: RoomDetail = {
  id: "uk-checkout-latency",
  title: "UK checkout latency",
  status: "closed",
  outcome: "no_action_needed",
  headline: "Closed",
  subtitle: "Closed 22 August · real, measured, and not worth fixing",
  agentsChipCount: 1,
  humans: [RAVI],
  atRisk: "£14k at risk",
  owner: RAVI,
  closeSummary:
    "The reading was real and the cost of acting on it was higher than the thing it would recover. That is a valid outcome and it is recorded as one.",
  closeFacts: [
    { label: "The finding", value: "UK checkout is 1.4s slower than Nigeria on 3G", tone: "ultra" },
    { label: "Confidence", value: "High · measured over 69,000 sessions", tone: "teal" },
    { label: "Effect on revenue", value: "£14k a year · 0.03% of company revenue", tone: "ink" },
    { label: "Cost to fix", value: "Two engineer-weeks · roughly £22k", tone: "rose" },
    { label: "Decision", value: "Not worth it now · revisit if UK volume triples", tone: "ink" },
    { label: "Who decided", value: "Ravi Mehta · 22 August", tone: "ink" },
    { label: "Dissent recorded", value: "None", tone: "ink" },
  ],
  closingNoteTitle: "19% of closed rooms in this workspace end this way, and that is healthy",
  closingNote:
    'A product that only lets you close a room by doing something turns every finding into an obligation. "We looked, it is real, it is not worth fixing" is a decision worth writing down — it stops the same thing being rediscovered every quarter.',
  closeLedger: [
    { what: "The latency finding", where: "Business memory", state: { label: "validated", tone: "teal" } },
    { what: "The £14k figure", where: "Value ledger · identified, not recovered", state: { label: "excluded from recovered", tone: "amber" } },
    { what: "The revisit condition", where: "A threshold in Activate", state: { label: "if volume triples, reopens", tone: "ultra" } },
    { what: "Nothing", where: "Handoffs", state: { label: "no obligation created", tone: "neutral" } },
  ],
};

const SECOND_ORDER_RECOVERED: RoomDetail = {
  id: "second-order-recovered",
  title: "Second order never happened",
  status: "closed",
  outcome: "money_recovered",
  headline: "Closed",
  subtitle: "Closed 9 September · ₦318M recovered · cited twice since",
  agentsChipCount: 3,
  humans: [IFEOMA, TUNDE, AMARA, RAVI],
  atRisk: "₦412M at risk",
  owner: IFEOMA,
  closeSummary:
    "Wave one recovered 18.2% with no offer at all, against 6.2% in the holdout — a 12-point lift on 90,000 customers. Two independent measurements now say the same thing, and business memory holds it as validated.",
  closingNoteTitle: "Closing a room does not close what it obliged other people to do",
  closingNote:
    "Two handoffs from this room are still open under their own owners and dates. And the 42,000 customers who could never be reached became a new room in Activate — a finding this room could not act on but should not have taken to the grave with it.",
  closeLedger: [
    { what: "₦318M recovered", where: "Value ledger", value: "₦318M", visibleTo: "everyone · board export", state: { label: "counted", tone: "teal" } },
    { what: "₦24M unattributable", where: "Value ledger, excluded", value: "₦24M", visibleTo: "everyone", state: { label: "stated, not counted", tone: "amber" } },
    { what: "Fee transparency beats discounting", where: "Business memory", visibleTo: "everyone · searchable", state: { label: "validated", tone: "teal" } },
    { what: "Tunde's dissent", where: "Attached to the decision", visibleTo: "everyone", state: { label: "not borne out", tone: "amber" } },
    { what: "Two outstanding handoffs", where: "Handoff chain · still open", value: "₦31M", visibleTo: "their owners", state: { label: "survive the close", tone: "amber" } },
    { what: "The 42,000 unreachable", where: "Opened a new room in Activate", value: "₦38M", visibleTo: "Zainab Yusuf", state: { label: "new room", tone: "ultra" } },
  ],
};

const Q3_PRICING_REVIEW: RoomDetail = {
  id: "q3-pricing-review",
  title: "Q3 pricing review",
  status: "restricted",
  headline: "Restricted",
  subtitle: "Finance · restricted at creation by Ravi Mehta · six people inside",
  agentsChipCount: 0,
  humans: [],
  atRisk: "",
  restrictedBy: RAVI,
  restrictedReason: "pricing before announcement · one of four permitted reasons",
};

const ROOMS: Record<string, RoomDetail> = {
  [SECOND_ORDER.id]: SECOND_ORDER,
  [WEEKEND_PUSH_FATIGUE.id]: WEEKEND_PUSH_FATIGUE,
  [UK_CHECKOUT_LATENCY.id]: UK_CHECKOUT_LATENCY,
  [SECOND_ORDER_RECOVERED.id]: SECOND_ORDER_RECOVERED,
  [Q3_PRICING_REVIEW.id]: Q3_PRICING_REVIEW,
};

export function getRoom(id: string): RoomDetail | undefined {
  return ROOMS[id];
}
