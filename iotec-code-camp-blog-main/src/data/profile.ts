import profilePhoto from '@/assets/onyang-bridget.jpg'

export type ContactPlatform = 'email' | 'phone' | 'linkedin' | 'whatsapp'

export interface ContactLink {
  platform: ContactPlatform
  label: string
  value: string
  href: string
  external?: boolean
}

export interface Profile {
  name: string
  role: string
  location: string
  headline: string
  bio: readonly string[]
  photo: string
  photoAlt: string
  contacts: readonly ContactLink[]
}

export const PROFILE: Profile = {
  name: 'Onyang Bridget',
  role: 'Software Developer & Writer. Founder of The Tech Report',
  location: 'Kampala, Uganda',
  headline: 'Writing at the intersection of code, craft, and the quiet work of learning in public.',
  bio: [
    "I'm Onyang Bridget — a software developer and writer based in Kampala, Uganda. I build thoughtful web experiences by day, then write about the lessons behind them.",
    'I am currently sharpening my craft at IOTEC Code Camp, working across the stack with other builders and learning what it takes to ship software people genuinely enjoy using.',
    'This journal is where I think out loud: notes on frontend development, design, career growth, and the Code Camp journey. Honest drafts, not polished certainties.',
  ],
  photo: profilePhoto,
  photoAlt: 'Onyang Bridget speaking at an IOTEC Code Camp session',
  contacts: [
    {
      platform: 'email',
      label: 'Email',
      value: 'bridgetteonyang@gmail.com',
      href: 'mailto:bridgetteonyang@gmail.com',
    },
    {
      platform: 'phone',
      label: 'Phone',
      value: '+256 707 625 177',
      href: 'tel:+256707625177',
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      value: 'wa.me/256707625177',
      href: 'https://wa.me/256707625177',
      external: true,
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/bridget-onyang',
      href: 'https://www.linkedin.com/in/bridget-onyang-1668ab329/',
      external: true,
    },
  ],
}
