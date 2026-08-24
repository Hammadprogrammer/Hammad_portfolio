/** Static, zero-WebGL fallback visual: layered gradient glows. */
export default function Fallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-void"
    >
      <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,224,255,0.10),transparent_65%)]" />
      <div className="absolute right-[-15%] top-[30%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(139,123,255,0.10),transparent_65%)]" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(34,224,255,0.06),transparent_65%)]" />
    </div>
  );
}
