import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Layers,
  UploadCloud,
  Check,
  AlertCircle,
  Film,
  Mic,
  Scissors,
  Image,
  Tag,
  User
} from 'lucide-react';
import { Character, CharacterGender, CharacterCategory } from '../../types';

interface CreateEditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    character: Character,
    localFiles?: { aniversario?: File; elogio?: File; conquista?: File }
  ) => void;
  initialCharacter?: Character | null;
}

export const CreateEditCharacterModal: React.FC<CreateEditCharacterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCharacter
}) => {
  const isEditing = Boolean(initialCharacter);

  const [formData, setFormData] = useState<Partial<Character>>(() => {
    if (initialCharacter) {
      return {
        ...initialCharacter,
        occasionVideos: {
          aniversario: initialCharacter.occasionVideos?.aniversario || initialCharacter.videoUrl || '',
          elogio: initialCharacter.occasionVideos?.elogio || '',
          conquista: initialCharacter.occasionVideos?.conquista || ''
        }
      };
    }
    return {
      id: `char_${Date.now()}`,
      name: '',
      emoji: '✨',
      category: 'herois',
      gender: 'boy',
      badge: 'Exclusivo',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      videoUrl: '',
      occasionVideos: {
        aniversario: '',
        elogio: '',
        conquista: ''
      },
      color: 'from-amber-500 to-yellow-600',
      samplePhrase: 'Olá, amiguinho! O seu dia vai ser inesquecível e cheio de alegria!',
      description: 'Mensagem personalizada em vídeo para surpreender as crianças.',
      customSlotStart: 0.0,
      customSlotEnd: 2.8,
      voiceSampleStart: 3.0,
      voiceSampleEnd: 20.0,
      elevenLabsVoiceId: ''
    };
  });

  const [styleMode, setStyleMode] = useState<'single' | 'triple'>(() => {
    if (initialCharacter?.occasionVideos?.elogio || initialCharacter?.occasionVideos?.conquista) {
      return 'triple';
    }
    return 'triple'; // Default to triple for rich characters
  });

  const [localFiles, setLocalFiles] = useState<{
    aniversario?: File;
    elogio?: File;
    conquista?: File;
  }>({});

  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'videos' | 'voice'>('info');

  if (!isOpen) return null;

  const handleFileChange = (style: 'aniversario' | 'elogio' | 'conquista', file: File | null) => {
    if (!file) return;
    setLocalFiles(prev => ({ ...prev, [style]: file }));
    const objUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      videoUrl: style === 'aniversario' ? objUrl : prev.videoUrl,
      occasionVideos: {
        ...(prev.occasionVideos || {}),
        [style]: objUrl
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name?.trim()) {
      setErrorMessage('Por favor, digite o nome do personagem.');
      setActiveTab('info');
      return;
    }

    const mainVideo = formData.videoUrl?.trim() || formData.occasionVideos?.aniversario?.trim() || '';
    const hasAniversarioFile = Boolean(localFiles.aniversario);

    if (!mainVideo && !hasAniversarioFile) {
      setErrorMessage('Por favor, informe a URL na VPS ou selecione um arquivo .mp4 para o vídeo de Aniversário (Festa).');
      setActiveTab('videos');
      return;
    }

    const finalOccasionVideos = {
      aniversario: mainVideo,
      elogio: styleMode === 'triple' ? (formData.occasionVideos?.elogio?.trim() || '') : '',
      conquista: styleMode === 'triple' ? (formData.occasionVideos?.conquista?.trim() || '') : ''
    };

    const newChar: Character = {
      id: formData.id || `char_${Date.now()}`,
      name: formData.name.trim(),
      emoji: formData.emoji?.trim() || '⭐',
      category: (formData.category as 'herois' | 'princesas' | 'aventura' | 'biblicos') || 'herois',
      gender: (formData.gender as CharacterGender) || 'boy',
      badge: formData.badge?.trim() || 'Exclusivo',
      image: formData.image?.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      videoUrl: mainVideo,
      occasionVideos: finalOccasionVideos,
      color: formData.color || 'from-amber-500 to-yellow-600',
      samplePhrase: formData.samplePhrase?.trim() || 'Olá! Uma surpresa mágica para você!',
      description: formData.description?.trim() || 'Mensagem em vídeo personalizada com a voz do personagem.',
      customSlotStart: Number(formData.customSlotStart || 0),
      customSlotEnd: Number(formData.customSlotEnd || 2.8),
      voiceSampleStart: Number(formData.voiceSampleStart || 3.0),
      voiceSampleEnd: Number(formData.voiceSampleEnd || 20.0),
      elevenLabsVoiceId: formData.elevenLabsVoiceId?.trim() || '',
      isCustomUploaded: true
    };

    onSave(newChar, localFiles);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold">
              {formData.emoji || <Sparkles className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>{isEditing ? `Editar: ${formData.name || 'Personagem'}` : 'Cadastrar Novo Personagem'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                  {styleMode === 'triple' ? '3 Estilos' : '1 Vídeo Base'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure dados básicos, vídeos base da VPS e voz do ElevenLabs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation inside modal */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Informações Básicas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'videos'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>2. Vídeos Base (VPS / Local)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>3. Voz & Cortes</span>
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form id="new-character-modal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: INFO BÁSICAS */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Nome do Personagem <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hulk, Wandinha, Sonic, Naruto..."
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Emoji
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 🟢, 🕷️, 👸🏼"
                    value={formData.emoji || ''}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center text-lg focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Categoria
                  </label>
                  <select
                    value={formData.category || 'herois'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="herois">Heróis</option>
                    <option value="princesas">Princesas</option>
                    <option value="aventura">Aventura</option>
                    <option value="biblicos">Bíblicos</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Gênero do Público
                  </label>
                  <select
                    value={formData.gender || 'boy'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="boy">Meninos</option>
                    <option value="girl">Meninas</option>
                    <option value="neutral">Ambos (Neutro)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Selo / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Pedido, Exclusivo"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>URL da Imagem de Capa</span>
                  <span className="text-[10px] text-slate-400">JPG ou PNG (recomendado 600x800)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://sua-vps.com/videos/personagem/foto.jpg"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  {formData.image && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-black flex-shrink-0">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Frase de Apresentação / Slogan
                </label>
                <input
                  type="text"
                  placeholder="Ex: Uma mensagem de coragem direto do laboratório dos Vingadores!"
                  value={formData.samplePhrase || ''}
                  onChange={(e) => setFormData({ ...formData, samplePhrase: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve descrição que aparece no catálogo e na escolha dos pais..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VÍDEOS BASE */}
          {activeTab === 'videos' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Toggle 1 Vídeo vs 3 Vídeos */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Estrutura de Vídeos do Personagem</span>
                  </h4>
                  <p className="text-[11px] text-purple-200/80">
                    Escolha se o personagem tem 1 vídeo base ou 3 variações gravadas
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setStyleMode('single')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      styleMode === 'single'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1 Vídeo Base Único
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyleMode('triple')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      styleMode === 'triple'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3 Vídeos (Festa, Elogio, Virtudes)
                  </button>
                </div>
              </div>

              {/* Estilo 1: Festa / Aniversário */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🎂</span>
                    <span>Vídeo 1: Festa & Aniversário (Obrigatório)</span>
                  </h4>
                  <span className="text-[10px] text-amber-400 font-semibold">Principal / Fallback</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-300 font-medium">URL Pública na VPS / CDN:</label>
                  <input
                    type="url"
                    placeholder="https://sua-vps.com/videos/01_personagem_festa.mp4"
                    value={formData.occasionVideos?.aniversario || formData.videoUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        videoUrl: val,
                        occasionVideos: {
                          ...(prev.occasionVideos || {}),
                          aniversario: val
                        }
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div className="p-2.5 rounded-xl border border-dashed border-amber-500/30 bg-black/30 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-amber-200 flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ou selecione arquivo local .mp4:</span>
                  </div>
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    onChange={(e) => handleFileChange('aniversario', e.target.files?.[0] || null)}
                    className="text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-amber-400/30 file:text-amber-200 cursor-pointer"
                  />
                </div>
                {localFiles.aniversario && (
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {localFiles.aniversario.name} ({(localFiles.aniversario.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>

              {/* Estilo 2: Elogio (se triple) */}
              {styleMode === 'triple' && (
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <span>⭐</span>
                      <span>Vídeo 2: Elogio & Bons Hábitos (Opcional)</span>
                    </h4>
                    <span className="text-[10px] text-purple-400">Para incentivar a criança</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 font-medium">URL Pública na VPS / CDN:</label>
                    <input
                      type="url"
                      placeholder="https://sua-vps.com/videos/02_personagem_elogio.mp4"
                      value={formData.occasionVideos?.elogio || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          occasionVideos: {
                            ...(prev.occasionVideos || {}),
                            elogio: val
                          }
                        }));
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl border border-dashed border-purple-500/30 bg-black/30 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-purple-200 flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-purple-400" />
                      <span>Ou selecione arquivo local .mp4:</span>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={(e) => handleFileChange('elogio', e.target.files?.[0] || null)}
                      className="text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-purple-500/30 file:text-purple-200 cursor-pointer"
                    />
                  </div>
                  {localFiles.elogio && (
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {localFiles.elogio.name} ({(localFiles.elogio.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  )}
                </div>
              )}

              {/* Estilo 3: Virtudes & Coragem (se triple) */}
              {styleMode === 'triple' && (
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <span>🏆</span>
                      <span>Vídeo 3: Virtudes, Coragem & Conquistas (Opcional)</span>
                    </h4>
                    <span className="text-[10px] text-cyan-400">Para conquistas especiais</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 font-medium">URL Pública na VPS / CDN:</label>
                    <input
                      type="url"
                      placeholder="https://sua-vps.com/videos/03_personagem_virtudes.mp4"
                      value={formData.occasionVideos?.conquista || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          occasionVideos: {
                            ...(prev.occasionVideos || {}),
                            conquista: val
                          }
                        }));
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl border border-dashed border-cyan-500/30 bg-black/30 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-cyan-200 flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ou selecione arquivo local .mp4:</span>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={(e) => handleFileChange('conquista', e.target.files?.[0] || null)}
                      className="text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-cyan-500/30 file:text-cyan-200 cursor-pointer"
                    />
                  </div>
                  {localFiles.conquista && (
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {localFiles.conquista.name} ({(localFiles.conquista.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VOZ & CORTES */}
          {activeTab === 'voice' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-purple-400" />
                    <span>Voice ID do ElevenLabs</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Pode preencher agora ou clonar no player</span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: 21m00Tcm4TlvDq8ikWAM"
                  value={formData.elevenLabsVoiceId || ''}
                  onChange={(e) => setFormData({ ...formData, elevenLabsVoiceId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span>Configuração de Ponto de Inserção do Nome</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Marcação em segundos de onde o nome da criança será falado no vídeo pelo n8n
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Início Silêncio (seg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.customSlotStart || 0}
                      onChange={(e) => setFormData({ ...formData, customSlotStart: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Fim Silêncio / Nome (seg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.customSlotEnd || 2.8}
                      onChange={(e) => setFormData({ ...formData, customSlotEnd: parseFloat(e.target.value) || 2.8 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            {activeTab !== 'info' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'voice' ? 'videos' : 'info')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                Voltar
              </button>
            )}
            {activeTab !== 'voice' ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'info' ? 'videos' : 'voice')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition"
              >
                Avançar &rarr;
              </button>
            ) : null}
            <button
              type="submit"
              form="new-character-modal-form"
              className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Personagem'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
