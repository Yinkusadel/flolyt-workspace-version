# Flolyt: The Collaborative Revenue Intelligence Workspace

**Tagline:** Ask why. Fix it. Together.

---

## 1. Introduction

Flolyt is a revenue intelligence platform built for modern digital businesses. It moves beyond traditional customer engagement tools by providing a shared workspace where teams and AI agents collaborate to **identify, diagnose, and fix revenue leaks in real time**.

Rather than being just a dashboard or a campaign builder, Flolyt is an **end-to-end lifecycle tool** that unifies customer data, cross-functional teams, and AI agents into one intelligent workspace. The platform connects directly to your existing data sources, builds a living view of every customer, and enables teams to work together in **Rooms** to resolve revenue-critical issues.

Flolyt is also the **daily operating system for revenue teams**—where goals are set, priorities are managed, actions are taken, and impact is measured. It is designed to be used every day by marketing, product, customer success, sales, and finance teams to acquire, scale, and monitor revenue and customer lifecycle.

---

## 2. The Problem

Most revenue teams struggle with:

- **Siloed dashboards** that show *what* happened but never *why*
- **Disconnected teams** (marketing, product, support, finance) working in separate tools
- **Manual analysis** required to connect the dots
- **Slow reaction times** – by the time a problem is found, revenue has already been lost
- **No institutional memory** – when someone leaves, the knowledge leaves with them
- **Lack of daily prioritization** – teams don't know what to work on first to drive the most revenue
- **No alignment to goals** – teams work on tasks that don't move the business forward

Legacy platforms (Braze, Customer.io, MoEngage) were built for campaign orchestration. They were not designed for cross-functional revenue diagnosis, AI collaboration, or daily revenue operations.

---

## 3. The Solution: A Revenue Intelligence Workspace

Flolyt is a **Collaborative Revenue Intelligence Workspace** where:

- **Multiple teams** (marketing, product, engineering, support, finance) work in one shared environment
- **AI agents** act as active team members – analyzing data, opening rooms, proposing actions
- **Revenue leaks** are identified, quantified, and fixed in real time
- **Every action** is tracked, measured, and stored in a **Business Memory** that compounds over time
- **Daily work is prioritized** based on revenue impact, effort, and urgency
- **Goals are aligned** to every recommendation and action

Flolyt is not a campaign tool. Campaigns are just one of many possible actions that can be triggered from the workspace.

---

## 4. Core Concepts

### 4.1 Live Data Fabric

Flolyt connects directly to your existing data sources (databases, payment platforms, storefronts, support tools) and creates a **live data fabric**. This is not an integration directory – it is a continuously synced, interpretation-ready layer that powers all intelligence.

- Connect Postgres, Stripe, Shopify, Paystack, and 30+ other sources
- Real-time data sync
- Unified customer profiles built automatically
- **Data Health Monitoring** – alerts on stale, missing, or inconsistent data
- **Automated Data Classification** – AI maps fields from different sources to a unified schema
- **Entity Resolution** – deduplicates customer records across systems, merges profiles

### 4.2 Customer Lifecycle View

Every customer is placed into a lifecycle stage: **Acquire, Activate, Pricing, Adoption, Retain, Reactivate, etc.**

Each stage has:

- **Owning team** (e.g., Marketing owns Acquire, Product owns Activation)
- **Team lead** (human)
- **AI agent lead** (e.g., Acquisition Quality agent)
- **Revenue impact**
- **Trend indicators** – whether the stage is improving or worsening
- **Key metrics** (conversion, activation rate, retention, etc.)
- **Visual Journey Orchestration** – a canvas showing the flow between stages, with drop-off rates and revenue leakage at each transition
- **Customer Journey Funnel Analytics** – detailed conversion rates between every stage, with AI overlaying revenue leakage at each step

### 4.3 AI Agents

Flolyt ships with **10 default AI agents**, each specialized in a particular revenue function. Examples include:

- **Repeat & Decay Agent** – monitors repeat purchase behavior
- **Involuntary Churn Agent** – detects payment failures and involuntary churn
- **Acquisition Quality Agent** – ensures CAC is justified by LTV
- **LTV Predictor**
- **Churn Specialist**
- **Discount Optimizer**
- **Revenue Forecaster**
- **Data Quality Agent** – monitors data health and alerts on anomalies
- **Customer 360 Agent** – builds and updates individual customer profiles
- **Experiment Designer** – designs and monitors A/B tests

