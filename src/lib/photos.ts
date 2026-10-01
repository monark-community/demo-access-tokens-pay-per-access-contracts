import type { StaticImageData } from "next/image"

import tennis from "../../public/images/tennis-court.jpg"
import tennisGate from "../../public/images/tennis-gate.jpg"
import tennisPlay from "../../public/images/tennis-play.jpg"
import hoops from "../../public/images/hoops-court.jpg"
import hoopsFence from "../../public/images/hoops-fence.jpg"
import hoopsPlay from "../../public/images/hoops-play.jpg"
import diamond from "../../public/images/diamond-field.jpg"
import diamondDugout from "../../public/images/diamond-dugout.jpg"
import diamondPlay from "../../public/images/diamond-play.jpg"
import studio from "../../public/images/studio-cool.jpg"
import studio2 from "../../public/images/studio-desk.jpg"
import studio3 from "../../public/images/studio-door.jpg"
import stream from "../../public/images/livestream-cool.jpg"
import stream2 from "../../public/images/stream-session.jpg"
import stream3 from "../../public/images/stream-audience.jpg"
import pottery from "../../public/images/pottery-wheel.jpg"
import pottery2 from "../../public/images/pottery-kiln.jpg"
import pottery3 from "../../public/images/pottery-shelf.jpg"
import lockers from "../../public/images/lockers-teal.jpg"
import lockers2 from "../../public/images/lockers-room.jpg"
import lockers3 from "../../public/images/lockers-electronic.jpg"
import smartLock from "../../public/images/smart-lock-keypad.jpg"
import ownerCamille from "../../public/images/owner-camille.jpg"
import ownerNoor from "../../public/images/owner-noor.jpg"

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
  tennis: {
    src: tennis,
    alt: {
      en: "Outdoor hard tennis court seen past the net post, with a chain-link fence along the far side",
      fr: "Court de tennis extérieur vu derrière le poteau du filet, bordé d'une clôture grillagée",
    },
    photographer: "Fei Chao",
    profile: "https://unsplash.com/@fei_chao3",
    page: "https://unsplash.com/photos/a-tennis-court-with-two-tennis-players-on-it-8YCl4td7PvM",
    use: { en: "Riverside tennis court 2, home page", fr: "Court de tennis 2 de Riverside, accueil" },
  },
  tennisGate: {
    src: tennisGate,
    alt: {
      en: "Weathered mint-green gate in a chain-link fence, chained shut with a padlock",
      fr: "Portail vert menthe usé dans une clôture grillagée, fermé par une chaîne et un cadenas",
    },
    photographer: "Jason Mavrommatis",
    profile: "https://unsplash.com/@jasonblackeye",
    page: "https://unsplash.com/photos/8yYAaguVDgY",
    use: { en: "Riverside tennis court 2, home page", fr: "Court de tennis 2 de Riverside, accueil" },
  },
  tennisPlay: {
    src: tennisPlay,
    alt: {
      en: "Players on a blue hard court, softly blurred behind a green chain-link fence",
      fr: "Joueurs sur un court bleu, flous derrière une clôture grillagée verte",
    },
    photographer: "Invisible",
    profile: "https://unsplash.com/@invisiblelity",
    page: "https://unsplash.com/photos/tennis-court-behind-green-chain-link-fence-FwBjkf0If3s",
    use: { en: "Riverside tennis court 2, home page", fr: "Court de tennis 2 de Riverside, accueil" },
  },
  hoops: {
    src: hoops,
    alt: {
      en: "Outdoor basketball hoop on a blue pole inside a tall chain-link fence, trees and sky behind",
      fr: "Panier de basketball extérieur sur poteau bleu, entouré d'une haute clôture grillagée, arbres et ciel en arrière-plan",
    },
    photographer: "chris wang",
    profile: "https://unsplash.com/@chriswtr",
    page: "https://unsplash.com/photos/basketball-hoop-against-a-blue-sky-with-trees-Um_3lsOzLpE",
    use: { en: "Pine St. basketball cage", fr: "Cage de basketball de la rue Pine" },
  },
  hoopsFence: {
    src: hoopsFence,
    alt: {
      en: "Basketball hoop seen through the out-of-focus links of a green chain-link fence",
      fr: "Panier de basketball vu à travers les mailles floues d'une clôture grillagée verte",
    },
    photographer: "Joey Han",
    profile: "https://unsplash.com/@bweeman",
    page: "https://unsplash.com/photos/basketball-hoop-seen-through-a-chain-link-fence-_CMdRBtL0kk",
    use: { en: "Pine St. basketball cage", fr: "Cage de basketball de la rue Pine" },
  },
  hoopsPlay: {
    src: hoopsPlay,
    alt: {
      en: "Pickup basketball game on an outdoor court in bright, hazy daylight with long shadows",
      fr: "Partie de basketball improvisée sur un terrain extérieur, lumière vive et voilée, longues ombres",
    },
    photographer: "Steven Abraham",
    profile: "https://unsplash.com/@stevenabraham",
    page: "https://unsplash.com/photos/fkWtCoij4e0",
    use: { en: "Pine St. basketball cage", fr: "Cage de basketball de la rue Pine" },
  },
  diamond: {
    src: diamond,
    alt: {
      en: "Baseball field behind a tall chain-link backstop, with a misty city skyline in the distance",
      fr: "Terrain de baseball derrière un haut grillage d'arrêt, silhouette brumeuse de la ville au loin",
    },
    photographer: "Fr0ggy5",
    profile: "https://unsplash.com/@fr0ggy5_fr0ggy5",
    page: "https://unsplash.com/photos/mWEScmcfTcQ",
    use: { en: "Diamond 3 baseball field, home page", fr: "Terrain de baseball Losange 3, accueil" },
  },
  diamondDugout: {
    src: diamondDugout,
    alt: {
      en: "Fenced dugout bench beside a baseball field, with a pine tree and clear blue sky",
      fr: "Abri des joueurs grillagé avec banc, en bordure d'un terrain de baseball, sous un ciel bleu",
    },
    photographer: "Ryan Ancill",
    profile: "https://unsplash.com/@ryanancill",
    page: "https://unsplash.com/photos/nYqGHKBF5KQ",
    use: { en: "Diamond 3 baseball field, home page", fr: "Terrain de baseball Losange 3, accueil" },
  },
  diamondPlay: {
    src: diamondPlay,
    alt: {
      en: "Youth baseball game: a boy in a red helmet swings at the plate while the catcher crouches behind",
      fr: "Match de baseball junior : un garçon au casque rouge s'élance au marbre, le receveur accroupi derrière lui",
    },
    photographer: "Annie Spratt",
    profile: "https://unsplash.com/@anniespratt",
    page: "https://unsplash.com/photos/a-group-of-young-boys-playing-a-game-of-baseball-V7GckEQSbPQ",
    use: { en: "Diamond 3 baseball field, home page", fr: "Terrain de baseball Losange 3, accueil" },
  },
  studio: {
    src: studio,
    alt: {
      en: "Broadcast microphone with a pop filter in a shock mount against a slate-grey wall",
      fr: "Microphone de studio avec filtre anti-pop sur suspension, devant un mur gris ardoise",
    },
    photographer: "Dan LeFebvre",
    profile: "https://unsplash.com/@danlefeb",
    page: "https://unsplash.com/photos/TV7HJIRjMiY",
    use: { en: "Studio B rehearsal room, home page", fr: "Local de répétition Studio B, accueil" },
  },
  studio2: {
    src: studio2,
    alt: {
      en: "Two hosts talk at a radio studio desk with microphones on boom arms, a mixing console and monitors",
      fr: "Deux animateurs discutent à la console d'un studio radio, micros sur bras articulés, table de mixage et écrans",
    },
    photographer: "Geoff Moore",
    profile: "https://unsplash.com/@jefferooski",
    page: "https://unsplash.com/photos/R7c5xeNRJsA",
    use: { en: "Studio B rehearsal room, home page", fr: "Local de répétition Studio B, accueil" },
  },
  studio3: {
    src: studio3,
    alt: {
      en: "Ribbed glass studio door lettered \"Studio 3\"",
      fr: "Porte de studio en verre cannelé portant l'inscription « Studio 3 »",
    },
    photographer: "Zach Camp",
    profile: "https://unsplash.com/@zachccamp",
    page: "https://unsplash.com/photos/l4c2UDBdXdI",
    use: { en: "Studio B rehearsal room, home page", fr: "Local de répétition Studio B, accueil" },
  },
  stream: {
    src: stream,
    alt: {
      en: "A hand holds up a phone filming a singer on a hazy stage under white spotlights",
      fr: "Une main tient un téléphone qui filme une chanteuse sur une scène brumeuse, sous des projecteurs blancs",
    },
    photographer: "Fredrik Solli Wandem",
    profile: "https://unsplash.com/@fredrikwandem",
    page: "https://unsplash.com/photos/E0yv6DR3j_w",
    use: { en: "Rooftop session livestream, home page", fr: "Diffusion de la session sur le toit, accueil" },
  },
  stream2: {
    src: stream2,
    alt: {
      en: "Two guitarists play an intimate session in a small room with coats and pictures on the wall",
      fr: "Deux guitaristes jouent en formation intime dans une petite pièce, manteaux et cadres au mur",
    },
    photographer: "Karl Solano",
    profile: "https://unsplash.com/@karlsolano",
    page: "https://unsplash.com/photos/bfPDH8dRH6E",
    use: { en: "Rooftop session livestream, home page", fr: "Diffusion de la session sur le toit, accueil" },
  },
  stream3: {
    src: stream3,
    alt: {
      en: "Audience member raises a phone to film a band playing outdoors in daylight",
      fr: "Une spectatrice lève son téléphone pour filmer un groupe qui joue en plein air, en journée",
    },
    photographer: "Kwami Fattah Al Sissi",
    profile: "https://unsplash.com/@kwami_heude_50",
    page: "https://unsplash.com/photos/Y-HchT_OF0U",
    use: { en: "Rooftop session livestream, home page", fr: "Diffusion de la session sur le toit, accueil" },
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
    use: { en: "Wood kiln video course", fr: "Cours vidéo sur le four à bois" },
  },
  pottery2: {
    src: pottery2,
    alt: {
      en: "Ceramics workshop with two kilns, shelves of bisque ware and a work table",
      fr: "Atelier de céramique avec deux fours, étagères de pièces biscuitées et table de travail",
    },
    photographer: "Jason Leung",
    profile: "https://unsplash.com/@ninjason",
    page: "https://unsplash.com/photos/a-room-filled-with-lots-of-pots-and-pans-YH6D-kdeEA4",
    use: { en: "Wood kiln video course", fr: "Cours vidéo sur le four à bois" },
  },
  pottery3: {
    src: pottery3,
    alt: {
      en: "Hand-painted glazed cups and saucers lined up on a white shelf",
      fr: "Tasses et soucoupes émaillées peintes à la main, alignées sur une étagère blanche",
    },
    photographer: "T",
    profile: "https://unsplash.com/@tanyabarrow",
    page: "https://unsplash.com/photos/c-N5R35QtfA",
    use: { en: "Wood kiln video course", fr: "Cours vidéo sur le four à bois" },
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
    use: { en: "Tool locker 14", fr: "Casier à outils 14" },
  },
  lockers2: {
    src: lockers2,
    alt: {
      en: "Locker room with numbered grey metal lockers and concrete benches",
      fr: "Vestiaire avec casiers métalliques gris numérotés et bancs en béton",
    },
    photographer: "Jan Laugesen",
    profile: "https://unsplash.com/@fotofyn",
    page: "https://unsplash.com/photos/4UbSaPKGRqc",
    use: { en: "Tool locker 14", fr: "Casier à outils 14" },
  },
  lockers3: {
    src: lockers3,
    alt: {
      en: "A woman opens a white locker with an electronic lock in a bright corridor",
      fr: "Une femme ouvre un casier blanc à serrure électronique dans un couloir lumineux",
    },
    photographer: "TECNIC Bioprocess Solutions",
    profile: "https://unsplash.com/@tecnic",
    page: "https://unsplash.com/photos/a-woman-is-opening-a-locker-in-the-hallway-8q1sbddl8hc",
    use: { en: "Tool locker 14", fr: "Casier à outils 14" },
  },
  smartLock: {
    src: smartLock,
    alt: {
      en: "Backlit numeric keypad mounted on a grey-green wall beside a door",
      fr: "Clavier numérique rétroéclairé fixé sur un mur gris-vert près d'une porte",
    },
    photographer: "vuk burgic",
    profile: "https://unsplash.com/@vukburga",
    page: "https://unsplash.com/photos/qB8tpVXQh6Y",
    use: { en: "How it works: integrations", fr: "Fonctionnement : intégrations" },
  },
  ownerCamille: {
    src: ownerCamille,
    alt: {
      en: "Smiling ceramic artist in a linen apron at her worktable in a pottery studio",
      fr: "Céramiste souriante en tablier de lin, à sa table de travail dans son atelier",
    },
    photographer: "Mina Rad",
    profile: "https://unsplash.com/@miinrad",
    page: "https://unsplash.com/photos/lz_zy3NEyDI",
    use: { en: "Gate owner portrait", fr: "Portrait du propriétaire de l'accès" },
  },
  ownerNoor: {
    src: ownerNoor,
    alt: {
      en: "Portrait of a bearded man with glasses and a striped shirt against a blue wall",
      fr: "Portrait d'un homme barbu à lunettes, en chemise rayée, devant un mur bleu",
    },
    photographer: "Christian Buehner",
    profile: "https://unsplash.com/@christianbuehner",
    page: "https://unsplash.com/photos/h0_elok-uKI",
    use: { en: "Gate owner portrait", fr: "Portrait du propriétaire de l'accès" },
  },
}

/** The photos of a gate that exist in the table, cover first. */
export function photosOf(keys: string[]): Photo[] {
  return keys.map((k) => PHOTOS[k]).filter((p): p is Photo => Boolean(p))
}
