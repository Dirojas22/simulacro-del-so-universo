
import React from "react";
import Escritorio from "@/components/Escritorio";
import { DOSProvider } from "@/context/DOSContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const Index = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <DOSProvider>
        <Escritorio />
      </DOSProvider>
    </>
  );
};

export default Index;
