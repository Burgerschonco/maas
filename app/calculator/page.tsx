import SalaryCalculator from "@/components/salary-calculator"
import { ProtectedRoute } from "@/components/protected-route"

export default function CalculatorPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <SalaryCalculator />
        </div>
      </div>
    </ProtectedRoute>
  )
}
