import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import Services from "@/components/home/Services";
import TechStack from "@/components/home/TechStack";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import HomeCta from "@/components/home/HomeCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Services />
      <TechStack />
      <Stats />
      <Testimonials />
      <HomeCta />
    </>
  );
}
