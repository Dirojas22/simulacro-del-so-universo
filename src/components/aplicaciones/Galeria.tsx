
import React from 'react';
import { useDOS } from '@/context/DOSContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

const fondosDisponibles = [
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
];

const Galeria: React.FC = () => {
  const { state, dispatch } = useDOS();

  const cambiarFondo = (fondo: string) => {
    dispatch({ 
      type: 'CAMBIAR_FONDO', 
      payload: fondo 
    });
  };

  return (
    <div className="p-4 h-full bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Galería de Fondos</h2>
      <div className="grid grid-cols-2 gap-4">
        {fondosDisponibles.map((fondo, index) => (
          <Card 
            key={index} 
            className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all ${state.fondoActual === fondo ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => cambiarFondo(fondo)}
          >
            <CardContent className="p-0 relative">
              <div className="relative aspect-video">
                <img 
                  src={fondo} 
                  alt={`Fondo DOS ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <span className="text-white text-xl font-bold">DOS {index + 1}</span>
                </div>
              </div>
              {state.fondoActual === fondo && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Haga clic en cualquier imagen para establecerla como fondo de pantalla</p>
      </div>
    </div>
  );
};

export default Galeria;
