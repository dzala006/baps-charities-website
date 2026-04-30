import Header from "./components/Header";
import Hero from "./components/Hero";
import SpiritOfService from "./components/SpiritOfService";
import ThreePillars from "./components/ThreePillars";
import LatestNews from "./components/LatestNews";
import LocationPicker from "./components/LocationPicker";
import Walk2027Promo from "./components/Walk2027Promo";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <SpiritOfService />
        <ThreePillars />
        <Walk2027Promo />
        <LatestNews />
        <LocationPicker />
      </main>
      <Footer />
    </>
  );
}
