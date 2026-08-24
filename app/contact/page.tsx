import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a product, idea or technical challenge? Let's make something real.",
};

export default function ContactPage() {
  return <ContactView />;
}
