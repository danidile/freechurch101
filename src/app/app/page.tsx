import React from "react";
import Image from "next/image";
import { Button, Card, CardHeader, CardBody, Navbar } from "@heroui/react";
import { GrSchedules } from "react-icons/gr";
import {
  FaUsers,
  FaRegCalendarAlt,
  FaMusic,
  FaHandsHelping,
  FaGlobe,
  FaSmile,
} from "react-icons/fa";
export default function LandingPage() {
  const features = [
    {
      icon: "/images/schedule.webp",
      title: "Pianificazione",
      desc: "Crea scalette dettagliate e condividi con il tuo team.",
    },
    {
      icon: "/images/songs.webp",
      title: "Archivio Canti",
      desc: "Carica testi, accordi e trasponi tonalità in un click.",
    },
    {
      icon: "/images/plans.webp",
      title: "Volontari",
      desc: "Gestisci turni, invia richiami e monitora la partecipazione.",
    },
    {
      icon: "/images/teams1.webp",
      title: "Team & Ruoli",
      desc: "Definisci squadre, assegna ruoli e responsabilità con facilità.",
    },
  ];
  return (
    <div className="scroll-smooth">
      {/* Navbar */}

      {/* Hero */}
      <section className="pt-24  relative">
        <Navbar className="absolute top-0 w-full bg-indigo-200 shadow-md z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
            <nav className="space-x-6 hidden md:flex flex-row items-center text-black">
              <a href="#features" className="hover:text-blue-600">
                Caratteristiche
              </a>

              <a href="#contact" className="hover:text-blue-600">
                Contatto
              </a>
              <a href="/login" className="hover:text-blue-600">
                Registrati
              </a>
            </nav>
            <Button variant="ghost" className="md:hidden">
              Menu
            </Button>
          </div>
        </Navbar>
        <div className="max-w-[1300px] mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-8 py-20">
          <div className="lg:w-[60]">
            <h1 className="text-7xl md:text-7xl font-extrabold mb-6">
              La Tua Chiesa,
              <br /> Sempre Organizzata
            </h1>
            <p className="text-lg mb-8">
              Una piattaforma completa per pianificare servizi, gestire team,
              archiviare canti e coordinare i volontari, tutto in cloud.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="solid" size="lg" as="a" href="/login">
                Provalo Gratuitamente
              </Button>
              <Button variant="bordered" size="lg" as="a" href="#features">
                Scopri di più
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/images/mockupIphone.webp"
              alt="Illustrazione Organizzazione"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Caratteristiche Principali
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10">
            {features.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <img
                    className="mx-auto object-cover"
                    src={item.icon}
                    alt={item.title}
                  />
                  <div className="flex justify-center mt-6"></div>
                  <h3 className="text-xl font-semibold mt-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-center mt-2 mx-auto max-w-[250px]">
                    {item.desc}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-slate-100 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Contattaci</h2>
          <p className="mb-8">
            Domande? Richiedi una demo o parlaci delle tue esigenze.
          </p>
          <form className="space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                required
                className="w-full p-3 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 rounded"
              />
            </div>
            <textarea
              placeholder="Messaggio"
              rows={4}
              required
              className="w-full p-3 rounded"
            ></textarea>
            <Button type="submit" size="lg" variant="solid">
              Invia Messaggio
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ChurchLab. Tutti i diritti
            riservati.
          </div>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white">
              Termini
            </a>
            <a href="#" className="hover:text-white">
              Supporto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
