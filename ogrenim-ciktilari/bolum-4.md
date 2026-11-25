# 4. Bölüm: Renklerin Şarkısı ve Akıllı Koşullar (Öğrenim Çıktıları)

Bu doküman, 4. Bölüm kapsamındaki 10 sorunun bilişsel gelişim basamaklarına (Piaget evreleri) göre optimize edilmiş halini, iki kademeli (7-9 Yaş ve 10-14 Yaş) pedagojik hedeflerini ve aktif öğrenim çıktılarını içerir.

---

### 1. Tekil Koşul ve Renk Algılama (Basit If)
* **Soru:** Öğrenenin tuval üzerinde fırçanın önüne çıkan boya lekesinin sarı olup olmadığını tekil 'Eğer' koşuluyla denetleyebilmesi...
* **Öğrenim Çıktısı:** Sadece kural sağlandığında (leke sarı ise) fırçayı parlatan tekil koşul bloğunu çalıştırır.
* **Kazanım:** Şarta bağlı eylem üretme (`Tekil Koşul / If Statement`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça sarı boyaya değince 'ding' sesiyle parlar; boya yoksa sessizce yoluna devam eder.
  * *10-14 Yaş:* `if (color == 'yellow') { activateGlow(); }` mantığı blok üzerinde gösterilir.

---

### 2. İki Yollu Dallanma (If - Else)
* **Soru:** Öğrenenin tuval üzerinde yol ikiye ayrıldığında ses dalgasına göre sol veya sağ patikayı seçen iki yollu karar bloğunu çalıştırabilmesi...
* **Öğrenim Çıktısı:** Ses sinyali mor dalga ise sola, sarı parıltı ise sağa yönelen ikili karar ağacını tamamlar.
* **Kazanım:** Karar dallanması ve iki yönlü akış denetimi (`Dallanma / If - Else Branching`).
* **Kademelendirme:**
  * *7-9 Yaş:* Kalın mor davul sesi duyulunca mor köprüye, tiz sarı zil duyulunca sarı köprüye yönelir.
  * *10-14 Yaş:* Koşul operatörü `if (signal == PURPLE) PathLeft() else PathRight()` kod bloğunda işletilir.

---

### 3. Dinamik Zemin Sensörü ile Renk Uyumu
* **Soru:** Öğrenenin tuval üzerindeki dinamik zemin sensörü sayesinde fırçanın bastığı zeminin rengine ve notasına göre renk değiştirebilmesini sağlayabilmesi...
* **Öğrenim Çıktısı:** Fırçanın zemin algılayıcısını devreye sokarak yeşil zeminde yeşil nota, mavi zeminde mavi nota çalmasını sağlar.
* **Kazanım:** Sensör tabanlı dinamik girdi işleme (`Sensör Girdisi / Dynamic Color Sensor Event`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça çimene basınca yeşil ksilofon, suya basınca mavi damla sesi verir.
  * *10-14 Yaş:* Gerçek zamanlı sensör okuma ve tepki döngüsü (`brush.color = canvas.getGroundColor()`) aktarılır.

---

### 4. Mantıksal VE Operatörü (İkili Onay)
* **Soru:** Öğrenenin tuval üzerinde geçiş kapısını açabilmek için hem şalterin açık hem de anahtarın toplanmış olmasını gerektiren VE (AND) mantığını kurabilmesi...
* **Öğrenim Çıktısı:** Kapının açılması için tek şartın yetmediğini, her iki şartın da `True` olması gerektiğini keşfeder.
* **Kazanım:** İki önermenin eşzamanlı doğruluğu (`Mantıksal VE / Logical AND: A && B`).
* **Kademelendirme:**
  * *7-9 Yaş:* Hem büyük şalter indirilmeli HEM DE altın anahtar yuvaya oturmalıdır; kapı zafer sesiyle açılır.
  * *10-14 Yaş:* Doğruluk tablosu (Truth Table: `1 && 1 = 1`, `1 && 0 = 0`) gösterilir.

---

### 5. Mantıksal VEYA Operatörü (Esnek Geçiş)
* **Soru:** Öğrenenin tuval üzerinde lazer bariyerini aşmak için kırmızı veya mavi düğmelerden en az birine basmayı sağlayan VEYA (OR) mantığını uygulayabilmesi...
* **Öğrenim Çıktısı:** İki şarttan herhangi biri gerçekleştiğinde bariyerin kalktığını görerek alternatif çözümü fark eder.
* **Kazanım:** Alternatifli koşul değerlendirmesi (`Mantıksal VEYA / Logical OR: A || B`).
* **Kademelendirme:**
  * *7-9 Yaş:* Kırmızı düğmeye VEYA mavi düğmeye basmak yeterlidir; çocuk istediği yoldan engeli kaldırır.
  * *10-14 Yaş:* Doğruluk tablosunda en az bir `True` değerinin yeterli olduğu vurgulanır (`0 || 1 = 1`).

---

### 6. Mantıksal DEĞİL Operatörü (Tersine Çevirme)
* **Soru:** Öğrenenin tuval üzerinde kırmızı engel sinyali OLMADIĞI sürece fırçanın güvenle ilerlemesini sağlayan DEĞİL (NOT) mantığını işletebilmesi...
* **Öğrenim Çıktısı:** Tehlike işareti yokken ilerleme koşulunu 'DEĞİL' bloğuyla tersine çevirerek güvenli hareket sağlar.
* **Kazanım:** Koşulun tersini alma (`Mantıksal DEĞİL / Logical NOT: !Condition`).
* **Kademelendirme:**
  * *7-9 Yaş:* "Kırmızı alarm YOKSA geç" kuralı kurulur; alarm susunca yol yeşile döner.
  * *10-14 Yaş:* Mantıksal evirme operatörü `(!isDanger)` ile durum yönetimi öğretilir.

---

### 7. Çoklu Dallanma ve Renk Tüpleri (Else-If / Switch)
* **Soru:** Öğrenenin tuval üzerinde üç farklı renkteki tüpten gelen boya akışını çoklu dallanma ile doğru hedef sepetlere yönlendirebilmesi...
* **Öğrenim Çıktısı:** İkiden fazla olasılığı (Kırmızı, Yeşil, Mavi) sırayla değerlendiren çok basamaklı karar merdivenini kurar.
* **Kazanım:** Çoklu durum denetimi (`Çoklu Dallanma / Else-If Ladder, Switch-Case`).
* **Kademelendirme:**
  * *7-9 Yaş:* Kırmızı tüp kırmızı kovaya, yeşil yeşile, mavi maviye akar; 3 farklı akor çalar.
  * *10-14 Yaş:* `switch(color) { case RED: ... case GREEN: ... }` sözdizimi bloklarla eşleştirilir.

---

### 8. Eşik Değeri Kıyaslama (Büyüktür / Küçüktür)
* **Soru:** Öğrenenin tuval üzerindeki ses yüksekliği değerinin eşik sınırını aşıp aşmadığını kıyaslayarak ses kalkanını devreye sokabilmesi...
* **Öğrenim Çıktısı:** Sayısal ses şiddeti değeri belirlenen sınırı (50) aştığında koruyucu kalkanı etkinleştirir.
* **Kazanım:** İlişkisel operatörler ve eşik denetimi (`İlişkisel Operatörler: > , < , >=`).
* **Kademelendirme:**
  * *7-9 Yaş:* Ses yükselip gösterge kırmızı çizginin üstüne çıkınca parlayan bir koruma balonu açılır.
  * *10-14 Yaş:* `if (soundLevel > 50) activateShield()` sayısal karşılaştırma ifadesi kurgulanır.

---

### 9. İç İçe Koşullar (Katmanlı Karar Ağacı)
* **Soru:** Öğrenenin tuval üzerinde 'Zemin kaygan ise VE hız yüksekse yavaşla, değilse hızlan' şeklinde iki katmanlı iç içe koşul kurgulayabilmesi...
* **Öğrenim Çıktısı:** Bir koşulun içine ikinci bir koşul yerleştirerek karmaşık senaryolarda doğru kararı üretir.
* **Kazanım:** İç içe geçmiş karar yapıları (`İç İçe Koşul / Nested Conditionals`).
* **Kademelendirme:**
  * *7-9 Yaş:* Buzlu yolda hızlı gidiyorsa fırça fren yapar ve kayma sesi çalar; kuru yolda normal devam eder.
  * *10-14 Yaş:* İç içe blok hiyerarşisi (`if (isIcy) { if (speed > 5) slowDown(); }`) hatasız kurulur.

---

### 10. Otonom Labirent Çözücü (Bölüm Sentezi)
* **Soru:** Öğrenenin tuvalde fırçanın önüne çıkan duvar ve renk işaretlerine göre kendi kararını vererek labirentten çıkmasını sağlayan otonom karar zincirini tamamlayabilmesi...
* **Öğrenim Çıktısı:** Fırçanın önüne çıkan tüm engelleri, renkleri ve sensör verilerini otonom kararlarla aşmasını sağlar.
* **Kazanım:** Algoritmik otonom karar mekanizması (`Autonomous Decision Pipeline, Final Condition Synthesis`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça kendi kendine engelleri sezip doğru yollara sapar; labirent çıkışında zafer melodisi çalar.
  * *10-14 Yaş:* Karar öncelikleri (priority hierarchy) optimize edilerek en kısa sürede çıkış hedeflenir.
