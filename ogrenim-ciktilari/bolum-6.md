# 6. Bölüm: Sihirli Sayaç, Değişkenler ve Büyük Konser (Öğrenim Çıktıları)

Bu doküman, 6. Bölüm kapsamındaki 10 sorunun bilişsel gelişim basamaklarına (Piaget evreleri) göre optimize edilmiş halini, iki kademeli (7-9 Yaş ve 10-14 Yaş) pedagojik hedeflerini ve aktif öğrenim çıktılarını içerir.

---

### 1. Değişken Tanımlama ve İlk Değer Atama
* **Soru:** Öğrenenin tuval üzerinde toplanan yıldızları hafızada tutabilmek için isim verilmiş bir veri kutusu (değişken) tanımlayabilmesi...
* **Öğrenim Çıktısı:** Tuvalin kenarında `Puan` isimli bir değişken kutusu açar ve içine ilk değer olarak 0 yazar.
* **Kazanım:** Bellek alanı oluşturma ve ilk değer verme (`Değişken Başlatma / Variable Declaration & Init`).
* **Kademelendirme:**
  * *7-9 Yaş:* Üzerinde "Yıldız Kumbarası" yazan sevimli bir kutu açar; içi başlangıçta boştur (0).
  * *10-14 Yaş:* `let puan = 0;` değişken deklarasyonu bloklar üzerinde gösterilir.

---

### 2. Değer Artırma (Sayaç Mantığı: Increment)
* **Soru:** Öğrenenin tuval üzerinde her yıldız toplandığında sayaç değişkeninin değerini 1 birim artırabilmesi...
* **Öğrenim Çıktısı:** Fırça yıldıza temas ettiğinde `Puan = Puan + 1` komutunu işleterek kumbaradaki sayıyı büyütür.
* **Kazanım:** Değişken değerini güncelleme ve artırma (`Artırma / Increment: Counter++`).
* **Kademelendirme:**
  * *7-9 Yaş:* Her toplanan yıldızda kumbara sevinç sesi çıkarır ve ekrandaki sayı 1-2-3 diye artar.
  * *10-14 Yaş:* `puan += 1` veya `puan++` aritmetik atama ifadesi görselleştirilir.

---

### 3. Değer Azaltma ve Can Göstergesi (Decrement)
* **Soru:** Öğrenenin tuval üzerinde dikene temas ettiğinde can değişkenini 1 birim azaltarak kalan miktarı ekranda güncelleyebilmesi...
* **Öğrenim Çıktısı:** Engele çarpıldığında `Can = Can - 1` komutuyla can sayısını düşürür; can 0 olunca güvenli mola durumuna geçer.
* **Kazanım:** Durum eksiltme ve eşik kontrolü (`Eksiltme / Decrement: Health--`).
* **Kademelendirme:**
  * *7-9 Yaş:* 3 kalp vardır; dikene değince 1 kalp söner ve uyarıcı pes bir ses verir.
  * *10-14 Yaş:* `can--; if (can <= 0) gameOver();` kontrol mekanizması kurulur.

---

### 4. Dinamik Özellik Yönetimi (Hız Ayarlayıcı)
* **Soru:** Öğrenenin tuval üzerindeki hız değişkeninin değerini dokunmatik bir kaydırıcıyla (slider) değiştirerek fırçanın akış temposunu anlık yönetebilmesi...
* **Öğrenim Çıktısı:** Değişkenin değerini doğrudan arayüzden değiştirerek animasyonun ve seslerin temposunu (BPM) hızlandırır/yavaşlatır.
* **Kazanım:** Değişkenlerin nesne özelliklerini dinamik değiştirmesi (`Dinamik Değişken / Property Binding, Tempo`).
* **Kademelendirme:**
  * *7-9 Yaş:* Kaydırıcıyı sağa çekince fırça hızlı koşar ve melodiler şenlenir, sola çekince ninni gibi yavaşlar.
  * *10-14 Yaş:* Metronom hızı `(BPM = sliderValue)` sayısal değişkenine bağlanır.

---

### 5. Metin Değişkeni ve Arayüz Bilgisi (String Data)
* **Soru:** Öğrenenin seçilen müzik enstrümanının metin ismini bir değişkende saklayıp tuvalin bilgi paneline yazdırabilmesi...
* **Öğrenim Çıktısı:** Sadece sayıları değil, "Ksilofon" veya "Piyano" gibi metin (string) verilerini değişkende tutup ekranda gösterir.
* **Kazanım:** Metin veri türü ve etiketleme (`Metin Değişkeni / String DataType & UI Binding`).
* **Kademelendirme:**
  * *7-9 Yaş:* Enstrüman resmine dokununca ekrandaki konuşma balonunda enstrümanın adı yazar.
  * *10-14 Yaş:* `let instrumentName = "Piyano";` veri türü farkı (sayı vs metin) incelenir.

