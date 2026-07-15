"use client";

import AnoopNavbar from "../../component/comone/AnoopNavbar";
import DigitalMarketing from "../../component/SocialMedia/DigitalMarketing";
import DigitalServices from "../../component/SocialMedia/DigitalServices";
import SocialPresence from "../../component/SocialMedia/SocialPresence";
import DigitalAnimation from "../../component/SocialMedia/DigitalAnimation";
import FooterTwo from "../../component/comone/footerTwo";




export default function Page() {
  return (
    <>
      <AnoopNavbar />
      <DigitalMarketing />
      {/* <SocialMedia /> */}
      <DigitalServices />
      <SocialPresence />

      {/* <DigitalAnimation /> */}
      <FooterTwo />


    </>
  );
}
