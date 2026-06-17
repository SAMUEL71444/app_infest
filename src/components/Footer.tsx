export default function Footer() {
  return (
    <footer className="border-t border-surface-800/50 bg-surface-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-3">
              Prediksi Keberhasilan UMKM
            </h3>
            <p className="text-sm text-surface-400 leading-relaxed">
              Dashboard analisis hasil riset data science untuk memprediksi
              keberhasilan UMKM di Indonesia.
            </p>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
              Metodologi
            </h4>
            <ul className="space-y-2 text-sm text-surface-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                1.792 konfigurasi model diuji
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                Stratified 5-Fold Cross Validation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                Oblivious Gradient-Boosted Tree
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                TVAE Augmentation for Robustness
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
              Tautan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.kaggle.com/code/andreasedo/notebook-infest-yaudahlahya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.238-.036.27l-6.555 6.344 6.836 8.507c.095.104.117.208.075.322z"/>
                  </svg>
                  Kaggle Notebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-800/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Team */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-surface-400">
              <span className="font-medium text-surface-300">Tim Peneliti:</span>
              <span>Andreas Edward Putra Jatmiko</span>
              <span className="hidden md:inline text-surface-600">·</span>
              <span>Laura Marcella Pratama</span>
              <span className="hidden md:inline text-surface-600">·</span>
              <span>Komang Samuel Arie Wicaksana</span>
            </div>

            {/* Event */}
            <div className="text-sm text-surface-500">
              DSC INFEST 2026 — BINUS University
            </div>
          </div>

          {/* Source */}
          <p className="text-center text-xs text-surface-600 mt-6">
            Sumber: 1.792 konfigurasi model via Stratified 5-Fold Cross Validation
            &nbsp;·&nbsp; Semua data ditampilkan apa adanya dari hasil eksperimen
          </p>
        </div>
      </div>
    </footer>
  );
}
