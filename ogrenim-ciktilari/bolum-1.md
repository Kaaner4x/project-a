# 1. Bölüm: Temel Etkileşim ve Pedagojik Öğrenim Çıktıları (Revize)

Bu doküman, 1. Bölüm kapsamındaki 10 sorunun bilişsel gelişim basamaklarına (Piaget evreleri) göre optimize edilmiş halini, iki kademeli (7-9 Yaş ve 10-14 Yaş) pedagojik hedeflerini ve sade öğrenim çıktılarını içerir.

---

### 1. Sabit Nesne ile İlk Etkileşim
* **Soru:** Öğrenenin tuval üzerinde konumlandırılan renkli nesneyle etkileşim kurabilmesi...
* **Öğrenim Çıktısı:** Sabit nesneyi fark eder ve dokunarak/tıklayarak ilk eylemi başlatır.
* **Kazanım:** Görsel odaklanma ve temel tıklama refleksi (`Olay / Event: OnClick`).
* **Kademelendirme:**
  * *7-9 Yaş:* Nesneye dokunulduğunda sevimli fırça karakteri parlar ve yumuşak bir Do sesi çalar.
  * *10-14 Yaş:* Dokunma sayacının (`tapCount`) tetiklendiği ve olayın bir sinyal ürettiği gösterilir.

---

### 2. Parça-Bütün İlişkisi (Robot Yapbozu)
* **Soru:** Öğrenenin tuval üzerinde parçalara ayrılmış robot/nesneyi birleştirerek bütünü tamamlayabilmesi...
* **Öğrenim Çıktısı:** Ayrık duran parçaları doğru yerlerine oturtarak işlevsel bir bütünü inşa eder.
* **Kazanım:** Parça-bütün ilişkisi ve problem ayrıştırma (`Modülerlik / Decomposition`).
* **Kademelendirme:**
  * *7-9 Yaş:* Gövde, kafa ve ayak parçalarını birleştirerek sevimli robotu ayağa kaldırır.
  * *10-14 Yaş:* Çip, sensör ve motor parçalarını doğru yuvalara takarak robot donanımını tamamlar.

---

### 3. Hedefe Taşıma ve Koordinat
* **Soru:** Öğrenenin tuval üzerindeki nesneyi parmağıyla hedefe doğru sürükleyip manyetik yuvaya bırakabilmesi...
* **Öğrenim Çıktısı:** Nesneyi ekranda basılı tutarak taşır ve hedef alana başarıyla kilitler.
* **Kazanım:** Mekânsal konumlandırma ve sürükleme motor becerisi (`Koordinat / X-Y, Snap-to-Target`).
* **Kademelendirme:**
  * *7-9 Yaş:* Yıldızı gökyüzündeki yuvasına taşır; yerine oturduğunda parlama sesi çalar.
  * *10-14 Yaş:* Taşınırken nesnenin `X, Y` koordinat değerleri canlı olarak ekranda akar.

---

### 4. Katman Algısı ve Keşif
* **Soru:** Öğrenenin tuval üzerindeki nesnelerin arkasında saklanan gizli nesneyi fark edip ortaya çıkarabilmesi...
* **Öğrenim Çıktısı:** Öndeki nesneyi kenara çekip altındaki gizli hedefi keşfeder ve hedefine taşır.
* **Kazanım:** Derinlik/katman hiyerarşisi ve nesne sürekliliği (`Katman / Z-Index`).
* **Kademelendirme:**
  * *7-9 Yaş:* Yarı saydam bulutu kenara çekerek arkasındaki güneşi gökyüzüne yerleştirir.
  * *10-14 Yaş:* Katman sırası panelinden nesneyi en öne taşır (`z-index: 2`).

---

### 5. Engeli Temizleme ve Hata Ayıklama
* **Soru:** Öğrenenin tuval üzerinde akışı tıkayan engeli fark edip kenara kaydırarak yolu açabilmesi...
* **Öğrenim Çıktısı:** İlerlemeyi durduran engeli tespit eder ve yolu açmak için onu tuvalin dışına çeker.
* **Kazanım:** Hata ayıklama ve neden-sonuç analizi (`Debugging / Engel Aşma`).
* **Kademelendirme:**
  * *7-9 Yaş:* Yolun ortasındaki taşı parmağıyla fırlatıp fırçanın geçmesini sağlar.
  * *10-14 Yaş:* Mantıksal kilit mekanizmasını açarak tünelin kapısını kaldırır.

