import React, { useState, useEffect } from 'react';
import { INITIAL_SERVICE_ORDERS, INITIAL_CLIENTS } from './constants';
import { ServiceOrder, ViewMode, Client } from './types';
import { Dashboard } from './components/Dashboard';
import { ServiceOrderDetail } from './components/ServiceOrderDetail';
import { Reports } from './components/Reports';
import { Clients } from './components/Clients';
import { Documents } from './components/Documents';
import { AIChat } from './components/AIChat';
import { Icons } from './components/Icons';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('DASHBOARD');
  const [selectedOS, setSelectedOS] = useState<ServiceOrder | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State for User Management
  const [userName, setUserName] = useState<string>('Dra. Ana Beatriz Castellucci');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');

  // State for Clients
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('lexflow_clients');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch (e) {
      return INITIAL_CLIENTS;
    }
  });

  // State for Orders with Persistence logic
  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('lexflow_orders');
      return saved ? JSON.parse(saved) : INITIAL_SERVICE_ORDERS;
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return INITIAL_SERVICE_ORDERS;
    }
  });

  // Load User from storage
  useEffect(() => {
    const savedUser = localStorage.getItem('lexflow_username');
    if (savedUser) setUserName(savedUser);
  }, []);

  // Save Orders to storage
  useEffect(() => {
    localStorage.setItem('lexflow_orders', JSON.stringify(orders));
  }, [orders]);

  // Save Clients to storage
  useEffect(() => {
    localStorage.setItem('lexflow_clients', JSON.stringify(clients));
  }, [clients]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSelectOS = (os: ServiceOrder) => {
    setSelectedOS(os);
    setViewMode('OS_DETAIL');
  };

  const handleNewOS = () => {
    setSelectedOS(undefined); // undefined means new
    setViewMode('NEW_OS');
  };

  const handleSaveOS = (os: ServiceOrder) => {
    // Robust saving: Check if ID exists. If yes, update. If no, add.
    const exists = orders.some(o => o.id === os.id);
    
    if (exists) {
      setOrders(prev => prev.map(o => o.id === os.id ? os : o));
    } else {
      setOrders(prev => [os, ...prev]);
    }

    setViewMode('DASHBOARD');
    setSelectedOS(undefined);
  };

  const handleDeleteOS = (osId: string) => {
      if (window.confirm('Tem certeza que deseja excluir esta Ordem de Serviço permanentemente?')) {
          setOrders(prev => prev.filter(o => o.id !== osId));
          // If we were viewing it, go back to dashboard
          if (viewMode === 'OS_DETAIL' && selectedOS?.id === osId) {
              setViewMode('DASHBOARD');
              setSelectedOS(undefined);
          }
      }
  };

  const handleSaveClient = (client: Client) => {
      const exists = clients.some(c => c.id === client.id);
      if (exists) {
          setClients(prev => prev.map(c => c.id === client.id ? client : c));
      } else {
          setClients(prev => [client, ...prev]);
      }
  };

  const handleOpenUserModal = () => {
    setTempName(userName);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      localStorage.setItem('lexflow_username', tempName);
      setIsUserModalOpen(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(n => n.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-legal-50 dark:bg-legal-900 transition-colors duration-300 flex">
      {/* Sidebar (Simplified) */}
      <aside className="w-20 lg:w-64 bg-legal-900 text-white flex-shrink-0 flex flex-col transition-all duration-300 print:hidden">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-legal-800">
           <Icons.Scale className="w-8 h-8 text-gold-500" />
           <span className="ml-3 font-bold text-lg hidden lg:block tracking-wide leading-tight">Escritório<br/>Rodrigo Moraes</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-2">
          <button 
            onClick={() => { setViewMode('DASHBOARD'); setSelectedOS(undefined); }}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'DASHBOARD' ? 'bg-legal-800 text-gold-500' : 'hover:bg-legal-800 text-gray-300'}`}
          >
            <Icons.LayoutDashboard className="w-6 h-6" />
            <span className="hidden lg:block">Dashboard</span>
          </button>

          <button 
            onClick={() => { setViewMode('REPORTS'); setSelectedOS(undefined); }}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'REPORTS' ? 'bg-legal-800 text-gold-500' : 'hover:bg-legal-800 text-gray-300'}`}
          >
            <Icons.BarChart className="w-6 h-6" />
            <span className="hidden lg:block">Relatórios</span>
          </button>
          
          <button 
             onClick={() => { setViewMode('DOCUMENTS'); setSelectedOS(undefined); }}
             className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'DOCUMENTS' ? 'bg-legal-800 text-gold-500' : 'hover:bg-legal-800 text-gray-300'}`}
          >
             <Icons.FileText className="w-6 h-6" />
             <span className="hidden lg:block">Documentos</span>
          </button>

          <button 
             onClick={() => { setViewMode('CLIENTS'); setSelectedOS(undefined); }}
             className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'CLIENTS' ? 'bg-legal-800 text-gold-500' : 'hover:bg-legal-800 text-gray-300'}`}
          >
             <Icons.Briefcase className="w-6 h-6" />
             <span className="hidden lg:block">Clientes</span>
          </button>
        </nav>

        <div className="p-4 border-t border-legal-800">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg hover:bg-legal-800 text-gray-300 transition-colors"
          >
            {isDarkMode ? <Icons.Sun className="w-6 h-6" /> : <Icons.Moon className="w-6 h-6" />}
            <span className="hidden lg:block">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-legal-800 border-b border-gray-200 dark:border-legal-700 flex items-center justify-between px-6 shadow-sm shrink-0 print:hidden">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {viewMode === 'DASHBOARD' ? 'Painel de Controle' : 
             viewMode === 'REPORTS' ? 'Relatórios & Métricas' :
             viewMode === 'NEW_OS' ? 'Nova Ordem de Serviço' : 
             viewMode === 'CLIENTS' ? 'Clientes' :
             viewMode === 'DOCUMENTS' ? 'Documentos' :
             'Detalhes da OS'}
          </h2>
          <div 
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-legal-700 p-2 rounded-lg transition-colors"
            onClick={handleOpenUserModal}
            title="Clique para alterar usuário"
          >
             <div className="h-8 w-8 rounded-full bg-legal-200 dark:bg-legal-600 flex items-center justify-center text-legal-800 dark:text-white font-bold text-sm">
                {getInitials(userName)}
             </div>
             <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">{userName}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 relative">
          {viewMode === 'DASHBOARD' && (
            <Dashboard 
              orders={orders} 
              onSelectOS={handleSelectOS} 
              onNewOS={handleNewOS}
              onDeleteOS={handleDeleteOS}
            />
          )}

          {viewMode === 'REPORTS' && (
            <Reports orders={orders} />
          )}

          {viewMode === 'CLIENTS' && (
            <Clients clients={clients} onSave={handleSaveClient} />
          )}

          {viewMode === 'DOCUMENTS' && (
            <Documents orders={orders} />
          )}

          {(viewMode === 'OS_DETAIL' || viewMode === 'NEW_OS') && (
            <ServiceOrderDetail 
              key={selectedOS ? selectedOS.id : 'new-os'}
              initialData={selectedOS} 
              currentUser={userName}
              clients={clients}
              onSave={handleSaveOS}
              onDelete={handleDeleteOS}
              onBack={() => {
                setViewMode('DASHBOARD');
                setSelectedOS(undefined);
              }}
            />
          )}
        </div>

        {/* AI Chat Integration */}
        <AIChat 
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          activeOS={selectedOS}
        />

        {/* User Modal */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-legal-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-legal-700 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Configurar Perfil</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome de Exibição</label>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:border-legal-600 rounded-lg dark:bg-legal-900 dark:text-white focus:ring-2 focus:ring-legal-500"
                    placeholder="Seu nome"
                  />
                  <p className="text-xs text-gray-500 mt-1">Este nome será usado no histórico das ordens de serviço.</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-legal-700 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-legal-900 dark:bg-gold-600 text-white rounded-lg hover:bg-legal-800 dark:hover:bg-gold-500 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;