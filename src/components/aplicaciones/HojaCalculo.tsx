
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Número de filas y columnas
const FILAS = 10;
const COLUMNAS = 8;

// Función para generar letras de columnas (A, B, C, ...)
const obtenerLetraColumna = (indice: number): string => {
  return String.fromCharCode(65 + indice);
};

// Función para convertir referencia de celda (ej: A1) a coordenadas [fila, columna]
const refACoordenadas = (ref: string): [number, number] | null => {
  if (!ref || ref.length < 2) return null;
  
  const columnaLetra = ref.charAt(0).toUpperCase();
  const fila = parseInt(ref.substring(1)) - 1;
  
  if (isNaN(fila)) return null;
  
  const columna = columnaLetra.charCodeAt(0) - 65;
  
  if (columna >= 0 && columna < COLUMNAS && fila >= 0 && fila < FILAS) {
    return [fila, columna];
  }
  
  return null;
};

const HojaCalculo: React.FC = () => {
  const { toast } = useToast();
  // Estado para almacenar los datos de las celdas
  const [datos, setDatos] = useState<string[][]>([]);
  const [evaluados, setEvaluados] = useState<string[][]>([]);
  const [celdaActiva, setCeldaActiva] = useState<string | null>(null);
  const [valorFormula, setValorFormula] = useState<string>("");
  const [tabActiva, setTabActiva] = useState<string>("calculos");

  // Inicializar datos vacíos
  useEffect(() => {
    const inicializarDatos = () => {
      const nuevosDatos: string[][] = [];
      for (let i = 0; i < FILAS; i++) {
        nuevosDatos.push(Array(COLUMNAS).fill(""));
      }
      setDatos(nuevosDatos);
      setEvaluados([...nuevosDatos]);
    };

    inicializarDatos();
  }, []);

  // Evaluar todas las celdas cuando cambian los datos
  useEffect(() => {
    const nuevosEvaluados: string[][] = [];
    
    for (let i = 0; i < FILAS; i++) {
      nuevosEvaluados.push([]);
      for (let j = 0; j < COLUMNAS; j++) {
        nuevosEvaluados[i][j] = evaluarCelda(datos[i][j], datos);
      }
    }
    
    setEvaluados(nuevosEvaluados);
  }, [datos]);

  // Manejar cambio en una celda
  const manejarCambioCelda = (fila: number, columna: number, valor: string) => {
    const nuevosDatos = [...datos];
    nuevosDatos[fila][columna] = valor;
    setDatos(nuevosDatos);
  };

  // Seleccionar una celda
  const seleccionarCelda = (fila: number, columna: number) => {
    const referencia = `${obtenerLetraColumna(columna)}${fila + 1}`;
    setCeldaActiva(referencia);
    setValorFormula(datos[fila][columna]);
  };

  // Actualizar valor de la celda activa
  const actualizarCeldaActiva = () => {
    if (celdaActiva) {
      const columna = celdaActiva.charCodeAt(0) - 65;
      const fila = parseInt(celdaActiva.substring(1)) - 1;
      
      if (fila >= 0 && fila < FILAS && columna >= 0 && columna < COLUMNAS) {
        manejarCambioCelda(fila, columna, valorFormula);
      }
    }
  };

  // Obtener el valor de una celda mediante su referencia
  const obtenerValorCelda = (ref: string, datosCeldas: string[][]): string | null => {
    const coords = refACoordenadas(ref);
    if (!coords) return null;
    
    const [fila, columna] = coords;
    return datosCeldas[fila][columna];
  };

  // Evaluar fórmulas
  const evaluarCelda = (valor: string, datosCeldas: string[][]): string => {
    if (!valor.startsWith("=")) return valor;
    
    try {
      // Extraer la fórmula (sin el signo =)
      let formula = valor.substring(1).trim();
      
      // Buscar referencias de celdas (A1, B2, etc.) y reemplazarlas por sus valores
      const regexCelda = /([A-H])([1-9]|10)/g;
      let match;
      
      while ((match = regexCelda.exec(formula)) !== null) {
        const refCelda = match[0];
        const valorCelda = obtenerValorCelda(refCelda, datosCeldas);
        
        // Si la celda referenciada contiene una fórmula, evitar referencias circulares
        if (valorCelda && valorCelda.startsWith("=")) {
          return "#REF!";
        }
        
        // Reemplazar la referencia con el valor (o 0 si es vacío)
        const valorNumerico = valorCelda ? isNaN(Number(valorCelda)) ? 0 : Number(valorCelda) : 0;
        formula = formula.replace(refCelda, valorNumerico.toString());
      }
      
      // Reemplazar operaciones matemáticas por funciones JavaScript
      formula = formula.replace(/SUMA\(/gi, 'sum(');
      formula = formula.replace(/PROMEDIO\(/gi, 'average(');
      formula = formula.replace(/MAX\(/gi, 'max(');
      formula = formula.replace(/MIN\(/gi, 'min(');
      
      // Agregar funciones personalizadas
      const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
      const average = (...args: number[]) => args.reduce((a, b) => a + b, 0) / args.length;
      const max = (...args: number[]) => Math.max(...args);
      const min = (...args: number[]) => Math.min(...args);
      
      // Evaluar la fórmula con las funciones disponibles
      const resultado = eval(formula);
      
      // Formatear resultado (2 decimales si es un número con decimales)
      if (typeof resultado === 'number') {
        return resultado % 1 === 0 ? resultado.toString() : resultado.toFixed(2);
      }
      
      return resultado?.toString() || "";
    } catch (error) {
      return "#ERROR";
    }
  };

  // Exportar a CSV
  const exportarCSV = () => {
    try {
      const csvContenido = datos.map(fila => fila.join(",")).join("\n");
      const blob = new Blob([csvContenido], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hoja_calculo.csv";
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Archivo CSV exportado",
        description: "Se ha generado correctamente el archivo CSV",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el archivo CSV",
        variant: "destructive",
      });
    }
  };

  const ejemploBásico = () => {
    const nuevaHoja = Array(FILAS).fill(null).map(() => Array(COLUMNAS).fill(""));
    
    // Ejemplo simple de suma
    nuevaHoja[0][0] = "10";
    nuevaHoja[1][0] = "20";
    nuevaHoja[2][0] = "=A1+A2";
    
    // Ejemplo de multiplicación
    nuevaHoja[0][1] = "5";
    nuevaHoja[1][1] = "3";
    nuevaHoja[2][1] = "=B1*B2";
    
    // Título
    nuevaHoja[0][3] = "Ejemplos básicos";
    
    setDatos(nuevaHoja);
    toast({
      title: "Ejemplo básico cargado",
      description: "Se ha cargado un ejemplo básico de fórmulas",
    });
  };

  const ejemploAvanzado = () => {
    const nuevaHoja = Array(FILAS).fill(null).map(() => Array(COLUMNAS).fill(""));
    
    // Encabezados
    nuevaHoja[0][0] = "Producto";
    nuevaHoja[0][1] = "Precio";
    nuevaHoja[0][2] = "Cantidad";
    nuevaHoja[0][3] = "Subtotal";
    
    // Datos
    nuevaHoja[1][0] = "Laptop";
    nuevaHoja[1][1] = "1200";
    nuevaHoja[1][2] = "2";
    nuevaHoja[1][3] = "=B2*C2";
    
    nuevaHoja[2][0] = "Mouse";
    nuevaHoja[2][1] = "25";
    nuevaHoja[2][2] = "4";
    nuevaHoja[2][3] = "=B3*C3";
    
    nuevaHoja[3][0] = "Teclado";
    nuevaHoja[3][1] = "45";
    nuevaHoja[3][2] = "3";
    nuevaHoja[3][3] = "=B4*C4";
    
    // Total
    nuevaHoja[4][2] = "Total:";
    nuevaHoja[4][3] = "=D2+D3+D4";
    
    // Impuesto
    nuevaHoja[5][2] = "IVA (15%):";
    nuevaHoja[5][3] = "=D5*0.15";
    
    // Total con impuesto
    nuevaHoja[6][2] = "Total con IVA:";
    nuevaHoja[6][3] = "=D5+D6";
    
    setDatos(nuevaHoja);
    toast({
      title: "Ejemplo avanzado cargado",
      description: "Se ha cargado un ejemplo avanzado de factura",
    });
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gray-50">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between mb-2 bg-white p-2 rounded shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="font-mono">{celdaActiva || "Celda"}</span>
          <Input
            value={valorFormula}
            onChange={(e) => setValorFormula(e.target.value)}
            onBlur={actualizarCeldaActiva}
            onKeyDown={(e) => e.key === "Enter" && actualizarCeldaActiva()}
            className="w-64"
            placeholder="Valor o fórmula (ej: =A1+B1)"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportarCSV}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <Tabs value={tabActiva} onValueChange={setTabActiva} className="flex-1">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="calculos">Hoja de Cálculo</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculos" className="flex-1 overflow-auto">
          {/* Tabla de hoja de cálculo */}
          <div className="bg-white p-2 rounded shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-10 border border-gray-300"></th>
                  {[...Array(COLUMNAS)].map((_, indice) => (
                    <th
                      key={indice}
                      className="min-w-16 border border-gray-300 py-1 text-center font-normal text-gray-600"
                    >
                      {obtenerLetraColumna(indice)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, indiceFila) => (
                  <tr key={indiceFila}>
                    <td className="border border-gray-300 text-center text-gray-600 bg-gray-100">
                      {indiceFila + 1}
                    </td>
                    {fila.map((celda, indiceColumna) => (
                      <td
                        key={`${indiceFila}-${indiceColumna}`}
                        className={`border border-gray-300 p-0 ${
                          celdaActiva ===
                          `${obtenerLetraColumna(indiceColumna)}${indiceFila + 1}`
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        <input
                          type="text"
                          value={indiceColumna === 0 && indiceFila === 0 ? celda : evaluados[indiceFila][indiceColumna]}
                          onChange={(e) =>
                            manejarCambioCelda(
                              indiceFila,
                              indiceColumna,
                              e.target.value
                            )
                          }
                          onFocus={() => seleccionarCelda(indiceFila, indiceColumna)}
                          className="w-full h-full p-1 border-0 focus:outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="tutorial" className="overflow-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Tutorial de Hoja de Cálculo</h2>
            
            <p>Esta hoja de cálculo te permite realizar operaciones matemáticas básicas y usar referencias a celdas.</p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Fórmulas básicas</h3>
              <p>Para usar una fórmula, empieza con el signo igual (=) y luego escribe la expresión matemática:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>=10+5</code> - Suma 10 y 5</li>
                <li><code>=20-8</code> - Resta 8 de 20</li>
                <li><code>=6*7</code> - Multiplica 6 por 7</li>
                <li><code>=15/3</code> - Divide 15 entre 3</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Referencias a celdas</h3>
              <p>Puedes usar referencias a otras celdas en tus fórmulas:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>=A1+B1</code> - Suma el valor de la celda A1 y B1</li>
                <li><code>=A2*B3</code> - Multiplica el valor de la celda A2 por B3</li>
                <li><code>=C5/D2</code> - Divide el valor de la celda C5 entre D2</li>
                <li><code>=A1+B1*C1</code> - Operaciones combinadas (respeta el orden de operaciones)</li>
              </ul>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={ejemploBásico}>
                Cargar ejemplo básico
              </Button>
              <Button variant="outline" onClick={ejemploAvanzado}>
                Cargar ejemplo avanzado
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HojaCalculo;
