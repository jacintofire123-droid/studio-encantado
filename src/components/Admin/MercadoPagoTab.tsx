import React, { useState } from 'react';
import { MercadoPagoConfig } from '../../types';
import {
  getStoredMercadoPagoConfig,
  saveStoredMercadoPagoConfig,
  createMercadoPagoPix,
  PixPaymentResponse
} from '../../services/mercadoPagoService';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
  FileCode
} from 'lucide-react';

export const MercadoPagoTab: React.FC = () => {
  const [config, setConfig] = useState<MercadoPagoConfig>(getStoredMercadoPagoConfig());
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<PixPaymentResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredMercadoPagoConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunPixTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await createMercadoPagoPix({
        orderId: `TEST-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: 19.9,
        description: 'Studio Encantado - Teste de Integração Mercado Pago Pix',
        payerEmail: 'teste@studioencantado.com.br',
        payerFirstName: 'Admin Teste'
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        paymentId: 'ERROR',
        status: 'rejected',
        qrCode: '',
        isLive: false,
        message: err.message || 'Falha ao testar Mercado Pago'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0d1c38] via-[#122b52] to-[#0a1830] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 font-black shadow-lg shadow-sky-500/20">
              <CreditCard className="h-7 w-7 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                  Integração Mercado Pago API
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    config.accessToken && config.accessToken.length > 20
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      config.accessToken && config.accessToken.length > 20
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                  {config.accessToken && config.accessToken.length > 20
                    ? config.mode === 'production'
                      ? 'Produção Ativa'
                      : 'Sandbox / Testes'
                    : 'Aguardando Credenciais'}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
                Receba pagamentos via <strong>Pix Instantâneo</strong> e <strong>Cartão</strong> diretamente na sua conta do Mercado Pago. O pagamento confirmado avisa o n8n para liberar o vídeo no WhatsApp Oficial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={handleRunPixTest}
              disabled={isTesting}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/10 px-4 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Gerando Pix...' : 'Testar Cobrança Pix'}</span>
            </button>

            <a
              href="https://www.mercadopago.com.br/developers/panel/app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Painel Desenvolvedores MP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Test Result Toast Banner if triggered */}
      {testResult && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            testResult.success
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {testResult.success ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  {testResult.isLive
                    ? '✅ Cobrança Pix Real Gerada no Mercado Pago!'
                    : '🟡 Simulação Pix Pronta (Modo Teste)'}
                </span>
                <span className="text-xs opacity-90">{testResult.message}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {testResult.qrCode && (
                <button
                  type="button"
                  onClick={() => handleCopy('test_pix', testResult.qrCode)}
                  className="inline-flex items-center gap-1 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-mono text-white border border-white/10 hover:bg-black/60 transition"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === 'test_pix' ? 'Copiado!' : 'Copiar Código Pix'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setTestResult(null)}
                className="text-xs opacity-75 hover:opacity-100 px-2 py-1"
              >
                Fechar ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Settings & Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-white/10 bg-[#140e2b] p-6 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-sky-400" />
                  <span>Credenciais da API do Mercado Pago</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Insira o <strong>Access Token</strong> da sua conta comercial do Mercado Pago.
                </p>
              </div>

              {saveSuccess && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 animate-pulse">
                  <Check className="h-3.5 w-3.5" />
                  Salvo com sucesso!
                </span>
              )}
            </div>

            {/* Environment Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Ambiente de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, mode: 'production' }))}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    config.mode === 'production'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Produção (Dinheiro Real)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, mode: 'sandbox' }))}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    config.mode === 'sandbox'
                      ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Sandbox / Testes</span>
                </button>
              </div>
            </div>

            {/* Access Token */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Access Token ({config.mode === 'production' ? 'Produção' : 'Sandbox'}) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                  className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
                >
                  {showAccessToken ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      <span>Ocultar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>Mostrar</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type={showAccessToken ? 'text' : 'password'}
                value={config.accessToken}
                onChange={(e) => setConfig((prev) => ({ ...prev, accessToken: e.target.value }))}
                placeholder={
                  config.mode === 'production'
                    ? 'APP_USR-xxxxxxxxxxxxxxxx-xxxxxx...'
                    : 'TEST-xxxxxxxxxxxxxxxx-xxxxxx...'
                }
                className="w-full h-11 rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-mono text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
              />
              <span className="block mt-1 text-[11px] text-slate-400">
                Começa com <code>APP_USR-</code> para produção ou <code>TEST-</code> para testes.
              </span>
            </div>

            {/* Public Key */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Public Key (Chave Pública)
              </label>
              <input
                type="text"
                value={config.publicKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, publicKey: e.target.value }))}
                placeholder="APP_USR-xxxx-xxxx ou TEST-xxxx-xxxx"
                className="w-full h-11 rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-mono text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>

            {/* Statement Descriptor */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nome no Extrato Bancário do Cliente (Statement Descriptor)
              </label>
              <input
                type="text"
                maxLength={13}
                value={config.statementDescriptor || 'STUDIOENCANT'}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    statementDescriptor: e.target.value.toUpperCase()
                  }))
                }
                placeholder="STUDIOENCANT"
                className="w-full h-11 rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-mono text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none uppercase"
              />
              <span className="block mt-1 text-[11px] text-slate-400">
                Máximo 13 caracteres sem espaços. Aparece na fatura do cartão ou no Pix do cliente.
              </span>
            </div>

            {/* Save Button */}
            <div className="pt-2 border-t border-white/5">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Salvar Configurações do Mercado Pago</span>
              </button>
            </div>
          </form>

          {/* Webhook do Mercado Pago para n8n */}
          <div className="rounded-3xl border border-white/10 bg-[#140e2b] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  Notificação de Pagamento (Webhook / IPN)
                </h4>
                <p className="text-xs text-slate-400">
                  Configure esta URL no painel do Mercado Pago para notificar o n8n assim que o Pix for pago.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">URL do Webhook no seu n8n:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('mp_webhook_url', 'https://seu-n8n.com/webhook/mercadopago-pagamento')
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedKey === 'mp_webhook_url' ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>
              <code className="block rounded-lg bg-black/60 p-2.5 text-xs font-mono text-emerald-300 break-all border border-white/5">
                https://seu-n8n.com/webhook/mercadopago-pagamento
              </code>
              <span className="block text-[11px] text-slate-400">
                Eventos para marcar no Mercado Pago: <strong>Pagamentos (payment)</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Guide Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step by step to get credentials */}
          <div className="rounded-3xl border border-white/10 bg-[#140e2b] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
              <h4 className="font-display text-base font-bold text-white">
                Como Obter suas Credenciais
              </h4>
            </div>

            <ol className="space-y-3 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
              <li className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                Acesse o{' '}
                <a
                  href="https://www.mercadopago.com.br/developers/panel/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline font-bold"
                >
                  Mercado Pago Developers
                </a>{' '}
                e entre com sua conta Mercado Pago.
              </li>
              <li className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                Clique em <strong>Criar aplicação</strong> (Nome: <em>Studio Encantado</em> / Tipo: <em>Pagamentos Checkout Transparente</em>).
              </li>
              <li className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                No menu lateral, clique em <strong>Credenciais de Produção</strong>.
              </li>
              <li className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                Copie o <strong>Access Token</strong> (inicia com <code>APP_USR-</code>) e cole no formulário ao lado.
              </li>
              <li className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                Em <strong>Webhooks</strong>, adicione a URL do seu nó Webhook do n8n marcando o evento <code>payment</code>.
              </li>
            </ol>
          </div>

          {/* n8n Flow Diagram */}
          <div className="rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
              <FileCode className="h-4 w-4" />
              <span>Fluxo Mercado Pago ➔ n8n ➔ WhatsApp</span>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                1. O cliente clica em pagar no Pix: o site chama a API do Mercado Pago e gera o QR Code Copia e Cola.
              </p>
              <p>
                2. O cliente paga no app do banco: o Mercado Pago aprova o pagamento em 2 segundos.
              </p>
              <p>
                3. O Mercado Pago chama o seu Webhook no n8n.
              </p>
              <p>
                4. O n8n pega o telefone e dispara a mensagem com o vídeo pela <strong>API Oficial do WhatsApp (com Coexistência)</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
