export type CharacterCategory = 'todos' | 'herois' | 'princesas' | 'aventura' | 'biblicos';
export type CharacterGender = 'boy' | 'girl' | 'neutral';
export type MessageOccasion = 'aniversario' | 'elogio' | 'conquista';

export interface OccasionVideos {
  aniversario?: string; // Vídeo de Festa / Aniversário (ex: 01_hulk_festa.mp4)
  elogio?: string;      // Vídeo de Elogio / Bons Hábitos (ex: 02_hulk_elogio.mp4)
  conquista?: string;   // Vídeo de Virtudes / Coragem / Conquistas (ex: 03_hulk_virtudes.mp4)
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  image: string;
  videoUrl: string; // Vídeo base padrão / principal
  fallbackVideoUrl?: string;
  occasionVideos?: OccasionVideos; // Vídeos por estilo/ocasião
  color: string;
  gender: CharacterGender;
  category: 'herois' | 'princesas' | 'aventura' | 'biblicos';
  badge: string;
  samplePhrase: string;
  description: string;
  // Timing & Automation fields for video assembly and ElevenLabs
  customSlotStart?: number; // Início do silêncio / nome da criança em segundos (ex: 0.0)
  customSlotEnd?: number;   // Fim do silêncio / nome da criança em segundos (ex: 2.8)
  voiceSampleStart?: number; // Início da fala para o ElevenLabs aprender (ex: 3.0)
  voiceSampleEnd?: number;   // Fim da fala para o ElevenLabs aprender (ex: 20.0)
  elevenLabsVoiceId?: string; // Voice ID único retornado pelo ElevenLabs
  vpsVideoPath?: string;     // Caminho ou URL de hospedagem na VPS
  isCustomUploaded?: boolean; // Criado dinamicamente pelo admin
}

/**
 * Retorna a URL do vídeo apropriada para a ocasião selecionada
 */
export function getCharacterVideoForOccasion(character: Character, occasion?: MessageOccasion): string {
  if (occasion && character.occasionVideos) {
    const specificUrl = character.occasionVideos[occasion];
    if (specificUrl && specificUrl.trim().length > 0) {
      return specificUrl;
    }
  }
  return character.videoUrl;
}

export type PromoFlowStep = 
  | 'escolha'
  | 'nome'
  | 'gerando'
  | 'pronto'
  | 'assistindo'
  | 'oferta'
  | 'sucesso';

export interface OrderData {
  orderId: string;
  childName: string;
  character: Character;
  occasion: MessageOccasion;
  parentEmail: string;
  parentWhatsApp: string;
  birthYear: string;
  plan: '1-video' | '2-videos';
  price: number;
  paymentMethod: 'pix' | 'credit_card';
  createdAt: string;
  status: 'pending' | 'paid';
  bumps?: {
    convite?: boolean;
    rotina?: boolean;
    vipPriority?: boolean;
  };
}

export interface VideoReaction {
  id: string;
  label: string;
  youtubeId: string;
  childName?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  hasTutorial?: boolean;
}

export interface PricingPlan {
  id: '1-video' | '2-videos';
  name: string;
  subtitle: string;
  videos: number;
  originalPrice: string;
  cashPrice: string;
  installment: string;
  highlighted: boolean;
  features: string[];
}

export type LeadStatus = 'video_gerado' | 'abandono_checkout' | 'comprou';

export interface LeadItem {
  id: string;
  createdAt: string;
  childName: string;
  characterId: string;
  characterName: string;
  characterImage?: string;
  parentEmail?: string;
  parentWhatsApp?: string;
  birthYear?: string;
  status: LeadStatus;
  orderId?: string;
  amountPaid?: number;
  paymentMethod?: 'pix' | 'credit_card';
  bumps?: {
    convite?: boolean;
    rotina?: boolean;
    vipPriority?: boolean;
  };
  notes?: string;
  generatedVideoUrl?: string;
  n8nVideoStatus?: 'pending' | 'success' | 'failed' | 'mock';
  n8nWhatsappStatus?: 'pending' | 'sent' | 'failed' | 'mock';
}

export interface SystemPricingConfig {
  singleVideoPrice: number;
  singleVideoOriginalPrice: number;
  singleVideoInstallments: number;
  comboVideoPrice: number;
  comboVideoOriginalPrice: number;
  comboVideoInstallments: number;
  bumpConvitePrice: number;
  bumpRotinaPrice: number;
  bumpVipPrice: number;
}

export interface N8NConfig {
  videoWebhookUrl: string;
  whatsappWebhookUrl: string;
  apiKey?: string;
  isEnabled: boolean;
  mode: 'live' | 'mock';
  timeoutSeconds: number;
}

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
  mode: 'sandbox' | 'production';
  webhookSecret?: string;
  statementDescriptor?: string;
}

export interface WhatsAppCoexistenceConfig {
  phoneNumberId: string;
  wabaId: string;
  metaAccessToken: string;
  templateName: string;
  language: string;
  coexistenceActive: boolean;
  notes?: string;
}

export interface N8NLogEntry {
  id: string;
  timestamp: string;
  event: 'generate_video' | 'send_whatsapp' | 'mercadopago_payment';
  status: 'success' | 'error' | 'simulated';
  httpStatus?: number;
  durationMs: number;
  summary: string;
  payload: Record<string, unknown>;
  response?: Record<string, unknown> | string;
  error?: string;
}

