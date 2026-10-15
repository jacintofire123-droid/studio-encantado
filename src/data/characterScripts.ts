export interface CharacterStyleScript {
  occasion: 'aniversario' | 'elogio' | 'conquista';
  occasionLabel: string;
  occasionEmoji: string;
  officialUrl?: string;
  suggestedFileName: string;
  fileSizeMb?: string;
  slotSeconds: string; // ex: "0.0s a 2.8s"
  transcriptGreeting: string; // Frase exata de abertura
  fullTranscript: string; // Roteiro completo
  elevenLabsPrompt: string; // Texto pronto com [NOME DA CRIANÇA]
}

export interface CharacterScriptItem {
  id: string;
  name: string;
  emoji: string;
  styleMode: 'single' | 'triple';
  defaultOccasion: 'aniversario';
  scripts: CharacterStyleScript[];
}

export const CHARACTER_SCRIPTS: CharacterScriptItem[] = [
  {
    id: 'hulk',
    name: 'Hulk',
    emoji: '🟢',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/hulk/01_hulk_festa.mp4',
        suggestedFileName: '01_hulk_festa.mp4',
        fileSizeMb: '32.8 MB',
        slotSeconds: '0.0s a 3.1s',
        transcriptGreeting: 'Hulk esmaga a tristeza! Hulk veio aqui desejar um super feliz aniversário pro [NOME]!',
        fullTranscript: 'Hulk esmaga a tristeza! Hulk veio aqui desejar um super feliz aniversário pro [NOME]! Hoje é dia de muita força, de comer bolo gigante e comemorar com toda a família dos Vingadores! Hulk manda um abraço esmagador de amor!',
        elevenLabsPrompt: 'Hulk esmaga a tristeza! Hulk veio aqui desejar um super feliz aniversário para o [NOME DA CRIANÇA]!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Bons Hábitos',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/hulk/02_hulk_elogio.mp4',
        suggestedFileName: '02_hulk_elogio.mp4',
        fileSizeMb: '29.4 MB',
        slotSeconds: '0.0s a 3.0s',
        transcriptGreeting: 'Hulk muito orgulhoso! [NOME] tá comendo legumes e sendo um super herói!',
        fullTranscript: 'Hulk muito orgulhoso! [NOME] tá comendo legumes, escovando os dentes e ouvindo o papai e a mamãe! Para ter super força de verdade, o segredo é disciplina e bom coração! Hulk tá muito feliz com você!',
        elevenLabsPrompt: 'Hulk muito orgulhoso! [NOME DA CRIANÇA] tá comendo legumes e escovando os dentes como um verdadeiro herói!'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes, Coragem & Conquistas',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/hulk/03_hulk_virtudes.mp4',
        suggestedFileName: '03_hulk_virtudes.mp4',
        fileSizeMb: '31.1 MB',
        slotSeconds: '0.0s a 3.0s',
        transcriptGreeting: 'Hulk viu a força e o coração gigante do [NOME]!',
        fullTranscript: 'Hulk viu a força e o coração gigante do [NOME]! Quando você é corajoso e defende quem você ama, seu coração fica mais forte que o Hulk! Nunca tenha medo, campeão!',
        elevenLabsPrompt: 'Hulk viu a força e o coração gigante do [NOME DA CRIANÇA]! Você é corajoso e especial!'
      }
    ]
  },
  {
    id: 'homem_aranha',
    name: 'Homem-Aranha',
    emoji: '🕷️',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/homem_aranha/01_homem_aranha_festa.mp4',
        suggestedFileName: '01_homem_aranha_festa.mp4',
        fileSizeMb: '30.5 MB',
        slotSeconds: '0.0s a 2.8s',
        transcriptGreeting: 'Fala, [NOME]! Aqui é o seu amigão da vizinhança, o Homem-Aranha!',
        fullTranscript: 'Fala, [NOME]! Aqui é o seu amigão da vizinhança, o Homem-Aranha! Tô falando direto do topo dos prédios de Nova York porque meus radares de aranha detectaram uma data ultra especial: o seu aniversário! Parabéns, campeão!',
        elevenLabsPrompt: 'Fala, [NOME DA CRIANÇA]! Aqui é o seu amigão da vizinhança, o Homem-Aranha! Parabéns pelo seu aniversário!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Bons Hábitos',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/homem_aranha/02_homem_aranha_elogio.mp4',
        suggestedFileName: '02_homem_aranha_elogio.mp4',
        fileSizeMb: '28.7 MB',
        slotSeconds: '0.0s a 2.8s',
        transcriptGreeting: 'E aí, [NOME]! Amigão da vizinhança passando pra te parabenizar pela sua atitude!',
        fullTranscript: 'E aí, [NOME]! O Homem-Aranha passando pra te dar os parabéns! Sabia que ser um verdadeiro herói começa em casa, ajudando a família e guardando os brinquedos? Continue com essa dedicação espetacular!',
        elevenLabsPrompt: 'E aí, [NOME DA CRIANÇA]! Amigão da vizinhança passando pra te parabenizar pela sua dedicação e bons hábitos!'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes & Coragem',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/homem_aranha/03_homem_aranha_virtudes.mp4',
        suggestedFileName: '03_homem_aranha_virtudes.mp4',
        fileSizeMb: '30.1 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Fala, [NOME]! O Homem-Aranha tem um recado sobre coragem pra você!',
        fullTranscript: 'Fala, [NOME]! O Homem-Aranha tem um recado muito especial sobre coragem pra você. Com grandes poderes vêm grandes responsabilidades. E a sua bondade é o seu maior superpoder!',
        elevenLabsPrompt: 'Fala, [NOME DA CRIANÇA]! O Homem-Aranha tem um recado sobre grandes poderes e muita coragem pra você!'
      }
    ]
  },
  {
    id: 'batman',
    name: 'Batman',
    emoji: '🦇',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/batman/01_batman_festa.mp4',
        suggestedFileName: '01_batman_festa.mp4',
        fileSizeMb: '34.2 MB',
        slotSeconds: '0.0s a 3.4s',
        transcriptGreeting: 'Aqui é o Batman falando direto da Batcaverna para o [NOME]!',
        fullTranscript: 'Aqui é o Batman falando direto da Batcaverna para o [NOME]! O Batcomputador emitiu um alerta prioritário em Gotham hoje: é dia de comemorar a vida de um novo e destemido herói. Parabéns pelo seu aniversário!',
        elevenLabsPrompt: 'Aqui é o Batman falando direto da Batcaverna para o [NOME DA CRIANÇA]! Parabéns pelo seu aniversário!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Disciplina',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/batman/02_batman_elogio.mp4',
        suggestedFileName: '02_batman_elogio.mp4',
        fileSizeMb: '32.1 MB',
        slotSeconds: '0.0s a 3.2s',
        transcriptGreeting: 'Aqui é o Batman. [NOME], recebi relatórios impressionantes sobre a sua conduta.',
        fullTranscript: 'Aqui é o Batman. [NOME], recebi relatórios impressionantes sobre a sua disciplina e respeito. Quem cumpre suas tarefas e estuda com dedicação está pronto para proteger o futuro.',
        elevenLabsPrompt: 'Aqui é o Batman. [NOME DA CRIANÇA], recebi relatórios impressionantes sobre a sua dedicação e respeito aos pais.'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes & Justiça',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/batman/03_batman_virtudes.mp4',
        suggestedFileName: '03_batman_virtudes.mp4',
        fileSizeMb: '33.5 MB',
        slotSeconds: '0.0s a 3.2s',
        transcriptGreeting: 'Aqui é o Batman. A sua bravura foi reconhecida, [NOME].',
        fullTranscript: 'Aqui é o Batman. A sua bravura foi reconhecida, [NOME]. A escuridão nunca assusta aqueles que carregam a luz da justiça e do amor no coração. Mantenha seu foco e sua força.',
        elevenLabsPrompt: 'Aqui é o Batman. A sua bravura e retidão foram reconhecidas, [NOME DA CRIANÇA]!'
      }
    ]
  },
  {
    id: 'barbie',
    name: 'Barbie',
    emoji: '👸🏼',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/barbie/01_festa_videobarbie1.mov',
        suggestedFileName: '01_barbie_festa.mov',
        fileSizeMb: '24.1 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Oi, [NOME]! Bem-vinda ao meu mundo cor-de-rosa!',
        fullTranscript: 'Oi, [NOME]! Bem-vinda ao meu mundo cor-de-rosa! Hoje o dia está brilhando com purpurina e muita alegria porque é o seu aniversário! Que a sua vida seja repleta de sonhos realizados e momentos inesquecíveis!',
        elevenLabsPrompt: 'Oi, [NOME DA CRIANÇA]! Bem-vinda ao meu mundo cor-de-rosa! Feliz aniversário!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Bons Hábitos',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/barbie/02_barbie_elogio_compressed.mp4',
        suggestedFileName: '02_barbie_elogio.mp4',
        fileSizeMb: '25.6 MB',
        slotSeconds: '0.0s a 2.8s',
        transcriptGreeting: 'Oi, [NOME]! Eu sou a Barbie e tenho muito orgulho de você!',
        fullTranscript: 'Oi, [NOME]! Eu sou a Barbie e tenho muito orgulho de você! Cuidar dos seus pertences, ser gentil e espalhar sorrisos transforma o mundo em um lugar muito mais iluminado!',
        elevenLabsPrompt: 'Oi, [NOME DA CRIANÇA]! Eu sou a Barbie e tenho muito orgulho da sua gentileza e carinho!'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes & Autoestima',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/barbie/03_barbie_virtudes_compressed.mp4',
        suggestedFileName: '03_barbie_virtudes.mp4',
        fileSizeMb: '31.2 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Oi, [NOME]! Lembre-se sempre: você pode ser tudo o que quiser!',
        fullTranscript: 'Oi, [NOME]! Lembre-se sempre: você pode ser tudo o que quiser! Cientista, bailarina, presidente, artista ou exploradora! A sua luz é única e ninguém pode apagar o seu brilho!',
        elevenLabsPrompt: 'Oi, [NOME DA CRIANÇA]! Lembre-se sempre: você pode ser tudo o que você quiser!'
      }
    ]
  },
  {
    id: 'elsa',
    name: 'Elsa Frozen',
    emoji: '❄️',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/elza/01_Elsa_festa.mp4',
        suggestedFileName: '01_elsa_festa.mp4',
        fileSizeMb: '28.9 MB',
        slotSeconds: '0.0s a 3.2s',
        transcriptGreeting: 'Olá, [NOME]! Sou eu, a Rainha Elsa de Arendelle!',
        fullTranscript: 'Olá, [NOME]! Sou eu, a Rainha Elsa de Arendelle! O castelo inteiro está coberto de flocos de neve mágicos para celebrar o seu dia especial! Que você tenha um aniversário brilhante e encantador!',
        elevenLabsPrompt: 'Olá, [NOME DA CRIANÇA]! Sou eu, a Rainha Elsa de Arendelle! Desejo um aniversário mágico para você!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Gentileza',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/elza/02_elsa_elogio.mp4',
        suggestedFileName: '02_elsa_elogio.mp4',
        fileSizeMb: '27.4 MB',
        slotSeconds: '0.0s a 3.0s',
        transcriptGreeting: 'Olá, [NOME]! O frio nunca incomodou, mas o calor do seu coração aquece todo mundo!',
        fullTranscript: 'Olá, [NOME]! O frio nunca incomodou, mas o calor do seu coração aquece todo mundo! Ver você ser carinhosa com quem ama me enche de alegria!',
        elevenLabsPrompt: 'Olá, [NOME DA CRIANÇA]! O calor do seu coração e a sua gentileza iluminam todos ao seu redor!'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes & Coragem',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/elza/03_elsa_virtudes.mp4',
        suggestedFileName: '03_elsa_virtudes.mp4',
        fileSizeMb: '29.3 MB',
        slotSeconds: '0.0s a 3.1s',
        transcriptGreeting: 'Olá, [NOME]! Nunca tenha medo de ser quem você é!',
        fullTranscript: 'Olá, [NOME]! Nunca tenha medo de ser quem você é! A verdadeira magia está dentro de você, na sua sinceridade e coragem.',
        elevenLabsPrompt: 'Olá, [NOME DA CRIANÇA]! Seja livre e corajosa, porque o seu poder de brilhar é infinito!'
      }
    ]
  },
  {
    id: 'neymar',
    name: 'Neymar Minicraque',
    emoji: '⚽',
    styleMode: 'single',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns de Craque',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/neymar_minicraque/01_neymar_minicraque_festa.mp4',
        suggestedFileName: '01_neymar_minicraque_festa.mp4',
        fileSizeMb: '31.3 MB',
        slotSeconds: '0.0s a 3.2s',
        transcriptGreeting: 'E aí, [NOME]! Aqui é o Neymar Jr. na área!',
        fullTranscript: 'E aí, [NOME]! Aqui é o Neymar Jr. na área! Vim bater essa bola com você e te desejar um aniversário de verdadeiro craque! Muita saúde, alegria, gols e drible bonito na vida! Tamo junto!',
        elevenLabsPrompt: 'E aí, [NOME DA CRIANÇA]! Aqui é o Neymar Jr. na área! Vim te desejar um feliz aniversário de camisa 10!'
      }
    ]
  },
  {
    id: 'relampago_mcqueen',
    name: 'Relâmpago McQueen',
    emoji: '🏎️',
    styleMode: 'single',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Parabéns em Alta Velocidade',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/relampago_mcqueen/01_relampago_mcqueen_festa.mp4',
        suggestedFileName: '01_relampago_mcqueen_festa.mp4',
        fileSizeMb: '30.1 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Kachow, [NOME]! Aqui é o Relâmpago McQueen na pista!',
        fullTranscript: 'Kachow, [NOME]! Aqui é o Relâmpago McQueen na pista! Acelerei a mais de 300km/h direto de Radiator Springs só pra te ver comemorar na primeira colocação do pódio hoje!',
        elevenLabsPrompt: 'Kachow, [NOME DA CRIANÇA]! Aqui é o Relâmpago McQueen direto de Radiator Springs para acelerar no seu aniversário!'
      }
    ]
  },
  {
    id: 'chase',
    name: 'Chase Patrulha Canina',
    emoji: '🐾',
    styleMode: 'single',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Missão de Aniversário',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/chase_patrulha_canina/01_chase_patrulha_canina_festa.mp4',
        suggestedFileName: '01_chase_patrulha_canina_festa.mp4',
        fileSizeMb: '33.7 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Atenção, Baía da Aventura! O Chase está no caso com o [NOME]!',
        fullTranscript: 'Atenção, Baía da Aventura! O Chase está no caso com o [NOME]! O Ryder nos convocou para uma missão de comemoração nível máximo! Parabéns pelo seu aniversário!',
        elevenLabsPrompt: 'Atenção, Baía da Aventura! O Chase está no caso! Parabéns pelo seu dia, [NOME DA CRIANÇA]!'
      }
    ]
  },
  {
    id: 'skye',
    name: 'Skye',
    emoji: '🐾',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa & Voo Alto',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/skye/01_skye_festa.mp4',
        suggestedFileName: '01_skye_festa.mp4',
        fileSizeMb: '29.8 MB',
        slotSeconds: '0.0s a 2.8s',
        transcriptGreeting: 'Au au! A Skye tá pronta pra voar alto com o [NOME]!',
        fullTranscript: 'Au au! A Skye tá pronta pra voar alto com o [NOME]! Coloquei meu helicóptero nos céus da Baía da Aventura para espalhar alegria e confete cor-de-rosa no seu aniversário!',
        elevenLabsPrompt: 'Au au! A Skye tá pronta pra voar alto no aniversário do [NOME DA CRIANÇA]!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Carinho',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/skye/02_skye_elogio.mp4',
        suggestedFileName: '02_skye_elogio.mp4',
        fileSizeMb: '28.1 MB',
        slotSeconds: '0.0s a 2.8s',
        transcriptGreeting: 'Au au, [NOME]! A Skye tem muito orgulho de você!',
        fullTranscript: 'Au au, [NOME]! A Skye tem muito orgulho de você! Cuidar dos filhotinhos e dos amigos com tanto carinho é a melhor coisa do mundo!',
        elevenLabsPrompt: 'Au au, [NOME DA CRIANÇA]! A Skye tem muito orgulho de você ser tão carinhosa e dedicada!'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes & Coragem',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/skye/03_skye_virtudes.mp4',
        suggestedFileName: '03_skye_virtudes.mp4',
        fileSizeMb: '30.4 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Au au, [NOME]! Esse filhote vai voar alto com coragem!',
        fullTranscript: 'Au au, [NOME]! Nenhum desafio é grande demais quando temos fé e coragem nas nossas asas!',
        elevenLabsPrompt: 'Au au, [NOME DA CRIANÇA]! Esse filhote vai voar alto porque a sua coragem não tem limites!'
      }
    ]
  },
  {
    id: 'stitch',
    name: 'Stitch',
    emoji: '💙',
    styleMode: 'single',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa no Havaí',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/stitch/01_stitch_festa.mp4',
        suggestedFileName: '01_stitch_festa.mp4',
        fileSizeMb: '32.1 MB',
        slotSeconds: '0.0s a 2.7s',
        transcriptGreeting: 'Ih-ha! Aloha, [NOME]! Stitch ama aniversário!',
        fullTranscript: 'Ih-ha! Aloha, [NOME]! Stitch ama aniversário! Ohana quer dizer família, e família quer dizer nunca abandonar ou esquecer você! Muita dança hula e parabéns!',
        elevenLabsPrompt: 'Ih-ha! Aloha, [NOME DA CRIANÇA]! Stitch ama aniversário! Parabéns, meu amigo!'
      }
    ]
  },
  {
    id: 'mario',
    name: 'Mario Bros',
    emoji: '🍄',
    styleMode: 'single',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa no Reino dos Cogumelos',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/mario/01_mario_festa.mp4',
        suggestedFileName: '01_mario_festa.mp4',
        fileSizeMb: '31.8 MB',
        slotSeconds: '0.0s a 2.8s',
        transcriptGreeting: 'Mamma Mia! Wahoo, [NOME]! É o Mario aqui!',
        fullTranscript: 'Mamma Mia! Wahoo, [NOME]! É o Mario aqui falando direto do Reino dos Cogumelos! Parabéns por subir de nível hoje! Let\'s go comemorar!',
        elevenLabsPrompt: 'Mamma Mia! Wahoo, [NOME DA CRIANÇA]! É o Mario aqui te desejando um super feliz aniversário!'
      }
    ]
  },
  {
    id: 'moana',
    name: 'Moana',
    emoji: '🌊',
    styleMode: 'triple',
    defaultOccasion: 'aniversario',
    scripts: [
      {
        occasion: 'aniversario',
        occasionLabel: 'Festa do Oceano',
        occasionEmoji: '🎂',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/moana/01_moana_festa.mp4',
        suggestedFileName: '01_moana_festa.mp4',
        fileSizeMb: '31.5 MB',
        slotSeconds: '0.0s a 3.0s',
        transcriptGreeting: 'Aloha, [NOME]! Sou eu, a Moana de Motunui!',
        fullTranscript: 'Aloha, [NOME]! Sou eu, a Moana de Motunui! O oceano me chamou para velejar até aqui só pra celebrar o seu aniversário! Que você tenha um caminho lindo pela frente!',
        elevenLabsPrompt: 'Aloha, [NOME DA CRIANÇA]! Sou eu, a Moana de Motunui! Parabéns pelo seu dia especial!'
      },
      {
        occasion: 'elogio',
        occasionLabel: 'Elogio & Amor à Família',
        occasionEmoji: '⭐',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/moana/02_moana_elogio.mp4',
        suggestedFileName: '02_moana_elogio.mp4',
        fileSizeMb: '29.9 MB',
        slotSeconds: '0.0s a 2.9s',
        transcriptGreeting: 'Aloha, [NOME]! Cuidar da nossa aldeia e da família é a coisa mais linda!',
        fullTranscript: 'Aloha, [NOME]! Cuidar da nossa aldeia e da nossa família com tanta generosidade faz você ser muito especial! Continue sendo essa bênção!',
        elevenLabsPrompt: 'Aloha, [NOME DA CRIANÇA]! Que orgulho ver o carinho e o cuidado que você tem com a sua família!'
      },
      {
        occasion: 'conquista',
        occasionLabel: 'Virtudes & Navegação',
        occasionEmoji: '🏆',
        officialUrl: 'https://www.recadinhomagico.com.br/videos/moana/03_moana_virtudes.mp4',
        suggestedFileName: '03_moana_virtudes.mp4',
        fileSizeMb: '32.0 MB',
        slotSeconds: '0.0s a 3.0s',
        transcriptGreeting: 'Aloha, [NOME]! A sua coragem pode cruzar qualquer oceano!',
        fullTranscript: 'Aloha, [NOME]! Nunca tenha medo das tempestades no horizonte, porque o seu coração é de uma verdadeira navegadora corajosa!',
        elevenLabsPrompt: 'Aloha, [NOME DA CRIANÇA]! A sua coragem pode cruzar qualquer oceano! Siga o seu coração!'
      }
    ]
  },
  {
    id: "jesus",
    name: "Jesus Criança",
    emoji: "🕊️",
    styleMode: "single",
    defaultOccasion: "aniversario",
    scripts: [
      {
        occasion: "aniversario",
        occasionLabel: "Festa & Bênçãos",
        occasionEmoji: "🎂",
        officialUrl: "https://www.recadinhomagico.com.br/videos/jesus_crianca/01_jesus_crianca_festa.mp4",
        suggestedFileName: "01_jesus_crianca_festa.mp4",
        fileSizeMb: "29.2 MB",
        slotSeconds: "0.0s a 3.4s",
        transcriptGreeting: "A paz de Jesus, [NOME]! Que bênção comemorar o seu dia especial!",
        fullTranscript: "A paz de Jesus, [NOME]! Que os anjos do céu derramem muitas bênçãos sobre a sua vida e toda a sua família neste aniversário tão iluminado! Lembre-se sempre de espalhar amor e bondade!",
        elevenLabsPrompt: "A paz de Jesus, [NOME DA CRIANÇA]! Que os anjos do céu derramem bênçãos no seu aniversário!"
      }
    ]
  },
  {
    id: "gabby",
    name: "A Casa Mágica da Gabby",
    emoji: "🐱",
    styleMode: "single",
    defaultOccasion: "aniversario",
    scripts: [
      {
        occasion: "aniversario",
        occasionLabel: "Festa na Casa de Bonecas",
        occasionEmoji: "🎂",
        officialUrl: "https://www.recadinhomagico.com.br/videos/gabby_casa_magica/01_gabyy_festa.mp4",
        suggestedFileName: "01_gabyy_festa.mp4",
        fileSizeMb: "31.4 MB",
        slotSeconds: "0.0s a 3.0s",
        transcriptGreeting: "Um beliscãozinho na orelha esquerda e um na direita! Oi, [NOME]!",
        fullTranscript: "Um beliscãozinho na orelha esquerda e um na direita! Oi, [NOME]! Bem-vindo à Casa Mágica de Bonecas! Hoje tem muita música, gatinhos dançantes e uma festa super fofa de aniversário para você!",
        elevenLabsPrompt: "Um beliscãozinho na orelha esquerda e um na direita! Oi, [NOME DA CRIANÇA]! Parabéns pelo seu aniversário!"
      }
    ]
  }
];