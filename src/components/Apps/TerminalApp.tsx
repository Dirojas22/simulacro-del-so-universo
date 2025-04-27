
import React, { useState, useRef, useEffect } from 'react';

const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<React.ReactNode[]>([
    <div key="welcome" className="mb-2">
      <div className="text-green-400">Welcome to SimulOS Terminal</div>
      <div className="text-gray-400 text-sm">Type 'help' to see available commands</div>
    </div>
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, (args: string[]) => React.ReactNode> = {
    help: () => (
      <div className="mb-2">
        <div>Available commands:</div>
        <div className="pl-4">help - Show this help message</div>
        <div className="pl-4">echo [text] - Display text</div>
        <div className="pl-4">date - Show current date and time</div>
        <div className="pl-4">clear - Clear terminal</div>
        <div className="pl-4">ls - List files in current directory</div>
        <div className="pl-4">whoami - Display current user</div>
      </div>
    ),
    echo: (args) => (
      <div className="mb-1">{args.join(' ')}</div>
    ),
    date: () => (
      <div className="mb-1">{new Date().toString()}</div>
    ),
    clear: () => {
      setOutput([]);
      return null;
    },
    ls: () => (
      <div className="mb-2 grid grid-cols-3">
        <span className="text-blue-400">Documents/</span>
        <span className="text-blue-400">Downloads/</span>
        <span className="text-blue-400">Pictures/</span>
        <span>report.txt</span>
        <span>notes.md</span>
        <span>script.js</span>
      </div>
    ),
    whoami: () => (
      <div className="mb-1">user@simulOS</div>
    ),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const newHistory = [...history, input];
    setHistory(newHistory);
    
    const parts = input.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    let result: React.ReactNode = (
      <div className="text-red-400 mb-1">Command not found: {command}</div>
    );
    
    if (commands[command]) {
      result = commands[command](args);
    }
    
    const commandOutput = (
      <div key={newHistory.length}>
        <div className="mb-1">
          <span className="text-green-400">user@simulOS:~$</span> {input}
        </div>
        {result}
      </div>
    );
    
    if (result !== null) {
      setOutput((prev) => [...prev, commandOutput]);
    } else {
      // For clear command
      setOutput([]);
    }
    
    setInput('');
  };

  // Auto-scroll to the bottom when output changes
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [output]);

  // Focus the input when the terminal window is clicked
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', focusInput);
    return () => document.removeEventListener('click', focusInput);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100 font-mono rounded-md overflow-hidden">
      <div 
        ref={outputContainerRef}
        className="flex-1 p-3 overflow-auto"
      >
        {output}
        <div className="flex items-center">
          <span className="text-green-400">user@simulOS:~$</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-white pl-2 w-full"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
