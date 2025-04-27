
import React, { useState } from 'react';
import Window from '../Window/Window';
import ComputerApp from '../Apps/ComputerApp';
import FilesApp from '../Apps/FilesApp';
import TerminalApp from '../Apps/TerminalApp';
import NotepadApp from '../Apps/NotepadApp';

export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  isActive: boolean;
  isMinimized: boolean;
}

interface AppManagerProps {
  openApps: AppWindow[];
  activeAppId: string | null;
  onAppFocus: (id: string) => void;
  onAppClose: (id: string) => void;
  onAppMinimize: (id: string) => void;
  onAppMaximize: (id: string) => void;
}

const AppManager = ({ 
  openApps, 
  activeAppId, 
  onAppFocus, 
  onAppClose, 
  onAppMinimize, 
  onAppMaximize 
}: AppManagerProps) => {
  // Function to render the appropriate app content based on appId
  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'computer':
        return <ComputerApp />;
      case 'files':
        return <FilesApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'notepad':
        return <NotepadApp />;
      default:
        return <div>App not found</div>;
    }
  };

  // Calculate initial position for each new window to stack them
  const getInitialPosition = (index: number) => {
    return {
      x: 50 + (index % 5) * 30,
      y: 50 + (index % 5) * 30
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {openApps
        .filter(app => !app.isMinimized)
        .map((app, index) => (
          <div key={app.id} className="pointer-events-auto">
            <Window
              id={app.id}
              title={app.title}
              isActive={app.id === activeAppId}
              initialPosition={getInitialPosition(index)}
              onClose={() => onAppClose(app.id)}
              onFocus={() => onAppFocus(app.id)}
              onMinimize={() => onAppMinimize(app.id)}
              onMaximize={() => onAppMaximize(app.id)}
            >
              {renderAppContent(app.appId)}
            </Window>
          </div>
        ))}
    </div>
  );
};

export default AppManager;
