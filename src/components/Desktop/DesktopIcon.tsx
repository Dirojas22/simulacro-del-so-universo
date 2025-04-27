
import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const DesktopIcon = ({ icon, label, onClick, className }: DesktopIconProps) => {
  return (
    <div 
      className={cn("os-desktop-icon text-os-text-primary cursor-pointer", className)} 
      onClick={onClick}
      onDoubleClick={onClick}
    >
      <div className="w-12 h-12 flex items-center justify-center mb-1 text-os-icon">
        {icon}
      </div>
      <span className="text-xs text-center font-medium max-w-16 break-words">{label}</span>
    </div>
  );
};

export default DesktopIcon;
