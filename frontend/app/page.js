"use client";

import Mainbanner from "../component/Mainbanner";
import WorkPage from "../component/Work/WorkPage";
import "./globals.css";
import ContactPage from "../component/Contact/ContactPage";
import Home_contant from "../component/home/Home_contant";
import ExperienceRole from "../component/ExperienceRole/ExperienceRole";
import Footer from "../component/comone/Footer";
import BrandingLogo from "../component/BrandingLogo/BrandingLogo";
import ExperienceSection from "../component/ExperienceRole/ExperienceSection";
import Herossection from "../component/Herossection";
// import Bubbles from "@/component/bubbles";
import BubblesTwo from "@/component/Bubbletwo";
import Particles from "@/component/Particles";
import AnoopNavbar from "@/component/comone/AnoopNavbar";

export default function Page() {
  return (
    <>
      <main
        className="relative isolate"
        id="road-scene"
        style={{
            // backgroundColor: '#01111e',
          backgroundImage: `
            radial-gradient(circle at 30% 0%, #1b6383 0%, transparent 10%),
            linear-gradient(180deg, rgba(1, 27, 48, 0.8) 0%, rgba(1, 15, 28, 0.9) 50%, #000000 100%)
          `
        }}
      >

        <AnoopNavbar />
{/* <Diver /> */}

                {/* <Diversection /> */}
        <div className="relative z-10">
          <section
            className="page-section page-section--hero overflow-hidden"
            id="intro"
            data-scroll-section="intro"
            data-road-stop
            data-road-side="right"
          >

            <Particles />
            <Mainbanner />
                        <BubblesTwo />
                {/* <Water_plant /> */}
                
          </section>






          <section className="lower-sections-shell relative isolate">
            <div className="relative z-10">

              <section
                className="page-section"
                id="overview"
                data-scroll-section="overview"
                data-road-stop
                data-road-side="left"
              >
                <Herossection />
              </section>
         
              <section
                className="page-section2"
                id="collaborators"
                data-scroll-section="collaborators"
                data-road-stop
                data-road-side="right"
              >
                <BrandingLogo />
              </section>



              <section className="page-section" id="about" data-scroll-section="about" data-road-stop data-road-side="left">
                <Home_contant />
              </section>

              <section className="page-section" id="work" data-scroll-section="work" data-road-stop data-road-side="right">
                <WorkPage />
              </section>


              <section
                className="page-section"
                id="Checking"
                data-scroll-section="Checking"
                data-road-stop
                data-road-side="left"
              >
                <ExperienceSection />
                {/* <Bubbles /> */}
              </section>

              <section
                className="page-section"
                id="ExperienceRole"
                data-scroll-section="ExperienceRole"
                data-road-stop
                data-road-side="right"
              >
                <ExperienceRole />
              </section>


              <section
                className="page-section"
                id="contact"
                data-scroll-section="contact"
                data-road-stop
                data-road-side="left"
              >
                <ContactPage />
              </section>
              <section
                id="Footer"
                data-scroll-section="Footer"
                data-road-stop
                data-road-side="center"
              >
                <Footer />
              </section>
            </div>
          </section>

          {/* <Footer /> */}
        </div>
      </main>

  
    </>
  );
}
