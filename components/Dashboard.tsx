import React, { useMemo, useState } from 'react';
import { ServiceOrder, OSStatus, LegalArea } from '../types';
import { Icons } from './Icons';

interface DashboardProps {
  orders: ServiceOrder[];
  onSelectOS: (os: ServiceOrder) => void;
  onNewOS: () => void;
  onDeleteOS: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, onSelectOS, onNewOS, onDeleteOS }) => {
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const stats = useMemo(() => {
    return {
      total: orders.length,
      open: orders.filter(o => o.status === OSStatus.ABERTA).length,
      inProgress: orders.filter(o => o.status === OSStatus.EM_ANDAMENTO || o.status === OSStatus.AGUARDANDO_DOCS).length,
      completed: orders.filter(o => o.status === OSStatus.CONCLUIDA || o.status === OSStatus.ARQUIVADA).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesText = 
        order.clientName.toLowerCase().includes(filterText.toLowerCase()) ||
        order.osNumber.toLowerCase().includes(filterText.toLowerCase()) ||
        order.responsible.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || order.legalArea === typeFilter;

      return matchesText && matchesStatus && matchesType;
    });
  }, [orders, filterText, statusFilter, typeFilter]);

  const getStatusColor = (status: OSStatus) => {
    switch (status) {
      case OSStatus.ABERTA: return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case OSStatus.EM_ANDAMENTO: return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case OSStatus.AGUARDANDO_DOCS: return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case OSStatus.CONCLUIDA: return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case OSStatus.ARQUIVADA: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click
    onDeleteOS(id);
  };

  const handleEditClick = (e: React.MouseEvent, os: ServiceOrder) => {
    e.stopPropagation(); // Prevent row click
    onSelectOS(os);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral</h1>
          <p className="text-gray-500 dark:text-gray-400">Gerencie suas ordens de serviço e acompanhe o progresso.</p>
        </div>
        <button 
          onClick={onNewOS}
          className="flex items-center justify-center gap-2 bg-legal-900 hover:bg-legal-800 dark:bg-gold-600 dark:hover:bg-gold-500 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
        >
          <Icons.Plus className="w-5 h-5" />
          Abrir Nova OS
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: 'Total de OS', value: stats.total, color: 'text-legal-600 dark:text-legal-300' },
            { label: 'Abertas', value: stats.open, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Em Andamento', value: stats.inProgress, color: 'text-yellow-600 dark:text-yellow-400' },
            { label: 'Concluídas', value: stats.completed, color: 'text-green-600 dark:text-green-400' },
        ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-legal-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <Icons.Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Buscar por cliente, OS ou responsável..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-500 focus:border-transparent dark:bg-legal-900 dark:text-white"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />
        </div>
        <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-legal-600 rounded-lg bg-white dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
        >
            <option value="ALL">Todas as Áreas</option>
            {Object.values(LegalArea).map(area => <option key={area} value={area}>{area}</option>)}
        </select>
        <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-legal-600 rounded-lg bg-white dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
        >
            <option value="ALL">Todos os Status</option>
            {Object.values(OSStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-legal-800 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-legal-900/50 border-b border-gray-100 dark:border-legal-700">
                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">OS #</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Área</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responsável</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-legal-700">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(os => (
                            <tr 
                                key={os.id} 
                                onClick={() => onSelectOS(os)}
                                className="hover:bg-gray-50 dark:hover:bg-legal-700/50 transition-colors group cursor-pointer"
                            >
                                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{os.osNumber}</td>
                                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{os.clientName}</td>
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{os.legalArea}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(os.status)}`}>
                                        {os.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{os.responsible}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => handleEditClick(e, os)}
                                            className="p-2 text-gray-400 hover:text-legal-600 dark:hover:text-gold-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-legal-700"
                                            title="Editar / Ver Detalhes"
                                        >
                                            <Icons.Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeleteClick(e, os.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-legal-700"
                                            title="Excluir OS"
                                        >
                                            <Icons.Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                Nenhuma Ordem de Serviço encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};