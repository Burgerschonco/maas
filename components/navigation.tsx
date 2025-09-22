"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Users, Calculator, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Çalışan Yönetimi", href: "/employees", icon: Users },
  { name: "Maaş Hesaplama", href: "/calculator", icon: Calculator },
  { name: "Çalışma Takibi", href: "/schedule", icon: Calendar },
  { name: "Ayarlar", href: "/settings", icon: Settings },
]

// Page titles for mobile header
const pageTitles: { [key: string]: string } = {
  "/": "Ana Sayfa",
  "/employees": "Çalışanlar",
  "/calculator": "Maaş Hesaplama", 
  "/schedule": "Mesai Takibi",
  "/settings": "Ayarlar"
}

export default function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Login sayfasında navigation'ı gösterme
  if (pathname === '/login') {
    return null
  }

  // Kullanıcı giriş yapmamışsa navigation'ı gösterme
  if (!user) {
    return null
  }

  const currentPageTitle = pageTitles[pathname] || "Sayfa"

  return (
    <nav className="bg-white border-b border-gray-200">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Left Side - Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logokirmizi.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </Link>

          {/* Right Side - Page Title */}
          <div className="flex items-center">
            <h1 className="text-base font-semibold text-gray-900">
              {currentPageTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logokirmizi.png"
                alt="Logo"
                width={48}
                height={48}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "flex items-center gap-2",
                        isActive && "bg-red-600 text-white hover:bg-red-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
