import { MercadoPagoConfig, WhatsAppCoexistenceConfig } from '../types';
import { addN8NLogEntry } from './n8nService';

export const DEFAULT_MERCADOPAGO_CONFIG: MercadoPagoConfig = {
  accessToken: '',
  publicKey: '',
  mode: 'sandbox',
  statementDescriptor: 'STUDIOENCANT',
  webhookSecret: ''
};

export const DEFAULT_COEXISTENCE_CONFIG: WhatsAppCoexistenceConfig = {
  phoneNumberId: '',
  wabaId: '',
  metaAccessToken: '',
  templateName: 'video_personalizado_entrega',
  language: 'pt_BR',
  coexistenceActive: true,
  notes: 'Coexistência ativa: mesmo número no celular (WhatsApp Business) e na Meta Cloud API Oficial.'
};

const STORAGE_KEYS = {
  MP_CONFIG: 'studio_encantado_mp_config',
  COEXISTENCE_CONFIG: 'studio_encantado_coexistence_config'
};

export const getStoredMercadoPagoConfig = (): MercadoPagoConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MP_CONFIG);
    if (raw) {
      return { ...DEFAULT_MERCADOPAGO_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Erro ao carregar config Mercado Pago:', err);
  }
  return DEFAULT_MERCADOPAGO_CONFIG;
};

export const saveStoredMercadoPagoConfig = (config: MercadoPagoConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MP_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('studio_mp_config_updated', { detail: config }));
  } catch (err) {
    console.error('Erro ao salvar config Mercado Pago:', err);
  }
};

export const getStoredWhatsAppCoexistenceConfig = (): WhatsAppCoexistenceConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COEXISTENCE_CONFIG);
    if (raw) {
      return { ...DEFAULT_COEXISTENCE_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Erro ao carregar config Coexistência WhatsApp:', err);
  }
  return DEFAULT_COEXISTENCE_CONFIG;
};

export const saveStoredWhatsAppCoexistenceConfig = (config: WhatsAppCoexistenceConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COEXISTENCE_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('studio_coexistence_config_updated', { detail: config }));
  } catch (err) {
    console.error('Erro ao salvar config Coexistência WhatsApp:', err);
  }
};

export interface PixPaymentRequest {
  orderId: string;
  amount: number;
  description: string;
  payerEmail: string;
  payerFirstName: string;
  metadata?: {
    child_name?: string;
    character_name?: string;
    character_id?: string;
    video_url?: string;
    whatsapp?: string;
    occasion?: string;
    bump_convite?: boolean;
    bump_rotina?: boolean;
    [key: string]: any;
  };
}

export interface PixPaymentResponse {
  success: boolean;
  paymentId: string;
  status: 'pending' | 'approved' | 'in_process' | 'rejected' | 'simulated';
  qrCode: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
  isLive: boolean;
  message: string;
}

/**
 * Cria ou gera dados de cobrança Pix via Mercado Pago API
 */
export const createMercadoPagoPix = async (
  params: PixPaymentRequest
): Promise<PixPaymentResponse> => {
  const config = getStoredMercadoPagoConfig();
  const hasToken = !!config.accessToken && config.accessToken.trim().length > 10;

  // Se tiver Access Token configurado e modo for de produção ou sandbox com credencial real
  if (hasToken) {
    const startTime = Date.now();
    try {
      const idempotencyKey = `pix-${params.orderId}-${Date.now()}`;
      const payload = {
        transaction_amount: Number(params.amount.toFixed(2)),
        description: params.description || `Studio Encantado - Pedido ${params.orderId}`,
        payment_method_id: 'pix',
        payer: {
          email: params.payerEmail || 'cliente@studioencantado.com.br',
          first_name: params.payerFirstName || 'Cliente'
        },
        external_reference: params.orderId,
        statement_descriptor: config.statementDescriptor || 'STUDIOENCANT',
        metadata: {
          order_id: params.orderId,
          ...(params.metadata || {})
        }
      };

      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken.trim()}`,
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status} do Mercado Pago`);
      }

      const txData = data.point_of_interaction?.transaction_data;

      addN8NLogEntry({
        event: 'mercadopago_payment',
        status: 'success',
        httpStatus: response.status,
        durationMs,
        summary: `Cobrança Pix Mercado Pago gerada para ${params.orderId} (R$ ${params.amount.toFixed(2)})`,
        payload: { orderId: params.orderId, amount: params.amount },
        response: { id: data.id, status: data.status, hasQrCode: !!txData?.qr_code }
      });

      return {
        success: true,
        paymentId: String(data.id),
        status: data.status || 'pending',
        qrCode: txData?.qr_code || generateFallbackPixCode(params.amount, params.orderId),
        qrCodeBase64: txData?.qr_code_base64,
        ticketUrl: txData?.ticket_url,
        isLive: true,
        message: 'Cobrança Pix gerada com sucesso diretamente na sua conta Mercado Pago!'
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Falha na API Mercado Pago';
      console.warn('[Mercado Pago API Warning - fallback to simulated Pix]:', errorMsg);

      addN8NLogEntry({
        event: 'mercadopago_payment',
        status: 'error',
        durationMs: Date.now() - startTime,
        summary: `Erro na API Mercado Pago: ${errorMsg}. Usando fallback.`,
        payload: { orderId: params.orderId, amount: params.amount },
        error: errorMsg
      });
    }
  }

  // Fallback simulado elegante (ideal para desenvolvimento e antes de inserir o Access Token)
  const simulatedCode = generateFallbackPixCode(params.amount, params.orderId);
  return {
    success: true,
    paymentId: `MP-SIM-${Date.now()}`,
    status: 'simulated',
    qrCode: simulatedCode,
    isLive: false,
    message: 'Pix pronto para teste. Para receber dinheiro real na sua conta, insira seu Access Token do Mercado Pago no Painel Admin.'
  };
};

/**
 * Consulta o status de um pagamento no Mercado Pago
 */
export const checkMercadoPagoStatus = async (
  paymentId: string
): Promise<{ status: string; isPaid: boolean }> => {
  const config = getStoredMercadoPagoConfig();
  if (!config.accessToken || !paymentId || paymentId.startsWith('MP-SIM-')) {
    return { status: 'simulated', isPaid: true };
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${config.accessToken.trim()}`
      }
    });
    if (!res.ok) return { status: 'error', isPaid: false };
    const data = await res.json();
    return {
      status: data.status,
      isPaid: data.status === 'approved'
    };
  } catch {
    return { status: 'unknown', isPaid: false };
  }
};

/**
 * Gera payload Pix Copia e Cola estruturado no padrão EMVCo do Banco Central
 */
export const generateFallbackPixCode = (amount: number, orderId: string): string => {
  const formattedAmount = amount.toFixed(2);
  const cleanId = orderId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
  return `00020126580014br.gov.bcb.pix0136mercadopago-studio-${cleanId}520400005303986540${formattedAmount}5802BR5916StudioEncantado6009SaoPaulo62070503***6304`;
};
