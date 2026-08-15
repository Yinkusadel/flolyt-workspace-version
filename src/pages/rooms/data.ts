import type { RoomDetail } from "@/pages/rooms/types";

/**
 * Mock content for screens 27-35 (Rooms) in flolyt-kit-122 — see
 * flolyt-kit-122/27-room-cohort-war-room.svg through 35-plays-at-scale.svg
 * and docs/build-tracker.md.
 *
 * Two rooms carry the exact content authored in the kit (the cohort war
 * room and Northwind Retail, both its war-room and persistent forms). The
 * other four rows shown on the Rooms index are original but consistent
 * content, written to the same voice, so every row on the index is a real
 * room rather than a dead link.
 */

const IFEOMA = { initials: "IN", name: "Ifeoma Nwosu", department: "Marketing" } as const;
const AMARA = { initials: "AO", name: "Amara Obi", department: "Support", roleLabel: "CX" } as const;
const TUNDE = { initials: "TB", name: "Tunde Bakare", department: "Sales", roleLabel: "Growth" } as const;

const ADA = { initials: "AO", name: "Ada Onwudiwe", department: "Customer Success", roleLabel: "CS" } as const;
const PRIYA = { initials: "PN", name: "Priya Nair", department: "Support" } as const;
const MARCUS = { initials: "MR", name: "Marcus Reed", department: "Sales" } as const;
const TOMAS = { initials: "TL", name: "Tomas Lindqvist", department: "Finance" } as const;
const JIDE = { initials: "JB", name: "Jide Balogun", department: "Customer Success" } as const;

const REPEAT_DECAY = { initials: "RD", name: "Repeat & Decay" };
const ORCHESTRATOR = { initials: "MO", name: "Orchestrator" };
const REVENUE_LEAKAGE = { initials: "RL", name: "Revenue & Leakage" };
const SUPPORT_SIGNAL = { initials: "SS", name: "Support Signal" };
const CS_HEALTH = { initials: "CH", name: "CS Health" };

