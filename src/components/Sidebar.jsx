import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, School, Store, Users, BarChart3, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './ui/utils.js';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Schools', href: '/schools', icon: School },
  { name: 'Vendors', href: '/vendors', icon: Store },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Support', href: '/support', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
      <div className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#16A34A] rounded-lg flex items-center justify-center">
                  <School className="w-5 h-5 text-white" />
                </div>
                <span className="text-[#111827]">EduConnect</span>
              </div>
          )}
          <button
              onClick={onToggle}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
                <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive
                            ? "bg-[#2563EB] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                    )}
                    title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Super Admin Portal v1.0
              </div>
            </div>
        )}
      </div>
  );
}