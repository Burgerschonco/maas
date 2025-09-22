import WorkScheduleTracker from "@/components/work-schedule-tracker"
import { ProtectedRoute } from "@/components/protected-route"

export default function SchedulePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <WorkScheduleTracker />
        </div>
      </div>
    </ProtectedRoute>
  )
}
