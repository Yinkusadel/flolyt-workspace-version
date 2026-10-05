import type { HomeCard } from "@/services/api/home/get-home";

/** `GET /home`'s `cards[]` is a flat, individually-titled stream covering two different things —
 *  what waits on you (`kind: "action"`) and what the workspace has been told (everything else,
 *  in practice `kind: "notification"`) — per that endpoint's own docs. Shared by the home
 *  carousel's "needs you" panel and the topbar notification bell's "workspace" panel so the two
 *  surfaces never disagree on the split. */
export function splitHomeCardsByKind(cards: HomeCard[]) {
  const needsYou = cards.filter((card) => card.kind === "action");
  const workspace = cards.filter((card) => card.kind !== "action");
  return { needsYou, workspace };
}
