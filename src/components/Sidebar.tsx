'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  

  const menuItems = [
    {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'home',
  },
    { 
      href: '/dashboard/seva-requests', 
      label: 'Seva Requests', 
      icon: 'clipboard-document-list'
    },
    {
  href: '/dashboard/organisers',
  label: 'Organisers',
  icon: 'user-group'
},

    {
  href: '/dashboard/users',
  label: 'Users',
  icon: 'users'
},

    { 
      href: '/dashboard/attendance', 
      label: 'Attendance', 
      icon: 'users'
    },
   
  ];

  const handleLogout = async () => {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
    });
  } finally {
    router.push('/login');
  }
};


  // Heroicons SVG components (professional line icons)
  const Icons = {
    'home': (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5V15h4v6h5a1 1 0 001-1V10"
    />
  </svg>
),
    'clipboard-document-list': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    'users': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'user-group': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
        <img src="/logo.png" alt="Sikkim Seva" className="h-12 w-auto flex-shrink-0" />
        <div>
          <div className="text-xl font-semibold text-gray-900 leading-tight">Seva Admin</div>
          <div className="text-xs text-gray-500 font-medium tracking-wide">Portal</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
            }`}
          >
            <span className="w-6 mr-4 flex-shrink-0 opacity-90 group-hover:opacity-100">
              {Icons[item.icon as keyof typeof Icons]}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-100 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent hover:border-red-200"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
