
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Editor: React.FC = () => {
  const [contenido, setContenido] = useState("");
  const [fuente, setFuente] = useState("sans");
  const [tamaño, setTamaño] = useState("16");
  const [negrita, setNegrita] = useState(false);
  const [cursiva, setCursiva] = useState(false);
  const [subrayado, setSubrayado] = useState(false);

  const obtenerEstilos = () => {
    let estilos = `font-${fuente} text-${tamaño}px`;
    if (negrita) estilos += " font-bold";
    if (cursiva) estilos += " italic";
    if (subrayado) estilos += " underline";
    return estilos;
  };

  const guardarDocumento = () => {
    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documento.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const abrirDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = (evento) => {
        const contenido = evento.target?.result as string;
        setContenido(contenido);
      };
      lector.readAsText(archivo);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gray-50">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between mb-2 bg-white p-2 rounded shadow-sm">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNegrita(!negrita)}
            className={negrita ? "bg-gray-200" : ""}
          >
            N
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCursiva(!cursiva)}
            className={cursiva ? "bg-gray-200" : ""}
          >
            <i>I</i>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubrayado(!subrayado)}
            className={subrayado ? "bg-gray-200" : ""}
          >
            <u>S</u>
          </Button>

          <Select
            value={fuente}
            onValueChange={(value) => setFuente(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={tamaño}
            onValueChange={(value) => setTamaño(value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Tamaño" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
              <SelectItem value="20">20px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            id="abrir"
            className="hidden"
            accept=".txt"
            onChange={abrirDocumento}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("abrir")?.click()}
          >
            Abrir
          </Button>
          <Button variant="outline" size="sm" onClick={guardarDocumento}>
            Guardar
          </Button>
        </div>
      </div>

      {/* Área de edición */}
      <Textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className={`flex-1 p-4 resize-none ${obtenerEstilos()}`}
        placeholder="Escriba su texto aquí..."
      />
    </div>
  );
};

export default Editor;
