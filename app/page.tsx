import Header from "./components/Header";
import Hero from "./components/Hero";
import SpiritOfService from "./components/SpiritOfService";
import ThreePillars from "./components/ThreePillars";
import LatestNews from "./components/LatestNews";
import LocationPicker from "./components/LocationPicker";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <SpiritOfService />
        <ThreePillars />
        <LatestNews />
        <LocationPicker />
      </main>
      <Footer />
    </>
  );
}
