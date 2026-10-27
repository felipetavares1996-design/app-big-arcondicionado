'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Equipment,
  ServiceOrder,
  NewPointRequest,
  ViewMode,
  OrderPriority,
  OrderStatus,
  ServiceOrderType,
} from '@/types';
import {
  INITIAL_CLIENTS,
  INITIAL_EQUIPMENTS,
  INITIAL_TICKETS,
  INITIAL_NEW_POINTS,
} from '@/data/mockData';
import confetti from 'canvas-confetti';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Clients & Recintos
  clients: Client[];
  activeClient: Client;
  setActiveClient: (client: Client) => void;
  addNewClient: (newClientData: Omit<Client, 'id' | 'created_at'>) => void;

  // Equipments & Tickets
  equipments: Equipment[];
  tickets: ServiceOrder[];
  newPoints: NewPointRequest[];
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  showToast: (
    title: string,
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning'
  ) => void;

  // Modals state
  selectedEquipment: Equipment | null;
  setSelectedEquipment: (eq: Equipment | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isOpenTicketModalOpen: boolean;
  setIsOpenTicketModalOpen: (open: boolean) => void;
  isNewPointModalOpen: boolean;
  setIsNewPointModalOpen: (open: boolean) => void;

  // 6-Month Preventive Alert Pop-up
  isPreventiveAlertOpen: boolean;
  setIsPreventiveAlertOpen: (open: boolean) => void;
  preventiveAlertEquipment: Equipment | null;
  setPreventiveAlertEquipment: (eq: Equipment | null) => void;
  checkAndTriggerPreventiveAlert: (clientToScan?: Client) => void;

  // CRM 360° Modals
  isClient360DrawerOpen: boolean;
  setIsClient360DrawerOpen: (open: boolean) => void;
  client360Selected: Client | null;
  setClient360Selected: (client: Client | null) => void;
  isNewClientModalOpen: boolean;
  setIsNewClientModalOpen: (open: boolean) => void;

  // CRM OS & Tag Modals
  isCompleteOsModalOpen: boolean;
  setIsCompleteOsModalOpen: (open: boolean) => void;
  ticketToComplete: ServiceOrder | null;
  setTicketToComplete: (ticket: ServiceOrder | null) => void;
  isQrTagModalOpen: boolean;
  setIsQrTagModalOpen: (open: boolean) => void;
  qrTagEquipment: Equipment | null;
  setQrTagEquipment: (eq: Equipment | null) => void;
  isBatchPrintModalOpen: boolean;
  setIsBatchPrintModalOpen: (open: boolean) => void;

  // Pre-filled ticket intent
  prefillServiceType: ServiceOrderType;
  setPrefillServiceType: (type: ServiceOrderType) => void;

  // Actions
  openTicketFromClient: (ticketData: {
    equipmentId: string;
    tipo_servico: ServiceOrderType;
    prioridade: OrderPriority;
    relato_cliente: string;
    preferencia_data?: string;
    fotos_problema?: string[];
  }) => void;
  updateTicketStatus: (
    ticketId: string,
    newStatus: OrderStatus,
    tecnico_nome?: string
  ) => void;
  completeOs: (params: {
    ticketId: string;
    tecnico_nome: string;
    pecas_utilizadas: string;
    relatorio_tecnico: string;
    renewCycle: boolean;
  }) => void;
  rateServiceOrder: (ticketId: string, stars: number) => void;
  addNewPointRequest: (
    request: Omit<NewPointRequest, 'id' | 'createdAt' | 'status'>
  ) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('client');
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [activeClient, setActiveClient] = useState<Client>(INITIAL_CLIENTS[0]); // Dr. Fernando Silveira
  const [equipments, setEquipments] = useState<Equipment[]>(INITIAL_EQUIPMENTS);
  const [tickets, setTickets] = useState<ServiceOrder[]>(INITIAL_TICKETS);
  const [newPoints, setNewPoints] = useState<NewPointRequest[]>(INITIAL_NEW_POINTS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals state
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOpenTicketModalOpen, setIsOpenTicketModalOpen] = useState(false);
  const [isNewPointModalOpen, setIsNewPointModalOpen] = useState(false);

  // 6-Month Preventive Alert Pop-up
  const [isPreventiveAlertOpen, setIsPreventiveAlertOpen] = useState(false);
  const [preventiveAlertEquipment, setPreventiveAlertEquipment] = useState<Equipment | null>(null);

  // CRM 360° Modals
  const [isClient360DrawerOpen, setIsClient360DrawerOpen] = useState(false);
  const [client360Selected, setClient360Selected] = useState<Client | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  // CRM OS & Tag Modals
  const [isCompleteOsModalOpen, setIsCompleteOsModalOpen] = useState(false);
  const [ticketToComplete, setTicketToComplete] = useState<ServiceOrder | null>(null);
  const [isQrTagModalOpen, setIsQrTagModalOpen] = useState(false);
  const [qrTagEquipment, setQrTagEquipment] = useState<Equipment | null>(null);
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);

  const [prefillServiceType, setPrefillServiceType] = useState<ServiceOrderType>('MANUTENCAO_CORRETIVA_DEFEITO');

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check and trigger preventive alert for client
  const checkAndTriggerPreventiveAlert = (clientToScan?: Client) => {
    const targetClient = clientToScan || activeClient;
    const clientEquipments = equipments.filter((e) => e.cliente_id === targetClient.id);
    const warningEquipment = clientEquipments.find(
      (e) => e.daysRemaining <= 30 && e.status_instalacao === 'INSTALADO_EM_OPERACAO'
    );

    if (warningEquipment) {
      setPreventiveAlertEquipment(warningEquipment);
      setIsPreventiveAlertOpen(true);
    }
  };

  // Automatically trigger preventive alert pop-up on mount for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAndTriggerPreventiveAlert(INITIAL_CLIENTS[0]);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // When active client changes, check if they have a preventive alert
  const handleSetActiveClient = (client: Client) => {
    setActiveClient(client);
    checkAndTriggerPreventiveAlert(client);
    showToast(
      'Perfil do Cliente Alterado',
      `Visualizando agora como: ${client.nome_completo} (${client.tipo_cliente}).`,
      'info'
    );
  };

  // Open ticket from Client App
  const openTicketFromClient = (data: {
    equipmentId: string;
    tipo_servico: ServiceOrderType;
    prioridade: OrderPriority;
    relato_cliente: string;
    preferencia_data?: string;
    fotos_problema?: string[];
  }) => {
    const eq = equipments.find((e) => e.id === data.equipmentId) || equipments[0];
    const newOsNumber = `OS-2026-${Math.floor(100 + Math.random() * 900)}`;

    let title = 'Ordem de Serviço Técnica';
    if (data.tipo_servico === 'MANUTENCAO_PREVENTIVA_6_MESES') {
      title = 'Revisão Preventiva Semestral (6 Meses)';
    } else if (data.tipo_servico === 'INSTALACAO_NOVO_APARELHO') {
      title = 'Instalação de Novo Ponto de Climatização';
    } else {
      title = `Reparo Técnico: ${data.relato_cliente.slice(0, 35)}...`;
    }

    const newOrder: ServiceOrder = {
      id: newOsNumber,
      numero_os: newOsNumber,
      cliente_id: activeClient.id,
      cliente_nome: activeClient.nome_completo,
      equipamento_id: eq.id,
      equipamento_tag: eq.tag_patrimonio,
      equipamento_nome: eq.name,
      endereco_apelido: eq.endereco_apelido,
      tipo_servico: data.tipo_servico,
      status: 'RECEBIDO_TRIAGEM',
      prioridade: data.prioridade,
      relato_cliente: data.relato_cliente,
      fotos_problema: data.fotos_problema || [],
      preferencia_data: data.preferencia_data,
      data_abertura: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      // Compatibility
      title,
      description: data.relato_cliente,
      openedAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      openedBy: activeClient.nome_completo,
      priority: data.prioridade,
      location: `${eq.endereco_apelido} - ${eq.location}`,
    };

    setTickets((prev) => [newOrder, ...prev]);
    showToast(
      'Chamado Registrado no CRM!',
      `OS ${newOsNumber} aberta com sucesso para ${eq.tag_patrimonio}. Enviada para triagem técnica.`,
      'success'
    );
  };

  // Update Ticket Status (Kanban mover)
  const updateTicketStatus = (
    ticketId: string,
    newStatus: OrderStatus,
    tecnico_nome?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId || t.numero_os === ticketId) {
          return {
            ...t,
            status: newStatus,
            tecnico_nome: tecnico_nome || t.tecnico_nome || 'Carlos Eduardo Silva',
            technician: tecnico_nome || t.technician || 'Carlos Eduardo Silva',
          };
        }
        return t;
      })
    );

    const statusLabels: Record<OrderStatus, string> = {
      RECEBIDO_TRIAGEM: 'Recebido (Triagem)',
      TECNICO_ATRIBUIDO: 'Técnico Atribuído',
      EM_DESLOCAMENTO: 'Em Deslocamento',
      EM_EXECUCAO: 'Em Execução / Atendimento',
      CONCLUIDO: 'Concluído',
    };

    showToast(
      'Ordem de Serviço Atualizada',
      `Chamado ${ticketId} movido para "${statusLabels[newStatus]}".`,
      'info'
    );
  };

  // Complete OS & Reset PMOC 6-month cycle
  const completeOs = (params: {
    ticketId: string;
    tecnico_nome: string;
    pecas_utilizadas: string;
    relatorio_tecnico: string;
    renewCycle: boolean;
  }) => {
    const ticket = tickets.find((t) => t.id === params.ticketId || t.numero_os === params.ticketId);
    if (!ticket) return;

    const todayStr = new Date().toLocaleDateString('pt-BR');
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 180);
    const nextDueDateStr = nextDate.toLocaleDateString('pt-BR');

    // Update ticket
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === params.ticketId || t.numero_os === params.ticketId) {
          return {
            ...t,
            status: 'CONCLUIDO',
            tecnico_nome: params.tecnico_nome,
            technician: params.tecnico_nome,
            pecas_utilizadas: params.pecas_utilizadas,
            partsReplaced: params.pecas_utilizadas,
            relatorio_tecnico: params.relatorio_tecnico,
            serviceReport: params.relatorio_tecnico,
            data_conclusao: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
            completedAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
          };
        }
        return t;
      })
    );

    // If renewCycle is checked, reset equipment cycle to 180 days!
    if (params.renewCycle && ticket.equipamento_id) {
      setEquipments((prev) =>
        prev.map((eq) => {
          if (eq.id === ticket.equipamento_id || eq.tag_patrimonio === ticket.equipamento_tag) {
            return {
              ...eq,
              status_instalacao: 'INSTALADO_EM_OPERACAO',
              data_ultima_manutencao: todayStr,
              data_proxima_preventiva: nextDueDateStr,
              daysRemaining: 180,
              status: 'ok',
              lastReport: {
                reportNumber: `LAUDO-PMOC-2026/${Math.floor(1000 + Math.random() * 9000)}`,
                inspectionDate: todayStr,
                technician: params.tecnico_nome,
                crea: 'CREA-SP 50698421-D',
                artNumber: `ART-SP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
                cleanlinessStatus: 'Aprovado',
                airQualityPpm: 420,
                temperatureMeasured: 21.0,
                humidity: 50,
                filterReplaced: true,
                chemicalDisinfection: true,
                drainCleaned: true,
                electricalTightening: true,
                refrigerantPressurePsi: 120,
                anvisaCompliant: true,
                validUntil: nextDueDateStr,
                observations: `Intervenção técnica concluída. ${params.relatorio_tecnico}. Peças trocadas: ${params.pecas_utilizadas}. Ciclo de 6 meses renovado com sucesso (180 dias restantes).`,
              },
            };
          }
          return eq;
        })
      );
    }

    try {
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore in test environments
    }

    showToast(
      'OS Concluída com Sucesso!',
      `Chamado ${params.ticketId} finalizado. O ciclo preventivo de 6 meses do aparelho foi renovado para +180 dias!`,
      'success'
    );
  };

  // Star Rating for Completed OS
  const rateServiceOrder = (ticketId: string, stars: number) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId || t.numero_os === ticketId) {
          return {
            ...t,
            avaliacao_cliente_estrelas: stars,
          };
        }
        return t;
      })
    );

    try {
      confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
    } catch {}

    showToast(
      'Avaliação Registrada!',
      `Você avaliou o atendimento com ${stars} estrela(s). Muito obrigado pelo seu feedback!`,
      'success'
    );
  };

  // Add New Client
  const addNewClient = (newClientData: Omit<Client, 'id' | 'created_at'>) => {
    const newId = `cli-${newClientData.tipo_cliente.toLowerCase()}-${String(clients.length + 1).padStart(3, '0')}`;
    const newClient: Client = {
      ...newClientData,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
    };

    setClients((prev) => [newClient, ...prev]);
    showToast(
      'Cliente Cadastrado!',
      `Novo cliente "${newClient.nome_completo}" adicionado à base com ${newClient.enderecos.length} recinto(s).`,
      'success'
    );
  };

  // Add new point request
  const addNewPointRequest = (
    request: Omit<NewPointRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newId = `SOL-NOVO-2026-${String(newPoints.length + 1).padStart(2, '0')}`;
    const newReq: NewPointRequest = {
      ...request,
      id: newId,
      cliente_id: activeClient.id,
      status: 'Pendente Vistoria Técnica',
      createdAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setNewPoints((prev) => [newReq, ...prev]);
    showToast(
      'Solicitação de Ponto Enviada!',
      `Protocolo ${newId} gerado para ${request.unitLocation}. A equipe técnica agendará a visita in loco.`,
      'success'
    );
  };

  const resetDemoData = () => {
    setClients(INITIAL_CLIENTS);
    setActiveClient(INITIAL_CLIENTS[0]);
    setEquipments(INITIAL_EQUIPMENTS);
    setTickets(INITIAL_TICKETS);
    setNewPoints(INITIAL_NEW_POINTS);
    showToast(
      'Dados de Demonstração Restaurados',
      'Clientes, aparelhos, chamados e recintos foram resetados.',
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        clients,
        activeClient,
        setActiveClient: handleSetActiveClient,
        addNewClient,
        equipments,
        tickets,
        newPoints,
        toasts,
        removeToast,
        showToast,
        selectedEquipment,
        setSelectedEquipment,
        isDetailModalOpen,
        setIsDetailModalOpen,
        isScannerOpen,
        setIsScannerOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isOpenTicketModalOpen,
        setIsOpenTicketModalOpen,
        isNewPointModalOpen,
        setIsNewPointModalOpen,
        isPreventiveAlertOpen,
        setIsPreventiveAlertOpen,
        preventiveAlertEquipment,
        setPreventiveAlertEquipment,
        checkAndTriggerPreventiveAlert,
        isClient360DrawerOpen,
        setIsClient360DrawerOpen,
        client360Selected,
        setClient360Selected,
        isNewClientModalOpen,
        setIsNewClientModalOpen,
        isCompleteOsModalOpen,
        setIsCompleteOsModalOpen,
        ticketToComplete,
        setTicketToComplete,
        isQrTagModalOpen,
        setIsQrTagModalOpen,
        qrTagEquipment,
        setQrTagEquipment,
        isBatchPrintModalOpen,
        setIsBatchPrintModalOpen,
        prefillServiceType,
        setPrefillServiceType,
        openTicketFromClient,
        updateTicketStatus,
        completeOs,
        rateServiceOrder,
        addNewPointRequest,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
