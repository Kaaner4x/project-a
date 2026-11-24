# 2. Bölüm: Ampuller, Sayılar ve Mantık Dünyası (Revize)

Bu doküman, 2. Bölüm kapsamındaki 10 sorunun bilişsel gelişim basamaklarına (Piaget evreleri) göre optimize edilmiş halini, iki kademeli (7-9 Yaş ve 10-14 Yaş) pedagojik hedeflerini ve aktif öğrenim çıktılarını içerir.

---

### 1. Aç/Kapa Şalteri ve Durum Kontrolü
* **Soru:** Öğrenenin tuval üzerinde bulunan ampulün anahtarına basarak onu yakıp söndürebilmesi...
* **Öğrenim Çıktısı:** Anahtara dokunarak ampulün açık ve kapalı durumlarını kontrol eder.
* **Kazanım:** İkili durum algısı ve bilgisayar biliminin temeli (`Boolean: Açık/Kapalı, 1/0, Bit`).
* **Kademelendirme:**
  * *7-9 Yaş:* Şalteri indirir, ampul sıcak bir sarı ışıkla parlar ve Do sesi verir.
  * *10-14 Yaş:* Anahtarın yanında `[Durum: True (1)]` ve `[Durum: False (0)]` ikili kod göstergesi yer alır.

---

### 2. Sayı Kadar Ampul Yakma (Sayaç Artırma)
* **Soru:** Öğrenenin tuval üzerinde belirtilen hedef sayı kadar ampulü tek tek yakarak miktara ulaşabilmesi...
* **Öğrenim Çıktısı:** İstenen hedef sayı kadar ampulü yakar; her dokunuşta ekrandaki sayacın arttığını görür.
* **Kazanım:** Sayı-nesne birebir eşlemesi ve sayaç artırma mantığı (`Sayaç / Counter++`).
* **Kademelendirme:**
  * *7-9 Yaş:* Hedef: 3 ampul. Yanan her ampul 1-2-3 diye sayılır ve pentatonik bir melodi kurar.
  * *10-14 Yaş:* Hedef: Çift sayılar (2, 4, 6). Çocuk artış kuralına göre ampulleri seçer.

---

### 3. Fazla Ampulleri Söndürme (Eksiltme Mantığı)
* **Soru:** Öğrenenin tuval üzerinde yanan ampullerden fazlasını söndürerek hedef sayıya geriye doğru ulaşabilmesi...
* **Öğrenim Çıktısı:** Yanan ampullerden fazlasına dokunup söndürerek hedef sayıya geriye doğru ulaşır.
* **Kazanım:** Tersine çevrilebilirlik ve değer eksiltme mantığı (`Azaltma / Decrement--`).
* **Kademelendirme:**
  * *7-9 Yaş:* 5 ampul yanmaktadır, hedef 2'dir. Çocuk 3 ampulü söndürür; sönen ampuller pesten tize doğru söner.
  * *10-14 Yaş:* Matematiksel modelleme: `KalanAmpul = Toplam - Söndürülen` formülü canlı güncellenir.

---

### 4. Şekil ve Renklerine Göre Sepetleme (Filtreleme & Sayma)
* **Soru:** Öğrenenin tuval üzerindeki farklı sembol ve renkteki ampulleri ilgili sepetlere taşıyıp sayabilmesi...
* **Öğrenim Çıktısı:** Klavyeye gerek duymadan, desenli/renkli ampulleri sepetlere dokunsal olarak ayırıp saydırır.
* **Kazanım:** Veri sınıflandırma, filtreleme ve dokunsal sayım (`Filtreleme / Array.filter, Daltonizm Dostu`).
* **Kademelendirme:**
  * *7-9 Yaş:* Güneş sembollü sarı ampuller ve Yıldız sembollü mavi ampuller sepetlere sürüklenir.
  * *10-14 Yaş:* Mantıksal filtre: "Sadece YANAN VE MAVİ olan ampulleri sepete aktar" (`isik == true && renk == 'mavi'`).

---

### 5. İnteraktif Melodi Gamı Çalma
* **Soru:** Öğrenenin parmağını yan yana duran ampullerin üzerinde kaydırarak melodik bir gam çalabilmesi...
* **Öğrenim Çıktısı:** Pasif izleyici olmak yerine, parmağını sürterek ampulleri sırayla aydınlatır ve kendi melodisini çalar.
* **Kazanım:** Sıralı yürütme ve müzikal icra (`Sıralama / Sequence, Glissando`).
* **Kademelendirme:**
  * *7-9 Yaş:* Do-Re-Mi-Fa-Sol ampullerine parmağını kaydırarak neşeli bir ışık merdiveni tırmanır.
  * *10-14 Yaş:* Ampullerin yanma gecikmesini (*delay*: 200ms) ayarlayarak döngüsel bir müzik melodisi kurgular.

