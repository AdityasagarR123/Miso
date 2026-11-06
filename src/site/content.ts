/** Facts and words for the public pages. Used by the app and the build script. */
export const SITE = {
  name: 'Biso',
  url: 'https://www.thebiso.xyz',
  contactEmail: 'adityagreatmusician@gmail.com',
  legalUpdated: 'November 6, 2026',
  legalUpdatedIso: '2026-11-06',
  shareImage: '/og-image.png',
};

export const HOME_META = {
  path: '/',
  title: 'Biso: Learn Languages for Free with Fun, Bite-Sized Lessons',
  description:
    'Learn Spanish, French, Japanese and 7 more languages for free. Bite-sized lessons with hearts, XP and streaks, and a red panda who cheers you on. No subscription.',
};

export const LANGUAGES_META = {
  path: '/languages',
  title: 'Choose a Language to Learn for Free | Biso',
  description:
    'Pick from 10 languages, including Spanish, French, German, Japanese, Korean and Hindi. Every course has 10 levels and 40+ free lessons, with no subscription.',
};

export const ABOUT_META = {
  path: '/about',
  title: 'About Biso: Free Language Learning',
  description:
    'Biso is a free, playful way to learn a language, with short lessons, a learning road and a red panda mascot. Here is what Biso is and how it stays free.',
};

export const CONTACT_META = {
  path: '/contact',
  title: 'Contact Biso',
  description:
    'Questions about Biso, a mistake in a lesson, or a request about your data? Email the Biso team and we will get back to you.',
};

export const CAREERS_META = {
  path: '/careers',
  title: 'Careers at Biso: ML Engineer and UI/UX Designer Roles',
  description:
    'Help build Biso, the free language-learning website. We are hiring an ML Engineer and a UI/UX Designer. See what you would work on and how to apply.',
};

export const CAREERS_COMPENSATION =
  'Salary and compensation will be discussed during the hiring process.';

export type CareerRole = {
  title: string;
  summary: string;
  work: string[];
  looking: string[];
};

export const CAREER_ROLES: CareerRole[] = [
  {
    title: 'ML Engineer',
    summary: "Help give Biso's characters a voice, and help make lessons smarter.",
    work: [
      'Test open voice models across our 10 languages.',
      'Build the pipeline that turns lesson scripts into audio.',
      'Explore how review can adapt to each learner.',
    ],
    looking: [
      'Hands-on experience with Python and machine learning models.',
      'Experience with speech or language models is a big plus.',
      'Care about quality, especially in languages you do not speak yourself.',
    ],
  },
  {
    title: 'UI/UX Designer',
    summary: 'Help make learning a language feel like something people want to come back to.',
    work: [
      'Design character-led lesson scenes.',
      'Improve the map, lesson and practice experiences.',
      'Test designs with real learners on phones and desktops.',
    ],
    looking: [
      'A portfolio that shows how you think, as well as the final screens.',
      'Experience designing for phones first.',
      'A love of playful, friendly products.',
    ],
  },
];

