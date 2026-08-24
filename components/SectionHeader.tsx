type Props = {
  index: string;
  label: string;
  title: React.ReactNode;
  align?: "left" | "center";
};

/** Consistent numbered section header used across all sections. */
export default function SectionHeader({ index, label, title, align = "left" }: Props) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p
        className={`mono-font flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-silver ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="text-cyan-glow">{index}</span>
        <span className="inline-block h-px w-8 bg-ice/20" />
        {label}
      </p>
      <h2 className="display-font mt-3 text-4xl font-semibold leading-tight text-ice md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
