import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, MessageSquare, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'termos' | 'privacidade';
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'termos'
}) => {
  const [activeTab, setActiveTab] = useState<'termos' | 'privacidade'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex flex-col max-h-[88vh] w-full max-w-2xl rounded-3xl border border-amber-400/30 bg-[#160f2c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#191132]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {BRAND_CONFIG.name} · Jurídico & Compliance
              </h3>
              <p className="text-[11px] text-slate-400">
                Termos de Serviço, API Oficial do WhatsApp e LGPD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-white/10 bg-black/20 text-xs font-bold">
          <button
            onClick={() => setActiveTab('termos')}
            className={`flex items-center justify-center gap-2 py-3 border-b-2 transition ${
              activeTab === 'termos'
                ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Termos de Uso & API do WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('privacidade')}
            className={`flex items-center justify-center gap-2 py-3 border-b-2 transition ${
              activeTab === 'privacidade'
                ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Privacidade & Proteção de Dados (LGPD)</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed scrollbar-thin">
          {activeTab === 'termos' ? (
            <>
              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  1. Objeto e Escopo do Serviço
                </h4>
                <p>
                  O <strong>{BRAND_CONFIG.name}</strong> disponibiliza uma plataforma digital voltada à criação, renderização e entrega de mensagens audiovisuais personalizadas de caráter recreativo, lúdico e afetivo com personagens temáticos para crianças.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <h4 className="font-display text-sm font-bold text-emerald-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  2. Comunicação e Transmissão via API Oficial do WhatsApp (Meta)
                </h4>
                <p className="mb-2">
                  Ao cadastrar seu número de telefone e aceitar estes termos, você expressamente <strong>autoriza e dá consentimento prévio (opt-in)</strong> para que o {BRAND_CONFIG.name} entre em contato através da <strong>API Oficial do WhatsApp Business (Meta Platforms Inc.)</strong> para:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-200">
                  <li>Envio do arquivo de vídeo personalizado em alta resolução (Full HD);</li>
                  <li>Notificações sobre o status do processamento e confirmação de pagamento;</li>
                  <li>Suporte técnico humano para eventuais ajustes na pronúncia do nome da criança;</li>
                  <li>Instruções para download e backup vitalício do conteúdo.</li>
                </ul>
                <p className="mt-2 text-[11px] text-emerald-300/90 font-medium">
                  • O canal do WhatsApp não é utilizado para envio de spam invasivo. Você pode revogar este consentimento a qualquer momento respondendo "PARAR" ou solicitando ao nosso suporte.
                </p>
              </div>

              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  3. Prazos de Entrega e Suporte de Pronúncia
                </h4>
                <p>
                  A entrega padrão é processada em até 5 (cinco) minutos após a compensação do pagamento. Caso o nome da criança possua grafia ou fonética incomum e a pronúncia gerada não atenda à expectativa, o usuário tem direito ao ajuste manual gratuito por nossos dubladores e equipe de pós-produção via WhatsApp.
                </p>
              </div>

              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  4. Garantia Incondicional de 7 Dias
                </h4>
                <p>
                  Em conformidade com o Artigo 49 do Código de Defesa do Consumidor (CDC), garantimos o reembolso integral do valor pago caso o serviço não atenda plenamente às suas expectativas no prazo de até 7 (sete) dias corridos após a contratação.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-amber-400" />
                  1. Conformidade com a LGPD (Lei nº 13.709/2018)
                </h4>
                <p>
                  O {BRAND_CONFIG.name} adota medidas técnicas e organizacionais rígidas de segurança da informação para garantir a privacidade, integridade e confidencialidade dos dados pessoais de seus clientes e familiares.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4">
                <h4 className="font-display text-sm font-bold text-amber-300 mb-1.5">
                  2. Tratamento Ético de Dados de Crianças e Adolescentes
                </h4>
                <p className="mb-2">
                  Em cumprimento ao Artigo 14 da LGPD:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-200">
                  <li>O nome da criança é coletado <strong>exclusivamente</strong> sob o consentimento e solicitação do pai, mãe ou responsável legal;</li>
                  <li>O nome e a faixa etária são utilizados <strong>estritamente</strong> para a inserção no roteiro do vídeo personalizado adquirido;</li>
                  <li><strong>Nunca</strong> comercializamos, compartilhamos ou repassamos nomes ou dados infantis a terceiros para marketing ou profiling publicitário.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1.5">
                  3. Armazenamento e Criptografia
                </h4>
                <p>
                  As transações financeiras são processadas por instituições autorizadas pelo Banco Central do Brasil, contando com criptografia TLS de 256 bits. O {BRAND_CONFIG.name} não armazena dados sensíveis de cartões de crédito em seus servidores.
                </p>
              </div>

              <div>
                <h4 className="font-display text-sm font-bold text-white mb-1.5">
                  4. Direitos do Titular de Dados
                </h4>
                <p>
                  Você pode, a qualquer momento, solicitar a confirmação da existência de tratamento, correção de dados incompletos ou exclusão de seus registros de nossa base de dados entrando em contato pelo e-mail <strong>{BRAND_CONFIG.supportEmail}</strong> ou pelo WhatsApp de atendimento.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-[#191132]">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {BRAND_CONFIG.name} · CNPJ: {BRAND_CONFIG.cnpj}
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
          >
            Entendi e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
