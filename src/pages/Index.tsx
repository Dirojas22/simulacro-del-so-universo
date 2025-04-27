
import React from "react";
import Escritorio from "@/components/Escritorio";
import { DOSProvider } from "@/context/DOSContext";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <>
      <Toaster />
      <DOSProvider>
        <Escritorio />
      </DOSProvider>
    </>
  );
};

export default Index;
