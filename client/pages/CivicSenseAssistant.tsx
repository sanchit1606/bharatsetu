import { useMemo, useRef, useState } from "react";
import { HeroSection, Section } from "@/components/ui/section";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Input, Select, Textarea } from "@/components/ui/input-custom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  ClipboardCopy,
  FileImage,
  MapPin,
  ShieldCheck,
  Trash2,
} from "lucide-react";

type CivicCategory =
  | "Roads & Potholes"
  | "Water Supply"
  | "Sanitation & Waste"
  | "Streetlights / Electricity"
  | "Public Safety"
  | "Public Transport"
  | "Govt Office / Service Delay"
  | "Corruption / Bribery"
  | "Other";

type Urgency = "Low" | "Medium" | "High" | "Emergency";

const CATEGORY_OPTIONS: Array<{ value: CivicCategory; label: string }> = [
  { value: "Roads & Potholes", label: "Roads & potholes" },
  { value: "Water Supply", label: "Water supply" },
  { value: "Sanitation & Waste", label: "Sanitation & waste" },
  { value: "Streetlights / Electricity", label: "Streetlights / electricity" },
  { value: "Public Safety", label: "Public safety" },
  { value: "Public Transport", label: "Public transport" },
  { value: "Govt Office / Service Delay", label: "Govt office / service delay" },
  { value: "Corruption / Bribery", label: "Corruption / bribery" },
  { value: "Other", label: "Other" },
];

const URGENCY_OPTIONS: Array<{ value: Urgency; label: string }> = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Emergency", label: "Emergency" },
];

function authoritiesFor(category: CivicCategory) {
  switch (category) {
    case "Roads & Potholes":
      return {
        primary: "Municipal Corporation / Nagar Parishad",
        others: ["Public Works Department (PWD)"],
        channelHints: ["Municipal complaint portal / app", "Ward office / helpline"],
      };
    case "Water Supply":
      return {
        primary: "Municipal Water Department / Jal Vibhag",
        others: ["Ward office"],
        channelHints: ["Water supply helpline", "Municipal complaint portal"],
      };
    case "Sanitation & Waste":
      return {
        primary: "Municipal Sanitation Department",
        others: ["Ward office"],
        channelHints: ["Swachhata / municipal helpline", "Municipal complaint portal"],
      };
    case "Streetlights / Electricity":
      return {
        primary: "Local Electricity Distribution Company",
        others: ["Municipal Streetlight Dept (if applicable)"],
        channelHints: ["Electricity complaint number", "Power company app/portal"],
      };
    case "Public Safety":
      return {
        primary: "Local Police Station / Police Helpline",
        others: ["Municipal control room (for hazards)"],
        channelHints: ["Dial emergency services for immediate danger"],
      };
    case "Public Transport":
      return {
        primary: "City Transport Authority / Depot Manager",
        others: ["Traffic Police (for dangerous driving)"],
        channelHints: ["Transport feedback portal", "Helpline / social grievance"],
      };
    case "Govt Office / Service Delay":
      return {
        primary: "Respective Department Grievance Cell",
        others: ["Public Grievance Portal / CPGRAMS (where applicable)"],
        channelHints: ["Department helpline", "Online grievance portal"],
      };
    case "Corruption / Bribery":
      return {
        primary: "Anti-Corruption Bureau / Vigilance",
        others: ["Departmental vigilance officer"],
        channelHints: ["Prefer written complaint + evidence", "Do not share sensitive info publicly"],
      };
    default:
      return {
        primary: "Municipal Corporation / Local Authority",
        others: ["Ward office"],
        channelHints: ["Municipal complaint portal", "Helpline"],
      };
  }
}

function urgencyStyle(u: Urgency) {
  switch (u) {
    case "Emergency":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "High":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    default:
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  }
}

function safeClipboardCopy(text: string) {
  if (!text) return;
  void navigator.clipboard?.writeText(text);
}

