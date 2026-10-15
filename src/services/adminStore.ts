import { LeadItem, SystemPricingConfig, OrderData, Character } from '../types';

export const DEFAULT_PRICING: SystemPricingConfig = {
  singleVideoPrice: 47.99,
  singleVideoOriginalPrice: 79.90,
  singleVideoInstallments: 3,
  comboVideoPrice: 79.90,
  comboVideoOriginalPrice: 159.80,
  comboVideoInstallments: 3,
  bumpConvitePrice: 14.90,
  bumpRotinaPrice: 9.90,
  bumpVipPrice: 4.90
};

const STORAGE_KEYS = {
  PRICING: 'studio_encantado_pricing',
  LEADS: 'studio_encantado_leads',
  CURRENT_LEAD_ID: 'studio_encantado_curr_lead_id',
  ADMIN_AUTH: 'studio_encantado_admin_auth'
};

export const formatCurrency = (val: number): string => {
  if (typeof val !== 'number' || isNaN(val)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
};

export const formatInstallment = (total: number, count: number): string => {
  if (!count || count <= 0) count = 1;
  const installmentValue = total / count;
  return `${count}x de ${formatCurrency(installmentValue)}`;
};

const INITIAL_MOCK_LEADS: LeadItem[] = [
  {
    id: 'lead-101',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    childName: 'Pedro Henrique',
    characterId: 'homem_aranha',
    characterName: 'Homem-Aranha',
    characterImage: 'https://www.recadinhomagico.com.br/videos/homem_aranha/homem_aranha_festa.jpg',
    parentEmail: 'mariana.silva@gmail.com',
    parentWhatsApp: '(11) 98765-4321',
    status: 'comprou',
    orderId: 'RMG-839201',
    amountPaid: 62.89,
    paymentMethod: 'pix',
    bumps: { convite: true, rotina: false, vipPriority: false },
    notes: 'Cliente muito animado para o aniversário de 5 anos.'
  },
  {
    id: 'lead-102',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 mins ago
    childName: 'Sophia',
    characterId: 'elsa',
    characterName: 'Elsa (Frozen)',
    characterImage: 'https://www.recadinhomagico.com.br/characters/elsa.webp',
    parentEmail: 'patricia.mendes@outlook.com',
    parentWhatsApp: '(21) 99876-1234',
    status: 'abandono_checkout',
    bumps: { convite: false, rotina: false, vipPriority: true },
    notes: 'Parou na tela de pagamento Pix. Enviar mensagem de recuperação com cupom 10%.'
  },
  {
    id: 'lead-103',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    childName: 'Lorenzo',
    characterId: 'patrulha_canina',
    characterName: 'Patrulha Canina',
    characterImage: 'https://www.recadinhomagico.com.br/videos/patrulha_canina/patrulha_canina_festa.jpg',
    parentEmail: 'carlos.alberto@yahoo.com.br',
    parentWhatsApp: '(31) 99123-5566',
    status: 'comprou',
    orderId: 'RMG-492018',
    amountPaid: 47.99,
    paymentMethod: 'credit_card',
    bumps: { convite: false, rotina: false, vipPriority: false }
  },
  {
    id: 'lead-104',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    childName: 'Helena',
    characterId: 'barbie',
    characterName: 'Barbie',
    characterImage: 'https://www.recadinhomagico.com.br/characters/barbie.webp',
    status: 'video_gerado',
    notes: 'Gerou o vídeo e assistiu 2 vezes, mas não preencheu o formulário de oferta.'
  },
  {
    id: 'lead-105',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    childName: 'Davi',
    characterId: 'batman',
    characterName: 'Batman',
    characterImage: 'https://www.recadinhomagico.com.br/videos/batman/batman_festa.jpg',
    parentEmail: 'rodrigo.tech@gmail.com',
    parentWhatsApp: '(41) 98844-3322',
    status: 'abandono_checkout',
    notes: 'Preencheu dados, tentou parcelar no cartão.'
  },
  {
    id: 'lead-106',
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    childName: 'Alice',
    characterId: 'moana',
    characterName: 'Moana',
    characterImage: 'https://www.recadinhomagico.com.br/videos/moana/moana_festa.jpg',
    parentEmail: 'fernanda.costa@hotmail.com',
    parentWhatsApp: '(19) 97123-8899',
    status: 'comprou',
    orderId: 'RMG-710492',
    amountPaid: 72.79,
    paymentMethod: 'pix',
    bumps: { convite: true, rotina: true, vipPriority: false }
  }
];

// --- Pricing Methods ---
export const getStoredPricing = (): SystemPricingConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PRICING, ...parsed };
    }
  } catch (err) {
    console.warn('Erro ao carregar preços do localStorage:', err);
  }
  return DEFAULT_PRICING;
};

export const saveStoredPricing = (pricing: SystemPricingConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
    window.dispatchEvent(new CustomEvent('studio_pricing_updated', { detail: pricing }));
  } catch (err) {
    console.error('Erro ao salvar preços no localStorage:', err);
  }
};

export const resetStoredPricing = (): SystemPricingConfig => {
  saveStoredPricing(DEFAULT_PRICING);
  return DEFAULT_PRICING;
};

// --- Leads Methods ---
export const getStoredLeads = (): LeadItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar leads do localStorage:', err);
  }

  // Seed initial mock leads if empty
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_MOCK_LEADS));
  } catch {}
  return INITIAL_MOCK_LEADS;
};

export const saveStoredLeads = (leads: LeadItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('studio_leads_updated', { detail: leads }));
  } catch (err) {
    console.error('Erro ao salvar leads no localStorage:', err);
  }
};