---

### 6. Ritmik Yörünge ve Sayaç (Döngü Turu)
* **Soru:** Öğrenenin tuval üzerinde ritmik bir yörüngede dönen nesnenin tur sayısını belirleyerek döngüyü tamamlatabilmesi...
* **Öğrenim Çıktısı:** Nesneyi kovalamak yerine döngü sayacını ayarlayarak ritmik tur atmasını sağlar.
* **Kazanım:** Öngörülebilir durum tekrarı ve döngü tur sayısı (`Döngü / Loop Iteration`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sonsuzluk veya halka rayındaki fırçaya "3 Tur At" komutu verir; her turda bir davul vuruşu çalar.
  * *10-14 Yaş:* Döngünün hız ve periyot çarpanını ayarlayarak ses dalgasıyla senkronize eder.

---

### 7. İki Yollu Koşullu Seçim (Görsel Dalga + Karar)
* **Soru:** Öğrenenin ses ve görsel sinyale göre (kalın/mor dalga veya ince/sarı ışık) doğru iki hedeften birini seçebilmesi...
* **Öğrenim Çıktısı:** Uyarıcıyı izler ve kurala göre iki farklı seçenekten doğru olana dokunur.
* **Kazanım:** Dallanan karar mekanizması (`Koşul / If-Else, Çok-Modlu Erişim`).
* **Kademelendirme:**
  * *7-9 Yaş:* Mor davul dalgası yayılırsa mor kapıya, sarı zil kıvılcımı yayılırsa sarı kapıya dokunur.
  * *10-14 Yaş:* İkili koşul: *"Eğer ses yüksek VE renk yeşil ise onay butonuna dokun, değilse bekle."*

---

### 8. Dokunsal Boyut Ölçekleme
* **Soru:** Öğrenenin tuval üzerindeki nesnenin boyutunu dokunsal araçlarla (slider/buton) küçülterek dar bir geçitten geçirebilmesi...
* **Öğrenim Çıktısı:** Çift parmak kıstırma zorunluluğu olmadan, boyut aracını kullanarak nesneyi küçültüp delikten geçirir.
* **Kazanım:** Nesne özelliklerini değiştirme ve ölçeklendirme (`Özellik / Property Mutation, Scale`).
* **Kademelendirme:**
  * *7-9 Yaş:* `[-]` butonuna basarak karakteri bir beden küçültür ve tünelden kaydırarak geçirir.
  * *10-14 Yaş:* Boyut çarpanını (`scale: 0.5x`) kapı açıklığına göre matematiksel olarak ayarlar.

---

### 9. Pentatonik Dizi Hafızası
* **Soru:** Öğrenenin tuval üzerinde çalan 3 notalı pentatonik ses ve ışık dizilimini aklında tutup aynı sırayla dokunabilmesi...
* **Öğrenim Çıktısı:** Yanıp sönen ve ses çıkaran 3 renkli notayı hafızasında tutarak aynı sırayla çalar.
* **Kazanım:** Kısa süreli çalışma belleği ve sıralı indeks (`Dizi / Array Mantığı: FIFO`).
* **Kademelendirme:**
  * *7-9 Yaş:* En fazla 3 renk ve Do-Mi-Sol notaları kullanılır; hata durumunda dizi başa sarmaz, yumuşakça tekrarlar.
  * *10-14 Yaş:* Dizi 5 elemana çıkar ve ekranda indeks kutucukları (`[0], [1], [2]...`) gösterilir.

---

### 10. Paralel ve Aynalı Çift Nesne Yönetimi
* **Soru:** Öğrenenin tuval üzerinde bir nesneyi yönlendirirken, onu paralel veya ayna gibi taklit eden diğer nesneyi de gözetip hedefe ulaştırabilmesi...
* **Öğrenim Çıktısı:** Kendi hareketinin diğer nesneyi nasıl etkilediğini hesaplayarak ikisini de hedeflerine ulaştırır.
* **Kazanım:** Çift durum senkronizasyonu ve ilişkili değişkenler (`Bağımlı Değişken / Simetri`).
* **Kademelendirme:**
  * *7-9 Yaş:* Paralel ikiz nesneler: Birini sağa götürünce diğeri de sağdaki hedefe ilerler.
  * *10-14 Yaş:* Zıt simetri: Biri yukarı giderken diğeri aşağı iner; ikisi de engellere çarpmadan hedefe varmalıdır.
