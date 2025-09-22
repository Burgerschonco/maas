'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  
  const { signIn, resetPassword, user } = useAuthState()
  const router = useRouter()

  // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      await signIn(email, password)
      // Başarılı giriş sonrası otomatik yönlendirme useEffect ile yapılacak
    } catch (error: any) {
      console.error('Login error:', error)
      
      let errorMessage = 'Giriş yapılırken bir hata oluştu'
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'E-posta veya şifre hatalı'
          break
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi'
          break
        case 'auth/user-disabled':
          errorMessage = 'Bu hesap devre dışı bırakılmış'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyiniz'
          break
        case 'auth/network-request-failed':
          errorMessage = 'İnternet bağlantınızı kontrol ediniz'
          break
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) return
    
    setResetLoading(true)
    
    try {
      await resetPassword(resetEmail)
      setError('')
      setShowForgotPassword(false)
      setResetEmail('')
      alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      let errorMessage = 'Bir hata oluştu'
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı'
          break
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi formatı'
          break
        case 'auth/network-request-failed':
          errorMessage = 'İnternet bağlantınızı kontrol ediniz'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyiniz'
          break
      }
      
      setError(errorMessage)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka plan tasarımı */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
      
      {/* Dalgalı arka plan */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full opacity-20">
            <path fill="rgba(255, 255, 255, 0.3)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full opacity-10">
            <path fill="rgba(255, 255, 255, 0.2)" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,144C960,128,1056,128,1152,138.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Destek butonu */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setShowSupport(true)}
          className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group flex items-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
          <span className="hidden group-hover:inline whitespace-nowrap text-sm font-medium">Destek Al</span>
        </button>
      </div>

      {/* Destek modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100 shadow-2xl">
            <button
              onClick={() => setShowSupport(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sorun mu Oluştu?</h2>
              <p className="text-gray-600">
                Size yardımcı olmaktan mutluluk duyarız. Lütfen aşağıdaki e-posta adresinden bizimle iletişime geçin.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4">Destek E-posta Adresi:</p>
              <a
                href="mailto:destek@maastakip.com"
                className="inline-flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors duration-300 font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                destek@maastakip.com
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Mesai saatleri içinde en kısa sürede size dönüş yapılacaktır.
            </p>
          </div>
        </div>
      )}

      {/* Login formu */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 transition-all duration-300">  
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6 transform hover:scale-105 transition-transform duration-500">
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src="/logokirmizi.png"
                  alt="Logo"
                  width={120}
                  height={120}
                  className="w-full h-full object-contain drop-shadow-2xl filter brightness-0 invert"
                />
              </div>
            </div>
          </div>
          <form onSubmit={!showForgotPassword ? handleLogin : handlePasswordReset} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-300/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <p className="text-sm font-medium text-white">{error}</p>
                </div>
              </div>
            )}

            {!showForgotPassword ? (
              <>
                <div className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 transition-colors group-hover:text-white">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-4 bg-white/10 border-0 rounded-xl focus:ring-2 focus:ring-white/50 transition-all duration-300 outline-none text-white placeholder-white/60 group-hover:bg-white/20"
                      placeholder="E-posta Adresiniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 transition-colors group-hover:text-white">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-4 bg-white/10 border-0 rounded-xl focus:ring-2 focus:ring-white/50 transition-all duration-300 outline-none text-white placeholder-white/60 group-hover:bg-white/20"
                      placeholder="Şifreniz"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-white text-red-600 rounded-xl hover:bg-red-50 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-white/20 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş Yapılıyor...
                    </span>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-white/90 hover:text-white transition-colors duration-300 hover:underline font-medium"
                  >
                    Şifremi Unuttum
                  </button>
                </div>
                </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Şifre Sıfırlama</h2>
                  <p className="text-white/80">
                    Şifrenizi sıfırlamak için e-posta adresinizi giriniz.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 transition-colors group-hover:text-white">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-4 bg-white/10 border-0 rounded-xl focus:ring-2 focus:ring-white/50 transition-all duration-300 outline-none text-white placeholder-white/60 group-hover:bg-white/20"
                    placeholder="E-posta Adresiniz"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-4 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-lg font-semibold"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    'Şifre Sıfırlama Bağlantısı Gönder'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-white/90 hover:text-white transition-colors duration-300 hover:underline font-medium"
                  >
                    Giriş Formuna Dön
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
