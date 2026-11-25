# 5. Bölüm: Ritim Ustası ve Fonksiyonlar (Öğrenim Çıktıları)

Bu doküman, 5. Bölüm kapsamındaki 10 sorunun bilişsel gelişim basamaklarına (Piaget evreleri) göre optimize edilmiş halini, iki kademeli (7-9 Yaş ve 10-14 Yaş) pedagojik hedeflerini ve aktif öğrenim çıktılarını içerir.

---

### 1. Fonksiyon Paketleme (İlk Fonksiyon Tanımı)
* **Soru:** Öğrenenin tuval üzerinde tekrarlanan üç adımlık zıplama ve çizim hareketini isimlendirilmiş tek bir fonksiyon kutusunda paketleyebilmesi...
* **Öğrenim Çıktısı:** 'İleri Git + Zıpla + Do Çal' adımlarını `ZiplaVeCal` isimli tek bir yeni komut bloğu içinde toplar.
* **Kazanım:** Prosedürel soyutlama ve kod paketleme (`Fonksiyon Tanımlama / Function Declaration`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sihirli bir hediye kutusuna 3 hareketi koyar ve kutunun üstüne zıplayan fırça etiketi yapıştırır.
  * *10-14 Yaş:* `void ZiplaVeCal() { forward(); jump(); playSound(); }` yapısı oluşturulur.

---

### 2. Fonksiyon Çağırma ve Yeniden Kullanım
* **Soru:** Öğrenenin tuval üzerinde tanımladığı fonksiyonu sahnenin farklı noktalarında tek bir çağrı komutuyla tekrar tekrar çalıştırabilmesi...
* **Öğrenim Çıktısı:** Daha önce tanımladığı `ZiplaVeCal` bloğunu 3 farklı engele tek tıkla uygulayarak tekrar yazma zahmetinden kurtulur.
* **Kazanım:** Yeniden kullanılabilirlik ve kod optimizasyonu (`Fonksiyon Çağrısı / Function Reusability`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sihirli kutuyu sahnenin istediği yerine koyup tıklar; kutu her yerde aynı neşeli dansı yapar.
  * *10-14 Yaş:* Program akışında fonksiyon çağırma anında yürütmenin fonksiyon gövdesine atlayıp geri döndüğü incelenir.

---

### 3. Değer Alan Fonksiyon (Nota/Ses Parametresi)
* **Soru:** Öğrenenin hazırladığı melodi fonksiyonuna dışarıdan nota rengi parametresi göndererek aynı figürü farklı ses perdesinde icra ettirebilmesi...
* **Öğrenim Çıktısı:** Fonksiyona girdi (parametre) yuvası ekler; aynı dans hareketini Do, Mi veya Sol notasıyla çaldırır.
* **Kazanım:** Parametrik fonksiyon yapısı (`Parametre Kullanımı / Arguments & Parameters`).
* **Kademelendirme:**
  * *7-9 Yaş:* Fonksiyon kutusunun ağzına hangi renk bilyeyi atarsa fırça o rengin melodisiyle dans eder.
  * *10-14 Yaş:* `CalNota(string notaRengi)` parametre tanımı ve fonksiyon imzasının mantığı kavranır.

---

### 4. Geometrik Parametre (Boyut/Ölçek)
* **Soru:** Öğrenenin çizim fonksiyonuna kenar uzunluğu parametresi vererek tek bir fonksiyon bloğuyla küçük veya büyük geometrik desenler üretebilmesi...
* **Öğrenim Çıktısı:** `CizKare(uzunluk)` fonksiyonuna 50 ve 100 değerlerini vererek tek bir şablonla iki farklı boyutta kare çizdirir.
* **Kazanım:** Parametrik ölçeklendirme ve dinamik çizim (`Geometrik Fonksiyon Parametresi`).
* **Kademelendirme:**
  * *7-9 Yaş:* 'Küçük' ve 'Büyük' butonlarıyla aynı şekli farklı boyutlarda ekrana basar.
  * *10-14 Yaş:* Sayısal parametre girişi ile alan ve çevre değişimleri gözlemlenir.

---

### 5. Fonksiyon Gövdesinde Merkezi Hata Ayıklama
* **Soru:** Öğrenenin yanlış nota basan fonksiyonun gövdesine girip hatayı tek noktada düzelterek projedeki tüm çağrıları aynı anda tamir edebilmesi...
* **Öğrenim Çıktısı:** Sahnede 4 yerde kullanılan bozuk bir hareketi tek tek düzeltmek yerine, fonksiyonun içini bir kere düzelterek hepsini onarır.
* **Kazanım:** Modüler hata ayıklama ve merkezi bakım (`Merkezi Bakım / Centralized Debugging`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sihirli kutunun kapağını açıp içindeki kırık notayı sağlam olanla değiştirir; sahnedeki 4 dansçı da anında düzelir.
  * *10-14 Yaş:* Kod tekrarı yerine tek merkezden yönetimin hata payını nasıl sıfırladığı deneyimlenir.

---

### 6. Fonksiyon Bileşimi (Üst Seviye Fonksiyon)
* **Soru:** Öğrenenin küçük fonksiyon bloklarını bir araya getirerek daha karmaşık bir deseni inşa eden üst seviye bileşik fonksiyon oluşturabilmesi...
* **Öğrenim Çıktısı:** `KareCiz` ve `UcgenCiz` fonksiyonlarını birleştirerek tek bir `EvCiz` üst fonksiyonu üretir.
* **Kazanım:** Fonksiyon kompozisyonu ve hiyerarşik soyutlama (`Fonksiyon Bileşimi / Function Composition`).
* **Kademelendirme:**
  * *7-9 Yaş:* Çatı kutusuyla duvar kutusunu birleştirip 'Ev Yap' büyük bloğunu oluşturur.
  * *10-14 Yaş:* `void EvCiz() { CizKare(100); CizUcgen(100); }` blok organizasyonu yapılır.

---

### 7. Değer Döndüren Fonksiyon (Return Değeri)
* **Soru:** Öğrenenin tuval üzerindeki aktif ampul sayısını hesaplayıp ana programa sayısal sonuç ileten dönüş değerli fonksiyonu çalıştırabilmesi...
* **Öğrenim Çıktısı:** Ekrana çizim yapmak yerine, sayım sonucunu bir sayı olarak geri ileten (`return count`) fonksiyon kurgular.
* **Kazanım:** Dönüş değerli fonksiyonlar (`Geri Dönüş Değeri / Return Value`).
* **Kademelendirme:**
  * *7-9 Yaş:* Dedektif fırça sahnedeki yıldızları sayıp cebine koyar ve ana karaktere "3 tane buldum!" diye fısıldar.
  * *10-14 Yaş:* `int YananAmpulleriSay()` fonksiyonunun geri döndürdüğü tamsayı değer ekrana yazdırılır.

---

### 8. Olay Dinleyici (Callback Fonksiyonu)
* **Soru:** Öğrenenin tuval üzerindeki ritim pedine dokunulduğunda devreye giren olay dinleyici (callback) fonksiyonunu tuşla eşleştirebilmesi...
* **Öğrenim Çıktısı:** Bir butona dokunma olayını (`OnClick`), önceden yazdığı müzik fonksiyonuna başarıyla bağlar.
* **Kazanım:** Olay yönelimli programlama (`Olay Dinleyici / Event Handler & Callback`).
* **Kademelendirme:**
  * *7-9 Yaş:* Davul pedine dokunduğu anda kendi yazdığı neşeli ritim kutusu anında patlar.
  * *10-14 Yaş:* `drumPad.addEventListener('click', calDavulRitmi)` mekanizması kavratılır.

---

### 9. Çok Kanallı Fonksiyon Orkestrasyonu
* **Soru:** Öğrenenin tuval üzerinde bas ritmini ve solo melodiyi modüler fonksiyonlar halinde sırayla yöneten çok kanallı müzik akışı kurabilmesi...
* **Öğrenim Çıktısı:** Bas ritmi fonksiyonu ile solo melodi fonksiyonunu sırayla ve uyumla tetikleyerek armoni yakalar.
* **Kazanım:** Çok parçalı modüler orkestrasyon (`Modüler Müzik Dağıtımı / Polyphonic Dispatching`).
* **Kademelendirme:**
  * *7-9 Yaş:* Sol tarafta davulcu robot, sağ tarafta flütçü robot fonksiyonları sırayla devreye girer.
  * *10-14 Yaş:* İki ayrı fonksiyonun çalışma zamanları ve gecikmeleri (timing/delay) senkronize edilir.

---

### 10. Büyük Sahne Orkestratörü (Bölüm Sentezi)
* **Soru:** Öğrenenin giriş, nakarat, solo ve final fonksiyonlarını ana yönetici fonksiyonda sıraya dizerek büyük sahne konserini yönetebilmesi...
* **Öğrenim Çıktısı:** Tüm alt fonksiyonları `BüyükKonser()` ana yöneticisinde toplayarak baştan sona eksiksiz bir beste icra eder.
* **Kazanım:** Ana program mimarisi ve üst düzey orkestrasyon (`Master Pipeline, Main Controller`).
* **Kademelendirme:**
  * *7-9 Yaş:* Büyük 'Konseri Başlat' düğmesine basar; tüm fonksiyon kutuları sırayla ışık saçarak tam şarkıyı çalar.
  * *10-14 Yaş:* `Main()` yöneticisi mantığı ile tüm alt prosedürlerin yürütme hattı görselleştirilir.
