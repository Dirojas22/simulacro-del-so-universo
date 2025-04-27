
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManualUsuario: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-4 bg-gray-50 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Manual de Usuario - DOS</h1>
      
      <Tabs defaultValue="introduccion" className="flex-1">
        <TabsList className="grid grid-cols-5 mb-6 w-full">
          <TabsTrigger value="introduccion">Introducción</TabsTrigger>
          <TabsTrigger value="escritorio">Escritorio</TabsTrigger>
          <TabsTrigger value="aplicaciones">Aplicaciones</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="ayuda">Ayuda</TabsTrigger>
        </TabsList>
        
        {/* Tab de Introducción */}
        <TabsContent value="introduccion" className="text-justify space-y-4">
          <h2 className="text-2xl font-semibold">Bienvenido a DOS</h2>
          
          <p>
            DOS (Desktop Operating System Simulator) es un simulador educativo que permite
            entender el funcionamiento interno de un sistema operativo de escritorio.
            Este simulador proporciona una experiencia completa para visualizar la gestión de
            recursos, procesos y eventos del sistema.
          </p>
          
          <h3 className="text-xl font-semibold mt-4">Características principales:</h3>
          
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Simulación de gestión de recursos (memoria, disco duro, CPU, E/S)</li>
            <li>Monitoreo y registro de eventos del sistema (interbloqueo, exclusión mutua, inanición)</li>
            <li>Gestión de procesos con control de quantum para cada uno</li>
            <li>Aplicaciones básicas funcionales (calculadora, editor de texto, hoja de cálculo, paint, navegador)</li>
            <li>Detección de conexión WiFi y nivel de batería del dispositivo</li>
            <li>Interfaz gráfica intuitiva inspirada en sistemas operativos modernos</li>
          </ul>
          
          <p>
            Este manual le guiará a través de todas las funcionalidades disponibles en DOS
            y le mostrará cómo aprovechar al máximo este simulador educativo.
          </p>
        </TabsContent>
        
        {/* Tab de Escritorio */}
        <TabsContent value="escritorio" className="text-justify space-y-4">
          <h2 className="text-2xl font-semibold">Escritorio</h2>
          
          <p>
            El escritorio de DOS es la interfaz principal donde interactúas con el sistema.
            Está diseñado para ser intuitivo y fácil de usar.
          </p>
          
          <h3 className="text-xl font-semibold mt-4">Elementos del escritorio:</h3>
          
          <div className="space-y-4 ml-4">
            <div>
              <h4 className="text-lg font-medium">Iconos de aplicaciones</h4>
              <p>
                En el lado izquierdo del escritorio, encontrarás iconos que representan las
                diferentes aplicaciones disponibles. Haz clic en cualquier icono para abrir
                la aplicación correspondiente.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Ventanas de aplicaciones</h4>
              <p>
                Las aplicaciones se abren en ventanas que puedes mover, redimensionar y cerrar.
                Para mover una ventana, arrastra la barra de título. Para redimensionar, arrastra
                desde los bordes de la ventana.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Barra de tareas</h4>
              <p>
                En la parte inferior del escritorio, la barra de tareas muestra:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Botón DOS (menú de inicio)</li>
                <li>Aplicaciones abiertas</li>
                <li>Control de volumen</li>
                <li>Estado de la conexión WiFi</li>
                <li>Estado de la batería</li>
                <li>Fecha y hora actual</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Fondos de pantalla</h4>
              <p>
                DOS incluye varios fondos de pantalla organizados por categorías que puedes cambiar desde la aplicación Galería:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Tecnología:</strong> Fondos relacionados con informática, circuitos y tecnología</li>
                <li><strong>Naturaleza:</strong> Paisajes y escenas naturales</li>
                <li><strong>Abstracto:</strong> Diseños abstractos con formas y colores</li>
                <li><strong>Minimalista:</strong> Fondos simples y minimalistas</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mt-4">Consejos de uso:</h3>
          
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Haz clic en una aplicación en la barra de tareas para minimizar/restaurar</li>
            <li>Usa los botones de control en la esquina superior derecha de cada ventana para minimizar o cerrar aplicaciones</li>
            <li>Haz clic en cualquier lugar del escritorio para cerrar menús abiertos</li>
            <li>Observa los iconos de estado en la barra de tareas para monitorear tu sistema</li>
          </ul>
        </TabsContent>
        
        {/* Tab de Aplicaciones */}
        <TabsContent value="aplicaciones" className="text-justify space-y-4">
          <h2 className="text-2xl font-semibold">Aplicaciones</h2>
          
          <p>
            DOS incluye varias aplicaciones básicas que puedes utilizar para probar el sistema.
            Cada aplicación simula funcionalidades comunes encontradas en sistemas operativos reales.
          </p>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-xl font-semibold">Calculadora</h3>
              <p>
                Una calculadora básica que permite realizar operaciones aritméticas simples:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Soporta suma, resta, multiplicación y división</li>
                <li>Incluye funciones para porcentaje y cambio de signo</li>
                <li>Memoria de último resultado para operaciones encadenadas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Editor de Texto</h3>
              <p>
                Un editor de texto simple para crear y editar documentos:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Formateo básico (negrita, cursiva, subrayado)</li>
                <li>Opciones para cambiar fuente y tamaño</li>
                <li>Guardar y abrir documentos en formato texto</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Hoja de Cálculo</h3>
              <p>
                Una aplicación simple para trabajar con datos tabulares:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Soporte para fórmulas básicas con el signo igual (=)</li>
                <li>Realiza operaciones matemáticas: suma (+), resta (-), multiplicación (*), división (/)</li>
                <li>Referencia a celdas utilizando notación estándar (A1, B2, etc.)</li>
                <li>Ejemplos interactivos de fórmulas básicas y avanzadas</li>
                <li>Exportación en formato CSV</li>
              </ul>
              <p className="mt-2">
                <strong>Guía rápida de uso:</strong>
              </p>
              <ul className="list-disc list-inside ml-6">
                <li>Para ingresar una fórmula, comienza con el símbolo igual (=)</li>
                <li>Ejemplos: <code>=A1+B1</code>, <code>=C2*D3</code>, <code>=SUM(A1:A5)</code></li>
                <li>Puedes hacer clic en "Tutorial" para ver ejemplos detallados</li>
                <li>Exporta tu trabajo a CSV mediante el botón "Exportar CSV"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Paint</h3>
              <p>
                Una aplicación de dibujo simple:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Herramientas básicas: lápiz, borrador, línea, rectángulo</li>
                <li>Selector de color y grosor de trazo</li>
                <li>Guardar dibujos como imágenes PNG</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Navegador</h3>
              <p>
                Un navegador web con soporte para pestañas:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Navegación por pestañas (abrir nuevas pestañas, cerrar pestañas)</li>
                <li>Barra de direcciones para introducir URLs</li>
                <li>Botones de navegación (atrás, adelante, recargar)</li>
                <li>Visualización de páginas web (requiere conexión a internet)</li>
              </ul>
              <p className="mt-2">
                <strong>Guía rápida de uso:</strong>
              </p>
              <ul className="list-disc list-inside ml-6">
                <li>Haz clic en el botón + para abrir una nueva pestaña</li>
                <li>Haz clic en X para cerrar una pestaña</li>
                <li>Escribe una dirección web en la barra de direcciones y presiona Enter para navegar</li>
                <li>Usa los botones de navegación para moverte entre páginas visitadas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Monitor del Sistema</h3>
              <p>
                Una herramienta para monitorear los recursos y procesos del sistema:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Visualización detallada de uso de memoria, CPU, disco y red</li>
                <li>Gestión de procesos con ajuste de quantum y prioridad</li>
                <li>Monitoreo en tiempo real con datos dinámicos</li>
                <li>Registro detallado de eventos del sistema</li>
                <li>Información sobre estado de la batería y conexión a internet</li>
              </ul>
              <p className="mt-2">
                <strong>Características avanzadas:</strong>
              </p>
              <ul className="list-disc list-inside ml-6">
                <li>Cambiar el quantum de un proceso afecta cuánto tiempo de CPU recibe</li>
                <li>Ajustar la prioridad determina la importancia del proceso</li>
                <li>Terminar procesos manualmente para liberar recursos</li>
                <li>Ver información detallada activando "Mostrar detalles"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Galería</h3>
              <p>
                Una aplicación para cambiar el fondo de pantalla del sistema:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Múltiples categorías de fondos (Tecnología, Naturaleza, Abstracto, Minimalista)</li>
                <li>Vista previa de cada fondo</li>
                <li>Selección con un solo clic para aplicar el fondo</li>
                <li>Indicador visual del fondo actual</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab de Sistema */}
        <TabsContent value="sistema" className="text-justify space-y-4">
          <h2 className="text-2xl font-semibold">Gestión del Sistema</h2>
          
          <p>
            DOS simula la gestión interna de un sistema operativo, permitiéndote observar
            y controlar varios aspectos de su funcionamiento.
          </p>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-xl font-semibold">Gestión de Recursos</h3>
              <p>
                El sistema monitorea continuamente el uso de recursos como:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Memoria:</strong> Muestra la cantidad de memoria utilizada y disponible, junto con información sobre memoria caché y uso por aplicaciones</li>
                <li><strong>CPU:</strong> Muestra el porcentaje de uso de la CPU, temperatura, frecuencia y número de núcleos</li>
                <li><strong>Disco:</strong> Muestra el espacio utilizado y disponible, así como velocidades de lectura/escritura</li>
                <li><strong>Red:</strong> Muestra el estado de la conexión, tipo, velocidad y latencia</li>
              </ul>
              <p className="mt-2">
                Puedes ver estos datos en tiempo real en la aplicación Monitor del Sistema.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Gestión de Procesos</h3>
              <p>
                Cada aplicación y servicio del sistema se ejecuta como un proceso:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Quantum:</strong> Cada proceso tiene asignado un quantum que determina cuánto tiempo de CPU recibe antes de ser interrumpido. Puedes ajustar este valor entre 1 y 10.</li>
                <li><strong>Estados:</strong> Los procesos pueden estar activos (verde), bloqueados (rojo), esperando (amarillo) o terminados (gris)</li>
                <li><strong>Prioridad:</strong> Determina la importancia relativa de cada proceso, con valores del 1 al 10 (1 es la más alta)</li>
                <li><strong>Recursos:</strong> Cada proceso consume memoria y CPU, mostrados en tiempo real</li>
                <li><strong>Tiempo de ejecución:</strong> Indica cuánto tiempo lleva en ejecución el proceso</li>
                <li><strong>Tiempo de espera:</strong> Indica cuánto tiempo lleva esperando recursos el proceso</li>
              </ul>
              <p className="mt-2">
                Puedes administrar los procesos desde la pestaña "Procesos" del Monitor del Sistema:
              </p>
              <ul className="list-disc list-inside ml-6">
                <li>Ajustar el quantum para dar más o menos tiempo de CPU</li>
                <li>Cambiar la prioridad para determinar qué procesos reciben recursos primero</li>
                <li>Terminar procesos que ya no necesites o que estén causando problemas</li>
                <li>Ver estadísticas detalladas activando "Mostrar detalles"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Registro de Eventos</h3>
              <p>
                El sistema registra eventos importantes, incluyendo:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Interbloqueo:</strong> Cuando dos o más procesos quedan bloqueados esperando recursos mutuamente</li>
                <li><strong>Exclusión Mutua:</strong> Cuando se garantiza que solo un proceso acceda a un recurso compartido</li>
                <li><strong>Inanición:</strong> Cuando un proceso no recibe los recursos necesarios durante mucho tiempo</li>
                <li><strong>Información:</strong> Eventos generales del sistema como inicio de aplicaciones, cambios de estado, etc.</li>
                <li><strong>Error:</strong> Problemas detectados en el sistema</li>
              </ul>
              <p className="mt-2">
                Estos eventos se registran automáticamente y pueden verse en la pestaña de Eventos en el Monitor del Sistema.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Estado del Hardware</h3>
              <p>
                DOS detecta y muestra el estado real del hardware de tu dispositivo:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Conexión WiFi:</strong> Muestra si estás conectado a internet</li>
                <li><strong>Batería:</strong> Muestra el nivel de carga y si está conectada a la corriente</li>
                <li><strong>Volumen:</strong> Permite controlar el volumen del sistema</li>
              </ul>
              <p className="mt-2">
                Estos indicadores se muestran en la barra de tareas para fácil acceso.
              </p>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab de Ayuda */}
        <TabsContent value="ayuda" className="text-justify space-y-4">
          <h2 className="text-2xl font-semibold">Ayuda y Solución de Problemas</h2>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-xl font-semibold">Preguntas Frecuentes</h3>
              
              <div className="space-y-4 mt-2">
                <div>
                  <h4 className="text-lg font-medium">¿Cómo funciona la simulación de recursos?</h4>
                  <p>
                    DOS simula la utilización de recursos como CPU, memoria y disco duro.
                    Cuando abres aplicaciones, el sistema asigna recursos virtuales a
                    cada proceso. Estos cambios se reflejan en el Monitor del Sistema.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">¿Qué es el quantum de un proceso?</h4>
                  <p>
                    El quantum representa la cantidad de tiempo de CPU que se asigna a un
                    proceso antes de ser interrumpido para dar paso a otro proceso. Un quantum
                    mayor significa que el proceso puede ejecutarse por más tiempo seguido,
                    lo que puede aumentar su rendimiento pero también afectar a otros procesos.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">¿Por qué aparecen eventos de interbloqueo o inanición?</h4>
                  <p>
                    El sistema simula estos eventos para fines educativos. Los interbloqueos
                    ocurren cuando dos procesos esperan recursos que el otro tiene bloqueados.
                    La inanición ocurre cuando un proceso no recibe los recursos necesarios
                    durante mucho tiempo debido a la prioridad de otros procesos.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">¿Cómo uso la hoja de cálculo?</h4>
                  <p>
                    Para usar fórmulas en la hoja de cálculo, empieza con el signo igual (=) seguido de una expresión matemática.
                    Puedes hacer referencia a otras celdas usando su coordenada (por ejemplo, A1, B2).
                    Las operaciones básicas son: suma (+), resta (-), multiplicación (*) y división (/).
                    Consulta el tutorial incluido en la aplicación para más ejemplos.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">¿Cómo funciona el navegador con pestañas?</h4>
                  <p>
                    El navegador permite abrir múltiples páginas web en pestañas. Para abrir una nueva pestaña,
                    haz clic en el botón con el símbolo "+". Para cerrar una pestaña, haz clic en la "X" de la pestaña.
                    Puedes navegar entre pestañas haciendo clic en ellas. Para cargar una página, escribe la URL 
                    en la barra de direcciones y presiona Enter o haz clic en "Ir".
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">¿Cómo cambio el fondo de pantalla?</h4>
                  <p>
                    Para cambiar el fondo de pantalla, abre la aplicación "Galería" desde los iconos del escritorio.
                    Allí encontrarás fondos organizados por categorías. Simplemente haz clic en cualquiera de ellos
                    para establecerlo como fondo de pantalla del sistema.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Solución de Problemas</h3>
              
              <div className="space-y-4 mt-2">
                <div>
                  <h4 className="text-lg font-medium">Una aplicación no responde</h4>
                  <p>
                    Si una aplicación deja de responder, puedes cerrarla desde la
                    ventana o mediante el botón de cierre en la barra de título.
                    También puedes terminar el proceso asociado desde el Monitor del Sistema.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">El sistema está lento</h4>
                  <p>
                    Si notas que el sistema está lento, verifica los recursos en el
                    Monitor del Sistema. Es posible que haya muchos procesos activos
                    consumiendo recursos. Puedes cerrar aplicaciones innecesarias o
                    ajustar el quantum de los procesos menos importantes.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">El navegador no carga algunas páginas</h4>
                  <p>
                    El navegador incluido tiene limitaciones de seguridad que pueden impedir
                    que ciertas páginas web se carguen correctamente. Algunas páginas pueden
                    estar bloqueadas debido a restricciones de seguridad del navegador o
                    políticas CORS. Intenta con sitios web más sencillos o básicos.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">No detecta la conexión WiFi o la batería</h4>
                  <p>
                    Estas funciones dependen de las APIs del navegador. Si no funcionan,
                    es posible que tu navegador no soporte estas APIs o que no hayas
                    concedido los permisos necesarios. En estos casos, el sistema
                    mostrará datos simulados.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Glosario de Términos</h3>
              
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="p-2 border-b">
                  <span className="font-semibold">Interbloqueo (Deadlock):</span> Situación en la que dos o más procesos no pueden continuar porque cada uno espera recursos que otro tiene.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">Exclusión Mutua:</span> Principio que asegura que solo un proceso puede acceder a un recurso compartido en un momento dado.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">Inanición (Starvation):</span> Situación en la que un proceso no recibe los recursos necesarios para avanzar.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">Quantum:</span> Cantidad de tiempo asignada a un proceso antes de ser interrumpido.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">Planificación de Procesos:</span> Método que determina qué proceso se ejecuta en cada momento.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">E/S (Entrada/Salida):</span> Operaciones que involucran la transferencia de datos entre el sistema y dispositivos externos.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">Hilo (Thread):</span> Unidad básica de ejecución dentro de un proceso. Un proceso puede tener múltiples hilos.
                </div>
                
                <div className="p-2 border-b">
                  <span className="font-semibold">Prioridad:</span> Valor que determina la importancia de un proceso para la asignación de recursos.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualUsuario;
