import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataSourcesTabs } from "@/pages/data/data-sources/tabs";
import { DataSourcesKvList } from "@/pages/data/data-sources/kv-list";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DS11_CREDENTIAL_ROWS, DS11_PROTECTS_KV, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS11 — /data-sources/credentials. */
const CredentialsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Six credentials · all read-only, all field-scoped, none of them expiring
        </p>
      </div>

      <DataSourcesTabs active="Credentials" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What Flolyt holds, and what each one can reach</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>Access</th>
                <th className={HEAD_CLASS}>Scope</th>
                <th className={HEAD_RIGHT_CLASS}>Rotated</th>
                <th className={HEAD_RIGHT_CLASS}>Expires</th>
                <th className={HEAD_CLASS}>Can it write?</th>
              </tr>
            </thead>
            <tbody>
              {DS11_CREDENTIAL_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-teal">{row.access}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.scopeTone]}`}>{row.scope}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.rotatedTone]}`}>{row.rotated}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.expiresTone]}`}>{row.expires}</td>
                  <td className="px-4 py-3">
                    <Chip tone="teal">no</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Every credential is read-only and none of them expires, which is one good decision and one bad one">
        Flolyt cannot write to anything, anywhere, which is enforced by the credential rather than by the software.
        None of these expires, so a connection made in December still works in December next year with nobody
        deciding it should. Rotation is manual and four of six were last rotated in March.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a read-only credential does and does not protect against</p>
        <DataSourcesKvList rows={DS11_PROTECTS_KV} />
      </section>
    </div>
  );
};

export default CredentialsRoute;
