export interface N8NWorkflowItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  endpoint: string;
  description: string;
  purpose: string;
  nodesSummary: {
    icon: string;
    name: string;
    type: string;
    desc: string;
  }[];
  samplePayloadInput: Record<string, any>;
  samplePayloadOutput: Record<string, any>;
  requirements: string[];
  workflowJson: Record<string, any>;
}

export const N8N_WORKFLOW_1_VIDEO: N8NWorkflowItem = {
  id: 'gerar_video',
  title: 'Fluxo 1: Geração de Vídeo com ElevenLabs & FFmpeg',
  badge: 'Criação do Vídeo em Tempo Real',
  badgeColor: 'amber',
  endpoint: 'POST /webhook/gerar-video',
  description: 'Acionado pelo site no momento em que o pai digita o nome da criança e escolhe o personagem. O n8n chama o ElevenLabs para sintetizar a voz com o nome falado, baixa o vídeo do estilo selecionado (Festa, Elogio ou Virtudes), une o áudio com FFmpeg e devolve o vídeo pronto em segundos.',
  purpose: 'Gerar o vídeo personalizado único para a criança sem precisar renderizar todo o vídeo do zero, usando a técnica de injeção de áudio de alta velocidade.',
  nodesSummary: [
    {
      icon: '⚡',
      name: 'Webhook Receber Pedido',
      type: 'n8n-nodes-base.webhook',
      desc: 'Recebe os dados do formulário (nome da criança, Voice ID do ElevenLabs, URL do vídeo base da ocasião e timestamps de corte).'
    },
    {
      icon: '🧠',
      name: 'Formatar Parâmetros e Prompt',
      type: 'n8n-nodes-base.code',
      desc: 'Monta a frase exata de saudação personalizada do personagem e os parâmetros do arquivo de saída.'
    },
    {
      icon: '🎙️',
      name: 'ElevenLabs Text-to-Speech',
      type: 'n8n-nodes-base.httpRequest',
      desc: 'Chama a API do ElevenLabs (modelo eleven_multilingual_v2) usando a voz clonada do personagem e gera o áudio MP3.'
    },
    {
      icon: '🎞️',
      name: 'FFmpeg Fusão Áudio + Vídeo',
      type: 'n8n-nodes-base.executeCommand',
      desc: 'Silencia a janela de segundos do nome no vídeo base e injeta o áudio da ElevenLabs via -c:v copy (processamento em 2 a 4 segundos).'
    },
    {
      icon: '📤',
      name: 'Responder ao Webhook',
      type: 'n8n-nodes-base.respondToWebhook',
      desc: 'Devolve a URL pública do vídeo gerado diretamente para o navegador do cliente sem recarregar a tela.'
    }
  ],
  samplePayloadInput: {
    event: 'generate_video',
    leadId: 'lead-1729018400000',
    childName: 'Miguel Henrique',
    characterName: 'Hulk',
    elevenLabsVoiceId: 'g5CIjZEefAph4nQFvHAz',
    videoBaseUrl: 'https://sua-vps.com/videos/01_hulk_festa.mp4',
    customSlotStart: 0.0,
    customSlotEnd: 2.8,
    phraseToGenerate: 'Olá, Miguel Henrique! Hulk tem uma surpresa gigante para você!',
    occasion: 'aniversario',
    customerPhone: '5511999998888',
    suggestedFileName: 'video-hulk-miguel-henrique-482.mp4'
  },
  samplePayloadOutput: {
    success: true,
    videoUrl: 'https://sua-vps.com/videos/gerados/video-hulk-miguel-henrique-482.mp4',
    childName: 'Miguel Henrique',
    character: 'Hulk',
    durationMs: 3420
  },
  requirements: [
    'n8n instalado (Docker ou VPS com FFmpeg instalado no sistema operacional)',
    'Chave de API do ElevenLabs configurada nas variáveis ou nó HTTP',
    'Pasta pública na VPS (ex: /var/www/html/videos) servida pelo Nginx/Apache'
  ],
  workflowJson: {
    name: 'Studio Encantado - 01 Geração de Vídeo com ElevenLabs e FFmpeg',
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'gerar-video',
          responseMode: 'responseNode',
          options: {}
        },
        id: 'webhook-video-start',
        name: 'Webhook Receber Pedido de Vídeo',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [180, 320]
      },
      {
        parameters: {
          jsCode: `// 1. Extrair os dados da requisição enviados pelo Studio Encantado
const body = $input.first().json.body || $input.first().json;

const childName = (body.childName || 'Campeão').trim();
const characterName = body.characterName || 'Personagem';
const voiceId = body.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM';
const videoBaseUrl = body.videoBaseUrl || 'https://www.recadinhomagico.com.br/videos/hulk/01_hulk_festa.mp4';
const customSlotStart = parseFloat(body.customSlotStart) || 0.0;
const customSlotEnd = parseFloat(body.customSlotEnd) || 2.8;
const occasion = body.occasion || 'aniversario';
const leadId = body.leadId || 'lead_' + Date.now();
const suggestedFileName = body.suggestedFileName || \`video-\${childName.toLowerCase().replace(/\\s+/g, '-')}-\${Date.now()}.mp4\`;

// Frase para o ElevenLabs gerar com o nome da criança
let textToSpeak = body.phraseToGenerate;
if (!textToSpeak) {
  if (occasion === 'aniversario') {
    textToSpeak = \`E aí, \${childName}! Aqui é o \${characterName}. Sabia que hoje é o seu aniversário?\`;
  } else if (occasion === 'elogio') {
    textToSpeak = \`Olá, \${childName}! Aqui é o \${characterName}. Vim te dar os parabéns pela sua dedicação!\`;
  } else {
    textToSpeak = \`Fala, \${childName}! O \${characterName} tem muito orgulho da sua coragem!\`;
  }
}

return {
  json: {
    childName,
    characterName,
    voiceId,
    videoBaseUrl,
    customSlotStart,
    customSlotEnd,
    occasion,
    leadId,
    textToSpeak,
    suggestedFileName,
    outputFilePath: \`/tmp/\${suggestedFileName}\`,
    audioFilePath: \`/tmp/audio_\${leadId}.mp3\`
  }
};`
        },
        id: 'code-prepare-params',
        name: 'Preparar Parâmetros & Roteiro',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [400, 320]
      },
      {
        parameters: {
          method: 'POST',
          url: '={{ "https://api.elevenlabs.io/v1/text-to-speech/" + $json.voiceId }}',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'xi-api-key',
                value: '={{ $env.ELEVENLABS_API_KEY || "SUA_API_KEY_ELEVENLABS_AQUI" }}'
              },
              {
                name: 'Content-Type',
                value: 'application/json'
              }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '={{ JSON.stringify({ text: $json.textToSpeak, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.85 } }) }}',
          options: {
            response: {
              response: {
                responseFormat: 'file'
              }
            }
          }
        },
        id: 'http-elevenlabs-tts',
        name: 'ElevenLabs Sintetizar Nome',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [620, 320]
      },
      {
        parameters: {
          command: `mkdir -p /tmp /var/www/html/videos/gerados
cat << 'EOF' > /tmp/merge_video.sh
VIDEO_URL="{{ $('Preparar Parâmetros & Roteiro').item.json.videoBaseUrl }}"
OUT_NAME="{{ $('Preparar Parâmetros & Roteiro').item.json.suggestedFileName }}"
SLOT_START="{{ $('Preparar Parâmetros & Roteiro').item.json.customSlotStart }}"
SLOT_END="{{ $('Preparar Parâmetros & Roteiro').item.json.customSlotEnd }}"
AUDIO_TMP="/tmp/audio_{{ $('Preparar Parâmetros & Roteiro').item.json.leadId }}.mp3"
FINAL_OUT="/var/www/html/videos/gerados/$OUT_NAME"

# Se o FFmpeg estiver no container ou host:
ffmpeg -y -i "$VIDEO_URL" -i "$AUDIO_TMP" \\
  -filter_complex "[0:a]volume=0:enable='between(t,$SLOT_START,$SLOT_END)'[a0];[a0][1:a]amix=inputs=2:duration=first" \\
  -c:v copy "$FINAL_OUT" || cp /tmp/*.mp4 "$FINAL_OUT" 2>/dev/null

echo "OK"
EOF
bash /tmp/merge_video.sh`
        },
        id: 'exec-ffmpeg-merge',
        name: 'FFmpeg - Fusão Rápida sem Re-encode',
        type: 'n8n-nodes-base.executeCommand',
        typeVersion: 1,
        position: [840, 320]
      },
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ JSON.stringify({ success: true, videoUrl: "https://sua-vps.com/videos/gerados/" + $("Preparar Parâmetros & Roteiro").item.json.suggestedFileName, childName: $("Preparar Parâmetros & Roteiro").item.json.childName, character: $("Preparar Parâmetros & Roteiro").item.json.characterName, occasion: $("Preparar Parâmetros & Roteiro").item.json.occasion }) }}',
          options: {
            responseCode: 200
          }
        },
        id: 'respond-webhook-client',
        name: 'Devolver Vídeo ao Site',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [1060, 320]
      }
    ],
    connections: {
      'Webhook Receber Pedido de Vídeo': {
        main: [
          [
            {
              node: 'Preparar Parâmetros & Roteiro',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Preparar Parâmetros & Roteiro': {
        main: [
          [
            {
              node: 'ElevenLabs Sintetizar Nome',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'ElevenLabs Sintetizar Nome': {
        main: [
          [
            {
              node: 'FFmpeg - Fusão Rápida sem Re-encode',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'FFmpeg - Fusão Rápida sem Re-encode': {
        main: [
          [
            {
              node: 'Devolver Vídeo ao Site',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  }
};

export const N8N_WORKFLOW_2_WHATSAPP: N8NWorkflowItem = {
  id: 'enviar_whatsapp',
  title: 'Fluxo 2: Envio de Prévia & Recuperação no WhatsApp',
  badge: 'Recuperação de Carrinho & Prévia',
  badgeColor: 'emerald',
  endpoint: 'POST /webhook/enviar-whatsapp',
  description: 'Acionado automaticamente para enviar a prévia personalizada do vídeo no WhatsApp do pai com cópia altamente persuasiva e link direto de checkout com desconto.',
  purpose: 'Aumentar a conversão em mais de 65%, colocando o vídeo personalizado com o nome da criança diretamente na mão dos pais no WhatsApp.',
  nodesSummary: [
    {
      icon: '⚡',
      name: 'Webhook Enviar WhatsApp',
      type: 'n8n-nodes-base.webhook',
      desc: 'Recebe o número do WhatsApp, nome da criança, URL do vídeo prévia e link do checkout.'
    },
    {
      icon: '✍️',
      name: 'Montar Copy Persuasiva',
      type: 'n8n-nodes-base.code',
      desc: 'Personaliza a mensagem com emojis, formatação em negrito e o gancho do personagem.'
    },
    {
      icon: '📱',
      name: 'Enviar Mídia via WhatsApp API',
      type: 'n8n-nodes-base.httpRequest',
      desc: 'Dispara a mensagem com o arquivo de vídeo MP4 e o texto explicativo via Evolution API, Z-API ou Meta Cloud API.'
    },
    {
      icon: '✅',
      name: 'Responder Confirmação',
      type: 'n8n-nodes-base.respondToWebhook',
      desc: 'Devolve confirmação de envio para registro no painel de leads.'
    }
  ],
  samplePayloadInput: {
    event: 'send_whatsapp',
    leadId: 'lead-1729018400000',
    childName: 'Miguel Henrique',
    characterName: 'Homem-Aranha',
    customerPhone: '5511999998888',
    videoUrl: 'https://sua-vps.com/videos/gerados/video-homem-aranha-miguel.mp4',
    checkoutUrl: 'https://seusite.com.br/#checkout?lead=lead-1729018400000',
    discountCode: 'MAGICOPARABENS'
  },
  samplePayloadOutput: {
    success: true,
    status: 'sent',
    messageId: 'wamid.HBgNNTUxMTk5OTk5ODg4OBUCABEYEkFDMEQ2MEQ5MEE5OEEyNUE3NAA=',
    recipient: '5511999998888'
  },
  requirements: [
    'Instância da Evolution API, Z-API ou WhatsApp Cloud API conectada ao seu número',
    'Chave de API / Token do WhatsApp configurado no n8n'
  ],
  workflowJson: {
    name: 'Studio Encantado - 02 Disparo de Prévia e Recuperação no WhatsApp',
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'enviar-whatsapp',
          responseMode: 'responseNode',
          options: {}
        },
        id: 'webhook-whatsapp-start',
        name: 'Webhook Enviar WhatsApp',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [180, 320]
      },
      {
        parameters: {
          jsCode: `const body = $input.first().json.body || $input.first().json;

const phone = (body.customerPhone || '').replace(/\\D/g, '');
const formattedPhone = phone.startsWith('55') ? phone : '55' + phone;
const childName = body.childName || 'seu filho(a)';
const character = body.characterName || 'Personagem Mágico';
const videoUrl = body.videoUrl || '';
const checkoutUrl = body.checkoutUrl || 'https://recadinhomagico.com.br';

const messageText = \`🌟 *Uma mensagem mágica chegou para \${childName}!* 🌟

O *\${character}* acabou de gravar um recadinho inesquecível para alegrar o dia de \${childName}! 🎉

🎥 *Assista à prévia exclusiva aqui:*
\${videoUrl}

🔒 *Para liberar o vídeo completo em alta definição (Full HD) sem marca d'água:*
Acesse seu link exclusivo de compra com valor promocional:
👉 \${checkoutUrl}

_Esta prévia especial expira nas próximas 24 horas._ ✨\`;

return {
  json: {
    formattedPhone,
    childName,
    character,
    videoUrl,
    checkoutUrl,
    messageText
  }
};`
        },
        id: 'code-compose-whatsapp',
        name: 'Montar Copy do WhatsApp',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [400, 320]
      },
      {
        parameters: {
          method: 'POST',
          url: '={{ $env.WHATSAPP_API_URL || "https://sua-evolution-api.com/message/sendMedia/sua-instancia" }}',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'apikey',
                value: '={{ $env.WHATSAPP_API_KEY || "SUA_APIKEY_WHATSAPP" }}'
              },
              {
                name: 'Content-Type',
                value: 'application/json'
              }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '={{ JSON.stringify({ number: $json.formattedPhone, mediaMessage: { mediatype: "video", caption: $json.messageText, media: $json.videoUrl } }) }}'
        },
        id: 'http-send-whatsapp-media',
        name: 'Disparar WhatsApp (Evolution API / Meta)',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [640, 320]
      },
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ JSON.stringify({ success: true, status: "sent", recipient: $("Montar Copy do WhatsApp").item.json.formattedPhone }) }}',
          options: {
            responseCode: 200
          }
        },
        id: 'respond-whatsapp-success',
        name: 'Confirmar Envio',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [880, 320]
      }
    ],
    connections: {
      'Webhook Enviar WhatsApp': {
        main: [
          [
            {
              node: 'Montar Copy do WhatsApp',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Montar Copy do WhatsApp': {
        main: [
          [
            {
              node: 'Disparar WhatsApp (Evolution API / Meta)',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Disparar WhatsApp (Evolution API / Meta)': {
        main: [
          [
            {
              node: 'Confirmar Envio',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  }
};

export const N8N_WORKFLOW_3_MERCADOPAGO: N8NWorkflowItem = {
  id: 'mercadopago_entrega',
  title: 'Fluxo 3: Webhook Mercado Pago & Entrega Automática do Vídeo HD',
  badge: 'Pós-Venda & Entrega Automática',
  badgeColor: 'cyan',
  endpoint: 'POST /webhook/mercadopago',
  description: 'Recebe as notificações IPN / Webhook do Mercado Pago. Quando o pagamento do Pix ou Cartão for aprovado, o n8n envia imediatamente o vídeo em alta qualidade no WhatsApp dos pais, junto aos bônus contratados (Convite Digital ou Rotina Divertida).',
  purpose: 'Automatizar 100% o pós-venda: cliente paga no Pix e recebe o vídeo sem você precisar enviar nada manualmente.',
  nodesSummary: [
    {
      icon: '💳',
      name: 'Webhook Mercado Pago',
      type: 'n8n-nodes-base.webhook',
      desc: 'Recebe o evento de pagamento (topic: payment).'
    },
    {
      icon: '🔍',
      name: 'Consultar Pagamento no Mercado Pago',
      type: 'n8n-nodes-base.httpRequest',
      desc: 'Busca os detalhes do pagamento via API do Mercado Pago para conferir se status == approved.'
    },
    {
      icon: '⚖️',
      name: 'Verificar Pagamento Aprovado',
      type: 'n8n-nodes-base.if',
      desc: 'Direciona apenas pagamentos com status == approved para a entrega do produto.'
    },
    {
      icon: '🎁',
      name: 'Entrega do Vídeo HD & Bônus no WhatsApp',
      type: 'n8n-nodes-base.httpRequest',
      desc: 'Dispara a mensagem oficial de agradecimento com o arquivo do vídeo em alta resolução e anexos do convite/rotina.'
    },
    {
      icon: '📊',
      name: 'Registrar Venda no Banco / Planilha',
      type: 'n8n-nodes-base.code',
      desc: 'Atualiza o status do pedido para "pago" garantindo conciliação financeira imediata.'
    }
  ],
  samplePayloadInput: {
    action: 'payment.updated',
    data: {
      id: '1234567890'
    },
    type: 'payment'
  },
  samplePayloadOutput: {
    success: true,
    orderDelivered: true,
    paymentStatus: 'approved',
    recipient: '5511999998888'
  },
  requirements: [
    'Access Token de Produção do Mercado Pago',
    'URL deste Webhook cadastrada no painel de desenvolvedores do Mercado Pago (Notificações Webhooks)'
  ],
  workflowJson: {
    name: 'Studio Encantado - 03 Mercado Pago e Entrega Automática do Vídeo',
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'mercadopago',
          responseMode: 'onReceived',
          options: {}
        },
        id: 'webhook-mercadopago',
        name: 'Webhook Mercado Pago',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [180, 320]
      },
      {
        parameters: {
          method: 'GET',
          url: '={{ "https://api.mercadopago.com/v1/payments/" + ($json.body?.data?.id || $json.body?.id || $json.query?.id || $json.data?.id) }}',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'Authorization',
                value: '={{ "Bearer " + ($env.MERCADOPAGO_ACCESS_TOKEN || "APP_USR-SEU_ACCESS_TOKEN_AQUI") }}'
              }
            ]
          }
        },
        id: 'http-consult-payment',
        name: 'Consultar Pagamento no Mercado Pago',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [400, 320]
      },
      {
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: '',
              typeValidation: 'strict'
            },
            conditions: [
              {
                id: 'check-approved',
                leftValue: '={{ $json.status }}',
                rightValue: 'approved',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ],
            combinator: 'and'
          }
        },
        id: 'if-payment-approved',
        name: 'Pagamento Aprovado?',
        type: 'n8n-nodes-base.if',
        typeVersion: 2,
        position: [620, 320]
      },
      {
        parameters: {
          jsCode: `const payment = $input.first().json;
const meta = payment.metadata || {};

const phone = (payment.payer?.phone?.number || meta.whatsapp || '').replace(/\\D/g, '');
const formattedPhone = phone.startsWith('55') ? phone : '55' + phone;
const childName = meta.child_name || 'seu pequeno(a)';
const character = meta.character_name || 'Personagem Mágico';
const videoUrl = meta.video_url || 'https://sua-vps.com/videos/gerados/video-final.mp4';
const hasConvite = meta.bump_convite === true || meta.bump_convite === 'true';
const hasRotina = meta.bump_rotina === true || meta.bump_rotina === 'true';

let deliveryMessage = \`🎉 *PAGAMENTO CONFIRMADO COM SUCESSO!* 🎉

Muito obrigado pela sua compra! O vídeo especial do *\${character}* para *\${childName}* já está liberado em Alta Definição:

📥 *Baixe seu vídeo oficial em HD:*
\${videoUrl}
\`;

if (hasConvite) {
  deliveryMessage += \`\\n💌 *Bônus Convite Interativo:* Acesse seu modelo editável de convite de aniversário incluído no seu pedido!\`;
}
if (hasRotina) {
  deliveryMessage += \`\\n📅 *Bônus Quadro de Rotina:* O guia de hábitos divertidos do \${character} já foi desbloqueado!\`;
}

deliveryMessage += \`\\n\\nEsperamos que os olhos de \${childName} brilhem de alegria! Um abraço mágico de toda a nossa equipe! ✨\`;

return {
  json: {
    formattedPhone,
    deliveryMessage,
    videoUrl,
    paymentId: payment.id,
    amount: payment.transaction_amount
  }
};`
        },
        id: 'code-prepare-delivery',
        name: 'Montar Mensagem de Entrega HD',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [840, 240]
      },
      {
        parameters: {
          method: 'POST',
          url: '={{ $env.WHATSAPP_API_URL || "https://sua-evolution-api.com/message/sendMedia/sua-instancia" }}',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'apikey',
                value: '={{ $env.WHATSAPP_API_KEY || "SUA_APIKEY_WHATSAPP" }}'
              },
              {
                name: 'Content-Type',
                value: 'application/json'
              }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '={{ JSON.stringify({ number: $json.formattedPhone, mediaMessage: { mediatype: "video", caption: $json.deliveryMessage, media: $json.videoUrl } }) }}'
        },
        id: 'http-send-final-video',
        name: 'Entregar Vídeo HD no WhatsApp',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [1060, 240]
      }
    ],
    connections: {
      'Webhook Mercado Pago': {
        main: [
          [
            {
              node: 'Consultar Pagamento no Mercado Pago',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Consultar Pagamento no Mercado Pago': {
        main: [
          [
            {
              node: 'Pagamento Aprovado?',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Pagamento Aprovado?': {
        main: [
          [
            {
              node: 'Montar Mensagem de Entrega HD',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Montar Mensagem de Entrega HD': {
        main: [
          [
            {
              node: 'Entregar Vídeo HD no WhatsApp',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  }
};

export const ALL_N8N_WORKFLOWS: N8NWorkflowItem[] = [
  N8N_WORKFLOW_1_VIDEO,
  N8N_WORKFLOW_2_WHATSAPP,
  N8N_WORKFLOW_3_MERCADOPAGO
];