---

### 6. Işık Örüntüsünü Tamamlama
* **Soru:** Öğrenenin tuval üzerinde bir açık bir kapalı giden ampul örüntüsünü kurala uygun ampulü yakarak tamamlayabilmesi...
* **Öğrenim Çıktısı:** Açık-kapalı dizilim kuralını keşfeder ve soru işaretli ampulü doğru duruma getirir.
* **Kazanım:** Örüntü tanıma ve mantıksal tahmin (`Örüntü / Pattern Recognition, Periyodik Kural`).
* **Kademelendirme:**
  * *7-9 Yaş:* Basit ABAB ritmi: Açık - Kapalı - Açık - Kapalı - [?].
  * *10-14 Yaş:* AABBAABB veya 1-2-4-8 geometrik artış örüntüsü.

---

### 7. Grup Anahtarı ile Fonksiyon Tetikleme
* **Soru:** Öğrenenin tuval üzerinde tek bir grup anahtarıyla ona bağlı birden fazla ampulü aynı anda yakabilmesi...
* **Öğrenim Çıktısı:** Tek bir düğmeye basarak birden çok ampulün tek seferde yanmasını sağlar.
* **Kazanım:** Toplu yürütme ve fonksiyon çağırma mantığı (`Fonksiyon / Function Call: isiklariYak()`).
* **Kademelendirme:**
  * *7-9 Yaş:* Büyük "Sihirli Düğme"ye basınca 4 ampul aynı anda parlar ve tek bir C majör akoru çalar.
  * *10-14 Yaş:* Fonksiyon kutusunun içine ampulleri kabloyla bağlar; anahtara fonksiyon adı verir.

---

### 8. Domino Işık Hattı (Olay Zinciri)
* **Soru:** Öğrenenin tuval üzerinde ampuller arasına enerji hattı çekerek domino etkili bir ışık zinciri kurabilmesi...
* **Öğrenim Çıktısı:** Bir ampul yandığında diğerini sırayla tutuşturan kesintisiz bir enerji akışı başlatır.
* **Kazanım:** Olay zinciri ve tetikleme yayılımı (`Olay Zinciri / Event Chaining, Domino Effect`).
* **Kademelendirme:**
  * *7-9 Yaş:* Ampullerin arasına parmağıyla altın bir kablo çeker; ilk ampule dokununca ışık kablodan akar.
  * *10-14 Yaş:* Gecikmeli tetikleme mantığı (`onTurnOn -> triggerNext()`); ritmik dalga tasarlar.

---

### 9. Benekli ve İkili Sayı Bulmacası (Binary Mantığı)
* **Soru:** Öğrenenin tuval üzerinde verilen hedef sayıya ulaşmak için doğru değerdeki (benekli veya ikili) ampulleri seçip yakabilmesi...
* **Öğrenim Çıktısı:** Değerli ampulleri mantıksal olarak birleştirerek istenen toplam puana ulaşır.
* **Kazanım:** İkili sayı tabanı ve mantıksal toplama (`Binary Tabanı: 1, 2, 4, 8 / Bitmask`).
* **Kademelendirme:**
  * *7-9 Yaş (Somut Benekler):* Ampullerin üzerinde 1, 2, 3 adet parlayan benek vardır; "5 Benek Topla" görevi için 2 ve 3 benekli ampulleri yakar.
  * *10-14 Yaş (Gerçek Binary):* Ampul değerleri 1, 2, 4, 8'dir. Hedef 13 için çocuk 8 + 4 + 1 ampullerini yakarak `1101` ikili kodunu oluşturur.

---

### 10. Büyük Senfoni Orkestrası (Tam Algoritma Sentezi)
* **Soru:** Öğrenenin sahnede kurduğu tüm anahtar ve ışık zincirini tek bir 'Oynat' komutuyla çalıştırıp büyük ışık senfonisini başlatabilmesi...
* **Öğrenim Çıktısı:** Sadece numaralara basmak yerine; grup anahtarını, domino hattını ve melodiyi tek bir 'Çalıştır' butonuyla tam senkronize başlatır.
* **Kazanım:** Bölüm sonu büyük sentezi, tam algoritma yürütme ve başarı hissi (`Compile & Run, Final Algorithm`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sahneye yerleştirdiği renkli ampuller büyük "Oynat" butonuyla ışık ve melodi dansı başlatır.
  * *10-14 Yaş:* Tüm ışık ve döngü mimarisini tek bir orkestra gibi yönetip kendi 8 vuruşluk senfonisini tamamlar.
