import React, { useState } from 'react';
import { WhatsAppCoexistenceConfig } from '../../types';
import {
  getStoredWhatsAppCoexistenceConfig,
  saveStoredWhatsAppCoexistenceConfig
} from '../../services/mercadoPagoService';
import {
  MessageCircle,
  Smartphone,
  Cloud,
  Check,
  ShieldCheck,
  Copy,
  ExternalLink,
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';

export const WhatsAppCoexistenceSection: React.FC = () => {
  const [config, setConfig] = useState<WhatsAppCoexistenceConfig>(
    getStoredWhatsAppCoexistenceConfig()
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredWhatsAppCoexistenceConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sampleN8nHttpNode = JSON.stringify(
    {
      parameters: {
        method: 'POST',
        url: `=https://graph.facebook.com/v21.0/${config.phoneNumberId || 'SEU_PHONE_NUMBER_ID'}/messages`,
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: 'Authorization',
              value: `=Bearer ${config.metaAccessToken || 'SEU_META_ACCESS_TOKEN'}`
            }
          ]
        },
        sendBody: true,
        contentType: 'json',
        bodyParameters: {
          parameters: [
            {
              name: 'messaging_product',
              value: 'whatsapp'
            },
            {
              name: 'recipient_type',
              value: 'individual'
            },
            {
              name: 'to',
              value: '={{ $json.parentWhatsApp }}'
            },
            {
              name: 'type',
              value: 'template'
            },
            {
              name: 'template',
              value: {
                name: config.templateName || 'video_personalizado_entrega',
                language: {
                  code: config.language || 'pt_BR'
                },
                components: [
                  {
                    type: 'header',
                    parameters: [
                      {
                        type: 'video',
                        video: {
                          link: '={{ $json.videoUrl }}'
                        }
                      }
                    ]
                  },
                  {
                    type: 'body',
                    parameters: [
                      {
                        type: 'text',
                        text: '={{ $json.childName }}'
                      },
                      {
                        type: 'text',
                        text: '={{ $json.characterName }}'
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      },
      name: 'Meta WhatsApp Cloud API (Coexistência)',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [700, 300]
    },
    null,
    2
  );

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-[#121c2e] p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <MessageCircle className="h-6 w-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                WhatsApp API Oficial com Coexistência (Meta Cloud API)
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="h-3 w-3" />
                Oficial Meta
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Envio automático de vídeos e mensagens sem desconectar o WhatsApp Business do seu celular.
            </p>
          </div>
        </div>

        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Painel Meta for Developers</span>
        </a>
      </div>

      {/* Coexistence Explanation Card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-3">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
          <Info className="h-4 w-4" />
          <span>Como funciona a Coexistência Oficial da Meta?</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5 rounded-xl bg-black/40 p-3 border border-white/5">
            <Smartphone className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">1. Seu Celular Físico:</strong>
              Você continua usando o app <strong>WhatsApp Business</strong> no celular para conversar manualmente com os clientes, ver recibos e tirar dúvidas. O número NUNCA desloga!
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-black/40 p-3 border border-white/5">
            <Cloud className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">2. A API Oficial na Nuvem:</strong>
              O <strong>n8n</strong> dispara os vídeos e mensagens automaticamente na mesma linha telefônica pela Meta Cloud API. <strong>Zero risco de banimento de número.</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Phone Number ID (ID do Número na Meta) *
            </label>
            <input
              type="text"
              value={config.phoneNumberId}
              onChange={(e) => setConfig((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
              placeholder="Ex: 104829384918234"
              className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              WABA ID (WhatsApp Business Account ID)
            </label>
            <input
              type="text"
              value={config.wabaId}
              onChange={(e) => setConfig((prev) => ({ ...prev, wabaId: e.target.value }))}
              placeholder="Ex: 928374829103948"
              className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Nome do Template de Mensagem Aprovado na Meta *
            </label>
            <input
              type="text"
              value={config.templateName}
              onChange={(e) => setConfig((prev) => ({ ...prev, templateName: e.target.value }))}
              placeholder="video_personalizado_entrega"
              className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
            <span className="block mt-1 text-[10px] text-slate-400">
              Nome exato do modelo aprovado na aba <em>Message Templates</em> do Gerenciador do WhatsApp.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Idioma do Template
            </label>
            <input
              type="text"
              value={config.language}
              onChange={(e) => setConfig((prev) => ({ ...prev, language: e.target.value }))}
              placeholder="pt_BR"
              className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Meta Token de Acesso Permanente (System User Token)
          </label>
          <input
            type="password"
            value={config.metaAccessToken}
            onChange={(e) => setConfig((prev) => ({ ...prev, metaAccessToken: e.target.value }))}
            placeholder="EAAGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx..."
            className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          <span className="block mt-1 text-[10px] text-slate-400">
            Gerado em <em>Configurações do Negócio ➔ Usuários do Sistema ➔ Gerar Novo Token</em> com permissões <code>whatsapp_business_messaging</code> e <code>whatsapp_business_management</code>.
          </span>
        </div>

        {/* Toggle Coexistence */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
          <input
            type="checkbox"
            checked={config.coexistenceActive}
            onChange={(e) => setConfig((prev) => ({ ...prev, coexistenceActive: e.target.checked }))}
            className="h-4 w-4 rounded accent-emerald-400"
          />
          <div>
            <span className="block text-xs font-bold text-white">
              Ativar Modo Coexistência (Celular + API Oficial em Paralelo)
            </span>
            <span className="text-[11px] text-slate-400">
              Mantém o número ativo no celular enquanto a API oficial executa os disparos automáticos.
            </span>
          </div>
        </label>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
              <Check className="h-4 w-4" />
              Configurações da API Oficial salvas!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
          >
            Salvar Dados da API Oficial
          </button>
        </div>
      </form>

      {/* Copyable n8n Node Snippet */}
      <div className="pt-4 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Nó do n8n Pronto (Copiar e Colar dentro do seu n8n):</span>
          </span>
          <button
            type="button"
            onClick={() => handleCopy('n8n_meta_node', sampleN8nHttpNode)}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:underline"
          >
            <Copy className="h-3 w-3" />
            <span>{copiedKey === 'n8n_meta_node' ? 'Copiado para a área de transferência!' : 'Copiar Nó do n8n'}</span>
          </button>
        </div>
        <pre className="rounded-xl bg-black/60 p-3 text-[10px] font-mono text-emerald-200/90 border border-white/5 overflow-x-auto max-h-48">
          {sampleN8nHttpNode}
        </pre>
        <p className="text-[10px] text-slate-400">
          💡 No n8n, basta apertar <strong>Ctrl + V</strong> na tela de edição para colar este nó configurado pronto para envio.
        </p>
      </div>
    </div>
  );
};
