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
            title="BharatSetu Developer"
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
      {/* Feature cards removed per request */}
    </div>
  );
}

