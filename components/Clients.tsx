import React, { useState } from 'react';
import { Client } from '../types';
import { Icons } from './Icons';

interface ClientsProps {
  clients: Client[];
  onSave: (client: Client) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const initialFormState: Client = {
    id: '',
    name: '',
    email: '',
    phone: '',
    type: 'Pessoa Física',
    document: ''
  };

  const [formData, setFormData] = useState<Client>(initialFormState);

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ ...initialFormState, id: Date.now().toString() });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400">Base de contatos do escritório.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-legal-900 hover:bg-legal-800 dark:bg-gold-600 dark:hover:bg-gold-500 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
        >
          <Icons.Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 hover:border-legal-300 dark:hover:border-legal-500 transition-colors group relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{client.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-legal-900 text-gray-600 dark:text-gray-400 text-xs rounded">
                  {client.type}
                </span>
              </div>
              <button 
                onClick={() => handleOpenModal(client)}
                className="text-gray-400 hover:text-legal-600 dark:hover:text-gold-500 transition-colors"
              >
                <Icons.FileText className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-500">Email:</span>
                <a href={`mailto:${client.email}`} className="hover:text-blue-600">{client.email || '-'}</a>
              </div>
              <div className="flex items-center gap-2">
                 <span className="font-medium text-gray-500">Tel:</span>
                 <span>{client.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="font-medium text-gray-500">Doc:</span>
                 <span>{client.document || '-'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-legal-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo / Razão Social</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                   <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                      className="w-full p-2 border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white"
                   >
                     <option>Pessoa Física</option>
                     <option>Pessoa Jurídica</option>
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF / CNPJ</label>
                  <input 
                    type="text" 
                    value={formData.document}
                    onChange={e => setFormData({...formData, document: e.target.value})}
                    className="w-full p-2 border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-legal-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-legal-900 dark:bg-gold-600 text-white rounded-lg hover:bg-legal-800 dark:hover:bg-gold-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};