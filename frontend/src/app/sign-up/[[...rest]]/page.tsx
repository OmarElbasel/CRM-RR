import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl relative overflow-hidden mx-auto" style={{ background: 'linear-gradient(135deg, #C8FE5E, #594FBF)' }}>
          <div className="absolute inset-[3px] rounded-lg bg-ink" />
          <div className="absolute left-1/2 top-[3px] bottom-[3px] w-[2px] bg-[#C8FE5E] z-[1]" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-ds-text text-center font-headline">Create your Rawaj account</h1>
      </div>
      <SignUp
        appearance={{
          variables: { colorPrimary: '#594FBF' },
          elements: {
            card: { boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 30px 60px -30px rgba(10,10,20,0.15)', borderRadius: '14px' },
          },
        }}
      />
    </div>
  )
}
