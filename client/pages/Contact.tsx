import { HeroSection, Section } from '@/components/ui/section';
import { HeartLikeButton } from '@/components/HeartLikeButton';

export default function Contact() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <HeroSection
        title="Get in Touch"
        subtitle="Contact Us"
        description="Have questions, feedback, or suggestions? I'd love to hear from you."
      >
        <div className="flex items-center justify-center">
          <HeartLikeButton title="Like BharatSetu" />
        </div>
      </HeroSection>

      {/* Social / Connect Section */}
      <Section>
        <div className="flex items-center justify-center">
          {/* From Uiverse.io by vinodjangid07 */}
          <div className="contact-social-vinod">
            <div className="card">
              <div className="socialContainer containerOne" aria-label="Instagram">
                <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z" />
                  <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                  <path d="M17.5 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
              </div>

              <div className="socialContainer containerTwo" aria-label="Twitter">
                <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 7.4c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.5-1.8-.6.4-1.4.7-2.2.9A3.4 3.4 0 0 0 12.6 9c0 .3 0 .6.1.8A9.7 9.7 0 0 1 3 5.8a3.4 3.4 0 0 0 1 4.6c-.5 0-1-.2-1.5-.4v.1c0 1.7 1.2 3.2 2.9 3.5-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.8 2.4 3.4 2.5A6.9 6.9 0 0 1 2 18.1 9.7 9.7 0 0 0 7.3 19.7c6.3 0 9.8-5.2 9.8-9.8v-.4c.7-.5 1.2-1.1 1.7-1.8z" />
                </svg>
              </div>

              <div className="socialContainer containerThree" aria-label="LinkedIn">
                <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.94 6.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88zM5.5 8.5h2.9V20H5.5V8.5zM9.8 8.5h2.8v1.6h.04c.39-.74 1.35-1.52 2.78-1.52 2.97 0 3.52 1.96 3.52 4.51V20h-2.9v-5.86c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V20H9.8V8.5z" />
                </svg>
              </div>

              <div className="socialContainer containerFour" aria-label="WhatsApp">
                <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.5 0 .18 5.3.18 11.83c0 2.08.54 4.11 1.57 5.9L0 24l6.42-1.68a11.8 11.8 0 0 0 5.64 1.44h.01c6.55 0 11.87-5.3 11.87-11.83 0-3.16-1.24-6.14-3.42-8.45zM12.07 21.3h-.01a9.8 9.8 0 0 1-5-1.38l-.36-.21-3.81 1 1.02-3.7-.23-.37a9.74 9.74 0 0 1-1.5-5.16C2.2 6.38 6.4 2.2 12.06 2.2c2.5 0 4.85.98 6.62 2.76a9.28 9.28 0 0 1 2.74 6.6c0 5.65-4.2 9.74-9.35 9.74z" />
                  <path d="M17.64 14.44c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.24-.24-.58-.48-.5-.68-.5h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.14 4.53.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Section>

    </div>
  );
}
