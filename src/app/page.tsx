import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <section className="header-homepage">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <a
            href="#"
            className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            role="alert"
          >
            <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
              New
            </span>{" "}
            <span className="text-sm font-medium">
              Organizza la tua chiesa con ChurchLab
            </span>
            <svg
              className="ml-2 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl">
            Risorse per la Chiesa
          </h1>
          <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            Organizza il tuo worship team!
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <a
              href="/songs"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Canzoni
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
            </a>
            {/* <a href="https://www.captayn.com/en" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                Lasciati Ispirare
            </a>   */}
            <Link href="https://www.captayn.com/en"></Link>
          </div>
        </div>
      </section>

      <div className="explore-section">
        <h2>Artisti Italiani</h2>
        <div className="explore-container">
          <Link href="/artists/sdvworship">
            <div className="exp-c-1 explore-card card-v2">
              <div className="title-exp-card">
                <p className="title-card">SDV Worship</p>
                <div className="explore-arrow">
                <img src="/images/icons/arrowC.png" alt="more" className="icon" />
                </div>
              </div>
              <img className="exp-c-image" src={"images/sdv-Worship.jpg"} />
            </div>
          </Link>
          <Link href="/artists/mirkoegiorgia">
            <div className="exp-c-2 explore-card card-v2">
              <div className="title-exp-card">
                <p className="title-card">Mirko e Giorgia</p>
                <div className="explore-arrow">
                  <img src="/images/icons/arrowC.png" alt="more" className="icon" />
                </div>
              </div>
              <img className="exp-c-image" src={"images/mirkoeGiorgia.webp"} />
            </div>
          </Link>
          <Link href="/artists/soundsmusicitalia">
            <div className="exp-c-3 explore-card card-v2">
              <div className="title-exp-card">
                <p className="title-card">Sounds</p>
                <div className="explore-arrow">
                <img src="/images/icons/arrowC.png" alt="more" className="icon" />
                </div>
              </div>
              <img className="exp-c-image" src={"images/Sounds.jpg"} />
            </div>
          </Link>
          <Link href="/artists/truedevotion">
            <div className="exp-c-4 explore-card card-v2">
              <div className="title-exp-card">
                <p className="title-card">True Devotion</p>
                <div className="explore-arrow">
                <img src="/images/icons/arrowC.png" alt="more"  className="icon" />
                </div>
              </div>
              <img className="exp-c-image" src={"images/true-devotion.jpg"} />
            </div>
          </Link>
        </div>
      </div>

      <div className="visita-feed-section">
        <h1>Album e Singoli</h1>
        <h5>Le ultime uscite</h5>
        <div className="visita-feed-container">
          <div className="image-feed-div-home card-v1">
            <div className="content-feed ">
              <div className="titolo-feed">
                <img
                  className="profile-pic-feed-post"
                  src={"images/CuorePuroSDVWorship.jpeg"}
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
                  src={"images/Sounds.jpg"}
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
                  src={"images/mirkoeGiorgia.webp"}
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
                  src={"images/true-devotion.jpg"}
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
                  src={"images/timoteo-pepe.jpeg"}
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
                  src={"images/davidedilecce.png"}
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
                  src={"images/davidedilecce.png"}
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
                  src={"images/mirkoeGiorgia.webp"}
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
