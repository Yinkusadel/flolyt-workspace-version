import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { LeaksTabs } from "@/pages/revenue/leakage-map/tabs";
import { CLAIM_CHIP_TONE, CLAIM_LABEL, LK06_CARDS, LK06_UPGRADE_ROWS } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const CARD_EYEBROW_CLASS: Record<string, string> = { ultra: "text-ultra", amber: "text-amber", muted: "text-ink-4" };

/** LK06 — /leakage-map?by=claim. */
export function ByClaimState() {
  return (
    <div className="space-y-8">
      <LeaksTabs active="By claim" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Three kinds of claim, kept apart and never averaged</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {LK06_CARDS.map((card) => (
            <div key={card.kicker} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <p className={`font-mono text-[9px] font-medium tracking-[0.85px] uppercase ${CARD_EYEBROW_CLASS[card.tone] ?? "text-ink-4"}`}>
                  {card.kicker}
                </p>
                <h3 className="text-[13px] font-semibold text-ink">{card.bold}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_EYEBROW_CLASS[card.tone] ?? "text-ink-4"}`}>
                  {card.footer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every line, with what would move it up a category</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={HEAD_CLASS}>Claim now</th>
                <th className={HEAD_CLASS}>What is missing to strengthen it</th>
                <th className={HEAD_CLASS}>Who has it</th>
                <th className={HEAD_CLASS}>Would become</th>
              </tr>
            </thead>
            <tbody>
              {LK06_UPGRADE_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.stage}</td>
                  <td className="px-4 py-3">
                    <Chip tone={CLAIM_CHIP_TONE[row.claimNow]}>{CLAIM_LABEL[row.claimNow]}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.whatMissing}</td>
                  <td className="px-4 py-3">
                    {row.who ? (
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                        <PersonAvatar kind="human" initials={row.who.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.who.department] }} />
                        {row.who.name.split(" ")[0]}
                      </span>
                    ) : (
                      <span className="text-rose">nobody</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={CLAIM_CHIP_TONE[row.wouldBecome]}>{CLAIM_LABEL[row.wouldBecome]}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Five of seven upgrades are waiting on one person">
        Sam Iyer holds four of them and 41 obligations, 14 of which are overdue. This screen does not rank him a
        bottleneck or score his queue — it names what is blocked, which is the part he can actually act on. The
        fifth needs a holdout nobody has proposed, and the last two need work nobody owns.
      </Callout>
      <Callout tone="ultra" title="A claim never strengthens with time or repetition">
        An association observed for six months is the same association. Agents cannot promote their own claims, the
        map does not promote them on age, and the only thing that moves a chip is a named piece of evidence
        arriving — which is why every row above has a name in it rather than a date.
      </Callout>
    </div>
  );
}
