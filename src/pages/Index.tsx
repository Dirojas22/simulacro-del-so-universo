import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Desktop from '../components/Desktop/Desktop';
import { AppWindow } from '../components/AppManager/AppManager';
import AppManager from '../components/AppManager/AppManager';
import Taskbar from '../components/Taskbar/Taskbar';

const Index = () => {
  const [openApps, setOpenApps] = useState<AppWindow[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  
  const getAppTitle = (appId: string) => {
    switch (appId) {
      case 'computer': return 'My Computer';
      case 'files': return 'Files';
      case 'terminal': return 'Terminal';
      case 'notepad': return 'Notepad';
      default: return 'Application';
    }
  };
  
  const openApp = (appId: string) => {
    const existingMinimizedApp = openApps.find(app => app.appId === appId && app.isMinimized);
    
    if (existingMinimizedApp) {
      setOpenApps(prev => prev.map(app => 
        app.id === existingMinimizedApp.id 
          ? { ...app, isMinimized: false } 
          : app
      ));
      setActiveAppId(existingMinimizedApp.id);
      return;
    }
    
    const newAppId = uuidv4();
    const newApp: AppWindow = {
      id: newAppId,
      appId: appId,
      title: getAppTitle(appId),
      isActive: true,
      isMinimized: false
    };
    
    setOpenApps(prev => [...prev]);
    
    setTimeout(() => {
      setOpenApps(prev => [...prev, newApp]);
      setActiveAppId(newAppId);
    }, 10);
  };
  
  const closeApp = (id: string) => {
    setOpenApps(prev => prev.filter(app => app.id !== id));
    
    if (activeAppId === id) {
      const remainingApps = openApps.filter(app => app.id !== id && !app.isMinimized);
      if (remainingApps.length > 0) {
        setActiveAppId(remainingApps[remainingApps.length - 1].id);
      } else {
        setActiveAppId(null);
      }
    }
  };
  
  const minimizeApp = (id: string) => {
    setOpenApps(prev => prev.map(app => 
      app.id === id ? { ...app, isMinimized: true } : app
    ));
    
    if (activeAppId === id) {
      const visibleApps = openApps.filter(app => app.id !== id && !app.isMinimized);
      if (visibleApps.length > 0) {
        setActiveAppId(visibleApps[visibleApps.length - 1].id);
      } else {
        setActiveAppId(null);
      }
    }
  };
  
  const maximizeApp = (id: string) => {
    setActiveAppId(id);
  };
  
  const focusApp = (id: string) => {
    const app = openApps.find(app => app.id === id);
    
    if (app?.isMinimized) {
      setOpenApps(prev => prev.map(a => 
        a.id === id ? { ...a, isMinimized: false } : a
      ));
    }
    
    setActiveAppId(id);
  };

  const handleTaskbarAppClick = (id: string) => {
    const app = openApps.find(app => app.id === id);
    
    if (app?.isMinimized) {
      setOpenApps(prev => prev.map(a => 
        a.id === id ? { ...a, isMinimized: false } : a
      ));
      setActiveAppId(id);
    } else if (activeAppId === id) {
      minimizeApp(id);
    } else {
      setActiveAppId(id);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = "SimulOS - Operating System Simulator";
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-os-desktop overflow-hidden relative">
      <div className="flex-1 overflow-hidden relative">
        <Desktop onOpenApp={openApp} />
        
        <AppManager
          openApps={openApps}
          activeAppId={activeAppId}
          onAppFocus={focusApp}
          onAppClose={closeApp}
          onAppMinimize={minimizeApp}
          onAppMaximize={maximizeApp}
        />
      </div>
      
      <Taskbar
        openApps={openApps}
        activeAppId={activeAppId}
        onAppClick={handleTaskbarAppClick}
      />
    </div>
  );
};

export default Index;
