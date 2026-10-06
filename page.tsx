"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";

const MODES = [
  ["assisted", "Assisted", "Agents recommend actions and wait for you."],
  ["semi_autonomous", "Semi-autonomous", "Agents research and prepare content; nothing publishes without your approval."],
  ["autonomous", "Autonomous", "Agents run the workflows you have allowed. You can switch this off at any time."],
] as const;

export default function SettingsPage() {
  const { data, error, reload } = useAsync(api.settings);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const val = (k: string) => data?.find((s) => s.key === k);

  async function run(fn: () => Promise<string>) {
    setBusy(true); setMsg(null);
    try { setMsg({ ok: true, text: await fn() }); await reload(); }
    catch (e) { setMsg({ ok: false, text: e instanceof Error ? e.message : "Failed" }); }
    finally { setBusy(false); }
  }

  if (error?.status === 403) return <p className="text-sm text-muted">Only administrators can change settings.</p>;
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl">Settings</h1>

      <section className="mt-10">
        <h2 className="font-serif text-xl">Autonomy</h2>
        <div className="mt-3 flex flex-col gap-3">
          {MODES.map(([id, name, desc]) => (
            <label key={id} className="flex gap-3 text-sm">
              <input type="radio" name="mode" checked={val("autonomy_mode")?.value === id} disabled={busy}
                onChange={() => run(async () => { await api.putSetting("autonomy_mode", id); return `Autonomy set to ${name.toLowerCase()}.`; })} />
              <span><span className="font-medium">{name}</span><br /><span className="text-muted">{desc}</span></span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-xl">Anthropic connection</h2>
        <p className="mt-1 text-sm text-muted">
          The key is encrypted on the server and never sent back to the browser.
          {val("anthropic_api_key")?.is_set ? " A key is saved for this organization." : " No key saved here; the server's ANTHROPIC_API_KEY is used if set."}
        </p>
        <form className="mt-4 flex gap-3" onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const key = String(new FormData(form).get("key") ?? "");
          void run(async () => { await api.putSetting("anthropic_api_key", key); form.reset(); return "API key saved."; });
        }}>
          <input name="key" type="password" required minLength={8} autoComplete="off" placeholder="sk-ant-…" className="field" aria-label="Anthropic API key" />
          <button className="btn" disabled={busy}>Save key</button>
        </form>
        <button className="btn-quiet mt-4" disabled={busy}
          onClick={() => run(async () => { const r = await api.testLlm(); return `Connected to ${r.provider} (${r.model}).`; })}>
          Test connection
        </button>
      </section>
      {msg && <p role="status" className={`mt-6 text-sm ${msg.ok ? "text-ok" : "text-alert"}`}>{msg.text}</p>}
    </div>
  );
}
