import React, { useState } from 'react';
import {
  N8N_WORKFLOW_1_VIDEO,
  N8N_WORKFLOW_2_WHATSAPP,
  N8N_WORKFLOW_3_MERCADOPAGO,
  ALL_N8N_WORKFLOWS,
  N8NWorkflowItem
} from '../../data/n8nWorkflows';
import {
  Zap,
  Copy,
  Check,
  Download,
  FileCode,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
  Terminal,
  Info,
  CheckCircle2,
  Code2,
  Share2,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const N8NWorkflowsSection: React.FC = () => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('gerar_video');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  const activeWorkflow: N8NWorkflowItem =
    ALL_N8N_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || N8N_WORKFLOW_1_VIDEO;

  const handleCopyJson = (workflow: N8NWorkflowItem) => {
    const jsonString = JSON.stringify(workflow.workflowJson, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopiedId(workflow.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCopyBundleJson = () => {
    const bundle = {
      project: 'Studio Encantado - Automações n8n',
      version: '1.0.0',
      description: 'Pacote com os 3 workflows essenciais: Geração de Vídeo ElevenLabs+FFmpeg, Envio de Prévia no WhatsApp, e Confirmação de Pagamento Mercado Pago.',
      workflows: ALL_N8N_WORKFLOWS.map((w) => w.workflowJson)
    };
    navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
    setCopiedId('bundle');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDownloadJson = (workflow: N8NWorkflowItem) => {
    const jsonString = JSON.stringify(workflow.workflowJson, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-${workflow.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBundle = () => {
    const bundle = {
      project: 'Studio Encantado - Automações n8n',
      version: '1.0.0',
      workflows: ALL_N8N_WORKFLOWS.map((w) => w.workflowJson)
    };
    const jsonString = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-studio-encantado-pacote-completo.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-r from-[#1e1338] via-[#241745] to-[#160d2e] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-400/20 flex-shrink-0">
              <Zap className="w-7 h-7 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                  Workflows Oficiais n8n & Arquivos JSON
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Prontos para Importar
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                Copie o JSON de qualquer um dos 3 fluxos e aperte <strong className="text-amber-300 font-mono">Ctrl + V</strong> dentro do seu painel do n8n para importar os nós conectados instantaneamente, ou baixe os arquivos <strong className="text-amber-300 font-mono">.json</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleCopyBundleJson}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition shadow-lg"
            >
              {copiedId === 'bundle' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-300">Pacote Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-300" />
                  <span>Copiar Pacote Completo (3 em 1)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadAllBundle}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/20 transition transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Todos (.json)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Tabs Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ALL_N8N_WORKFLOWS.map((wf) => {
          const isSelected = wf.id === selectedWorkflowId;
          return (
            <button
              key={wf.id}
              type="button"
              onClick={() => {
                setSelectedWorkflowId(wf.id);
                setShowRawJson(false);
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-[#241748] to-[#190f33] border-amber-400/80 shadow-xl shadow-amber-400/10 ring-2 ring-amber-400/30'
                  : 'bg-[#150f2b]/70 border-white/10 hover:border-white/20 hover:bg-[#1a1236]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  wf.badgeColor === 'amber'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : wf.badgeColor === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}>
                  {wf.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{wf.endpoint.split(' ')[0]}</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition line-clamp-1">
                {wf.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {wf.purpose}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Workflow Workspace */}
      <div className="rounded-3xl border border-white/10 bg-[#160f2e] p-6 sm:p-8 shadow-2xl space-y-7">
        {/* Header of Active Workflow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="font-display text-xl font-black text-white">
                {activeWorkflow.title}
              </h3>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/30 font-bold">
                {activeWorkflow.endpoint}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {activeWorkflow.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => handleCopyJson(activeWorkflow)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition transform hover:scale-105"
            >
              {copiedId === activeWorkflow.id ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>JSON Copiado! Abra o n8n e aperte Ctrl+V</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar JSON para o n8n</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleDownloadJson(activeWorkflow)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Baixar arquivo JSON"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Baixar .json</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
            >
              {showRawJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showRawJson ? 'Ocultar JSON' : 'Ver JSON'}</span>
            </button>
          </div>
        </div>

        {/* Visual Pipeline Node Diagram */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Pipeline Visual dos Nós no n8n</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {activeWorkflow.nodesSummary.length} nós sequenciais conectados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {activeWorkflow.nodesSummary.map((node, idx) => (
              <div
                key={node.name}
                className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2 relative group hover:border-amber-400/50 hover:bg-black/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{node.icon}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                    Passo {idx + 1}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-white group-hover:text-amber-300 transition">
                  {node.name}
                </h5>
                <p className="text-[10px] font-mono text-cyan-400 truncate">
                  {node.type}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Import in n8n Guide */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-400/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Como Importar no seu n8n em 15 Segundos:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-[10px] mb-1">
                1
              </span>
              <p className="font-bold text-white">Copiar o JSON</p>
              <p className="text-slate-400 text-[11px]">
                Clique no botão verde acima <strong>"Copiar JSON para o n8n"</strong>.
              </p>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-[10px] mb-1">
                2
              </span>
              <p className="font-bold text-white">Abrir o n8n</p>
              <p className="text-slate-400 text-[11px]">
                No seu n8n, clique em <strong>Workflows ➔ Add Workflow</strong>.
              </p>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-[10px] mb-1">
                3
              </span>
              <p className="font-bold text-white">Colar (Ctrl + V)</p>
              <p className="text-slate-400 text-[11px]">
                Aperte <kbd className="bg-black/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ctrl+V</kbd> em qualquer área em branco da tela do n8n.
              </p>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px] mb-1">
                4
              </span>
              <p className="font-bold text-white">Ativar Fluxo</p>
              <p className="text-slate-400 text-[11px]">
                Coloque suas credenciais nos nós correspondentes, clique em <strong>Save</strong> e ligue a chave <strong>Active</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Requisitos para Execução deste Fluxo:</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            {activeWorkflow.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* JSON Code Viewer (Expansível) */}
        {showRawJson && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>JSON Completo de Importação do n8n:</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopyJson(activeWorkflow)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar este JSON</span>
              </button>
            </div>
            <pre className="p-4 bg-black/90 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-300 max-h-96 overflow-y-auto custom-scrollbar">
              <code>{JSON.stringify(activeWorkflow.workflowJson, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Payload Sample Cards (Input & Output) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Payload In */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Payload Enviado pelo Site (Request)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">JSON</span>
            </div>
            <pre className="p-3 bg-black/70 border border-slate-800/80 rounded-xl text-[11px] font-mono text-slate-300 max-h-56 overflow-y-auto custom-scrollbar">
              <code>{JSON.stringify(activeWorkflow.samplePayloadInput, null, 2)}</code>
            </pre>
          </div>

          {/* Payload Out */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Retorno Esperado do n8n (Response)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">JSON 200 OK</span>
            </div>
            <pre className="p-3 bg-black/70 border border-slate-800/80 rounded-xl text-[11px] font-mono text-emerald-300 max-h-56 overflow-y-auto custom-scrollbar">
              <code>{JSON.stringify(activeWorkflow.samplePayloadOutput, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
