import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

interface Notification {
  id: number;
  type: "csv" | "product" | "ai" | "alert" | "info";
  title: string;
  description: string;
  category: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "csv",
    title: "CSV Importado com sucesso",
    description: "211 produtos carregados e classificados automaticamente.",
    category: "Importação",
    time: "agora mesmo",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "Produto com alta tributação",
    description: "Cerveja antartic atingiu 45.3% de carga tributária.",
    category: "Alerta",
    time: "2 min atrás",
    read: false,
  },
  {
    id: 3,
    type: "ai",
    title: "Análise IA concluída",
    description: "Relatório de Arroz Vasconcelos gerado com sucesso.",
    category: "Inteligência Artificial",
    time: "5 min atrás",
    read: false,
  },
  {
    id: 4,
    type: "product",
    title: "Novo produto cadastrado",
    description: "Alcatra foi adicionado à categoria Carnes.",
    category: "Cadastro",
    time: "12 min atrás",
    read: true,
  },
  {
    id: 5,
    type: "alert",
    title: "Variação de preço detectada",
    description: "Gasolina Comum subiu 2.1% em relação ao mês anterior.",
    category: "Preços",
    time: "1 hora atrás",
    read: true,
  },
  {
    id: 6,
    type: "info",
    title: "Lista de compras atualizada",
    description: "3 itens adicionados — total: R$ 87,40.",
    category: "Lista",
    time: "2 horas atrás",
    read: true,
  },
];

// Ícone SVG por tipo de notificação
function NotifIcon({ type }: { type: Notification["type"] }) {
  const configs = {
    csv: { bg: "bg-emerald-100 dark:bg-emerald-900/40", color: "text-emerald-600 dark:text-emerald-400" },
    product: { bg: "bg-violet-100 dark:bg-violet-900/40", color: "text-violet-600 dark:text-violet-400" },
    ai: { bg: "bg-blue-100 dark:bg-blue-900/40", color: "text-blue-600 dark:text-blue-400" },
    alert: { bg: "bg-rose-100 dark:bg-rose-900/40", color: "text-rose-600 dark:text-rose-400" },
    info: { bg: "bg-amber-100 dark:bg-amber-900/40", color: "text-amber-600 dark:text-amber-400" },
  };
  const c = configs[type];

  const icons = {
    csv: (
      <svg className={`w-5 h-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" />
      </svg>
    ),
    product: (
      <svg className={`w-5 h-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    ai: (
      <svg className={`w-5 h-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    alert: (
      <svg className={`w-5 h-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className={`w-5 h-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return (
    <span className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${c.bg}`}>
      {icons[type]}
    </span>
  );
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 z-10 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1 leading-none">
            {unread}
            <span className="absolute inline-flex w-full h-full bg-rose-400 rounded-full opacity-50 animate-ping" />
          </span>
        )}
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[380px] lg:right-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-bold text-gray-800 dark:text-gray-200">Notificações</h5>
            {unread > 0 && (
              <span className="flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors">
                Marcar todas como lidas
              </button>
            )}
            <button onClick={closeDropdown} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista */}
        <ul className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {notifications.map((notif) => (
            <li key={notif.id}>
              <DropdownItem
                onItemClick={() => { markRead(notif.id); closeDropdown(); }}
                className={`flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!notif.read ? "bg-blue-50/60 dark:bg-white/[0.03]" : ""}`}
              >
                <NotifIcon type={notif.type} />
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className={`text-sm font-semibold truncate ${notif.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
                      {notif.title}
                    </span>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {notif.description}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-[11px] mt-0.5">
                    <span>{notif.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />
                    <span>{notif.time}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/"
            onClick={closeDropdown}
            className="block w-full px-4 py-2.5 text-sm font-medium text-center text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Ver todas as notificações
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
