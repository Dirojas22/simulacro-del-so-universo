
import React from "react";
import { Tr3sOS } from "../tr3s/Tr3sOS";

const MaquinaVirtual: React.FC = () => {
  return (
    <div className="h-full w-full overflow-hidden bg-gray-800 p-2">
      <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700 shadow-lg">
        <Tr3sOS />
      </div>
    </div>
  );
};

export default MaquinaVirtual;