export function roleApplyLink(role: CareerRole): string {
  return `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(`Application: ${role.title}`)}`;
}

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPage = {
  path: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

const PRIVACY: LegalPage = {
  path: '/privacy',
  name: 'Privacy Policy',
  title: 'Privacy Policy | Biso',
  description:
    'What Biso collects, why, who helps run it, how long it is kept, and how to delete your account and your data. Biso has no ads and does not sell your data.',
  intro:
    'Biso is a free language-learning website. This policy explains what we collect and what you can do about it. The short version: we keep as little as we can, we show no ads, and we never sell your data.',
  sections: [
    {
      heading: 'What we collect',
      bullets: [
        'Account details: your email address and a unique account ID. If you use Google to sign in, Google also shares your name and profile photo with our sign-in service.',
        'Your password: this is handled by our sign-in service, Firebase Authentication. We never see it.',
        'Sign-in records: our sign-in service keeps when your account was created and last used.',
        'Basic server logs: our hosting provider, Vercel, handles technical data such as IP addresses and browser type when pages load.',
      ],
    },
    {
      heading: 'What stays on your device',
      paragraphs: [
        'Your learning progress (XP, hearts, streak, finished lessons and mistakes) is saved in your browser. It is not sent to us or tied to your account. If you clear your browser data or switch devices, it does not come with you.',
      ],
    },
    {
      heading: 'How we use your information',
      bullets: [
        'To create your account and sign you in.',
        'To send emails you ask for, such as a password reset.',
        'To keep Biso secure and working.',
        'To reply if you contact us.',
      ],
    },
    {
      heading: 'What we do not do',
      bullets: [
        'We do not show ads.',
        'We do not sell or rent your personal data.',
        'We do not use analytics or advertising trackers.',
      ],
    },
    {
      heading: 'Our legal reasons',
      paragraphs: [
        'Where laws such as the GDPR apply, we use your data because we need it to provide the service you asked for, and because we have a legitimate interest in keeping Biso secure.',
      ],
    },
    {
      heading: 'Who helps us run Biso',
      bullets: [
        'Google Firebase provides accounts and sign-in.',
        'Vercel hosts the website.',
      ],
      paragraphs: [
        'These providers process data for us and may do so in other countries, including the United States. We share data only as needed to run Biso, or when the law requires it.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'We keep your account until you delete it. When you delete it, your account is removed from our sign-in service. Our providers may keep limited logs for a short time for security, under their own policies.',
      ],
    },
    {
      heading: 'Your choices and rights',
      bullets: [
        'Delete your account and erase this device\'s progress at any time on the Account page.',
        'Reset your password from the sign-in page.',
        'Depending on where you live, you may also have the right to access, correct, move or limit the use of your data, to object to its use, and to complain to your data protection authority.',
      ],
      paragraphs: [
        'To make a request, email us at the address below.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'You must be at least 13 to create a Biso account, or older if your country sets a higher minimum age. If you believe a child has given us personal data without permission, email us and we will delete it.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If we change this policy, we will update it here and change the date at the top. Important changes will be made clear on the site.',
      ],
    },
    {
      heading: 'Contact us',
      paragraphs: [`Email ${SITE.contactEmail} with any privacy question or request.`],
    },
  ],
};

const TERMS: LegalPage = {
  path: '/terms',
  name: 'Terms of Service',
  title: 'Terms of Service | Biso',
  description:
    'The rules for using Biso, the free language-learning website, including accounts, acceptable use, course content and your right to leave at any time.',
  intro:
    'These terms apply when you use Biso. By using the site or creating an account, you agree to them. If you do not agree, please do not use Biso.',
  sections: [
    {
      heading: 'Biso is free',
      paragraphs: [
        'Biso does not charge for lessons and has no subscription. If we ever offer anything paid, we will tell you clearly first, and you will never be charged without choosing to pay.',
      ],
    },
    {
      heading: 'Your account',
      bullets: [
        'You need an account to play lessons. You can look around the site without one.',
        'You must be at least 13, or older if your country sets a higher minimum age.',
        'Keep your password safe. You are responsible for what happens on your account.',
        'Give us a real email address, so that you can reset your password.',
      ],
    },
    {
      heading: 'Using Biso fairly',
      paragraphs: ['Please do not:'],
      bullets: [
        'Break the law or harm other people using Biso.',
        'Try to hack, overload or disrupt the site.',
        'Copy or scrape Biso\'s lessons or artwork to build another product.',
        'Pretend to be someone else.',
      ],
    },
    {
      heading: 'Lessons may contain mistakes',
      paragraphs: [
        'We work to make lessons accurate, but they may contain errors, and we are still having courses reviewed. Biso is for learning and fun. Please do not rely on it for translation in medical, legal, safety or other important situations. If you spot a mistake, tell us.',
      ],
    },
    {
      heading: 'What belongs to whom',
      paragraphs: [
        'The Biso name, the Biso mascot, and the site\'s lessons, artwork and code belong to Biso or its licensors. You may use them to learn on Biso for your own personal use.',
      ],
    },
    {
      heading: 'Your progress',
      paragraphs: [
        'Progress is saved in your browser, so it can be lost if you clear your browser data or change devices. We cannot restore it.',
      ],
    },
    {
      heading: 'Changes and availability',
      paragraphs: [
        'We may change, pause or stop parts of Biso at any time. We try to keep it running, but we cannot promise it will always be available or free of errors.',
      ],
    },
    {
      heading: 'Leaving Biso',
      paragraphs: [
        'You can stop using Biso and delete your account at any time on the Account page. We may suspend or close accounts that break these terms.',
      ],
    },
    {
      heading: 'No warranty, and limits on liability',
      paragraphs: [
        'Biso is provided "as is", without warranties of any kind, to the extent the law allows. To the extent the law allows, Biso is not liable for indirect or consequential losses, or for losses arising from lost progress or from relying on lesson content. Nothing here limits rights that cannot legally be limited.',
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'If we change these terms, we will update them here and change the date at the top. By continuing to use Biso after that, you accept the new terms.',
      ],
    },
    {
      heading: 'Contact us',
      paragraphs: [`Email ${SITE.contactEmail} with any question about these terms.`],
    },
  ],
};

const COOKIES: LegalPage = {
  path: '/cookies',
  name: 'Cookie Policy',
  title: 'Cookie Policy | Biso',
  description:
    'Biso uses only the browser storage it needs to keep you signed in and save your progress. There are no advertising or analytics cookies.',
  intro:
    'Biso uses only the browser storage it needs to work. We do not use advertising or analytics cookies, so there is nothing to opt out of.',
  sections: [
    {
      heading: 'What Biso stores in your browser',
      bullets: [
        'Sign-in session: Firebase Authentication stores this in your browser to keep you signed in. It is needed for accounts to work.',
        'Learning progress: your XP, hearts, streak, chosen language, finished lessons and mistakes, saved under the name "viso.progress".',
        'Notice choice: a small note under the name "biso.cookieNotice", so that the cookie notice is not shown again.',
      ],
    },
    {
      heading: 'Google sign-in',
      paragraphs: [
        'If you choose Continue with Google, Google and Firebase may set their own cookies in the sign-in window. Those are covered by Google\'s policies. If you sign in with email instead, this does not apply.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        'You can clear this storage at any time in your browser settings, or erase your progress on the Account page. If you clear it, you will be signed out and your progress on that device will be lost. If you block it, sign-in and saving may not work.',
      ],
    },
    {
      heading: 'Contact us',
      paragraphs: [`Email ${SITE.contactEmail} with any question about this policy.`],
    },
  ],
};

export const LEGAL_PAGES = { privacy: PRIVACY, terms: TERMS, cookies: COOKIES };

export type LanguagePage = {
  slug: string;
  /** The phrasebook's key for this language. */
  key: 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh' | 'hi' | 'ar';
  courseId: string;
  name: string;
  about: string;
  scriptNote: string;
};

const LATIN_NOTE =
  'You will type real words from the start. Accents and capital letters are optional, so a missing accent never costs you a heart.';

function scriptNote(script: string): string {
  return `${script} Every phrase in Biso comes with a pronunciation guide, so you can start speaking before you can read it. In writing practice, you can answer in the native script or in Latin letters.`;
}

function language(
  slug: string,
  key: LanguagePage['key'],
  name: string,
  about: string,
  note: string,
): LanguagePage {
  return { slug, key, courseId: `${key}-from-en`, name, about, scriptNote: note };
}

export const LANGUAGE_PAGES: LanguagePage[] = [
  language('spanish', 'es', 'Spanish', 'Spanish is spoken across Spain and most of Latin America, so a little goes a long way, whether you are traveling, working or chatting with friends.', LATIN_NOTE),
  language('french', 'fr', 'French', 'French is spoken in France, Canada and many countries across Africa, and it opens the door to a huge world of food, film and books.', LATIN_NOTE),
  language('german', 'de', 'German', 'German is spoken in Germany, Austria and Switzerland, and it is a useful language for study, travel and work across central Europe.', LATIN_NOTE),
  language('japanese', 'ja', 'Japanese', 'Japanese is the language of Japan, and of the anime, games and food loved around the world. Start with polite phrases you can use on your first day there.', scriptNote('Japanese has its own writing system.')),
  language('korean', 'ko', 'Korean', 'Korean is the language of Korea, and of the K-dramas and K-pop that have fans everywhere. Start with the everyday phrases you hear on screen.', scriptNote('Korean is written in its own alphabet, Hangul.')),
  language('italian', 'it', 'Italian', 'Italian is the language of Italy, and of some of the world\'s favorite food, art and music. It is a joy to say out loud from the very first word.', LATIN_NOTE),
  language('portuguese', 'pt', 'Portuguese', 'Portuguese is spoken in Brazil, Portugal and several countries in Africa, so it is useful on more than one continent.', LATIN_NOTE),
  language('mandarin-chinese', 'zh', 'Mandarin Chinese', 'Mandarin is the most widely spoken form of Chinese. Short, simple phrases are a friendly way to begin.', scriptNote('Chinese is written in characters, and pinyin shows how to say them.')),
  language('hindi', 'hi', 'Hindi', 'Hindi is one of the main languages of India. Learn the everyday phrases that help you connect with family, friends and people you meet while traveling.', scriptNote('Hindi is written in the Devanagari script.')),
  language('arabic', 'ar', 'Arabic', 'Arabic is spoken across the Middle East and North Africa. Start with the greetings and polite phrases that make a warm first impression.', scriptNote('Arabic has its own script, written from right to left.')),
];

export function languageMeta(page: LanguagePage) {
  return {
    path: `/languages/${page.slug}`,
    title: `Learn ${page.name} Free: 40+ Bite-Sized Lessons | Biso`,
    description: `Learn ${page.name} for free with Biso. Ten levels and 40+ short lessons cover everyday words, grammar and writing, with no subscription or paywall.`,
  };
}

export function languageFaq(page: LanguagePage) {
  return [
    {
      question: `Is Biso's ${page.name} course really free?`,
      answer: `Yes. Every ${page.name} lesson is free, with no subscription, no premium tier and no card. You just need a free account to play.`,
    },
    {
      question: `Can a complete beginner learn ${page.name} on Biso?`,
      answer: `Yes. The course starts with basics like hello and thank you, and each level opens once you finish the one before it.`,
    },
    {
      question: `What does the ${page.name} course cover?`,
      answer:
        'Ten levels take you from basics through food, shopping, travel and daily life to real conversations. Each level has word lessons, a grammar lesson and a writing lesson.',
    },
    {
      question: 'How do hearts and practice work?',
      answer:
        'A wrong answer in a lesson costs a heart. If you run out, free practice sessions earn hearts back, so you never have to pay to keep learning.',
    },
  ];
}
