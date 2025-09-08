"use client";
import Image from "next/image";

import Link from "next/link";
import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import PWAInstallButton from "./components/PWAInstallButton";

export default function Home() {
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