const ROOMS: RoomDetail[] = [
  // ---------------------------------------------------------------------
  // 1. Second order never happened — screens 27, 29 (evidence/log adapted), 33, 34, 35
  // ---------------------------------------------------------------------
  {
    id: "second-order-never-happened",
    title: "Second order never happened",
    kind: "war-room",
    status: "live",
    listed: true,
    listMeta: {
      condition: "Repeat decay",
      population: "148,000",
      atRisk: "₦412M",
      owner: IFEOMA,
      working: [ORCHESTRATOR, REPEAT_DECAY, SUPPORT_SIGNAL],
      last: "live now",
    },
    chips: [
      { label: "War room", tone: "warn" },
      { label: "148,000 customers", tone: "risk" },
      { label: "Cohort · Mar–May acquisitions", tone: "neutral" },
    ],
    agents: [ORCHESTRATOR, REPEAT_DECAY, SUPPORT_SIGNAL],
    humans: [IFEOMA, AMARA, TUNDE],
    counts: { evidence: 22, plays: 5, log: 44 },
    decisionDoc: {
      eyebrow: "DECISION DOC · COHORT MAR–MAY · AUTOSAVED 08:12",
      statement:
        "Fix the delivery-fee surprise before discounting anyone. Reactivate the 148,000 without touching price.",
      draftedBy: REPEAT_DECAY,
      owner: IFEOMA,
      ownerStatus: "undecided",
      whyNow: [
        {
          grade: "causal",
          claim: "Second-order rate fell 11 points the week the delivery fee moved.",
          detail: "Before/after cohort, n=1.24M · sustained 20 weeks.",
          meta: "orders · 4 Mar – 2 Aug · high confidence",
        },
        {
          grade: "association",
          claim: "Cohorts with a failed first delivery reorder 31 points lower.",
          detail: "Associated with, not shown to cause.",
          meta: "12,800 customers · trailing 12 months",
        },
        {
          grade: "insufficient",
          claim: "No read on competitor pricing.",
          detail: "No source connected for market price.",
          meta: "would resolve: a market price feed",
        },
      ],
      impact: [
        { label: "REVENUE AT RISK", value: "₦412M", sub: "over 90 days", tone: "rose" },
        { label: "CUSTOMERS", value: "148,000", sub: "3.5% of base" },
        { label: "PER CUSTOMER", value: "₦2,784", sub: "expected 2nd order" },
        { label: "CONFIDENCE", value: "High", sub: "4 of 5 inputs current" },
      ],
      nextStep: {
        body: "Show the delivery fee before checkout, then reactivate the cohort in three waves of 48,000 with no discount in wave one. Ifeoma owns it, first wave Friday.",
        footnote: "Wave one doubles as the test of whether price was ever the problem.",
      },
      whatWouldChange: "Wave one reactivates below 12% — then price is a factor and Tunde is right.",
    },
    thread: [
      {
        kind: "message",
        id: "t1",
        actor: { kind: "agent", agent: REPEAT_DECAY },
        time: "07:04",
        lines: [
          "Second-order rate fell from 38% to 27% for everyone acquired after 4 March. 148,000 customers never came back.",
        ],
        evidenceTag: { grade: "causal", amount: "₦412M" },
        signal: "Delivery Signal · 12,800 failed drops",
      },
      {
        kind: "message",
        id: "t2",
        actor: { kind: "human", person: AMARA },
        roleLabel: "CX",
        time: "07:31",
        lines: ['Contact volume spiked the same week. Almost all of it is "where is my order", not price.'],
      },
      {
        kind: "message",
        id: "t3",
        actor: { kind: "human", person: TUNDE },
        roleLabel: "Growth",
        time: "07:36",
        lines: ["Give them 20% off and they'll reorder. We have the budget this quarter."],
      },
      {
        kind: "conflict",
        id: "t4",
        agent: ORCHESTRATOR,
        options: [
          { team: "Growth", summary: "20% off recovers volume fast" },
          { team: "Finance", summary: "94k are already discount-only" },
        ],
        ownerNote: "Needs a human decision · owner Ifeoma",
      },
    ],
    runStatus: { state: "running", detail: "turn 6 · 4.2M rows scanned", trailing: "" },
    proposals: [
      {
        id: "p1",
        status: "pending",
        title: "Reactivation wave one",
        rows: [
          { label: "Audience", value: "48,000 of 148,000" },
          { label: "Channel", value: "WhatsApp, then push" },
          { label: "Offer", value: "none — fee clarity only" },
          { label: "Markets", value: "NG, KE, GH" },
          { label: "Send window", value: "local, 09:00–19:00" },
          { label: "Frequency cap", value: "1 of 2 used" },
        ],
        actionKey: "create_campaign_from_workflow · 08:04",
        reauthAmount: "₦412M",
        objection: "Tunde: wave four reaches people who already told support they are done.",
      },
    ],
    plays: [
      {
        id: "pl1",
        status: "in-progress",
        eyebrow: "IN PROGRESS · ENGINEERING",
        title: "Show fees before checkout",
        rows: [
          { label: "Ships", value: "Thu 7 Aug" },
          { label: "Affects", value: "all 4 markets" },
        ],
      },
      {
        id: "pl2",
        status: "deferred",
        eyebrow: "DEFERRED BY IFEOMA · 07:58",
        title: "20% reactivation discount",
        dissent: { who: "Tunde Bakare", quote: "we are leaving volume on the table." },
      },
      {
        id: "pl3",
        status: "draft",
        eyebrow: "DRAFT · REVERSIBLE",
        title: "Wave-two audience refresh",
        note: "Nothing leaves Flolyt until you send it",
      },
    ],
    evidenceSignals: [
      { name: "Delivery events", meta: "12,800 failed drops · last 2h", bars: [0.7, 0.8, 0.9, 0.75, 0.5, 0.42, 0.35, 0.3], tone: "rose" },
      { name: "Orders", meta: "1.24M · sustained 20 weeks", bars: [0.85, 0.82, 0.8, 0.72, 0.55, 0.5, 0.48, 0.46], tone: "ultra" },
      { name: "Support", meta: "9 tickets · fee confusion", bars: [0.2, 0.25, 0.3, 0.55, 0.6, 0.58, 0.5, 0.45], tone: "rose" },
      { name: "Market pricing", meta: "", bars: [], tone: "neutral", notConnected: true, note: "No source connected — competitor pricing cannot be read for this cohort." },
    ],
    evidenceTimeline: [
      { time: "07:04", body: "Second-order rate crossed the 30% floor for the March–May cohort." },
      { time: "6 Mar", body: "Delivery fee introduced at checkout, no advance notice shown." },
      { time: "18 Mar", body: "Failed-first-delivery rate peaked at 8.4% for new customers." },
    ],
    evidenceClaims: [
      { claim: "Second-order rate fell 11 points the week the delivery fee moved", grade: "causal", source: "orders", window: "4 Mar – 2 Aug", n: "1.24M" },
      { claim: "Cohorts with a failed first delivery reorder 31 points lower", grade: "association", source: "delivery events", window: "trailing 12 months", n: "12,800" },
      { claim: "Fee-clarity messaging recovers 9-12 points in comparable cohorts", grade: "association", source: "campaign", window: "18 months", n: "6 cohorts" },
      { claim: "A 20% discount recovers volume within two weeks", grade: "hypothesis", source: "growth", window: "—", n: "—" },
      { claim: "Competitor delivery pricing is undercutting Flolyt in NG", grade: "insufficient", source: "market pricing — not connected", window: "—", n: "—" },
    ],
    evidenceWhatWouldChange: {
      headline: "Wave one reactivates below 12%.",
      body: "That flips this room to a price-led response and puts Tunde's discount back on the table.",
    },
    evidenceGaps: {
      body: "Competitor pricing is not connected, so price pressure can't be ruled out.",
      resolves: "Connecting a market price feed would resolve 1 of the 5 claims above.",
      cta: "Connect a source",
    },
    log: [
      { time: "07:02", actor: { kind: "agent", agent: ORCHESTRATOR }, action: "Opened the room and assigned Repeat & Decay as lead", consequence: "3 agents joined" },
      { time: "07:04", actor: { kind: "agent", agent: REPEAT_DECAY }, action: "Priced the exposure at ₦412M over 90 days", consequence: "read 4 sources" },
      { time: "07:20", actor: { kind: "agent", agent: SUPPORT_SIGNAL }, action: "Read 9 tickets, flagged fee confusion as the dominant theme", consequence: "read-only" },
      { time: "07:36", actor: { kind: "human", person: TUNDE }, roleLabel: "Growth", action: "Proposed a 20% reactivation discount", consequence: "awaiting a human" },
      { time: "07:58", actor: { kind: "human", person: IFEOMA }, action: "Deferred the 20% discount, asked for the fee-clarity fix first", consequence: "dissent logged: Tunde Bakare" },
      { time: "08:04", actor: { kind: "agent", agent: REPEAT_DECAY }, action: "Proposed create_campaign_from_workflow for wave one", consequence: "awaiting a human" },
    ],
    logAttribution: { human: 12, agent: 32 },
    playsQueue: [
      { id: "pq1", group: "needs-approval", title: "Reactivation wave one", subtitle: "48,000 of 148,000 · WhatsApp then push · fee clarity only", time: "08:04" },
      { id: "pq2", group: "in-progress", title: "Show fees before checkout", subtitle: "Engineering · ships Thu 7 Aug · all 4 markets", time: "07:40" },
      { id: "pq3", group: "blocked", title: "20% reactivation discount", subtitle: "Deferred by Ifeoma · dissent from Tunde Bakare", time: "07:58" },
      { id: "pq4", group: "drafts", title: "Wave-two audience refresh", subtitle: "Nothing leaves Flolyt until sent", time: "07:44" },
      { id: "pq5", group: "decided", title: "Pause the discount-aggregator channel for this cohort", subtitle: "Approved by Ifeoma · no further sends", time: "07:12" },
    ],
    playsNeedYou: 1,
  },

  // ---------------------------------------------------------------------
  // 2. Northwind Retail — war room — screens 28, 29, 30, 33, 34, 35
  // (not listed on the index — reached from the account, not the cohort list)
  // ---------------------------------------------------------------------
  {
    id: "northwind-retail",
    title: "Northwind Retail — renewal at risk",
    kind: "war-room",
    status: "live",
    listed: false,
    listMeta: {
      condition: "Renewal risk",
      population: "120 seats",
      atRisk: "€38,400",
      owner: ADA,
      working: [ORCHESTRATOR, REVENUE_LEAKAGE, SUPPORT_SIGNAL],
      last: "12 min",
    },
    chips: [
      { label: "War room", tone: "warn" },
      { label: "34 days to renewal", tone: "risk" },
    ],
    agents: [ORCHESTRATOR, REVENUE_LEAKAGE, SUPPORT_SIGNAL],
    humans: [JIDE, TOMAS, PRIYA, MARCUS, ADA],
    counts: { evidence: 14, plays: 4, log: 31 },
    decisionDoc: {
      eyebrow: "DECISION DOC · V3 · AUTOSAVED 09:41",
      statement:
        "Hold the expansion call. Recover the 41 dormant seats first, and close escalation 4471 before any commercial conversation.",
      draftedBy: CS_HEALTH,
      owner: ADA,
      ownerNote: "· decision owner",
      ownerStatus: "undecided",
      whyNow: [
        {
          grade: "causal",
          claim: "Seat activation fell after the 4 March SSO change.",
          detail: "Before/after cohort, n=120 · −31% active seats, nine weeks.",
          meta: "product events · 4 Mar – 2 Aug · high confidence",
        },
        {
          grade: "association",
          claim: "An open P2 escalation at renewal renews 22 points lower.",
          detail: "Associated with, not shown to cause.",
          meta: "64 accounts · trailing 18 months",
        },
        {
          grade: "insufficient",
          claim: "No read on budget change.",
          detail: "Finance data is not connected for this account.",
          meta: "would resolve: connect the billing source",
        },
      ],
      impact: [
        { label: "REVENUE AT RISK", value: "€38,400", sub: "spoilage, not churn", tone: "rose" },
        { label: "WINDOW", value: "34 days", sub: "to 7 Sep renewal" },
        { label: "CONFIDENCE", value: "Medium", sub: "3 of 4 inputs current" },
      ],
      nextStep: {
        body: "Ada runs the Seat Recovery play by Fri 8 Aug, 17:00 IST, and moves the expansion call to the week after the fix ships.",
      },
      guardrails: {
        editingNote: { person: PRIYA, note: "Priya is editing this section — agents will suggest, not overwrite" },
        body: "Campaign needs approval before send. Quiet hours 21:00–08:00 Europe/Dublin.",
        heldSuggestion: {
          agent: CS_HEALTH,
          body: "Suppress the 6 seat holders who opted out in June · waiting for Priya",
        },
      },
    },
    thread: [
      {
        kind: "message",
        id: "t1",
        actor: { kind: "agent", agent: ORCHESTRATOR },
        time: "09:12",
        lines: [
          "Compound risk on Northwind: renewal in 34 days, active seats down 31%, escalation open 19 days. Lead: CS Health.",
        ],
      },
      {
        kind: "message",
        id: "t2",
        actor: { kind: "agent", agent: REVENUE_LEAKAGE },
        time: "09:14",
        lines: ["This is leakage, not churn. 41 of 120 paid seats inactive 60+ days, renewing at full count."],
        evidenceTag: { grade: "association", amount: "€38,400" },
        signal: "Support Signal · reading tickets (19d)",
      },
      {
        kind: "message",
        id: "t3",
        actor: { kind: "human", person: PRIYA },
        roleLabel: "Support",
        time: "09:31",
        lines: ["4471 is the export bug. Fix ships Thursday. Nobody sells to them before it lands."],
      },
      {
        kind: "message",
        id: "t4",
        actor: { kind: "human", person: MARCUS },
        roleLabel: "Sales",
        time: "09:33",
        lines: ["I have an expansion call booked Thursday 14:00. Can we fold this in?"],
      },
      {
        kind: "conflict",
        id: "t5",
        agent: ORCHESTRATOR,
        options: [
          { team: "Sales", summary: "Expand now — €22k upside" },
          { team: "Support", summary: "Hold — P2 open 19 days" },
        ],
        ownerNote: "Needs a human decision · owner Ada",
      },
    ],
    runStatus: {
      state: "running",
      detail: "turn 4 · 6 sources read",
      trailing: "",
      queuedSteering: "weight the escalation higher",
    },
    proposals: [
      {
        id: "p1",
        status: "pending",
        title: "Create a campaign from this workflow",
        rows: [
          { label: "Campaign", value: "Seat recovery" },
          { label: "Audience", value: "41 dormant seats" },
          { label: "Channel", value: "In-app, then email" },
          { label: "Send window", value: "09:00–17:00 IST" },
        ],
        actionKey: "create_campaign_from_workflow · 09:38",
      },
    ],
    plays: [
      {
        id: "pl1",
        status: "in-progress",
        eyebrow: "IN PROGRESS · SUPPORT",
        title: "Close escalation 4471",
        rows: [
          { label: "Owner", value: "Priya Nair" },
          { label: "Fix ships", value: "Thu 7 Aug" },
        ],
      },
      {
        id: "pl2",
        status: "draft",
        eyebrow: "DRAFT · REVERSIBLE",
        title: "Renewal brief for Ada",
        note: "Nothing leaves Flolyt until you send it",
      },
      {
        id: "pl3",
        status: "deferred",
        eyebrow: "DEFERRED BY ADA · 09:44",
        title: "Expansion call — Thursday",
        dissent: { who: "Marcus Reed", quote: "we lose the quarter-end window." },
      },
    ],
    evidenceSignals: [
      { name: "Product events", meta: "1,204 · last 2h", bars: [0.95, 0.9, 0.88, 0.86, 0.5, 0.42, 0.34, 0.3], tone: "ultra" },
      { name: "Support", meta: "18 tickets · 1 open 19d", bars: [0.2, 0.3, 0.25, 0.55, 0.75, 0.95, 0.82, 0.86], tone: "rose" },
      { name: "Campaign", meta: "6 sends · 41 unopened", bars: [0.55, 0.48, 0.44, 0.36, 0.3, 0.22, 0.18, 0.15], tone: "neutral" },
      { name: "Sales · CRM", meta: "read-only", bars: [0.22, 0.18, 0.4, 0.2, 0.16, 0.14, 0.35, 0.18], tone: "neutral" },
      { name: "Billing", meta: "", bars: [], tone: "neutral", notConnected: true, note: "Plan value and contracted rate are unavailable, so margin impact cannot be calculated for this account." },
    ],
    evidenceTimeline: [
      { time: "09:07", body: "Weekly active seats crossed the 70% floor — 79 of 120." },
      { time: "Mon", body: "Escalation 4471 reopened by the customer." },
      { time: "4 Mar", body: "SSO configuration changed." },
      { time: "12 Feb", body: "Renewal quote issued · 120 seats · 12-month term." },
    ],
    evidenceClaims: [
      { claim: "Seat activation fell after the 4 March SSO change", grade: "causal", source: "product events", window: "4 Mar – 2 Aug", n: "120" },
      { claim: "Open P2 at renewal correlates with 22pt lower renewal", grade: "association", source: "renewal history", window: "18 months", n: "64" },
      { claim: "Export defects resolve in a median 4 days once triaged", grade: "association", source: "support", window: "12 months", n: "212" },
      { claim: "Dormant seats respond better to in-app than to email", grade: "hypothesis", source: "campaign", window: "6 sends", n: "41" },
      { claim: "Budget pressure is driving the seat dormancy", grade: "insufficient", source: "billing — not connected", window: "—", n: "—" },
    ],
    evidenceWhatWouldChange: {
      headline: "Escalation 4471 closes before Thursday or weekly active seats recover above 78%.",
      body: 'Either flips this room to "proceed with the expansion call".',
    },
    evidenceGaps: {
      body: "Billing is not connected, so leakage cannot be priced.",
      resolves: "Connecting Stripe would resolve 1 of the 5 claims above.",
      cta: "Connect billing",
    },
    log: [
      { time: "09:12", actor: { kind: "agent", agent: ORCHESTRATOR }, action: "Opened the room and assigned CS Health as lead", consequence: "3 agents joined" },
      { time: "09:14", actor: { kind: "agent", agent: REVENUE_LEAKAGE }, action: "Priced the exposure at €38,400 spoilage", consequence: "read 3 sources" },
      { time: "09:22", actor: { kind: "agent", agent: SUPPORT_SIGNAL }, action: "Read 18 tickets, flagged 4471 open 19 days", consequence: "read-only" },
      { time: "09:31", actor: { kind: "human", person: PRIYA }, roleLabel: "Support", action: "Locked the Guardrails section for editing", consequence: "agents switched to suggesting" },
      { time: "09:34", actor: { kind: "agent", agent: ORCHESTRATOR }, action: "Surfaced a cross-functional conflict, did not resolve it", consequence: "routed to Ada" },
      { time: "09:38", actor: { kind: "agent", agent: CS_HEALTH }, action: "Proposed create_campaign_from_workflow", consequence: "awaiting a human" },
      { time: "09:44", actor: { kind: "human", person: ADA }, roleLabel: "CS", action: "Deferred the expansion call to the week of 11 Aug", consequence: "dissent logged: Marcus Reed" },
      { time: "09:47", actor: { kind: "human", person: TOMAS }, roleLabel: "Finance", action: "Commented on the impact figure", consequence: "correction pending billing" },
      { time: "09:52", actor: { kind: "human", person: ADA }, roleLabel: "CS", action: "Approved the seat recovery campaign with edits", consequence: "ran under Ada's identity" },
      { time: "09:52", actor: { kind: "agent", agent: CS_HEALTH }, action: "Wrote the decision and its dissent to account history", consequence: "business memory updated" },
    ],
    logAttribution: { human: 10, agent: 21 },
    playsQueue: [
      { id: "pq1", group: "needs-approval", title: "Create a campaign from this workflow", subtitle: "Seat recovery — Northwind · 41 recipients · in-app then email", time: "09:38" },
      { id: "pq2", group: "needs-approval", title: "Apply a 12% renewal discount", subtitle: "Northwind Retail · 12 months · margin −€4,610", time: "09:52" },
      { id: "pq3", group: "needs-approval", title: "Send the renewal brief to the account team", subtitle: "Northwind Retail · 6 recipients · internal only", time: "10:04" },
      { id: "pq4", group: "blocked", title: "Escalate export defect priority", subtitle: "Blocked on Engineering triage", time: "09:20" },
      { id: "pq5", group: "in-progress", title: "Close escalation 4471", subtitle: "Priya Nair · fix ships Thu 7 Aug", time: "09:14" },
      { id: "pq6", group: "drafts", title: "Renewal brief for Ada", subtitle: "Nothing leaves Flolyt until sent", time: "09:40" },
      { id: "pq7", group: "decided", title: "Suppress the 6 opted-out seat holders", subtitle: "Approved by Priya · June", time: "21 Jun" },
    ],
    playsNeedYou: 3,
  },

  // ---------------------------------------------------------------------
  // 3. Northwind Retail — persistent — screen 31
  // (not listed on the index — reached from the account, not the cohort list)
  // ---------------------------------------------------------------------
  {
    id: "northwind-retail-persistent",
    title: "Northwind Retail",
    kind: "persistent",
    status: "live",
    listed: false,
    listMeta: {
      condition: "Steady",
      population: "120 seats",
      atRisk: "€38,400",
      owner: ADA,
      working: [ORCHESTRATOR, CS_HEALTH],
      last: "2 Aug",
    },
    chips: [
      { label: "Account room · persistent", tone: "neutral" },
      { label: "Health 62 · steady", tone: "ok" },
    ],
    agents: [ORCHESTRATOR, CS_HEALTH],
    humans: [JIDE, TOMAS, PRIYA, MARCUS, ADA],
    counts: { evidence: 14, plays: 23, log: 31 },
    threadDrawerUnread: 3,
    thread: [
      {
        kind: "message",
        id: "t1",
        actor: { kind: "agent", agent: CS_HEALTH },
        time: "2 Aug",
        lines: ["Wrote the renewal-call decision and Marcus's dissent to account history."],
      },
      {
        kind: "message",
        id: "t2",
        actor: { kind: "human", person: ADA },
        roleLabel: "CS",
        time: "2 Aug",
        lines: ["Noted for next quarter: check seat activation before booking any expansion call."],
      },
      {
        kind: "message",
        id: "t3",
        actor: { kind: "agent", agent: ORCHESTRATOR },
        time: "Yesterday",
        lines: ["Nothing needs a decision right now. Watching seat activation and escalation 4471."],
      },
    ],
    revenuePosture: [
      { key: "CHURN", value: "Low", tone: "teal", detail: "No cancellation signal. Quote accepted in principle.", treatment: "monitor" },
      { key: "LEAKAGE", value: "Unavailable", tone: "muted", detail: "Cannot be priced — billing source not connected.", treatment: "connect billing" },
      { key: "SPOILAGE", value: "€38,400", tone: "rose", detail: "41 paid seats inactive 60+ days, renewing at full count.", treatment: "seat recovery" },
    ],
    decisionsLogged: [
      {
        time: "Today 09:44",
        actor: "Ada Onwudiwe",
        measured: false,
        headline: "Deferred the expansion call to the week of 11 Aug.",
        detail: "Escalation unresolved; commercial conversation held until the fix ships.",
        dissent: { who: "Marcus Reed", quote: "we lose the quarter-end window." },
      },
      {
        time: "21 Jun",
        actor: "Priya Nair",
        measured: true,
        headline: "Routed export defects to platform as a standing rule.",
        detail: "Outcome measured: median time-to-fix fell 6 days.",
      },
      {
        time: "12 Apr",
        actor: "Ada Onwudiwe",
        measured: true,
        headline: "Declined a 15% retention discount. Ran an onboarding rescue.",
        detail: "Outcome measured: €0 margin given away, 22 seats reactivated.",
      },
    ],
    memory: [
      {
        body: "Seat reactivation outperforms discounting here. April's rescue recovered 22 of 31 dormant seats with no margin concession.",
        meta: "validated learning · n=31 · high confidence · 12 Apr · does not override fresh evidence",
      },
      {
        body: "Priya's team closes P2 export defects in a median 4 days once triaged. A 19-day age is unusual and worth asking about.",
        meta: "observed pattern · trailing 12 months · medium confidence · 2 Aug",
      },
    ],
    evidenceSignals: [
      { name: "Product events", meta: "1,204 · last 2h", bars: [0.95, 0.9, 0.88, 0.86, 0.5, 0.42, 0.34, 0.3], tone: "ultra" },
      { name: "Support", meta: "18 tickets · 1 open", bars: [0.2, 0.3, 0.25, 0.55, 0.75, 0.95, 0.82, 0.86], tone: "rose" },
      { name: "Campaign", meta: "6 sends · 41 unopened", bars: [0.55, 0.48, 0.44, 0.36, 0.3, 0.22, 0.18, 0.15], tone: "neutral" },
      { name: "Sales · CRM", meta: "read-only", bars: [0.22, 0.18, 0.4, 0.2, 0.16, 0.14, 0.35, 0.18], tone: "neutral" },
      { name: "Billing", meta: "", bars: [], tone: "neutral", notConnected: true },
    ],
    evidenceClaims: [
      { claim: "Seat activation fell after the 4 March SSO change", grade: "causal", source: "product events", window: "4 Mar – 2 Aug", n: "120" },
      { claim: "Open P2 at renewal correlates with 22pt lower renewal", grade: "association", source: "renewal history", window: "18 months", n: "64" },
      { claim: "Export defects resolve in a median 4 days once triaged", grade: "association", source: "support", window: "12 months", n: "212" },
      { claim: "Budget pressure is driving the seat dormancy", grade: "insufficient", source: "billing — not connected", window: "—", n: "—" },
    ],
    log: [
      { time: "12 Apr", actor: { kind: "human", person: ADA }, roleLabel: "CS", action: "Declined a 15% retention discount, ran an onboarding rescue instead", consequence: "22 seats reactivated", consequenceTone: "teal" },
      { time: "21 Jun", actor: { kind: "human", person: PRIYA }, roleLabel: "Support", action: "Routed export defects to platform as a standing rule", consequence: "median time-to-fix fell 6 days", consequenceTone: "teal" },
      { time: "2 Aug", actor: { kind: "agent", agent: CS_HEALTH }, action: "Flagged escalation 4471's 19-day age as unusual", consequence: "read-only" },
      { time: "Today 09:44", actor: { kind: "human", person: ADA }, roleLabel: "CS", action: "Deferred the expansion call to the week of 11 Aug", consequence: "dissent logged: Marcus Reed" },
    ],
    logAttribution: { human: 10, agent: 21 },
    playsQueue: [
      { id: "pq1", group: "needs-approval", title: "Apply a 12% renewal discount", subtitle: "Northwind Retail · 12 months · margin −€4,610", time: "09:52" },
      { id: "pq2", group: "in-progress", title: "Close escalation 4471", subtitle: "Priya Nair · fix ships Thu 7 Aug", time: "09:14" },
      { id: "pq3", group: "decided", title: "Suppress the 6 opted-out seat holders", subtitle: "Approved by Priya · June", time: "21 Jun" },
      { id: "pq4", group: "decided", title: "Route export defects to platform as a standing rule", subtitle: "Approved by Priya · outcome measured", time: "21 Jun" },
    ],
    playsNeedYou: 1,
  },

  // ---------------------------------------------------------------------
  // 4. Cards failing on renewal night — recovering state demo
  // ---------------------------------------------------------------------
  {
    id: "cards-failing-on-renewal-night",
    title: "Cards failing on renewal night",
    kind: "war-room",
    status: "recovering",
    listed: true,
    listMeta: {
      condition: "Involuntary churn",
      population: "61,400",
      atRisk: "₦88M",
      owner: MARCUS,
      working: [ORCHESTRATOR, REPEAT_DECAY],
      last: "22 min",
    },
    chips: [
      { label: "War room", tone: "warn" },
      { label: "61,400 customers", tone: "risk" },
      { label: "Cohort · renewal-night failures", tone: "neutral" },
    ],
    agents: [ORCHESTRATOR, REPEAT_DECAY],
    humans: [MARCUS, TOMAS],
    counts: { evidence: 9, plays: 3, log: 18 },
    recovering: {
      droppedAt: "09:14",
      inventory: [
        "6 messages replayed, none duplicated",
        "2 proposals restored, still undecided",
        "No queued redirect was lost",
      ],
    },
    evidenceSignals: [
      { name: "Payment gateway", meta: "9,200 declines · last 2h", bars: [0.4, 0.55, 0.7, 0.9, 0.95, 0.88, 0.6, 0.4], tone: "rose" },
      { name: "Renewal events", meta: "61,400 · trailing 30 days", bars: [0.5, 0.52, 0.48, 0.9, 0.92, 0.6, 0.5, 0.45], tone: "ultra" },
    ],
    evidenceTimeline: [
      { time: "09:14", body: "Card-decline rate spiked on the last renewal batch of the night." },
      { time: "Mon", body: "Gateway retried failed charges once, 6 hours later, with no customer notice." },
    ],
    evidenceClaims: [
      { claim: "Decline rate triples for renewals run after midnight local time", grade: "causal", source: "payment gateway", window: "trailing 30 days", n: "61,400" },
      { claim: "A retry within 1 hour recovers 40% of declines", grade: "association", source: "payment gateway", window: "trailing 90 days", n: "22,000" },
    ],
    log: [
      { time: "09:12", actor: { kind: "agent", agent: ORCHESTRATOR }, action: "Opened the room after the decline spike crossed 8%", consequence: "2 agents joined" },
      { time: "09:14", actor: { kind: "agent", agent: REPEAT_DECAY }, action: "Priced the exposure at ₦88M across 61,400 renewals", consequence: "read 2 sources" },
    ],
    logAttribution: { human: 6, agent: 12 },
    playsQueue: [
      { id: "pq1", group: "needs-approval", title: "Retry declined renewals within the hour", subtitle: "61,400 renewals · payment gateway retry", time: "09:16" },
      { id: "pq2", group: "in-progress", title: "Move the nightly renewal batch earlier", subtitle: "Engineering · scheduling change", time: "09:10" },
    ],
    playsNeedYou: 1,
  },

  // ---------------------------------------------------------------------
  // 5. Checkout abandoned at delivery fee — second live example
  // ---------------------------------------------------------------------
  {
    id: "checkout-abandoned-at-delivery-fee",
    title: "Checkout abandoned at delivery fee",
    kind: "war-room",
    status: "live",
    listed: true,
    listMeta: {
      condition: "Abandonment",
      population: "308,000",
      atRisk: "₦124M",
      owner: { initials: "ZY", name: "Zainab Yusuf", department: "Product" },
      working: [ORCHESTRATOR, REPEAT_DECAY],
      last: "1 hr",
    },
    chips: [
      { label: "War room", tone: "warn" },
      { label: "308,000 customers", tone: "risk" },
      { label: "Cohort · checkout sessions", tone: "neutral" },
    ],
    agents: [ORCHESTRATOR, REPEAT_DECAY],
    humans: [{ initials: "ZY", name: "Zainab Yusuf", department: "Product" }, TUNDE],
    counts: { evidence: 11, plays: 4, log: 26 },
    decisionDoc: {
      eyebrow: "DECISION DOC · CHECKOUT FLOW · AUTOSAVED 10:20",
      statement:
        "Show the delivery fee on the cart page, not at the last checkout step. Recover the 308,000 carts abandoned in the last click.",
      draftedBy: REPEAT_DECAY,
      owner: { initials: "ZY", name: "Zainab Yusuf", department: "Product" },
      ownerStatus: "undecided",
      whyNow: [
        {
          grade: "causal",
          claim: "68% of abandonment happens on the step the fee first appears.",
          detail: "Funnel comparison, n=890k sessions · sustained 8 weeks.",
          meta: "checkout events · 1 Jun – 2 Aug · high confidence",
        },
        {
          grade: "association",
          claim: "Carts under ₦8,000 abandon at twice the rate of larger carts.",
          detail: "Fee is a larger share of a small basket.",
          meta: "308,000 sessions · trailing 8 weeks",
        },
      ],
      impact: [
        { label: "REVENUE AT RISK", value: "₦124M", sub: "over 60 days", tone: "rose" },
        { label: "CUSTOMERS", value: "308,000", sub: "7.3% of base" },
        { label: "CONFIDENCE", value: "High", sub: "3 of 3 inputs current" },
      ],
      nextStep: {
        body: "Move the delivery-fee line to the cart page for all markets. Zainab owns the release, targeting Wed 12 Aug.",
      },
    },
    proposals: [
      {
        id: "p1",
        status: "pending",
        title: "Ship cart-page fee disclosure",
        rows: [
          { label: "Scope", value: "all markets" },
          { label: "Owner", value: "Zainab Yusuf" },
          { label: "Rollout", value: "10% → 100% over 5 days" },
        ],
        actionKey: "ship_checkout_change · 10:20",
      },
    ],
    plays: [
      {
        id: "pl1",
        status: "in-progress",
        eyebrow: "IN PROGRESS · PRODUCT",
        title: "Cart-page fee disclosure",
        rows: [{ label: "Ships", value: "Wed 12 Aug" }],
      },
      {
        id: "pl2",
        status: "draft",
        eyebrow: "DRAFT · REVERSIBLE",
        title: "Recovery push for abandoned carts",
        note: "Nothing leaves Flolyt until you send it",
      },
    ],
    evidenceSignals: [
      { name: "Checkout events", meta: "308,000 · last 8 weeks", bars: [0.6, 0.65, 0.7, 0.82, 0.9, 0.88, 0.8, 0.76], tone: "rose" },
      { name: "Cart value", meta: "median ₦6,400", bars: [0.4, 0.42, 0.38, 0.5, 0.55, 0.52, 0.48, 0.45], tone: "ultra" },
    ],
    evidenceTimeline: [
      { time: "10:20", body: "Abandonment on the fee step crossed 68% of the funnel drop." },
      { time: "20 Jun", body: "Delivery fee moved from a flat rate to a distance-based rate." },
    ],
    evidenceClaims: [
      { claim: "68% of abandonment happens on the step the fee first appears", grade: "causal", source: "checkout events", window: "1 Jun – 2 Aug", n: "890,000" },
      { claim: "Carts under ₦8,000 abandon at twice the rate of larger carts", grade: "association", source: "checkout events", window: "8 weeks", n: "308,000" },
    ],
    log: [
      { time: "10:18", actor: { kind: "agent", agent: ORCHESTRATOR }, action: "Opened the room after abandonment crossed 65%", consequence: "2 agents joined" },
      { time: "10:20", actor: { kind: "agent", agent: REPEAT_DECAY }, action: "Priced the exposure at ₦124M over 60 days", consequence: "read 2 sources" },
    ],
    logAttribution: { human: 5, agent: 14 },
    playsQueue: [
      { id: "pq1", group: "needs-approval", title: "Ship cart-page fee disclosure", subtitle: "All markets · 10% → 100% rollout over 5 days", time: "10:20" },
      { id: "pq2", group: "in-progress", title: "Cart-page fee disclosure build", subtitle: "Product · ships Wed 12 Aug", time: "10:05" },
      { id: "pq3", group: "drafts", title: "Recovery push for abandoned carts", subtitle: "Nothing leaves Flolyt until sent", time: "10:10" },
    ],
    playsNeedYou: 1,
  },

  // ---------------------------------------------------------------------
  // 6. Discount-only buyers — archived state demo
  // ---------------------------------------------------------------------
  {
    id: "discount-only-buyers",
    title: "Discount-only buyers",
    kind: "war-room",
    status: "archived",
    listed: true,
    listMeta: {
      condition: "Margin erosion",
      population: "94,000",
      atRisk: "₦46M",
      owner: TUNDE,
      working: [ORCHESTRATOR],
      last: "Yesterday",
    },
    chips: [
      { label: "Archived · read-only", tone: "neutral" },
      { label: "94,000 customers", tone: "risk" },
    ],
    agents: [ORCHESTRATOR],
    humans: [TUNDE, IFEOMA],
    counts: { evidence: 8, plays: 6, log: 22 },
    archived: {
      closedOn: "Yesterday",
      headline: "Closed yesterday. ₦19,400,000 margin protected.",
      body: "The work concluded, the outcome was measured and the learning went to business memory. Nothing here can be edited.",
      outcome: {
        headline: "Discount eligibility narrowed for 94,000 customers",
        detail: "Margin recovered without a measurable drop in reorder rate.",
      },
      memory: {
        body: "This segment reorders on price alone — full-price offers under-perform here by design, not by mistake.",
        meta: "validated learning · written yesterday · high confidence",
      },
    },
    log: [
      { time: "Mon", actor: { kind: "human", person: TUNDE }, roleLabel: "Growth", action: "Narrowed discount eligibility to reorder-price-sensitive segments only", consequence: "₦19.4M margin protected", consequenceTone: "teal" },
      { time: "Yesterday", actor: { kind: "agent", agent: ORCHESTRATOR }, action: "Measured the outcome and wrote the finding to business memory", consequence: "business memory updated" },
    ],
    logAttribution: { human: 8, agent: 14 },
  },

  // ---------------------------------------------------------------------
  // 7. Lagos delivery failures — empty state demo
  // ---------------------------------------------------------------------
  {
    id: "lagos-delivery-failures",
    title: "Lagos delivery failures",
    kind: "war-room",
    status: "empty",
    listed: true,
    listMeta: {
      condition: "Delivery",
      population: "12,800",
      atRisk: "₦9M",
      owner: AMARA,
      working: [ORCHESTRATOR, SUPPORT_SIGNAL],
      last: "Yesterday",
    },
    chips: [
      { label: "War room", tone: "warn" },
      { label: "12,800 customers", tone: "risk" },
      { label: "Cohort · Lagos deliveries", tone: "neutral" },
    ],
    agents: [ORCHESTRATOR, SUPPORT_SIGNAL],
    humans: [AMARA],
    counts: { evidence: 2, plays: 0, log: 3 },
    emptyPrompts: [
      { question: "Why did Lagos delivery failures spike this week?", meta: "delivery events · 2 weeks" },
      { question: "Which riders account for most of the failures?", meta: "logistics · 12,800 orders" },
      { question: "Is this a Lagos-only problem or a national one?", meta: "delivery events · all markets" },
    ],
  },
];

export function getRoomIndex() {
  return ROOMS.filter((room) => room.listed).map((room) => ({
    id: room.id,
    title: room.title,
    ...room.listMeta,
  }));
}

export function getRoom(id: string): RoomDetail | undefined {
  return ROOMS.find((room) => room.id === id);
}

export function getRoomsNeedingApproval(): number {
  return ROOMS.filter((room) => room.listed).reduce(
    (total, room) => total + (room.proposals?.filter((p) => p.status === "pending").length ?? 0),
    0
  );
}
