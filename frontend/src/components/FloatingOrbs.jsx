const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Top Left Orb */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Bottom Right Orb */}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-neutral-400/5 rounded-full blur-3xl animate-float-slow" />
      
      {/* Center Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-800/10 rounded-full blur-[100px]" />
      
      {/* Floating Small Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-fast" />
      <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-medium" />
    </div>
  );
};

export default FloatingOrbs;
