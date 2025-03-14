
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Banknote, Tag, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Transações', path: '/transactions', icon: <Banknote className="h-5 w-5" /> },
    { name: 'Categorias', path: '/categories', icon: <Tag className="h-5 w-5" /> },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-primary">GestorFinanceiro</h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {link.icon}
              <span className="ml-3">{link.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => {
              console.log('Logout clicked');
              // Implementar funcionalidade de logout
            }}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
