import { N8NConfig, N8NLogEntry, Character, MessageOccasion, OrderData, getCharacterVideoForOccasion } from '../types';

export const DEFAULT_N8N_CONFIG: N8NConfig = {
  videoWebhookUrl: 'https://seu-n8n.com/webhook/gerar-video',
  whatsappWebhookUrl: 'https://seu-n8n.com/webhook/enviar-whatsapp',
  apiKey: '',
  isEnabled: true,
  mode: 'live',
  timeoutSeconds: 20
};

const STORAGE_KEYS = {
  N8N_CONFIG: 'studio_encantado_n8n_config',
  N8N_LOGS: 'studio_encantado_n8n_logs'
};

export const getStoredN8NConfig = (): N8NConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.N8N_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_N8N_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Erro ao carregar configurações do n8n:', err);
  }
  return DEFAULT_N8N_CONFIG;
};

export const saveStoredN8NConfig = (config: N8NConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.N8N_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('studio_n8n_config_updated', { detail: config }));
  } catch (err) {
    console.error('Erro ao salvar configurações do n8n:', err);
  }
};

export const getStoredN8NLogs = (): N8NLogEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.N8N_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Erro ao carregar logs do n8n:', err);
  }
  return [];
};

export const saveStoredN8NLogs = (logs: N8NLogEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.N8N_LOGS, JSON.stringify(logs.slice(0, 50)));
    window.dispatchEvent(new CustomEvent('studio_n8n_logs_updated', { detail: logs }));
  } catch (err) {
    console.error('Erro ao salvar logs do n8n:', err);
  }
};

export const clearStoredN8NLogs = (): void => {
  saveStoredN8NLogs([]);
};

export const addN8NLogEntry = (entry: Omit<N8NLogEntry, 'id' | 'timestamp'>): N8NLogEntry => {
  const currentLogs = getStoredN8NLogs();
  const fullEntry: N8NLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString()
  };
  currentLogs.unshift(fullEntry);
  saveStoredN8NLogs(currentLogs);
  return fullEntry;
};

export interface N8NVideoGenerationResult {
  success: boolean;
  videoUrl: string;
  source: 'n8n_live' | 'n8n_mock' | 'fallback';
  message?: string;
  error?: string;
  durationMs: number;
}

/**
 * Envia pedido de criação de vídeo para o Webhook do n8n
 */