Agents work autonomously, even when you're offline. They scan data, identify anomalies, open Rooms, propose actions, and **prioritize recommendations** based on business goals.

**Custom agents** can also be imported from Claude, OpenAI, or other platforms, or created natively within Flolyt via the **Agent Builder**. An **Agent Marketplace** allows teams to discover and share specialized agents.

**Role-Specific AI Assistants** provide tailored experiences for CMO, Head of CS, Product Lead, Finance Lead, and more.

### 4.4 Rooms

**Rooms** are collaborative spaces where a specific revenue issue is diagnosed and resolved.

A Room is created:

- Automatically by an AI agent when it detects a problem (e.g., second-order fall rate drops)
- Manually by a team member who wants to investigate a question

Inside a Room you will find:

- **The problem statement** – what was detected, with data and context
- **Causal analysis** – why the issue is happening, linked to specific events
- **Revenue impact** – dollar amount at risk, confidence level
- **Recommended next steps** – assigned to specific teams or individuals
- **Live collaboration** – team members and AI agents discussing, commenting, updating in real time. Supports **threaded comments, emoji reactions, file attachments, and voice/video notes**
- **Approval requests** – AI agents draft actions (campaigns, discount changes) and request human approval
- **Experimentation** – optional A/B tests designed by AI agents to validate interventions

Rooms remain open until the issue is resolved. They reduce the need for meetings, email chains, and status updates because everyone works together in one place.

### 4.5 Revenue Leakage Map

A live visualization of where revenue is leaking across:

- **Customer segments**
- **Lifecycle stages**
- **Markets / regions**
- **Currencies**

The Leakage Map is segmented by market (e.g., Nigeria, Kenya, Ghana, UK) and shows revenue at risk in each local currency. It helps teams prioritize where to focus.

### 4.6 Cohorts

Flolyt tracks onboarding cohorts (e.g., all customers acquired in December 2025) and shows their performance over time:

- Month 1 active rate
- Month 2 active rate
- Month 3 active rate

This reveals retention decay and helps identify which acquisition channels produce high-quality customers.

### 4.7 Segments

Flolyt automatically creates and maintains dynamic segments, including:

- **Default lifecycle segments** (active, slipping away, fallen off, need reactivation)
- **AI-generated segments** (e.g., Champions – ordered 4 times in 30 days with full price, One-and-Done – ordered once, no second order in 90 days)
- **Custom segments** based on rules

Segments show how they change over time (e.g., Champion count this month vs. last month) and may be linked to open Rooms.

From any segment, you can drill down to an **Individual Customer 360 Profile** to see full behavioral history, transactions, AI-generated summary, and recommended next actions.

**Customer Health Scoring** assigns a 0–100 score combining churn risk, LTV, engagement, support tickets, and payment behavior. Teams can sort and filter by health score to prioritize daily outreach.

### 4.8 Campaigns

Campaigns are a feature, not the core product. They are typically created as a **recommended action** inside a Room.

Campaign management includes:

- **Segment targeting**
- **Total recipients**
- **Status** (draft, needs approval, running, completed)
- **Attributed revenue**
- **Owner(s)**
- **Performance metrics** (sent, returned to app, revenue recovered, unsubscribes)
- **Per-market breakdown**
- **Issue tracking** – if something is wrong, a Room may be linked
- **A/B testing** – ability to test different versions of copy, offer, channel, and timing

Campaigns can be paused, edited, and restarted. They are always tied to a revenue objective.

### 4.9 Inbox

A personal notification center where you find:

- Mentions in Rooms
- Assignments from AI agents or team members
- Approval requests
- Handoff updates
- **External customer replies** – unified inbox for WhatsApp, SMS, email, and in-app responses to campaigns, with AI-suggested replies

### 4.10 Handoffs

A timeline of cross-functional work. For example:

- Product shipped a fix on Aug 7
- Engineering is working on checkout issue (due Aug 14)
- Marketing launched a reactivation wave

