import { Link } from 'react-router-dom';
import { HeroSection, Section, Grid } from '@/components/ui/section';
import { Card, CardBody } from '@/components/ui/card-custom';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import {
  AlertCircle,
  FileText,
  Heart,
  Scale,
  Stethoscope,
} from 'lucide-react';

export default function Index() {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Use a small delay to ensure DOM is ready
    setTimeout(() => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        // Calculate offset for sticky header
        const headerHeight = 80; // Approximate header height
        const elementPosition = featuresSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };
  const modules = [
    {
      icon: FileText,
      title: 'Product Label Auditor (Label Padhega India)',
      description: 'Analyze product labels and extract ingredients, warnings, and compliance information.',
      href: '/product-label-auditor',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: AlertCircle,
      title: 'CivicSense (Awareness & Reporting)',
      description: 'Report civic issues and get connected to relevant authorities and resources.',
      href: '/civicsense-assistant',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Stethoscope,
      title: 'Lab Report Analyzer & Health Triage',
      description: 'Understand lab reports and get guidance on symptoms and next steps.',
      href: '/health-tools',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Heart,
      title: 'GynaeCare (Women Health Module)',
      description: "Women’s health resources, myths vs facts, and access to healthcare support.",
      href: '/gynae-care',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Scale,
      title: 'Legal & Financial Rights Assistant',
      description: 'Access guidance on legal rights, financial matters, and consumer protection.',
      href: '/legal-rights',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Select a Service',
      description: 'Choose from our range of AI-powered modules designed for different needs.',
    },
    {
      number: '2',
      title: 'Provide Information',
      description: 'Share your query, document, or details using text, voice, or image upload.',
    },
    {
      number: '3',
      title: 'Get Instant Insights',
      description: 'Receive clear, actionable guidance tailored to your situation.',
    },
    {
      number: '4',
      title: 'Take Action',
      description: 'Access resources, apply for schemes, or contact relevant authorities.',
    },
    {
      number: '5',
      title: 'Track & Learn',
      description: 'Monitor your progress and access educational resources for continuous growth.',
    },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative min-h-screen sm:min-h-[90vh] overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/earth_globe.mp4" type="video/mp4" />
        </video>

        {/* Overlay Gradient - Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/5 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/15 to-transparent" />

        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 opacity-50" />

        <div className="container-main relative z-10 text-center py-16 sm:py-20 lg:py-24">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-lg">
            Connecting Communities
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-lg">
              to Information & Services
            </span>
          </h1>
          <div className="mb-8 max-w-2xl mx-auto flex justify-center">
            <div className="loader-wrapper">
              {'AI of the People, AI by the People, AI for the People.'.split('').map((letter, index) => (
                <span key={index} className="loader-letter">
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
              <div className="loader"></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="#features" onClick={scrollToFeatures} className="inline-block">
              <button className="features-button">
                Features
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <Section className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
            What is BharatSetu?
          </h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            A platform designed to bridge the gap between citizens and services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Information Access',
                description: 'Instant access to government schemes, health services, legal rights, and educational opportunities.',
              },
              {
                icon: '✨',
                title: 'Simplification',
                description: 'Complex documents and policies simplified into plain language anyone can understand.',
              },
              {
                icon: '🤝',
                title: 'Connection',
                description: 'Bridge gaps between citizens and services. Find resources and connect to authorities.',
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features Grid */}
      <Section className="scroll-mt-20 py-16 sm:py-20" id="features">
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
            Our Features
          </h2>
          <p className="text-lg text-foreground/70 text-center max-w-2xl mx-auto">
            Explore my AI-powered modules designed to help you navigate citizen services and personal growth.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <BentoGrid className="lg:grid-rows-3">
            {[
              {
                Icon: FileText,
                name: 'Product Label Auditor (Label Padhega India)',
                description:
                  'Analyze product labels and extract ingredients, warnings, and compliance information.',
                href: '/product-label-auditor',
                cta: 'Explore',
                background: (
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                    src="/generated-stock-images/product-label-card-bg.png"
                  />
                ),
                className: 'lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4',
              },
              {
                Icon: AlertCircle,
                name: 'CivicSense (Awareness & Reporting)',
                description:
                  'Report civic issues and get connected to relevant authorities and resources.',
                href: '/civicsense-assistant',
                cta: 'Explore',
                background: (
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                    src="/generated-stock-images/civic-sense-card-bg.png"
                  />
                ),
                className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
              },
              {
                Icon: Stethoscope,
                name: 'Lab Report Analyzer & Health Triage',
                description:
                  'Understand lab reports and get guidance on symptoms and next steps.',
                href: '/health-tools',
                cta: 'Explore',
                background: (
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                    src="/generated-stock-images/lab-report-analyzer-card-bg.png"
                  />
                ),
                className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
              },
              {
                Icon: Heart,
                name: 'GynaeCare (Women Health Module)',
                description:
                  "Women’s health resources, myths vs facts, and access to healthcare support.",
                href: '/gynae-care',
                cta: 'Explore',
                background: (
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                    src="/generated-stock-images/gynaecare-card-bg.png"
                  />
                ),
                className: 'lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2',
              },
              {
                Icon: Scale,
                name: 'Legal & Financial Rights Assistant',
                description:
                  'Access guidance on legal rights, financial matters, and consumer protection.',
                href: '/legal-rights',
                cta: 'Explore',
                background: (
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                    src="/generated-stock-images/legal-rights-card-bg.png"
                  />
                ),
                className: 'lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4',
              },
            ].map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
                    </div>
      </Section>

      {/* How It Works - removed */}

      {/* Call to Action */}
      <Section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 rounded-2xl p-8 sm:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Access the services you need. Choose a module above or get started now.
          </p>
          <a href="#features" onClick={scrollToFeatures} className="inline-block">
            <button className="features-button">
              Features
            </button>
          </a>
        </div>
      </Section>
    </div>
  );
}
