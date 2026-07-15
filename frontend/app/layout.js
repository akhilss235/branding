
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anoop Krishna V A",
  alternateName: ["Anoop Krishna", "AKV", "Anoop Krishnan"],
  description:
    "Creative Systems Architect, Brand Strategist & Sound Engineer based in Trivandrum, Kerala with 12+ years experience in audio-visual, branding, and digital systems.",
  url: "https://anoopkrishna.com",
  image: "/models/Anoop.jpeg",
  jobTitle: "Creative Systems Architect",
  worksFor: {
    "@type": "Organization",
    name: "FLUMENX",
  },
"address": {
  "@type": "PostalAddress",
  "addressLocality": "Trivandrum",
  "addressRegion": "Kerala",
  "addressCountry": "IN"
},
  sameAs: [
    "https://www.linkedin.com/in/anoop-krishna-v-a-2b7501234/?originalSubdomain=in",
    "http://youtube.com/@akvanoop",
    "https://www.instagram.com/anoopkrishna_akv?igsh=MTNlNHMxZWN5bmY3cw==",
    "https://www.wikidata.org/wiki/Q138495352"
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <link rel="icon" href="/flumen-favicon.png" />
      </head>
      <body
        className={`${montserrat.variable} ${geistMono.variable} antialiased`}
      >
        {/* <OpeningLoader /> */}
        {children}
      </body>
    </html>
  );
}
