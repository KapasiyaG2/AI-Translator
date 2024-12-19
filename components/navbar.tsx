"use client"

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-foreground">
          KapaSiyaG1
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <ModeToggle />
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
              <Link href="/about">About</Link>
            </Button>
            <div className="flex justify-between items-center">
              <span className="text-foreground">Theme</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

