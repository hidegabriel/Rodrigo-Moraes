import React, { useMemo, useState } from 'react';
import { ServiceOrder, OSStatus, LegalArea } from '../types';
import { Icons } from './Icons';

interface ReportsProps {
  orders: ServiceOrder[];
}

export const Reports: React.FC<ReportsProps> = ({ orders }) => {
  // Filter States
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [responsible, setResponsible] = useState<string>('');

  // Filtering Logic
  const filteredData = useMemo(() => {
    return orders.filter(os => {
      const osDate = new Date(os.createdAt);
      
      // Date Range
      const isAfterStart = !startDate || osDate >= new Date(startDate);
      const isBeforeEnd = !endDate || osDate <= new Date(endDate);
      
      // Area & Status
      const matchesArea = selectedArea === 'ALL' || os.legalArea === selectedArea;
      const matchesStatus = selectedStatus === 'ALL' || os.status === selectedStatus;
      
      // Responsible
      const matchesResponsible = !responsible || os.responsible.toLowerCase().includes(responsible.toLowerCase());

      return isAfterStart && isBeforeEnd && matchesArea && matchesStatus && matchesResponsible;
    });
  }, [orders, startDate, endDate, selectedArea, selectedStatus, responsible]);

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalOS = filteredData.length;
    const completedOS = filteredData.filter(o => o.status === OSStatus.CONCLUIDA || o.status === OSStatus.ARQUIVADA).length;
    
    const totalValue = filteredData.reduce((acc, curr) => acc + (curr.value || 0), 0);
    
    // Calculate average resolution time for concluded items
    const resolutionTimes = filteredData
      .filter(o => (o.status === OSStatus.CONCLUIDA || o.status === OSStatus.ARQUIVADA) && o.updatedAt)
      .map(o => {
        const start = new Date(o.createdAt).getTime();
        const end = new Date(o.updatedAt).getTime();
        return (end - start) / (1000 * 3600 * 24); // Days
      });
    
    const avgResolutionTime = resolutionTimes.length 
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length) 
      : 0;

    return { totalOS, completedOS, totalValue, avgResolutionTime };
  }, [filteredData]);

  // Actions
  const handleExportCSV = () => {
    const headers = ["ID", "Cliente", "Área", "Status", "Responsável", "Data Criação", "Valor (R$)"];
    const rows = filteredData.map(os => [
      os.osNumber,
      `"${os.clientName}"`, // Quote to handle commas in names
      os.legalArea,
      os.status,
      os.responsible,
      new Date(os.createdAt).toLocaleDateString('pt-BR'),
      (os.value || 0).toFixed(2)
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_juridico_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:p-0 print:bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios Gerenciais</h1>
          <p className="text-gray-500 dark:text-gray-400">Analise métricas e exporte dados para controle estratégico.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-legal-800 border border-gray-200 dark:border-legal-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-legal-700 transition-colors shadow-sm"
          >
            <Icons.Download className="w-4 h-4" />
            CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-legal-900 dark:bg-gold-600 text-white rounded-lg hover:bg-legal-800 dark:hover:bg-gold-500 transition-colors shadow-sm"
          >
            <Icons.Printer className="w-4 h-4" />
            PDF / Imprimir
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-legal-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Data Início</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Data Fim</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Área</label>
            <select 
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
            >
              <option value="ALL">Todas</option>
              {Object.values(LegalArea).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <select 
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
            >
              <option value="ALL">Todos</option>
              {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Responsável</label>
            <input 
              type="text" 
              placeholder="Buscar nome..."
              value={responsible} 
              onChange={e => setResponsible(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 print:border print:shadow-none">
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">OS Encontradas</p>
           <p className="text-2xl font-bold text-legal-700 dark:text-legal-300 mt-2">{metrics.totalOS}</p>
        </div>
        <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 print:border print:shadow-none">
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Casos Concluídos</p>
           <p className="text-2xl font-bold text-green-600 mt-2">{metrics.completedOS}</p>
        </div>
        <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 print:border print:shadow-none">
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor Total (R$)</p>
           <p className="text-2xl font-bold text-gold-600 mt-2">
             {metrics.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
           </p>
        </div>
        <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 print:border print:shadow-none">
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tempo Médio (Dias)</p>
           <p className="text-2xl font-bold text-blue-600 mt-2">{metrics.avgResolutionTime} dias</p>
        </div>
      </div>

      {/* Printable Report Title */}
      <div className="hidden print:block mb-4 mt-8">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-2">Detalhamento de Processos</h2>
        <p className="text-sm text-gray-500 mt-1">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-legal-800 rounded-xl shadow-sm border border-gray-100 dark:border-legal-700 overflow-hidden print:shadow-none print:border-gray-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-gray-50 dark:bg-legal-900/50 border-b border-gray-100 dark:border-legal-700 print:bg-gray-100">
                 <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">OS #</th>
                 <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Cliente</th>
                 <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Área</th>
                 <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                 <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Responsável</th>
                 <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Valor</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-legal-700">
               {filteredData.length > 0 ? filteredData.map(os => (
                 <tr key={os.id} className="hover:bg-gray-50 dark:hover:bg-legal-700/50 print:hover:bg-white">
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{os.osNumber}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{os.clientName}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{os.legalArea}</td>
                    <td className="p-4 text-sm">
                       <span className={`px-2 py-0.5 rounded text-xs font-medium border print:border-0 print:p-0 ${
                         os.status === OSStatus.CONCLUIDA ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                         'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                       }`}>
                         {os.status}
                       </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{os.responsible}</td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                      {(os.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                 </tr>
               )) : (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum registro encontrado para os filtros selecionados.</td>
                 </tr>
               )}
             </tbody>
          </table>
        </div>
      </div>
      
      {/* Print Styles Injection */}
      <style>{`
        @media print {
          body {
            background-color: white;
            color: black;
          }
          aside, header, button {
            display: none !important;
          }
          .min-h-screen {
            height: auto;
            overflow: visible;
          }
          main {
            overflow: visible !important;
            height: auto !important;
          }
          /* Ensure graphics/colors print if user enables it, otherwise keep clean */
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `}</style>
    </div>
  );
};