---

### 6. Durum Bayrağı ile Kilit Açma (Boolean Flag)
* **Soru:** Öğrenenin kapının açılıp açılmadığını hafızada tutan doğru/yanlış durum bayrağını (boolean flag) koşullara bağlayabilmesi...
* **Öğrenim Çıktısı:** Altın anahtar alındığında `anahtarAlindi = True` bayrağını hafızaya yazar; kapıya gelince bu bayrağı kontrol eder.
* **Kazanım:** Mantıksal durum saklama (`Durum Bayrağı / Boolean Flag: isKeyCollected`).
* **Kademelendirme:**
  * *7-9 Yaş:* Anahtarı alınca fırçanın sırtında parlayan bir ışık yanar; ışık yanıyorsa kapı hemen açılır.
  * *10-14 Yaş:* `boolean isKeyCollected = false; ... if (isKeyCollected)` durum makinesi kavratılır.

---

### 7. Dinamik Büyüyen Müzikal Spiral (Akümülatör Döngüsü)
* **Soru:** Öğrenenin adım boyu değişkenini her döngü turunda artırarak dışa doğru açılan müzikal bir spiral çizebilmesi...
* **Öğrenim Çıktısı:** Döngünün her turunda `adimBoyu = adimBoyu + 5` işlemini yaparak merkezden dışa doğru genişleyen müzikal spiral oluşturur.
* **Kazanım:** Döngü içinde değişken birikimi (`Akümülatör Deseni / Accumulator Pattern in Loops`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça her turda biraz daha geniş bir daire çizer; salyangoz kabuğu gibi parlayan renkli bir müzik girdabı oluşur.
  * *10-14 Yaş:* `proje_tasarim_dokumani.md` Görev 5.2'deki adım sayacı algoritması (`step += 5`) doğrudan işletilir.

---

### 8. Değer Takası (Geçici Üçüncü Değişken - Swap)
* **Soru:** Öğrenenin iki kutuda saklanan farklı renk puanlarının değerlerini geçici bir üçüncü değişken yardımıyla birbiriyle takas edebilmesi...
* **Öğrenim Çıktısı:** Kırmızı ve Mavi kutulardaki puanları birbirine aktarabilmek için geçici bir `Yedek` kutusu kullanarak takas işlemini başarır.
* **Kazanım:** Klasik algoritma takas mantığı (`Değişken Takası / Variable Swap via Temp`).
* **Kademelendirme:**
  * *7-9 Yaş:* Bir elinde kırmızı elma, diğerinde sarı armut varken boş tabağı (yedek) kullanarak meyveleri el değiştirir.
  * *10-14 Yaş:* `temp = a; a = b; b = temp;` algoritması somutlaştırılır.

---

### 9. Değer Sınırlandırma (Clamping / Min - Max)
* **Soru:** Öğrenenin ses şiddeti veya puan değişkeninin belirlenen alt ve üst sınır değerlerini aşmasını engelleyen sınırlandırma (clamping) mantığı kurabilmesi...
* **Öğrenim Çıktısı:** Canın 100'den yukarı çıkmasını veya 0'dan aşağı düşmesini engelleyen sınır kurallarını değişkene uygular.
* **Kazanım:** Değer sınırlandırma ve taşma koruması (`Değer Sınırlandırma / Clamping: Math.min, Math.max`).
* **Kademelendirme:**
  * *7-9 Yaş:* Kumbara taşınca "Kumbara Doldu!" melodisi çalar ve fazlalıklar dökülmeden en üstte kalır.
  * *10-14 Yaş:* `puan = Math.min(100, Math.max(0, puan))` mantığı fonksiyonla denetlenir.

---

### 10. Büyük Capstone Müzikal Ritim Oyunu (Final Bilişimsel Sentez)
* **Soru:** Öğrenenin sıralama, döngü, koşul, fonksiyon ve değişken kavramlarının tamamını sentezleyerek kendi interaktif müzikal ritim oyununu tamamlayabilmesi...
* **Öğrenim Çıktısı:** Puan toplayan, engelleri koşulla aşan, döngüyle desen çizen ve fonksiyonlarla orkestrasyon kuran kendi oyununu baştan sona çalıştırır.
* **Kazanım:** Tüm bilişimsel düşünme sütunlarının büyük nihai sentezi (`Capstone Project, Full Computational Thinking Mastery`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sahneye koyduğu tüm müzik kutuları, renkli fırçalar ve puan sayaçları uyumla çalışır; çocuk kendi ürettiği oyunu oynar.
  * *10-14 Yaş:* Projenin tüm girdi, durum ve çıktı mimarisini denetleyen bağımsız bir mini oyun motoru kurgulanır.
