
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Maximize, Minimize, X } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  isActive: boolean;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

const Window = ({
  id,
  title,
  isActive,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 500, height: 400 },
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
}: WindowProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    onFocus();
    setIsDragging(true);
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle resize from corner
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    onFocus();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      } else if (isResizing && windowRef.current) {
        const width = e.clientX - position.x;
        const height = e.clientY - position.y;
        setSize({
          width: Math.max(300, width),
          height: Math.max(200, height)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize();
  };

  const windowStyle = {
    width: isMaximized ? '100%' : `${size.width}px`,
    height: isMaximized ? '100%' : `${size.height}px`,
    transform: isMaximized ? 'none' : `translate(${position.x}px, ${position.y}px)`,
    zIndex: isActive ? 10 : 5,
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        "os-window absolute animate-window-open",
        isActive ? "ring-2 ring-os-accent/70" : "",
        isMaximized ? "top-0 left-0 right-0 bottom-0" : ""
      )}
      style={windowStyle}
      onClick={onFocus}
    >
      <div className="os-window-header" onMouseDown={handleMouseDown}>
        <div className="flex items-center">
          <button className="os-window-button os-window-close" onClick={onClose}></button>
          <button className="os-window-button os-window-minimize" onClick={onMinimize}></button>
          <button className="os-window-button os-window-maximize" onClick={handleMaximize}></button>
          <span className="ml-2 text-sm font-medium text-os-text-primary">{title}</span>
        </div>
      </div>
      
      <div className="p-4 h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>
      
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export default Window;
