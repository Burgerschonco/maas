'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  LogOut, 
  Settings, 
  Lock,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Info
} from 'lucide-react'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('tr')
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleSignOut = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
      setShowLogoutDialog(false)
    }
  }

  const settingsSections = [
    {
      title: 'Profil Bilgileri',
      icon: User,
      items: [
        {
          label: 'E-posta Adresi',
          value: user?.email || '',
          type: 'email',
          disabled: true,
          icon: Mail
        }
      ]
    },
    {
      title: 'Güvenlik',
      icon: Shield,
      items: [
        {
          label: 'Şifre Değiştir',
          description: 'Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin',
          type: 'action',
          icon: Lock,
          action: () => console.log('Şifre değiştir')
        }
      ]
    },
    {
      title: 'Tercihler',
      icon: Settings,
      items: [
        {
          label: 'Karanlık Mod',
          description: 'Arayüz temasını değiştirin',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
          icon: darkMode ? Moon : Sun
        },
        {
          label: 'Bildirimler',
          description: 'Push bildirimlerini yönetin',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
          icon: Bell
        },
        {
          label: 'Dil',
          description: 'Arayüz dilini seçin',
          type: 'select',
          value: language,
          options: [
            { value: 'tr', label: 'Türkçe' },
            { value: 'en', label: 'English' }
          ],
          onChange: setLanguage,
          icon: Globe
        }
      ]
    },
    {
      title: 'Destek',
      icon: HelpCircle,
      items: [
        {
          label: 'Yardım Merkezi',
          description: 'Sık sorulan sorular ve rehberler',
          type: 'action',
          icon: HelpCircle,
          action: () => window.open('mailto:destek@maastakip.com', '_blank')
        },
        {
          label: 'Hakkında',
          description: 'Uygulama versiyonu ve bilgileri',
          type: 'action',
          icon: Info,
          action: () => console.log('Hakkında')
        }
      ]
    }
  ]

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="text-center md:text-left space-y-2 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-3xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2 md:gap-3">
              <Settings className="h-5 w-5 md:h-8 md:w-8 text-red-600" />
              Ayarlar
            </h1>
            <p className="text-xs md:text-base text-muted-foreground mt-1">
              Hesap ve uygulama ayarlarını yönet
            </p>
          </div>
        </div>
      </div>

      {/* Settings List - Clean Mobile Design */}
      <div className="md:space-y-4">
        {/* Mobile: Single List */}
        <div className="md:hidden">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {settingsSections.map((section, sectionIndex) => (
              <div key={section.title}>
                {/* Section Header */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{section.title}</span>
                  </div>
                </div>
                
                {/* Section Items */}
                {section.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon
                  const isLastItem = itemIndex === section.items.length - 1
                  const isLastSection = sectionIndex === settingsSections.length - 1
                  
                  return (
                    <div 
                      key={itemIndex} 
                      className={`flex items-center justify-between px-4 py-3 active:bg-gray-50 ${
                        !isLastItem || !isLastSection ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ItemIcon className="h-4 w-4 text-red-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-0.5 truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="shrink-0 ml-3">
                        {item.type === 'email' && (
                          <span className="text-xs text-gray-500 truncate max-w-[120px] block">
                            {item.value}
                          </span>
                        )}
                        
                        {item.type === 'toggle' && (
                          <button
                            onClick={() => item.onChange?.(!item.value)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              item.value ? 'bg-red-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                item.value ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                        
                        {item.type === 'select' && (
                          <span className="text-xs text-gray-500">
                            {item.options?.find(opt => opt.value === item.value)?.label}
                          </span>
                        )}
                        
                        {item.type === 'action' && (
                          <button
                            onClick={item.action}
                            className="text-red-600 text-xs font-medium"
                          >
                            {item.label === 'Şifre Değiştir' ? 'Değiştir' : 
                             item.label === 'Yardım Merkezi' ? 'İletişim' :
                             item.label === 'Hakkında' ? 'Görüntüle' : 'Aç'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Card Layout */}
        <div className="hidden md:block space-y-4">
          {settingsSections.map((section) => {
            const SectionIcon = section.icon
            return (
              <Card key={section.title} className="border-red-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <SectionIcon className="h-5 w-5 text-red-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {section.items.map((item, index) => {
                    const ItemIcon = item.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
                        <div className="flex items-center gap-3 flex-1">
                          <ItemIcon className="h-4 w-4 text-red-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.type === 'email' && (
                            <Input
                              type="email"
                              value={item.value}
                              disabled={item.disabled}
                              className="w-48 text-sm h-9"
                            />
                          )}
                          
                          {item.type === 'toggle' && (
                            <button
                              onClick={() => item.onChange?.(!item.value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                item.value ? 'bg-red-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}
                          
                          {item.type === 'select' && (
                            <select
                              value={item.value}
                              onChange={(e) => item.onChange?.(e.target.value)}
                              className="px-3 py-2 border border-red-300 rounded-md bg-white text-foreground text-sm h-9"
                            >
                              {item.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          
                          {item.type === 'action' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={item.action}
                              className="border-red-300 text-red-600 hover:bg-red-50 text-sm h-8 px-3"
                            >
                              {item.label === 'Şifre Değiştir' ? 'Değiştir' : 
                               item.label === 'Yardım Merkezi' ? 'İletişim' :
                               item.label === 'Hakkında' ? 'Görüntüle' : 'Aç'}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Logout Section */}
        <div className="md:hidden mt-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Hesap</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 flex-1">
                <LogOut className="h-4 w-4 text-red-600 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-red-700">Çıkış Yap</div>
                  <div className="text-xs text-red-600 mt-0.5">
                    Hesabınızdan güvenli çıkış
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="text-red-600 text-xs font-medium"
              >
                {loading ? 'Çıkış...' : 'Çıkış'}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Logout */}
        <div className="hidden md:block">
          <Card className="border-red-300 shadow-sm bg-red-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-red-600 text-base">
                <LogOut className="h-5 w-5" />
                Hesap Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <LogOut className="h-4 w-4 text-red-600 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-red-700">Çıkış Yap</div>
                    <div className="text-xs text-red-600 mt-0.5">
                      Hesabınızdan güvenli çıkış
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-sm h-8 px-4"
                >
                  {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <div className="md:hidden mt-4">
          <div className="text-center py-4">
            <div className="text-xs text-gray-500">
              Maaş Yönetim Sistemi v1.0.0
            </div>
            <div className="text-xs text-gray-400 mt-1">
              © 2024
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-1">
                <div className="text-sm text-muted-foreground font-medium">
                  Maaş Yönetim Sistemi
                </div>
                <div className="text-xs text-muted-foreground">
                  v1.0.0 • © 2024
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Çıkış Yap
            </DialogTitle>
            <DialogDescription>
              Hesabınızdan çıkış yapmak istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutDialog(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmLogout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Çıkış Yapılıyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış Yap</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
