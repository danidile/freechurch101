"use client";
import Image from "next/image";
import { Button } from "@heroui/react";
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
} from "react-icons/fa";
import { useState } from "react";

// --- Data for Content Sections ---

const allFeatures = [
  {
    icon: <FaRegCalendarAlt size={32} />,
    title: "Pianificazione Intuitiva",
    desc: "Crea e condividi scalette dettagliate per ogni servizio in pochi minuti.",
  },
  {
    icon: <FaMusic size={32} />,
    title: "Archivio Canti Centralizzato",
    desc: "Gestisci testi e accordi. Trasponi le tonalità con un solo click.",
  },
  {
    icon: <FaUsers size={32} />,
    title: "Gestione Semplice dei Team",
    desc: "Organizza i turni dei volontari e invia promemoria automatici.",
  },
  {
    icon: <FaHandsHelping size={32} />,
    title: "Ruoli e Squadre Definiti",
    desc: "Assegna responsabilità chiare per una collaborazione impeccabile.",
  },
  {
    icon: <FaGlobe size={32} />,
    title: "Accesso Cloud Ovunque",
    desc: "Sincronizza i dati e accedi alla piattaforma da qualsiasi dispositivo.",
  },
  {
    icon: <FaSmile size={32} />,
    title: "Design Facile e Pulito",
    desc: "Un’interfaccia che non richiede formazione, pensata per essere usata subito.",
  },
];

const testimonials = [
  {
    quote:
      "ChurchLab ha trasformato il modo in cui prepariamo i nostri servizi. La pianificazione è diventata un piacere, non un peso. Assolutamente indispensabile!",
    name: "Marco Rossi",
    role: "Worship Leader",
  },
  {
    quote:
      "Finalmente uno strumento che capisce le esigenze della nostra chiesa. Gestire i volontari non è mai stato così semplice e organizzato. Lo consiglio a tutti.",
    name: "Pastore Davide Conti",
    role: "Pastore Principale",
  },
];

const faqData = [
  {
    question: "ChurchLab è gratuito?",
    answer:
      "Sì! Offriamo un piano gratuito completo che è perfetto per le piccole chiese. Per le organizzazioni più grandi con esigenze avanzate, offriamo piani a pagamento convenienti.",
  },
  {
    question: "I miei dati sono al sicuro?",
    answer:
      "Assolutamente. La sicurezza è la nostra massima priorità. Utilizziamo crittografia standard del settore e best practice per garantire che i dati della tua chiesa siano sempre al sicuro.",
  },
  {
    question: "Posso importare i miei canti esistenti?",
    answer:
      "Sì, stiamo lavorando a strumenti di importazione per aiutarti a trasferire facilmente il tuo archivio di canti esistente sulla nostra piattaforma.",
  },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-slate-50 text-zinc-800 font-sans scroll-smooth">
      {/* --- Navbar --- */}

      <main>
        {/* --- Hero Section --- */}
        <section className="relative">
          <div className="max-w-6xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 py-24 md:py-32">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 mb-6 leading-tight">
                La Tua Chiesa, <br />
                <span className="text-indigo-600">Sempre Organizzata</span>
              </h1>
              <p className="text-lg text-zinc-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Una piattaforma completa per pianificare servizi, gestire team e
                coordinare volontari, tutto in cloud.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  variant="solid"
                  size="lg"
                  as="a"
                  href="/login"
                  color="primary"
                >
                  Inizia Gratuitamente
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  as="a"
                  href="#features"
                  className="text-indigo-600"
                >
                  Scopri di più
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="/images/mockupIphone.webp"
                alt="ChurchLab App on a phone"
                width={450}
                height={450}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="bg-white py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                Una Piattaforma Progettata per Te
              </h2>
              <p className="text-lg text-zinc-600 mt-4 max-w-3xl mx-auto leading-relaxed">
                Semplifica la gestione della tua comunità con strumenti potenti
                e facili da usare.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {allFeatures.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-indigo-600 mb-4">{item.icon}</div>
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
        <section className="py-24 md:py-32">
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
                  Registrati gratuitamente in meno di un minuto. Nessuna carta
                  di credito richiesta.
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

        {/* --- Testimonials Section (NEW) --- */}
        <section id="testimonials" className="bg-white py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                Cosa Dicono le Chiese Che Ci Usano
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="flex flex-col items-center text-center"
                >
                  <FaQuoteLeft className="text-indigo-200 w-12 h-12 mb-4" />
                  <blockquote className="text-lg text-zinc-600 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <figcaption className="mt-6">
                    <div className="font-semibold text-zinc-800">
                      {testimonial.name}
                    </div>
                    <div className="text-zinc-500 text-sm">
                      {testimonial.role}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* --- FAQ Section (NEW) --- */}
        <section id="faq" className="py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                Domande Frequenti
              </h2>
            </div>
            <div className="space-y-8">
              {faqData.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-lg text-zinc-800">
                    {item.question}
                  </h3>
                  <p className="text-zinc-600 mt-2 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Final CTA Section (NEW) --- */}
        <section className="bg-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-6 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Pronto a Semplificare l'Organizzazione della Tua Chiesa?
            </h2>
            <p className="text-indigo-200 text-lg mt-4 mb-8 leading-relaxed">
              Unisciti a centinaia di chiese che hanno scelto di lavorare in
              modo più intelligente. Inizia oggi, è gratis.
            </p>
            <Button
              as="a"
              href="/login"
              variant="solid"
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-100"
            >
              Crea il Tuo Account Gratuito
            </Button>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left border-t border-slate-200">
          <div className="text-zinc-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ChurchLab. Tutti i diritti
            riservati.
          </div>
          <div className="flex space-x-6 text-zinc-500">
            <a
              href="/privacy-policy"
              className="hover:text-indigo-600 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-indigo-600 transition-colors"
            >
              Termini
            </a>
            <a
              href="mailto:info@churchlab.com"
              className="hover:text-indigo-600 transition-colors"
            >
              Supporto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
