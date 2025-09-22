"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calculator, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

const tabItems = [
  { name: "Ana Sayfa", href: "/", icon: Home, shortName: "Ana Sayfa" },
  { name: "Çalışanlar", href: "/employees", icon: Users, shortName: "Çalışanlar" },
  { name: "Hesaplama", href: "/calculator", icon: Calculator, shortName: "Hesapla" },
  { name: "Takip", href: "/schedule", icon: Calendar, shortName: "Takip" },
  { name: "Ayarlar", href: "/settings", icon: Settings, shortName: "Ayarlar" },
]

export default function MobileTabBar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Login sayfasında tab bar'ı gösterme
  if (pathname === '/login') {
    return null
  }

  // Kullanıcı giriş yapmamışsa tab bar'ı gösterme
  if (!user) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl">
        <div className="flex items-center justify-around py-1">
          {/* Navigation Items */}
          {tabItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 rounded-lg mx-1",
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                  )}
                >
                  <div className="relative">
                    <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 font-medium transition-all duration-300",
                      isActive ? "text-red-600 scale-105" : "text-gray-500"
                    )}
                  >
                    {item.shortName}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
