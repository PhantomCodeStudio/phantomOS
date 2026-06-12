'use client'
import { useState } from 'react'
import { MetaballCanvas } from './MetaballCanvas'
import { FooterLogo }     from './FooterLogo'
import { ContactForm }    from './ContactForm'
import { FooterSignature } from './FooterSignature'

const SOCIALS = [
  { name: 'Instagram', href: 'https://instagram.com/phantomcode' },
  { name: 'LinkedIn',  href: 'https://linkedin.com/company/phantomcode' },
  { name: 'Twitter',   href: 'https://twitter.com/phantomcode' },
  { name: 'YouTube',   href: 'https://youtube.com/@phantomcode' },
]

export function FooterSection() {
  const [, setBurst] = useState(false)

  return (
    <footer id="footer" className="relative min-h-screen bg-[#FFE900] overflow-hidden" aria-label="Footer">
      {/* Metaballs layer */}
      <div className="absolute inset-0 pointer-events-none">
        <MetaballCanvas onBurst={() => setBurst(true)} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-[5%] py-24">
        <FooterLogo />

        <h2 className="font-bebas mt-8 mb-16 text-center text-black" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
          Let&rsquo;s Build Something Impossible
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 w-full max-w-5xl">
          <ContactForm onSuccess={() => setBurst(true)} />

          <div className="flex flex-col gap-8">
            <div>
              <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-2">Email</p>
              <a href="mailto:studio@enterphantomcode.com" className="text-sm font-light text-black hover:opacity-60 transition-opacity">
                studio@enterphantomcode.com
              </a>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-2">Location</p>
              <p className="text-sm font-light text-black/70">Johannesburg, South Africa</p>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-3">Follow</p>
              <div className="flex gap-6">
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40 hover:text-[#4169FF] transition-colors cursor-none">
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <FooterSignature />
      </div>
    </footer>
  )
}
