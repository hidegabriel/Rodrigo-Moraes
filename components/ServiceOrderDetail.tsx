import React, { useState } from 'react';
import { ServiceOrder, LegalArea, OSStatus, LogEntry, Client } from '../types';
import { Icons } from './Icons';

interface ServiceOrderDetailProps {
  initialData?: ServiceOrder | null;
  currentUser: string;
  clients: Client[];
  onSave: (os: ServiceOrder) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const ServiceOrderDetail: React.FC<ServiceOrderDetailProps> = ({ initialData, currentUser, clients, onSave, onDelete, onBack }) => {
  const isEditing = !!initialData;
  
  // Use function initializer to generate default state only once on mount
  const [formData, setFormData] = useState<ServiceOrder>(() => {
    if (initialData) {
      // Deep copy history to avoid reference issues
      return { 
        ...initialData,
        history: [...(initialData.history || [])]
      };
    }
    
    // Default empty state for new OS
    const now = new Date();
    // Generate a robust unique ID
    const uniqueId = `${now.getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    const randomOSNumber = `OS-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      id: uniqueId,
      osNumber: randomOSNumber,
      clientName: '',
      legalArea: LegalArea.CIVEL,
      description: '',
      strategy: '',
      methods: '',
      deadlines: '',
      status: OSStatus.ABERTA,
      responsible: currentUser,
      internalNotes: '',
      value: 0,
      history: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  });

  const handleChange = (field: keyof ServiceOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default if inside a form
    
    if (!formData.clientName.trim()) {
      alert("Por favor, preencha o nome do cliente.");
      return;
    }

    // Create the final object to save
    const timestamp = new Date().toISOString();
    const todayDate = timestamp.split('T')[0];

    // Create a new log entry
    const actionText = isEditing ? 'OS Atualizada' : 'OS Criada';
    const newLog: LogEntry = {
        id: Date.now().toString(),
        date: todayDate,
        user: currentUser,
        action: actionText
    };

    const finalData: ServiceOrder = {
        ...formData,
        history: [newLog, ...formData.history],
        updatedAt: timestamp
    };

    onSave(finalData);
  };

  const handleDeleteClick = () => {
      onDelete(formData.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Voltar para Dashboard
        </button>
        <div className="flex gap-3">
          {isEditing && (
            <button
                type="button"
                onClick={handleDeleteClick}
                className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <Icons.Trash className="w-4 h-4" />
                Excluir
            </button>
          )}
          <button 
             type="button"
             onClick={handleSaveClick}
             className="bg-legal-900 hover:bg-legal-800 dark:bg-gold-600 dark:hover:bg-gold-500 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Icons.Briefcase className="w-4 h-4" />
            Salvar OS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-legal-700 pb-2">Informações Principais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número OS</label>
                <input 
                  type="text" 
                  value={formData.osNumber}
                  disabled
                  className="w-full p-2 bg-gray-100 dark:bg-legal-900/50 border border-gray-200 dark:border-legal-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed select-none"
                  title="O número da OS é gerado automaticamente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => {
                      handleChange('status', e.target.value);
                  }}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                >
                  {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Cliente *</label>
                <input 
                  list="clients-list"
                  type="text" 
                  required
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                  placeholder="Selecione ou digite o nome..."
                />
                <datalist id="clients-list">
                    {clients.map(c => (
                        <option key={c.id} value={c.name} />
                    ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo Jurídico</label>
                <select 
                  value={formData.legalArea}
                  onChange={(e) => handleChange('legalArea', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                >
                  {Object.values(LegalArea).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Responsável</label>
                <input 
                  type="text" 
                  value={formData.responsible}
                  onChange={(e) => handleChange('responsible', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                  placeholder="Nome do Advogado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor/Custos (R$)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={formData.value || ''}
                  onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-legal-700 pb-2">Detalhes do Caso & Estratégia</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição do Caso</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                  placeholder="Descreva os fatos principais..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estratégia Adotada</label>
                <textarea 
                  rows={3}
                  value={formData.strategy}
                  onChange={(e) => handleChange('strategy', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                  placeholder="Qual a tese de defesa/ataque?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Métodos & Ações</label>
                <textarea 
                  rows={2}
                  value={formData.methods}
                  onChange={(e) => handleChange('methods', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                  placeholder="Ex: Reunião pericial, coleta de provas..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-legal-700 pb-2">Prazos & Notas</h2>
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prazos Importantes</label>
                  <input 
                    type="text" 
                    value={formData.deadlines}
                    onChange={(e) => handleChange('deadlines', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-legal-900 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 dark:text-white"
                    placeholder="Ex: 15/10/2024"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações Internas</label>
                  <textarea 
                    rows={4}
                    value={formData.internalNotes}
                    onChange={(e) => handleChange('internalNotes', e.target.value)}
                    className="w-full p-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white text-sm"
                    placeholder="Informações sensíveis apenas para o escritório..."
                  />
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-legal-700 pb-2">Histórico</h2>
             <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {formData.history.length === 0 && <p className="text-sm text-gray-400 italic">Sem histórico.</p>}
                {formData.history.map(log => (
                  <div key={log.id} className="text-sm border-l-2 border-legal-300 dark:border-legal-600 pl-3 py-1">
                    <p className="font-medium text-gray-900 dark:text-white">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.date} - {log.user}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};