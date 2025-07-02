"use client";
import Link from "next/link";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";

export default function Home() {
  return (
    <>
      <section className="header-homepage">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 text-white">
          <h1 className="text-7xl md:text-7xl font-extrabold mb-6">
            La Tua Chiesa,
            <br /> Sempre Organizzata
          </h1>
          <p className="text-lg mb-8 text-white">
            Una piattaforma completa per pianificare servizi, gestire team,
            <br />
            archiviare canti e coordinare i volontari, tutto in cloud.
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Button href="/songs" color="primary" variant="shadow">
              Scopri l'app
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Button>
            {/* <a href="https://www.captayn.com/en" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                Lasciati Ispirare
            </a>   */}
            <Link href="https://www.captayn.com/en"></Link>
          </div>
        </div>
      </section>
      <div className="pb-5 pt-10 text-center">
        <h2>Artisti Italiani</h2>
      </div>
      <div className="max-w-[1300px] gap-5 grid grid-cols-12 grid-rows-2 px-8 mx-auto my-5">
        <Card isFooterBlurred className="col-span-12 sm:col-span-4 h-[400px]">
          <img
            className="object-cover h-[400px]"
            src={"images/sdvworship.webp"}
          />
          <CardFooter className="justify-around before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Nico Battaglia..</p>
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
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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

      <div className="visita-feed-section">
        <h4>Album e Singoli</h4>
        <h5>Le ultime uscite</h5>
        <div className="visita-feed-container">
          <div className="image-feed-div-home card-v1">
            <div className="content-feed ">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/sdvworship.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Cuore Puro</p>
                  <p className="ruolo-utente-feed">SDV Worship</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/CuorePuroSDVWorship.jpeg"}
            />
            <a
              className="visita-post-button"
              href="/songs/39278f3a-90da-4c11-99f6-1c92a2db20e5"
            >
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>

          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/soundsmusicitalia.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Intimità</p>
                  <p className="ruolo-utente-feed">Sounds</p>
                </div>
              </div>
            </div>
            <img className="image-feed-home" src={"images/eLuiSounds.jpeg"} />
            <a className="visita-post-button" href="/artists/soundsmusicitalia">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>
          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/mirkoegiorgia.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Il Luogo Segreto</p>
                  <p className="ruolo-utente-feed">Mirko e Giorgia</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/ilLuogoSegretoMirkoeGiorgia.jpeg"}
            />
            <a className="visita-post-button" href="/artists/mirkoegiorgia">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>
          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/truedevotion.webp"}
                />
                <div>
                  <p className="nome-utente-feed">In Terra Come in Cielo</p>
                  <p className="ruolo-utente-feed">True Devotion</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/inTerraComeInCieloTrueDevotion.jpeg"}
            />
            <a className="visita-post-button" href="/artists/truedevotion">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>

          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/timoteopepe.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Luogo Sacro</p>
                  <p className="ruolo-utente-feed">Timoteo Pepe</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/LuogoSacroTimoteoPepe.jpeg"}
            />
            <a className="visita-post-button" href="/artists/timoteopepe">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>

          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/davidedilecce.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Offro a te</p>
                  <p className="ruolo-utente-feed">Davide Di Lecce</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/offroaTeDavideDiLecce.png"}
            />
            <a className="visita-post-button" href="/artists/davidedilecce">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>
          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/davidedilecce.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Voglio bruciare per Te</p>
                  <p className="ruolo-utente-feed">Davide Di Lecce</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/voglioBruciareDavideDiLecce.jpeg"}
            />
            <a className="visita-post-button" href="/artists/davidedilecce">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>
          <div className="image-feed-div-home card-v1">
            <div className="content-feed">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/mirkoegiorgia.webp"}
                />
                <div>
                  <p className="nome-utente-feed">Più sto con Te</p>
                  <p className="ruolo-utente-feed">Mirko e Giorgia</p>
                </div>
              </div>
            </div>
            <img
              className="image-feed-home"
              src={"images/piuStoConTeMirkoeGiorgia.jpeg"}
            />
            <a className="visita-post-button" href="/artists/mirkoegiorgia">
              <div className="button-feed">
                <p>Testi e Accordi</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
