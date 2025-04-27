
import React from 'react';
import { useDOS } from '@/context/DOSContext';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Categorías de fondos de pantalla
const categorias = [
  { id: "tecnologia", nombre: "Tecnología" },
  { id: "naturaleza", nombre: "Naturaleza" },
  { id: "abstracto", nombre: "Abstracto" },
  { id: "minimalista", nombre: "Minimalista" }
];

const fondosDisponibles = {
  tecnologia: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
    "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ],
  naturaleza: [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2274&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2275&q=80",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ],
  abstracto: [
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80",
    "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ],
  minimalista: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
    "https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=2094&q=80",
    "https://images.unsplash.com/photo-1498550744921-75f79806b8a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
  ]
};

const Galeria: React.FC = () => {
  const { state, dispatch } = useDOS();
  const [categoriaActiva, setCategoriaActiva] = React.useState("tecnologia");

  const cambiarFondo = (fondo: string) => {
    dispatch({ 
      type: 'CAMBIAR_FONDO', 
      payload: fondo 
    });
  };

  const getTodosFondos = () => {
    return Object.values(fondosDisponibles).flat();
  };

  const esFondoSeleccionado = (fondo: string) => {
    return state.fondoActual === fondo;
  };

  return (
    <div className="p-4 h-full bg-white flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Galería de Fondos</h2>
      
      <Tabs 
        value={categoriaActiva} 
        onValueChange={setCategoriaActiva} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          {categorias.map((categoria) => (
            <TabsTrigger key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categorias.map((categoria) => (
          <TabsContent 
            key={categoria.id} 
            value={categoria.id}
            className="overflow-y-auto flex-1"
          >
            <div className="grid grid-cols-2 gap-4">
              {fondosDisponibles[categoria.id as keyof typeof fondosDisponibles].map((fondo, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all ${esFondoSeleccionado(fondo) ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => cambiarFondo(fondo)}
                >
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-video">
                      <img 
                        src={fondo} 
                        alt={`Fondo ${categoria.nombre} ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <span className="text-white text-xl font-bold">{categoria.nombre} {index + 1}</span>
                      </div>
                    </div>
                    {esFondoSeleccionado(fondo) && (
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
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Haga clic en cualquier imagen para establecerla como fondo de pantalla</p>
      </div>
    </div>
  );
};

export default Galeria;
