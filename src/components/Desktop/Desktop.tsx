
import React from 'react';
import DesktopIcon from './DesktopIcon';
import { Computer, Folder, Terminal, FileText } from 'lucide-react';

interface DesktopProps {
  onOpenApp: (appId: string) => void;
}

const Desktop = ({ onOpenApp }: DesktopProps) => {
  const desktopIcons = [
    { id: 'computer', icon: <Computer size={32} />, label: 'My Computer' },
    { id: 'files', icon: <Folder size={32} />, label: 'Files' },
    { id: 'terminal', icon: <Terminal size={32} />, label: 'Terminal' },
    { id: 'notepad', icon: <FileText size={32} />, label: 'Notepad' },
  ];

  return (
    <div className="w-full h-full p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 content-start">
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon.icon}
          label={icon.label}
          onClick={() => onOpenApp(icon.id)}
        />
      ))}
    </div>
  );
};

export default Desktop;
