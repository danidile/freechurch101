"use client";

export default function FooterCL() {
  return (
    <footer className="bg-white w-full">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left border-t border-slate-200">
        <small className="text-zinc-500 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} ChurchLab. Tutti i diritti
          riservati.
        </small>
        <div className="flex space-x-6 text-zinc-500">
          <a
            href="/privacy-policy"
            className="hover:text-indigo-600 transition-colors"
          >
            <p>Privacy</p>
          </a>
          <a href="/terms" className="hover:text-indigo-600 transition-colors">
             <p>Termini</p>
          </a>
          <a
            href="mailto:info@churchlab.com"
            className="hover:text-indigo-600 transition-colors"
          >
             <p>Supporto</p>
          </a>
        </div>
      </div>
    </footer>
  );
}
