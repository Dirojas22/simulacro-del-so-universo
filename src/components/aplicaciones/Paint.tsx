
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [dibujando, setDibujando] = useState(false);
  const [color, setColor] = useState("#000000");
  const [grosor, setGrosor] = useState(5);
  const [herramienta, setHerramienta] = useState<"lapiz" | "borrador" | "linea" | "rectangulo">("lapiz");
  const [puntoInicio, setPuntoInicio] = useState<{ x: number; y: number } | null>(null);

  // Inicializar el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Configurar el canvas
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = grosor;

    // Hacer el fondo blanco al iniciar
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    setCtx(context);
  }, []);

  // Actualizar propiedades del contexto cuando cambian
  useEffect(() => {
    if (!ctx) return;
    ctx.strokeStyle = herramienta === "borrador" ? "white" : color;
    ctx.lineWidth = grosor;
  }, [color, grosor, herramienta, ctx]);

  // Redimensionar canvas al tamaño del contenedor
  useEffect(() => {
    const redimensionar = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const contenedor = canvas.parentElement;
      if (!contenedor) return;

      const rect = contenedor.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width;
      canvas.height = height;

      // Volver a configurar el contexto después de redimensionar
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = color;
        context.lineWidth = grosor;
        
        // Rellenar el canvas con blanco
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        setCtx(context);
      }
    };

    redimensionar();
    window.addEventListener("resize", redimensionar);

    return () => {
      window.removeEventListener("resize", redimensionar);
    };
  }, []);

  // Guardar imagen
  const guardarImagen = () => {
    if (!canvasRef.current) return;
    
    const enlace = document.createElement("a");
    enlace.download = "imagen.png";
    enlace.href = canvasRef.current.toDataURL("image/png");
    enlace.click();
  };

  // Limpiar canvas
  const limpiarCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Manejar eventos del mouse
  const iniciarDibujo = (x: number, y: number) => {
    if (!ctx) return;
    
    setDibujando(true);
    
    if (herramienta === "lapiz" || herramienta === "borrador") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      // Para lineas y rectángulos, guardamos el punto de inicio
      setPuntoInicio({ x, y });
    }
  };

  const dibujar = (x: number, y: number) => {
    if (!dibujando || !ctx) return;
    
    if (herramienta === "lapiz" || herramienta === "borrador") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const terminarDibujo = (x: number, y: number) => {
    if (!dibujando || !ctx || !puntoInicio) {
      setDibujando(false);
      return;
    }
    
    if (herramienta === "linea") {
      ctx.beginPath();
      ctx.moveTo(puntoInicio.x, puntoInicio.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (herramienta === "rectangulo") {
      const ancho = x - puntoInicio.x;
      const alto = y - puntoInicio.y;
      ctx.strokeRect(puntoInicio.x, puntoInicio.y, ancho, alto);
    }
    
    setDibujando(false);
    setPuntoInicio(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <Select
            value={herramienta}
            onValueChange={(value: any) => setHerramienta(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Herramienta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lapiz">Lápiz</SelectItem>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="linea">Línea</SelectItem>
              <SelectItem value="rectangulo">Rectángulo</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-0 cursor-pointer"
            disabled={herramienta === "borrador"}
          />
          
          <Select
            value={grosor.toString()}
            onValueChange={(value) => setGrosor(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Grosor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Muy fino</SelectItem>
              <SelectItem value="3">Fino</SelectItem>
              <SelectItem value="5">Medio</SelectItem>
              <SelectItem value="10">Grueso</SelectItem>
              <SelectItem value="20">Muy grueso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={limpiarCanvas}>
            Limpiar
          </Button>
          <Button variant="outline" size="sm" onClick={guardarImagen}>
            Guardar
          </Button>
        </div>
      </div>
      
      {/* Área de dibujo */}
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            iniciarDibujo(e.clientX - rect.left, e.clientY - rect.top);
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            dibujar(e.clientX - rect.left, e.clientY - rect.top);
          }}
          onMouseUp={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            terminarDibujo(e.clientX - rect.left, e.clientY - rect.top);
          }}
          onMouseLeave={() => {
            setDibujando(false);
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Paint;
