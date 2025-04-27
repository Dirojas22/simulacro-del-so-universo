
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDOS } from "@/context/DOSContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { state, dispatch } = useDOS();
  const [selectedUserId, setSelectedUserId] = useState("1");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedUser = state.usuarios.find(user => user.id.toString() === selectedUserId);
    
    if (selectedUser && (selectedUser.password === password || selectedUser.password === '')) {
      dispatch({ 
        type: "LOGIN",
        payload: selectedUser
      });
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-dos-dark-blue">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-dos-blue">DOS</h1>
          <p className="text-gray-500">Sistema Operativo</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            {state.usuarios.find(user => user.id.toString() === selectedUserId) && (
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={state.usuarios.find(user => user.id.toString() === selectedUserId)?.avatar} />
                <AvatarFallback>{state.usuarios.find(user => user.id.toString() === selectedUserId)?.nombre[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <Select 
              value={selectedUserId} 
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                {state.usuarios.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">Contraseña incorrecta</p>
            )}
          </div>
          
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Nota: Use contraseña "0000" o deje en blanco para el usuario Invitado
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
