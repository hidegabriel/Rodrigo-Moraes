import React from 'react';
import { ServiceOrder } from '../types';
import { Icons } from './Icons';

interface DocumentsProps {
  orders: ServiceOrder[];
}

export const Documents: React.FC<DocumentsProps> = ({ orders }) => {
  // Mock documents based on existing orders
  const documents = orders.flatMap(os => [
    {
      id: `${os.id}-doc1`,
      title: `Contrato de Honorários - ${os.clientName}`,
      type: 'Contrato',
      date: os.createdAt,
      osNumber: os.osNumber
    },
    {
      id: `${os.id}-doc2`,
      title: `Procuração Ad Judicia - ${os.clientName}`,
      type: 'Procuração',
      date: os.createdAt,
      osNumber: os.osNumber
    }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documentos Digitais</h1>
          <p className="text-gray-500 dark:text-gray-400">Repositório de peças e contratos gerados.</p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 bg-legal-900 hover:bg-legal-800 dark:bg-gold-600 dark:hover:bg-gold-500 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium opacity-50 cursor-not-allowed"
          title="Funcionalidade de upload em desenvolvimento"
        >
          <Icons.Plus className="w-5 h-5" />
          Upload Arquivo
        </button>
      </div>

      <div className="bg-white dark:bg-legal-800 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50 dark:bg-legal-900/50 border-b border-gray-100 dark:border-legal-700">
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome do Arquivo</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Ref. OS</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Data</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Ação</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-legal-700">
                {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-legal-700/50">
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-3">
                            <Icons.FileText className="w-4 h-4 text-legal-500 dark:text-gold-500" />
                            {doc.title}
                        </td>
                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{doc.type}</td>
                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{doc.osNumber}</td>
                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(doc.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4 text-right">
                             <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                 Baixar
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};