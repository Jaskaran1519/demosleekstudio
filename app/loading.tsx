import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fullscreen white background layer */}
      <div className="absolute inset-0 bg-white z-[1]" />

      {/* Loader animation wrapper */}
      <div className="relative z-[2] w-32 aspect-square rounded-full flex justify-center items-center animate-[spin_3s_linear_infinite] bg-[conic-gradient(black_0deg,black_300deg,transparent_270deg,transparent_360deg)]">
        <div className="absolute w-[60%] aspect-square rounded-full animate-[spin_2s_linear_infinite] z-[3] bg-[conic-gradient(black_0deg,black_270deg,transparent_180deg,transparent_360deg)]" />
        <div className="absolute w-3/4 aspect-square rounded-full animate-[spin_3s_linear_infinite] z-[2] bg-[conic-gradient(gray_0deg,gray_180deg,transparent_180deg,transparent_360deg)]" />
        <span className="absolute w-[85%] aspect-square rounded-full animate-[spin_5s_linear_infinite] z-[4] bg-[conic-gradient(black_0deg,black_180deg,transparent_180deg,transparent_360deg)]"></span>
      </div>
    </div>
  );
};

export default Loader;
