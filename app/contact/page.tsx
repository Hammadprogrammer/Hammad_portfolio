import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

const description =
  "Have a product, idea or technical challenge? Hire Muhammad Hammad — Full Stack Developer available for freelance projects and full-time roles. Response within 24 hours.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Muhammad Hammad",
    description,
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactView />;
}
