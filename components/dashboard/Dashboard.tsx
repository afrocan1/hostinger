import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { useUserCollection } from '@/lib/useUserCollection';
import { 
  Search, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  Hash,
  ChevronDown,
  ChevronRight,
  Inbox,
  Calendar,
  Activity,
  CreditCard,
  Globe,
  Terminal,
  Blocks,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  X
} from 'lucide-react';

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

type DomainDoc = { name: string; status: string; expires: string; autoRenew: boolean };
type HostingDoc = { planName: string; domain: string; status: string; renews: string; category: 'web' | 'wordpress' };
type VpsDoc = { serverName: string; plan: string; status: string; ip: string };
type InvoiceDoc = { invoiceNumber: string; amount: string; status: string; date: string };
type NotificationDoc = { message: string; date: string };

function makeNavGroups(counts: { inbox: number }): NavGroupData[] {
  return [
    {
      items: [
        { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
        { id: 'home', title: 'Dashboard', icon: LayoutDashboard },
        { id: 'inbox', title: 'Notifications', icon: Inbox, badge: counts.inbox || undefined },
        { id: 'analytics', title: 'Usage', icon: Activity },
      ]
    },
    {
      heading: 'My Products',
      items: [
        { 
          id: 'projects', 
          title: 'Hosting', 
          icon: FolderKanban,
          children: [
            { id: 'p-active', title: 'Web Hosting', icon: Hash },
            { id: 'p-archived', title: 'WordPress Hosting', icon: Hash },
          ]
        },
        { id: 'calendar', title: 'Renewals', icon: Calendar },
        { 
          id: 'team', 
          title: 'VPS', 
          icon: Users,
          children: [
            { id: 't-design', title: 'VPS Hosting', icon: Hash },
          ]
        },
        { 
          id: 'customers', 
          title: 'Domains', 
          icon: Globe,
          children: [
            { id: 'c-enterprise', title: 'My Domains', icon: Hash },
            { id: 'c-smb', title: 'Domain Transfer', icon: Hash },
          ]
        },
        { id: 'finance', title: 'Billing', icon: CreditCard },
      ]
    },
    {
      heading: 'Developers',
      items: [
        { id: 'api', title: 'API Keys', icon: Terminal },
        { id: 'webhooks', title: 'Webhooks', icon: Blocks },
      ]
    }
  ];
}

const mockBottomItems: NavItemData[] = [
  { id: 'settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

function WorkspaceSwitcher({ selected, onSelect }: { selected?: string, onSelect?: (ws: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState('My Account');
  
  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-2 mb-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[13px] shadow-sm">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-medium leading-none mb-1 text-foreground truncate max-w-[120px]">{current}</span>
            <span className="text-[11px] text-muted-foreground leading-none">Pro Plan</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors shrink-0" strokeWidth={1.5} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-card border border-border/50 rounded-lg shadow-xl z-50 py-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
            {['My Account', 'Reseller Panel', 'Client Sandbox'].map(ws => (
              <div 
                key={ws}
                onClick={() => { handleSelect(ws); setIsOpen(false); }}
                className={`px-3 py-2 mx-1 text-[13px] rounded-md cursor-pointer transition-colors ${current === ws ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {ws}
              </div>
            ))}
            <div className="h-px bg-border/50 my-1 mx-2" />
            <div className="px-3 py-2 mx-1 text-[13px] text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer flex items-center gap-2 transition-colors">
              <span className="text-[16px] leading-none mb-0.5">+</span> Add Account
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ 
  item, 
  activeId, 
  onSelect,
  level = 0
}: { 
  item: NavItemData; 
  activeId: string; 
  onSelect: (id: string) => void;
  level?: number;
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`group flex items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none
          ${isActive 
            ? 'bg-black/5 dark:bg-white/10 text-foreground font-medium' 
            : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground/90'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <item.icon 
            className={`w-[16px] h-[16px] transition-colors
              ${isActive ? 'text-foreground' : 'text-muted-foreground/70 group-hover:text-foreground/70'}
            `} 
            strokeWidth={1.5} 
          />
          <span className="text-[13px] tracking-wide truncate">
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {item.shortcut && (
             <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium font-mono text-muted-foreground/60 bg-background/50 border border-border/50 rounded-[4px] shadow-xs">
               {item.shortcut}
             </kbd>
          )}
          {item.badge && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight 
              className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l border-black/5 dark:border-white/5"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activeId={activeId} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  activeId,
  onSelect,
  activeWorkspace,
  onWorkspaceSelect,
  inboxCount = 0,
}: { 
  className?: string,
  activeId?: string,
  onSelect?: (id: string) => void,
  activeWorkspace?: string,
  onWorkspaceSelect?: (ws: string) => void,
  inboxCount?: number,
}) {
  const [internalId, setInternalId] = useState('home');
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;
  const navGroups = makeNavGroups({ inbox: inboxCount });

  return (
    <div className={`flex flex-col w-[260px] h-full bg-card/50 border-r border-border/50 p-3 font-sans ${className}`}>
      <WorkspaceSwitcher selected={activeWorkspace} onSelect={onWorkspaceSelect} />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-2.5 mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground/50 uppercase">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                activeId={currentId} 
                onSelect={handleSelect} 
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-0.5">
        {mockBottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={currentId} 
            onSelect={handleSelect} 
          />
        ))}
      </div>
    </div>
  );
}

function AvatarMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut(auth);
    router.push('/');
  };

  const initial = (user?.displayName || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border border-primary/20 overflow-hidden flex items-center justify-center bg-primary/10 shrink-0"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[12px] font-semibold text-primary uppercase">{initial}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[42px] right-0 w-52 bg-card border border-border/50 rounded-lg shadow-xl z-50 py-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 mx-1">
              <p className="text-[13px] font-medium text-foreground truncate">{user?.displayName || 'My Account'}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="h-px bg-border/50 my-1 mx-2" />
            <Link href="/">
              <div
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 mx-1 text-[13px] text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer"
              >
                Back to Homepage
              </div>
            </Link>
            <div
              onClick={handleLogout}
              className="px-3 py-2 mx-1 text-[13px] text-destructive hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer"
            >
              Log out
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type LiveData = {
  domains: (DomainDoc & { id: string })[];
  hosting: (HostingDoc & { id: string })[];
  vps: (VpsDoc & { id: string })[];
  invoices: (InvoiceDoc & { id: string })[];
  notifications: (NotificationDoc & { id: string })[];
  loading: boolean;
};

const sectionCopy: Record<string, { title: string; subtitle: string }> = {
  home: { title: 'Welcome back', subtitle: "Here's what's happening with your account today." },
  inbox: { title: 'Notifications', subtitle: 'Updates about your domains, hosting, and billing.' },
  analytics: { title: 'Usage', subtitle: 'Resource usage across your active services.' },
  projects: { title: 'Hosting', subtitle: 'Manage your hosting plans.' },
  'p-active': { title: 'Web Hosting', subtitle: 'Your active web hosting plans.' },
  'p-archived': { title: 'WordPress Hosting', subtitle: 'Your active WordPress hosting plans.' },
  calendar: { title: 'Renewals', subtitle: 'Upcoming renewals across your account.' },
  team: { title: 'VPS', subtitle: 'Manage your VPS servers.' },
  't-design': { title: 'VPS Hosting', subtitle: 'Your VPS servers.' },
  customers: { title: 'Domains', subtitle: 'Manage your domains.' },
  'c-enterprise': { title: 'My Domains', subtitle: 'All domains on your account.' },
  'c-smb': { title: 'Domain Transfer', subtitle: 'Transfer a domain into your account.' },
  finance: { title: 'Billing', subtitle: 'Invoices and payment methods.' },
  api: { title: 'API Keys', subtitle: 'Manage API keys for programmatic access to your account.' },
  webhooks: { title: 'Webhooks', subtitle: 'Get notified when events happen on your account.' },
  settings: { title: 'Settings', subtitle: 'Manage your account preferences.' },
};

function buildTable(id: string, live: LiveData): { columns: string[]; rows: string[][] } | null {
  switch (id) {
    case 'home':
      return {
        columns: ['Item', 'Type', 'Status', 'Renews'],
        rows: [
          ...live.domains.map(d => [d.name, 'Domain', d.status, d.expires]),
          ...live.hosting.map(h => [h.planName, 'Hosting', h.status, h.renews]),
        ],
      };
    case 'inbox':
      return {
        columns: ['Notification', 'Date'],
        rows: live.notifications.map(n => [n.message, n.date]),
      };
    case 'projects':
      return {
        columns: ['Plan', 'Domain', 'Status', 'Renews'],
        rows: live.hosting.map(h => [h.planName, h.domain, h.status, h.renews]),
      };
    case 'p-active':
      return {
        columns: ['Plan', 'Domain', 'Status', 'Renews'],
        rows: live.hosting.filter(h => h.category === 'web').map(h => [h.planName, h.domain, h.status, h.renews]),
      };
    case 'p-archived':
      return {
        columns: ['Plan', 'Domain', 'Status', 'Renews'],
        rows: live.hosting.filter(h => h.category === 'wordpress').map(h => [h.planName, h.domain, h.status, h.renews]),
      };
    case 'calendar':
      return {
        columns: ['Item', 'Renews', 'Auto-renew'],
        rows: [
          ...live.domains.map(d => [d.name, d.expires, d.autoRenew ? 'On' : 'Off']),
          ...live.hosting.map(h => [h.planName, h.renews, 'On']),
        ],
      };
    case 'team':
    case 't-design':
      return {
        columns: ['Server', 'Plan', 'Status', 'IP Address'],
        rows: live.vps.map(v => [v.serverName, v.plan, v.status, v.ip]),
      };
    case 'customers':
    case 'c-enterprise':
      return {
        columns: ['Domain', 'Status', 'Expires', 'Auto-renew'],
        rows: live.domains.map(d => [d.name, d.status, d.expires, d.autoRenew ? 'On' : 'Off']),
      };
    case 'finance':
      return {
        columns: ['Invoice', 'Amount', 'Status', 'Date'],
        rows: live.invoices.map(i => [i.invoiceNumber, i.amount, i.status, i.date]),
      };
    default:
      return null;
  }
}

function buildStats(id: string, live: LiveData): { label: string; value: string }[] | null {
  if (id === 'home') {
    const nextExpiry = live.domains
      .map(d => d.expires)
      .sort()[0];
    return [
      { label: 'Active Domains', value: String(live.domains.filter(d => d.status === 'Active').length) },
      { label: 'Active Hosting Plans', value: String(live.hosting.filter(h => h.status === 'Active').length) },
      { label: 'Open Tickets', value: '0' },
      { label: 'Next Renewal', value: nextExpiry || '—' },
    ];
  }
  if (id === 'analytics') {
    return [
      { label: 'Storage Used', value: '—' },
      { label: 'Bandwidth This Month', value: '—' },
      { label: 'Email Accounts', value: '—' },
      { label: 'Uptime (30d)', value: '—' },
    ];
  }
  if (id === 'finance') {
    const nextInvoice = live.invoices.find(i => i.status !== 'Paid');
    return [
      { label: 'Next Invoice', value: nextInvoice?.amount || '—' },
      { label: 'Due Date', value: nextInvoice?.date || '—' },
      { label: 'Payment Method', value: 'Not on file' },
    ];
  }
  return null;
}

function SectionContent({ id, live }: { id: string; live: LiveData }) {
  const copy = sectionCopy[id] || sectionCopy.home;
  const stats = buildStats(id, live);
  const table = buildTable(id, live);

  if (live.loading) {
    return (
      <>
        <div className="flex items-center justify-between mb-8">
          <div className="w-48 h-8 bg-black/5 dark:bg-white/5 rounded-md animate-pulse" />
        </div>
        <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-6">
          <div className="flex flex-col gap-4">
            <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg animate-pulse" />
            <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg animate-pulse" />
            <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{copy.title}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">{copy.subtitle}</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border/50 shadow-sm p-4 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              <span className="text-[15px] font-semibold text-foreground truncate">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {table && table.rows.length > 0 && (
        <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 md:p-6 overflow-x-auto">
          <div
            className="grid gap-2 px-4 pb-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wide min-w-[480px]"
            style={{ gridTemplateColumns: `repeat(${table.columns.length}, minmax(0, 1fr))` }}
          >
            {table.columns.map((col) => (
              <span key={col} className="truncate">{col}</span>
            ))}
          </div>
          <div className="flex flex-col gap-2 min-w-[480px]">
            {table.rows.map((row, i) => (
              <div
                key={i}
                className="grid gap-2 items-center h-12 px-4 bg-black/5 dark:bg-white/5 rounded-lg text-[13px] text-foreground"
                style={{ gridTemplateColumns: `repeat(${table.columns.length}, minmax(0, 1fr))` }}
              >
                {row.map((cell, j) => (
                  <span key={j} className="truncate">{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!table || table.rows.length === 0) && (
        <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-10 flex items-center justify-center">
          <p className="text-[13px] text-muted-foreground">Nothing here yet.</p>
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('home');
  const [activeWorkspace, setActiveWorkspace] = useState('My Account');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const { data: domains, loading: domainsLoading } = useUserCollection<DomainDoc>('domains');
  const { data: hosting, loading: hostingLoading } = useUserCollection<HostingDoc>('hosting');
  const { data: vps, loading: vpsLoading } = useUserCollection<VpsDoc>('vps');
  const { data: invoices, loading: invoicesLoading } = useUserCollection<InvoiceDoc>('invoices');
  const { data: notifications, loading: notificationsLoading } = useUserCollection<NotificationDoc>('notifications');

  const live: LiveData = {
    domains, hosting, vps, invoices, notifications,
    loading: domainsLoading || hostingLoading || vpsLoading || invoicesLoading || notificationsLoading,
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSelect = (id: string) => {
    if (id === 'search') {
      setIsSearchOpen(true);
      return;
    }
    if (id === 'logout') {
      handleLogout();
      return;
    }
    setActiveId(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const activeTitle = (sectionCopy[activeId] || sectionCopy.home).title;

  return (
    <div className="flex w-full h-screen bg-background relative overflow-hidden">

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-card border-r border-border/50 ${
          isOpen
            ? 'w-[260px] translate-x-0 opacity-100'
            : 'w-[260px] -translate-x-full md:w-0 md:translate-x-0 opacity-100 md:opacity-0 border-none'
        }`}
      >
        <SidebarNav
          className="w-[260px] border-none bg-transparent"
          activeId={activeId}
          onSelect={handleSelect}
          activeWorkspace={activeWorkspace}
          onWorkspaceSelect={setActiveWorkspace}
          inboxCount={notifications.length}
        />
      </div>

      <div className="flex-1 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col min-w-0 transition-all duration-300">

        <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between bg-card shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors shrink-0"
            >
              {isOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <span className="truncate hidden sm:inline">{activeWorkspace}</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-medium text-foreground truncate">{activeTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-40 md:w-64 h-8 bg-black/5 dark:bg-white/5 rounded-md hidden sm:flex items-center gap-2 px-3 text-[12px] text-muted-foreground/70 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
              Search...
            </button>
            <AvatarMenu />
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SectionContent id={activeId} live={live} />
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/40 backdrop-blur-sm px-4">
          <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 border-b border-border/50">
              <Search className="w-[18px] h-[18px] text-muted-foreground/70 mr-3 shrink-0" strokeWidth={1.5} />
              <input
                autoFocus
                className="flex-1 bg-transparent py-4 outline-none text-[14px] text-foreground placeholder:text-muted-foreground/50"
                placeholder="Search domains, hosting plans, or actions..."
              />
              <kbd
                onClick={() => setIsSearchOpen(false)}
                className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-medium font-mono text-muted-foreground/70 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-[4px] cursor-pointer hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                ESC
              </kbd>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-3 p-1 rounded-md text-muted-foreground/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-2 py-8 flex flex-col items-center justify-center">
              <Command className="w-6 h-6 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
              <p className="text-[13px] text-muted-foreground font-medium">Type a domain, plan, or command...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