export async function generateVideoWithN8N(params: {
  childName: string;
  character: Character;
  occasion?: MessageOccasion;
  customerPhone?: string;
  leadId?: string;
}): Promise<N8NVideoGenerationResult> {
  const config = getStoredN8NConfig();
  const startTime = performance.now();

  const cleanPhone = (params.customerPhone || '').replace(/\D/g, '');
  const formattedPhone = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';

  // Selecionar o vídeo base específico do estilo/ocasião (ex: festa, elogio ou conquista)
  const selectedVideoUrl = getCharacterVideoForOccasion(params.character, params.occasion);

  // Gerar nome amigável do arquivo ex: video-homem-aranha-miguel-henrique-01.mp4
  const slug = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const uniqueSuffix = Math.floor(100 + Math.random() * 900);
  const suggestedFileName = `video-${slug(params.character.name)}-${slug(params.childName)}-${uniqueSuffix}.mp4`;

  const payload = {
    event: 'generate_video',
    leadId: params.leadId || `lead-${Date.now()}`,
    childName: params.childName.trim(),
    customerPhone: formattedPhone,
    customerPhoneRaw: params.customerPhone || '',
    characterId: params.character.id,
    characterName: params.character.name,
    elevenLabsVoiceId: params.character.elevenLabsVoiceId || '',
    videoBaseUrl: selectedVideoUrl,
    occasionVideos: params.character.occasionVideos || {},
    customSlotStart: params.character.customSlotStart ?? 0.0,
    customSlotEnd: params.character.customSlotEnd ?? 2.8,
    phraseToGenerate: `Olá ${params.childName.trim()}!`,
    suggestedFileName,
    retentionHours: 24,
    occasion: params.occasion || 'elogio',
    requestedAt: new Date().toISOString(),
    source: 'studio_encantado_web_flow'
  };

  // Se modo for mock ou URL for exemplo fictício
  const isPlaceholderUrl =
    !config.videoWebhookUrl ||
    config.videoWebhookUrl.includes('seu-n8n.com') ||
    config.mode === 'mock';

  if (!config.isEnabled || isPlaceholderUrl) {
    const durationMs = Math.round(performance.now() - startTime);
    addN8NLogEntry({
      event: 'generate_video',
      status: 'simulated',
      durationMs: durationMs || 120,
      summary: `Vídeo gerado via n8n (Modo Simulação) para ${params.childName} (${params.character.name} - ${params.occasion || 'elogio'})`,
      payload,
      response: {
        success: true,
        videoUrl: selectedVideoUrl,
        mode: 'simulated',
        note: isPlaceholderUrl
          ? 'URL do n8n ainda é placeholder. Configure a URL real do seu webhook no Painel Admin.'
          : 'Modo Simulado ativo'
      }
    });

    return {
      success: true,
      videoUrl: selectedVideoUrl,
      source: 'n8n_mock',
      message: 'Vídeo processado pelo fluxo simulado do n8n',
      durationMs: durationMs || 120
    };
  }

  // Modo Live: disparar POST real para o Webhook do n8n
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), (config.timeoutSeconds || 20) * 1000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    if (config.apiKey && config.apiKey.trim()) {
      headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
      headers['X-API-Key'] = config.apiKey.trim();
    }

    const response = await fetch(config.videoWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);

    let responseData: any = null;
    const textResponse = await response.text();
    try {
      responseData = JSON.parse(textResponse);
    } catch {
      responseData = { raw: textResponse };
    }

    if (!response.ok) {
      throw new Error(`n8n retornou HTTP ${response.status}: ${textResponse.slice(0, 150)}`);
    }

    // Tentar extrair a URL do vídeo retornada pelo n8n
    const returnedVideoUrl =
      responseData?.videoUrl ||
      responseData?.url ||
      responseData?.video_url ||
      responseData?.data?.videoUrl ||
      responseData?.data?.url ||
      params.character.videoUrl;

    addN8NLogEntry({
      event: 'generate_video',
      status: 'success',
      httpStatus: response.status,
      durationMs,
      summary: `Vídeo gerado com sucesso via n8n para ${params.childName}`,
      payload,
      response: responseData
    });

    return {
      success: true,
      videoUrl: returnedVideoUrl,
      source: 'n8n_live',
      message: responseData?.message || 'Vídeo criado com sucesso pelo n8n',
      durationMs
    };
  } catch (error: any) {
    const durationMs = Math.round(performance.now() - startTime);
    const isAbort = error.name === 'AbortError';
    const errorMsg = isAbort
      ? `Timeout após ${config.timeoutSeconds}s aguardando n8n`
      : error.message || 'Falha ao conectar com n8n';

    console.warn('[n8n Video Generation Error, using graceful fallback]:', errorMsg);

    addN8NLogEntry({
      event: 'generate_video',
      status: 'error',
      durationMs,
      summary: `Erro ao gerar vídeo no n8n para ${params.childName}: ${errorMsg}`,
      payload,
      error: errorMsg
    });

    // Fallback gracioso para nunca travar a experiência do usuário
    return {
      success: false,
      videoUrl: params.character.videoUrl,
      source: 'fallback',
      error: errorMsg,
      message: 'Vídeo entregue usando fallback padrão de segurança',
      durationMs
    };
  }
}

export interface N8NWhatsAppDeliveryResult {
  success: boolean;
  httpStatus?: number;
  source: 'n8n_live' | 'n8n_mock' | 'error';
  message: string;
  error?: string;
  durationMs: number;
}

/**
 * Dispara o Webhook do n8n para enviar o vídeo via API Oficial do WhatsApp após pagamento
 */
