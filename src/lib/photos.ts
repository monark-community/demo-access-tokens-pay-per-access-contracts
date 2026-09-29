import type { StaticImageData } from "next/image"

import lockers from "../../public/images/lockers-teal.jpg"
import stream from "../../public/images/livestream-phone.jpg"
import pottery from "../../public/images/pottery-wheel.jpg"
import studio from "../../public/images/studio-on-air.jpg"

/** Unsplash photos (free licence), credited on /credits and in docs/assets.md. */
export interface Photo {
  src: StaticImageData
  alt: { en: string; fr: string }
  photographer: string
  profile: string
  page: string
  use: { en: string; fr: string }
}

export const PHOTOS: Record<string, Photo> = {
  studio: {
    src: studio,
    alt: {
      en: "Two studio doors, each with a lit ON AIR sign above it",
      fr: "Deux portes de studio, chacune sous un panneau ON AIR allumé",
    },
    photographer: "Austin",
    profile: "https://unsplash.com/@austin_7792",
    page: "https://unsplash.com/photos/two-on-air-signs-above-studio-doors-9bkv_bFBkhA",
    use: { en: "Studio B gate cover, home page", fr: "Couverture de l'accès Studio B, accueil" },
  },
  stream: {
    src: stream,
    alt: {
      en: "A phone filming a guitarist singing on a warmly lit stage",
      fr: "Un téléphone filme un guitariste qui chante sur une scène à la lumière chaude",
    },
    photographer: "Quilia",
    profile: "https://unsplash.com/@heyquilia",
    page: "https://unsplash.com/photos/person-taking-photo-of-man-playing-guitar-aakpiFHR5t8",
    use: { en: "Rooftop session gate cover and player, home page", fr: "Couverture et lecteur de la session sur le toit, accueil" },
  },
  pottery: {
    src: pottery,
    alt: {
      en: "A potter shaping clay on a wheel, surrounded by tools and fresh pots",
      fr: "Une potière façonne l'argile au tour, entourée d'outils et de pots frais",
    },
    photographer: "Laura Tommasina",
    profile: "https://unsplash.com/@lauratommphoto",
    page: "https://unsplash.com/photos/woman-shaping-clay-on-a-pottery-wheel-Wksd6I6mSkw",
    use: { en: "Wood kiln course gate cover, home page", fr: "Couverture du cours sur le four à bois, accueil" },
  },
  lockers: {
    src: lockers,
    alt: {
      en: "A row of teal metal lockers with built-in locks",
      fr: "Une rangée de casiers métalliques sarcelle avec serrures intégrées",
    },
    photographer: "Shane",
    profile: "https://unsplash.com/@theyshane",
    page: "https://unsplash.com/photos/gray-steel-locker-with-padlock-LLAz0_wudTo",
    use: { en: "Tool locker 14 gate cover, home page", fr: "Couverture du casier à outils 14, accueil" },
  },
}