Handoffs ensure that work is visible and accountable across departments.

### 4.11 Business Memory

Every action taken in Flolyt – every Room, every campaign, every approval, every outcome – is stored in the **Business Memory**. This creates an institutional knowledge base that:

- Helps new team members get up to speed quickly
- Prevents repeating past mistakes
- Enables AI agents to make better decisions over time
- Becomes a competitive moat that compounds with use

### 4.12 Governance

Flolyt provides granular control over what AI agents can do automatically.

Three approval levels:

- **Automatic** – AI can perform the action without human approval (e.g., opening a Room, drafting a campaign)
- **Proposed** – AI drafts an action and requests human approval (e.g., sending a customer message, applying a discount)
- **Blocked** – AI cannot perform the action (e.g., deleting connected data, writing to CRM without approval)

Additionally, Flolyt offers **enterprise-grade security**:

- **SSO (SAML/OIDC)**
- **Role-Based Access Control (RBAC)** at data source, room, and feature level
- **Full audit logs** of every human and AI action
- **Data residency options** and GDPR/CCPA compliance tools

### 4.13 Predictive Forecasting & Scenario Planning

Flolyt includes a **Revenue Forecast Engine** that projects revenue across 30/60/90 days, broken down by segment, market, and lifecycle stage.

A **Scenario Simulator** lets you ask "What if we reduce second-order drop by 10%?" and instantly see the revenue impact.

These forecasts feed into Business Memory and become more accurate over time.

### 4.14 Experimentation Studio

AI agents can design **controlled A/B tests** on segments, offers, channels, and timing. Holdout groups are maintained automatically, and statistical significance is monitored.

Results are displayed inside the Room where the experiment originated and fed back into Business Memory.

### 4.15 Value & ROI Dashboard

A dedicated dashboard showing the financial impact Flolyt has created:

- Revenue at risk identified
- Revenue recovered
- Number of rooms resolved
- Average time to resolution
- Benchmarking against previous periods
- Exportable executive reports

### 4.16 Open API & Webhooks

Flolyt provides a **REST API** for all major objects (customers, segments, rooms, campaigns, memory) and **webhooks** for events (room opened, campaign approved, leakage threshold exceeded).

A developer portal with docs and sandbox environment is available.

### 4.17 Mobile Companion App

**Flolyt Mobile** (iOS/Android) allows decision-makers to:

- Approve or reject AI proposals
- View room updates and reply to comments
- Check revenue leakage map
- Receive push notifications for critical alerts

### 4.18 External Notifications

Configure alerts via **Slack, Microsoft Teams, Email, and mobile push**. Each user can set rules like "Notify me when an AI agent opens a room with revenue at risk > $50K".

Digest mode provides a daily or weekly summary of AI-detected anomalies and actions.

### 4.19 Role-Based Dashboards & Custom Views

Users can create **custom workspace views** with drag-and-drop widgets. Pre-built templates exist for CMO, Head of CS, Product Lead, and Finance Lead.

Views can be shared with teammates or external stakeholders via secure links.

### 4.20 Multi-Language & Localization

UI supports multiple languages (English, French, Swahili, Yoruba, etc.). AI-generated campaign content can be produced in multiple languages, with tone adaptation.

Currency formatting and language detection are automatic.

---

## 5. Revenue Operations & Daily Use Features

To make Flolyt the system teams use **every day** to acquire, scale, and monitor revenue and customer lifecycle, we include the following capabilities.

### 5.1 Goal & OKR Alignment

- Set quarterly or monthly revenue, retention, and acquisition goals.
- AI agents align monitoring, room creation, and recommendations with these goals.
- **Goal Tracker** dashboard shows progress toward each KPI, with AI-generated suggestions if behind target.

### 5.2 Revenue Playbooks & Templates

- Pre-built, industry-specific **Revenue Playbooks** (e.g., "SaaS Onboarding Recovery", "E-commerce Cart Abandonment", "Fintech Payment Failure Recovery").
- Each playbook includes recommended room structure, AI agents to activate, key metrics, and step-by-step action plan.
- One-click activation configures the necessary agents and data connections.

### 5.3 Proactive Recommendations Feed