export async function sendWhatsAppWithN8N(params: {
  order: OrderData;
  videoUrl?: string;
}): Promise<N8NWhatsAppDeliveryResult> {
  const config = getStoredN8NConfig();
  const startTime = performance.now();

  const cleanPhone = (params.order.parentWhatsApp || '').replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const payload = {
    event: 'send_whatsapp_video',
    orderId: params.order.orderId,
    childName: params.order.childName,
    characterId: params.order.character.id,
    characterName: params.order.character.name,
    occasion: params.order.occasion,
    parentWhatsApp: formattedPhone,
    parentWhatsAppRaw: params.order.parentWhatsApp,
    parentEmail: params.order.parentEmail,
    videoUrl: params.videoUrl || params.order.character.videoUrl,
    plan: params.order.plan,
    price: params.order.price,
    paymentMethod: params.order.paymentMethod,
    bumps: params.order.bumps,
    createdAt: params.order.createdAt,
    messageTemplate: `Olá! Aqui está o vídeo mágico exclusivo para ${params.order.childName} gravado com muito amor pelo ${params.order.character.name}! 🎁✨`
  };

  const isPlaceholderUrl =
    !config.whatsappWebhookUrl ||
    config.whatsappWebhookUrl.includes('seu-n8n.com') ||
    config.mode === 'mock';

  if (!config.isEnabled || isPlaceholderUrl) {
    const durationMs = Math.round(performance.now() - startTime);
    addN8NLogEntry({
      event: 'send_whatsapp',
      status: 'simulated',
      durationMs: durationMs || 100,
      summary: `Disparo WhatsApp via n8n (Simulado) para ${params.order.parentWhatsApp} (Pedido ${params.order.orderId})`,
      payload,
      response: {
        success: true,
        whatsappDelivered: true,
        mode: 'simulated',
        note: isPlaceholderUrl
          ? 'URL do webhook do WhatsApp ainda é placeholder no n8n. Para envio real, preencha o webhook no Painel Admin.'
          : 'Modo Simulado ativo'
      }
    });

    return {
      success: true,
      source: 'n8n_mock',
      message: 'Disparo no WhatsApp agendado com sucesso pelo workflow n8n (Simulado)',
      durationMs: durationMs || 100
    };
  }

  // Modo Live: disparar POST real para o Webhook de WhatsApp do n8n
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), (config.timeoutSeconds || 20) * 1000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    if (config.apiKey && config.apiKey.trim()) {
      headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
      headers['X-API-Key'] = config.apiKey.trim();
    }

    const response = await fetch(config.whatsappWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);

    let responseData: any = null;
    const textResponse = await response.text();
    try {
      responseData = JSON.parse(textResponse);
    } catch {
      responseData = { raw: textResponse };
    }

    if (!response.ok) {
      throw new Error(`n8n retornou HTTP ${response.status}: ${textResponse.slice(0, 150)}`);
    }

    addN8NLogEntry({
      event: 'send_whatsapp',
      status: 'success',
      httpStatus: response.status,
      durationMs,
      summary: `Disparo WhatsApp via n8n realizado com sucesso para ${params.order.parentWhatsApp}`,
      payload,
      response: responseData
    });

    return {
      success: true,
      httpStatus: response.status,
      source: 'n8n_live',
      message: responseData?.message || 'Mensagem e vídeo enviados para o WhatsApp via n8n com sucesso!',
      durationMs
    };
  } catch (error: any) {
    const durationMs = Math.round(performance.now() - startTime);
    const isAbort = error.name === 'AbortError';
    const errorMsg = isAbort
      ? `Timeout após ${config.timeoutSeconds}s aguardando n8n`
      : error.message || 'Falha ao conectar com webhook n8n do WhatsApp';

    console.warn('[n8n WhatsApp Delivery Error]:', errorMsg);

    addN8NLogEntry({
      event: 'send_whatsapp',
      status: 'error',
      durationMs,
      summary: `Falha no envio WhatsApp via n8n para ${params.order.parentWhatsApp}: ${errorMsg}`,
      payload,
      error: errorMsg
    });

    return {
      success: false,
      source: 'error',
      error: errorMsg,
      message: `Erro na comunicação com o n8n: ${errorMsg}`,
      durationMs
    };
  }
}

/**
 * Testador de Webhook individual para o Painel Admin
 */
export async function testN8NWebhookDirect(
  type: 'video' | 'whatsapp',
  customUrl?: string,
  apiKey?: string
): Promise<{ success: boolean; httpStatus?: number; message: string; data?: any; error?: string }> {
  const config = getStoredN8NConfig();
  const targetUrl = customUrl || (type === 'video' ? config.videoWebhookUrl : config.whatsappWebhookUrl);
  const token = apiKey !== undefined ? apiKey : config.apiKey;

  if (!targetUrl || targetUrl.includes('seu-n8n.com')) {
    return {
      success: false,
      message: 'URL inválida ou ainda com placeholder padrão. Insira uma URL real do seu n8n para testar.'
    };
  }

  const testPayload =
    type === 'video'
      ? {
          event: 'test_video_webhook',
          childName: 'Gabriel (Teste)',
          characterId: 'homem_aranha',
          characterName: 'Homem-Aranha',
          occasion: 'aniversario',
          timestamp: new Date().toISOString()
        }
      : {
          event: 'test_whatsapp_webhook',
          orderId: 'TEST-999999',
          childName: 'Gabriel (Teste)',
          characterName: 'Homem-Aranha',
          parentWhatsApp: '5511999998888',
          videoUrl: 'https://www.recadinhomagico.com.br/videos/homem_aranha/homem_aranha_festa.mp4',
          price: 47.99,
          timestamp: new Date().toISOString()
        };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (token && token.trim()) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload)
    });

    const text = await response.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    if (!response.ok) {
      return {
        success: false,
        httpStatus: response.status,
        message: `HTTP ${response.status}: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`,
        data: parsed
      };
    }

    return {
      success: true,
      httpStatus: response.status,
      message: `Conexão bem-sucedida! HTTP ${response.status}`,
      data: parsed
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Falha de rede/CORS ao tentar alcançar a URL.',
      error: String(err)
    };
  }
}
