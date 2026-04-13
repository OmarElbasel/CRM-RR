'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Copy, Check, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react'

interface KeyState {
  publicKey: string
  secretKey: string | null  // null until rotated in this session
  rotatedAt: string | null
}

interface ApiKeysClientProps {
  initialPublicKey: string
}

export function ApiKeysClient({ initialPublicKey }: ApiKeysClientProps) {
  const { getToken } = useAuth()
  const [keyState, setKeyState] = useState<KeyState>({
    publicKey: initialPublicKey,
    secretKey: null,
    rotatedAt: null,
  })
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<'public' | 'secret' | null>(null)
  const [showRotateDialog, setShowRotateDialog] = useState(false)

  async function handleRotate() {
    setShowRotateDialog(false)
    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/rotate-key/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        alert('Rotation failed. Please try again.')
        return
      }
      const data = await res.json()
      setKeyState({
        publicKey: data.api_key_public,
        secretKey: data.api_key_secret,
        rotatedAt: data.rotated_at,
      })
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string, type: 'public' | 'secret') {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Public key card */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-3">
          <div className="text-sm font-medium text-gray-900">Public Key (pk_live_xxx)</div>
          <div className="text-xs text-gray-500">Safe to use in frontend embed code</div>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 font-mono truncate">
              {keyState.publicKey || 'No key — rotate to generate'}
            </code>
            {keyState.publicKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(keyState.publicKey, 'public')}
                className="rounded-lg"
              >
                {copied === 'public' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Secret key (only shown after rotation) */}
      {keyState.secretKey && (
        <Card className="rounded-xl shadow-sm border-amber-200 bg-amber-50">
          <CardContent className="p-6 space-y-3">
            <div className="text-sm font-medium text-amber-800">Secret Key — Save this now!</div>
            <div className="text-xs text-amber-600">
              This key will NOT be shown again. Store it securely.
              · لن يُعرض هذا المفتاح مرة أخرى. احفظه الآن.
            </div>
            <div className="flex items-center gap-2 mt-2">
              <code className="flex-1 text-xs bg-white border border-amber-300 rounded-lg px-3 py-2.5 font-mono break-all">
                {keyState.secretKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(keyState.secretKey!, 'secret')}
                className="rounded-lg border-amber-300 hover:bg-amber-100"
              >
                {copied === 'secret' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            {keyState.rotatedAt && (
              <div className="text-xs text-amber-500">
                Rotated at: {new Date(keyState.rotatedAt).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Danger Zone: Rotate Key */}
      <Card className="rounded-xl shadow-sm border-red-200">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>
          <p className="text-xs text-gray-500">
            Rotating invalidates your current key pair immediately. Update any active embeds after rotating.
          </p>
          <Dialog open={showRotateDialog} onOpenChange={setShowRotateDialog}>
            <DialogTrigger
              render={
                <Button
                  variant="destructive"
                  disabled={loading}
                  className="rounded-lg"
                />
              }
            >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Rotating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Rotate Keys
                  </>
                )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rotate API Keys?</DialogTitle>
                <DialogDescription>
                  Rotating keys will immediately invalidate your current API key pair.
                  Any active widget embeds using the old key will stop working.
                  <br /><br />
                  تحذير: سيؤدي هذا إلى إبطال المفاتيح الحالية فوراً.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRotateDialog(false)} className="rounded-lg">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRotate} className="rounded-lg">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Rotate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
