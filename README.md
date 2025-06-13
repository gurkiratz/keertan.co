This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Goals

- [x] Mobile friendly
- [x] API Cache/Server render
- [x] Artwork for track
- [x] Shortcuts to navigate, volume, seek forward and backward,
- [x] Search bar
- [ ] background patterns, theme selections
- [x] recently played, currently playing
- [x] store last played, last played's duration, recently played in local history
- [ ] queue for previous/next track
- [ ] implement a better track player
- [ ] login with a code that will give access to the app - early access
- [ ] signs up on early access - send email via resend with the early access code

### Queue

- [x] General queue for all tracks
- [x] Queue for Albums/Playlists
- [ ] After 1 album finishes, play another album
- [x] Update previous/next track buttons
- [x] UI component to view queue
- [ ] Drag and drop reordering of queue items
- [x] Option to remove individual tracks from queue
- [ ] Option to add another track to queue

- [ ] Shuffle queue functionality
- [ ] Repeat track/album/playlist options

<!-- - [ ] Clear queue option
- [ ] Save queue as playlist
- [ ] Queue history view -->
<!-- - [ ] Auto-queue similar tracks based on genre/mood -->

### UI

- [ ] Mobile devices, touch doesn't work right to seek track. need a better slider.
- [x] Tabs under the player rather than sidebar

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
