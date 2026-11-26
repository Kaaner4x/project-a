# 🏛️ Yazılım Standartları ve Kodlama Kuralları (Software Architecture Standards)

Bu proje üzerinde çalışırken aşağıdaki mimari standartlara, tasarım kalıplarına ve temiz kod ilkelerine kesinlikle uyulmalıdır:

## 1. SOLID Prensipleri
- **Single Responsibility (SRP):** Her sınıf, fonksiyon ve dosya yalnızca tek bir sorumluluğa sahip olmalıdır. Bir dosyaya birden fazla modül veya alakasız iş mantığı yığılmamalıdır.
- **Open/Closed (OCP):** Bileşenler genişletilmeye açık, doğrudan değiştirilmeye kapalı olacak şekilde soyutlanmalıdır.
- **Liskov Substitution & Interface Segregation:** İhtiyaç halinde küçük ve amaca yönelik arayüzler/kontratlar tercih edilmelidir.
- **Dependency Inversion (DIP):** Üst seviye modüller alt seviye detaylara doğrudan bağımlı olmamalıdır.

## 2. Spagetti Koddan ve Mega Dosyalardan Kaçınma
- 500-1000 satırı aşan, birden fazla görevi üstlenen "God Object" veya mega dosyalardan kaçınılmalıdır.
- İş mantığı (logic), veri modelleri (models), kullanıcı arayüzü (views/DOM) ve yardımcı servisler (utilities/engines) net bir şekilde ayrılmalıdır.
- Fonksiyonlar kısa, tek bir işi iyi yapan ve yan etkileri (side-effects) en aza indirilmiş olmalıdır.

## 3. Gereksiz Kod Yazımından Kaçınma (KISS & YAGNI)
- Henüz ihtiyaç duyulmayan spekülatif özellikler eklenmemelidir.
- Ölü, yorum satırına alınmış veya kullanılmayan kod blokları temizlenmelidir.
- Tekrarlanan kodlar (DRY prensibi) uygun yardımcı modüllere taşınmalıdır.

## 4. İsimlendirme ve Dil Ayrımı Standartları
- **Kod Tarafı (English):** Tüm C# ve JavaScript sınıfları, değişkenleri, fonksiyonları, arayüzleri, modelleri ve dosya adları kesinlikle **İngilizce** olmalıdır.
- **Arayüz Tarafı (Türkçe):** Kullanıcıya, çocuklara ve öğretmenlere dönük tüm metinler, buton etiketleri, görev başlıkları, hata/başarı mesajları ve yönergeler **Türkçe** olmalıdır.
