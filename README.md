# portfolio

My personal site. React + Vite, deployed on Cloudflare Pages.

The main thing on it is a replay of my capstone (self-healing cloud infra with RL). The episodes in `src/data/episodes.json` are real recorded ticks from the main evaluation on our K3s testbed, trimmed down to what the page needs. Nothing there is simulated.

## running it

```bash
npm install
npm run dev
```

`npm run build` puts the static site in `dist/`.

## where stuff is

- `src/data/content.js` - all the text (projects, profiles, stats). Edit this when something changes.
- `src/data/capstone.js` - replay scenarios + eval numbers
- `src/data/episodes.json` - the recorded episodes, column order is written at the top of capstone.js
- `src/components/` - one file per section
- `src/styles.css` - everything visual

## deploy

Cloudflare Pages, connected to this repo.
Build command `npm run build`, output folder `dist`. Every push to `main` redeploys.
