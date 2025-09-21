// src/components/DnaHelixLoader.jsx
import React from "react";

const DnaHelixLoader = ({ visible = true, count = 15, height = "100vh" }) => {
  if (!visible) return null;

  return (
    <div className="flex items-center justify-center" style={{ height }}>
      {Array.from({ length: count }).map((_, i) => (
        <div className="strand" key={i}>
          <div className="top" style={{ animationDelay: `${i * -0.2}s` }}></div>
          <div
            className="bottom"
            style={{ animationDelay: `${-1.5 - i * 0.2}s` }}
          ></div>
        </div>
      ))}

      <style>{`
        .strand {
          position: relative;
          width: 15px;
          height: 40px;
          animation: fadeIn 1s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .top, .bottom {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 12px;
          width: 12px;
          border-radius: 100%;
          animation: 3s move infinite ease-in-out;
        }

        @keyframes move {
        0% {
            background-color: #06b6d4; /* cyan-500 */
            top: 100%;
            z-index: -3;
        }
        25% { 
            height: 8px;
            width: 8px;
            background-color: #0d9488; /* teal-600 */
            z-index: -3;
        }
        50% {
            background-color: #06b6d4; /* cyan-500 */
            top: 0%;
            z-index: -3;
        }
        75% {
            height: 12px;
            width: 12px;
            background-color: #0d9488; /* teal-600 */
            z-index: 3;
        }
        100% {
            top: 100%;
            background-color: #06b6d4; /* cyan-500 */
            z-index: 3;
        }
        }
      `}</style>
    </div>
  );
};

export default DnaHelixLoader;
