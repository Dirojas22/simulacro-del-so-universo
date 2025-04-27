
import React from 'react';
import { AppWindow } from '../AppManager/AppManager';
import { Computer, Folder, Terminal, FileText } from 'lucide-react';

interface TaskbarProps {
  openApps: AppWindow[];
  activeAppId: string | null;
  onAppClick: (id: string) => void;
}

const Taskbar = ({ openApps, activeAppId, onAppClick }: TaskbarProps) => {
  const getAppIcon = (appId: string) => {
    switch (appId) {
      case 'computer':
        return <Computer size={18} />;
      case 'files':
        return <Folder size={18} />;
      case 'terminal':
        return <Terminal size={18} />;
      case 'notepad':
        return <FileText size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="os-taskbar fixed bottom-0 left-0 right-0 h-12 flex items-center px-2 z-50">
      <div className="flex-1 flex gap-1">
        {openApps.map((app) => (
          <button
            key={app.id}
            className={`flex items-center px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors ${
              app.id === activeAppId ? 'bg-white/20' : ''
            }`}
            onClick={() => onAppClick(app.id)}
          >
            <span className="mr-2">{getAppIcon(app.appId)}</span>
            <span className="text-sm text-white truncate max-w-28">{app.title}</span>
          </button>
        ))}
      </div>
      <div className="text-white text-sm px-3 py-1">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default Taskbar;
