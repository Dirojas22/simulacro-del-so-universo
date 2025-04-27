
import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, ArrowRight } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified?: string;
}

const FilesApp = () => {
  const [currentPath, setCurrentPath] = useState('Home');
  const [history, setHistory] = useState<string[]>(['Home']);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock file system data
  const fileSystem: Record<string, FileItem[]> = {
    'Home': [
      { id: '1', name: 'Documents', type: 'folder' },
      { id: '2', name: 'Pictures', type: 'folder' },
      { id: '3', name: 'Downloads', type: 'folder' },
      { id: '4', name: 'readme.txt', type: 'file', size: '2 KB', modified: '2025-04-10' },
    ],
    'Documents': [
      { id: '5', name: 'Work', type: 'folder' },
      { id: '6', name: 'Personal', type: 'folder' },
      { id: '7', name: 'report.docx', type: 'file', size: '45 KB', modified: '2025-03-25' },
      { id: '8', name: 'budget.xlsx', type: 'file', size: '28 KB', modified: '2025-04-15' },
    ],
    'Pictures': [
      { id: '9', name: 'Vacation', type: 'folder' },
      { id: '10', name: 'Family', type: 'folder' },
      { id: '11', name: 'profile.jpg', type: 'file', size: '1.2 MB', modified: '2025-02-28' },
    ],
    'Downloads': [
      { id: '12', name: 'software.zip', type: 'file', size: '156 MB', modified: '2025-04-20' },
      { id: '13', name: 'movie.mp4', type: 'file', size: '2.4 GB', modified: '2025-04-18' },
    ],
  };

  const navigateTo = (folder: string) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(folder);
    
    setCurrentPath(folder);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const navigateBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const navigateForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateTo(item.name);
    }
  };

  const currentFolderContent = fileSystem[currentPath] || [];

  return (
    <div className="h-full flex flex-col text-os-text-primary">
      <div className="flex items-center gap-2 mb-3 p-2 bg-os-window-header rounded-md">
        <button 
          className="p-1 rounded-md hover:bg-white/10 disabled:opacity-50"
          onClick={navigateBack}
          disabled={currentIndex <= 0}
        >
          <ArrowLeft size={16} />
        </button>
        <button 
          className="p-1 rounded-md hover:bg-white/10 disabled:opacity-50"
          onClick={navigateForward}
          disabled={currentIndex >= history.length - 1}
        >
          <ArrowRight size={16} />
        </button>
        <div className="px-2 py-1 bg-os-window text-sm flex-1 rounded">
          {currentPath}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-os-window rounded-md">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 p-3">
          {currentFolderContent.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center p-2 rounded-md hover:bg-white/10 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                {item.type === 'folder' ? (
                  <Folder size={36} className="text-os-accent" />
                ) : (
                  <FileText size={32} className="text-os-text-secondary" />
                )}
              </div>
              <span className="text-xs text-center mt-1 max-w-24 truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilesApp;
