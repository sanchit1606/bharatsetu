import { useState } from "react";

type TocItem = {
  id: string;
  title: string;
  children?: TocItem[];
};

const TOC: TocItem[] = [
  {
    id: "intro",
    title: "Technical Documentation",
    children: [
      { id: "exec", title: "Executive Summary" },
    ],
  },
  {
    id: "1",
    title: "1. System Architecture",
    children: [
      {
        id: "1.1",
        title: "1.1 Technology Stack",
        children: [
          { id: "1.1.1", title: "Frontend" },
          { id: "1.1.2", title: "Backend" },
          { id: "1.1.3", title: "Data Storage" },
        ],
      },
      { id: "1.2", title: "1.2 Design Principles" },
    ],
  },
  {
    id: "2",
    title: "2. Feature 1: Product Label Auditor (Label Padhega India)",
    children: [
      { id: "2.1", title: "2.1 Problem Statement" },
      { id: "2.2", title: "2.2 Solution Overview" },
      {
        id: "2.3",
        title: "2.3 Technical Architecture",
        children: [
          { id: "2.3.1", title: "Processing Pipeline" },
          { id: "2.3.2", title: "Data Schema" },
          { id: "2.3.3", title: "Knowledge Base Structure" },
          { id: "2.3.4", title: "User Interaction Flow" },
        ],
      },
      { id: "2.4", title: "2.4 Data Storage" },
    ],
  },
  {
    id: "3",
    title: "3. Feature 2: CivicSense (Awareness & Reporting)",
    children: [
      { id: "3.1", title: "3.1 Problem Statement" },
      { id: "3.2", title: "3.2 Solution Overview" },
      {
        id: "3.3",
        title: "3.3 Technical Architecture",
        children: [
          { id: "3.3.1", title: "Processing Pipeline" },
          { id: "3.3.2", title: "Authority Database Structure" },
          { id: "3.3.3", title: "Submission Tiers" },
        ],
      },
      { id: "3.4", title: "3.4 Data Sources for Authority Database" },
      { id: "3.5", title: "3.5 Data Storage" },
    ],
  },
  {
    id: "4",
    title: "4. Feature 3: Document Jargon & Legal/Financial Rights Assistant",
    children: [
      { id: "4.1", title: "4.1 Problem Statement" },
      { id: "4.2", title: "4.2 Solution Overview" },
      {
        id: "4.3",
        title: "4.3 Technical Architecture",
        children: [
          { id: "4.3.1", title: "Components" },
          { id: "4.3.2", title: "Knowledge Base Structure" },
          { id: "4.3.3", title: "Query Processing Flow" },
        ],
      },
      { id: "4.4", title: "4.4 Data Sources" },
      { id: "4.5", title: "4.5 Data Storage" },
    ],
  },
  {
    id: "5",
    title: "5. Feature 4: Lab Report Analyzer",
    children: [
      { id: "5.1", title: "5.1 Problem Statement" },
      { id: "5.2", title: "5.2 Solution Scope" },
      {
        id: "5.3",
        title: "5.3 Technical Architecture",
        children: [
          { id: "5.3.1", title: "Processing Pipeline" },
          { id: "5.3.2", title: "Reference Ranges Database" },
          { id: "5.3.3", title: "User Interface Features" },
        ],
      },
      { id: "5.4", title: "5.4 Privacy and Safety" },
    ],
  },
  {
    id: "6",
    title: "6. Feature 5: GynaeCare Women's Health Module",
    children: [
      { id: "6.1", title: "6.1 Problem Statement" },
      { id: "6.2", title: "6.2 Solution Overview" },
      {
        id: "6.3",
        title: "6.3 Technical Architecture",
        children: [
          { id: "6.3.1", title: "Core Modules" },
          { id: "6.3.2", title: "RAG Implementation" },
          { id: "6.3.3", title: "Interactive Features" },
        ],
      },
      { id: "6.4", title: "6.4 Privacy and Safety" },
    ],
  },
  {
    id: "7",
    title: "7. Data Privacy and Security",
    children: [
      { id: "7.1", title: "7.1 Privacy-First Design" },
      {
        id: "7.2",
        title: "7.2 Data Classification",
        children: [
          { id: "7.2.1", title: "NOT Stored (High Risk Data)" },
          { id: "7.2.2", title: "Safe to Store (Anonymous/Aggregated)" },
        ],
      },
      { id: "7.3", title: "7.3 Security Measures" },
    ],
  },
  {
    id: "8",
    title: "8. Deployment Architecture",
    children: [
      {
        id: "8.1",
        title: "8.1 Infrastructure",
        children: [
          { id: "8.1.1", title: "Frontend Deployment" },
          { id: "8.1.2", title: "Backend Deployment" },
        ],
      },
      { id: "8.2", title: "8.2 Cost Analysis" },
    ],
  },
  { id: "9", title: "9. References" },
];

