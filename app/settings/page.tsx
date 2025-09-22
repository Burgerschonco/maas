import { ProtectedRoute } from "@/components/protected-route"
import SettingsPage from "@/components/settings-page"

export default function Settings() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <SettingsPage />
        </div>
      </div>
    </ProtectedRoute>
  )
}
