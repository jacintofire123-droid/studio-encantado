import React, { useState, useRef, useEffect } from 'react';
import { Character, CharacterCategory, CharacterGender } from '../../types';
import {
  getStoredCharacters,
  saveStoredCharacter,
  deleteStoredCharacter,
  resetStoredCharacters
} from '../../services/characterStore';
import {
  getStoredElevenLabsConfig,
  saveStoredElevenLabsConfig,
  cloneVoiceElevenLabs,
  testGenerateTTS,
  ElevenLabsConfig
} from '../../services/elevenLabsService';
import {
  extractAudioFromVideoFile,
  extractAudioFromVideoUrl
} from '../../services/audioExtractor';
import { CHARACTER_SCRIPTS } from '../../data/characterScripts';
import { CreateEditCharacterModal } from "./CreateEditCharacterModal";
import { ConfirmDialogModal } from "./ConfirmDialogModal";

import {
  Film,
  Plus,
  Play,
  Pause,
  Scissors,
  Mic,
  Server,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Edit3,
  RefreshCw,
  Info,
  Layers,
  FileVideo,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Download,
  FileAudio,
  BookOpen,
  X,
  Search,
  ArrowRight,
  Zap
} from 'lucide-react';

interface VideoLibraryTabProps {
  onNavigateToN8N?: () => void;
}

