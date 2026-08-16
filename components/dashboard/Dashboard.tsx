import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
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

const mockNavGroups: NavGroupData[] = [
  {
    items: [
      { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
      { id: 'home', title: 'Dashboard', icon: LayoutDashboard },
      { id: 'inbox', title: 'Notifications', icon: Inbox, badge: 3 },
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
          { id: 't-eng', title: 'CyberPanel Hosting', icon: Hash },
          { id: 't-product', title: 'Minecraft Hosting', icon: Hash },
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
  onWorkspaceSelect
}: { 
  className?: string,
  activeId?: string,
  onSelect?: (id: string) => void,
  activeWorkspace?: string,
  onWorkspaceSelect?: (ws: string) => void
}) {
  const [internalId, setInternalId] = useState('home');
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <div className={`flex flex-col w-[260px] h-full bg-card/50 border-r border-border/50 p-3 font-sans ${className}`}>
      <WorkspaceSwitcher selected={activeWorkspace} onSelect={onWorkspaceSelect} />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {mockNavGroups.map((group, idx) => (
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

const allItems = [...mockNavGroups.flatMap(g => g.items), ...mockBottomItems];
const flattenItems = (items: NavItemData[]): NavItemData[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flattenItems(item.children));
    return acc;
  }, [] as NavItemData[]);
};
const flatMockData = flattenItems(allItems);

// --- SECTION CONTENT DATA ---
type SectionData = {
  title: string;
  subtitle: string;
  stats?: { label: string; value: string }[];
  columns?: string[];
  rows?: string[][];
  emptyLabel?: string;
};

const sectionContent: Record<string, SectionData> = {
  home: {
    title: 'Welcome back',
    subtitle: "Here's what's happening with your account today.",
    stats: [
      { label: 'Active Domains', value: '2' },
      { label: 'Active Hosting Plans', value: '2' },
      { label: 'Open Tickets', value: '0' },
      { label: 'Next Renewal', value: '14 days' },
    ],
    columns: ['Item', 'Type', 'Status', 'Renews'],
    rows: [
      ['goaradio.com', 'Domain', 'Active', 'Mar 12, 2027'],
      ['Business Web Hosting', 'Hosting', 'Active', 'Jan 30, 2027'],
      ['thecartel.io', 'Domain', 'Active', 'Nov 4, 2026'],
    ],
  },
  inbox: {
    title: 'Notifications',
    subtitle: 'Updates about your domains, hosting, and billing.',
    columns: ['Notification', 'Date'],
    rows: [
      ['Your domain goaradio.com renews in 14 days', 'Today'],
      ['Invoice #4821 was paid', '2 days ago'],
      ['SSL certificate renewed for thecartel.io', '1 week ago'],
    ],
  },
  analytics: {
    title: 'Usage',
    subtitle: 'Resource usage across your active services.',
    stats: [
      { label: 'Storage Used', value: '4.2 GB / 20 GB' },
      { label: 'Bandwidth This Month', value: '18 GB' },
      { label: 'Email Accounts', value: '3 / 10' },
      { label: 'Uptime (30d)', value: '99.98%' },
    ],
  },
  projects: {
    title: 'Hosting',
    subtitle: 'Manage your hosting plans.',
    columns: ['Plan', 'Domain', 'Status', 'Renews'],
    rows: [
      ['Business Web Hosting', 'goaradio.com', 'Active', 'Jan 30, 2027'],
      ['WordPress Hosting', 'thecartel.io', 'Active', 'Feb 18, 2027'],
    ],
  },
  'p-active': {
    title: 'Web Hosting',
    subtitle: 'Your active web hosting plans.',
    columns: ['Plan', 'Domain', 'Status', 'Renews'],
    rows: [['Business Web Hosting', 'goaradio.com', 'Active', 'Jan 30, 2027']],
  },
  'p-archived': {
    title: 'WordPress Hosting',
    subtitle: 'Your active WordPress hosting plans.',
    columns: ['Plan', 'Domain', 'Status', 'Renews'],
    rows: [['WordPress Hosting', 'thecartel.io', 'Active', 'Feb 18, 2027']],
  },
  calendar: {
    title: 'Renewals',
    subtitle: 'Upcoming renewals across your account.',
    columns: ['Item', 'Renews', 'Auto-renew'],
    rows: [
      ['thecartel.io', 'Nov 4, 2026', 'On'],
      ['Business Web Hosting', 'Jan 30, 2027', 'On'],
      ['goaradio.com', 'Mar 12, 2027', 'On'],
    ],
  },
  team: {
    title: 'VPS',
    subtitle: 'Manage your VPS servers.',
    columns: ['Server', 'Plan', 'Status', 'IP Address'],
    rows: [['goaradio-node-1', 'VPS 2GB', 'Running', '192.0.2.14']],
  },
  't-design': {
    title: 'VPS Hosting',
    subtitle: 'Your VPS servers.',
    columns: ['Server', 'Plan', 'Status', 'IP Address'],
    rows: [['goaradio-node-1', 'VPS 2GB', 'Running', '192.0.2.14']],
  },
  't-eng': {
    title: 'CyberPanel Hosting',
    subtitle: 'Servers managed with CyberPanel.',
    emptyLabel: 'No CyberPanel servers yet.',
  },
  't-product': {
    title: 'Minecraft Hosting',
    subtitle: 'Your game servers.',
    emptyLabel: 'No Minecraft servers yet.',
  },
  customers: {
    title: 'Domains',
    subtitle: 'Manage your domains.',
    columns: ['Domain', 'Status', 'Expires', 'Auto-renew'],
    rows: [
      ['goaradio.com', 'Active', 'Mar 12, 2027', 'On'],
      ['thecartel.io', 'Active', 'Nov 4, 2026', 'On'],
    ],
  },
  'c-enterprise': {
    title: 'My Domains',
    subtitle: 'All domains on your account.',
    columns: ['Domain', 'Status', 'Expires', 'Auto-renew'],
    rows: [
      ['goaradio.com', 'Active', 'Mar 12, 2027', 'On'],
      ['thecartel.io', 'Active', 'Nov 4, 2026', 'On'],
    ],
  },
  'c-smb': {
    title: 'Domain Transfer',
    subtitle: 'Transfer a domain into your account.',
    emptyLabel: 'No transfers in progress.',
  },
  finance: {
    title: 'Billing',
    subtitle: 'Invoices and payment methods.',
    stats: [
      { label: 'Next Invoice', value: '$24.00' },
      { label: 'Due Date', value: 'Jan 30, 2027' },
      { label: 'Payment Method', value: 'Visa •••• 4242' },
    ],
    columns: ['Invoice', 'Amount', 'Status', 'Date'],
    rows: [
      ['#4821', '$24.00', 'Paid', 'Dec 30, 2026'],
      ['#4790', '$12.00', 'Paid', 'Nov 30, 2026'],
    ],
  },
  api: {
    title: 'API Keys',
    subtitle: 'Manage API keys for programmatic access to your account.',
    emptyLabel: 'No API keys yet.',
  },
  webhooks: {
    title: 'Webhooks',
    subtitle: 'Get notified when events happen on your account.',
    emptyLabel: 'No webhooks configured yet.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account preferences.',
    emptyLabel: 'Account settings will appear here.',
  },
};

function SectionContent({ id }: { id: string }) {
  const data = sectionContent[id] || sectionContent.home;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{data.title}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">{data.subtitle}</p>
        </div>
      </div>

      {data.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {data.stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border/50 shadow-sm p-4 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              <span className="text-[15px] font-semibold text-foreground truncate">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {data.columns && data.rows && (
        <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 md:p-6 overflow-x-auto">
          <div
            className="grid gap-2 px-4 pb-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wide min-w-[480px]"
            style={{ gridTemplateColumns: `repeat(${data.columns.length}, minmax(0, 1fr))` }}
          >
            {data.columns.map((col) => (
              <span key={col} className="truncate">{col}</span>
            ))}
          </div>
          <div className="flex flex-col gap-2 min-w-[480px]">
            {data.rows.map((row, i) => (
              <div
                key={i}
                className="grid gap-2 items-center h-12 px-4 bg-black/5 dark:bg-white/5 rounded-lg text-[13px] text-foreground"
                style={{ gridTemplateColumns: `repeat(${data.columns!.length}, minmax(0, 1fr))` }}
              >
                {row.map((cell, j) => (
                  <span key={j} className="truncate">{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.emptyLabel && (
        <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-10 flex items-center justify-center">
          <p className="text-[13px] text-muted-foreground">{data.emptyLabel}</p>
        </div>
      )}
    </>
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

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('home');
  const [activeWorkspace, setActiveWorkspace] = useState('My Account');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  const activeItem = flatMockData.find(i => i.id === activeId);
  const activeTitle = activeItem ? activeItem.title : 'Dashboard';

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
          <SectionContent id={activeId} />
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
