
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDOS } from "@/context/DOSContext";
import { Plus, X, Search, History, RefreshCw } from "lucide-react";

interface Tab {
  id: string;
  url: string;
  title: string;
  loading: boolean;
}

const generarTabId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

const Navegador: React.FC = () => {
  const { state } = useDOS();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", url: "https://www.google.com", title: "Google", loading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState("tab1");
  const [inputUrl, setInputUrl] = useState("https://www.google.com");
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const agregarTab = () => {
    const newId = generarTabId();
    const newTab = { id: newId, url: "https://www.google.com", title: "Nueva pestaña", loading: false };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setInputUrl("https://www.google.com");
  };

  const cerrarTab = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (tabs.length === 1) {
      // Si es la última pestaña, crear una nueva antes de cerrar
      const newId = generarTabId();
      setTabs([{ id: newId, url: "https://www.google.com", title: "Nueva pestaña", loading: false }]);
      setActiveTabId(newId);
      setInputUrl("https://www.google.com");
    } else {
      const tabIndex = tabs.findIndex(tab => tab.id === id);
      const newTabs = tabs.filter(tab => tab.id !== id);
      
      // Si cerramos la pestaña activa, activar la siguiente o la anterior
      if (id === activeTabId) {
        const newActiveIndex = tabIndex === tabs.length - 1 ? tabIndex - 1 : tabIndex;
        setActiveTabId(newTabs[newActiveIndex].id);
        setInputUrl(newTabs[newActiveIndex].url);
      }
      
      setTabs(newTabs);
    }
  };

  const cambiarTab = (id: string) => {
    setActiveTabId(id);
    const tab = tabs.find(tab => tab.id === id);
    if (tab) {
      setInputUrl(tab.url);
    }
  };

  const navegar = (tabId: string = activeTabId) => {
    if (!state.estadoRed.conectado) {
      alert("No hay conexión a internet disponible.");
      return;
    }

    let urlFinal = inputUrl;
    if (!urlFinal.startsWith("http://") && !urlFinal.startsWith("https://")) {
      urlFinal = "https://" + urlFinal;
      setInputUrl(urlFinal);
    }

    // Actualizar el estado de la pestaña activa
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === tabId 
          ? { ...tab, url: urlFinal, loading: true } 
          : tab
      )
    );
    
    // Configurar el sandbox del iframe
    if (iframeRefs.current[tabId]) {
      try {
        const iframe = iframeRefs.current[tabId];
        if (iframe) {
          iframe.sandbox.add("allow-same-origin");
          iframe.sandbox.add("allow-scripts");
          iframe.sandbox.add("allow-popups");
          iframe.sandbox.add("allow-forms");
          iframe.sandbox.add("allow-modals");
        }
      } catch (error) {
        console.error("Error al configurar sandbox:", error);
      }
    }

    setTimeout(() => {
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === tabId 
            ? { ...tab, loading: false } 
            : tab
        )
      );

      // Actualizar el título basado en la URL
      const dominio = new URL(urlFinal).hostname;
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === tabId 
            ? { ...tab, title: dominio } 
            : tab
        )
      );
    }, 1000);
  };

  // Navegar cuando se presiona Enter
  const manejarTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navegar();
    }
  };

  const recargarTab = () => {
    const iframe = iframeRefs.current[activeTabId];
    if (iframe) {
      try {
        iframe.src = activeTab.url;
        
        setTabs(prevTabs => 
          prevTabs.map(tab => 
            tab.id === activeTabId 
              ? { ...tab, loading: true } 
              : tab
          )
        );
        
        setTimeout(() => {
          setTabs(prevTabs => 
            prevTabs.map(tab => 
              tab.id === activeTabId 
                ? { ...tab, loading: false } 
                : tab
            )
          );
        }, 500);
      } catch (error) {
        console.error("No se pudo recargar la página:", error);
      }
    }
  };

  const navegarAtras = () => {
    const iframe = iframeRefs.current[activeTabId];
    if (iframe) {
      try {
        // @ts-ignore - No es estándar pero funciona en muchos navegadores
        iframe.contentWindow.history.back();
      } catch (error) {
        console.error("No se pudo navegar hacia atrás:", error);
      }
    }
  };

  const navegarAdelante = () => {
    const iframe = iframeRefs.current[activeTabId];
    if (iframe) {
      try {
        // @ts-ignore - No es estándar pero funciona en muchos navegadores
        iframe.contentWindow.history.forward();
      } catch (error) {
        console.error("No se pudo navegar hacia adelante:", error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Barra de navegación */}
      <div className="flex flex-col bg-gray-100 border-b">
        {/* Tabs de navegación */}
        <div className="flex items-center h-9 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => cambiarTab(tab.id)}
              className={`flex items-center min-w-[120px] max-w-[200px] px-3 py-1 mr-1 cursor-pointer rounded-t-md overflow-hidden ${
                tab.id === activeTabId
                  ? "bg-white text-gray-800"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <span className="truncate text-xs flex-1">{tab.title}</span>
              <button
                className="ml-2 h-4 w-4 flex items-center justify-center rounded-full hover:bg-gray-300 text-gray-500"
                onClick={(e) => cerrarTab(tab.id, e)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={agregarTab}
            className="flex items-center justify-center h-6 w-6 min-w-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 mx-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Controles de navegación */}
        <div className="flex items-center p-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-1 p-1 h-8 w-8"
            onClick={navegarAtras}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-1 p-1 h-8 w-8"
            onClick={navegarAdelante}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2 p-1 h-8 w-8"
            onClick={recargarTab}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="relative flex-1 flex items-center">
            <Search className="h-4 w-4 absolute left-3 text-gray-400" />
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={manejarTecla}
              className="flex-1 pl-9"
              placeholder="Introduzca la URL"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-2"
            onClick={() => navegar()}
          >
            Ir
          </Button>
        </div>
      </div>
      
      {/* Contenido del navegador */}
      <div className="flex-1 relative bg-white">
        {!state.estadoRed.conectado && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-2">Sin conexión a Internet</h3>
              <p className="text-gray-600">
                No se puede cargar la página porque no hay conexión a Internet.
              </p>
            </div>
          </div>
        )}
        
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`absolute inset-0 ${tab.id === activeTabId ? 'block' : 'hidden'}`}
          >
            {tab.loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            )}
            
            {state.estadoRed.conectado && (
              <iframe
                ref={(el) => (iframeRefs.current[tab.id] = el)}
                src={tab.url}
                className="w-full h-full border-0"
                title={`Navegador-Tab-${tab.id}`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
              ></iframe>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navegador;
