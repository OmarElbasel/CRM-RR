'use client'

type Currency = 'QAR' | 'SAR' | 'USD'

interface CurrencyToggleProps {
  value: Currency
  onChange: (currency: Currency) => void
}

const CURRENCIES: Currency[] = ['QAR', 'SAR', 'USD']

export function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-gray-100 p-0.5">
      {CURRENCIES.map((currency) => (
        <button
          key={currency}
          onClick={() => onChange(currency)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            value === currency
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {currency}
        </button>
      ))}
    </div>
  )
}
