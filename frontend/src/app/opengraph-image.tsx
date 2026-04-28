import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Rawaj — AI-powered CRM & growth engine'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0B0B14 0%, #14141F 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 64,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #C8FE5E, #594FBF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#0B0B14',
            }}
          />
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#EDEDF2',
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}
        >
          Rawaj
        </h1>
        <p
          style={{
            fontSize: 28,
            color: '#B8B8C8',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          AI-powered CRM & growth engine for Gulf e-commerce
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
