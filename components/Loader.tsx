import React from "react";

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className=" flex items-center justify-center">
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-white">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin h-5 w-5 mr-3"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.25A8.25 8.25 0 0020.25 12H18a6 6 0 01-6 6v2.25z"
            />
          </svg>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
