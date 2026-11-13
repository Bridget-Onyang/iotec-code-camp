import { ArrowUpRight } from 'lucide-react'
import profilePhoto from '@/assets/onyang-bridget.jpg'
import { PROFILE } from '@/data/profile'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="grid gap-10 border-b border-border py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-16"
    >
      <figure className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted shadow-[0_30px_60px_-35px_rgba(28,25,23,0.55)]">
          <img
            src={profilePhoto}
            alt={PROFILE.photoAlt}
            className="aspect-[4/5] w-full object-cover object-[center_22%]"
          />
        </div>
        <figcaption className="mt-5">
          <p className="font-serif text-lg leading-tight font-medium tracking-tight text-foreground">
            {PROFILE.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {PROFILE.role}
          </p>
        </figcaption>
      </figure>

      <div className="flex flex-col">
        <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          Personal journal · {PROFILE.location}
        </p>

        <h1
          id="hero-heading"
          className="mt-5 font-serif text-4xl leading-[1.05] font-normal tracking-tight text-balance text-foreground sm:text-5xl"
        >
          {PROFILE.headline}
        </h1>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {PROFILE.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Direct inquiries &amp; correspondence
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PROFILE.contacts.map(({ label, value, href, icon: Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  title={value}
                  aria-label={`${label}: ${value}`}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Icon aria-hidden="true" className="size-3.5 text-primary/70" />
                  <span>{label}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