export default function Technical() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen((s) => ({ ...s, [id]: !s[id] }));
  };

  const scrollTo = (id: string, hasChildren: boolean) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try { history.replaceState(null, "", `#${id}`); } catch {}
    }
    if (hasChildren) toggle(id);
  };

  const renderToc = (items: TocItem[], level = 0) => {
    return (
      <ul className={`${level === 0 ? "" : "pl-4"}`}>
        {items.map((it) => {
          const hasChildren = it.children && it.children.length > 0;
          return (
            <li key={it.id}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => scrollTo(it.id, !!hasChildren)}
                  className={`text-left w-full flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted transition-colors ${level === 0 ? "font-semibold" : "text-sm"}`}
                >
                  <span className="w-6 text-xs text-foreground/70" />
                  <span>{it.title}</span>
                </button>
                {hasChildren && (
                  <button onClick={() => toggle(it.id)} className="ml-2 text-sm text-foreground/60 hover:text-foreground">
                    {open[it.id] ? "−" : "+"}
                  </button>
                )}
              </div>
              {hasChildren && open[it.id] && renderToc(it.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container-main py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="sticky top-20 max-h-[75vh] overflow-auto rounded-md border border-border bg-card p-4 text-sm">
          <h3 className="text-lg font-bold mb-3">Table of Contents</h3>
          <nav>{renderToc(TOC)}</nav>
        </aside>

        <section className="prose prose-invert max-w-none">
          <header id="intro" className="text-center max-w-3xl mx-auto py-12">
            <h1 id="brand" className="text-4xl sm:text-5xl font-extrabold mb-3">BharatSetu</h1>
            <h2 id="technical" className="text-xl sm:text-2xl font-semibold mb-2 text-primary">Technical Documentation</h2>
            <p id="connecting" className="text-base sm:text-lg text-foreground/70 mb-1">Connecting Communities to Information, Resources & Public Services</p>
            <p id="tagline" className="text-sm sm:text-base text-foreground/60 italic">AI-Powered Citizen Empowerment Platform</p>
          </header>

          <div className="max-w-4xl mx-auto">
            <h2 id="exec" className="mb-6">Executive Summary</h2>
            <p>BharatSetu is an AI-driven suite of tools designed to empower Indian citizens with accessible information and public services. The platform addresses critical gaps in health literacy, civic awareness, legal rights, and women's health education through five core features, all powered by advanced natural language processing and computer vision technologies.</p>
            <p className="mt-4">The platform leverages Google Gemini 1.5 Flash as the primary language model, with Groq (Llama 3.1) as a fallback, ensuring high-quality, multilingual responses while maintaining zero-cost operation within free tier limits. All features are built with a React frontend and FastAPI backend, deployable on free hosting services.</p>

            <h2 id="1" className="mt-8 mb-4">1. System Architecture</h2>
            <h3 id="1.1" className="mt-4 mb-2">1.1 Technology Stack</h3>
            <h4 id="1.1.1">Frontend</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Framework:</strong> React.js</li>
              <li><strong>Visualization:</strong> Recharts/Chart.js for data presentation</li>
              <li><strong>OCR:</strong> Tesseract.js (client-side processing)</li>
              <li><strong>Speech Recognition:</strong> Web Speech API</li>
              <li><strong>Deployment:</strong> Vercel (free tier)</li>
            </ul>

            <h4 id="1.1.2" className="mt-4">Backend</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Framework:</strong> FastAPI (Python)</li>
              <li><strong>Primary LLM:</strong> Google Gemini 1.5 Flash (15 RPM, 1M TPM free tier)</li>
              <li><strong>Fallback LLM:</strong> Groq (Llama 3.1 70B) for overflow traffic</li>
              <li><strong>OCR Fallback:</strong> Google Cloud Vision API (1000 requests/month free)</li>
              <li><strong>Translation:</strong> Google Translate API (free quota)</li>
              <li><strong>Deployment:</strong> Render.com (750 hours/month free tier)</li>
            </ul>

            <h4 id="1.1.3" className="mt-4">Data Storage</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Static Knowledge Base:</strong> JSON files (in-memory loading)</li>
              <li><strong>Vector Database:</strong> ChromaDB (local, in-memory) for RAG operations</li>
              <li><strong>Optional Session Storage:</strong> Firebase Firestore (1 GB free, 50K reads/day)</li>
              <li><strong>File Storage:</strong> Cloudinary (25 GB free tier)</li>
              <li><strong>Embedding Model:</strong> all-MiniLM-L6-v2 (local, open-source)</li>
            </ul>

            <h3 id="1.2" className="mt-6">1.2 Design Principles</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Privacy-First:</strong> Minimal to zero data retention for sensitive features</li>
              <li><strong>Multilingual:</strong> Support for Hindi, English, and regional languages</li>
              <li><strong>Accessibility:</strong> Voice input/output for low-literacy users</li>
              <li><strong>Cost-Effective:</strong> Entire system operates within free tier limits</li>
              <li><strong>Responsible AI:</strong> Clear disclaimers and limitations, especially for health features</li>
            </ul>

            <h2 id="2" className="mt-8">2. Feature 1: Product Label Auditor (Label Padhega India)</h2>
            <h3 id="2.1" className="mt-4">2.1 Problem Statement</h3>
            <p>Studies indicate that approximately 90% of Indian consumers read product labels, but only 33% check nutrition facts or ingredients [1]. This poor label literacy contributes to unhealthy diets, which now account for 56% of India's disease burden [2]. Non-communicable diseases (NCDs) cause 6 million deaths annually (63% of all deaths in India) [3].</p>

            <h3 id="2.2" className="mt-4">2.2 Solution Overview</h3>
            <p>The Product Label Auditor uses AI to translate complex product labels into simple, personalized health guidance. Users photograph food or cosmetic labels, and the system extracts text via OCR, cross-checks nutritional values against FSSAI and WHO standards, and generates plain-language summaries with health alerts.</p>

            <h3 id="2.3" className="mt-4">2.3 Technical Architecture</h3>
            <h4 id="2.3.1" className="mt-3">Processing Pipeline</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li>Image uploaded by user</li>
              <li>Tesseract.js extracts text (client-side)</li>
              <li>Gemini Flash structures data into JSON schema</li>
              <li>System compares values against FSSAI knowledge base</li>
              <li>Gemini generates personalized analysis based on user health context</li>
              <li>Frontend displays results with visualizations</li>
            </ol>

            <h4 id="2.3.2" className="mt-3">Data Schema</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{\n  "product_name": "",\n  "ingredients": [],\n  "nutrition_per_100g": {},\n  "additives": [],\n  "claims": []\n}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "product_name": "",
  "ingredients": [],
  "nutrition_per_100g": {},
  "additives": [],
  "claims": []
}`}</code></pre>
            </div>

            <h4 id="2.3.3" className="mt-4">Knowledge Base Structure</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{\n  "sugar_daily_limit": "50g",\n  "sodium_limit": "2300mg",\n  "trans_fat_limit": "0g",\n  "saturated_fat_limit": "20g"\n}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "sugar_daily_limit": "50g",
  "sodium_limit": "2300mg",
  "trans_fat_limit": "0g",
  "saturated_fat_limit": "20g"
}`}</code></pre>
            </div>

            <h4 id="2.3.4" className="mt-4">User Interaction Flow</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li>User inputs health condition via text or voice (e.g., diabetes, hypertension)</li>
              <li>User uploads product label image</li>
              <li>System processes and generates personalized analysis</li>
              <li>
                Results displayed as:
                <ul className="ml-6 list-disc space-y-1">
                  <li>Text/audio output in user's preferred language</li>
                  <li>Bar charts showing nutritional content per 100g</li>
                  <li>Highlighted flags for health concerns or false claims</li>
                  <li>Educational videos about misleading products (optional section)</li>
                </ul>
              </li>
            </ol>

            <h3 id="2.4" className="mt-6">2.4 Data Storage</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Anonymous analysis history (no personally identifiable information)</li>
              <li>Aggregate statistics for product categories</li>
              <li>User preference settings (language, health conditions)</li>
            </ul>
            <p className="mt-2"><strong>Cloudinary (25 GB free)</strong> for temporary image storage with automatic deletion after analysis.</p>

            <h2 id="3" className="mt-8">3. Feature 2: CivicSense (Awareness & Reporting)</h2>
            <h3 id="3.1" className="mt-4">3.1 Problem Statement</h3>
            <p>Despite infrastructure initiatives like Swachh Bharat Mission, approximately 157 million Indians (11% of the population) still practiced open defecation as of 2022 [4]. Civic issues such as littering, waste dumping, and public space neglect persist due to lack of awareness and accessible reporting mechanisms.</p>

            <h3 id="3.2" className="mt-4">3.2 Solution Overview</h3>
            <p>CivicSense empowers citizens to report civic issues through an intelligent complaint routing system. The platform identifies the issue type, determines the appropriate authority, drafts professional complaints, and provides multiple submission channels without requiring complex navigation of government portals.</p>

            <h3 id="3.3" className="mt-4">3.3 Technical Architecture</h3>
            <h4 id="3.3.1" className="mt-3">Processing Pipeline</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li><strong>User Input:</strong> Text/voice complaint with optional image/video proof</li>
              <li><strong>Language Detection:</strong> Automatic detection of Hindi, English, or regional language</li>
              <li><strong>Issue Extraction:</strong> Gemini Flash identifies issue type and urgency level</li>
              <li><strong>Authority Resolution:</strong> Maps location + issue type to appropriate department</li>
              <li><strong>Complaint Formatting:</strong> Generates professional complaint message with all details</li>
              <li><strong>Multi-Channel Presentation:</strong> Shows user available submission options</li>
            </ol>

            <h4 id="3.3.2" className="mt-4">Authority Database Structure</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{
  "maharashtra": {
    "pune": {
      "garbage_disposal": {
        "authority": "PMC Solid Waste Management",
        "channels": {
          "whatsapp": "+91-20-XXXX-XXXX",
          "web_portal": "https://portal.punecorporation.org",
          "email": "swm.pmc@punecorporation.org",
          "phone": "020-26123456"
        },
        "expected_response_time": "48 hours",
        "escalation": {
          "if_no_response": "Commissioner Office",
          "contact": "commissioner@pmc.gov.in"
        }
      }
    }
  }
}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "maharashtra": {
    "pune": {
      "garbage_disposal": {
        "authority": "PMC Solid Waste Management",
        "channels": {
          "whatsapp": "+91-20-XXXX-XXXX",
          "web_portal": "https://portal.punecorporation.org",
          "email": "swm.pmc@punecorporation.org",
          "phone": "020-26123456"
        },
        "expected_response_time": "48 hours",
        "escalation": {
          "if_no_response": "Commissioner Office",
          "contact": "commissioner@pmc.gov.in"
        }
      }
    }
  }
}`}</code></pre>
            </div>

            <h4 id="3.3.3" className="mt-4">Submission Tiers</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Tier 1 - Direct Channels (User sends directly):</strong>
                <ul className="ml-6 list-disc">
                  <li>WhatsApp: Pre-filled message with proof attached</li>
                  <li>Email: Formatted email with subject and attachments</li>
                  <li>SMS: Short summary for toll-free numbers</li>
                </ul>
              </li>
              <li><strong>Tier 2 - Semi-Automated:</strong>
                <ul className="ml-6 list-disc">
                  <li>Pre-filled web portal links with query parameters</li>
                  <li>User clicks to open form with data pre-populated</li>
                </ul>
              </li>
              <li><strong>Tier 3 - Manual Information:</strong>
                <ul className="ml-6 list-disc">
                  <li>Contact information displayed (phone, office address)</li>
                  <li>Mobile app download links</li>
                  <li>Office visit hours and location</li>
                </ul>
              </li>
            </ul>

            <h3 id="3.4" className="mt-6">3.4 Data Sources for Authority Database</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Government websites: punecorporation.org, maharashtra.gov.in/grievances</li>
              <li>Swachhata App: National cleanliness grievance platform</li>
              <li>CPGRAMS: Central Public Grievance Redress System</li>
              <li>State CM Helpline numbers</li>
              <li>Manual verification through municipal corporation contacts</li>
            </ul>

            <h3 id="3.5" className="mt-6">3.5 Data Storage</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Anonymous complaint history (no personal identification)</li>
              <li>Complaint status tracking</li>
              <li>Aggregate statistics for heat map visualization</li>
            </ul>

            {/* Remaining sections omitted for brevity in this patch - full content to be added */}
          </div>
        </section>
      </div>
    </div>
  );
}

