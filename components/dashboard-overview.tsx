"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calculator, Calendar, TrendingUp, Clock, DollarSign, Target, Award } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

// Sample data for charts
const salaryDistribution = [
  { range: "25.000₺", count: 5, color: "#be123c" },
  { range: "26.000₺", count: 2, color: "#ec4899" },
  { range: "30.000₺", count: 2, color: "#fdf2f8" },
  { range: "36.000₺", count: 2, color: "#475569" },
]

const monthlyData = [
  { month: "Ocak", totalSalary: 311000, workingDays: 22 },
  { month: "Şubat", totalSalary: 311000, workingDays: 20 },
  { month: "Mart", totalSalary: 311000, workingDays: 21 },
  { month: "Nisan", totalSalary: 311000, workingDays: 22 },
  { month: "Mayıs", totalSalary: 311000, workingDays: 23 },
  { month: "Haziran", totalSalary: 311000, workingDays: 21 },
]

export default function DashboardOverview() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const employeesRef = ref(database, 'employees/');
    onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      const employeesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setEmployees(employeesList);
      setLoading(false);
    });
  }, [])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  const totalEmployees = employees.length
  const totalMonthlySalary = employees.reduce((sum, emp) => sum + (Number(emp.monthlySalary) || 0), 0)
  const averageSalary = totalEmployees > 0 ? Math.round(totalMonthlySalary / totalEmployees) : 0
  const totalYearlySalary = totalMonthlySalary * 12

  const calculateDailySalary = (employee: any) => {
    const monthlySalary = Number(employee.monthlySalary) || 0;
    // Assuming 30 days in a month for daily salary calculation on the dashboard
    return monthlySalary / 30;
  };

  const totalDailySalary = employees.reduce((sum, emp) => sum + calculateDailySalary(emp), 0)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="text-center md:text-left space-y-2 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center justify-center md:justify-start gap-3">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              Dashboard
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Maaş yönetim sistemi genel durumu
            </p>
          </div>
          <Badge className="flex items-center gap-2 mx-auto md:mx-0 mt-2 md:mt-0 w-fit bg-red-600 hover:bg-red-700">
            <TrendingUp className="h-4 w-4" />
            Canlı Veriler
          </Badge>
        </div>
      </div>

      {/* Key Metrics - Red Theme */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-red-600">{totalEmployees}</div>
              <p className="text-xs md:text-sm text-muted-foreground">Toplam Çalışan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-red-600">
                {(totalMonthlySalary / 1000).toFixed(0)}K₺
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Aylık Toplam</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-red-600">
                {(averageSalary / 1000).toFixed(0)}K₺
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Ortalama Maaş</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-red-600">
                {(Math.round(totalDailySalary) / 1000).toFixed(0)}K₺
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Günlük Toplam</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Mobile Optimized */}
      <div className="space-y-4 md:space-y-6">
        {/* Mobile: Single column, Desktop: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Salary Distribution Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                Maaş Dağılımı
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Çalışanların maaş aralıklarına göre dağılımı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salaryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Salary Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                Aylık Maaş Trendi
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Son 6 ayın maaş ödemesi trendi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}₺`, "Toplam Maaş"]} />
                  <Bar dataKey="totalSalary" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Employee Summary - Mobile Optimized */}
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top Earners */}
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                En Yüksek Maaşlılar
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Maaş sıralamasında ilk 5 çalışan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {employees
                  .sort((a, b) => b.monthlySalary - a.monthlySalary)
                  .slice(0, 5)
                  .map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between p-2 md:p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm md:text-base text-foreground truncate">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">Çalışan</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm md:text-base text-red-700">
                          {employee.monthlySalary.toLocaleString()}₺
                        </p>
                        <p className="text-xs text-muted-foreground">Aylık</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* System Statistics */}
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Calculator className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                Sistem İstatistikleri
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Genel sistem kullanım bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="text-xl md:text-2xl font-bold text-red-600">
                    {(totalYearlySalary / 1000000).toFixed(1)}M₺
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">Yıllık Toplam Maaş</p>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                    <span className="text-xs md:text-sm text-muted-foreground">En Düşük Maaş:</span>
                    <span className="font-medium text-xs md:text-sm text-red-700">25.000₺</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                    <span className="text-xs md:text-sm text-muted-foreground">En Yüksek Maaş:</span>
                    <span className="font-medium text-xs md:text-sm text-red-700">36.000₺</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-100 rounded border border-red-200">
                    <span className="text-xs md:text-sm text-muted-foreground">Maaş Farkı:</span>
                    <span className="font-medium text-xs md:text-sm text-red-600">11.000₺</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions Summary - Red Theme */}
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg text-center md:text-left flex items-center justify-center md:justify-start gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Sistem Özellikleri
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-center md:text-left">
            Maaş hesaplama sisteminin tüm özelliklerine hızlı erişim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-red-200">
              <h4 className="font-semibold text-sm md:text-base text-foreground flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-red-600" />
                </div>
                Çalışan Yönetimi
              </h4>
              <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {totalEmployees} aktif çalışan
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Çalışan ekleme/çıkarma
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Bilgi güncelleme
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Maaş düzenleme
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-red-200">
              <h4 className="font-semibold text-sm md:text-base text-foreground flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-red-600" />
                </div>
                Maaş Hesaplama
              </h4>
              <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Otomatik hesaplama
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Saatlik ücret hesabı
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Günlük maaş hesabı
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Aylık toplam hesabı
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-red-200">
              <h4 className="font-semibold text-sm md:text-base text-foreground flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-red-600" />
                </div>
                Çalışma Takibi
              </h4>
              <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Günlük çalışma takibi
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Mesai saati ayarlama
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Tarih bazlı planlama
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Anlık hesaplama
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
