import { HeroSection, Section, Grid } from '@/components/ui/section';
import { Card, CardBody } from '@/components/ui/card-custom';
import { Users, Target, Lightbulb, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <HeroSection
        title="About BharatSetu"
        subtitle="My Mission"
        description="Bridging the gap between citizens and public services through AI-powered solutions"
      />

      {/* Mission Section */}
      <Section className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            My Mission
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed mb-6">
            BharatSetu exists to democratize access to information and services. I believe that every citizen, 
            regardless of their background, language, or literacy level, should have easy access to critical 
            information about government schemes, healthcare services, legal rights, and educational opportunities.
          </p>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Through AI and technology, I simplify complex information, bridge language barriers, and connect 
            people to the services they need. My vision is an India where no one is left behind due to lack of 
            information or access.
          </p>
        </div>
      </Section>

      {/* Core Values */}
      <Section>
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          My Core Values
        </h2>

        <Grid columns={2} gap="lg">
          {[
            {
              icon: Users,
              title: 'People-Centric',
              description: 'Everything I build is designed with the user in mind. I listen to feedback and continuously improve.',
            },
            {
              icon: Target,
              title: 'Accessibility',
              description: 'Free, easy-to-use services accessible to everyone, everywhere. No barriers, no complications.',
            },
            {
              icon: Lightbulb,
              title: 'Innovation',
              description: 'I use cutting-edge AI and technology responsibly to solve real problems and improve lives.',
            },
            {
              icon: Globe,
              title: 'Inclusivity',
              description: 'I celebrate diversity and build solutions that work for all communities, languages, and contexts.',
            },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index}>
                <CardBody className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      </Section>

      {/* Impact Section */}
      <Section className="bg-muted/30">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Our Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { metric: '100%', label: 'Free to Use', description: 'No hidden costs or subscription fees' },
            { metric: '9+', label: 'Services', description: 'Dedicated modules for different needs' },
            { metric: 'Multi', label: 'Language', description: 'Accessible to diverse communities' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{item.metric}</div>
              <h3 className="font-semibold text-foreground mb-2">{item.label}</h3>
              <p className="text-sm text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Who We Serve */}
      <Section>
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Who We Serve
        </h2>

        <Grid columns={1} gap="lg">
          {[
            {
              title: 'Citizens',
              description: 'Individuals seeking information about government services, health, legal rights, and education.',
            },
            {
              title: 'Women',
              description: 'Specialized support for women\'s health, safety, financial independence, and rights.',
            },
            {
              title: 'Students & Job Seekers',
              description: 'Access to educational opportunities and skill development programs.',
            },
            {
              title: 'Workers',
              description: 'Gig workers, informal sector workers, and others seeking labor rights and financial support.',
            },
            {
              title: 'Rural Communities',
              description: 'Bridging the digital divide with accessible services and multilingual support.',
            },
          ].map((item, index) => (
            <Card key={index}>
              <CardBody>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* Vision Section */}
      <Section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Our Vision for the Future
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            We envision a future where every Indian has access to the information and services they need to thrive. 
            A future where language, literacy, or geography are no barriers. A future powered by AI that is truly 
            "of the people, by the people, and for the people." We're just getting started, and we invite you to 
            be part of this journey.
          </p>
        </div>
      </Section>
    </div>
  );
}
