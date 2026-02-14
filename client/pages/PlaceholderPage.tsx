import { HeroSection } from '@/components/ui/section';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection
        title={title}
        description={description}
      />
      
      <div className="flex-1 container-main py-12">
        <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-900">
            This page is coming soon. Continue prompting in the chat to build out this feature's complete interface and functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
