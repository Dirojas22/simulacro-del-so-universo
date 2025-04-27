
import React, { useState } from 'react';

const NotepadApp = () => {
  const [text, setText] = useState('Welcome to SimulOS Notepad!\n\nThis is a simple text editor where you can write notes and save them locally.\n\nTry typing something...');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 flex gap-2">
        <button className="px-2 py-1 text-sm bg-os-window-header hover:bg-os-border rounded text-os-text-primary">
          File
        </button>
        <button className="px-2 py-1 text-sm bg-os-window-header hover:bg-os-border rounded text-os-text-primary">
          Edit
        </button>
        <button className="px-2 py-1 text-sm bg-os-window-header hover:bg-os-border rounded text-os-text-primary">
          Format
        </button>
      </div>
      
      <textarea
        value={text}
        onChange={handleChange}
        className="flex-1 p-2 bg-white/10 text-os-text-primary resize-none rounded focus:outline-none focus:ring-1 focus:ring-os-accent"
      />
    </div>
  );
};

export default NotepadApp;
