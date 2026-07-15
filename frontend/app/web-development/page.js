"use client";
import WebsiteBanner from "../../component/website-development/WebsiteBanner";
import Websitecard from "../../component/website-development/Websitecard";
import AnoopNavbar from "@/component/comone/AnoopNavbar";
import FooterTwo from "@/component/comone/footerTwo";


export default function Page() {
  return (
    <>
    <AnoopNavbar />
      <WebsiteBanner />
      {/* <Clinet /> */}
      <Websitecard />
    {/* <Footer /> */}

  <FooterTwo />
    </>
  );
}
