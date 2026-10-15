import { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'homem_aranha',
    name: 'Homem-Aranha',
    emoji: '🕷️',
    image: 'https://www.recadinhomagico.com.br/videos/homem_aranha/homem_aranha_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/homem_aranha/01_homem_aranha_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/homem_aranha/01_homem_aranha_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/homem_aranha/02_homem_aranha_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/homem_aranha/03_homem_aranha_virtudes.mp4'
    },
    color: 'from-red-600 to-blue-700',
    gender: 'boy',
    category: 'herois',
    badge: 'Mais Pedido',
    samplePhrase: 'E aí, campeão! O amigão da vizinhança tem uma mensagem especial pra você!',
    description: 'O herói favorito das crianças com mensagem sobre coragem e grandes poderes.'
  },
  {
    id: 'patrulha_canina',
    name: 'Patrulha Canina',
    emoji: '🐾',
    image: 'https://www.recadinhomagico.com.br/videos/patrulha_canina/patrulha_canina_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/patrulha_canina/01_patrulha_canina_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/patrulha_canina/01_patrulha_canina_festa.mp4'
    },
    color: 'from-blue-600 to-red-600',
    gender: 'neutral',
    category: 'herois',
    badge: 'Favorito Geral',
    samplePhrase: 'Nenhum filhote é pequeno demais quando o assunto é comemorar com você!',
    description: 'Toda a turma de filhotes reunida em uma aventura de aniversário.'
  },
  {
    id: 'skye',
    name: 'Skye',
    emoji: '🐾',
    image: 'https://www.recadinhomagico.com.br/videos/skye/skye_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/skye/01_skye_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/skye/01_skye_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/skye/02_skye_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/skye/03_skye_virtudes.mp4'
    },
    color: 'from-pink-500 to-rose-400',
    gender: 'girl',
    category: 'princesas',
    badge: 'Meninas Amam',
    samplePhrase: 'Esse filhote vai voar alto pra te dar um abraço bem fofinho!',
    description: 'A filhote mais amada pronta para encantar corações pequeninos.'
  },
  {
    id: 'chase',
    name: 'Chase',
    emoji: '🐾',
    image: 'https://www.recadinhomagico.com.br/videos/chase_patrulha_canina/chase_patrulha_canina.png',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/chase_patrulha_canina/01_chase_patrulha_canina_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/chase_patrulha_canina/01_chase_patrulha_canina_festa.mp4'
    },
    color: 'from-blue-700 to-indigo-800',
    gender: 'boy',
    category: 'herois',
    badge: 'Patrulha Canina',
    samplePhrase: 'O Chase está no caso! Preparado para a nossa missão especial?',
    description: 'O cão policial corajoso em uma chamada mágica direto da Baía da Aventura.'
  },
  {
    id: 'elsa',
    name: 'Elsa Frozen',
    emoji: '❄️',
    image: 'https://www.recadinhomagico.com.br/characters/elsa.webp',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/elza/01_Elsa_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/elza/01_Elsa_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/elza/02_elsa_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/elza/03_elsa_virtudes.mp4'
    },
    color: 'from-sky-400 to-blue-600',
    gender: 'girl',
    category: 'princesas',
    badge: 'Encantador',
    samplePhrase: 'O frio nunca incomodou, mas hoje meu coração está quentinho de alegria por você!',
    description: 'A Rainha de Arendelle traz toda a magia da neve e amor fraterno.'
  },
  {
    id: 'moana',
    name: 'Moana',
    emoji: '🌊',
    image: 'https://www.recadinhomagico.com.br/videos/moana/moana_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/moana/01_moana_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/moana/01_moana_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/moana/02_moana_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/moana/03_moana_virtudes.mp4'
    },
    color: 'from-teal-500 to-emerald-600',
    gender: 'girl',
    category: 'princesas',
    badge: 'Aventura',
    samplePhrase: 'O oceano me chamou para te contar o quanto você é especial e corajosa!',
    description: 'Uma jornada inesquecível pelo oceano com a corajosa navegadora.'
  },
  {
    id: 'barbie',
    name: 'Barbie',
    emoji: '👸🏼',
    image: 'https://www.recadinhomagico.com.br/characters/barbie.webp',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/barbie/02_barbie_elogio_compressed.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/barbie/01_festa_videobarbie1.mov',
      elogio: 'https://www.recadinhomagico.com.br/videos/barbie/02_barbie_elogio_compressed.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/barbie/03_barbie_virtudes_compressed.mp4'
    },
    color: 'from-pink-500 to-fuchsia-600',
    gender: 'girl',
    category: 'princesas',
    badge: 'Brilho Total',
    samplePhrase: 'Você pode ser tudo o que quiser! Nunca se esqueça da sua luz incrível.',
    description: 'Gentileza, carinho e inspiração para todas as fases da infância.'
  },
  {
    id: 'batman',
    name: 'Batman',
    emoji: '🦇',
    image: 'https://www.recadinhomagico.com.br/videos/batman/batman_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/batman/01_batman_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/batman/01_batman_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/batman/02_batman_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/batman/03_batman_virtudes.mp4'
    },
    color: 'from-slate-700 to-zinc-900',
    gender: 'boy',
    category: 'herois',
    badge: 'Cavaleiro das Trevas',
    samplePhrase: 'Gotham está segura hoje porque temos um novo herói comemorando!',
    description: 'Voz marcante e imponente, elogiando a força e inteligência da criança.'
  },
  {
    id: 'hulk',
    name: 'Hulk',
    emoji: '🟢',
    image: 'https://www.recadinhomagico.com.br/videos/hulk/hulk_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/hulk/01_hulk_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/hulk/01_hulk_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/hulk/02_hulk_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/hulk/03_hulk_virtudes.mp4'
    },
    color: 'from-emerald-600 to-green-800',
    gender: 'boy',
    category: 'herois',
    badge: 'Super Força',
    samplePhrase: 'HULK ESMAGA a tristeza e manda um abraço super gigante pra você!',
    description: 'O gigante esmeralda mais carinhoso e divertido da galáxia.'
  },
  {
    id: 'stitch',
    name: 'Stitch',
    emoji: '💙',
    image: 'https://www.recadinhomagico.com.br/videos/stitch/stitch_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/stitch/01_stitch_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/stitch/01_stitch_festa.mp4'
    },
    color: 'from-blue-500 to-indigo-600',
    gender: 'neutral',
    category: 'aventura',
    badge: 'Ohana Querida',
    samplePhrase: 'Ohana quer dizer família, e família quer dizer nunca abandonar ou esquecer você!',
    description: 'Fofo, travesso e com um recado cheio de amor sobre família.'
  },
  {
    id: 'mario',
    name: 'Mario Bros',
    emoji: '🍄',
    image: 'https://www.recadinhomagico.com.br/videos/mario/01_mario_festa.png',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/mario/01_mario_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/mario/01_mario_festa.mp4'
    },
    color: 'from-red-600 to-amber-500',
    gender: 'boy',
    category: 'aventura',
    badge: 'Mundo dos Jogos',
    samplePhrase: 'Mamma mia! Hoje é dia de subir de nível e comemorar bastante!',
    description: 'O encanador mais famoso do mundo trazendo diversão e cogumelos de energia.'
  },
  {
    id: 'gabby',
    name: 'A Casa Mágica da Gabby',
    emoji: '🐱',
    image: 'https://www.recadinhomagico.com.br/videos/gabby_casa_magica/01_gabyy_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/gabby_casa_magica/01_gabyy_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/gabby_casa_magica/01_gabyy_festa.mp4'
    },
    color: 'from-purple-500 to-pink-500',
    gender: 'girl',
    category: 'aventura',
    badge: 'Gatinhos Fofos',
    samplePhrase: 'Um beliscãozinho na orelha esquerda e um na direita pra começar a festa!',
    description: 'Mágica, música e fofura com Gabby e seus amigos gatinhos.'
  },
  {
    id: 'neymar',
    name: 'Neymar Minicraque',
    emoji: '⚽',
    image: 'https://www.recadinhomagico.com.br/videos/neymar_minicraque/neymar_minicraque_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/neymar_minicraque/01_neymar_minicraque_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/neymar_minicraque/01_neymar_minicraque_festa.mp4'
    },
    color: 'from-yellow-400 to-emerald-600',
    gender: 'boy',
    category: 'herois',
    badge: 'Futebol & Craque',
    samplePhrase: 'Fala meu craque! Recebi a notícia do seu dia e vim bater uma bola com você!',
    description: 'Para as crianças apaixonadas por futebol e dribles inesquecíveis.'
  },
  {
    id: 'relampago_mcqueen',
    name: 'Relâmpago McQueen',
    emoji: '🏎️',
    image: 'https://www.recadinhomagico.com.br/videos/relampago_mcqueen/relampago_mcqueen_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/relampago_mcqueen/01_relampago_mcqueen_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/relampago_mcqueen/01_relampago_mcqueen_festa.mp4'
    },
    color: 'from-red-600 to-amber-600',
    gender: 'boy',
    category: 'aventura',
    badge: 'Kachow!',
    samplePhrase: 'Kachow! Acelerei na pista a mais de 300km/h só pra te parabenizar!',
    description: 'Velocidade, emoção e a energia contagiante de Radiator Springs.'
  },
  {
    id: 'ninjago',
    name: 'Ninjago Lego',
    emoji: '🥷',
    image: 'https://www.recadinhomagico.com.br/videos/nijago_lego/nijago_lego_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/nijago_lego/01_nijago_lego_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/nijago_lego/01_nijago_lego_festa.mp4'
    },
    color: 'from-emerald-500 to-yellow-500',
    gender: 'boy',
    category: 'aventura',
    badge: 'Mestres do Spinjitzu',
    samplePhrase: 'Ninja jamais desiste! Sua coragem e lealdade inspiram todo o mosteiro!',
    description: 'Ação e sabedoria ninja para os pequenos heróis cheios de energia.'
  },
  {
    id: 'jesus',
    name: 'Jesus com as Crianças',
    emoji: '🕊️',
    image: 'https://www.recadinhomagico.com.br/videos/jesus/jesus_festa.jpg',
    videoUrl: 'https://www.recadinhomagico.com.br/videos/jesus/01_jesus_festa.mp4',
    occasionVideos: {
      aniversario: 'https://www.recadinhomagico.com.br/videos/jesus/01_jesus_festa.mp4',
      elogio: 'https://www.recadinhomagico.com.br/videos/jesus/02_jesus_elogio.mp4',
      conquista: 'https://www.recadinhomagico.com.br/videos/jesus/03_jesus_virtudes.mp4'
    },
    color: 'from-amber-400 to-sky-500',
    gender: 'neutral',
    category: 'biblicos',
    badge: 'Bênção & Fé',
    samplePhrase: 'Deixai vir a mim as criancinhas. Que a luz e a paz estejam sempre no seu coração.',
    description: 'Uma mensagem sagrada, repleta de afeto, paz e proteção celestial.'
  }
];

export const CATEGORIES = [
  { id: 'todos', label: '✨ Todos os Personagens' },
  { id: 'herois', label: '🦸‍♂️ Heróis & Patrulha' },
  { id: 'princesas', label: '👑 Princesas & Fadas' },
  { id: 'aventura', label: '🚀 Aventura & Jogos' },
  { id: 'biblicos', label: '🕊️ Especiais & Fé' }
];

export const GENDERS = [
  { id: 'todos', label: '✨ Para Todos' },
  { id: 'boy', label: '👦 Meninos' },
  { id: 'girl', label: '👧 Meninas' }
];
