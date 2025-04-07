
import Hero from "./hero";
import Analytics from "./analytics/page";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";


export default function Campaign() {
  return (
    <>
      <Navbar />
      <Hero />
      <Analytics/>
      <Footer />
    </>
  );
}
