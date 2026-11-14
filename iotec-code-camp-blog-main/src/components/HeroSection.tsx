import type { ComponentType } from 'react'
import {
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { PROFILE, type ContactPlatform } from '@/data/profile'
import { cn } from '@/lib/utils'

type BrandIcon = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>

const CONTACT_ICONS: Record<ContactPlatform, BrandIcon> = {
  email: EnvelopeSimpleIcon,
  phone: PhoneIcon,
  whatsapp: WhatsappLogoIcon,
  linkedin: LinkedinLogoIcon,
}

export function HeroSection() {
  return (
    <section className="py-4 sm:py-8" aria-labelledby="hero-heading">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <figure className="lg:col-span-5">
          <Card className="relative aspect-4/5 w-full overflow-hidden rounded-xl border-border bg-card p-0 py-0 shadow-xs">
            <span
              aria-hidden="true"
              className="absolute top-3.5 left-3.5 z-10 h-1.5 w-4 rounded-full bg-background/90 shadow-2xs"
            />

            <img
              src={PROFILE.photo}
              alt={PROFILE.photoAlt}
              fetchPriority="high"
              width={680}
              height={716}
              className="size-full object-cover object-[center_22%]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-linear-to-t from-background/85 via-background/35 to-transparent p-3.5 pt-14"
            >
              <div className="h-2.5 w-full rounded-xs bg-background/95 shadow-2xs" />
            </div>
          </Card>

          <figcaption className="mt-3.5 space-y-0.5">
            <p className="text-xs font-semibold text-foreground">{PROFILE.name}</p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {PROFILE.role}
            </p>
          </figcaption>
        </figure>

        <div className="flex flex-col lg:col-span-7 lg:pt-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.16em] text-[#9a5b42] uppercase">
              Authorial Focus
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-border" />
          </div>

          <h1
            id="hero-heading"
            className="mt-3 font-serif text-3xl leading-[1.14] font-normal tracking-tight text-balance text-foreground sm:text-4xl lg:text-[42px]"
          >
            {PROFILE.headline}
          </h1>

          <p className="mt-5 text-[14.5px] leading-[1.7] text-foreground/80">
            {PROFILE.bio[0]}
          </p>

          <div className="mt-4 space-y-2">
            {PROFILE.bio.slice(1).map((paragraph) => (
              <p
                key={paragraph}
                className="text-xs leading-[1.7] text-muted-foreground sm:text-[13px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-7 pt-1">
            <h2 className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Direct Inquiries &amp; Corroboration
            </h2>

            <ul className="mt-3 flex flex-wrap gap-2">
              {PROFILE.contacts.map(({ platform, label, value, href, external }) => {
                const Icon = CONTACT_ICONS[platform]
                return (
                  <li key={platform}>
                    <a
                      href={href}
                      title={value}
                      aria-label={`${label}: ${value}`}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className={cn(
                        buttonVariants({ variant: 'secondary', size: 'sm' }),
                        'h-8 gap-2 rounded-md border border-border/80 bg-card px-3 text-xs font-normal text-foreground hover:bg-secondary',
                      )}
                    >
                      <Icon aria-hidden={true} size={14} className="text-muted-foreground" />
                      <span>{value}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
