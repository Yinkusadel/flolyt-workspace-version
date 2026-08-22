import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GV08_ROWS, GV_CHIP_TONE } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV08 — /governance/permissions. */
const PermissionsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Permissions</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Nine actions · reducing is open to everybody, increasing needs a re-auth, one is never</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => toast.success("Approver list updated")}>
          Change who may approve
        </Button>
      </div>

      <GovernanceTabs active="Permissions" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who may do what to an agent</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Action</th>
                <th className={`${HEAD_CLASS} text-right`}>Anyone</th>
                <th className={`${HEAD_CLASS} text-right`}>Stage owner</th>
                <th className={`${HEAD_CLASS} text-right`}>Ada</th>
                <th className={`${HEAD_CLASS} text-right`}>An agent</th>
                <th className={HEAD_CLASS}>Needs a re-auth</th>
              </tr>
            </thead>
            <tbody>
              {GV08_ROWS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.action}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.anyoneTone]}>{row.anyone}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.stageOwnerTone]}>{row.stageOwner}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.adaTone]}>{row.ada}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.agentTone]}>{row.agent}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.reauth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Everything that reduces what agents do is open to everybody, and everything that increases it needs Ada">
        Pausing, redirecting and questioning are available to anybody who can see the room. Activating, installing
        and granting a field all take a re-authentication from one person. The asymmetry is the same one in the
        builder: stopping should be easier than starting, because the thing that grows quietly is the number of
        agents nobody chose.
      </Callout>

      <Callout tone="teal" title="The last row is the same for everybody including the person who owns the account">
        Nobody edits the log. Not Ada, not an administrator, not Flolyt support, not a database migration. It is
        the only row in any permissions table in this product where every column reads never, and if it did not,
        none of the other rows would mean very much.
      </Callout>
    </div>
  );
};

export default PermissionsRoute;
