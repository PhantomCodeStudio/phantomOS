import dynamic from 'next/dynamic'
import { Nav }              from '@/components/nav/Nav'
import { LoadingScreen }    from '@/components/loader/LoadingScreen'
import { HeroText }         from '@/components/hero/HeroText'
import { ProblemSection }   from '@/components/problem/ProblemSection'
import { WhyPhantom }       from '@/components/why/WhyPhantom'
import { FooterSection }    from '@/components/footer/FooterSection'

// Heavy 3D sections — dynamic imported
const HeroScene       = dynamic(() => import('@/components/hero/HeroScene').then(m => ({ default: m.HeroScene })), { ssr: false })
const ServicesSection = dynamic(() => import('@/components/services/ServicesSection').then(m => ({ default: m.ServicesSection })), { ssr: false })
const ClientsPlayground = dynamic(() => import('@/components/clients/ClientsPlayground').then(m => ({ default: m.ClientsPlayground })), { ssr: false })
const CaseStudies     = dynamic(() => import('@/components/cases/CaseStudies').then(m => ({ default: m.CaseStudies })), { ssr: false })

export default function Home() {
  return (
    <main>
      <LoadingScreen />
      <Nav />

      {/* Hero */}
      <section className="relative min-h-screen" aria-label="Hero">
        <HeroScene />
        <HeroText />
      </section>

      <ProblemSection />
      <ServicesSection />
      <ClientsPlayground />
      <WhyPhantom />
      <CaseStudies />
      <FooterSection />
    </main>
  )
}
