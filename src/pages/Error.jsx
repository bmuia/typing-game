import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="bg-black text-red-500 min-h-screen flex flex-col items-center justify-center font-mono px-4">
      <div className="text-left w-full max-w-2xl animate-pulse">
        <h1 className="text-2xl mb-4">[ERROR] 0x0002: AUTHENTICATION FAILED</h1>
        <p className="mb-2">>>> Unable to retrieve or verify authentication tokens</p>
        <p className="mb-2">>>> Access to the system denied</p>
        <p className="mb-2">>>> Please retry login sequence</p>
        <p className="mb-6">>>> Redirect aborted. Manual intervention required.</p>
      </div>

      <button
        onClick={handleReturn}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 transition"
      >
        RETURN TO LOGIN
      </button>
    </div>
  );
};

export default Error;
