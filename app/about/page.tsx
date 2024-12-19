import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dot-pattern text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">About KapaSiyaG1 AI Translator</h1>
        <div className="space-y-4">
          <p>
            KapaSiyaG1 AI Translator is an innovative language translation tool that leverages the power of artificial intelligence to provide accurate and context-aware translations between Hinglish, English, and Hindi.
          </p>
          <p>
            Our mission is to break down language barriers and facilitate seamless communication across different linguistic communities. Whether you're a student, professional, or simply curious about languages, our AI-powered translator is here to assist you.
          </p>
          <p>
            Key features of KapaSiyaG1 AI Translator include:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Hinglish to English translation</li>
            <li>English to Hinglish translation</li>
            <li>English to Hindi translation</li>
            <li>User-friendly interface for both desktop and mobile devices</li>
            <li>Fast and accurate translations powered by advanced AI models</li>
          </ul>
          <p>
            We are constantly working to improve our translation capabilities and expand our language offerings. Stay tuned for more updates and features!
          </p>
        </div>
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        © 2024 KapaSiyaG1 AI Translator. All rights reserved.
      </footer>
    </div>
  )
}

