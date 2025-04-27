
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Calculadora: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [primerOperando, setPrimerOperando] = useState<number | null>(null);
  const [operador, setOperador] = useState<string | null>(null);
  const [esperandoSegundoOperando, setEsperandoSegundoOperando] = useState(false);

  const inputDigito = (digito: string) => {
    if (esperandoSegundoOperando) {
      setDisplay(digito);
      setEsperandoSegundoOperando(false);
    } else {
      setDisplay(display === "0" ? digito : display + digito);
    }
  };

  const inputDecimal = () => {
    if (esperandoSegundoOperando) {
      setDisplay("0.");
      setEsperandoSegundoOperando(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const limpiar = () => {
    setDisplay("0");
    setPrimerOperando(null);
    setOperador(null);
    setEsperandoSegundoOperando(false);
  };

  const manejarOperador = (siguienteOperador: string) => {
    const inputValue = parseFloat(display);

    if (primerOperando === null) {
      setPrimerOperando(inputValue);
    } else if (operador) {
      const resultado = calcular();
      setDisplay(String(resultado));
      setPrimerOperando(resultado);
    }

    setEsperandoSegundoOperando(true);
    setOperador(siguienteOperador);
  };

  const calcular = () => {
    const inputValue = parseFloat(display);

    if (operador === "+") {
      return (primerOperando || 0) + inputValue;
    } else if (operador === "-") {
      return (primerOperando || 0) - inputValue;
    } else if (operador === "*") {
      return (primerOperando || 0) * inputValue;
    } else if (operador === "/") {
      return (primerOperando || 0) / inputValue;
    }

    return inputValue;
  };

  const manejarIgual = () => {
    if (!operador || primerOperando === null) return;

    const resultado = calcular();
    setDisplay(String(resultado));
    setPrimerOperando(resultado);
    setOperador(null);
    setEsperandoSegundoOperando(false);
  };

  const cambiarSigno = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const porcentaje = () => {
    const valor = parseFloat(display);
    setDisplay(String(valor / 100));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <div className="w-full max-w-xs bg-gray-900 p-4 rounded-lg shadow-lg">
        <div className="bg-gray-800 text-right p-3 mb-4 rounded">
          <div className="text-white text-3xl font-mono">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Primera fila */}
          <Button
            onClick={limpiar}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            C
          </Button>
          <Button
            onClick={cambiarSigno}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            +/-
          </Button>
          <Button
            onClick={porcentaje}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            %
          </Button>
          <Button
            onClick={() => manejarOperador("/")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            ÷
          </Button>

          {/* Segunda fila */}
          <Button
            onClick={() => inputDigito("7")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            7
          </Button>
          <Button
            onClick={() => inputDigito("8")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            8
          </Button>
          <Button
            onClick={() => inputDigito("9")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            9
          </Button>
          <Button
            onClick={() => manejarOperador("*")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            ×
          </Button>

          {/* Tercera fila */}
          <Button
            onClick={() => inputDigito("4")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            4
          </Button>
          <Button
            onClick={() => inputDigito("5")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            5
          </Button>
          <Button
            onClick={() => inputDigito("6")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            6
          </Button>
          <Button
            onClick={() => manejarOperador("-")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            −
          </Button>

          {/* Cuarta fila */}
          <Button
            onClick={() => inputDigito("1")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            1
          </Button>
          <Button
            onClick={() => inputDigito("2")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            2
          </Button>
          <Button
            onClick={() => inputDigito("3")}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            3
          </Button>
          <Button
            onClick={() => manejarOperador("+")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            +
          </Button>

          {/* Quinta fila */}
          <Button
            onClick={() => inputDigito("0")}
            className="col-span-2 bg-gray-600 hover:bg-gray-500 text-white"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            ,
          </Button>
          <Button
            onClick={manejarIgual}
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
