import React, { useState, useEffect } from 'react';
import { Character, MessageOccasion, OrderData } from '../../types';
import { BRAND_CONFIG } from '../../config/brand';
import { TermsModal } from '../TermsModal';
import {
  getStoredPricing,
  recordLeadPurchase,
  formatCurrency
} from '../../services/adminStore';
import { sendWhatsAppWithN8N } from '../../services/n8nService';
import {
  createMercadoPagoPix,
  getStoredMercadoPagoConfig,
  PixPaymentResponse
} from '../../services/mercadoPagoService';
import confetti from 'canvas-confetti';
import {
  X,
  QrCode,
  CreditCard,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Download,
  MessageCircle,
  CheckCircle2,
  Plus,
  Zap,
  Calendar,
  CheckSquare,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  childName: string;
  occasion: MessageOccasion;
  customerData: {
    email: string;
    whatsapp: string;
    birthYear: string;
  };
  generatedVideoUrl?: string;
  onOrderCompleted: (order: OrderData) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  character,
  childName,
  occasion,
  customerData,
  generatedVideoUrl,
  onOrderCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'pix' | 'card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderData | null>(null);
  const [n8nStatus, setN8nStatus] = useState<'idle' | 'sending' | 'sent' | 'simulated' | 'error'>('idle');
  const [n8nMessage, setN8nMessage] = useState<string>('');

  // Mercado Pago Pix State
  const [pixData, setPixData] = useState<PixPaymentResponse | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [mpConfig] = useState(getStoredMercadoPagoConfig());

  // Order Bumps state
  const [hasConvite, setHasConvite] = useState(false);
  const [hasRotina, setHasRotina] = useState(false);
  const [hasVipPriority, setHasVipPriority] = useState(false);

  // Credit card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Dynamic system pricing from admin store
  const [pricing, setPricing] = useState(getStoredPricing());
  useEffect(() => {
    const handlePriceUpdate = () => setPricing(getStoredPricing());
    window.addEventListener('studio_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('studio_pricing_updated', handlePriceUpdate);
  }, []);

  // Calculate dynamic total
  const basePrice = pricing.singleVideoPrice;
  const convitePrice = hasConvite ? pricing.bumpConvitePrice : 0;
  const rotinaPrice = hasRotina ? pricing.bumpRotinaPrice : 0;
  const vipPrice = hasVipPriority ? pricing.bumpVipPrice : 0;
  const totalPrice = Number((basePrice + convitePrice + rotinaPrice + vipPrice).toFixed(2));

  // Generate real or simulated Mercado Pago Pix on open or price change
  useEffect(() => {
    if (!isOpen || isCompleted) return;
    let isCancelled = false;

    const generatePix = async () => {
      setIsGeneratingPix(true);
      try {
        const tempOrderId = `RMG-${Math.floor(100000 + Math.random() * 900000)}`;
        const res = await createMercadoPagoPix({
          orderId: tempOrderId,
          amount: totalPrice,
          description: `Studio Encantado - Vídeo do ${character.name} para ${childName}`,
          payerEmail: customerData.email || 'contato@cliente.com',
          payerFirstName: childName || 'Cliente',
          metadata: {
            order_id: tempOrderId,
            child_name: childName,
            character_name: character.name,
            character_id: character.id,
            video_url: generatedVideoUrl || character.videoUrl,
            whatsapp: customerData.whatsapp,
            occasion: occasion,
            bump_convite: Boolean(hasConvite),
            bump_rotina: Boolean(hasRotina)
          }
        });
        if (!isCancelled) {
          setPixData(res);
        }
      } catch (err) {
        console.warn('Erro ao gerar Pix Mercado Pago:', err);
      } finally {
        if (!isCancelled) {
          setIsGeneratingPix(false);
        }
      }
    };

    generatePix();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, totalPrice, character.name, childName, customerData.email, isCompleted]);

  // Pix Code to copy
  const activePixCode = pixData?.qrCode || `00020126580014br.gov.bcb.pix0136mercadopago-${totalPrice}520400005303986540${totalPrice}5802BR5916StudioEncantado6009SaoPaulo62070503***6304`;


  // Countdown timer for Pix
  useEffect(() => {
    if (!isOpen || isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isCompleted]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(activePixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleCompletePayment = async () => {
    setIsProcessing(true);

    const newOrder: OrderData = {
      orderId: `RMG-${Math.floor(100000 + Math.random() * 900000)}`,
      childName,
      character,
      occasion,
      parentEmail: customerData.email,
      parentWhatsApp: customerData.whatsapp,
      birthYear: customerData.birthYear,
      plan: '1-video',
      price: totalPrice,
      paymentMethod: activeTab === 'pix' ? 'pix' : 'credit_card',
      createdAt: new Date().toISOString(),
      status: 'paid',
      bumps: {
        convite: hasConvite,
        rotina: hasRotina,
        vipPriority: hasVipPriority
      }
    };

    setOrderResult(newOrder);

    // Trigger n8n WhatsApp delivery webhook
    setN8nStatus('sending');
    try {
      const delivery = await sendWhatsAppWithN8N({
        order: newOrder,
        videoUrl: generatedVideoUrl || character.videoUrl
      });
      setN8nStatus(delivery.source === 'n8n_live' ? 'sent' : 'simulated');
      setN8nMessage(delivery.message);
      recordLeadPurchase(null, newOrder, delivery.source === 'n8n_live' ? 'sent' : 'mock');
    } catch (err: any) {
      setN8nStatus('error');
      setN8nMessage(err.message || 'Erro ao conectar com n8n');
      recordLeadPurchase(null, newOrder, 'failed');
    }

    setIsProcessing(false);
    setIsCompleted(true);
    onOrderCompleted(newOrder);

    // Trigger festive confetti
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const handleResendViaN8N = async () => {
    if (!orderResult) return;
    setN8nStatus('sending');
    try {
      const delivery = await sendWhatsAppWithN8N({
        order: orderResult,
        videoUrl: generatedVideoUrl || character.videoUrl
      });
      setN8nStatus(delivery.source === 'n8n_live' ? 'sent' : 'simulated');
      setN8nMessage(delivery.message);
    } catch (err: any) {
      setN8nStatus('error');
      setN8nMessage(err.message || 'Erro ao reenviar via n8n');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-amber-400/30 bg-[#191132] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {isCompleted && orderResult ? (
          /* SUCCESS SCREEN WITH WHATSAPP SIMULATOR */
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>

            <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 mb-2">
              PAGAMENTO CONFIRMADO
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
              Obrigado! O vídeo de {childName} foi liberado!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Pedido <strong>{orderResult.orderId}</strong> emitido. O vídeo já está sendo processado para o WhatsApp <strong>{customerData.whatsapp}</strong>.
            </p>

            {/* n8n WhatsApp Delivery Notification Card */}
            <div className="my-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-left">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Zap className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-300">
                      Disparo n8n ➔ API Oficial WhatsApp
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {n8nStatus === 'sending'
                        ? 'Enviando payload para o workflow do n8n...'
                        : n8nStatus === 'sent'
                        ? 'Enviado ao WhatsApp com sucesso via n8n'
                        : n8nStatus === 'error'
                        ? 'Alerta na conexão do n8n (retransmissão disponível)'
                        : 'Disparo simulado com sucesso (n8n pronto)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResendViaN8N}
                  disabled={n8nStatus === 'sending'}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition disabled:opacity-50"
                  title="Reenviar disparo via n8n"
                >
                  <RefreshCw className={`h-3 w-3 ${n8nStatus === 'sending' ? 'animate-spin' : ''}`} />
                  <span>Reenviar</span>
                </button>
              </div>

              {n8nMessage && (
                <div className="mt-2 text-[10px] font-mono text-emerald-200/80 bg-black/40 rounded-lg p-1.5 border border-white/5 truncate">
                  n8n: {n8nMessage}
                </div>
              )}
            </div>

            {/* WhatsApp Message Delivery Simulator */}
            <div className="my-5 rounded-2xl border border-emerald-500/30 bg-[#0b141a] p-4 text-left shadow-inner">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
                <div className="h-7 w-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                  RE
                </div>
                <div>
                  <span className="block text-xs font-bold text-white leading-none">
                    {BRAND_CONFIG.name} Oficial
                  </span>
                  <span className="text-[10px] text-emerald-400">online</span>
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="rounded-2xl rounded-tl-sm bg-[#005c4b] p-3 text-xs text-white space-y-2 shadow">
                <p>
                  Olá! Aqui está o vídeo mágico exclusivo para o(a) <strong>{childName}</strong> gravado com muito amor pelo <strong>{character.name}</strong>! 🎁✨
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/15 flex items-center justify-center">
                  <img src={character.image} alt="" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                      <Download className="h-5 w-5 text-white" />
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/70 pt-1">
                  <span>video-encantado-{character.id}.mp4 · 1080p</span>
                  <span>Agora · ✓✓</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={generatedVideoUrl || character.videoUrl}
                download={`video-encantado-${childName.toLowerCase()}-${character.id}.mp4`}
                target="_blank"
                rel="noreferrer"
                className="btn-magic w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-slate-950"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Vídeo em Alta Definição</span>
              </a>

              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Ol%C3%A1!%20Acabei%20de%20comprar%20o%20v%C3%ADdeo%20para%20${encodeURIComponent(
                  childName
                )}%20com%20o%20${encodeURIComponent(character.name)}%20(Pedido:%20${orderResult.orderId}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs sm:text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Acompanhar Entrega no WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          /* CHECKOUT SCREEN */
          <div className="p-6 sm:p-7">
            {/* Header summary */}
            <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
              <img
                src={character.image}
                alt={character.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-400/50"
              />
              <div className="flex-1">
                <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wide">
                  Finalizar Pedido
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                  Mensagem de {character.name} para {childName}
                </h3>
                <span className="text-xs text-slate-300">
                  Total:{' '}
                  <strong className="text-amber-300 font-bold text-sm">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </strong>
                </span>
              </div>
            </div>

            {/* ORDER BUMPS / UPSELLS */}
            <div className="mt-4 space-y-2">
              <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Complemente a surpresa (Opcional):
              </span>

              {/* Bump 1: Convite Animado */}
              <label
                className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition ${
                  hasConvite
                    ? 'border-amber-400/80 bg-amber-400/15'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={hasConvite}
                    onChange={(e) => setHasConvite(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-400"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">
                      💌 Convite Digital Animado p/ WhatsApp
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Convite com o tema do {character.name} para mandar aos convidados
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 shrink-0 ml-2">
                  + {formatCurrency(pricing.bumpConvitePrice)}
                </span>
              </label>

              {/* Bump 2: Quadro de Rotina */}
              <label
                className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition ${
                  hasRotina
                    ? 'border-amber-400/80 bg-amber-400/15'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={hasRotina}
                    onChange={(e) => setHasRotina(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-400"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">
                      ⭐ Quadro de Hábitos & Rotina para Imprimir
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tabela ilustrada do herói para incentivar tarefas e obediência
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 shrink-0 ml-2">
                  + {formatCurrency(pricing.bumpRotinaPrice)}
                </span>
              </label>

              {/* Bump 3: VIP Priority */}
              <label
                className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition ${
                  hasVipPriority
                    ? 'border-amber-400/80 bg-amber-400/15'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={hasVipPriority}
                    onChange={(e) => setHasVipPriority(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-400"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">
                      ⚡ Renderização VIP Expressa
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Fura a fila de processamento: entrega em até 3 minutos
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 shrink-0 ml-2">
                  + {formatCurrency(pricing.bumpVipPrice)}
                </span>
              </label>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('pix')}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                  activeTab === 'pix'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>Pix Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                  activeTab === 'card'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Cartão de Crédito</span>
              </button>
            </div>

            {/* Pix Payment Content */}
            {activeTab === 'pix' && (
              <div className="mt-4 space-y-3.5 text-center">
                {/* Mercado Pago Security & Timer Header */}
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[10px] text-sky-300 font-bold">
                    <ShieldCheck className="h-3 w-3 text-sky-400" />
                    <span>Mercado Pago API Oficial</span>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-amber-300">
                    <Clock className="h-3 w-3" />
                    <span>Expira em: {formatTimer(timeLeft)}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="text-[11px] text-slate-300 flex items-center justify-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${pixData?.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>
                    {pixData?.isLive
                      ? 'Cobrança Pix gerada na sua conta Mercado Pago'
                      : 'Modo Teste / Sandbox Mercado Pago (pronto para validar)'}
                  </span>
                </div>

                {/* QR Code Box */}
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-2.5 shadow-xl relative">
                  {isGeneratingPix ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-700">
                      <RefreshCw className="h-6 w-6 animate-spin text-sky-600" />
                      <span className="text-[10px] font-semibold">Gerando Pix Mercado Pago...</span>
                    </div>
                  ) : pixData?.qrCodeBase64 ? (
                    <div className="relative flex h-full w-full flex-col items-center justify-center">
                      <img
                        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                        alt="QR Code Pix Mercado Pago"
                        className="h-36 w-36 object-contain"
                      />
                      <span className="absolute bottom-0 bg-sky-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow">
                        MERCADO PAGO PIX
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center border-4 border-slate-900 rounded-lg bg-white p-1">
                      <QrCode className="h-28 w-28 text-slate-950" />
                      <span className="absolute bottom-1 bg-amber-400 text-slate-950 font-bold text-[8px] px-1.5 py-0.5 rounded">
                        PIX R$ {totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Copy paste button */}
                <div>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/15 py-3 text-xs font-bold text-sky-200 hover:bg-sky-500/25 transition"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>Código Pix Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copiar Código Pix (Copia e Cola Mercado Pago)</span>
                      </>
                    )}
                  </button>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    Abra o app do seu banco, escolha <strong>Pix Copia e Cola</strong> e pague. O vídeo é enviado no WhatsApp automaticamente!
                  </p>
                </div>

                {/* Approval trigger / simulation button */}
                <div className="border-t border-white/10 pt-3">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleCompletePayment}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {isProcessing
                        ? 'Confirmando pagamento e disparando WhatsApp...'
                        : `Confirmar Pagamento (R$ ${totalPrice.toFixed(2).replace('.', ',')})`}
                    </span>
                  </button>
                  <span className="block mt-1 text-[10px] text-slate-400">
                    Após confirmação no Mercado Pago, a mensagem é entregue pela API Oficial do WhatsApp.
                  </span>
                </div>
              </div>
            )}

            {/* Credit Card Content */}
            {activeTab === 'card' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCompletePayment();
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Nome impresso no cartão
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Como no cartão"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Parcelamento
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#120c24] px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="1">1x de R$ {totalPrice.toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="2">2x de R$ {(totalPrice / 2).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="3">3x de R$ {(totalPrice / 3).toFixed(2).replace('.', ',')} sem juros</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-magic mt-3 h-12 w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-950"
                >
                  <Sparkles className="h-4 w-4 fill-slate-950" />
                  <span>{isProcessing ? 'Processando...' : `Pagar R$ ${totalPrice.toFixed(2).replace('.', ',')} e Liberar`}</span>
                </button>
              </form>
            )}

            {/* Prominent Site Seguro & Verificado Badge in Checkout */}
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-center gap-2 text-center text-[11px] text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-bold">Site Seguro e Verificado</span>
              <span className="text-emerald-500/50">·</span>
              <span className="text-slate-300">Criptografia SSL 256-Bit</span>
              <span className="text-emerald-500/50">·</span>
              <span className="text-slate-300">Garantia 7 Dias</span>
            </div>

            <div className="mt-2 text-center text-[10px] text-slate-400">
              Ao prosseguir, você concorda com os{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="underline text-amber-400 hover:text-amber-300"
              >
                Termos de Uso e Envio via WhatsApp Oficial
              </button>.
            </div>
          </div>
        )}
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};
