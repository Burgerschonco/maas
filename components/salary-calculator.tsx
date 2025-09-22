"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calculator, Download, FileSpreadsheet, Clock, DollarSign, User, TrendingUp } from "lucide-react"
import * as XLSX from 'xlsx'

interface Employee {
  id: string
  name: string
  monthlySalary: number
  workRecords: { [yearMonth: string]: { [day: string]: number } }
}

export default function SalaryCalculator() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const employeesRef = ref(database, 'employees');
    const listener = onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employeeList: Employee[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setEmployees(employeeList);
      } else {
        setEmployees([]);
      }
    });

    return () => listener();
  }, []);

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const yearMonth = currentDate.toISOString().slice(0, 7);

  const calculateSalaries = () => {
    return employees.map(employee => {
      const workRecord = employee.workRecords?.[yearMonth];
      let totalHours = 0;

      if (workRecord) {
        totalHours = Object.values(workRecord).reduce((acc, hours) => acc + (Number(hours) || 0), 0);
      }

      // Standard monthly hours for full salary
      const standardMonthlyHours = 220;
      const calculatedSalary = (totalHours / standardMonthlyHours) * employee.monthlySalary;
      const hourlyRate = employee.monthlySalary / standardMonthlyHours;

      return {
        ...employee,
        totalHours,
        calculatedSalary,
        hourlyRate,
        workingDays: Math.round(totalHours / 8), // Assuming 8 hours per day
        efficiency: totalHours > 0 ? ((totalHours / standardMonthlyHours) * 100) : 0
      };
    });
  };

  const salaryData = calculateSalaries();

  // Excel Export Function
  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
      
      // Prepare data for Excel
      const excelData = salaryData.map((data, index) => ({
        'Sıra': index + 1,
        'Çalışan Adı': data.name,
        'Aylık Maaş (₺)': data.monthlySalary.toLocaleString('tr-TR'),
        'Toplam Çalışma Saati': data.totalHours,
        'Çalışma Günü': data.workingDays,
        'Saatlik Ücret (₺)': data.hourlyRate.toFixed(2),
        'Hesaplanan Maaş (₺)': data.calculatedSalary.toLocaleString('tr-TR'),
        'Verimlilik (%)': data.efficiency.toFixed(1)
      }));

      // Add summary row
      const totalCalculatedSalary = salaryData.reduce((sum, data) => sum + data.calculatedSalary, 0);
      const totalHours = salaryData.reduce((sum, data) => sum + data.totalHours, 0);
      const averageEfficiency = salaryData.length > 0 ? salaryData.reduce((sum, data) => sum + data.efficiency, 0) / salaryData.length : 0;

      excelData.push({
        'Sıra': '',
        'Çalışan Adı': 'TOPLAM',
        'Aylık Maaş (₺)': '',
        'Toplam Çalışma Saati': totalHours,
        'Çalışma Günü': '',
        'Saatlik Ücret (₺)': '',
        'Hesaplanan Maaş (₺)': totalCalculatedSalary.toLocaleString('tr-TR'),
        'Verimlilik (%)': averageEfficiency.toFixed(1)
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 6 },  // Sıra
        { wch: 20 }, // Çalışan Adı
        { wch: 15 }, // Aylık Maaş
        { wch: 18 }, // Toplam Çalışma Saati
        { wch: 12 }, // Çalışma Günü
        { wch: 15 }, // Saatlik Ücret
        { wch: 18 }, // Hesaplanan Maaş
        { wch: 12 }  // Verimlilik
      ];
      ws['!cols'] = colWidths;

      // Add the sheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, monthName);

      // Generate filename
      const fileName = `Maas_Hesaplama_${monthName.replace(' ', '_')}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      console.log(`Excel dosyası başarıyla oluşturuldu: ${fileName}`);
    } catch (error) {
      console.error('Excel export hatası:', error);
      alert('Excel dosyası oluşturulurken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  const getTotalStats = () => {
    const totalCalculatedSalary = salaryData.reduce((sum, data) => sum + data.calculatedSalary, 0);
    const totalHours = salaryData.reduce((sum, data) => sum + data.totalHours, 0);
    const averageEfficiency = salaryData.length > 0 ? salaryData.reduce((sum, data) => sum + data.efficiency, 0) / salaryData.length : 0;
    
    return {
      totalCalculatedSalary,
      totalHours,
      averageEfficiency,
      employeeCount: salaryData.length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile: Month Navigator & Export */}
      <div className="md:hidden">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {/* Month Navigator */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => changeMonth(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <div className="flex-1 text-center">
              <p className="text-base font-semibold text-gray-900">
                {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <button
              onClick={() => changeMonth(1)}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Excel Export */}
          <button
            onClick={exportToExcel}
            disabled={isExporting || salaryData.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors active:bg-green-800"
          >
            {isExporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>Excel'e Aktarılıyor...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel'e Aktar</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Desktop: Original Header */}
      <div className="hidden md:block">
        <div className="text-center md:text-left space-y-3 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center justify-center md:justify-start gap-3">
                <Calculator className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
                Maaş Hesaplama
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Çalışma saatlerine göre maaş hesaplaması ve Excel çıktısı
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Month Navigator */}
              <div className="flex items-center gap-2 order-2 md:order-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => changeMonth(-1)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Badge className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium min-w-[120px] text-center">
                  {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => changeMonth(1)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Excel Export Button */}
              <Button 
                onClick={exportToExcel}
                disabled={isExporting || salaryData.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white order-1 md:order-2"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )}
                <span className="hidden sm:inline">Excel'e Aktar</span>
                <span className="sm:hidden">Excel</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Summary Stats */}
      <div className="md:hidden">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Özet Bilgiler</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{stats.employeeCount}</p>
                <p className="text-xs text-gray-500">Çalışan</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{stats.totalHours}h</p>
                <p className="text-xs text-gray-500">Toplam Saat</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">
                  {(stats.totalCalculatedSalary / 1000).toFixed(0)}K₺
                </p>
                <p className="text-xs text-gray-500">Toplam Maaş</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{stats.averageEfficiency.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Verimlilik</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Summary Stats */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-red-600">{stats.employeeCount}</div>
                <p className="text-xs md:text-sm text-muted-foreground">Çalışan</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-red-600">{stats.totalHours}</div>
                <p className="text-xs md:text-sm text-muted-foreground">Toplam Saat</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div className="text-sm md:text-xl font-bold text-red-600">
                  {(stats.totalCalculatedSalary / 1000).toFixed(0)}K₺
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Toplam Maaş</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-red-600">{stats.averageEfficiency.toFixed(0)}%</div>
                <p className="text-xs md:text-sm text-muted-foreground">Ort. Verimlilik</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile: Employee Salary List */}
      <div className="md:hidden">
        {salaryData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Hesaplanacak maaş bulunamadı</p>
              <p className="text-xs text-gray-400 mt-1">
                Çalışan eklemek için Çalışan Yönetimi sayfasını ziyaret edin
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Maaş Hesaplamaları</span>
                <span className="text-xs text-gray-500">({salaryData.length})</span>
              </div>
            </div>
            
            {salaryData.map((data, index) => {
              const isLastItem = index === salaryData.length - 1;
              
              return (
                <div 
                  key={data.id} 
                  className={`p-4 ${!isLastItem ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Employee Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{data.name}</h4>
                        <p className="text-xs text-gray-500">
                          {data.efficiency.toFixed(1)}% verimlilik
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-red-600">
                        {(data.calculatedSalary / 1000).toFixed(0)}K₺
                      </p>
                      <p className="text-xs text-gray-500">Hesaplanan</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-bold text-gray-700">
                        {(data.monthlySalary / 1000).toFixed(0)}K₺
                      </p>
                      <p className="text-xs text-gray-500">Aylık</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-bold text-gray-700">{data.totalHours}h</p>
                      <p className="text-xs text-gray-500">Saat</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-bold text-gray-700">{data.workingDays}</p>
                      <p className="text-xs text-gray-500">Gün</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-bold text-gray-700">
                        {data.hourlyRate.toFixed(0)}₺
                      </p>
                      <p className="text-xs text-gray-500">Saatlik</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: Employee Salary Cards */}
      <div className="hidden md:block space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-red-600" />
          <h3 className="text-lg md:text-xl font-semibold">Maaş Hesaplamaları</h3>
          <span className="text-sm text-muted-foreground">({salaryData.length})</span>
        </div>

        {salaryData.length === 0 ? (
          <Card className="border-red-200">
            <CardContent className="text-center py-12">
              <Calculator className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">Hesaplanacak maaş bulunamadı</p>
              <p className="text-sm text-muted-foreground">
                Çalışan eklemek için Çalışan Yönetimi sayfasını ziyaret edin
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {salaryData.map((data) => (
              <Card key={data.id} className="border-red-200 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Employee Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base md:text-lg">{data.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Verimlilik: {data.efficiency.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg md:text-xl font-bold text-red-600">
                          {(data.calculatedSalary / 1000).toFixed(0)}K₺
                        </div>
                        <p className="text-xs text-muted-foreground">Hesaplanan Maaş</p>
                      </div>
                    </div>

                    {/* Employee Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-red-100">
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-sm md:text-base font-bold text-red-600">
                          {(data.monthlySalary / 1000).toFixed(0)}K₺
                        </p>
                        <p className="text-xs text-muted-foreground">Aylık Maaş</p>
                      </div>
                      
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-sm md:text-base font-bold text-red-600">{data.totalHours}</p>
                        <p className="text-xs text-muted-foreground">Toplam Saat</p>
                      </div>
                      
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-sm md:text-base font-bold text-red-600">{data.workingDays}</p>
                        <p className="text-xs text-muted-foreground">Çalışma Günü</p>
                      </div>
                      
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-sm md:text-base font-bold text-red-600">
                          {data.hourlyRate.toFixed(0)}₺
                        </p>
                        <p className="text-xs text-muted-foreground">Saatlik Ücret</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Calculation Info */}
      {salaryData.length > 0 && (
        <div className="md:hidden">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700 text-center">
              <strong>Hesaplama:</strong> (Çalışma Saati / 220) × Aylık Maaş
            </p>
          </div>
        </div>
      )}

      {/* Desktop: Calculation Info */}
      {salaryData.length > 0 && (
        <div className="hidden md:block">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Hesaplama Metodu:</strong> Standart aylık çalışma saati 220 saat kabul edilmektedir. 
                Hesaplanan maaş = (Toplam Çalışma Saati / 220) × Aylık Maaş
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
