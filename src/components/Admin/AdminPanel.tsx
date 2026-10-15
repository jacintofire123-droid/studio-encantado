import React, { useState, useEffect, useMemo } from 'react';
import {
  LeadItem,
  SystemPricingConfig,
  LeadStatus,
  N8NConfig,
  N8NLogEntry
} from '../../types';
import {
  getStoredLeads,
  getStoredPricing,
  saveStoredPricing,
  saveStoredLeads,
  resetStoredPricing,
  updateLeadItem,
  deleteLeadItem,
  exportLeadsToCSV,
  formatCurrency,
  formatInstallment
} from '../../services/adminStore';
import {
  getStoredN8NConfig,
  saveStoredN8NConfig,
  getStoredN8NLogs,
  clearStoredN8NLogs,
  testN8NWebhookDirect,
  DEFAULT_N8N_CONFIG
} from '../../services/n8nService';
import {
  LayoutDashboard,
  Users,
  Film,
  Zap,
  CreditCard,
  MessageCircle,
  Tag,
  Database,
  ArrowLeft,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Unlock,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Activity,
  Sliders,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { MercadoPagoTab } from './MercadoPagoTab';
import { WhatsAppCoexistenceSection } from './WhatsAppCoexistenceSection';
import { VideoLibraryTab } from './VideoLibraryTab';
import { ConfirmDialogModal } from './ConfirmDialogModal';
import { N8NWorkflowsSection } from './N8NWorkflowsSection';
import { DatabaseTab } from './DatabaseTab';

interface AdminPanelProps {
  onBackToSite: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'videos'
  | 'n8n'
  | 'mercadopago'
  | 'whatsapp'
  | 'pricing'
  | 'database';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('studio_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Leads & Pricing state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [pricing, setPricing] = useState<SystemPricingConfig>(getStoredPricing());
  const [pricingForm, setPricingForm] = useState<SystemPricingConfig>(getStoredPricing());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // n8n configuration & logs state
  const [n8nConfig, setN8nConfig] = useState<N8NConfig>(getStoredN8NConfig());
  const [n8nConfigForm, setN8nConfigForm] = useState<N8NConfig>(getStoredN8NConfig());
  const [n8nLogs, setN8nLogs] = useState<N8NLogEntry[]>(getStoredN8NLogs());
  const [n8nSaveSuccess, setN8nSaveSuccess] = useState(false);
  const [n8nSubTab, setN8nSubTab] = useState<'workflows' | 'config' | 'logs'>('workflows');
  const [testingWebhook, setTestingWebhook] = useState<'video' | 'whatsapp' | null>(null);
  const [testResult, setTestResult] = useState<{
    type: 'video' | 'whatsapp';
    success: boolean;
    httpStatus?: number;
    message: string;
    data?: any;
  } | null>(null);

  // Filters for leads table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // In-app Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync data on mount
  useEffect(() => {
    setLeads(getStoredLeads());
    setPricing(getStoredPricing());
    setPricingForm(getStoredPricing());
    setN8nConfig(getStoredN8NConfig());
    setN8nConfigForm(getStoredN8NConfig());
    setN8nLogs(getStoredN8NLogs());

    const handleLeadsUpdated = () => setLeads(getStoredLeads());
    const handlePricingUpdated = () => {
      setPricing(getStoredPricing());
      setPricingForm(getStoredPricing());
    };
    const handleN8NConfigUpdated = () => {
      setN8nConfig(getStoredN8NConfig());
      setN8nConfigForm(getStoredN8NConfig());
    };
    const handleN8NLogsUpdated = () => {
      setN8nLogs(getStoredN8NLogs());
    };

    window.addEventListener('studio_leads_updated', handleLeadsUpdated);
    window.addEventListener('studio_pricing_updated', handlePricingUpdated);
    window.addEventListener('studio_n8n_config_updated', handleN8NConfigUpdated);
    window.addEventListener('studio_n8n_logs_updated', handleN8NLogsUpdated);

    return () => {
      window.removeEventListener('studio_leads_updated', handleLeadsUpdated);
      window.removeEventListener('studio_pricing_updated', handlePricingUpdated);
      window.removeEventListener('studio_n8n_config_updated', handleN8NConfigUpdated);
      window.removeEventListener('studio_n8n_logs_updated', handleN8NLogsUpdated);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'admin123' || passwordInput.trim() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('studio_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('studio_admin_auth');
  };

  // Pricing handlers
  const handlePricingChange = (field: keyof SystemPricingConfig, value: number) => {
    setPricingForm((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value
    }));
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredPricing(pricingForm);
    setPricing(pricingForm);
    setSaveSuccess(true);
    showToast('Tabela de preços salva com sucesso!');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetPricing = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restaurar Tabela de Preços',
      message: 'Deseja restaurar a tabela de preços padrão de fábrica (R$ 19,90 no Pix)?',
      confirmText: 'Restaurar Preços',
      type: 'warning',
      onConfirm: () => {
        const def = resetStoredPricing();
        setPricing(def);
        setPricingForm(def);
        setSaveSuccess(true);
        showToast('Preços restaurados!');
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  // n8n handlers
  const handleSaveN8N = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredN8NConfig(n8nConfigForm);
    setN8nConfig(n8nConfigForm);
    setN8nSaveSuccess(true);
    showToast('Configurações do n8n salvas com sucesso!');
    setTimeout(() => setN8nSaveSuccess(false), 3000);
  };

  const handleResetN8N = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restaurar Webhooks do n8n',
      message: 'Deseja restaurar as URLs padrão de fábrica dos Webhooks do n8n?',
      confirmText: 'Restaurar Webhooks',
      type: 'warning',
      onConfirm: () => {
        saveStoredN8NConfig(DEFAULT_N8N_CONFIG);
        setN8nConfig(DEFAULT_N8N_CONFIG);
        setN8nConfigForm(DEFAULT_N8N_CONFIG);
        setN8nSaveSuccess(true);
        showToast('Configurações do n8n restauradas!');
        setTimeout(() => setN8nSaveSuccess(false), 3000);
      }
    });
  };

  const handleTestWebhook = async (type: 'video' | 'whatsapp') => {
    setTestingWebhook(type);
    setTestResult(null);
    try {
      const res = await testN8NWebhookDirect(
        type,
        type === 'video' ? n8nConfigForm.videoWebhookUrl : n8nConfigForm.whatsappWebhookUrl,
        n8nConfigForm.apiKey
      );
      setTestResult({
        type,
        success: res.success,
        httpStatus: res.httpStatus,
        message: res.message,
        data: res.data
      });
      showToast(res.success ? `Webhook ${type} testado com sucesso!` : `Falha no teste do webhook ${type}`);
    } catch (err: any) {
      setTestResult({
        type,
        success: false,
        message: err.message || 'Erro ao conectar ao webhook'
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  const handleClearLogs = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Limpar Histórico de Logs',
      message: 'Tem certeza que deseja apagar todo o histórico de disparos e webhooks do n8n?',
      confirmText: 'Limpar Histórico',
      type: 'danger',
      onConfirm: () => {
        clearStoredN8NLogs();
        setN8nLogs([]);
        showToast('Histórico de logs limpo com sucesso!');
      }
    });
  };

  const handleCopySnippet = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 3000);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.childName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (lead.characterName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (lead.parentWhatsApp?.includes(searchQuery) || false) ||
        (lead.parentEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (lead.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  // Executive KPI Metrics
  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const paidLeads = leads.filter((l) => l.status === 'comprou');
    const abandonLeads = leads.filter((l) => l.status === 'abandono_checkout');
    const generatedLeads = leads.filter((l) => l.status === 'video_gerado');

    const totalRevenue = paidLeads.reduce((acc, l) => acc + (l.amountPaid || 0), 0);
    const avgTicket = paidLeads.length > 0 ? totalRevenue / paidLeads.length : 0;
    const conversionRate = totalLeads > 0 ? ((paidLeads.length / totalLeads) * 100).toFixed(1) : '0.0';

    return {
      totalLeads,
      paidCount: paidLeads.length,
      abandonCount: abandonLeads.length,
      generatedCount: generatedLeads.length,
      totalRevenue,
      avgTicket,
      conversionRate
    };
  }, [leads]);

  // LOGIN SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Painel de Controle Administrativo
            </h1>
            <p className="text-xs text-slate-400">
              Acesso restrito para gestão de pedidos, automações e vídeos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Digite sua senha de administrador"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              {authError && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Senha incorreta. (Padrão: <code>admin123</code> ou <code>admin</code>)</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Entrar no Painel</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o site</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NAVIGATION MENU ITEMS
  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'leads', label: 'Pedidos & CRM', icon: Users, badge: leads.length },
    { id: 'videos', label: 'Vídeos & Personagens', icon: Film },
    { id: 'n8n', label: 'Automações n8n', icon: Zap },
    { id: 'mercadopago', label: 'Mercado Pago & Pix', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp Oficial', icon: MessageCircle },
    { id: 'pricing', label: 'Tabela de Preços', icon: Tag },
    { id: 'database', label: 'Banco de Dados (MySQL)', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex font-sans">
      {/* SIDEBAR NAVIGATION (Desktop & Drawer Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0e1420] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-tight">Studio Admin</h2>
                <p className="text-[11px] text-slate-400">Gestão & Automações</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions in sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/60 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a Loja</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-400 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* BACKDROP ON MOBILE */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#0e1420]/80 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Admin</span>
                <span className="text-xs text-slate-600">/</span>
                <h1 className="text-sm sm:text-base font-bold text-white capitalize">
                  {NAV_ITEMS.find((i) => i.id === activeTab)?.label}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Environment Badge */}
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                n8nConfig.mode === 'live'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${n8nConfig.mode === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{n8nConfig.mode === 'live' ? 'Modo Produção' : 'Modo Simulação'}</span>
            </span>

            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Faturamento Total</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {formatCurrency(metrics.totalRevenue)}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{metrics.paidCount} vendas confirmadas</span>
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Taxa de Conversão</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {metrics.conversionRate}%
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {metrics.paidCount} de {metrics.totalLeads} vídeos gerados
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Ticket Médio</span>
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {formatCurrency(metrics.avgTicket)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Plano base + Order bumps
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Leads para Recuperar</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {metrics.abandonCount + metrics.generatedCount}
                  </div>
                  <p className="text-[11px] text-amber-400 font-medium">
                    Aguardando mensagem no WhatsApp
                  </p>
                </div>
              </div>

              {/* Status of System Integrations */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1420] p-6 space-y-4">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Status das Integrações de Produção</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Mercado Pago Pix</p>
                      <p className="text-[11px] text-slate-400">Checkout transparente</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Ativo" />
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Automação n8n</p>
                      <p className="text-[11px] text-slate-400">{n8nConfig.mode === 'live' ? 'Produção' : 'Simulação'}</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" title="Configurado" />
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">ElevenLabs TTS</p>
                      <p className="text-[11px] text-slate-400">Vozes clonadas dos personagens</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" title="Pronto" />
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">WhatsApp Oficial</p>
                      <p className="text-[11px] text-slate-400">Coexistência celular + API</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Ativo" />
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1420] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-white">
                    Últimas Atividades & Pedidos
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Ver todos os leads ➔
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-medium">
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-3">Criança</th>
                        <th className="py-2.5 px-3">Personagem</th>
                        <th className="py-2.5 px-3">WhatsApp</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leads.slice(0, 5).map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                            {new Date(l.createdAt).toLocaleDateString('pt-BR')} {new Date(l.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            {l.childName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {l.characterName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">
                            {l.parentWhatsApp || 'Não informado'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              l.status === 'comprou'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : l.status === 'abandono_checkout'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {l.status === 'comprou' ? 'Pago' : l.status === 'abandono_checkout' ? 'Abandono' : 'Vídeo Gerado'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-white">
                            {l.amountPaid ? formatCurrency(l.amountPaid) : '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM & LEADS MANAGEMENT */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Header and Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, WhatsApp ou ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#0e1420] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64 sm:w-80 font-sans"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-[#0e1420] p-1 rounded-lg border border-slate-800 text-xs">
                    {(['all', 'comprou', 'abandono_checkout', 'video_gerado'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatusFilter(s)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                          statusFilter === s
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {s === 'all' ? 'Todos' : s === 'comprou' ? 'Pagos' : s === 'abandono_checkout' ? 'Abandonos' : 'Gerados'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => exportLeadsToCSV(filteredLeads)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              </div>

              {/* Leads Table */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1420] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                        <th className="py-3 px-4">Pedido / Data</th>
                        <th className="py-3 px-4">Criança</th>
                        <th className="py-3 px-4">Personagem</th>
                        <th className="py-3 px-4">Contato (WhatsApp & E-mail)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Valor</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                            Nenhum lead encontrado com os filtros selecionados.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const isPaid = lead.status === 'comprou';
                          return (
                            <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                              <td className="py-3 px-4">
                                <span className="font-mono text-white font-semibold block">
                                  {lead.orderId || lead.id}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {new Date(lead.createdAt).toLocaleDateString('pt-BR')} {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-bold text-white block">{lead.childName}</span>
                                {lead.birthYear && (
                                  <span className="text-[11px] text-slate-400 font-mono">Nasc: {lead.birthYear}</span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <span className="text-slate-200">{lead.characterName}</span>
                              </td>

                              <td className="py-3 px-4 space-y-0.5 font-mono">
                                {lead.parentWhatsApp ? (
                                  <a
                                    href={`https://wa.me/${lead.parentWhatsApp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-400 hover:underline flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{lead.parentWhatsApp}</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-500">Sem telefone</span>
                                )}
                                {lead.parentEmail && (
                                  <span className="text-slate-400 text-[11px] flex items-center gap-1 font-sans">
                                    <Mail className="w-3 h-3" />
                                    <span>{lead.parentEmail}</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isPaid
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : lead.status === 'abandono_checkout'
                                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {isPaid ? 'Pago' : lead.status === 'abandono_checkout' ? 'Abandono' : 'Vídeo Gerado'}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-mono font-bold text-white">
                                {lead.amountPaid ? formatCurrency(lead.amountPaid) : '--'}
                              </td>

                              <td className="py-3 px-4 text-right">
                                {lead.parentWhatsApp && (
                                  <a
                                    href={`https://wa.me/${lead.parentWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Olá! Vimos que você gerou um vídeo do ${lead.characterName} para o(a) ${lead.childName}! Ficou muito especial!`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Chamar WhatsApp</span>
                                  </a>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIDEOS & CHARACTERS (1 VS 3 BASE VIDEOS) */}
          {activeTab === 'videos' && (
            <VideoLibraryTab onNavigateToN8N={() => setActiveTab('n8n')} />
          )}

          {/* TAB 4: N8N AUTOMATION */}
          {activeTab === 'n8n' && (
            <div className="space-y-6">
              {/* Top sub-tabs: Workflows / Endpoints / Logs */}
              <div className="flex items-center gap-2 p-1 bg-[#0e1420] rounded-lg border border-slate-800 text-xs w-fit">
                <button
                  type="button"
                  onClick={() => setN8nSubTab('workflows')}
                  className={`px-3.5 py-2 rounded-md font-semibold transition ${
                    n8nSubTab === 'workflows'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Workflows & JSON para Importar
                </button>
                <button
                  type="button"
                  onClick={() => setN8nSubTab('config')}
                  className={`px-3.5 py-2 rounded-md font-semibold transition ${
                    n8nSubTab === 'config'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Configurar Endpoints & Webhooks
                </button>
                <button
                  type="button"
                  onClick={() => setN8nSubTab('logs')}
                  className={`px-3.5 py-2 rounded-md font-semibold transition flex items-center gap-1.5 ${
                    n8nSubTab === 'logs'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Histórico de Disparos</span>
                  {n8nLogs.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
                      {n8nLogs.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Sub-tab 1: Workflows Section */}
              {n8nSubTab === 'workflows' && <N8NWorkflowsSection />}

              {/* Sub-tab 2: Config Endpoints */}
              {n8nSubTab === 'config' && (
                <div className="rounded-xl border border-slate-800 bg-[#0e1420] p-6 space-y-6 max-w-4xl">
                  <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-white">
                        URLs dos Webhooks no seu n8n
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Informe as URLs geradas pelo nó Webhook dentro da sua VPS com n8n.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestWebhook('video')}
                        disabled={testingWebhook !== null}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingWebhook === 'video' ? 'animate-spin' : ''}`} />
                        <span>Testar Webhook de Vídeo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTestWebhook('whatsapp')}
                        disabled={testingWebhook !== null}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingWebhook === 'whatsapp' ? 'animate-spin' : ''}`} />
                        <span>Testar Webhook WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {testResult && (
                    <div className={`p-4 rounded-lg text-xs border ${
                      testResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    }`}>
                      <p className="font-semibold">
                        {testResult.success ? 'Conexão Bem-Sucedida!' : 'Aviso na Conexão:'} {testResult.message}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSaveN8N} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        1. Webhook de Criação de Vídeo (ElevenLabs & FFmpeg)
                      </label>
                      <input
                        type="url"
                        required
                        value={n8nConfigForm.videoWebhookUrl}
                        onChange={(e) => setN8nConfigForm({ ...n8nConfigForm, videoWebhookUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                        placeholder="https://seu-n8n.com/webhook/gerar-video"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        2. Webhook de Disparo no WhatsApp (Prévia & Recuperação)
                      </label>
                      <input
                        type="url"
                        required
                        value={n8nConfigForm.whatsappWebhookUrl}
                        onChange={(e) => setN8nConfigForm({ ...n8nConfigForm, whatsappWebhookUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                        placeholder="https://seu-n8n.com/webhook/enviar-whatsapp"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Modo de Operação
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="n8n_mode"
                            checked={n8nConfigForm.mode === 'live'}
                            onChange={() => setN8nConfigForm({ ...n8nConfigForm, mode: 'live' })}
                            className="text-blue-600"
                          />
                          <span>Modo Produção (Chama a VPS real)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="n8n_mode"
                            checked={n8nConfigForm.mode === 'mock'}
                            onChange={() => setN8nConfigForm({ ...n8nConfigForm, mode: 'mock' })}
                            className="text-blue-600"
                          />
                          <span>Modo Simulação (Para testes sem gastar API)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={handleResetN8N}
                        className="text-xs text-slate-500 hover:text-slate-300 underline"
                      >
                        Restaurar padrões
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        Salvar Configurações do n8n
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-tab 3: Logs */}
              {n8nSubTab === 'logs' && (
                <div className="rounded-xl border border-slate-800 bg-[#0e1420] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-white">
                        Histórico em Tempo Real de Requisições ({n8nLogs.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Registro de chamadas enviadas pelo site para o seu n8n.
                      </p>
                    </div>

                    {n8nLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearLogs}
                        className="text-xs text-rose-400 hover:text-rose-300 underline"
                      >
                        Limpar Histórico
                      </button>
                    )}
                  </div>

                  {n8nLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 border border-slate-800 rounded-lg">
                      Nenhuma requisição registrada nesta sessão ainda.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-medium">
                            <th className="py-2.5 px-3">Horário</th>
                            <th className="py-2.5 px-3">Evento</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Tempo</th>
                            <th className="py-2.5 px-3">Resumo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {n8nLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/30">
                              <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={log.event === 'generate_video' ? 'text-amber-300' : 'text-blue-300'}>
                                  {log.event === 'generate_video' ? 'Vídeo (FFmpeg)' : 'WhatsApp'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  log.status === 'success'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-300'
                                }`}>
                                  {log.status === 'success' ? '200 OK' : 'Simulado'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {log.durationMs}ms
                              </td>
                              <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px] truncate max-w-xs">
                                {log.summary}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MERCADO PAGO API */}
          {activeTab === 'mercadopago' && <MercadoPagoTab />}

          {/* TAB 6: WHATSAPP OFICIAL API */}
          {activeTab === 'whatsapp' && <WhatsAppCoexistenceSection />}

          {/* TAB 7: PRICING & OFFERS */}
          {activeTab === 'pricing' && (
            <div className="max-w-4xl space-y-6">
              <form onSubmit={handleSavePricing} className="rounded-xl border border-slate-800 bg-[#0e1420] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-semibold text-sm text-white">
                      Configuração da Tabela de Preços & Order Bumps
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Altere os preços dos planos e adicionais. O checkout atualiza em tempo real.
                    </p>
                  </div>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Preços Salvos!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Plano 1 Vídeo */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                    <h4 className="font-bold text-xs text-blue-400 uppercase tracking-wider">
                      Plano 1: 1 Vídeo Personalizado
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Preço Atual (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.singleVideoPrice}
                          onChange={(e) => handlePricingChange('singleVideoPrice', parseFloat(e.target.value))}
                          className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Preço "De" Risco (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.singleVideoOriginalPrice}
                          onChange={(e) => handlePricingChange('singleVideoOriginalPrice', parseFloat(e.target.value))}
                          className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plano Combo 2 Vídeos */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                    <h4 className="font-bold text-xs text-purple-400 uppercase tracking-wider">
                      Plano 2: Combo 2 Vídeos (Mais Vendido)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Preço Atual (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.comboVideoPrice}
                          onChange={(e) => handlePricingChange('comboVideoPrice', parseFloat(e.target.value))}
                          className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Preço "De" Risco (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.comboVideoOriginalPrice}
                          onChange={(e) => handlePricingChange('comboVideoOriginalPrice', parseFloat(e.target.value))}
                          className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Bumps */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                  <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                    Order Bumps (Up-sells no Checkout)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Convite Digital (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricingForm.bumpConvitePrice}
                        onChange={(e) => handlePricingChange('bumpConvitePrice', parseFloat(e.target.value))}
                        className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Quadro de Rotina (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricingForm.bumpRotinaPrice}
                        onChange={(e) => handlePricingChange('bumpRotinaPrice', parseFloat(e.target.value))}
                        className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Fila Prioritária VIP (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricingForm.bumpVipPrice}
                        onChange={(e) => handlePricingChange('bumpVipPrice', parseFloat(e.target.value))}
                        className="w-full bg-[#0e1420] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleResetPricing}
                    className="text-xs text-slate-500 hover:text-slate-300 underline"
                  >
                    Restaurar tabela padrão
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Salvar Tabela de Preços
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: DATABASE (MYSQL) */}
          {activeTab === 'database' && <DatabaseTab />}
        </main>
      </div>

      {/* Global In-app Confirm Dialog Modal */}
      {confirmDialog && (
        <ConfirmDialogModal
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          type={confirmDialog.type}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl animate-fadeIn flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
