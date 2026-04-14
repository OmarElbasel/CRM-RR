'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface SeasonalTemplate {
  id: number
  name: string
  occasion: string
  body_ar: string
  body_en: string
  sort_order: number
}

interface SeasonalTemplateGalleryProps {
  onSelect: (template: SeasonalTemplate) => void
}

export function SeasonalTemplateGallery({ onSelect }: SeasonalTemplateGalleryProps) {
  const { getToken } = useAuth()
  const [templates, setTemplates] = useState<SeasonalTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/api/content/seasonal-templates/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch templates')
        setTemplates(await res.json())
      } catch {
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [getToken])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader><div className="h-5 w-24 rounded bg-gray-200" /></CardHeader>
            <CardContent><div className="h-4 w-full rounded bg-gray-100" /></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <Badge variant="outline">{template.occasion.replace(/_/g, ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => onSelect(template)}>Use Template</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
