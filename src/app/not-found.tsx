import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
      <p className="text-2xl md:text-3xl font-semibold mt-4 mb-6 text-gray-700">
        Ops! Pagina non trovata.
      </p>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        La pagina che stai cercando potrebbe essere stata rimossa o non è
        disponibile al momento.
      </p>
      <Link href="/">Torna alla home</Link>
    </div>
  );
}
