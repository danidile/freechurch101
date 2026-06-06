import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  LuAppWindow,
  LuCalendarRange,
  LuGlobe,
  LuHandshake,
} from "react-icons/lu";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { FaAsterisk } from "react-icons/fa";
import ArtistCards from "./components/ArtistCards";
import PWAInstallButton from "./components/PWAInstallButton";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const allFeatures = [
    {
      icon: <LuCalendarRange size={32} />,
      title: t("features.items.0.title"),
      desc: t("features.items.0.desc"),
    },
    {
      icon: <MdOutlineLibraryMusic size={32} />,
      title: t("features.items.1.title"),
      desc: t("features.items.1.desc"),
    },
    {
      icon: <FaAsterisk size={32} />,
      title: t("features.items.2.title"),
      desc: t("features.items.2.desc"),
    },
    {
      icon: <LuHandshake size={32} />,
      title: t("features.items.3.title"),
      desc: t("features.items.3.desc"),
    },
    {
      icon: <LuGlobe size={32} />,
      title: t("features.items.4.title"),
      desc: t("features.items.4.desc"),
    },
    {
      icon: <LuAppWindow size={32} />,
      title: t("features.items.5.title"),
      desc: t("features.items.5.desc"),
    },
  ];

  const artists = [
    {
      key: "sdvworship",
      colSpan: "col-span-12 sm:col-span-4",
      name: t("artists.items.sdvworship"),
      cta: t("artists.cta"),
    },
    {
      key: "mirkoegiorgia",
      colSpan: "col-span-12 sm:col-span-4",
      name: t("artists.items.mirkoegiorgia"),
      cta: t("artists.cta"),
    },
    {
      key: "soundsmusicitalia",
      colSpan: "col-span-12 sm:col-span-4",
      name: t("artists.items.soundsmusicitalia"),
      cta: t("artists.cta"),
    },
    {
      key: "nicobattaglia",
      colSpan: "w-full col-span-12 sm:col-span-5",
      name: t("artists.items.nicobattaglia"),
      cta: t("artists.cta"),
    },
    {
      key: "truedevotion",
      colSpan: "w-full col-span-12 sm:col-span-7",
      name: t("artists.items.truedevotion"),
      cta: t("artists.cta"),
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="header-homepage flex flex-row-reverse justify-center items-center md:flex-row">
        <div className="lg:w-1/4 block md:hidden pt-8">
          <Image
            src="/images/mockupIphone.webp"
            alt={t("hero.imageAlt")}
            width={400}
            className="max-h-[30vh] object-contain"
            height={400}
          />
        </div>
        <div className="py-8 px-2 max-w-(--breakpoint-lg) lg:py-16 lg:px-12">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-lg mb-8 max-w-(--breakpoint-sm)">
            {t("hero.sub")}
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <PWAInstallButton />
          </div>
        </div>
        <div className="lg:w-1/4 hidden md:block">
          <Image
            src="/images/mockupIphone.webp"
            alt={t("hero.imageAlt")}
            width={400}
            height={400}
          />
        </div>
      </section>

      {/* ARTISTS */}
      <div className="pb-5 pt-10 text-center">
        <h2>{t("artists.title")}</h2>
      </div>
      <ArtistCards artists={artists} />

      {/* TEAM SECTION */}
      <div className="visita-feed-section px-4 py-6">
        <h1 className="text-center my-6">{t("team.title")}</h1>
        <p className="text-center my-4 max-w-[1000px]">{t("team.sub")}</p>
        <Image
          src="/images/event.webp"
          alt={t("team.imageAlt")}
          className="rounded-lg nborder"
          width={1000}
          height={400}
        />
      </div>

      {/* FEATURES */}
      <section id="features" className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
              {t("features.title")}
            </h2>
            <p className="text-lg text-zinc-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              {t("features.sub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {allFeatures.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4">{item.icon}</div>
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

      {/* STEPS */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
              {t("steps.title")}
            </h2>
            <p className="text-lg text-zinc-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              {t("steps.sub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                  {t(`steps.items.${i}.title`)}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {t(`steps.items.${i}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <div className="visita-feed-section px-4 py-6">
        <h2 className="text-center">{t("calendar.title")}</h2>
        <p className="text-center my-4 max-w-[1000px]">{t("calendar.sub")}</p>
        <Image
          src="/images/calendar.webp"
          alt={t("calendar.imageAlt")}
          className="rounded-lg nborder"
          width={1000}
          height={400}
        />
      </div>
    </>
  );
}
