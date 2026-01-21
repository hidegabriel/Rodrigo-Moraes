import { LegalArea, OSStatus, ServiceOrder, Client } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Indústrias Metalúrgicas Silva',
    email: 'contato@ims.ind.br',
    phone: '(11) 3344-5566',
    type: 'Pessoa Jurídica',
    document: '12.345.678/0001-99'
  },
  {
    id: '2',
    name: 'Mikael Santos',
    email: 'mikael.santos@email.com',
    phone: '(11) 98765-4321',
    type: 'Pessoa Física',
    document: '123.456.789-00'
  },
  {
    id: '3',
    name: 'Mariana Oliveira',
    email: 'mari.oliveira@email.com',
    phone: '(21) 99888-7777',
    type: 'Pessoa Física',
    document: '987.654.321-11'
  },
  {
    id: '4',
    name: 'Tech Solutions LTDA',
    email: 'financeiro@techsolutions.com',
    phone: '(48) 3030-2020',
    type: 'Pessoa Jurídica',
    document: '98.765.432/0001-22'
  },
  {
    id: '5',
    name: 'João da Silva',
    email: 'joao.silva@email.com',
    phone: '(31) 91234-5678',
    type: 'Pessoa Física',
    document: '111.222.333-44'
  }
];

export const INITIAL_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: '1',
    osNumber: 'OS-2024-001',
    clientName: 'Indústrias Metalúrgicas Silva',
    legalArea: LegalArea.TRABALHISTA,
    description: 'Ação trabalhista movida por ex-funcionário alegando insalubridade e horas extras não pagas.',
    strategy: 'Contestar o laudo pericial técnico apresentado. Reunir cartões de ponto e testemunhas sobre o uso de EPIs.',
    methods: 'Reunião com RH, levantamento de documentação técnica, solicitação de assistente técnico.',
    deadlines: 'Contestação até 15/11/2024',
    status: OSStatus.EM_ANDAMENTO,
    responsible: 'Dr. Rodrigo Moraes',
    internalNotes: 'Cliente preocupado com o impacto financeiro. Prioridade alta.',
    value: 15000.00,
    history: [
      { id: 'h1', date: '2024-10-01', user: 'Dr. Rodrigo', action: 'OS Criada' },
      { id: 'h2', date: '2024-10-05', user: 'Secretaria', action: 'Documentos recebidos' }
    ],
    createdAt: '2024-10-01',
    updatedAt: '2024-10-05'
  },
  {
    id: '2',
    osNumber: 'OS-2024-002',
    clientName: 'Mariana Oliveira',
    legalArea: LegalArea.CIVEL,
    description: 'Processo de divórcio litigioso com disputa de guarda e bens.',
    strategy: 'Buscar mediação inicial para acordo sobre a guarda. Inventariar bens ocultos.',
    methods: 'Pedido de quebra de sigilo bancário. Reunião de mediação agendada.',
    deadlines: 'Audiência de conciliação 20/11/2024',
    status: OSStatus.AGUARDANDO_DOCS,
    responsible: 'Dra. Ana Beatriz Castellucci',
    internalNotes: 'Cliente muito abalada emocionalmente. Tratar com cautela.',
    value: 8500.00,
    history: [
      { id: 'h3', date: '2024-10-10', user: 'Dra. Ana', action: 'OS Criada' }
    ],
    createdAt: '2024-10-10',
    updatedAt: '2024-10-10'
  },
  {
    id: '3',
    osNumber: 'OS-2024-003',
    clientName: 'Tech Solutions LTDA',
    legalArea: LegalArea.TRIBUTARIO,
    description: 'Autuação fiscal referente a ICMS em operações interestaduais.',
    strategy: 'Impugnação administrativa demonstrando a bitributação indevida.',
    methods: 'Análise contábil, elaboração de defesa administrativa.',
    deadlines: 'Defesa Adm. até 30/10/2024',
    status: OSStatus.ABERTA,
    responsible: 'Dr. Rodrigo Moraes',
    internalNotes: 'Valor da causa alto. Requer atenção dos sócios.',
    value: 45000.00,
    history: [],
    createdAt: '2024-10-15',
    updatedAt: '2024-10-15'
  },
  {
    id: '4',
    osNumber: 'OS-2024-004',
    clientName: 'João da Silva',
    legalArea: LegalArea.PREVIDENCIARIO,
    description: 'Solicitação de aposentadoria por tempo de contribuição indeferida pelo INSS.',
    strategy: 'Ajuizar ação federal para reconhecimento de tempo rural.',
    methods: 'Coleta de provas materiais de atividade rural.',
    deadlines: 'Sem prazo fatal imediato',
    status: OSStatus.CONCLUIDA,
    responsible: 'Dra. Ana Beatriz Castellucci',
    internalNotes: 'Caso de sucesso provável.',
    value: 5000.00,
    history: [
      { id: 'h4', date: '2024-09-01', user: 'Dr. Rodrigo', action: 'OS Criada' },
      { id: 'h5', date: '2024-10-20', user: 'Dra. Ana', action: 'Sentença favorável' }
    ],
    createdAt: '2024-09-01',
    updatedAt: '2024-10-20'
  }
];