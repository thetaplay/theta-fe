import { IOSHeader } from '@/components/IOSHeader'
import { ArrowUpRight } from 'lucide-react'
import { ArrowDownLeft } from '@/components/sf-symbols'

export default function TradePage() {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <IOSHeader title="Trade" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 flex flex-col items-center justify-center gap-8 mt-0">
          {/* Placeholder Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowUpRight size={40} className="text-primary" fill="currentColor" />
          </div>

          {/* Coming Soon Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Trading Features Coming Soon
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Real-time trading interface with advanced charting and order execution will be available soon.
            </p>
          </div>

          {/* Feature Preview */}
          <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border soft-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ArrowUpRight size={20} className="text-primary" fill="currentColor" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Live Charts</p>
                <p className="text-xs text-muted-foreground">Real-time price data</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border soft-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ArrowDownLeft size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Smart Orders</p>
                <p className="text-xs text-muted-foreground">Advanced trading tools</p>
              </div>
            </div>
          </div>

          {/* Notify Me Button */}
          <button className="w-full max-w-xs bg-primary text-white font-semibold py-3 rounded-2xl active:scale-95 transition-transform">
            Notify Me When Ready
          </button>
        </div>
      </div>
  )
}