- A prioritized action queue that ranks revenue opportunities and risks by dollar impact, urgency, and confidence.
- Each item includes: issue, revenue at stake, suggested action, and owner.
- Filter by team, lifecycle stage, or impact.
- **Effort/Impact Scores** on each recommendation to identify quick wins.

### 5.4 Customer Health Scoring & Prioritization

- AI-driven Health Score (0–100) combining churn risk, LTV, engagement, support tickets, payment behavior.
- Visible on customer profiles, segment lists, and rooms.
- Sort and filter by health score to target high-risk, high-value customers first.

### 5.5 Revenue Attribution & Multi-Touch Models

- Tracks impact of rooms, product fixes, campaigns, and manual interventions.
- Multi-touch attribution models (first-touch, last-touch, linear, time-decay) to understand which actions drive revenue.
- Attribution data feeds Business Memory.

### 5.6 Task & Project Management Integration

- Two-way sync with Asana, Jira, Trello, Linear.
- AI-assigned tasks appear in the team's PM tool with context.
- Completion in PM tool updates Room automatically.

### 5.7 AI-Generated Daily/Weekly Digests

- Personalized daily or weekly email/in-app digest.
- Summarizes top revenue risks, opportunities, rooms needing input, approvals waiting, key metric changes.
- Tailored to each user's role and preferences.

### 5.8 Benchmarking & Industry Comparisons

- Anonymous benchmarking against similar businesses (industry, size, region).
- AI surfaces insights like "Your second-order rate is 27%, vs. industry average 35%—here's why."

### 5.9 Customer Journey Funnel Analytics

- Funnel Explorer visualizes conversion rates between lifecycle stages (Visit → Signup → First Purchase → Second Purchase).
- AI overlays revenue leakage at each step.
- Click into any transition to open a Room investigating the drop-off.

### 5.10 Automated Data Classification & Entity Resolution

- AI automatically maps fields to unified schema.
- Deduplicates customer records across systems.
- Resolves identities and merges profiles.
- Alerts on data quality issues.

### 5.11 Prescriptive Action Engine

- Each recommended action includes Effort Score (1–5) and Impact Score (projected revenue lift).
- AI ranks actions by Impact/Effort ratio.
- "Quick Wins" filter shows what can be accomplished today.

### 5.12 Embedded Analytics & White-Labeling

- Embeddable dashboards and widgets via iframe or API.
- White-labeling for agencies managing multiple clients.

### 5.13 Gamification & Team Engagement

- Leaderboards for rooms resolved, revenue recovered, approvals completed.
- Badges for milestones (e.g., "Closed 10 revenue leaks").
- Team challenges with rewards.

### 5.14 Role-Specific AI Assistants

- Pre-built assistant personas for CMO, Head of CS, Product Lead, Finance Lead.
- Tailored prompts, data access, and output formats (PDF reports, slide summaries).
- @-mention in any room or command bar.

### 5.15 Community & Knowledge Base

- Flolyt Community hub with user-shared revenue playbooks, custom AI agent templates, discussion forums, success stories.
- Gamification tied to community contributions.

---

## 6. How Teams Use Flolyt (Example Scenario)

**Business:** A food delivery company operating in Nigeria, Kenya, Ghana, and the UK.

### Step 1: AI Agent Detects a Problem

The **Repeat & Decay Agent** scans the data and notices that customers acquired after March 4th have a second-order rate that dropped from 38% to 27%.

It opens a **Room** titled "Second Order Fall Rate Drop" and includes:

- **What happened:** 148,000 customers affected
- **Revenue impact:** 412 million Naira at risk over 90 days
- **Root cause:** Delivery fee surprise before checkout (a discount that was removed after first order)
- **Associated finding:** Customers with a failed first delivery reorder 31% lower

Simultaneously, the **Data Quality Agent** confirms that all data sources are healthy and the anomaly is real.

### Step 2: Cross-Functional Collaboration

The Room is populated with the right people and AI agents:

- **Amara (Customer Support)** – flags delivery complaints from customers
- **Tunde (Sales)** – reviews the reactivation wave proposal
- **inform (Product)** – updates the checkout flow to show delivery fees upfront
- **Revan (Finance)** – checks the numbers
- **AI agents** – propose actions: reactivate 48,000 customers via WhatsApp/push, apply 20% transaction discount to certain segment

