import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Character, CharacterCategory, CharacterGender } from '../../types';
import { CATEGORIES, GENDERS } from '../../data/characters';
import { getStoredCharacters } from '../../services/characterStore';
import { Search, HelpCircle, Check, X, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface CharacterSelectorProps {
  onSelectCharacter: (character: Character) => void;
  selectedCharacter: Character | null;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  onSelectCharacter,
  selectedCharacter
}) => {
  const [characterList, setCharacterList] = useState<Character[]>(() => getStoredCharacters());
  const [selectedCategory, setSelectedCategory] = useState<CharacterCategory>('todos');
  const [selectedGender, setSelectedGender] = useState<CharacterGender | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedCharacter, setRequestedCharacter] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    const handleUpdate = () => {
      setCharacterList(getStoredCharacters());
    };
    window.addEventListener('studio_characters_updated', handleUpdate);
    return () => window.removeEventListener('studio_characters_updated', handleUpdate);
  }, []);

  const filteredCharacters = useMemo(() => {
    return characterList.filter((c) => {
      // Category filter
      if (selectedCategory !== 'todos' && c.category !== selectedCategory) {
        return false;
      }
      // Gender filter
      if (selectedGender !== 'todos' && c.gender !== 'neutral' && c.gender !== selectedGender) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedGender, searchQuery]);

  const handlePlayVoicePreview = (e: React.MouseEvent, char: Character) => {
    e.stopPropagation(); // Don't trigger character select immediately

    if (playingVoiceId === char.id) {
      // Pause
      audioPlayerRef.current?.pause();
      setPlayingVoiceId(null);
      return;
    }

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }

    const player = audioPlayerRef.current;
    player.src = char.videoUrl;
    player.currentTime = 0;
    player.play()
      .then(() => {
        setPlayingVoiceId(char.id);
        // Automatically stop after 6 seconds preview
        setTimeout(() => {
          if (audioPlayerRef.current?.src === char.videoUrl) {
            audioPlayerRef.current?.pause();
            setPlayingVoiceId(null);
          }
        }, 6000);
      })
      .catch((err) => {
        console.warn('Voice preview blocked:', err);
      });
  };

  const handleSendCustomRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedCharacter.trim()) return;
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setShowRequestModal(false);
      setRequestedCharacter('');
      setRequesterPhone('');
    }, 2800);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Qual personagem a criança ama?
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Toque no personagem favorito para começar a personalização gratuita
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CharacterCategory)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200 shadow-sm shadow-fuchsia-500/25'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-purple-400/40 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Gender Filter Buttons & Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2">
          {GENDERS.map((g) => {
            const isActive = selectedGender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGender(g.id as CharacterGender | 'todos')}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar personagem..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Characters Grid */}
      {filteredCharacters.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="text-sm">Nenhum personagem encontrado com esses filtros.</p>
          <button
            onClick={() => {
              setSelectedCategory('todos');
              setSelectedGender('todos');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-amber-400 hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredCharacters.map((character) => {
            const isSelected = selectedCharacter?.id === character.id;
            const isVoicePlaying = playingVoiceId === character.id;

            return (
              <div
                key={character.id}
                onClick={() => onSelectCharacter(character)}
                className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border text-left transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-fuchsia-400 ${
                  isSelected
                    ? 'border-fuchsia-400 ring-2 ring-fuchsia-400 shadow-xl shadow-fuchsia-500/30 scale-[1.02]'
                    : 'border-white/10 hover:border-fuchsia-400/60 hover:scale-[1.01]'
                }`}
              >
                {/* Character Image */}
                <img
                  src={character.image}
                  alt={character.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://www.recadinhomagico.com.br/characters/mystery-character.png';
                  }}
                />

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-md">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                )}

                {/* Quick Voice Preview Button */}
                <button
                  type="button"
                  onClick={(e) => handlePlayVoicePreview(e, character)}
                  title="Ouvir voz do personagem"
                  className={`absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold backdrop-blur-md transition ${
                    isVoicePlaying
                      ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white ring-2 ring-cyan-300 shadow-md'
                      : 'bg-black/60 text-white hover:bg-fuchsia-500 hover:text-white'
                  }`}
                >
                  {isVoicePlaying ? (
                    <>
                      <VolumeX className="h-3 w-3 animate-pulse" />
                      <span>Parar</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3 w-3" />
                      <span>Voz</span>
                    </>
                  )}
                </button>

                {/* Scrim and Details */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 pt-8">
                  <span className="mb-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-sm">
                    {character.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{character.emoji}</span>
                    <span className="font-display text-sm sm:text-base font-bold text-white line-clamp-1">
                      {character.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Didn't find character button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-amber-400/50 hover:bg-white/10 hover:text-white"
        >
          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
          Não achou o personagem que queria? Clique aqui
        </button>
      </div>

      {/* Modal for requesting character */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-400/30 bg-[#1e1438] p-6 shadow-2xl">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {requestSent ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Pedido Recebido com Sucesso!
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Nossa equipe de animação vai conferir e te avisar pelo WhatsApp em até 2 horas úteis.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    Pedido Personalizado
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Qual personagem você gostaria?
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Informe o personagem desejado e seu WhatsApp. Criamos novos heróis constantemente!
                </p>

                <form onSubmit={handleSendCustomRequest} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nome do Personagem ou Desenho
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Sonic, Bob Esponja, Ladybug..."
                      value={requestedCharacter}
                      onChange={(e) => setRequestedCharacter(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Seu WhatsApp com DDD
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(DD) 99999-9999"
                      value={requesterPhone}
                      onChange={(e) => setRequesterPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 shadow-md"
                  >
                    Enviar Pedido de Personagem
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
