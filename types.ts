export enum LegalArea {
  TRABALHISTA = 'Trabalhista',
  CIVEL = 'Cível',
  PENAL = 'Penal',
  TRIBUTARIO = 'Tributário',
  PREVIDENCIARIO = 'Previdenciário',
  CORPORATIVO = 'Corporativo',
  DIREITOS_AUTORAIS = 'Direitos Autorais'
}

export enum OSStatus {
  ABERTA = 'Aberta',
  EM_ANDAMENTO = 'Em Andamento',
  AGUARDANDO_DOCS = 'Aguardando Docs',
  CONCLUIDA = 'Concluída',
  ARQUIVADA = 'Arquivada'
}

export interface LogEntry {
  id: string;
  date: string;
  user: string;
  action: string;
}

export interface ServiceOrder {
  id: string;
  osNumber: string;
  clientName: string;
  legalArea: LegalArea;
  description: string;
  strategy: string;
  methods: string;
  deadlines: string;
  status: OSStatus;
  responsible: string;
  internalNotes: string;
  value: number; // New field for financial reporting
  history: LogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Pessoa Física' | 'Pessoa Jurídica';
  document: string; // CPF or CNPJ
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewMode = 'DASHBOARD' | 'OS_DETAIL' | 'NEW_OS' | 'REPORTS' | 'CLIENTS' | 'DOCUMENTS';