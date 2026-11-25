# 3. Bölüm: Geometrik Dans ve Ritmik Döngüler (Öğrenim Çıktıları)

Bu doküman, 3. Bölüm kapsamındaki 10 sorunun bilişsel gelişim basamaklarına (Piaget evreleri) göre optimize edilmiş halini, iki kademeli (7-9 Yaş ve 10-14 Yaş) pedagojik hedeflerini ve aktif öğrenim çıktılarını içerir.

---

### 1. Sabit İterasyon ve Ritmik Çizgi
* **Soru:** Öğrenenin tuval üzerinde ardışık tekrarlanan çizgi adımlarını tek tek dizmek yerine tekrarla bloğu kullanarak fırçaya çizdirebilmesi...
* **Öğrenim Çıktısı:** Tekrarlayan hareketlerde blok israfını fark eder ve '2 Kez Tekrarla' bloğuyla fırçaya çizgiyi çektirir.
* **Kazanım:** Kod tekrarından kaçınma ve basit döngü kavramı (`Döngü / Loop: Repeat N Times`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça 2 kez adımlarken her adımda ritmik bir Do sesi çalar, çocuk blokları tek tek dizmek yerine döngü kutusuna koyar.
  * *10-14 Yaş:* `for (int i = 0; i < 2; i++)` mantığı görselleştirilir; kod uzunluğunun yarıya indiği gösterilir.

---

### 2. Basamak Algoritması (Merdiven Deseni)
* **Soru:** Öğrenenin tuval üzerinde yukarı ve sağa basamak hareketini döngüye alarak ritmik bir merdiven inşa edebilmesi...
* **Öğrenim Çıktısı:** 'Yukarı Çiz + Sağa Çiz' ikilisini döngü içine alarak tuvalde ritmik bir basamak örüntüsü oluşturur.
* **Kazanım:** Çoklu komut paketinin periyodik tekrarı (`Örüntü / Pattern Iteration`).
* **Kademelendirme:**
  * *7-9 Yaş:* Merdivenin her basamağında Re ve Mi sesleri sırayla tınlar; fırça neşeli bir merdiven tırmanır.
  * *10-14 Yaş:* Adım sayısı parametresi `(stepCount = 3)` döngüye bağlanarak algoritmanın esnekliği test edilir.

---

### 3. Eşkenar Üçgen Çizimi ve 3 Vuruşlu Ritim
* **Soru:** Öğrenenin tuval üzerinde kenar ve dönüş adımlarını 3 kez tekrarlatarak eşkenar üçgen çizebilmesi ve üç vuruşlu üçgen zil ritmini çalabilmesi...
* **Öğrenim Çıktısı:** 3 kez 'İleri Git + 120 Derece Dön' komutunu döngüye vererek kapalı üçgen şeklini ve 3 vuruşlu ritmi tamamlar.
* **Kazanım:** Geometrik açı-kenar ilişkisi ve kapalı şekil döngü matematiği (`Açı / Angle: 360 / 3 = 120°`).
* **Kademelendirme:**
  * *7-9 Yaş:* Üçgenin her köşesinde çınlayan bir üçgen zil sesi çalar; fırça başlangıç noktasına geri döner.
  * *10-14 Yaş:* Dış açı formülü `(360 / N)` formel olarak açıklanır ve dönüş açısı 120° olarak girilir.

---

### 4. Kare Çizimi ve 4 Vuruşlu Davul Ritmi
* **Soru:** Öğrenenin tuval üzerinde 4 kez tekrarla döngüsüyle kare çizerek 4 vuruşlu davul ritmini tamamlayabilmesi...
* **Öğrenim Çıktısı:** 4 kez 'İleri + 90 Derece Sağa Dön' döngüsüyle kusursuz bir kare oluşturur ve 4 vuruşlu davul temposu üretir.
* **Kazanım:** Dik açı kavramı ve 4/4'lük temel müzik ölçüsü (`Algoritmik Geometri: 4x [İleri + 90°]`).
* **Kademelendirme:**
  * *7-9 Yaş:* Her kenarda kalın bir davul vuruşu duyulur; 4. vuruşta kare parlar.
  * *10-14 Yaş:* Açı parametresi `(turnAngle = 90)` ile çizgi uzunluğu arasındaki oran incelenir.

---

### 5. Düzgün Altıgen Çizimi ve Armonik Ses Halkası
* **Soru:** Öğrenenin tuval üzerinde tekrar sayısını 6 yaparak düzgün altıgen çizebilmesi ve altı notalı armonik bir melodi halkası oluşturabilmesi...
* **Öğrenim Çıktısı:** Tekrar sayısını 6'ya ve dönüş açısını 60 dereceye ayarlayarak petek/altıgen şeklini çizer.
* **Kazanım:** Parametrik geometrik genelleme (`Poligon Algoritması: 360 / 6 = 60°`).
* **Kademelendirme:**
  * *7-9 Yaş:* Arı peteği görseli tamamlanır; 6 köşede 6 pentatonik nota sırayla gam gibi çalar.
  * *10-14 Yaş:* `N = 6, angle = 360 / N` matematiksel modellemesi arayüzde çalıştırılır.

---

### 6. Kesintisiz Yörünge ve Sonsuz Döngü
* **Soru:** Öğrenenin tuval üzerinde fırçayı kesintisiz dairesel bir hatta sokarak sonsuz döngüyle kesintisiz bir ritim nabzı üretebilmesi...
* **Öğrenim Çıktısı:** Bitiş koşulu olmayan 'Sonsuz Tekrar' bloğunu kullanarak fırçayı dairesel yörüngede durmaksızın döndürür.
* **Kazanım:** Kesintisiz çalışan döngüler ve periyodik sistem nabzı (`Sonsuz Döngü / Infinite Loop: While(true)`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça lunaparktaki dönme dolap gibi döner; her turda neşeli bir melodi tekrarlar.
  * *10-14 Yaş:* Arka plan canlandırma döngüsü (`requestAnimationFrame`) mantığı aktarılır.

---

### 7. Geri Sayım Döngüsü ve Kalkış Ritmi
* **Soru:** Öğrenenin tuval üzerinde döngü sayaç değerini 5'ten geriye işleterek çizgiyi daraltabilmesi ve geri sayımlı kalkış temposu yakalayabilmesi...
* **Öğrenim Çıktısı:** Döngünün her adımında azalan değerle çizgiyi hedefe doğru yaklaştırır ve kalkış ritmini başlatır.
* **Kazanım:** Ters yönlü iterasyon (`Azalan Döngü / Countdown Loop: for i = 5 to 1`).
* **Kademelendirme:**
  * *7-9 Yaş:* 5-4-3-2-1 geri sayımı ekranda ışıklarla parlar, 1 olunca roket kalkış sesi çalar.
  * *10-14 Yaş:* Döngü indeksi `(i--)` ekranda gerçek zamanlı izlenir.

---

### 8. İç İçe Döngüler (Çok Yapraklı Geometrik Çiçek)
* **Soru:** Öğrenenin tuval üzerinde döngü içine başka bir döngü yerleştirerek çok yapraklı geometrik bir çiçek ve poliritmik ses deseni üretebilmesi...
* **Öğrenim Çıktısı:** Bir kare çizen döngüyü dışarıda 6 kez döndüren üst döngüye bağlayarak mandala çiçeği oluşturur.
* **Kazanım:** İç içe geçmiş yapılar ve katmanlı iterasyon (`İç İçe Döngü / Nested Loops`).
* **Kademelendirme:**
  * *7-9 Yaş:* Dış döngü döndükçe sahneye rengarenk yapraklar açılır ve büyüleyici bir ksilofon akoru duyulur.
  * *10-14 Yaş:* Toplam işlem sayısı formülü `(DışTekrar * İçTekrar = 6 * 4 = 24 adım)` hesaplatılır.

---

### 9. Koşullu Erken Çıkış (Döngüyü Kırma)
* **Soru:** Öğrenenin tuval üzerinde dönen döngüyü kırmızı durma çizgisine ulaştığı anda kırarak güvenli çıkış yapabilmesi...
* **Öğrenim Çıktısı:** Sürekli dönen fırçanın önüne kırmızı durak çizgisi koyarak döngünün şart sağlandığında durmasını sağlar.
* **Kazanım:** Döngüden erken çıkış ve kontrol mekanizması (`Erken Çıkış / Loop Break, While-Until`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fırça kırmızı ışığı görünce 'fren' sesiyle durur, güvenli parka geçer.
  * *10-14 Yaş:* `if (sensor == RED) break;` blok yapısı uygulanır.

---

### 10. Büyük Koreografi Senfonisi (Bölüm Sentezi)
* **Soru:** Öğrenenin sahneye eklediği tüm geometrik şekil döngülerini tek bir büyük koreografi döngüsünde birleştirip ritmik dans şovunu başlatabilmesi...
* **Öğrenim Çıktısı:** Üçgen, kare ve altıgen döngülerini sırayla bağlayarak tuvalde tam bir görsel ve müzikal koreografi sahneler.
* **Kazanım:** Bölüm sonu büyük sentezi, algoritmik orkestrasyon (`Choreography Pipeline, Full Loop Synthesis`).
* **Kademelendirme:**
  * *7-9 Yaş:* Tüm geometrik şekiller sahnede dans eder, ışıklar ve melodiler tam bir şölene dönüşür.
  * *10-14 Yaş:* Şekiller arası zamanlama ve geçiş parametreleri ayarlanarak ritmik bir demo üretilir.
