"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, update } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Save, User, ChevronLeft, ChevronRight } from "lucide-react"

interface Employee {
  id: string
  name: string
  monthlySalary: number
  schedules?: { [date: string]: { startTime: string; endTime: string } }
}

interface DaySchedule {
  startTime: string
  endTime: string
}

export default function WorkScheduleTracker() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [schedules, setSchedules] = useState<{ [employeeId: string]: DaySchedule }>({})
  const [loading, setLoading] = useState<{ [employeeId: string]: boolean }>({})

  useEffect(() => {
    const employeesRef = ref(database, 'employees');
    onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employeeList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setEmployees(employeeList);
        
        // Load existing schedules for selected date
        const daySchedules: { [employeeId: string]: DaySchedule } = {};
        employeeList.forEach(emp => {
          const employeeSchedule = emp.schedules?.[selectedDate];
          daySchedules[emp.id] = employeeSchedule || { startTime: "09:00", endTime: "18:00" };
        });
        setSchedules(daySchedules);
      } else {
        setEmployees([]);
      }
    });
  }, [selectedDate]);

  const handleTimeChange = (employeeId: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedules(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value
      }
    }));
  };

  const saveSchedule = async (employeeId: string) => {
    setLoading(prev => ({ ...prev, [employeeId]: true }));
    
    try {
      const schedule = schedules[employeeId];
      const path = `employees/${employeeId}/schedules/${selectedDate}`;
      const updates: any = {};
      updates[path] = schedule;
      
      await update(ref(database), updates);
      
      // Show success feedback (you can add a toast here)
      console.log(`Schedule saved for employee ${employeeId}`);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    } finally {
      setLoading(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  const getTotalHours = (schedule: DaySchedule) => {
    if (!schedule.startTime || !schedule.endTime) return 0;
    
    const start = new Date(`2000-01-01 ${schedule.startTime}`);
    const end = new Date(`2000-01-01 ${schedule.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours > 0 ? diffHours : 0;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile: Date Picker */}
      <div className="md:hidden">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-900">Mesai Tarihi</span>
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-center text-base"
          />
          <div className="mt-2 p-2 bg-red-50 rounded-md">
            <p className="text-xs text-red-700 text-center font-medium">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: Original Date Selection */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              Tarih Seçimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="date-select" className="text-sm font-medium">
                  Mesai Tarihi Seçin
                </Label>
                <Input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 text-center md:text-left"
                />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground">
                  Seçili Tarih
                </Label>
                <div className="mt-1 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-700 text-center md:text-left">
                    {formatDate(selectedDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Employee List */}
      <div className="md:hidden">
        {employees.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Çalışan bulunamadı</p>
              <p className="text-xs text-gray-400 mt-1">
                Çalışan eklemek için Çalışan Yönetimi sayfasını ziyaret edin
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Mesai Saatleri</span>
              </div>
            </div>
            
            {employees.map((employee, index) => {
              const schedule = schedules[employee.id] || { startTime: "09:00", endTime: "18:00" };
              const totalHours = getTotalHours(schedule);
              const isLoading = loading[employee.id];
              const isLastItem = index === employees.length - 1;

              return (
                <div 
                  key={employee.id} 
                  className={`p-4 ${!isLastItem ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Employee Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{employee.name}</h3>
                      <p className="text-xs text-gray-500">
                        {employee.monthlySalary?.toLocaleString('tr-TR')} ₺/ay
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{totalHours.toFixed(1)}h</p>
                      <p className="text-xs text-gray-500">Toplam</p>
                    </div>
                  </div>

                  {/* Time Inputs */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Giriş</label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleTimeChange(employee.id, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-center bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Çıkış</label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleTimeChange(employee.id, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-center bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => saveSchedule(employee.id)}
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors active:bg-red-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span>Kaydediliyor...</span>
                      </div>
                    ) : (
                      'Kaydet'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: Card Layout */}
      <div className="hidden md:block space-y-4">
        <h2 className="text-xl font-semibold">Çalışan Mesai Saatleri</h2>
        
        {employees.map((employee) => {
          const schedule = schedules[employee.id] || { startTime: "09:00", endTime: "18:00" };
          const totalHours = getTotalHours(schedule);
          const isLoading = loading[employee.id];

          return (
            <Card key={employee.id} className="shadow-sm hover:shadow-md transition-shadow border-red-200">
              <CardContent className="p-4">
                {/* Desktop Layout */}
                <div className="space-y-4">
                  {/* Employee Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Maaş: {employee.monthlySalary?.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Start Time */}
                      <div className="space-y-2">
                        <Label htmlFor={`start-${employee.id}`} className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          Giriş Saati
                        </Label>
                        <Input
                          id={`start-${employee.id}`}
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => handleTimeChange(employee.id, 'startTime', e.target.value)}
                          className="w-full text-center text-lg"
                        />
                      </div>

                      {/* End Time */}
                      <div className="space-y-2">
                        <Label htmlFor={`end-${employee.id}`} className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-600" />
                          Çıkış Saati
                        </Label>
                        <Input
                          id={`end-${employee.id}`}
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => handleTimeChange(employee.id, 'endTime', e.target.value)}
                          className="w-full text-center text-lg"
                        />
                      </div>
                    </div>

                    {/* Total Hours and Save Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Toplam Mesai</p>
                        <p className="text-xl font-bold text-red-600">
                          {totalHours.toFixed(1)} saat
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => saveSchedule(employee.id)}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6"
                        size="sm"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {employees.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Henüz çalışan bulunmamaktadır.</p>
              <p className="text-sm text-gray-400 mt-1">
                Çalışan eklemek için Çalışan Yönetimi sayfasını ziyaret edin.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile: Summary */}
      {employees.length > 0 && (
        <div className="md:hidden">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Günlük Özet</span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600">{employees.length}</p>
                  <p className="text-xs text-gray-500">Çalışan</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600">
                    {Object.values(schedules).reduce((sum, schedule) => sum + getTotalHours(schedule), 0).toFixed(1)}h
                  </p>
                  <p className="text-xs text-gray-500">Toplam Saat</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600">
                    {employees.length > 0 ? (Object.values(schedules).reduce((sum, schedule) => sum + getTotalHours(schedule), 0) / employees.length).toFixed(1) : '0.0'}h
                  </p>
                  <p className="text-xs text-gray-500">Ortalama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Summary */}
      {employees.length > 0 && (
        <div className="hidden md:block">
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-center md:text-left flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                Günlük Özet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-red-600">{employees.length}</p>
                  <p className="text-sm text-muted-foreground font-medium">Toplam Çalışan</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    {Object.values(schedules).reduce((sum, schedule) => sum + getTotalHours(schedule), 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Toplam Mesai Saati</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    {employees.length > 0 ? (Object.values(schedules).reduce((sum, schedule) => sum + getTotalHours(schedule), 0) / employees.length).toFixed(1) : '0.0'}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Ortalama Mesai</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
