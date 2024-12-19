import { Translator } from "@/components/translator"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-dot-pattern text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <Translator />
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        © 2024 KapaSiyaG1 AI Translator. All rights reserved.
      </footer>
    </div>
  )
}

