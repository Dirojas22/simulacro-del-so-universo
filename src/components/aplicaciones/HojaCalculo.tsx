
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Número de filas y columnas
const FILAS = 10;
const COLUMNAS = 8;

// Función para generar letras de columnas (A, B, C, ...)
const obtenerLetraColumna = (indice: number): string => {
  return String.fromCharCode(65 + indice);
};

const HojaCalculo: React.FC = () => {
  // Estado para almacenar los datos de las celdas
  const [datos, setDatos] = useState<string[][]>([]);
  const [celdaActiva, setCeldaActiva] = useState<string | null>(null);
  const [valorFormula, setValorFormula] = useState<string>("");

  // Inicializar datos vacíos
  useEffect(() => {
    const inicializarDatos = () => {
      const nuevosDatos: string[][] = [];
      for (let i = 0; i < FILAS; i++) {
        nuevosDatos.push(Array(COLUMNAS).fill(""));
      }
      setDatos(nuevosDatos);
    };

    inicializarDatos();
  }, []);

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

  // Evaluar fórmulas básicas
  const evaluarCelda = (valor: string): string => {
    if (valor.startsWith("=")) {
      try {
        // Muy básica - solo soporta operaciones simples
        const formula = valor.substring(1);
        // Evaluar la fórmula (solo para demo, en producción debería ser más seguro)
        // eslint-disable-next-line no-eval
        return eval(formula).toString();
      } catch (error) {
        return "#ERROR";
      }
    }
    return valor;
  };

  // Exportar a CSV
  const exportarCSV = () => {
    const csvContenido = datos.map(fila => fila.join(",")).join("\n");
    const blob = new Blob([csvContenido], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hoja_calculo.csv";
    a.click();
    URL.revokeObjectURL(url);
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

        <Button variant="outline" size="sm" onClick={exportarCSV}>
          Exportar CSV
        </Button>
      </div>

      {/* Tabla de hoja de cálculo */}
      <div className="flex-1 overflow-auto">
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
                      value={evaluarCelda(celda)}
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
    </div>
  );
};

export default HojaCalculo;
