# 💼 Çalışan Maaş Yönetim Sistemi

Modern, responsive ve kullanıcı dostu çalışan maaş hesaplama ve yönetim sistemi. Native mobile design ile tüm cihazlarda mükemmel deneyim sunar.

## ✨ Özellikler

### 👥 **Çalışan Yönetimi**
- Çalışan ekleme, düzenleme ve silme
- Günlük çalışma saati belirleme
- Aylık maaş tanımlama
- Saatlik ve günlük ücret hesaplama
- İstatistiksel raporlama

### ⏰ **Mesai Takibi**
- Günlük mesai saatleri girişi
- Tarih bazlı çalışma takibi
- Giriş/çıkış saati belirleme
- Toplam çalışma saati hesaplama
- Günlük özet raporları

### 💰 **Maaş Hesaplama**
- Aylık maaş hesaplamaları
- Çalışma saatine göre oran hesabı
- Excel formatında rapor çıktısı
- Verimlilik oranları
- Detaylı finansal analiz

### ⚙️ **Ayarlar & Güvenlik**
- Kullanıcı profil yönetimi
- Şifre değiştirme
- Güvenli çıkış (onay ile)
- Tema tercihleri
- Dil ayarları

### 🔐 **Kimlik Doğrulama**
- Firebase Authentication entegrasyonu
- E-posta/şifre ile giriş
- Şifre sıfırlama
- Korumalı sayfalar
- Otomatik yönlendirme

## 🛠️ Teknoloji Stack

### **Frontend**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Shadcn/ui** - UI component library

### **Backend & Database**
- **Firebase Auth** - Authentication
- **Firebase Realtime Database** - Real-time data storage
- **Vercel Analytics** - Performance monitoring

### **Tools & Libraries**
- **XLSX** - Excel export functionality
- **Geist Font** - Typography
- **ESLint & Prettier** - Code quality

## 📱 Mobile-First Design

### **Native Mobile Experience**
- iOS/Android benzeri arayüz tasarımı
- Touch-optimized interaction
- Compact layout ve typography
- Native liste görünümleri
- Responsive grid systems

### **PWA Support**
- Installable web application
- Offline-ready architecture
- Custom app icons
- Standalone display mode
- Mobile-optimized manifest

## 🚀 Kurulum

### **Gereksinimler**
- Node.js 18+ 
- npm veya yarn
- Firebase projesi

### **Adımlar**

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/yourusername/maashesaplama-main.git
cd maashesaplama-main
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Firebase yapılandırması**
```bash
# lib/firebase.ts dosyasındaki config'i güncelleyin
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
# veya
yarn dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🔧 Firebase Yapılandırması

### **Firebase Console'da:**
1. Yeni proje oluşturun
2. Authentication'ı aktifleştirin (Email/Password)
3. Realtime Database oluşturun
4. Web uygulaması ekleyin

### **Environment Variables:**
```env
# lib/firebase.ts içinde güncelleyin
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📊 Veri Yapısı

### **Employees Collection**
```typescript
{
  "employees": {
    "employee_id": {
      "name": "Çalışan Adı",
      "dailyHours": 8,
      "monthlySalary": 25000,
      "schedules": {
        "2024-01": {
          "01": 8,
          "02": 7.5,
          // ...
        }
      }
    }
  }
}
```

## 🎨 Design System

### **Color Palette**
- **Primary Red**: `#dc2626` (red-600)
- **Red Variants**: red-50, red-100, red-700
- **Neutrals**: gray-50, gray-100, gray-500, gray-900
- **Background**: white, gray-50

### **Typography**
- **Font Family**: Geist Sans
- **Mobile**: text-xs, text-sm, text-base
- **Desktop**: text-sm, text-base, text-lg, text-xl

### **Components**
- **Cards**: border-radius: 0.5rem
- **Buttons**: touch-friendly padding
- **Lists**: native-style separators
- **Icons**: 4x4 (mobile), 5x5 (desktop)

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
```

### **Layout Strategy**
- **Mobile**: Single column, stack layout
- **Desktop**: Multi-column, card layout
- **Conditional rendering**: `md:hidden` / `hidden md:block`

## 🔒 Güvenlik

### **Authentication Flow**
1. Login page ile giriş
2. Firebase Auth doğrulaması
3. Protected routes kontrolü
4. Auto-redirect on auth state change

### **Data Security**
- Firebase Security Rules
- Client-side route protection
- Secure logout confirmation
- Input validation

## 📈 Performance

### **Optimizations**
- Next.js Image optimization
- Component lazy loading
- Efficient re-rendering
- Minimal bundle size
- Tree shaking

### **Analytics**
- Vercel Analytics integration
- Performance monitoring
- User interaction tracking

## 🚀 Deployment

### **Vercel (Önerilen)**
```bash
npm install -g vercel
vercel --prod
```

### **Manual Deployment**
```bash
npm run build
npm start
```

### **Environment Setup**
- Firebase config production keys
- Vercel environment variables
- Domain configuration

## 📝 Kullanım Kılavuzu

### **Giriş Yapma**
1. Login sayfasında e-posta/şifre girin
2. "Şifremi Unuttum" ile şifre sıfırlayabilirsiniz
3. Başarılı girişte ana sayfaya yönlendirilirsiniz

### **Çalışan Ekleme**
1. "Çalışanlar" sekmesine gidin
2. "Yeni Çalışan Ekle" butonuna tıklayın
3. Ad, günlük saat ve aylık maaş bilgilerini girin
4. "Ekle" butonuna tıklayın

### **Mesai Girişi**
1. "Mesai Takibi" sekmesine gidin
2. Tarih seçin
3. Her çalışan için giriş/çıkış saatlerini ayarlayın
4. "Kaydet" butonuna tıklayın

### **Maaş Hesaplama**
1. "Maaş Hesaplama" sekmesine gidin
2. Ay/yıl seçin
3. Hesaplanan maaşları görüntüleyin
4. "Excel'e Aktar" ile rapor indirin

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklikleri commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Email**: destek@maastakip.com
- **Website**: [https://maastakip.com](https://maastakip.com)
- **GitHub**: [https://github.com/yourusername/maashesaplama-main](https://github.com/yourusername/maashesaplama-main)

## 📸 Ekran Görüntüleri

### Desktop View
![Desktop Dashboard](docs/screenshots/desktop-dashboard.png)

### Mobile View
![Mobile Dashboard](docs/screenshots/mobile-dashboard.png)

### Employee Management
![Employee Management](docs/screenshots/employee-management.png)

---

**⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!**

Geliştirme: [Your Name](https://github.com/yourusername) • 2024
