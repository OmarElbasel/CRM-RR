'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check } from 'lucide-react'

interface EmbedSnippetsProps {
  apiKeyPublic: string
}

export function EmbedSnippets({ apiKeyPublic }: EmbedSnippetsProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const scriptTag = `<script src="https://widget.rawaj.app/widget.js" data-key="${apiKeyPublic}"></script>`
  const iframeTag = `<iframe src="https://widget.rawaj.app/embed?key=${apiKeyPublic}" width="100%" height="600"></iframe>`

  function copyCode(code: string, label: string) {
    navigator.clipboard.writeText(code)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)

    // Mark onboarding step as complete
    try {
      const state = JSON.parse(localStorage.getItem('rawaj_onboarding') ?? '{}')
      state.embed = true
      localStorage.setItem('rawaj_onboarding', JSON.stringify(state))
    } catch {}
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Embed Code</h3>
        <Tabs defaultValue="script">
          <TabsList className="mb-4">
            <TabsTrigger value="script">Script Tag</TabsTrigger>
            <TabsTrigger value="iframe">iframe</TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="space-y-3">
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">
              {scriptTag}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyCode(scriptTag, 'script')}
              className="rounded-lg"
            >
              {copied === 'script' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === 'script' ? 'Copied!' : 'Copy'}
            </Button>
          </TabsContent>

          <TabsContent value="iframe" className="space-y-3">
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">
              {iframeTag}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyCode(iframeTag, 'iframe')}
              className="rounded-lg"
            >
              {copied === 'iframe' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === 'iframe' ? 'Copied!' : 'Copy'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
