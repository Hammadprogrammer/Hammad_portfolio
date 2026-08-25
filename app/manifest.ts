import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Hammad — Full Stack Developer",
    short_name: "M. Hammad",
    description:
      "Portfolio of Muhammad Hammad — Full Stack Developer building fast, scalable web applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#04060d",
    theme_color: "#04060d",
    icons: [{ src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }],
  };
}