export const recordLeadVideoGenerated = (
  childName: string,
  character: Character,
  extra?: { videoUrl?: string; n8nStatus?: 'pending' | 'success' | 'failed' | 'mock'; parentWhatsApp?: string }
): string => {
  const leads = getStoredLeads();
  const leadId = `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newLead: LeadItem = {
    id: leadId,
    createdAt: new Date().toISOString(),
    childName: childName.trim(),
    characterId: character.id,
    characterName: character.name,
    characterImage: character.image,
    parentWhatsApp: extra?.parentWhatsApp || undefined,
    status: 'video_gerado',
    generatedVideoUrl: extra?.videoUrl || character.videoUrl,
    n8nVideoStatus: extra?.n8nStatus || 'mock'
  };

  leads.unshift(newLead);
  saveStoredLeads(leads);

  try {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_LEAD_ID, leadId);
  } catch {}

  return leadId;
};

export const recordLeadCheckoutAttempt = (
  leadId: string | null,
  data: {
    childName: string;
    character: Character;
    parentEmail: string;
    parentWhatsApp: string;
    birthYear?: string;
  }
): string => {
  const leads = getStoredLeads();
  let candidateId: string | null = leadId;

  if (!candidateId) {
    try {
      candidateId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_LEAD_ID);
    } catch {}
  }

  let finalId: string;
  const existingIndex = candidateId ? leads.findIndex((l) => l.id === candidateId) : -1;

  if (existingIndex >= 0 && candidateId) {
    finalId = candidateId;
    leads[existingIndex] = {
      ...leads[existingIndex],
      parentEmail: data.parentEmail,
      parentWhatsApp: data.parentWhatsApp,
      birthYear: data.birthYear,
      status: leads[existingIndex].status === 'comprou' ? 'comprou' : 'abandono_checkout'
    };
  } else {
    finalId = candidateId || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newLead: LeadItem = {
      id: finalId,
      createdAt: new Date().toISOString(),
      childName: data.childName.trim(),
      characterId: data.character.id,
      characterName: data.character.name,
      characterImage: data.character.image,
      parentEmail: data.parentEmail,
      parentWhatsApp: data.parentWhatsApp,
      birthYear: data.birthYear,
      status: 'abandono_checkout'
    };
    leads.unshift(newLead);
  }

  saveStoredLeads(leads);
  try {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_LEAD_ID, finalId);
  } catch {}

  return finalId;
};

export const recordLeadPurchase = (
  leadId: string | null,
  order: OrderData,
  n8nWhatsappStatus?: 'pending' | 'sent' | 'failed' | 'mock'
): void => {
  const leads = getStoredLeads();
  let currentId = leadId;

  if (!currentId) {
    try {
      currentId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_LEAD_ID);
    } catch {}
  }

  const existingIndex = currentId ? leads.findIndex((l) => l.id === currentId) : -1;

  if (existingIndex >= 0) {
    leads[existingIndex] = {
      ...leads[existingIndex],
      status: 'comprou',
      orderId: order.orderId,
      amountPaid: order.price,
      paymentMethod: order.paymentMethod,
      parentEmail: order.parentEmail || leads[existingIndex].parentEmail,
      parentWhatsApp: order.parentWhatsApp || leads[existingIndex].parentWhatsApp,
      bumps: order.bumps,
      n8nWhatsappStatus: n8nWhatsappStatus || 'sent'
    };
  } else {
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      createdAt: order.createdAt || new Date().toISOString(),
      childName: order.childName,
      characterId: order.character.id,
      characterName: order.character.name,
      characterImage: order.character.image,
      parentEmail: order.parentEmail,
      parentWhatsApp: order.parentWhatsApp,
      status: 'comprou',
      orderId: order.orderId,
      amountPaid: order.price,
      paymentMethod: order.paymentMethod,
      bumps: order.bumps,
      n8nWhatsappStatus: n8nWhatsappStatus || 'sent'
    };
    leads.unshift(newLead);
  }

  saveStoredLeads(leads);
};

export const updateLeadItem = (leadId: string, partial: Partial<LeadItem>): void => {
  const leads = getStoredLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], ...partial };
    saveStoredLeads(leads);
  }
};

export const deleteLeadItem = (leadId: string): void => {
  const leads = getStoredLeads().filter((l) => l.id !== leadId);
  saveStoredLeads(leads);
};

export const exportLeadsToCSV = (leads: LeadItem[]): void => {
  const headers = [
    'ID',
    'Data Criacao',
    'Nome da Crianca',
    'Personagem',
    'Status',
    'WhatsApp',
    'Email',
    'Pedido ID',
    'Valor Pago',
    'Forma Pagamento',
    'Convite',
    'Rotina',
    'VIP Prioritario',
    'Observacoes'
  ];

  const rows = leads.map((l) => [
    l.id,
    new Date(l.createdAt).toLocaleString('pt-BR'),
    `"${l.childName.replace(/"/g, '""')}"`,
    `"${l.characterName.replace(/"/g, '""')}"`,
    l.status === 'comprou' ? 'Comprou' : l.status === 'abandono_checkout' ? 'Abandono de Checkout' : 'Video Gerado (Sem contato)',
    `"${(l.parentWhatsApp || '').replace(/"/g, '""')}"`,
    `"${(l.parentEmail || '').replace(/"/g, '""')}"`,
    l.orderId || '',
    l.amountPaid ? l.amountPaid.toFixed(2) : '',
    l.paymentMethod || '',
    l.bumps?.convite ? 'Sim' : 'Nao',
    l.bumps?.rotina ? 'Sim' : 'Nao',
    l.bumps?.vipPriority ? 'Sim' : 'Nao',
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_studio_encantado_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
