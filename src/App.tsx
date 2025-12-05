// App.tsx
import { useState } from "react";
import Game from "./Game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3d2f47] via-[#1b0f27] to-[#683e79] text-white font-sans overflow-hidden">
        <div className="relative container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
          {/* Header avec logo à gauche et titre */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 md:mb-12">
            {/* Logo abeille animé - Déplacé à gauche */}
            <div className="w-full md:w-auto">
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0">
                {/* Cercle principal */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#F6D464] via-[#F6A55A] to-[#F37CCF] rounded-full animate-spin-slow"
                  role="presentation"
                  aria-hidden="true"
                />

                {/* Rayons */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-2 bg-gradient-to-r from-transparent via-[#8A3FF7] to-transparent rounded-full animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-45">
                  <div className="w-full h-2 bg-gradient-to-r from-transparent via-[#1A84D9] to-transparent rounded-full animate-pulse delay-300" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-90">
                  <div className="w-full h-2 bg-gradient-to-r from-transparent via-[#F6D464] to-transparent rounded-full animate-pulse delay-600" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-135">
                  <div className="w-full h-2 bg-gradient-to-r from-transparent via-[#F37CCF] to-transparent rounded-full animate-pulse delay-900" />
                </div>

                {/* Cercle central */}
                <div className="absolute inset-8 md:inset-10 bg-gradient-to-br from-[#0057A4] via-[#1A84D9] to-[#8A3FF7] rounded-full flex items-center justify-center">
                  <div className="text-3xl md:text-4xl font-bold">VN</div>
                </div>

                {/* Points décoratifs */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-r from-[#8A3FF7] to-[#1A84D9] rounded-full animate-bounce" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-r from-[#F6D464] to-[#F6A55A] rounded-full animate-bounce delay-300" />
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-r from-[#F37CCF] to-[#8A3FF7] rounded-full animate-bounce delay-600" />
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-r from-[#1A84D9] to-[#0057A4] rounded-full animate-bounce delay-900" />
              </div>
            </div>

            {/* Titre principal - A droite du logo sur desktop */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-[#F6D464] via-[#F37CCF] to-[#8A3FF7] bg-clip-text text-transparent">
                  Village Numérique
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#8A3FF7] via-[#1A84D9] to-[#0057A4] bg-clip-text text-transparent">
                  Résistant
                </span>
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-2xl">
                Un jeu éducatif pour comprendre les enjeux du numérique durable à l'école
              </p>
            </div>
          </header>

          {/* Contenu principal au centre */}
          <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
            {/* Section d'introduction */}
            <section className="w-full mb-10 md:mb-16">
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-3 text-[#F6D464]"> Objectif</h3>
                  <p className="text-white/80">
                    Construisez un village numérique résilient en prenant des décisions éclairées.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-3 text-[#8A3FF7]"> Écologique</h3>
                  <p className="text-white/80">
                    Apprenez les bonnes pratiques pour un numérique durable et responsable.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-3 text-[#1A84D9]"> Éducatif</h3>
                  <p className="text-white/80">
                    Conçu spécialement pour le milieu scolaire avec des scénarios réalistes.
                  </p>
                </div>
              </div>
            </section>

            {/* Bouton principal d'action */}
            <section className="text-center w-full">
              <button
                onClick={() => setGameStarted(true)}
                className="group relative px-10 md:px-16 py-5 md:py-7 bg-gradient-to-r from-[#F6D464] via-[#F6A55A] to-[#F37CCF] text-[#0A2540] font-bold rounded-xl md:rounded-2xl text-xl md:text-2xl hover:shadow-2xl hover:shadow-[#F37CCF]/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden focus:outline-none focus:ring-4 focus:ring-[#F6D464]/50"
                aria-label="Commencer le jeu Village Numérique Résistant"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative flex items-center justify-center space-x-4 md:space-x-6">
                  <span className="font-bold">Commencer l'Aventure</span>
                  <div className="text-2xl md:text-3xl animate-bounce group-hover:animate-none" aria-hidden="true">
                    →
                  </div>
                </div>
              </button>

              {/* Texte d'instructions */}
              <p className="mt-6 text-white/60 text-sm md:text-base">
                Cliquez sur le bouton pour démarrer votre voyage vers un numérique responsable
              </p>
            </section>
          </main>

          {/* Footer */}
          <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="text-sm text-white/60 mb-2">Basé sur la démarche</div>
                <a
                  href="https://nird.forge.apps.education.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F6D464] hover:text-[#F6A55A] transition-colors font-semibold text-lg focus:outline-none focus:underline"
                >
                  NIRD - Numérique Identique Résilient et Durable
                </a>
                <p className="text-sm text-white/60 mt-2">
                  Une approche innovante pour un numérique plus responsable
                </p>
              </div>

              <div className="text-sm text-white/60 text-center md:text-right max-w-md">
                <p>
                  Ce jeu éducatif a été conçu pour sensibiliser aux enjeux
                  environnementaux et sociaux du numérique dans le contexte scolaire.
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center text-white/40 text-sm">
              <p>© {new Date().getFullYear()} Village Numérique Résistant - Tous droits réservés</p>
            </div>
          </footer>
        </div>

        {/* Animation de styles pour la rotation lente */}
        <style>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          /* Amélioration de l'accessibilité */
          @media (prefers-reduced-motion: reduce) {
            .animate-spin-slow,
            .animate-pulse,
            .animate-bounce {
              animation: none;
            }
          }
        `}</style>
      </div>
    );
  }

  return <Game />;
}

export default App;