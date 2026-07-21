import VideoSection from "@/components/VideoSection";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Reservations from "@/components/Reservations";
import Gallery from "@/components/Gallery";
import ContactFooter from "@/components/ContactFooter";
import LaneDivider from "@/components/LaneDivider";

// Single scrolling page. Each major section is its own component under
// /components so it stays easy to reorder, restyle, or wire up to
// Supabase later (Reservations and Pricing are the most likely candidates).
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <LaneDivider />
        <About />
        <LaneDivider />
        <Pricing />
        <LaneDivider />
        <Reservations />
        <LaneDivider />
        <Gallery />
        <LaneDivider />
        <ContactFooter />
      </main>
    </>
  );
}
