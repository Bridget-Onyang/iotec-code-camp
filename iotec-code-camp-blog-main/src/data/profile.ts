import {
  BriefcaseBusiness,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from 'lucide-react'

export interface ContactLink {
  label: string
  value: string
  href: string
  icon: LucideIcon
  external?: boolean
}

export interface Profile {
  name: string
  role: string
  location: string
  headline: string
  bio: readonly string[]
  photoAlt: string
  contacts: readonly ContactLink[]
}

export const PROFILE: Profile = {
  name: 'Onyang Bridget',
  role: 'Software Developer & Writer · Founder of The Tech Report',
  location: 'Kampala, Uganda',
  headline: 'Writing about code, craft, and the quiet work of learning in public.',
  bio: [
    "I'm Onyang Bridget — a software developer and writer based in Kampala, Uganda. I build thoughtful web experiences by day, then write about the lessons behind them.",
    "I'm currently sharpening my craft at IOTEC Code Camp, working across the stack with other builders and learning what it takes to ship software people genuinely enjoy using.",
    'This journal is where I think out loud: notes on frontend development, design, career growth, and the Code Camp journey. Honest drafts, not polished certainties.',
  ],
  photoAlt: 'Onyang Bridget speaking at an IOTEC Code Camp session',
  contacts: [
    {
      label: 'Email',
      value: 'bridgetteonyang@gmail.com',
      href: 'mailto:bridgetteonyang@gmail.com',
      icon: Mail,
    },
    {
      label: 'Phone',
      value: '+256 707 625 177',
      href: 'tel:+256707625177',
      icon: Phone,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/bridget-onyang',
      href: 'https://www.linkedin.com/in/bridget-onyang-1668ab329/',
      icon: BriefcaseBusiness,
      external: true,
    },
    {
      label: 'WhatsApp',
      value: 'wa.me/256707625177',
      href: 'https://wa.me/256707625177',
      icon: MessageCircle,
      external: true,
    },
  ],
}
