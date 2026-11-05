# Miso

**Learn a language in a few minutes a day, completely free.**

Miso is a playful language-learning app for mobile, guided by a cheeky red panda mascot. Lessons are short, progress feels like a game, and every part of learning is free.

> **Status:** Early planning. The app isn't built yet, and everything below describes what we plan to make.

## Completely free

Miso is going to be **completely free**:

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
- **Miso the red panda:** a mascot who cheers, sulks and celebrates along with you

## Planned tech stack

These choices may change as the project grows.

| Area | Choice | Why |
|---|---|---|
| Mobile app | React Native with Expo | One React codebase for Android and iOS |
| Language | TypeScript | Catches mistakes early as the app grows |
| Mascot animation | Rive | Small files and animations that react live to the learner |
| Backend | Supabase | Accounts and progress sync across devices |

## Roadmap

### Phase 1: Foundation
- [ ] Set up the React Native and Expo project with TypeScript
- [ ] Choose the first language course
- [ ] Define the format for courses, lessons and exercises
- [ ] Finish the mascot, colors and app icon
- [ ] Set up navigation and shared UI components

### Phase 2: First playable lesson
- [ ] Build the lesson path screen
- [ ] Build multiple choice, matching and translation exercises
- [ ] Add answer checking and feedback
- [ ] Add a lesson-complete screen
- [ ] Write the first unit of course content

### Phase 3: Game loop
- [ ] Add XP, hearts and daily streaks
- [ ] Save progress on the device
- [ ] Add a practice mode for earning hearts back
- [ ] Add review of past mistakes
- [ ] Add sound effects

### Phase 4: Bringing Miso to life
- [ ] Animate Miso in Rive: idle, correct, wrong, streak warning and celebration
- [ ] Trigger reactions from what happens in a lesson
- [ ] Move Miso along the lesson path
- [ ] Add streak reminder notifications

### Phase 5: Accounts and sync
- [ ] Add sign-up and login
- [ ] Sync progress across devices
- [ ] Add a learner profile with stats

### Phase 6: Launch
- [ ] Test with a small group of learners and fix what they find
- [ ] Add audio pronunciation for lessons
- [ ] Release on Google Play and the App Store

### Later
- [ ] More language courses
- [ ] Spaced repetition tuned to each learner
- [ ] Leaderboards and friends
- [ ] Offline lessons
