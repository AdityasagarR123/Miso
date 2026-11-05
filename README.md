# Viso

**Learn a language in a few minutes a day, completely free.**

Viso is a playful language-learning website, with phone apps to follow, guided by a cheeky red panda mascot. Lessons are short, progress feels like a game, and every part of learning is free.

> **Status:** Early development. All 10 languages and their 10 levels are playable, with XP, hearts, streaks and saved progress. The courses are first drafts that still need review by fluent speakers.

## Languages and levels

Viso will teach ten languages, each taught from English:

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

## Completely free

Viso is going to be **completely free**:

- No subscriptions
- No premium tier
- No paywalled lessons or features
- No paying to keep learning after mistakes

## What we're building

- **Lesson path:** a clear path of short lessons that unlock one by one
- **Exercises:** multiple choice, matching pairs, and typing or arranging translations
- **Hearts:** mistakes cost a heart, and practice earns them back
- **XP and streaks:** daily goals that make it easy to keep coming back
- **Smart review:** the things you get wrong come back until they stick
- **Viso the red panda:** a mascot who cheers, sulks and celebrates along with you

## Planned tech stack

These choices may change as the project grows.

| Area | Choice | Why |
|---|---|---|
| App | React Native with Expo | One React codebase for the web now, and Android and iOS later |
| Language | TypeScript | Catches mistakes early as the app grows |
| Mascot animation | Rive | Small files and animations that react live to the learner |
| Backend | Supabase | Accounts and progress sync across devices |

## Try it

Viso is live at **https://adityasagarr123.github.io/Viso/**. It publishes automatically whenever `main` changes.

## Getting started

You'll need [Node.js](https://nodejs.org). Then run:

```bash
npm install
npm run web
```

This starts Viso and lets you open it in your browser. The landing page is at `/` and the lessons are at `/learn`. The web version comes first, so that's the main way to run it for now.

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
- [ ] Add sound effects

### Phase 4: Bringing Viso to life
- [ ] Animate Viso in Rive: idle, correct, wrong, streak warning and celebration
- [ ] Trigger reactions from what happens in a lesson
- [x] Move Viso along the lesson path

### Courses
- [x] Add the language picker and 10-level structure
- [x] Write a first-draft course of 10 levels for all 10 languages
- [ ] Deepen each level with more lessons and grammar
- [ ] Add script lessons for Japanese, Korean, Mandarin Chinese, Hindi and Arabic
- [ ] Support right-to-left exercises for Arabic
- [ ] Have fluent speakers review every course

### Phase 5: Accounts and sync
- [ ] Add sign-up and login
- [ ] Sync progress across devices
- [ ] Add a learner profile with stats

### Phase 6: Web launch
- [x] Add the landing page
- [x] Make the website installable on desktop and phones
- [ ] Test with a small group of learners and fix what they find
- [ ] Add audio pronunciation for lessons
- [x] Publish the Viso website

### Phase 7: Phone apps
- [ ] Test and adapt the app on Android and iOS
- [ ] Add streak reminder notifications
- [ ] Release on Google Play and the App Store

### Later
- [ ] Spaced repetition tuned to each learner
- [ ] Leaderboards and friends
- [ ] Offline lessons