export default function CivicSenseAssistant() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [category, setCategory] = useState<CivicCategory>("Roads & Potholes");
  const [urgency, setUrgency] = useState<Urgency>("Medium");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");

  const [includePersonalContact, setIncludePersonalContact] = useState(false);
  const [consent, setConsent] = useState(false);
  const [generated, setGenerated] = useState(false);

  const where = useMemo(() => {
    const parts = [
      city.trim(),
      state.trim(),
      pincode.trim() ? `PIN ${pincode.trim()}` : "",
      landmark.trim() ? `Near ${landmark.trim()}` : "",
    ].filter(Boolean);
    return parts.join(", ");
  }, [city, state, pincode, landmark]);

  const authority = useMemo(() => authoritiesFor(category), [category]);

  const assistantSummary = useMemo(() => {
    if (!generated) return null;
    const place = where || "the reported location";
    return `Issue: ${category}. Urgency: ${urgency}. Location: ${place}. ${
      description.trim() ? "Your note has been captured for a complaint draft." : "Add a short note to improve the draft."
    }`;
  }, [category, urgency, where, description, generated]);

  const actionPlan = useMemo(() => {
    if (!generated) return [];
    const steps: string[] = [];
    steps.push("Capture clear photos (wide + close-up) and note the exact location and date/time.");
    steps.push("Submit on the official portal/helpline for your area; keep the complaint/ticket number.");
    steps.push("If no action in 48–72 hours, escalate to the ward office/grievance cell with the ticket number.");
    if (urgency === "Emergency") steps.unshift("If there is immediate danger, contact emergency services first.");
    return steps;
  }, [generated, urgency]);

  const complaintDraft = useMemo(() => {
    if (!generated) return "";
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    const place = where || "[City, State, PIN, Landmark]";
    const desc = description.trim() || "[Describe the issue in 1–2 lines. Mention impact and any risks.]";

    const contactLine = includePersonalContact
      ? "\n\nContact:\nName: [Your name]\nPhone/Email: [Your contact]"
      : "";

    return `To,\n${authority.primary}\n\nSubject: Complaint regarding ${category} at ${place}\n\nRespected Sir/Madam,\n\nI would like to report an issue related to ${category} at ${place}. Urgency: ${urgency}.\n\nDetails:\n${desc}\n\nRequest:\nKindly take the necessary action at the earliest and share the complaint/ticket number for tracking.\n\nDate: ${dateStr}${contactLine}\n\nThank you,\n[Your name]`;
  }, [generated, authority.primary, category, where, description, urgency, includePersonalContact]);

  const openPicker = () => fileInputRef.current?.click();

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    setGenerated(false);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(f ? URL.createObjectURL(f) : null);
  };

  const clearImage = () => {
    setImageFile(null);
    setGenerated(false);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canGenerate = consent && (description.trim().length > 0 || !!imageFile || where.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection
        subtitle="CivicSense"
        title="CivicSense Assistant"
        description="Report civic issues with clarity. Get a ready-to-send complaint draft, recommended authorities, and a simple action plan."
      />

      <Section className="pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">Report details</p>
                    <p className="text-sm text-foreground/60">
                      Add what happened + where. Photo is optional but helps.
                    </p>
                  </div>
                  <div
                    className={[
                      "px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap",
                      urgencyStyle(urgency),
                    ].join(" ")}
                  >
                    {urgency}
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CivicCategory)}
                    options={CATEGORY_OPTIONS}
                  />
                  <Select
                    label="Urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as Urgency)}
                    options={URGENCY_OPTIONS}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <Input
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Pincode (optional)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 411001"
                    inputMode="numeric"
                  />
                  <Input
                    label="Landmark (optional)"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near XYZ hospital"
                  />
                </div>

                <Textarea
                  label="What happened?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write 2–4 lines. What is the issue, since when, and how it affects people?"
                  rows={5}
                />

                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Privacy & safety</p>
                      <p className="text-sm text-foreground/70">
                        Avoid sharing sensitive personal details. If this is an emergency, contact local emergency services first.
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex flex-col gap-4">
                <div className="flex items-start gap-3 w-full">
                  <Checkbox
                    id="include-contact"
                    checked={includePersonalContact}
                    onCheckedChange={(v) => setIncludePersonalContact(Boolean(v))}
                  />
                  <div className="flex-1">
                    <Label htmlFor="include-contact" className="text-sm font-medium text-foreground">
                      Include my contact placeholders in the complaint draft
                    </Label>
                    <p className="text-xs text-foreground/60">
                      We’ll include a contact section with placeholders (you can fill it before sending).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 w-full">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(Boolean(v))}
                  />
                  <div className="flex-1">
                    <Label htmlFor="consent" className="text-sm font-medium text-foreground">
                      I confirm this report is genuine and I’m not sharing sensitive information
                    </Label>
                    <p className="text-xs text-foreground/60">
                      This gatekeeps “assistant” generation and reduces misuse in the prototype.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => setGenerated(true)}
                    disabled={!canGenerate}
                  >
                    Generate assistance
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setGenerated(false);
                      setDescription("");
                      setCity("");
                      setState("");
                      setPincode("");
                      setLandmark("");
                      setConsent(false);
                      setIncludePersonalContact(false);
                    }}
                  >
                    Reset form
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-lg font-semibold text-foreground">Optional photo</p>
                <p className="text-sm text-foreground/60">Upload one image of the issue/notice/poster.</p>
              </CardHeader>
              <CardBody className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={onPickImage}
                />

                {!imageUrl ? (
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6">
                    <div className="flex items-start gap-3">
                      <FileImage className="w-5 h-5 text-foreground/70 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Add a photo (optional)</p>
                        <p className="text-sm text-foreground/60">
                          Clear photos make it easier to classify and escalate. Supported: png/jpg/jpeg/webp.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button onClick={openPicker}>Upload image</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-border overflow-hidden bg-background">
                      <img
                        src={imageUrl}
                        alt="Uploaded civic context"
                        className="w-full h-auto block"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" onClick={openPicker}>
                        Replace image
                      </Button>
                      <Button variant="ghost" className="text-destructive" onClick={clearImage}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/60">
                      File: {imageFile?.name} ({imageFile ? Math.round(imageFile.size / 1024) : 0} KB)
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <p className="text-lg font-semibold text-foreground">Assistant output</p>
                <p className="text-sm text-foreground/60">
                  Clean, ready-to-use guidance (interface-only in this prototype).
                </p>
              </CardHeader>
              <CardBody className="space-y-5">
                {!generated ? (
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-foreground/70 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Nothing generated yet</p>
                        <p className="text-sm text-foreground/70">
                          Fill the form and click <span className="font-semibold">Generate assistance</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-border bg-background p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Quick summary</p>
                      <p className="text-sm text-foreground/80">{assistantSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border bg-background p-4">
                        <p className="text-sm font-semibold text-foreground mb-2">Recommended authority</p>
                        <p className="text-sm text-foreground/80">{authority.primary}</p>
                        {authority.others.length > 0 && (
                          <ul className="mt-2 text-sm text-foreground/70 list-disc pl-5">
                            {authority.others.map((o) => (
                              <li key={o}>{o}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="rounded-lg border border-border bg-background p-4">
                        <p className="text-sm font-semibold text-foreground mb-2">Suggested channels</p>
                        <ul className="text-sm text-foreground/70 list-disc pl-5">
                          {authority.channelHints.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">What to do next</p>
                      <ol className="text-sm text-foreground/80 list-decimal pl-5 space-y-1">
                        {actionPlan.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground">Complaint draft</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 py-2 text-sm"
                          onClick={() => safeClipboardCopy(complaintDraft)}
                        >
                          <ClipboardCopy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap text-foreground/80 bg-muted/20 border border-border rounded-lg p-3 overflow-auto max-h-96">
{complaintDraft}
                      </pre>
                      <p className="text-xs text-foreground/60 mt-2">
                        Tip: replace placeholders and add your ticket number once you submit.
                      </p>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}


