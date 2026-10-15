import { FAQItem, PricingPlan, VideoReaction } from '../types';

export const VIDEO_REACTIONS: VideoReaction[] = [
  { id: 'Byf9D7rYYaE', label: 'Reação da Sophia com a Elsa', youtubeId: 'Byf9D7rYYaE', childName: 'Sophia' },
  { id: 'AYHEenyI0ZY', label: 'Reação do Heitor com Homem-Aranha', youtubeId: 'AYHEenyI0ZY', childName: 'Heitor' },
  { id: 'c8Y1D1A5q9U', label: 'Reação do Lorenzo com a Patrulha', youtubeId: 'c8Y1D1A5q9U', childName: 'Lorenzo' },
  { id: 'H0_y1lRg39g', label: 'Reação da Alice com Moana', youtubeId: 'H0_y1lRg39g', childName: 'Alice' },
  { id: 'a9006eVdYOU', label: 'Reação do Davi com Batman', youtubeId: 'a9006eVdYOU', childName: 'Davi' },
];

export const PRINT_TESTIMONIALS = Array.from({ length: 11 }, (_, i) => ({
  id: `depo-${i + 1}`,
  imageUrl: `https://www.recadinhomagico.com.br/prints_depoimentos/depo${i + 1}.png`,
  alt: `Depoimento de cliente satisfeito ${i + 1}`
}));

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: '1-video',
    name: '1 Vídeo Personalizado',
    subtitle: 'Perfeito para encantar e celebrar essa data',
    videos: 1,
    originalPrice: 'R$ 79,90',
    cashPrice: 'R$ 47,99',
    installment: '3x de R$ 16,00',
    highlighted: false,
    features: [
      '🎁 1 vídeo em alta definição (Full HD 1080p)',
      '⭐ O personagem chama a criança pelo nome',
      '🌟 Elogios de virtudes e encorajamento',
      '⚡ Entrega rápida em até 5 minutos no WhatsApp',
      '🔒 Sem marcas d\'água e com download vitalício',
      '💬 Garantia e suporte humano caso precise de ajustes'
    ]
  },
  {
    id: '2-videos',
    name: 'Combo Mágico (2 Vídeos)',
    subtitle: 'O melhor valor por vídeo — 2 temas ou 2 personagens',
    videos: 2,
    originalPrice: 'R$ 159,80',
    cashPrice: 'R$ 79,90',
    installment: '3x de R$ 26,63',
    highlighted: true,
    features: [
      '🎁 2 vídeos personalizados diferentes',
      '⭐ Escolha 2 personagens ou temas diferentes',
      '🎂 Ideal para irmãos ou recado de aniversário + rotina',
      '⚡ Entrega prioritária no WhatsApp e E-mail',
      '🔒 Sem marcas d\'água com download vitalício',
      '👑 Suporte VIP direto com nossos produtores'
    ]
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Posso colocar o nome de 2 crianças no mesmo vídeo?',
    answer: 'Não recomendamos colocar o nome de duas crianças em um mesmo vídeo. O roteiro é pensado exclusivamente para uma criança — quando dois nomes aparecem, a experiência perde imersão e a criança sente que a magia não é só dela. Para garantir o máximo impacto e emoção, crie um vídeo individual para cada uma! (Aproveite o Combo com desconto para 2 vídeos).'
  },
  {
    id: 'faq-2',
    question: 'Posso enviar para um afilhado ou neto?',
    answer: 'Com certeza! A linguagem do personagem foca no nome e nas qualidades da criança, e não no vínculo familiar de quem está presenteando. Pais, tios, avós, padrinhos e amigos de família podem presentear tranquilamente!'
  },
  {
    id: 'faq-3',
    question: 'Quanto tempo demora para o vídeo ficar pronto?',
    answer: 'A entrega é quase instantânea! Em até 5 minutos após a confirmação, o vídeo em alta qualidade chega diretamente no seu WhatsApp e no seu e-mail cadastrado, pronto para você assistir, projetar na TV ou compartilhar com a família.'
  },
  {
    id: 'faq-4',
    question: 'O personagem realmente diz o nome da criança?',
    answer: 'Sim! Utilizamos tecnologia avançada de síntese de voz e inteligência artificial combinada com animações originais para que o personagem pronuncie o nome de forma 100% natural, carinhosa e emocionante.'
  },
  {
    id: 'faq-5',
    question: 'E se o personagem pronunciar o nome de forma estranha?',
    answer: 'Fique totalmente tranquilo! Nossa equipe de pós-produção humana está de plantão no WhatsApp. Se por qualquer motivo o sotaque ou a pronúncia de um nome incomum precisar de ajuste, nós regravamos e corrigimos gratuitamente na hora para você.'
  },
  {
    id: 'faq-6',
    question: 'Como faço para assistir ao tutorial do passo a passo?',
    answer: 'É muito simples! Basta escolher o personagem, digitar o primeiro nome da criança, conferir a prévia e pronto. Você pode ver o tutorial detalhado em vídeo a qualquer momento.',
    hasTutorial: true
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Aline Shads',
    handle: '@alineshads',
    image: 'https://www.recadinhomagico.com.br/equipe/aline_shads.webp',
    instagramUrl: 'https://instagram.com/alineshads'
  },
  {
    name: 'Marco Vidotti',
    handle: '@marcoavidotti',
    image: 'https://www.recadinhomagico.com.br/equipe/marco_vidotti.webp',
    instagramUrl: 'https://instagram.com/marcoavidotti'
  },
  {
    name: 'Rafael Carneiro',
    handle: '@rafaelrhcc',
    image: 'https://www.recadinhomagico.com.br/equipe/rafael_carneiro.webp',
    instagramUrl: 'https://instagram.com/rafaelrhcc'
  },
  {
    name: 'Kaiqui Carvalho',
    handle: '@carvalhokaiqui',
    image: 'https://www.recadinhomagico.com.br/equipe/kaiqui.webp',
    instagramUrl: 'https://instagram.com/carvalhokaiqui'
  },
  {
    name: 'Ítalo Sousa',
    handle: '@italosousavendas',
    image: 'https://www.recadinhomagico.com.br/equipe/italo_sousa.webp',
    instagramUrl: 'https://instagram.com/italosousavendas'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: '1',
    title: 'Escolha o Ídolo',
    description: 'Selecione o herói, princesa ou personagem que faz os olhos da criança brilharem.',
    emoji: '👑'
  },
  {
    number: '2',
    title: 'Personalize o Nome',
    description: 'Diga o primeiro nome da criança para que o personagem chame com carinho e naturalidade.',
    emoji: '✍️'
  },
  {
    number: '3',
    title: 'Receba e Encante',
    description: 'Em até 5 minutos o vídeo em alta qualidade chega no seu WhatsApp pronto para a grande surpresa.',
    emoji: '✨'
  }
];
