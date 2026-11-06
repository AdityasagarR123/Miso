# Biso

**Learn a language in a few minutes a day, completely free.**

Biso is a playful language-learning website, with phone apps to follow, guided by a cheeky red panda mascot. Lessons are short, progress feels like a game, and every part of learning is free.

**Try it at https://www.thebiso.xyz**

> **Status:** Early but live. All 10 languages and their 10 levels are playable, with word, grammar and writing lessons, practice sessions, XP, hearts and streaks. The courses are first drafts that still need review by fluent speakers. Progress is saved in the browser and doesn't follow you between devices yet.

## Languages and levels

Biso teaches ten languages, each taught from English:

- Spanish
- French
- German
- Japanese
- Korean
- Italian
- Portuguese
- Mandarin Chinese
- Hindi
- Arabic

Every language follows the same 10 levels, set across five map regions:

| Level | Topic | Region |
|---|---|---|
| 1 | Basics | Bamboo Grove |
| 2 | People and family | Bamboo Grove |
| 3 | Food and drink | Market Town |
| 4 | Shopping and money | Market Town |
| 5 | Travel and directions | Harbor Bay |
| 6 | Hotels and getting around | Harbor Bay |
| 7 | Daily routine | Cloud Village |
| 8 | Work and hobbies | Cloud Village |
| 9 | Past and future | Starlight Peak |
| 10 | Real conversations | Starlight Peak |

Each level has four lessons: Words 1, Words 2, Grammar and Writing. Spanish Level 1 has seven word lessons instead of two.

## Completely free

Biso is **completely free**:

- No subscriptions
- No premium tier
- No paywalled lessons or features
- No paying to keep learning after mistakes

You look around for free, and a free account lets you play lessons.

## What's in Biso

- **Themed maps:** a road of levels and lessons for each language, which unlock one by one
- **Exercises:** multiple choice, matching pairs, arranging translations and typed writing
- **Forgiving writing:** capitals, punctuation and Latin accents are optional, and languages with their own script accept the script or Latin letters
- **Hearts:** mistakes cost a heart, and practice earns them back
- **Practice:** mixed, grammar and writing sessions, with past mistakes coming back in mixed sessions until they stick
- **XP and streaks:** small rewards that make it easy to keep coming back
- **Biso the red panda:** a mascot who cheers you on and congratulates you when you clear a lesson or level
- **Your data, your choice:** an Account page to erase your progress or delete your account

## Public pages

Each public page is built into its own HTML, so search engines and link previews can read it:

- Home and the language picker
- A page for each language, such as `/languages/spanish`
- About and Contact
- Privacy Policy, Terms of Service and Cookie Policy

The site also has a sitemap, `robots.txt`, structured data, a share image and a real 404 page. App screens such as lessons are kept out of search results.

## Tech stack

| Area | Choice | Why |
|---|---|---|
| App | React Native with Expo and Expo Router | One React codebase for the web now, and Android and iOS later |
| Language | TypeScript | Catches mistakes early as the app grows |
| Accounts | Firebase Authentication | Email and Google sign-in |
| Progress | Browser storage, through AsyncStorage | Works with no server for now |
| Hosting | Vercel | Publishes automatically whenever `main` changes |

## Getting started

You'll need [Node.js](https://nodejs.org) version 24. Then run:

```bash
npm install
```

```bash
npm run web
```

This starts Biso in your browser. The landing page is at `/` and the lessons are at `/learn`.

To sign in and play lessons locally, copy `.env.example` to `.env.local` and add your Firebase project's details.

## Useful commands

| Command | What it does |
|---|---|
| `npm run web` | Runs the site locally |
| `npm test` | Runs the tests |
| `npm run typecheck` | Checks the TypeScript |
| `npm run build:web` | Runs the checks, builds the site and writes each public page's HTML and the sitemap into `dist` |

`npm run build:web` needs the Firebase settings from `.env.example`, and stops if they're missing. Vercel has them set as environment variables.

## Project layout

| Folder | What's inside |
|---|---|
| `src/app` | The site's pages and screens |
| `src/components` | Shared pieces, plus the landing page, maps, exercises and public page layout |
| `src/course` | The courses: phrases, grammar questions and how lessons are built |
| `src/progress` | XP, hearts, streaks and saved progress |
| `src/auth` | Sign-in and accounts |
| `src/site` | Words and metadata for the public and legal pages |
| `scripts` | Build checks and the script that writes each public page's HTML |

## Roadmap

### Phase 1: Foundation
- [x] Set up the React Native and Expo project with TypeScript
- [x] Choose the first language course: Spanish
- [x] Define the format for courses, lessons and exercises
- [ ] Finish the mascot, colors and app icon
- [x] Set up navigation and shared UI components

### Phase 2: First playable lesson
- [x] Build the lesson path screen
- [x] Build multiple choice, matching and translation exercises
- [x] Add answer checking and feedback
- [x] Add a lesson-complete screen
- [x] Write the first unit of course content

### Phase 3: Game loop
- [x] Add XP, hearts and daily streaks
- [x] Save progress locally
- [x] Add a practice mode for earning hearts back
- [x] Add review of past mistakes
- [x] Add grammar and writing practice sessions
- [ ] Add sound effects

### Phase 4: Bringing Biso to life
- [ ] Animate Biso further: idle, correct, wrong, streak warning and celebration
- [ ] Trigger reactions from what happens in a lesson
- [x] Congratulate learners with Biso when they clear a lesson or level
- [x] Move Biso along the lesson path

### Courses
- [x] Add the language picker and 10-level structure
- [x] Write a first-draft course of 10 levels for all 10 languages
- [x] Add grammar and writing lessons to every level
- [ ] Add script lessons for Japanese, Korean, Mandarin Chinese, Hindi and Arabic
- [ ] Support right-to-left exercises for Arabic
- [ ] Have fluent speakers review every course

### Character-led lessons (idea being explored)

Today, learners often guess. The idea is to teach first and test after: a character, such as a doctor or a chef, appears in a real situation, explains a few words out loud, and then the learner uses them in a scene.

- [ ] Write and test one scene with one character in one language
- [ ] Design the cast of characters, with talking poses
- [ ] Test free, open voice models, and save the audio as files
- [ ] Decide whether to roll this out to every level

### Phase 5: Accounts and sync
- [x] Add sign-up and login with Firebase
- [x] Let learners delete their account and erase their progress
- [ ] Sync progress across devices
- [ ] Add a learner profile with stats

### Phase 6: Web launch
- [x] Add the landing page
- [x] Publish the Biso website on thebiso.xyz
- [x] Add privacy, terms and cookie pages
- [x] Add search engine basics and a page for each language
- [ ] Have a lawyer review the legal pages
- [ ] Submit the site to Google Search Console
- [ ] Make the website installable on desktop and phones
- [ ] Test with a small group of learners and fix what they find
- [ ] Add audio pronunciation for lessons

### Phase 7: Phone apps
- [ ] Test and adapt the app on Android and iOS
- [ ] Add streak reminder notifications
- [ ] Release on Google Play and the App Store

### Later
- [ ] Spaced repetition tuned to each learner
- [ ] Leaderboards and friends
- [ ] Offline lessons
