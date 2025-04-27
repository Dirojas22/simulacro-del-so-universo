
import React from 'react';
import { HardDrive, Cpu, Memory, Wifi } from 'lucide-react';

const ComputerApp = () => {
  return (
    <div className="h-full text-os-text-primary">
      <h2 className="text-xl font-semibold mb-4">System Information</h2>
      
      <div className="grid gap-4">
        <div className="bg-os-window-header p-3 rounded-md flex items-center">
          <HardDrive className="mr-3 text-os-accent" size={24} />
          <div>
            <h3 className="font-medium">Storage</h3>
            <p className="text-sm text-os-text-secondary">250GB SSD (120GB free)</p>
          </div>
        </div>
        
        <div className="bg-os-window-header p-3 rounded-md flex items-center">
          <Cpu className="mr-3 text-os-accent" size={24} />
          <div>
            <h3 className="font-medium">Processor</h3>
            <p className="text-sm text-os-text-secondary">Intel Core i7 @ 3.4GHz</p>
          </div>
        </div>
        
        <div className="bg-os-window-header p-3 rounded-md flex items-center">
          <Memory className="mr-3 text-os-accent" size={24} />
          <div>
            <h3 className="font-medium">Memory</h3>
            <p className="text-sm text-os-text-secondary">16GB DDR4 (8GB available)</p>
          </div>
        </div>
        
        <div className="bg-os-window-header p-3 rounded-md flex items-center">
          <Wifi className="mr-3 text-os-accent" size={24} />
          <div>
            <h3 className="font-medium">Network</h3>
            <p className="text-sm text-os-text-secondary">Connected (192.168.1.100)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerApp;
