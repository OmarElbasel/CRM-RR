import React from 'react'
import { createRoot } from 'react-dom/client'
import WidgetShell from '@/components/widget/WidgetShell'
import widgetCss from '@/components/widget/widget.css'

;(function () {
  const script =
    document.currentScript ||
    document.querySelector('script[data-api-key]')

  if (!script) {
    console.error('[Rawaj] Could not find script tag with data-api-key attribute.')
    return
  }

  const apiKey = script.getAttribute('data-api-key')
  if (!apiKey) {
    console.error('[Rawaj] data-api-key attribute is required.')
    return
  }

  const containerSelector = script.getAttribute('data-container') || '#rawaj-plugin'
  const lang = (script.getAttribute('data-lang') || 'ar') as 'ar' | 'en' | 'bilingual'
  const theme = (script.getAttribute('data-theme') || 'auto') as 'dark' | 'light' | 'auto'
  const apiBaseUrl = script.getAttribute('data-api-url') || 'https://api.rawaj.io'

  const container = document.querySelector(containerSelector)
  if (!container) {
    console.error(`[Rawaj] Container element "${containerSelector}" not found.`)
    return
  }

  // Create Shadow DOM for CSS isolation
  const shadowRoot = container.attachShadow({ mode: 'open' })

  // Inject widget CSS directly into shadow root (style-loader targets document.head, not shadow root)
  const styleEl = document.createElement('style')
  styleEl.textContent = typeof widgetCss === 'string' ? widgetCss : ''
  shadowRoot.appendChild(styleEl)

  const mountPoint = document.createElement('div')
  shadowRoot.appendChild(mountPoint)

  // Render widget
  const root = createRoot(mountPoint)
  root.render(
    React.createElement(WidgetShell, {
      apiKey,
      apiBaseUrl,
      defaultLanguage: lang,
      theme,
      isIframe: false,
    })
  )
})()
