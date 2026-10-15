import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  FileText,
  Image as ImageIcon,
  Infinity,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Mic2,
  Paperclip,
  PenLine,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  WandSparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Message = { role: "user" | "assistant"; content: string; imageUrl?: string };

type Module = {
  id: string;
  label: string;
  status: string;
  detail: string;
};

const fallbackModules: Module[] = [
  { id: "chat", label: "AI chat", status: "live", detail: "No app-imposed message cap" },
  { id: "research", label: "Web research", status: "live", detail: "Search and summarize public web pages" },
  { id: "studio", label: "Creative studio", status: "live", detail: "Image generation is live" },
  { id: "build", label: "Build lab", status: "live", detail: "Generate code and website plans" },
  { id: "automations", label: "Automations", status: "approval", detail: "Draft workflows; execution needs approval" },
  { id: "integrations", label: "Integrations", status: "connection", detail: "Secure setup for external APIs" },
];

const moduleIcons: Record<string, typeof Bot> = {
  chat: Bot,
  research: Compass,
  studio: WandSparkles,
  build: LayoutDashboard,
  automations: Workflow,
  integrations: KeyRound,
};

function AccessGate() {
  return (
    <main className="adus-grid flex min-h-screen items-center justify-center px-5 py-10">
      <section className="adus-glass w-full max-w-lg rounded-[2rem] border border-white/10 p-8 shadow-2xl shadow-cyan-950/30 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-300/20"><Sparkles size={21} /></div>
          <div><div className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-cyan-200">Adus / AI workspace</div><div className="text-sm text-white/45">Advanced AI control plane</div></div>
        </div>
        <div className="mb-8 space-y-4">
          <div className="text-4xl font-extrabold leading-tight tracking-[-0.06em] text-white">Your AI workspace is ready.</div>
          <p className="max-w-md text-sm leading-7 text-slate-300/70">Sign in to access Adus. Anyone with a supported account can use the workspace.</p>
        </div>
        <Button onClick={() => startLogin()} className="h-12 w-full rounded-xl bg-cyan-300 font-bold text-slate-950 hover:bg-cyan-200">Sign in to Adus <ArrowUpRight className="ml-2" size={17} /></Button>
        <div className="mt-7 flex items-center gap-2 text-xs text-slate-400/60"><LockKeyhole size={13} /> Sign-in required · secure by default</div>
      </section>
    </main>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const items = [
    { label: "Workspace", icon: LayoutDashboard, active: true },
    { label: "Creative studio", icon: ImageIcon },
    { label: "Build lab", icon: PenLine },
    { label: "Operations center", icon: Settings2 },
  ];
  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0b0f18]/90 px-5 py-6 backdrop-blur-xl max-lg:w-full max-lg:border-b max-lg:border-r-0 max-lg:px-4 max-lg:py-4">
      <div className="mb-10 flex items-center justify-between max-lg:mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-cyan-300 text-slate-950 shadow-xl shadow-cyan-300/10"><Sparkles size={19} /></div>
          <div><div className="text-[15px] font-extrabold tracking-[-0.04em] text-white">Adus</div><div className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-200/60">Advanced AI</div></div>
        </div>
        {onClose && <button onClick={onClose} className="rounded-lg p-2 text-white/45 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Close menu"><X size={18} /></button>}
      </div>
      <div className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">Control room</div>
      <nav className="space-y-1">
        {items.map(({ label, icon: Icon, active }) => <button key={label} onClick={label === "Operations center" ? () => { window.location.href = "/operations"; } : undefined} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active ? "bg-white/[0.08] text-white shadow-inner shadow-white/[0.02]" : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"}`}><Icon size={17} className={active ? "text-cyan-200" : "text-white/35 group-hover:text-cyan-200/70"} /><span>{label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.9)]" />}</button>)}
      </nav>
      <div className="my-7 h-px bg-white/[0.08]" />
      <div className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">Your spaces</div>
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/50 hover:bg-white/[0.04] hover:text-white/80"><Plus size={17} /><span>New workspace</span></button>
      <div className="mt-auto hidden rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] p-4 lg:block"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan-100"><Zap size={14} /> Adus is online</div><p className="text-[11px] leading-5 text-white/40">Chat sessions have no app-imposed cap. Provider availability and free-tier quotas still apply.</p></div>
    </aside>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const user = message.role === "user";
  return <div className={`flex gap-3 ${user ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 ${user ? "rounded-br-md bg-cyan-300 font-medium text-slate-950" : "rounded-bl-md border border-white/[0.08] bg-white/[0.045] text-slate-200"}`}>{user ? <div className="whitespace-pre-wrap">{message.content}</div> : <><Streamdown>{message.content}</Streamdown>{message.imageUrl && <a href={message.imageUrl} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border border-white/10"><img src={message.imageUrl} alt="Generated by Adus" className="max-h-[480px] w-full object-cover" /></a>}</>}</div></div>;
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, I’m **Adus**. Your AI workspace is online. Tell me what you want to research, create, build, or organize next." },
  ]);
  const sendMessage = trpc.adus.chat.useMutation();
  const capabilities = trpc.adus.capabilities.useQuery(undefined, { enabled: isAuthenticated });
  const modules = capabilities.data?.modules ?? fallbackModules;
  const activeModelCount = capabilities.data?.availableModelCount;
  const ownerName = user?.name?.split(" ")[0] ?? "Owner";

  const quickPrompts = useMemo(() => ["Create a premium offer for Safferni Tours", "Help me build a website", "Research a destination and summarize it"], []);

  if (loading) return <AccessGate />;
  if (!isAuthenticated) return <AccessGate />;

  async function submitMessage(event?: FormEvent) {
    event?.preventDefault();
    const value = draft.trim();
    if (!value || sendMessage.isPending) return;
    const userMessage: Message = { role: "user", content: value };
    setDraft("");
    setMessages(current => [...current, userMessage]);
    try {
      const result = await sendMessage.mutateAsync({ message: value, history: messages });
      setMessages(current => [...current, { role: "assistant", content: result.content, imageUrl: result.imageUrl }]);
    } catch (error) {
      setMessages(current => [...current, { role: "assistant", content: `I hit a temporary connection issue. Please try again.\n\n\`${error instanceof Error ? error.message : "Unknown error"}\`` }]);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="hidden lg:block"><Sidebar /></div>
        {menuOpen && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/65" onClick={() => setMenuOpen(false)} /><div className="relative h-full w-[82%] max-w-[330px]"><Sidebar onClose={() => setMenuOpen(false)} /></div></div>}
        <main className="adus-grid min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.08] bg-[#0a0d14]/70 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3"><button onClick={() => setMenuOpen(true)} className="rounded-xl border border-white/10 p-2 text-white/60 hover:bg-white/5 lg:hidden" aria-label="Open menu"><Menu size={18} /></button><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Authenticated workspace <span className="mx-2 text-white/15">/</span> <span className="text-cyan-200/70">Online</span></div></div>
            <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-xs text-white/55 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {ownerName} · signed in</div><button onClick={() => logout()} className="rounded-xl border border-white/10 p-2 text-white/45 hover:bg-white/5 hover:text-white" aria-label="Sign out"><LogOut size={17} /></button></div>
          </header>
          <div className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <section className="mb-8 flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
              <div className="max-w-3xl"><div className="mb-4 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-200/75"><span className="h-px w-8 bg-cyan-300/70" /> Advanced Adus / 01</div><h1 className="max-w-2xl text-4xl font-extrabold leading-[1.06] tracking-[-0.07em] text-white sm:text-6xl">Your ideas,<br /><span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">operationalized.</span></h1><p className="mt-5 max-w-xl text-sm leading-7 text-slate-300/60 sm:text-base">An AI workspace for research, creation, building, and the next move. No app-imposed chat cap — just one place to think out loud and get things done.</p></div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3"><div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-3 sm:min-w-[110px] sm:px-4"><div className="mb-1 text-xl font-bold tracking-[-0.05em] text-white">∞</div><div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">sessions</div></div><div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-3 sm:min-w-[110px] sm:px-4"><div className="mb-1 text-xl font-bold tracking-[-0.05em] text-white">{modules.length}</div><div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">lanes</div></div><div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-3 sm:min-w-[110px] sm:px-4"><div className="mb-1 text-xl font-bold tracking-[-0.05em] text-cyan-200">{activeModelCount ?? "—"}</div><div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">models</div></div></div>
            </section>

            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <section className="adus-glass flex min-h-[620px] flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.1] shadow-2xl shadow-black/25">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-300/15 text-violet-200"><BrainCircuit size={18} /></div><div><div className="text-sm font-semibold text-white">Open conversation</div><div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">Adus core · context aware</div></div></div><div className="flex items-center gap-2"><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-200">ready</span><button className="rounded-lg p-2 text-white/35 hover:bg-white/5 hover:text-white" aria-label="Conversation settings"><Settings2 size={16} /></button></div></div>
                <div className="adus-scroll flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-8">{messages.map((message, index) => <MessageBubble key={`${message.role}-${index}`} message={message} />)}{sendMessage.isPending && <div className="flex items-center gap-2 text-xs text-white/40"><div className="flex gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200 [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200 [animation-delay:240ms]" /></div> Adus is thinking</div>}</div>
                <div className="border-t border-white/[0.08] p-4 sm:p-5"><div className="mb-3 flex gap-2 overflow-x-auto pb-1">{quickPrompts.map(prompt => <button key={prompt} onClick={() => setDraft(prompt)} className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/45 hover:border-cyan-200/30 hover:text-cyan-100">{prompt}</button>)}</div><form onSubmit={submitMessage} className="rounded-2xl border border-white/10 bg-[#080b12]/80 p-2 focus-within:border-cyan-200/35"><textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submitMessage(); } }} placeholder="Tell Adus what you want to do…" rows={2} className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/25" /><div className="flex items-center justify-between px-2 pb-1"><div className="flex items-center gap-1"><button type="button" className="rounded-lg p-2 text-white/35 hover:bg-white/5 hover:text-white" aria-label="Attach a file"><Paperclip size={16} /></button><button type="button" className="rounded-lg p-2 text-white/35 hover:bg-white/5 hover:text-white" aria-label="Voice input"><Mic2 size={16} /></button><span className="ml-2 hidden text-[10px] text-white/25 sm:inline">Enter to send · Shift + Enter for a new line</span></div><Button type="submit" disabled={!draft.trim() || sendMessage.isPending} size="icon" className="h-9 w-9 rounded-xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"><Send size={16} /></Button></div></form></div>
              </section>

              <aside className="space-y-5"><div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035] p-5"><div className="mb-5 flex items-center justify-between"><div><div className="text-sm font-semibold text-white">Capability map</div><div className="mt-1 text-xs text-white/35">What Adus can orchestrate</div></div><CircleHelp size={17} className="text-white/30" /></div><div className="space-y-2">{modules.map(module => { const Icon = moduleIcons[module.id] ?? Sparkles; const live = module.status === "live"; return <button key={module.id} className="group flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${live ? "bg-cyan-300/15 text-cyan-200" : "bg-white/[0.06] text-white/50"}`}><Icon size={17} /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-xs font-semibold text-white/80"><span className="truncate">{module.label}</span>{live && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />}</div><div className="mt-0.5 truncate text-[10px] text-white/30">{module.detail}</div></div><ChevronRight size={15} className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/55" /></button> })}</div></div><div className="rounded-[1.75rem] border border-violet-200/10 bg-gradient-to-br from-violet-300/[0.12] to-cyan-300/[0.05] p-5"><div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white"><Infinity size={17} className="text-violet-200" /> Unlimited-feeling chat</div><p className="text-xs leading-6 text-white/45">Keep exploring in one thread. Adus carries the conversation context while you work.</p><div className="mt-5 flex items-center gap-2 text-[10px] text-emerald-200/80"><Check size={13} /> No app-level message limit</div></div><div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/75"><LockKeyhole size={15} className="text-cyan-200/70" /> Sign-in security</div><p className="text-[11px] leading-5 text-white/35">Authenticated users can enter this workspace. External actions remain approval-first.</p><div className="mt-4 flex items-center gap-2 font-mono text-[9px] text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {user?.email ?? "Signed-in user"}</div></div></aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
