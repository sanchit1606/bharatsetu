import { HeroSection, Section } from '@/components/ui/section';
import { DeveloperCard } from '@/components/DeveloperCard';
import { TubesBackground } from '@/components/ui/neon-flow';
import { GlowCard } from '../components/ui/spotlight-card';

export default function Documentation() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <TubesBackground className="min-h-[380px]">
        <div className="pointer-events-auto">
          <HeroSection
            title="BharatSetu Documentation"
            subtitle="Connecting Communities to Information, Resources & Public Services"
            className="bg-none bg-transparent [&_h1]:text-white [&_p]:text-white !py-12 sm:!py-16 lg:!py-20"
          >
            <div className="flex items-center justify-center">
              <a
                className="documentation-masked-btn"
                href="https://portfolio-three-silk-62.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                <span>PORTFOLIO</span>
              </a>
            </div>
          </HeroSection>
        </div>
      </TubesBackground>

      {/* Developer Card Section */}
      <Section className="!py-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <DeveloperCard />
        </div>
      </Section>
      {/* Feature cards */}
      <Section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-row items-stretch justify-start gap-6 pl-4 flex-nowrap">
            <GlowCard glowColor="blue" size="md" className="flex flex-1 min-w-0 items-end justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">Product Label Auditor</h3>
                <p className="text-sm text-foreground/70">Health & Pharma / Cosmetic</p>
                <p className="text-sm text-foreground/70 mt-2">Label Padhega India</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="purple" size="md" className="flex flex-1 min-w-0 items-end justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">CivicSense</h3>
                <p className="text-sm text-foreground/70">Awareness & Reporting</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="green" size="md" className="flex flex-1 min-w-0 items-end justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">Document & Legal Assistant</h3>
                <p className="text-sm text-foreground/70">Legal & Financial Rights</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="orange" size="md" className="flex flex-1 min-w-0 items-end justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">Lab Report Analyzer</h3>
                <p className="text-sm text-foreground/70">Health Tools</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="red" size="md" className="flex flex-1 min-w-0 items-end justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">GynaeCare</h3>
                <p className="text-sm text-foreground/70">Women's Health Module</p>
              </div>
            </GlowCard>
          </div>
        </div>
      </Section>
    </div>
  );
}