All of these individuals work in the same Room simultaneously, commenting, editing, and approving. They can record **voice notes** or attach files for context. External notifications alert them via Slack or mobile when the Room is opened or when they're mentioned.

### Step 3: Actions and Approvals

The AI agents draft a campaign and a discount change. They request approval from the relevant human.

The Room shows:

- **Pending approvals** – e.g., campaign waiting for marketing lead
- **In-progress tasks** – e.g., engineering working on checkout fix
- **Completed actions** – e.g., support tagged complaints

Product ships the checkout fix on Aug 7; Engineering continues work on the discount change due Aug 14.

### Step 4: Experimentation & Launch

Before launching the reactivation campaign to all 48,000 customers, the **Experiment Designer Agent** sets up an A/B test: 50% receive WhatsApp message, 50% receive push notification. Holdout group of 10% maintained.

The campaign is launched after approval. Results start flowing into the Room.

### Step 5: Resolution and Memory

Once the product fix is live, the campaign is launched, and the revenue leak is stopped, the Room is closed.

The outcome is stored in **Business Memory**, including what worked and what didn't. The **Value Dashboard** shows that $312K was recovered from this single issue.

Next time a similar issue arises, the AI agents will reference this memory and act faster.

---

## 7. Benefits at a Glance

| Benefit | Description |
|---------|-------------|
| **Faster revenue recovery** | Leaks are detected in real time, not discovered weeks later in a quarterly report |
| **Cross-functional alignment** | Marketing, product, support, and finance work in the same workspace, not in silos |
| **AI as a teammate** | AI agents proactively monitor, diagnose, and propose actions – not just answer queries |
| **Reduced meeting load** | Rooms replace status meetings and email chains; work is transparent and tracked |
| **Compounding intelligence** | Business Memory ensures the platform gets smarter with every interaction |
| **Multi-market clarity** | Revenue at risk is segmented by market and currency, not lumped together |
| **Full lifecycle visibility** | Every stage from acquisition to reactivation is monitored and owned |
| **Controlled autonomy** | Governance settings give you confidence in AI actions |
| **Enterprise readiness** | SSO, RBAC, audit logs, and data residency options make it deployable at scale |
| **Proof of impact** | Value Dashboard quantifies revenue protected and recovered |
| **Daily prioritization** | Recommendations feed and effort/impact scores tell teams what to work on today |
| **Goal alignment** | OKRs connect daily actions to business objectives |
| **Seamless workflow** | Integrations with PM tools and external notifications keep teams in sync |
| **Continuous learning** | Community and knowledge base enable shared best practices |

---

## 8. Getting Started

1. **Connect your data sources** – Flolyt builds a live data fabric automatically.
2. **Set your goals** – Define quarterly revenue and retention targets.
3. **Invite your team** – Add members from marketing, product, support, finance.
4. **Review the dashboard** – See total customers, revenue at risk, lifecycle stages, and active AI agents.
5. **Let AI agents work** – Agents will begin scanning data and opening Rooms when they detect anomalies.
6. **Join a Room** – Collaborate with teammates and AI to resolve revenue issues.
7. **Approve or reject proposals** – Maintain control over outward actions.
8. **Monitor revenue** – Use Leakage Map, Cohorts, Campaigns, Forecasts, and Recommendations Feed.
9. **Track value** – Use the Value Dashboard and Goal Tracker to measure ROI.
10. **Activate playbooks** – Launch proven revenue recovery processes for common issues.

---

## 9. Conclusion

Flolyt is not just another dashboard or campaign tool. It is a **Collaborative Revenue Intelligence Workspace** that unifies your data, your teams, and AI agents into one environment where revenue is protected and grown.

It is also the **daily operating system for revenue teams** – where goals are set, work is prioritized, collaboration happens, and impact is measured. Flolyt helps teams acquire, scale, and monitor revenue and customer lifecycle with unprecedented clarity and speed.

**Flolyt is where your team and AI finally sit down to grow revenue—together.**

**Ask why. Fix it. Together.**