export const VideoLibraryTab: React.FC<VideoLibraryTabProps> = ({ onNavigateToN8N }) => {
  const [characters, setCharacters] = useState<Character[]>(getStoredCharacters());
  const [selectedCharId, setSelectedCharId] = useState<string | null>(characters[0]?.id || null);

  // ElevenLabs Config
  const [elevenConfig, setElevenConfig] = useState<ElevenLabsConfig>(getStoredElevenLabsConfig());
  const [showConfigSaved, setShowConfigSaved] = useState(false);

  // Filter for character list: 'all' | 'triple' | 'single'
  const [styleFilter, setStyleFilter] = useState<'all' | 'triple' | 'single'>('all');

  // Selected Occasion/Style for preview in player and editing
  const [selectedStyle, setSelectedStyle] = useState<'aniversario' | 'elogio' | 'conquista'>('aniversario');

  // Style Mode when editing or creating: 'single' (1 video base) or 'triple' (3 videos base como Hulk)
  const [styleMode, setStyleMode] = useState<'single' | 'triple'>('triple');

  // Character Form state (new or editing)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Character>>({
    id: '',
    name: '',
    emoji: '⭐',
    category: 'herois',
    gender: 'boy',
    badge: 'Novo',
    image: '',
    videoUrl: '',
    occasionVideos: {
      aniversario: '',
      elogio: '',
      conquista: ''
    },
    customSlotStart: 0.0,
    customSlotEnd: 2.8,
    voiceSampleStart: 3.0,
    voiceSampleEnd: 20.0,
    elevenLabsVoiceId: '',
    samplePhrase: 'Olá, campeão! Parabéns pelo seu dia especial!',
    description: 'Vídeo personalizado encantador com mensagem especial.'
  });

  // Video Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ElevenLabs Cloning UI state
  const [cloningStatus, setCloningStatus] = useState<'idle' | 'cloning' | 'success' | 'error'>('idle');
  const [cloningMessage, setCloningMessage] = useState('');

  // Per-style local video files and preview URLs
  const [localVideoFiles, setLocalVideoFiles] = useState<{
    aniversario?: File | null;
    elogio?: File | null;
    conquista?: File | null;
  }>({});
  const [localVideoPreviewUrls, setLocalVideoPreviewUrls] = useState<{
    aniversario?: string | null;
    elogio?: string | null;
    conquista?: string | null;
  }>({});

  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null);
  const [extractedAudioBlob, setExtractedAudioBlob] = useState<Blob | null>(null);
  const [extractedAudioDuration, setExtractedAudioDuration] = useState<number | null>(null);
  const [isExtractingOnly, setIsExtractingOnly] = useState(false);

  // Test TTS UI
  const [testText, setTestText] = useState('Olá, Sofia! Parabéns pelos seus 5 aninhos!');
  const [isTestingTTS, setIsTestingTTS] = useState(false);
  const [testAudioUrl, setTestAudioUrl] = useState<string | null>(null);
  const [testTtsError, setTestTtsError] = useState('');

  // VPS Guide collapse
  const [showVpsGuide, setShowVpsGuide] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Scripts Modal state
  const [showScriptsModal, setShowScriptsModal] = useState(false);
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // In-tab Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  const [scriptsSearch, setScriptsSearch] = useState('');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setCharacters(getStoredCharacters());
    };
    window.addEventListener('studio_characters_updated', handleUpdate);
    return () => window.removeEventListener('studio_characters_updated', handleUpdate);
  }, []);

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharId(char.id);
    setIsEditing(false);
    setSelectedStyle('aniversario');
    
    const hasMultipleStyles = Boolean(
      (char.occasionVideos?.elogio && char.occasionVideos.elogio.trim().length > 0) ||
      (char.occasionVideos?.conquista && char.occasionVideos.conquista.trim().length > 0)
    );
    setStyleMode(hasMultipleStyles ? 'triple' : 'single');

    setFormData({
      ...char,
      occasionVideos: {
        aniversario: char.occasionVideos?.aniversario || char.videoUrl || '',
        elogio: char.occasionVideos?.elogio || '',
        conquista: char.occasionVideos?.conquista || ''
      }
    });
    setIsPlaying(false);
    setTestAudioUrl(null);
    setTestTtsError('');
    setLocalVideoFiles({});
    setLocalVideoPreviewUrls({});
    setExtractedAudioUrl(null);
    setExtractedAudioBlob(null);
    setExtractedAudioDuration(null);
    setCloningStatus('idle');
    setCloningMessage('');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleStartNew = () => {
    setIsEditing(true);
    setSelectedCharId(null);
    setSelectedStyle('aniversario');
    setStyleMode('triple'); // Default to multi-style for new characters
    setLocalVideoFiles({});
    setLocalVideoPreviewUrls({});
    setExtractedAudioUrl(null);
    setExtractedAudioBlob(null);
    setExtractedAudioDuration(null);
    setCloningStatus('idle');
    setCloningMessage('');
    setFormData({
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
      customSlotStart: 0.0,
      customSlotEnd: 2.8,
      voiceSampleStart: 3.0,
      voiceSampleEnd: 20.0,
      elevenLabsVoiceId: '',
      samplePhrase: 'Olá, amiguinho! O seu dia vai ser muito incrível!',
      description: 'Vídeo emocionante e personalizado para datas especiais.'
    });
    setTestAudioUrl(null);
  };

  const handleSaveCharacterFromModal = (
    newChar: Character,
    files?: { aniversario?: File; elogio?: File; conquista?: File }
  ) => {
    saveStoredCharacter(newChar);
    const updated = getStoredCharacters();
    setCharacters(updated);
    setSelectedCharId(newChar.id);
    setIsEditing(false);
    setIsCreateModalOpen(false);

    if (files) {
      if (files.aniversario) {
        setLocalVideoFiles(prev => ({ ...prev, aniversario: files.aniversario }));
        setLocalVideoPreviewUrls(prev => ({ ...prev, aniversario: URL.createObjectURL(files.aniversario!) }));
      }
      if (files.elogio) {
        setLocalVideoFiles(prev => ({ ...prev, elogio: files.elogio }));
        setLocalVideoPreviewUrls(prev => ({ ...prev, elogio: URL.createObjectURL(files.elogio!) }));
      }
      if (files.conquista) {
        setLocalVideoFiles(prev => ({ ...prev, conquista: files.conquista }));
        setLocalVideoPreviewUrls(prev => ({ ...prev, conquista: URL.createObjectURL(files.conquista!) }));
      }
    }

    showToast(`Personagem "${newChar.name}" cadastrado com sucesso!`, 'success');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    const finalOccasionVideos = {
      aniversario: formData.occasionVideos?.aniversario || formData.videoUrl || '',
      elogio: styleMode === 'triple' ? (formData.occasionVideos?.elogio || '') : '',
      conquista: styleMode === 'triple' ? (formData.occasionVideos?.conquista || '') : ''
    };

    const mainVideoUrl = formData.videoUrl || finalOccasionVideos.aniversario || '';

    if (!formData.name || !mainVideoUrl) {
      showToast('Por favor informe pelo menos o Nome e o Vídeo Principal (Festa/Aniversário)!', 'error');
      return;
    }

    const newChar: Character = {
      id: formData.id || `char_${Date.now()}`,
      name: formData.name,
      emoji: formData.emoji || '⭐',
      category: (formData.category as 'herois' | 'princesas' | 'aventura' | 'biblicos') || 'herois',
      gender: (formData.gender as CharacterGender) || 'boy',
      badge: formData.badge || 'Destaque',
      image: formData.image || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      videoUrl: mainVideoUrl,
      occasionVideos: finalOccasionVideos,
      color: formData.color || 'from-indigo-600 to-purple-600',
      samplePhrase: formData.samplePhrase || 'Olá! Uma surpresa mágica para você!',
      description: formData.description || 'Mensagem em vídeo personalizada com a voz do personagem.',
      customSlotStart: Number(formData.customSlotStart || 0),
      customSlotEnd: Number(formData.customSlotEnd || 2.8),
      voiceSampleStart: Number(formData.voiceSampleStart || 3.0),
      voiceSampleEnd: Number(formData.voiceSampleEnd || 20.0),
      elevenLabsVoiceId: formData.elevenLabsVoiceId || '',
      isCustomUploaded: true
    };

    saveStoredCharacter(newChar);
    setCharacters(getStoredCharacters());
    setSelectedCharId(newChar.id);
    setIsEditing(false);
    showToast(`Personagem "${newChar.name}" salvo com sucesso!`, 'success');
  };

  const handleOpenDelete = (char: Character) => {
    setCharacterToDelete(char);
  };

  const handleConfirmDelete = () => {
    if (!characterToDelete) return;
    const deletedName = characterToDelete.name;
    const deletedId = characterToDelete.id;
    deleteStoredCharacter(deletedId);
    const updated = getStoredCharacters();
    setCharacters(updated);
    if (selectedCharId === deletedId) {
      setSelectedCharId(updated[0]?.id || null);
    }
    setCharacterToDelete(null);
    showToast(`Personagem "${deletedName}" excluído com sucesso!`, 'success');
  };

  const handleConfirmReset = () => {
    resetStoredCharacters();
    const updated = getStoredCharacters();
    setCharacters(updated);
    setSelectedCharId(updated[0]?.id || null);
    setShowResetConfirmModal(false);
    showToast('Biblioteca de personagens restaurada para o padrão!', 'success');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopyScriptPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 3000);
  };

  // Video playback listeners
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // ElevenLabs Config Save
  const handleSaveElevenLabs = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredElevenLabsConfig(elevenConfig);
    setShowConfigSaved(true);
    setTimeout(() => setShowConfigSaved(false), 3000);
  };

  // Test TTS
  const handleTestTTS = async () => {
    const voiceId = formData.elevenLabsVoiceId || selectedChar?.elevenLabsVoiceId;
    if (!voiceId) {
      setTestTtsError('Informe ou clone um Voice ID do ElevenLabs primeiro.');
      return;
    }
    if (!elevenConfig.apiKey) {
      setTestTtsError('Configure sua API Key do ElevenLabs na aba acima.');
      return;
    }

    setIsTestingTTS(true);
    setTestTtsError('');
    setTestAudioUrl(null);

    const res = await testGenerateTTS(elevenConfig.apiKey, voiceId, testText);
    setIsTestingTTS(false);

    if (res.success && res.audioUrl) {
      setTestAudioUrl(res.audioUrl);
    } else {
      setTestTtsError(res.error || 'Falha ao gerar áudio de teste.');
    }
  };

  // Local video upload handler for a specific style
  const handleStyleVideoFileChange = (style: 'aniversario' | 'elogio' | 'conquista', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setLocalVideoFiles(prev => ({ ...prev, [style]: file }));
      setLocalVideoPreviewUrls(prev => ({ ...prev, [style]: objUrl }));
      setSelectedStyle(style);

      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormData((prev) => {
        const nextOccasions = {
          ...(prev.occasionVideos || {}),
          [style]: prev.occasionVideos?.[style] || `https://sua-vps.com/videos/${file.name}`
        };
        return {
          ...prev,
          name: prev.name || cleanFileName,
          videoUrl: style === 'aniversario' ? (prev.videoUrl || `https://sua-vps.com/videos/${file.name}`) : prev.videoUrl,
          occasionVideos: nextOccasions
        };
      });

      setExtractedAudioUrl(null);
      setExtractedAudioBlob(null);
      setExtractedAudioDuration(null);
    }
  };

  // Extrai apenas a amostra de áudio (para conferir no player e baixar se quiser)
  const handleExtractAudioOnly = async () => {
    const startSec = Number(formData.voiceSampleStart || 3.0);
    const endSec = Number(formData.voiceSampleEnd || 20.0);

    if (endSec <= startSec) {
      showToast('O tempo de fim da amostra de voz deve ser maior que o tempo de início.', 'error');
      return;
    }

    setIsExtractingOnly(true);
    setCloningMessage('');

    try {
      let res: { blob: Blob; duration: number; objectUrl: string };
      const currentLocalFile = localVideoFiles[selectedStyle] || localVideoFiles.aniversario || Object.values(localVideoFiles).find(f => Boolean(f));
      const currentUrl = activeVideoUrl;

      if (currentLocalFile) {
        res = await extractAudioFromVideoFile(currentLocalFile, startSec, endSec);
      } else if (currentUrl) {
        res = await extractAudioFromVideoUrl(currentUrl, startSec, endSec);
      } else {
        showToast('Selecione um arquivo de vídeo (.mp4) ou informe a URL do vídeo na VPS.', 'error');
        setIsExtractingOnly(false);
        return;
      }

      setExtractedAudioUrl(res.objectUrl);
      setExtractedAudioBlob(res.blob);
      setExtractedAudioDuration(res.duration);
      setIsExtractingOnly(false);
    } catch (err: any) {
      setIsExtractingOnly(false);
      showToast(`Falha ao extrair áudio: ${err.message}`, 'error');
    }
  };

  // Extrai o trecho do vídeo automaticamente e envia para a API do ElevenLabs
  const handleAutoExtractAndClone = async () => {
    if (!elevenConfig.apiKey) {
      showToast('Informe sua API Key do ElevenLabs antes de clonar a voz.', 'error');
      return;
    }
    const name = formData.name || selectedChar?.name;
    if (!name) {
      showToast('Informe o nome do personagem para cadastrar no ElevenLabs.', 'error');
      return;
    }

    const startSec = Number(formData.voiceSampleStart || 3.0);
    const endSec = Number(formData.voiceSampleEnd || 20.0);

    if (endSec <= startSec) {
      showToast('O tempo de fim da amostra de voz deve ser maior que o tempo de início.', 'error');
      return;
    }

    setCloningStatus('cloning');
    try {
      let audioBlobToSend: Blob | null = extractedAudioBlob;

      if (!audioBlobToSend) {
        const currentLocalFile = localVideoFiles[selectedStyle] || localVideoFiles.aniversario || Object.values(localVideoFiles).find(f => Boolean(f));
        const currentUrl = activeVideoUrl;

        if (currentLocalFile) {
          setCloningMessage(`Passo 1/3: Extraindo trecho de voz de "${currentLocalFile.name}" (${startSec}s a ${endSec}s)...`);
          const res = await extractAudioFromVideoFile(currentLocalFile, startSec, endSec);
          setExtractedAudioUrl(res.objectUrl);
          setExtractedAudioBlob(res.blob);
          setExtractedAudioDuration(res.duration);
          audioBlobToSend = res.blob;
        } else if (currentUrl) {
          setCloningMessage(`Passo 1/3: Baixando vídeo e extraindo voz (${startSec}s a ${endSec}s)...`);
          const res = await extractAudioFromVideoUrl(currentUrl, startSec, endSec);
          setExtractedAudioUrl(res.objectUrl);
          setExtractedAudioBlob(res.blob);
          setExtractedAudioDuration(res.duration);
          audioBlobToSend = res.blob;
        } else {
          setCloningStatus('error');
          setCloningMessage('Nenhum vídeo local ou URL disponível para extrair voz.');
          return;
        }
      }

      setCloningMessage(`Passo 2/3: Enviando áudio extraído para a API do ElevenLabs como "${name}"...`);
      const audioFileToSend = new File([audioBlobToSend], `${name.toLowerCase().replace(/\s+/g, '_')}_sample.wav`, {
        type: 'audio/wav'
      });

      const cloneRes = await cloneVoiceElevenLabs(elevenConfig.apiKey, name, audioFileToSend, `Voz oficial de ${name} para o Studio Encantado`);

      if (cloneRes.success && cloneRes.voiceId) {
        setCloningStatus('success');
        setCloningMessage(`Voz clonada com sucesso! Voice ID: ${cloneRes.voiceId}`);
        setFormData((prev) => ({
          ...prev,
          elevenLabsVoiceId: cloneRes.voiceId
        }));
        if (selectedChar && !isEditing) {
          saveStoredCharacter({
            ...selectedChar,
            elevenLabsVoiceId: cloneRes.voiceId
          });
          setCharacters(getStoredCharacters());
        }
      } else {
        setCloningStatus('error');
        setCloningMessage(cloneRes.error || 'Erro desconhecido ao clonar voz no ElevenLabs.');
      }
    } catch (err: any) {
      setCloningStatus('error');
      setCloningMessage(err.message || 'Falha ao processar áudio do vídeo.');
    }
  };

  // Active video url resolution (checks local preview for selected style first, then online occasion url, then fallback)
  const currentStyleLocalPreview = localVideoPreviewUrls[selectedStyle];
  const currentStyleOnlineUrl = (isEditing ? formData.occasionVideos : selectedChar?.occasionVideos)?.[selectedStyle];
  const mainFallbackUrl = (isEditing ? formData.videoUrl : selectedChar?.videoUrl) || (isEditing ? formData.occasionVideos?.aniversario : selectedChar?.occasionVideos?.aniversario);
  const activeVideoUrl = currentStyleLocalPreview || (currentStyleOnlineUrl && currentStyleOnlineUrl.trim().length > 0 ? currentStyleOnlineUrl : null) || mainFallbackUrl || '';

  // Find character script details
  const currentCharScript = CHARACTER_SCRIPTS.find(
    (cs) => cs.id === (isEditing ? formData.id : selectedChar?.id) || cs.name.toLowerCase().includes((isEditing ? formData.name : selectedChar?.name)?.toLowerCase() || '__none__')
  );

  // Filtered characters list
  const filteredCharacters = characters.filter((c) => {
    if (styleFilter === 'all') return true;
    const count = [
      c.occasionVideos?.aniversario || c.videoUrl,
      c.occasionVideos?.elogio,
      c.occasionVideos?.conquista
    ].filter((u) => Boolean(u && u.trim().length > 0)).length;
    if (styleFilter === 'triple') return count >= 2;
    if (styleFilter === 'single') return count <= 1;
    return true;
  });

  const tripleCount = characters.filter((c) => {
    const count = [
      c.occasionVideos?.aniversario || c.videoUrl,
      c.occasionVideos?.elogio,
      c.occasionVideos?.conquista
    ].filter((u) => Boolean(u && u.trim().length > 0)).length;
    return count >= 2;
  }).length;

  const singleCount = characters.length - tripleCount;

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 border border-purple-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
              <Film className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Biblioteca de Vídeos & Estilos de Ocasião
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  1 ou 3 Vídeos Base por Personagem
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Configure os vídeos base de cada estilo (<strong className="text-amber-300">Festa 🎂</strong>, <strong className="text-purple-300">Elogio ⭐</strong> e <strong className="text-cyan-300">Virtudes 🏆</strong>), suba arquivos locais ou cadastre as URLs da sua VPS e sincronize com os fluxos do n8n.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Botão Roteiros & Falas */}
            <button
              type="button"
              onClick={() => setShowScriptsModal(true)}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-purple-200 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition"
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>Ver Cópias & Falas de Todos</span>
            </button>

            {/* Link direto para a aba de fluxos n8n */}
            {onNavigateToN8N && (
              <button
                type="button"
                onClick={onNavigateToN8N}
                className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Fluxos & JSON n8n</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowVpsGuide(!showVpsGuide)}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-all"
            >
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Hospedagem VPS</span>
              {showVpsGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo Personagem</span>
            </button>
          </div>
        </div>
      </div>

      {/* VPS Quick Guide Accordion */}
      {showVpsGuide && (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Como hospedar os vídeos base na sua VPS (Nginx / Apache / S3)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Guia Rápido de 3 Minutos</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Para que o n8n e o navegador dos clientes baixem os vídeos em velocidade máxima sem gargalos, você pode subir os arquivos <code className="text-amber-400 font-mono">.mp4</code> para uma pasta pública no seu servidor Ubuntu/Debian com Nginx:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>1. Criar pasta e dar permissões</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('sudo mkdir -p /var/www/videos && sudo chown -R www-data:www-data /var/www/videos', 'cmd1')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedCode === 'cmd1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'cmd1' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-slate-300 overflow-x-auto text-[11px]">
                sudo mkdir -p /var/www/videos<br />
                sudo chown -R www-data:www-data /var/www/videos
              </pre>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>2. Configuração no bloco Nginx</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('location /videos/ {\n    alias /var/www/videos/;\n    autoindex off;\n    add_header Access-Control-Allow-Origin *;\n}', 'cmd2')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedCode === 'cmd2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'cmd2' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-slate-300 overflow-x-auto text-[11px]">
                location /videos/ &#123;<br />
                &nbsp;&nbsp;alias /var/www/videos/;<br />
                &nbsp;&nbsp;add_header Access-Control-Allow-Origin *;<br />
                &#125;
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left = Characters Library, Right = Player & Multi-Style Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Character Selection Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Personagens Cadastrados ({characters.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="text-[11px] text-slate-400 hover:text-amber-400 underline transition"
            >
              Restaurar Padrões
            </button>
          </div>

          {/* Quick Style Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setStyleFilter('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition text-center ${
                styleFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({characters.length})
            </button>
            <button
              type="button"
              onClick={() => setStyleFilter('triple')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition text-center flex items-center justify-center gap-1 ${
                styleFilter === 'triple'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Personagens com vídeos específicos para Festa, Elogio e Virtudes (ex: Hulk, Batman, Homem-Aranha)"
            >
              <span>3 Estilos</span>
              <span className="text-[10px] px-1.5 rounded-full bg-black/40 font-mono">{tripleCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setStyleFilter('single')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition text-center flex items-center justify-center gap-1 ${
                styleFilter === 'single'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Personagens com 1 vídeo base único (ex: Neymar, McQueen, Stitch)"
            >
              <span>1 Vídeo Base</span>
              <span className="text-[10px] px-1.5 rounded-full bg-black/40 font-mono">{singleCount}</span>
            </button>
          </div>

          {/* Characters Scrollable List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredCharacters.map((char) => {
              const isSelected = char.id === selectedCharId && !isEditing;
              const hasVoiceId = Boolean(char.elevenLabsVoiceId && char.elevenLabsVoiceId.length > 5);
              const styleCount = [
                char.occasionVideos?.aniversario || char.videoUrl,
                char.occasionVideos?.elogio,
                char.occasionVideos?.conquista
              ].filter((url) => Boolean(url && url.trim().length > 0)).length;

              return (
                <div
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/50 via-slate-800 to-slate-900 border-amber-400 shadow-lg shadow-purple-500/10 ring-1 ring-amber-400/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                      {char.image ? (
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-2xl">{char.emoji}</span>
                      )}
                      <span className="absolute bottom-0 right-0 text-xs">{char.emoji}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-sm truncate group-hover:text-amber-300 transition">
                          {char.name}
                        </h4>
                        {char.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-semibold truncate hidden sm:inline">
                            {char.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {/* Tag de 3 Estilos vs 1 Vídeo Base */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 border ${
                            styleCount >= 2
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold'
                              : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 font-semibold'
                          }`}
                        >
                          <Layers className="w-2.5 h-2.5" />
                          <span>{styleCount >= 2 ? '3 Vídeos Base' : '1 Vídeo Base'}</span>
                        </span>

                        {hasVoiceId ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Mic className="w-2.5 h-2.5" />
                            <span>Voz OK</span>
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-500/15 text-amber-300/80 px-1.5 py-0.5 rounded">
                            Sem Voz
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDelete(char);
                      }}
                      title={`Excluir ${char.name}`}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/15 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick info note */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200/80 space-y-1">
            <p className="font-bold text-purple-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Diferença entre 1 Vídeo e 3 Vídeos:</span>
            </p>
            <p className="leading-relaxed">
              Personagens como <strong>Hulk, Homem-Aranha e Barbie</strong> têm 3 vídeos diferentes (Festa, Elogio e Virtudes). Já personagens como <strong>Neymar e McQueen</strong> têm 1 vídeo base que atende todas as opções com adaptação pelo n8n.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Video Player & Multi-Style Editor Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* PLAYER CARD WITH OCCASION STYLE SWITCHER TABS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{isEditing ? formData.emoji : selectedChar?.emoji}</span>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    {isEditing ? (formData.name || 'Novo Personagem') : selectedChar?.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pré-visualização do vídeo e marcação de corte para o ElevenLabs & FFmpeg
                  </p>
                </div>
              </div>

              {/* Style selector for Player */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStyle('aniversario');
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedStyle === 'aniversario'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🎂 Festa</span>
                  {localVideoPreviewUrls.aniversario && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStyle('elogio');
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedStyle === 'elogio'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⭐ Elogio</span>
                  {localVideoPreviewUrls.elogio && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStyle('conquista');
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedStyle === 'conquista'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🏆 Virtudes</span>
                  {localVideoPreviewUrls.conquista && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800 group shadow-inner">
              {activeVideoUrl ? (
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  crossOrigin="anonymous"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                  controls={false}
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileVideo className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">
                    Nenhum vídeo carregado para este estilo ainda.
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Suba um arquivo .mp4 do seu computador abaixo ou insira a URL pública da sua VPS.
                  </p>
                </div>
              )}

              {/* Status pill over video */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-white/10 flex items-center gap-1.5">
                  <span>{selectedStyle === 'aniversario' ? '🎂 Estilo: Festa' : selectedStyle === 'elogio' ? '⭐ Estilo: Elogio' : '🏆 Estilo: Virtudes'}</span>
                  {localVideoPreviewUrls[selectedStyle] ? (
                    <span className="text-emerald-400">(Local)</span>
                  ) : currentStyleOnlineUrl ? (
                    <span className="text-cyan-400">(Online)</span>
                  ) : (
                    <span className="text-slate-400">(Fallback)</span>
                  )}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              {activeVideoUrl && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-400/90 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl transition transform hover:scale-110">
                    {isPlaying ? <Pause className="w-8 h-8 fill-slate-950" /> : <Play className="w-8 h-8 fill-slate-950 ml-1" />}
                  </div>
                </button>
              )}
            </div>

            {/* Video Timeline & Controls */}
            {activeVideoUrl && (
              <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                    </button>
                    <span className="text-white font-bold">{currentTime.toFixed(1)}s</span>
                    <span>/ {duration ? `${duration.toFixed(1)}s` : '--'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Silêncio / Nome: {Number(formData.customSlotStart || 0).toFixed(1)}s a {Number(formData.customSlotEnd || 2.8).toFixed(1)}s
                    </span>
                    <span className="flex items-center gap-1 text-purple-300 hidden sm:flex">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Voz Clone: {Number(formData.voiceSampleStart || 3.0).toFixed(1)}s a {Number(formData.voiceSampleEnd || 20.0).toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Progress Bar Slider */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />

                {/* Quick Timeline Markers Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => seekTo(Number(formData.customSlotStart || 0))}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-amber-300 font-mono"
                    >
                      Ir para Início ({Number(formData.customSlotStart || 0).toFixed(1)}s)
                    </button>
                    <button
                      type="button"
                      onClick={() => seekTo(Number(formData.customSlotEnd || 2.8))}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-amber-300 font-mono"
                    >
                      Ir para Fim do Nome ({Number(formData.customSlotEnd || 2.8).toFixed(1)}s)
                    </button>
                  </div>

                  {/* Extraction Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isExtractingOnly || cloningStatus === 'cloning'}
                      onClick={handleExtractAudioOnly}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>{isExtractingOnly ? 'Extraindo...' : 'Ouvir Amostra de Voz'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={cloningStatus === 'cloning'}
                      onClick={handleAutoExtractAndClone}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-purple-600/25 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{cloningStatus === 'cloning' ? 'Clonando Voz...' : 'Clonar Voz no ElevenLabs'}</span>
                    </button>
                  </div>
                </div>

                {/* Extracted Audio Audio Element */}
                {extractedAudioUrl && (
                  <div className="mt-2 p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs text-cyan-300">
                      <FileAudio className="w-4 h-4 text-cyan-400" />
                      <span>Trecho de voz isolado ({extractedAudioDuration?.toFixed(1)}s):</span>
                    </div>
                    <audio src={extractedAudioUrl} controls className="h-8 max-w-full sm:max-w-xs" />
                  </div>
                )}

                {/* Cloning Message Banner */}
                {cloningMessage && (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    cloningStatus === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : cloningStatus === 'error'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                  }`}>
                    {cloningStatus === 'cloning' && <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />}
                    {cloningStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {cloningStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                    <span>{cloningMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FORM: EDITING OR ADDING MULTI-STYLE VIDEOS */}
          <form onSubmit={handleSaveForm} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  {isEditing ? 'Configurar Vídeos Base e Informações' : `Editar Vídeos de "${selectedChar?.name}"`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cadastre os links da VPS ou envie arquivos .mp4 para cada estilo (Festa, Elogio e Virtudes)
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Editar Campos</span>
                </button>
              )}
            </div>

            {/* Basic Info: Name, Emoji, Category, Voice ID */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nome do Personagem <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hulk, Homem-Aranha, Barbie..."
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  placeholder="Ex: 🟢, 🕷️, 👸🏼"
                  value={formData.emoji || ''}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-400 text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.category || 'herois'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="herois">Heróis</option>
                  <option value="princesas">Princesas</option>
                  <option value="aventura">Aventura</option>
                  <option value="biblicos">Bíblicos</option>
                </select>
              </div>
            </div>

            {/* STYLE MODE SELECTOR: 1 Video Base vs 3 Videos Base */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Estrutura de Vídeos do Personagem</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Defina se este personagem usará 1 vídeo único adaptável ou 3 vídeos base gravados por tema.
                  </p>
                </div>

                {/* Toggle Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setStyleMode('single')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      styleMode === 'single'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>1 Vídeo Base Único</span>
                    <span className="text-[10px] opacity-75 font-normal">(Neymar, McQueen)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStyleMode('triple')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      styleMode === 'triple'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>3 Vídeos por Estilo</span>
                    <span className="text-[10px] opacity-75 font-normal">(Hulk, Homem-Aranha)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DEDICATED CARDS FOR EACH STYLE / OCCASION */}
            <div className="space-y-4">
              {/* ESTILO 1: FESTA / ANIVERSÁRIO (Sempre obrigatório / base) */}
              <div className={`p-4 rounded-2xl border transition-all ${
                selectedStyle === 'aniversario'
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎂</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                        Estilo 1: Festa & Parabéns (Vídeo Base Obrigatório)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Usado na ocasião de Aniversário e como fallback padrão se os outros estilos não forem informados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStyle('aniversario');
                        if (videoRef.current) videoRef.current.currentTime = 0;
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30"
                    >
                      <Play className="w-3 h-3" />
                      <span>Ver no Player</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* File Upload for Estilo 1 */}
                  <div className="p-3 rounded-xl border border-dashed border-amber-500/30 bg-amber-950/10 flex flex-col justify-between space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>Subir Arquivo Local .mp4 (Festa)</span>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/*"
                      onChange={(e) => handleStyleVideoFileChange('aniversario', e)}
                      className="w-full text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-amber-400/30 file:text-amber-200 hover:file:bg-amber-400/50 cursor-pointer"
                    />
                    {localVideoFiles.aniversario && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {localVideoFiles.aniversario.name} ({(localVideoFiles.aniversario.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    )}
                  </div>

                  {/* URL Input for Estilo 1 */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">
                      URL Pública na VPS / CDN (Festa)
                    </label>
                    <input
                      type="url"
                      placeholder="https://sua-vps.com/videos/01_hulk_festa.mp4"
                      value={formData.occasionVideos?.aniversario || formData.videoUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          videoUrl: val,
                          occasionVideos: {
                            ...(formData.occasionVideos || {}),
                            aniversario: val
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Ex: 01_{formData.name?.toLowerCase().replace(/\s+/g, '_') || 'personagem'}_festa.mp4</span>
                      {currentCharScript?.scripts.find(s => s.occasion === 'aniversario')?.officialUrl && (
                        <a
                          href={currentCharScript.scripts.find(s => s.occasion === 'aniversario')?.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-0.5"
                        >
                          <Download className="w-2.5 h-2.5" />
                          <span>Baixar Original ({currentCharScript.scripts.find(s => s.occasion === 'aniversario')?.fileSizeMb})</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transcribed speech quote snippet */}
                {currentCharScript?.scripts.find(s => s.occasion === 'aniversario') && (
                  <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Abertura Oficial Falada (0 a 3s):
                      </span>
                      <p className="italic text-slate-300 text-[11px]">
                        "{currentCharScript.scripts.find(s => s.occasion === 'aniversario')?.transcriptGreeting}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyScriptPrompt(
                        currentCharScript.scripts.find(s => s.occasion === 'aniversario')?.elevenLabsPrompt || '',
                        'script_aniv'
                      )}
                      className="text-[10px] px-2 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold rounded-lg border border-amber-400/40 flex items-center gap-1 flex-shrink-0"
                    >
                      {copiedScriptId === 'script_aniv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedScriptId === 'script_aniv' ? 'Copiado' : 'Copiar Prompt n8n'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ESTILO 2: ELOGIO & BONS HÁBITOS (Quando styleMode === 'triple') */}
              {styleMode === 'triple' && (
                <div className={`p-4 rounded-2xl border transition-all ${
                  selectedStyle === 'elogio'
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-purple-300">
                          Estilo 2: Elogio & Bons Hábitos
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Acionado quando os pais escolhem "Elogiar e Bons Hábitos" no formulário da loja.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStyle('elogio');
                          if (videoRef.current) videoRef.current.currentTime = 0;
                        }}
                        className="text-xs text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30"
                      >
                        <Play className="w-3 h-3" />
                        <span>Ver no Player</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* File Upload for Estilo 2 */}
                    <div className="p-3 rounded-xl border border-dashed border-purple-500/30 bg-purple-950/10 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                        <UploadCloud className="w-4 h-4 text-purple-400" />
                        <span>Subir Arquivo Local .mp4 (Elogio)</span>
                      </div>
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/*"
                        onChange={(e) => handleStyleVideoFileChange('elogio', e)}
                        className="w-full text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-purple-500/30 file:text-purple-200 hover:file:bg-purple-500/50 cursor-pointer"
                      />
                      {localVideoFiles.elogio && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {localVideoFiles.elogio.name} ({(localVideoFiles.elogio.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      )}
                    </div>

                    {/* URL Input for Estilo 2 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300">
                        URL Pública na VPS / CDN (Elogio)
                      </label>
                      <input
                        type="url"
                        placeholder="https://sua-vps.com/videos/02_hulk_elogio.mp4"
                        value={formData.occasionVideos?.elogio || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            occasionVideos: {
                              ...(formData.occasionVideos || {}),
                              elogio: e.target.value
                            }
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                      />
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Ex: 02_{formData.name?.toLowerCase().replace(/\s+/g, '_') || 'personagem'}_elogio.mp4</span>
                        {currentCharScript?.scripts.find(s => s.occasion === 'elogio')?.officialUrl && (
                          <a
                            href={currentCharScript.scripts.find(s => s.occasion === 'elogio')?.officialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:underline flex items-center gap-0.5"
                          >
                            <Download className="w-2.5 h-2.5" />
                            <span>Baixar Original ({currentCharScript.scripts.find(s => s.occasion === 'elogio')?.fileSizeMb})</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Transcribed speech quote snippet */}
                  {currentCharScript?.scripts.find(s => s.occasion === 'elogio') && (
                    <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                          Abertura Oficial Falada:
                        </span>
                        <p className="italic text-slate-300 text-[11px]">
                          "{currentCharScript.scripts.find(s => s.occasion === 'elogio')?.transcriptGreeting}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyScriptPrompt(
                          currentCharScript.scripts.find(s => s.occasion === 'elogio')?.elevenLabsPrompt || '',
                          'script_elogio'
                        )}
                        className="text-[10px] px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold rounded-lg border border-purple-500/40 flex items-center gap-1 flex-shrink-0"
                      >
                        {copiedScriptId === 'script_elogio' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScriptId === 'script_elogio' ? 'Copiado' : 'Copiar Prompt n8n'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ESTILO 3: VIRTUDES, CORAGEM & CONQUISTAS (Quando styleMode === 'triple') */}
              {styleMode === 'triple' && (
                <div className={`p-4 rounded-2xl border transition-all ${
                  selectedStyle === 'conquista'
                    ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-cyan-300">
                          Estilo 3: Virtudes, Coragem & Conquistas
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Acionado quando os pais escolhem "Parabenizar por Conquista ou Coragem".
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStyle('conquista');
                          if (videoRef.current) videoRef.current.currentTime = 0;
                        }}
                        className="text-xs text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30"
                      >
                        <Play className="w-3 h-3" />
                        <span>Ver no Player</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* File Upload for Estilo 3 */}
                    <div className="p-3 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/10 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-200">
                        <UploadCloud className="w-4 h-4 text-cyan-400" />
                        <span>Subir Arquivo Local .mp4 (Virtudes)</span>
                      </div>
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/*"
                        onChange={(e) => handleStyleVideoFileChange('conquista', e)}
                        className="w-full text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-cyan-500/30 file:text-cyan-200 hover:file:bg-cyan-500/50 cursor-pointer"
                      />
                      {localVideoFiles.conquista && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {localVideoFiles.conquista.name} ({(localVideoFiles.conquista.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      )}
                    </div>

                    {/* URL Input for Estilo 3 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300">
                        URL Pública na VPS / CDN (Virtudes)
                      </label>
                      <input
                        type="url"
                        placeholder="https://sua-vps.com/videos/03_hulk_virtudes.mp4"
                        value={formData.occasionVideos?.conquista || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            occasionVideos: {
                              ...(formData.occasionVideos || {}),
                              conquista: e.target.value
                            }
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Ex: 03_{formData.name?.toLowerCase().replace(/\s+/g, '_') || 'personagem'}_virtudes.mp4</span>
                        {currentCharScript?.scripts.find(s => s.occasion === 'conquista')?.officialUrl && (
                          <a
                            href={currentCharScript.scripts.find(s => s.occasion === 'conquista')?.officialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-0.5"
                          >
                            <Download className="w-2.5 h-2.5" />
                            <span>Baixar Original ({currentCharScript.scripts.find(s => s.occasion === 'conquista')?.fileSizeMb})</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Transcribed speech quote snippet */}
                  {currentCharScript?.scripts.find(s => s.occasion === 'conquista') && (
                    <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          Abertura Oficial Falada:
                        </span>
                        <p className="italic text-slate-300 text-[11px]">
                          "{currentCharScript.scripts.find(s => s.occasion === 'conquista')?.transcriptGreeting}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyScriptPrompt(
                          currentCharScript.scripts.find(s => s.occasion === 'conquista')?.elevenLabsPrompt || '',
                          'script_virtudes'
                        )}
                        className="text-[10px] px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold rounded-lg border border-cyan-500/40 flex items-center gap-1 flex-shrink-0"
                      >
                        {copiedScriptId === 'script_virtudes' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScriptId === 'script_virtudes' ? 'Copiado' : 'Copiar Prompt n8n'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CUT TIMINGS AND ELEVENLABS VOICE ID */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                <span>Marcação de Tempo para Corte e Voz</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Silêncio Início (seg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.customSlotStart || 0}
                    onChange={(e) => setFormData({ ...formData, customSlotStart: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Silêncio Fim / Nome (seg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.customSlotEnd || 2.8}
                    onChange={(e) => setFormData({ ...formData, customSlotEnd: parseFloat(e.target.value) || 2.8 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Trecho Voz Início (seg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.voiceSampleStart || 3.0}
                    onChange={(e) => setFormData({ ...formData, voiceSampleStart: parseFloat(e.target.value) || 3.0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Trecho Voz Fim (seg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.voiceSampleEnd || 20.0}
                    onChange={(e) => setFormData({ ...formData, voiceSampleEnd: parseFloat(e.target.value) || 20.0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* ElevenLabs Voice ID Field */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    <span>Voice ID do ElevenLabs</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Preenchido após clonar ou insira manualmente</span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: 21m00Tcm4TlvDq8ikWAM"
                  value={formData.elevenLabsVoiceId || ''}
                  onChange={(e) => setFormData({ ...formData, elevenLabsVoiceId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* SAVE BUTTONS */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              {selectedChar ? (
                <button
                  type="button"
                  onClick={() => handleOpenDelete(selectedChar)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition flex items-center gap-1.5"
                  title="Excluir este personagem"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Personagem</span>
                </button>
              ) : <div />}
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-magic px-6 py-2.5 text-xs font-black text-slate-950 flex items-center gap-2 shadow-lg"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvar Personagem & Vídeos</span>
                </button>
              </div>
            </div>
          </form>

          {/* CALLOUT TO N8N WORKFLOWS TAB */}
          <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-950/20 via-purple-950/20 to-slate-900 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Quer automatizar a renderização dos vídeos com o nome no n8n?
                </h4>
                <p className="text-xs text-slate-300">
                  Os 3 fluxos completos do n8n com ElevenLabs e FFmpeg já vêm prontos para importar na aba "Fluxos n8n".
                </p>
              </div>
            </div>

            {onNavigateToN8N && (
              <button
                type="button"
                onClick={onNavigateToN8N}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-md"
              >
                <span>Abrir Fluxos n8n</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: CRIAR / CADASTRAR NOVO PERSONAGEM */}
      <CreateEditCharacterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCharacterFromModal}
      />

      {/* MODAL: CONFIRMAÇÃO DE EXCLUSÃO DE PERSONAGEM */}
      <ConfirmDialogModal
        isOpen={Boolean(characterToDelete)}
        onClose={() => setCharacterToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Personagem"
        message={`Tem certeza que deseja excluir o personagem "${characterToDelete?.name}" da biblioteca? Esta ação removerá o personagem do site e das consultas dos clientes.`}
        confirmText="Sim, Excluir Personagem"
        cancelText="Cancelar"
        type="danger"
        characterPreview={characterToDelete ? {
          name: characterToDelete.name,
          emoji: characterToDelete.emoji,
          image: characterToDelete.image
        } : undefined}
      />

      {/* MODAL: RESTAURAR PERSONAGENS PADRÕES */}
      <ConfirmDialogModal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        onConfirm={handleConfirmReset}
        title="Restaurar Biblioteca Padrão"
        message="Deseja restaurar todos os personagens originais de fábrica com os vídeos base da VPS e ocasiões padrões? Personagens personalizados adicionados serão removidos."
        confirmText="Restaurar Padrões"
        cancelText="Cancelar"
        type="warning"
      />

      {/* TOAST FLUTUANTE DE NOTIFICAÇÕES */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-xs font-bold shadow-2xl animate-fadeIn flex items-center gap-2.5 border ${
          toast.type === 'success'
            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
            : toast.type === 'error'
            ? 'bg-rose-950 border-rose-500/50 text-rose-200 shadow-rose-950/50'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* MODAL: DOSSIÊ DE CÓPIAS & FALAS DE TODOS OS PERSONAGENS */}
      {showScriptsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#160e2b] border border-purple-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-950/60 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center font-bold text-slate-950">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    Dossiê de Cópias, Roteiros & Falas Originais
                  </h3>
                  <p className="text-xs text-slate-300">
                    Transcrição palavra por palavra dos áudios oficiais, com o ponto exato da fala do nome e link dos vídeos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowScriptsModal(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="p-4 border-b border-white/5 bg-black/30">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar personagem (ex: Hulk, Homem-Aranha, Barbie, Neymar...)"
                  value={scriptsSearch}
                  onChange={(e) => setScriptsSearch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* List of Characters and Scripts */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {CHARACTER_SCRIPTS.filter((cs) =>
                cs.name.toLowerCase().includes(scriptsSearch.toLowerCase())
              ).map((charScript) => (
                <div
                  key={charScript.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{charScript.emoji}</span>
                      <div>
                        <h4 className="font-display font-bold text-base text-white">
                          {charScript.name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                          charScript.styleMode === 'triple'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-semibold'
                        }`}>
                          {charScript.styleMode === 'triple' ? '3 Vídeos Base (Festa, Elogio, Virtudes)' : '1 Vídeo Base Único'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scripts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {charScript.scripts.map((script) => (
                      <div
                        key={script.occasion}
                        className="rounded-xl border border-white/5 bg-black/40 p-3.5 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                              <span>{script.occasionEmoji}</span>
                              <span>{script.occasionLabel}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {script.slotSeconds}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                              Abertura Falada:
                            </span>
                            <p className="text-xs italic text-slate-200 bg-white/5 p-2 rounded-lg leading-relaxed">
                              "{script.transcriptGreeting}"
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-purple-300 uppercase font-semibold block">
                              Prompt ElevenLabs (n8n):
                            </span>
                            <p className="text-[11px] font-mono text-purple-200/90 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20 leading-relaxed">
                              {script.elevenLabsPrompt}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                          {script.officialUrl && (
                            <a
                              href={script.officialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              <Download className="w-3 h-3" />
                              <span>Baixar MP4 ({script.fileSizeMb})</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCopyScriptPrompt(script.elevenLabsPrompt, `${charScript.id}_${script.occasion}`)}
                            className="text-[10px] px-2 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded font-bold border border-amber-400/40 flex items-center gap-1 ml-auto"
                          >
                            {copiedScriptId === `${charScript.id}_${script.occasion}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>Total de personagens catalogados: {CHARACTER_SCRIPTS.length}</span>
              <button
                type="button"
                onClick={() => setShowScriptsModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
