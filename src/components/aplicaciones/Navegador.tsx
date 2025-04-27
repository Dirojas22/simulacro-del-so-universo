
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDOS } from "@/context/DOSContext";

const Navegador: React.FC = () => {
  const { state } = useDOS();
  const [url, setUrl] = useState("https://www.baidu.com");
  const [cargando, setCargando] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navegar = () => {
    if (!state.estadoRed.conectado) {
      alert("No hay conexión a internet disponible.");
      return;
    }

    let urlFinal = url;
    if (!urlFinal.startsWith("http://") && !urlFinal.startsWith("https://")) {
      urlFinal = "https://" + urlFinal;
      setUrl(urlFinal);
    }

    setCargando(true);
    
    // Configurar el sandbox para permitir más permisos
    if (iframeRef.current) {
      iframeRef.current.sandbox.add("allow-same-origin");
      iframeRef.current.sandbox.add("allow-scripts");
      iframeRef.current.sandbox.add("allow-popups");
      iframeRef.current.sandbox.add("allow-forms");
      iframeRef.current.sandbox.add("allow-modals");
    }

    setTimeout(() => {
      setCargando(false);
    }, 1000);
  };

  // Navegar cuando se presiona Enter
  const manejarTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navegar();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Barra de navegación */}
      <div className="flex items-center p-2 bg-gray-100 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => {
            if (iframeRef.current) {
              try {
                // @ts-ignore - No es estándar pero funciona en muchos navegadores
                iframeRef.current.contentWindow.history.back();
              } catch (error) {
                console.error("No se pudo navegar hacia atrás:", error);
              }
            }
          }}
        >
          ←
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => {
            if (iframeRef.current) {
              try {
                // @ts-ignore - No es estándar pero funciona en muchos navegadores
                iframeRef.current.contentWindow.history.forward();
              } catch (error) {
                console.error("No se pudo navegar hacia adelante:", error);
              }
            }
          }}
        >
          →
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => {
            if (iframeRef.current) {
              try {
                iframeRef.current.src = iframeRef.current.src;
              } catch (error) {
                console.error("No se pudo recargar la página:", error);
              }
            }
          }}
        >
          ↻
        </Button>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={manejarTecla}
          className="flex-1 mr-2"
          placeholder="Introduzca la URL"
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={navegar}
        >
          Ir
        </Button>
      </div>
      
      {/* Contenido del navegador */}
      <div className="flex-1 relative bg-white">
        {!state.estadoRed.conectado && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-2">Sin conexión a Internet</h3>
              <p className="text-gray-600">
                No se puede cargar la página porque no hay conexión a Internet.
              </p>
            </div>
          </div>
        )}
        
        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {state.estadoRed.conectado && (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title="Navegador"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Navegador;
