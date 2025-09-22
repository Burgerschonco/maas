import EmployeeManagement from "@/components/employee-management"
import { ProtectedRoute } from "@/components/protected-route"

export default function EmployeesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <EmployeeManagement />
        </div>
      </div>
    </ProtectedRoute>
  )
}
