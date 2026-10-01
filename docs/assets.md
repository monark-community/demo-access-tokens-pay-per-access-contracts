# Assets

All photographs are from Unsplash under the free [Unsplash License](https://unsplash.com/license) (none are Unsplash+). Each was downloaded at 2000px on its long edge (JPEG, quality ~72) into `public/images/` and is served with `next/image` from a static import. Photographers are credited on `/credits` (linked from the footer) and in `src/lib/photos.ts`.

| File | Subject | Unsplash page | Photographer | Used on |
|-|-|-|-|-|
| `public/images/studio-on-air.jpg` | Two studio doors with lit ON AIR signs | https://unsplash.com/photos/two-on-air-signs-above-studio-doors-9bkv_bFBkhA | [Austin](https://unsplash.com/@austin_7792) | Home "Where gates live" (room card); cover of the *Studio B* gate (catalogue, gate page, console) |
| `public/images/livestream-phone.jpg` | A phone filming a guitarist on stage | https://unsplash.com/photos/person-taking-photo-of-man-playing-guitar-aakpiFHR5t8 | [Quilia](https://unsplash.com/@heyquilia) | Home (stream card); cover and player frame of the *Rooftop session* gate |
| `public/images/pottery-wheel.jpg` | A potter shaping clay on a wheel | https://unsplash.com/photos/woman-shaping-clay-on-a-pottery-wheel-Wksd6I6mSkw | [Laura Tommasina](https://unsplash.com/@lauratommphoto) | Home (course card); cover and player frame of the *Wood kiln course* gate |
| `public/images/lockers-teal.jpg` | A row of teal metal lockers | https://unsplash.com/photos/gray-steel-locker-with-padlock-LLAz0_wudTo | [Shane](https://unsplash.com/@theyshane) | Home (locker card); cover of *Tool locker 14* |

## Drawn in code (no image files)

- Logo mark and wordmark: `src/components/site/logo.tsx`; favicon `src/app/icon.svg`; standalone mark `public/brand/gatepay-mark.svg`.
- Hero gate (plate, door, pass stub, gateway tape): `src/components/home/hero-gate.tsx`.
- Pass stub, plate, perforation dots, stamp, gateway tape: `src/components/pass/`.
- Door and locker illustration (gateway action, 404): `src/components/diagrams/door.tsx`.
- Covers for the report, the notice board and newly published gates: `src/components/demo/gate-cover.tsx`.
- Lifecycle diagram on `/how-it-works` and the Open Graph image (`src/app/[locale]/opengraph-image.tsx`).

Icons: `lucide-react`.
