import DashboardOverview from "@/components/dashboard-overview"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <DashboardOverview />
        </div>
      </div>
    </ProtectedRoute>
  )
}
