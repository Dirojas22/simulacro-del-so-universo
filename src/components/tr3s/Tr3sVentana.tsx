
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTr3s } from "./Tr3sContext";
import { X, Minus, Terminal, Calculator, FileText, File, Settings, Globe, BookOpen, Maximize2, Activity } from "lucide-react";
import { Rnd } from "react-rnd";
import { Tr3sMonitorSistema } from "./aplicaciones/Tr3sMonitorSistema";

export const Tr3sVentana = () => {
  const { state, cerrarApp, activarApp, guardarNotas } = useTr3s();
  
  // Estado para la calculadora
  const [calculo, setCalculo] = useState("");
  const [resultado, setResultado] = useState("0");
  
  // Estado para el terminal
  const [comandos, setComandos] = useState<string[]>(["TR3S Terminal v1.0"]);
  const [entradaComando, setEntradaComando] = useState("");
  
  // Estado para el navegador
  const [url, setUrl] = useState("https://www.baidu.com");
  const [cargandoUrl, setCargandoUrl] = useState(false);
  
  // Estado para las notas
  const [textoNotas, setTextoNotas] = useState(state.notas || "");
  
  // Estado para los ajustes
  const [ajustes, setAjustes] = useState({
    temaOscuro: true,
    notificaciones: true,
    volumen: 75
  });
  
  // Estado para ventanas maximizadas
  const [ventanasMaximizadas, setVentanasMaximizadas] = useState<{[key: string]: boolean}>({});
  const [tamañosPrevios, setTamañosPrevios] = useState<{[key: string]: {width: number, height: number, x: number, y: number}}>({});
  
  // Guardar notas automáticamente
  useEffect(() => {
    if (state.notas !== textoNotas) {
      const timer = setTimeout(() => {
        guardarNotas(textoNotas);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [textoNotas, guardarNotas, state.notas]);
  
  // Funciones para la calculadora
  const agregarDigito = (digito: string) => {
    setCalculo(prev => prev + digito);
  };
  
  const calcular = () => {
    try {
      // Reemplazar símbolos de operación por sus equivalentes en JavaScript
      const expresion = calculo
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      // Evaluar la expresión matemática
      // eslint-disable-next-line no-eval
      const res = eval(expresion);
      setResultado(res.toString());
      setCalculo("");
    } catch (error) {
      setResultado("Error");
      setCalculo("");
    }
  };
  
  const limpiarCalculadora = () => {
    setCalculo("");
    setResultado("0");
  };
  
  // Funciones para el terminal
  const ejecutarComando = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const nuevosComandos = [...comandos, `$ ${entradaComando}`];
      
      // Procesar comandos simples
      if (entradaComando === "help") {
        nuevosComandos.push("Comandos disponibles: help, clear, date, echo, ls, pwd, time, whoami, sysinfo, version, mkdir, cd, rm, cat, ps, kill");
      } else if (entradaComando === "clear") {
        return setComandos(["TR3S Terminal v1.0"]);
      } else if (entradaComando === "date") {
        nuevosComandos.push(new Date().toDateString());
      } else if (entradaComando.startsWith("echo ")) {
        nuevosComandos.push(entradaComando.substring(5));
      } else if (entradaComando === "ls") {
        nuevosComandos.push("documentos/  descargas/  imágenes/  música/  videos/  config.sys  boot.sys");
      } else if (entradaComando === "pwd") {
        nuevosComandos.push("/home/user");
      } else if (entradaComando === "time") {
        nuevosComandos.push(new Date().toLocaleTimeString());
      } else if (entradaComando === "whoami") {
        nuevosComandos.push("usuario@tr3s-os");
      } else if (entradaComando === "sysinfo") {
        nuevosComandos.push("TR3S OS v1.0.0");
        nuevosComandos.push("Núcleo: TR3S Kernel 2025");
        nuevosComandos.push("CPU: 4 núcleos @ 3.2GHz");
        nuevosComandos.push("RAM: 8 GB (3.2 GB en uso)");
        nuevosComandos.push("Almacenamiento: 512 GB (128 GB en uso)");
      } else if (entradaComando === "version") {
        nuevosComandos.push("TR3S OS v1.0.0");
      } else if (entradaComando.startsWith("mkdir ")) {
        const directorio = entradaComando.substring(6);
        nuevosComandos.push(`Directorio ${directorio} creado.`);
      } else if (entradaComando.startsWith("cd ")) {
        const directorio = entradaComando.substring(3);
        nuevosComandos.push(`Cambiado al directorio ${directorio}`);
      } else if (entradaComando.startsWith("rm ")) {
        const archivo = entradaComando.substring(3);
        nuevosComandos.push(`Archivo/directorio ${archivo} eliminado.`);
      } else if (entradaComando === "ps") {
        nuevosComandos.push("PID\tNOMBRE\t\tESTADO\t\tCPU\tMEM");
        nuevosComandos.push("1\tsistema.sys\tactivo\t\t2.3%\t45MB");
        nuevosComandos.push("2\ttr3s_kernel.exe\tactivo\t\t1.5%\t128MB");
        nuevosComandos.push("3\tinterfaz_grafica.exe\tactivo\t\t3.2%\t256MB");
      } else if (entradaComando.startsWith("kill ")) {
        const pid = entradaComando.substring(5);
        if (pid === "1" || pid === "2" || pid === "3") {
          nuevosComandos.push(`No se puede terminar proceso con PID ${pid}: proceso del sistema`);
        } else {
          nuevosComandos.push(`Proceso con PID ${pid} terminado.`);
        }
      } else if (entradaComando.startsWith("cat ")) {
        const archivo = entradaComando.substring(4);
        if (archivo === "config.sys") {
          nuevosComandos.push("## Configuración del sistema TR3S");
          nuevosComandos.push("sistema.memoriainicial=2048");
          nuevosComandos.push("sistema.arranque=rapido");
          nuevosComandos.push("sistema.idioma=es_ES");
        } else if (archivo === "boot.sys") {
          nuevosComandos.push("[!] Este archivo está protegido por el sistema.");
        } else {
          nuevosComandos.push(`No se encuentra el archivo ${archivo}`);
        }
      } else if (entradaComando.trim() !== "") {
        nuevosComandos.push(`Comando no reconocido: ${entradaComando}`);
      }
      
      setComandos(nuevosComandos);
      setEntradaComando("");
    }
  };
  
  // Función para cargar URL en el navegador
  const navegarAUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let urlFinal = url;
    
    if (!urlFinal.startsWith("http://") && !urlFinal.startsWith("https://")) {
      urlFinal = "https://" + urlFinal;
      setUrl(urlFinal);
    }
    
    setCargandoUrl(true);
    setTimeout(() => setCargandoUrl(false), 1000);
  };
  
  // Función para cambiar ajustes
  const cambiarAjuste = (ajuste: keyof typeof ajustes, valor: any) => {
    setAjustes(prev => ({
      ...prev,
      [ajuste]: valor
    }));
  };
  
  // Función para maximizar/restaurar ventana
  const toggleMaximizar = (appId: string) => {
    if (ventanasMaximizadas[appId]) {
      // Restaurar tamaño anterior
      setVentanasMaximizadas({...ventanasMaximizadas, [appId]: false});
    } else {
      // Guardar tamaño actual y maximizar
      setVentanasMaximizadas({...ventanasMaximizadas, [appId]: true});
    }
  };
  
  const renderContenido = (appId: string) => {
    switch (appId) {
      case 'terminal':
        return (
          <div className="bg-black text-green-400 p-4 h-full font-mono flex flex-col">
            <div className="flex-grow overflow-y-auto">
              {comandos.map((cmd, i) => (
                <div key={i} className="whitespace-pre-wrap">{cmd}</div>
              ))}
            </div>
            <div className="flex mt-2">
              <span className="mr-2">$</span>
              <input
                type="text"
                className="flex-grow bg-transparent outline-none"
                value={entradaComando}
                onChange={(e) => setEntradaComando(e.target.value)}
                onKeyDown={ejecutarComando}
                autoFocus
              />
            </div>
          </div>
        );
      case 'calculadora':
        return (
          <div className="bg-zinc-900 h-full flex flex-col p-4">
            <div className="bg-zinc-800 p-4 mb-4 rounded text-right text-xl overflow-x-auto">
              {calculo || resultado}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={limpiarCalculadora} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">C</button>
              <button onClick={() => agregarDigito('(')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">(</button>
              <button onClick={() => agregarDigito(')')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">)</button>
              <button onClick={() => agregarDigito('÷')} className="bg-zinc-800 hover:bg-zinc-700 text-cyan-400 rounded-lg p-3">÷</button>
              
              <button onClick={() => agregarDigito('7')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">7</button>
              <button onClick={() => agregarDigito('8')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">8</button>
              <button onClick={() => agregarDigito('9')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">9</button>
              <button onClick={() => agregarDigito('×')} className="bg-zinc-800 hover:bg-zinc-700 text-cyan-400 rounded-lg p-3">×</button>
              
              <button onClick={() => agregarDigito('4')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">4</button>
              <button onClick={() => agregarDigito('5')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">5</button>
              <button onClick={() => agregarDigito('6')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">6</button>
              <button onClick={() => agregarDigito('-')} className="bg-zinc-800 hover:bg-zinc-700 text-cyan-400 rounded-lg p-3">-</button>
              
              <button onClick={() => agregarDigito('1')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">1</button>
              <button onClick={() => agregarDigito('2')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">2</button>
              <button onClick={() => agregarDigito('3')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">3</button>
              <button onClick={() => agregarDigito('+')} className="bg-zinc-800 hover:bg-zinc-700 text-cyan-400 rounded-lg p-3">+</button>
              
              <button onClick={() => agregarDigito('0')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3 col-span-2">0</button>
              <button onClick={() => agregarDigito('.')} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3">.</button>
              <button onClick={calcular} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg p-3">=</button>
            </div>
          </div>
        );
      case 'notas':
        return (
          <div className="h-full p-4 bg-zinc-900">
            <textarea 
              className="w-full h-full bg-zinc-800 border border-zinc-700 rounded p-4 text-white resize-none focus:outline-none focus:border-cyan-500"
              placeholder="Escribe tus notas aquí..."
              value={textoNotas}
              onChange={(e) => setTextoNotas(e.target.value)}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {textoNotas !== state.notas ? "Guardando..." : "Guardado"}
            </div>
          </div>
        );
      case 'archivos':
        return (
          <div className="h-full bg-zinc-900 p-4">
            <div className="flex items-center gap-2 mb-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-sm">Inicio</button>
              <button className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-sm">Documentos</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                {nombre: 'Documentos', items: 8},
                {nombre: 'Imágenes', items: 25},
                {nombre: 'Música', items: 137},
                {nombre: 'Videos', items: 12},
                {nombre: 'Descargas', items: 3},
                {nombre: 'Proyectos', items: 5},
                {nombre: 'Respaldos', items: 2},
                {nombre: 'Papelera', items: 0}
              ].map((carpeta) => (
                <div key={carpeta.nombre} className="flex flex-col items-center">
                  <div className="bg-zinc-800 p-3 rounded-lg w-16 h-16 flex items-center justify-center mb-2 hover:bg-zinc-700 cursor-pointer">
                    <File size={32} className="text-cyan-400" />
                  </div>
                  <span className="text-xs">{carpeta.nombre}</span>
                  <span className="text-xs text-gray-400">{carpeta.items} elementos</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ajustes':
        return (
          <div className="h-full bg-zinc-900 p-4 overflow-y-auto">
            <h2 className="text-lg mb-4 text-cyan-400 font-medium">Ajustes del Sistema</h2>
            <div className="space-y-6">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Apariencia</h3>
                <div className="flex items-center justify-between mb-3">
                  <span>Tema Oscuro</span>
                  <button 
                    onClick={() => cambiarAjuste('temaOscuro', !ajustes.temaOscuro)}
                    className={`w-10 h-5 rounded-full relative ${ajustes.temaOscuro ? 'bg-cyan-500' : 'bg-zinc-600'}`}
                  >
                    <div 
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transform transition-transform ${ajustes.temaOscuro ? 'right-1' : 'left-1'}`}
                    ></div>
                  </button>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Notificaciones</h3>
                <div className="flex items-center justify-between mb-3">
                  <span>Activar notificaciones</span>
                  <button 
                    onClick={() => cambiarAjuste('notificaciones', !ajustes.notificaciones)}
                    className={`w-10 h-5 rounded-full relative ${ajustes.notificaciones ? 'bg-cyan-500' : 'bg-zinc-600'}`}
                  >
                    <div 
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transform transition-transform ${ajustes.notificaciones ? 'right-1' : 'left-1'}`}
                    ></div>
                  </button>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Audio</h3>
                <div>
                  <span>Volumen {ajustes.volumen}%</span>
                  <div className="w-full h-2 bg-zinc-700 rounded-full mt-2 relative">
                    <div 
                      className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" 
                      style={{ width: `${ajustes.volumen}%` }}
                    ></div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={ajustes.volumen}
                      onChange={(e) => cambiarAjuste('volumen', parseInt(e.target.value))}
                      className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Administrador de memoria</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memoria física</span>
                      <span className="text-sm">4.3 GB / 8 GB</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-700 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" 
                        style={{ width: '54%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memoria virtual</span>
                      <span className="text-sm">2.1 GB / 4 GB</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-700 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" 
                        style={{ width: '52%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memoria caché</span>
                      <span className="text-sm">512 MB / 768 MB</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-700 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" 
                        style={{ width: '67%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-zinc-700">
                    <h4 className="text-sm font-medium mb-2">Procesos con mayor uso de memoria</h4>
                    <ul className="text-xs space-y-1">
                      <li className="flex justify-between">
                        <span>interfaz_grafica.exe</span>
                        <span>256 MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>tr3s_kernel.exe</span>
                        <span>128 MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>navegador.exe</span>
                        <span>96 MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>archivos.exe</span>
                        <span>64 MB</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <button className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded">
                      Liberar memoria
                    </button>
                    <button className="text-sm bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded">
                      Optimizar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Acerca de TR3S OS</h3>
                <div className="text-sm text-gray-300">
                  <p className="mb-1">Versión: 1.0.0</p>
                  <p className="mb-1">Núcleo: TR3S Kernel 2025</p>
                  <p>Memoria RAM: 8 GB</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'navegador':
        return (
          <div className="h-full bg-zinc-900 flex flex-col">
            <div className="bg-zinc-800 p-2 flex items-center gap-2">
              <button className="p-1 bg-zinc-700 hover:bg-zinc-600 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="p-1 bg-zinc-700 hover:bg-zinc-600 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <button className="p-1 bg-zinc-700 hover:bg-zinc-600 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0z" />
                  <path d="M9 16v-8 h6 l-6 8z" />
                </svg>
              </button>
              <form onSubmit={navegarAUrl} className="flex-1 flex">
                <input 
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="flex-1 px-3 py-1 bg-zinc-700 text-sm rounded-l focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-r"
                >
                  Ir
                </button>
              </form>
            </div>
            <div className="flex-1 relative bg-white">
              {cargandoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              )}
              <iframe 
                src={url} 
                className="w-full h-full border-0" 
                title="TR3S Browser"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        );
      case 'manual':
        return (
          <div className="h-full bg-zinc-900 p-4 overflow-y-auto">
            <h1 className="text-2xl font-bold text-cyan-400 mb-4">Manual de Usuario - TR3S OS</h1>
            
            <div className="space-y-6 text-sm">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Introducción</h2>
                <p className="mb-2">
                  Bienvenido a TR3S OS, un sistema operativo moderno, ligero y eficiente diseñado para maximizar tu productividad.
                </p>
                <p>
                  Este manual te guiará a través de las principales características y aplicaciones disponibles en TR3S OS.
                </p>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Inicio</h2>
                <p className="mb-2">
                  El escritorio de TR3S OS está diseñado para ser intuitivo y fácil de usar. En la pantalla principal encontrarás:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Iconos de aplicaciones en el escritorio</li>
                  <li>Barra de tareas en la parte inferior con indicadores de sistema</li>
                  <li>Indicador de hora, volumen, WiFi y batería</li>
                </ul>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Ventanas</h2>
                <p className="mb-2">
                  Las ventanas de TR3S OS se pueden manipular de varias formas:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Arrastrar desde la barra de título para mover</li>
                  <li>Cambiar tamaño desde los bordes</li>
                  <li>Botón de maximizar para expandir a pantalla completa</li>
                  <li>Botón de cerrar para salir de la aplicación</li>
                </ul>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Aplicaciones</h2>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Terminal</h3>
                <p className="mb-2">
                  La Terminal te permite interactuar con el sistema mediante comandos de texto. Algunos comandos útiles:
                </p>
                <table className="w-full border-collapse mb-2">
                  <thead>
                    <tr className="bg-zinc-700">
                      <th className="p-1 text-left">Comando</th>
                      <th className="p-1 text-left">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-t border-zinc-700"><td className="p-1">help</td><td className="p-1">Muestra la lista de comandos disponibles</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">clear</td><td className="p-1">Limpia la pantalla</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">date</td><td className="p-1">Muestra la fecha actual</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">time</td><td className="p-1">Muestra la hora actual</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">echo [texto]</td><td className="p-1">Muestra el texto en pantalla</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">ls</td><td className="p-1">Lista los archivos del directorio actual</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">pwd</td><td className="p-1">Muestra el directorio actual</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">whoami</td><td className="p-1">Muestra el nombre de usuario</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">sysinfo</td><td className="p-1">Muestra información del sistema</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">version</td><td className="p-1">Muestra la versión del sistema</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">mkdir [nombre]</td><td className="p-1">Crea un nuevo directorio</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">cd [ruta]</td><td className="p-1">Cambia de directorio</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">rm [archivo]</td><td className="p-1">Elimina un archivo o directorio</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">cat [archivo]</td><td className="p-1">Muestra el contenido de un archivo</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">ps</td><td className="p-1">Lista los procesos en ejecución</td></tr>
                    <tr className="border-t border-zinc-700"><td className="p-1">kill [pid]</td><td className="p-1">Termina un proceso por su PID</td></tr>
                  </tbody>
                </table>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Calculadora</h3>
                <p className="mb-1">
                  Una calculadora sencilla pero potente con operaciones básicas: suma, resta, multiplicación y división.
                  Soporta paréntesis y operaciones complejas.
                </p>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Notas</h3>
                <p className="mb-1">
                  Aplicación para tomar notas rápidas. El contenido se guarda automáticamente mientras escribes.
                  Verás una indicación de "Guardando..." cuando se estén guardando los cambios.
                </p>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Archivos</h3>
                <p className="mb-1">
                  Explorador de archivos para navegar por el sistema de archivos, gestionar documentos, imágenes y más.
                </p>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Monitor del Sistema</h3>
                <p className="mb-1">
                  Herramienta de monitoreo que muestra el uso de CPU, memoria y disco del sistema. También permite ver
                  procesos en ejecución y estadísticas de rendimiento en tiempo real.
                </p>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Ajustes</h3>
                <p className="mb-1">
                  Configura tu sistema según tus preferencias: apariencia, notificaciones, volumen y administración de memoria.
                  Puedes optimizar el rendimiento del sistema desde aquí.
                </p>
                
                <h3 className="font-medium text-cyan-400 mt-3 mb-1">Navegador</h3>
                <p className="mb-1">
                  Navega por internet con nuestro navegador integrado, que admite la mayoría de los sitios web modernos.
                </p>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Atajos de teclado</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div>Alt+Tab</div><div>Cambiar entre aplicaciones</div>
                  <div>Ctrl+C</div><div>Copiar texto</div>
                  <div>Ctrl+V</div><div>Pegar texto</div>
                  <div>Ctrl+S</div><div>Guardar</div>
                  <div>Alt+F4</div><div>Cerrar aplicación actual</div>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Soporte</h2>
                <p>
                  Para obtener ayuda adicional, contáctanos en support@tr3sos.com o visita nuestro sitio web en www.tr3sos.com.
                </p>
              </div>
            </div>
          </div>
        );
      case 'monitor':
        return <Tr3sMonitorSistema />;
      default:
        return <div>App no encontrada</div>;
    }
  };
  
  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'terminal':
        return <Terminal size={18} className="text-white" />;
      case 'file-text':
        return <FileText size={18} className="text-white" />;
      case 'calculator':
        return <Calculator size={18} className="text-white" />;
      case 'settings':
        return <Settings size={18} className="text-white" />;
      case 'file':
        return <File size={18} className="text-white" />;
      case 'globe':
        return <Globe size={18} className="text-white" />;
      case 'book':
        return <BookOpen size={18} className="text-white" />;
      case 'activity':
        return <Activity size={18} className="text-white" />;
      default:
        return <File size={18} className="text-white" />;
    }
  };

  return (
    <>
      {state.aplicaciones.map((app) => (
        app.abierta && (
          <Rnd
            key={app.id}
            default={{
              x: 100,
              y: 50,
              width: 500,
              height: 400
            }}
            size={ventanasMaximizadas[app.id] ? { width: window.innerWidth, height: window.innerHeight - 40 } : undefined}
            position={ventanasMaximizadas[app.id] ? { x: 0, y: 0 } : undefined}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            dragHandleClassName="app-draghandle"
            className={`rounded-lg overflow-hidden shadow-2xl ${app.activa ? 'z-10' : 'z-0'}`}
            onMouseDown={() => activarApp(app.id)}
            disableDragging={ventanasMaximizadas[app.id]}
            enableResizing={!ventanasMaximizadas[app.id]}
          >
            <div className="flex flex-col h-full">
              <div 
                className={`app-draghandle flex items-center justify-between px-4 py-2 ${
                  app.activa 
                    ? 'bg-gradient-to-r from-cyan-500/80 to-purple-500/80' 
                    : 'bg-zinc-700/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getIcono(app.icono)}
                  <span className="text-sm font-medium">{app.nombre}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-600 hover:bg-zinc-500"
                  >
                    <Minus size={12} />
                  </button>
                  <button 
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-600 hover:bg-zinc-500"
                    onClick={() => toggleMaximizar(app.id)}
                  >
                    <Maximize2 size={12} />
                  </button>
                  <button 
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500"
                    onClick={() => cerrarApp(app.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-grow bg-zinc-800 text-white overflow-auto">
                {renderContenido(app.id)}
              </div>
            </div>
          </Rnd>
        )
      ))}
    </>
  );
};
