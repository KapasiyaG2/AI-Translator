'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Copy, Check, Languages } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export function Translator() {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('hin-en')
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate.")
      return
    }

    setIsTranslating(true)
    setError('')
    setTranslatedText('')

    try {
      const result = await convertToFormalEnglish(inputText, targetLanguage)
      setTranslatedText(result)
    } catch (error) {
      console.error('Translation error:', error)
      setError(`An error occurred during translation: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
    } finally {
      setIsTranslating(false)
    }
  }

  const convertToFormalEnglish = async (text: string, targetLanguage: string) => {
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
    const API_KEY = "PUT_YOUR_API_KEY"

    if (!API_KEY) {
      throw new Error("API key is not set. Please check your environment variables.")
    }

    const prompt = 
      targetLanguage === 'hin-en'
        ? `Convert this Hinglish sentence into polite and grammatically correct English in one sentence: "${text}"`
        : targetLanguage === 'hi-en'
        ? `Convert this English sentence into Hinglish in one sentence: "${text}"`
        : `Convert this English sentence into Hindi in one sentence: "${text}"`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }

    const headers = {
      "Content-Type": "application/json",
    }

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()

      if (!result.candidates || result.candidates.length === 0) {
        throw new Error("No translation result received from the API.")
      }

      return result.candidates[0]?.content?.parts[0]?.text || "No translation available."
    } catch (error) {
      console.error('Error in convertToFormalEnglish:', error)
      throw error
    }
  }

  const handleCopy = async () => {
    if (translatedText) {
      try {
        await navigator.clipboard.writeText(translatedText)
        setIsCopied(true)
        toast({
          description: "Text copied to clipboard!",
          duration: 2000,
        })
      } catch (err) {
        console.error('Failed to copy text: ', err)
        toast({
          description: "Failed to copy text. Please try again.",
          duration: 2000,
        })
      } finally {
        setTimeout(() => setIsCopied(false), 2000)
      }
    }
  }

  return (
    <Card className="w-full bg-card/50 border-border backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center text-card-foreground flex items-center justify-center">
          <Languages className="w-6 h-6 md:w-8 md:h-8 mr-2 text-primary" />
          AI Translator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="input-text-desktop" className="text-foreground text-lg">Enter text</Label>
            <Textarea
              id="input-text-desktop"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here"
              className="min-h-[300px] resize-none bg-background/50 text-foreground border-input focus:ring-ring focus:border-ring text-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="translated-text-desktop" className="text-foreground text-lg">Translated text</Label>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={handleCopy}
                disabled={!translatedText}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <Textarea
              id="translated-text-desktop"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here"
              className="min-h-[300px] resize-none bg-background/50 text-foreground border-input text-lg"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-text-mobile" className="text-foreground text-base">Enter text</Label>
            <Textarea
              id="input-text-mobile"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here"
              className="min-h-[150px] resize-none bg-background/50 text-foreground border-input focus:ring-ring focus:border-ring text-base"
            />
          </div>

          <div className="space-y-4 py-4">
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
            >
              <SelectTrigger className="w-full bg-background/50 text-foreground border-input">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground border-border">
                <SelectItem value="hin-en">Hinglish to English</SelectItem>
                <SelectItem value="hi-en">English to Hinglish</SelectItem>
                <SelectItem value="en-hi">English to Hindi</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background py-6 text-lg"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate'
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="translated-text-mobile" className="text-foreground text-base">Translated text</Label>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={handleCopy}
                disabled={!translatedText}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2 text-sm">{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <Textarea
              id="translated-text-mobile"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here"
              className="min-h-[150px] resize-none bg-background/50 text-foreground border-input text-base"
            />
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex lg:flex-row justify-center items-stretch gap-4 pt-4">
          <Select
            value={targetLanguage}
            onValueChange={setTargetLanguage}
          >
            <SelectTrigger className="w-[200px] bg-background/50 text-foreground border-input">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground border-border">
              <SelectItem value="hin-en">Hinglish to English</SelectItem>
              <SelectItem value="hi-en">English to Hinglish</SelectItem>
              <SelectItem value="en-hi">English to Hindi</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="w-[200px] bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background py-3"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/50 text-destructive-foreground border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

