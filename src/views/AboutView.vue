<template>
  <div class="relative min-h-screen mx-auto px-8 md:px-0">
    <!-- TOP -->
    <div class="text-black flex flex-col lg:flex-row">
      <div class="w-1/2 border-r-1 border-b border-black h-full">
        <img :src="imageOne" alt="photo léa" class="w-full h-full object-cover" />
      </div>
      <div class="w-1/2 pt-50 px-40">
        <p class="text-5xl font-titles">Ferme de la Rougeraie</p>

        <div class="text-md mt-6 space-y-4">
          <p>
            Notre ferme familiale possède deux activités de production : un atelier d'une trentaine
            de vaches laitières en circuit long (lait livré à Biolait) et un atelier de maraîchage
            diversifié en circuit court avec vente à la ferme. La surface est d'environ 45 Ha, toute
            en prairies permanentes et entourées de haies anciennes ou plantées par nos soins. En
            effet, la préservation et l'amélioration de la biodiversité font partie de nos
            préoccupations. L'ensemble de la surface est certifiée en agriculture biologique depuis
            2008.
          </p>

          <p>
            Nous cultivons des légumes diversifiés et de saison, la majorité étant en plein champ
            mais une partie est cultivée sous serre, principalement pour les légumes fruits d'été et
            les légumes feuilles d'hiver et de printemps. Tous les légumes sont cultivés en pleine
            terre, ce qui permet une meilleure qualité gustative.
          </p>

          <p>
            Nous vous proposons ces légumes toute l'année, sauf entre mi-février et mi-avril où nous
            arrêtons les ventes pour préparer la nouvelle saison. Les congés occasionnels sont
            annoncés à l'avance. Le magasin se trouve dans le bâtiment de la ferme.
          </p>
        </div>
      </div>
    </div>

    <!-- BOTTOM -->
    <div class="flex flex-col-reverse lg:flex-row border-b border-t border-black h-full">
      <div class="text-black text-md flex-1 w-1/2">
        <div class="px-40 pt-20">
          <div class="flex items-center gap-4 mb-3">
            <h2 class="text-2xl font-bold whitespace-nowrap">POINTS DE VENTE</h2>
            <div class="flex-1 h-px bg-black"></div>
          </div>
          <p class="font-medium">LANOUEE - Ferme de la Rougeraie</p>
          <p class="font-medium text-md mb-3">
            Mardi et Vendredi de <span class="font-roboto"> 16h00 à 19h00</span>
          </p>

          <div class="text-md space-y-4">
            <p>
              La liste des légumes disponibles avec leur prix est mise à jour chaque début de
              semaine. Vous avez jusqu'à 21h la veille du jour de vente pour passer une
              pré-commande. Le montant est indicatif et peut légèrement être ajusté à la réalité du
              poids des légumes. Le règlement se fait à la réception, les jours de vente où il est
              possible de modifier ou de compléter sa commande. Venir avec son panier.
            </p>
            <p>
              Nos légumes sont également servis à la cantine scolaire de Lanouée, dans les plats du
              restaurant « Chez Simon » à Josselin ainsi que sur les pizzas de Mowgli Pizz' à
              Lanouée, chaque vendredi.
            </p>
          </div>
        </div>
      </div>
      <div
        class="flex-1 flex justify-end lg:justify-end mx-auto lg:mx-0 w-1/2 border-l-1 border-black h-full"
      >
        <img :src="imageTwo" alt="photo léa au marché" class="w-full object-cover" />
      </div>
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="flex flex-col items-center justify-center text-center leading-none mt-10">
        <img class="h-[110px] sm:h-[130px]" :src="imageLogo" alt="logo" />
        <p class="mt-4 sm:text-sm">© Ferme de la Rougeraie - 06 83 34 13 70</p>

        <div class="mt-2">
          <AboutInformations />
        </div>

        <div
          class="flex gap-5 m-0 mt-3 sm:flex-row flex-col sm:gap-5 gap-0 sm:text-base text-sm leading-none"
        >
          <p>
            Réalisation :
            <a href="https://www.linkedin.com/in/thomaslecam/" class="underline">Thomas Le Cam</a>
          </p>
          <p>Illustrations : Matthieu Le Meur</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AboutInformations from '../components/about/AboutInformations.vue'
import imageOne from '/assets/about/about-image-one.jpg'
import imageTwo from '/assets/about/about-image-two.jpg'
import imageLogo from '/assets/about/logo.png'
</script>
