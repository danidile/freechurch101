"use client";
import Image from "next/image";

import Link from "next/link";
import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import PWAInstallButton from "./components/PWAInstallButton";
import {
  FaUsers,
  FaRegCalendarAlt,
  FaMusic,
  FaHandsHelping,
  FaGlobe,
  FaSmile,
  FaBars,
  FaTimes,
  FaQuoteLeft,
  FaRocket,
  FaPlus,
  FaCheckCircle,
  FaAsterisk,
} from "react-icons/fa";
import { LuAppWindow, LuCalendarRange, LuGlobe, LuHandshake } from "react-icons/lu";
import { MdOutlineLibraryMusic } from "react-icons/md";
export default function Home() {
  const allFeatures = [
    {
      icon: <LuCalendarRange size={32} />,
      title: "Pianificazione Intuitiva",
      desc: "Crea e condividi scalette dettagliate per ogni servizio in pochi minuti.",
    },
    {
      icon: <MdOutlineLibraryMusic size={32} />,
      title: "Archivio Canti Centralizzato",
      desc: "Gestisci testi e accordi. Trasponi le tonalità con un solo click.",
    },
    {
      icon: <FaAsterisk size={32} />,
      title: "Gestione Semplice dei Team",
      desc: "Organizza i turni dei volontari e invia promemoria automatici.",
    },
    {
      icon: <LuHandshake size={32} />,
      title: "Ruoli e Squadre Definiti",
      desc: "Assegna responsabilità chiare per una collaborazione impeccabile.",
    },
    {
      icon: <LuGlobe size={32} />,
      title: "Accesso Cloud Ovunque",
      desc: "Sincronizza i dati e accedi alla piattaforma da qualsiasi dispositivo.",
    },
    {
      icon: <LuAppWindow size={32}  />,
      title: "Design Facile e Pulito",
      desc: "Un’interfaccia che non richiede formazione, pensata per essere usata subito.",
    },
  ];


  return (
    <>
      <section className="header-homepage flex flex-row-reverse justify-center items-center md:flex-row">
        <div className="lg:w-1/4 block md:hidden pt-8">
          <Image
            src="/images/mockupIphone.webp"
            alt="Illustrazione Organizzazione"
            width={400}
            className="max-h-[30vh] object-contain"
            height={400}
          />
        </div>
        <div className="py-8 px-2 max-w-(--breakpoint-lg) lg:py-16 lg:px-12 ">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6">
            La Tua Chiesa, Sempre Organizzata
          </h1>
          <div className="">
            <p className="text-lg mb-8 max-w-(--breakpoint-sm)">
              Una piattaforma completa per pianificare servizi, gestire team,
              archiviare canti e coordinare i volontari, tutto in cloud!
            </p>
          </div>

          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <PWAInstallButton />
          </div>
        </div>
        <div className="lg:w-1/4 hidden md:block">
          <Image
            src="/images/mockupIphone.webp"
            alt="Illustrazione Organizzazione"
            width={400}
            height={400}
          />
        </div>
      </section>

      <div className="pb-5 pt-10 text-center">
        <h2>Artisti Italiani</h2>
      </div>

      <div className="max-w-[1300px] gap-5 grid grid-cols-12 grid-rows-2 px-4 mx-auto my-5">
        <Card isFooterBlurred className="col-span-12 sm:col-span-4 h-[400px]">
          <img
            className="object-cover h-[400px]"
            src={"images/sdvworship.webp"}
          />
          <CardFooter className="justify-around before:bg-white/10 border-white/20 border overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80  ">SDV Worship.</p>
            <Button
              className="text-tiny text-white bg-black/20 mr-0"
              color="default"
              radius="md"
              size="sm"
              variant="light"
              as={Link}
              href="/artists/sdvworship"
            >
              Testi e Accordi
            </Button>
          </CardFooter>
        </Card>
        <Card isFooterBlurred className="col-span-12 sm:col-span-4 h-[400px]">
          <img
            className="object-cover h-[400px]"
            src={"images/mirkoegiorgia.webp"}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Mirko & Giorgia.</p>
            <Button
              className="text-tiny text-white bg-black/20 mr-0"
              color="default"
              radius="md"
              size="sm"
              variant="light"
              as={Link}
              href="/artists/mirkoegiorgia"
            >
              Testi e Accordi
            </Button>
          </CardFooter>
        </Card>
        <Card isFooterBlurred className="col-span-12 sm:col-span-4 h-[400px]">
          <img
            className="object-cover h-[400px]"
            src={"images/soundsmusicitalia.webp"}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Sounds Music Italia.</p>
            <Button
              className="text-tiny text-white bg-black/20 mr-0"
              color="default"
              radius="md"
              size="sm"
              variant="light"
              as={Link}
              href="/artists/soundsmusicitalia"
            >
              Testi e Accordi
            </Button>
          </CardFooter>
        </Card>
        <Card
          isFooterBlurred
          className="w-full h-[400px] col-span-12 sm:col-span-5"
        >
          <img
            className="object-cover h-[400px]"
            src={"images/nicobattaglia.webp"}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Nico Battaglia.</p>
            <Button
              className="text-tiny text-white bg-black/20 mr-0"
              color="default"
              radius="md"
              size="sm"
              variant="light"
              as={Link}
              href="/artists/nicobattaglia"
            >
              Testi e Accordi
            </Button>
          </CardFooter>
        </Card>
        <Card
          isFooterBlurred
          className="w-full h-[400px] col-span-12 sm:col-span-7"
        >
          <img
            className="object-cover h-[400px]"
            src={"images/truedevotion.webp"}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">True Devotion.</p>
            <Button
              className="text-tiny text-white bg-black/20 mr-0"
              color="default"
              radius="md"
              size="sm"
              variant="light"
              as={Link}
              href="/artists/truedevotion"
            >
              Testi e Accordi
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="visita-feed-section px-4 py-6 ">
        <h1 className="text-center my-6">Uno spazio unico per tutti i team.</h1>
        <p className="text-center my-4 max-w-[1000px]">
          ChurchLab è progettato per semplificare la gestione dei team.
        </p>
        <Image
          src="/images/event.webp"
          alt="Illustrazione Organizzazione"
          className="rounded-lg nborder "
          width={1000}
          height={400}
        />
      </div>
      <section id="features" className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
              Una Piattaforma Progettata per Te
            </h2>
            <p className="text-lg text-zinc-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              Semplifica la gestione della tua comunità con strumenti potenti e
              facili da usare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {allFeatures.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center"
              >
                <div className=" mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-zinc-800">
                  {item.title}
                </h3>
                <p className="text-zinc-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works Section (NEW) --- */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
              Inizia in 3 Semplici Passi
            </h2>
            <p className="text-lg text-zinc-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              Passare a ChurchLab è un processo rapido e intuitivo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                Crea il Tuo Account
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Registrati gratuitamente in meno di un minuto. Nessuna carta di
                credito richiesta.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                Invita il Tuo Team
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Aggiungi i tuoi pastori, musicisti e volontari per iniziare a
                collaborare da subito.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                Inizia a Pianificare
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Crea il tuo primo servizio, aggiungi canti e assegna ruoli. È
                davvero così semplice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="visita-feed-section px-4 py-6">
        <h2 className="text-center">
          Un sistema scalabile che si adatta alle tua necessità.
        </h2>
        <p className="text-center my-4 max-w-[1000px]">
          Crea turni, assegna ruoli, invia promemoria e costruisci un flusso
          organizzativo armonioso.
        </p>
        <Image
          src="/images/calendar.webp"
          alt="Illustrazione Organizzazione"
          className="rounded-lg nborder "
          width={1000}
          height={400}
        />
      </div>
    </>
  );
}
