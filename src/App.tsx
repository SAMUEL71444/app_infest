import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ModelPerformance from './components/ModelPerformance';
import ShapImportance from './components/ShapImportance';
import Recommendations from './components/Recommendations';
import SegmentasiSection from './components/SegmentasiSection';
import LiftGains from './components/LiftGains';
import AugmentationAnalysis from './components/AugmentationAnalysis';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-surface-950 min-h-screen text-surface-100 font-sans">
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        
        <div className="relative">
          {/* Subtle background decorative elements */}
          <div className="absolute top-[10%] left-0 w-full h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none"></div>
          
          <ModelPerformance />
          <ShapImportance />
          <Recommendations />
          <SegmentasiSection />
          <LiftGains />
          <AugmentationAnalysis />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
