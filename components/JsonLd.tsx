/** Renders a JSON-LD structured-data block (server component, no JS shipped). */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: all values are authored in-repo.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
