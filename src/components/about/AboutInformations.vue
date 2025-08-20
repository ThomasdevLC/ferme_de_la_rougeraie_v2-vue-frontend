<template>

  <div class="">
    <nav>
      <ul
        class="flex justify-center items-center list-none p-0 m-0 gap-5"
      >
        <li class="mb-5 2xl:mb-0 2xl:pb-2">
          <a
            href="https://www.google.com/maps/place/Ferme+de+la+Rougeraie/@47.9659359,-2.5786985,17z/data=!4m14!1m7!3m6!1s0x480fd17bd0d61589:0x327caef9255f9739!2sFerme+de+la+Rougeraie!8m2!3d47.9659323!4d-2.5761236!16s%2Fg%2F11nwwr5hmv!3m5!1s0x480fd17bd0d61589:0x327caef9255f9739!8m2!3d47.9659323!4d-2.5761236!16s%2Fg%2F11nwwr5hmv?authuser=0"
            target="_blank"
          >
            <img :src="imageGmap" alt="localisation" class="block w-10 sm:w-[30px]" />
          </a>
        </li>
        <li class="mb-5 2xl:mb-0 2xl:pb-2">
          <a href="https://www.instagram.com/fermedelarougeraie/" target="_blank">
            <img :src="imageInsta" alt="Instagram" class="block w-10 sm:w-[30px]" />
          </a>
        </li>
        <li class="mb-5 2xl:mb-0 2xl:pb-2">
          <a
            href="https://www.facebook.com/people/Ferme-de-La-Rougeraie/100077586669860/"
            target="_blank"
          >
            <img :src="imageFaceb" alt="Facebook" class="block w-10 sm:w-[30px]" />
          </a>
        </li>
        <li class="mb-5 2xl:mb-0 2xl:pb-2">
          <a href="mailto:fermedelarougeraie@gmail.com" target="_blank">
            <img :src="imageEmail" alt="email" class="block w-10 sm:w-[30px]" />
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import imageGmap from '/assets/about/loc.png'
import imageInsta from '/assets/about/instagram.png'
import imageFaceb from '/assets/about/facebook.png'
import imageEmail from '/assets/about/email.png'

</script>
