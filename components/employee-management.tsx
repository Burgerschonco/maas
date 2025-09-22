"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, push, set, remove, update } from "firebase/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, User } from "lucide-react"

interface Employee {
  id: string
  name: string
  dailyHours: number
  monthlySalary: number
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dailyHours: 10,
    monthlySalary: 25000,
  })

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
      } else {
        setEmployees([]);
      }
    });
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      dailyHours: 10,
      monthlySalary: 25000,
    })
  }

  const handleAddEmployee = () => {
    const newEmployeeRef = push(ref(database, 'employees'));
    set(newEmployeeRef, formData);
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      dailyHours: employee.dailyHours,
      monthlySalary: employee.monthlySalary,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      const employeeRef = ref(database, `employees/${editingEmployee.id}`);
      update(employeeRef, formData);
      setIsEditDialogOpen(false)
      setEditingEmployee(null)
      resetForm()
    }
  }

  const handleDeleteEmployee = (id: string) => {
    const employeeRef = ref(database, `employees/${id}`);
    remove(employeeRef);
  }

  const calculateHourlyRate = (employee: Employee) => {
    const dailySalary = employee.monthlySalary / 22
    return dailySalary / employee.dailyHours
  }

  const calculateDailySalary = (employee: Employee) => {
    return employee.monthlySalary / 22
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="text-center md:text-left space-y-3 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center justify-center md:justify-start gap-3">
              <User className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              Çalışan Yönetimi
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Çalışan bilgilerini ekleyin, düzenleyin ve yönetin
            </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
              <Button className="flex items-center gap-2 mx-auto md:mx-0 bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Yeni Çalışan Ekle</span>
                <span className="sm:hidden">Ekle</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
              <DialogDescription>Yeni çalışan bilgilerini girin</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Çalışan adı soyadı"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dailyHours">Günlük Çalışma Saati</Label>
                  <Input
                    id="dailyHours"
                    type="number"
                    value={formData.dailyHours}
                    onChange={(e) => setFormData({ ...formData, dailyHours: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="monthlySalary">Aylık Maaş (₺)</Label>
                  <Input
                    id="monthlySalary"
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleAddEmployee} className="bg-red-600 hover:bg-red-700">Ekle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Mobile: Stats */}
      <div className="md:hidden">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">İstatistikler</span>
            </div>
      </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{employees.length}</p>
                <p className="text-xs text-gray-500">Çalışan</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">
                  {employees.length > 0 ? Math.round(
                    employees.reduce((sum, emp) => sum + emp.monthlySalary, 0) / employees.length / 1000,
                  ).toFixed(0) : 0}K₺
                </p>
                <p className="text-xs text-gray-500">Ortalama</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">
                  {(employees.reduce((sum, emp) => sum + emp.monthlySalary, 0) / 1000).toFixed(0)}K₺
                </p>
                <p className="text-xs text-gray-500">Toplam</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Stats */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-red-600">{employees.length}</div>
                <p className="text-xs md:text-sm text-muted-foreground">Toplam Çalışan</p>
              </div>
          </CardContent>
        </Card>
          
          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-red-600">
              {employees.length > 0 ? Math.round(
                    employees.reduce((sum, emp) => sum + emp.monthlySalary, 0) / employees.length / 1000,
                  ).toFixed(0) : 0}K₺
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Ortalama Maaş</p>
            </div>
          </CardContent>
        </Card>
          
          <Card className="border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-red-600">
                  {(employees.reduce((sum, emp) => sum + emp.monthlySalary, 0) / 1000).toFixed(0)}K₺
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Toplam Maaş</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Mobile: Employee List */}
      <div className="md:hidden">
        {employees.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Henüz çalışan eklenmemiş</p>
              <p className="text-xs text-gray-400 mt-1">
                Yeni çalışan eklemek için yukarıdaki butonu kullanın
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Çalışanlar</span>
                <span className="text-xs text-gray-500">({employees.length})</span>
              </div>
            </div>
            
            {employees.map((employee, index) => {
              const isLastItem = index === employees.length - 1;
              
              return (
                <div 
                  key={employee.id} 
                  className={`p-4 ${!isLastItem ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Employee Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{employee.name}</h4>
                        <p className="text-xs text-gray-500">
                          {(employee.monthlySalary / 1000).toFixed(0)}K₺/ay
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="text-red-600 text-xs font-medium"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 text-xs font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  {/* Employee Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-bold text-gray-700">{employee.dailyHours}h</p>
                      <p className="text-xs text-gray-500">Günlük</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-bold text-gray-700">
                        {calculateHourlyRate(employee).toFixed(0)}₺
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

      {/* Desktop: Employee Cards */}
      <div className="hidden md:block space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-red-600" />
          <h3 className="text-lg md:text-xl font-semibold">Çalışan Listesi</h3>
          <span className="text-sm text-muted-foreground">({employees.length})</span>
        </div>
        
        {employees.length === 0 ? (
          <Card className="border-red-200">
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Henüz çalışan eklenmemiş</p>
              <p className="text-sm text-muted-foreground mt-1">
                Yeni çalışan eklemek için yukarıdaki butonu kullanın
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {employees.map((employee) => (
              <Card key={employee.id} className="border-red-200 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Employee Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base md:text-lg">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">Çalışan</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditEmployee(employee)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                        <Edit className="h-4 w-4" />
                          <span className="hidden sm:ml-2 sm:inline">Düzenle</span>
                      </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                        <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:ml-2 sm:inline">Sil</span>
                      </Button>
                      </div>
                    </div>

                    {/* Employee Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-3 border-t border-red-100">
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-lg md:text-xl font-bold text-red-600">{employee.dailyHours}</p>
                        <p className="text-xs text-muted-foreground">Günlük Saat</p>
                      </div>
                      
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-lg md:text-xl font-bold text-red-600">
                          {(employee.monthlySalary / 1000).toFixed(0)}K₺
                        </p>
                        <p className="text-xs text-muted-foreground">Aylık Maaş</p>
                      </div>
                      
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-lg md:text-xl font-bold text-red-600">
                          {calculateHourlyRate(employee).toFixed(0)}₺
                        </p>
                        <p className="text-xs text-muted-foreground">Saatlik Ücret</p>
                      </div>
                      
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-lg md:text-xl font-bold text-red-600">
                          {calculateDailySalary(employee).toFixed(0)}₺
                        </p>
                        <p className="text-xs text-muted-foreground">Günlük Maaş</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {employees.length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Günlük maaş hesaplaması 22 çalışma günü üzerinden yapılmaktadır
              </p>
        </CardContent>
      </Card>
        )}
      </div>

      {/* Mobile: Calculation Info */}
      {employees.length > 0 && (
        <div className="md:hidden">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700 text-center">
              <strong>Not:</strong> Günlük maaş 22 çalışma günü üzerinden hesaplanır
            </p>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Çalışan Bilgilerini Düzenle</DialogTitle>
            <DialogDescription>Çalışan bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Ad Soyad</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-dailyHours">Günlük Çalışma Saati</Label>
                <Input
                  id="edit-dailyHours"
                  type="number"
                  value={formData.dailyHours}
                  onChange={(e) => setFormData({ ...formData, dailyHours: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-monthlySalary">Aylık Maaş (₺)</Label>
                <Input
                  id="edit-monthlySalary"
                  type="number"
                  value={formData.monthlySalary}
                  onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleUpdateEmployee} className="bg-red-600 hover:bg-red-700">Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
