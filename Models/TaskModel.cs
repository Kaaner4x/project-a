using System.Collections.Generic;
using System.Linq;

namespace project_a.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        public int ChapterId { get; set; } = 1;
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Concept { get; set; } = string.Empty;
        public string ConceptBadge { get; set; } = string.Empty;
        public string Icon { get; set; } = "🎯";
        public string ColorTheme { get; set; } = "#4F46E5";
        public string BgGradient { get; set; } = "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)";
        public string Description { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
        public string SoundInfo { get; set; } = string.Empty;
        public string PedagogicOutcome { get; set; } = string.Empty;
        public string Hint { get; set; } = string.Empty;
        public int PreviousId { get; set; }
        public int NextId { get; set; }
    }

    public static class TaskRepository
    {
        private static readonly List<TaskModel> Tasks = new()
        {
            new TaskModel
            {
                Id = 1,
                Title = "Sabit Nesne ile İlk Etkileşim",
                Subtitle = "Tıklama, Küçülme & Ses Tetikleme",
                Concept = "Olay Tetikleme (OnClick)",
                ConceptBadge = "Olay / Event",
                Icon = "👆",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
                Description = "Tuval üzerindeki sihirli müzik topuna dokun; her dokunuşta top küçülür ve estetik melodiler çalar!",
                Instruction = "Sihirli müzik topuna 3 kez dokun! Her dokunuşta top küçülür ve 3. basışta görev OK onayına dönüşür.",
                SoundInfo = "Her dokunuşta estetik, yumuşak ksilofon/celesta Do, Mi, Sol notaları ve kristal çanlar çalar.",
                PedagogicOutcome = "Sabit nesneye dokunarak boyut değişikliği ve olay tetikleme (Event-Driven State Change) mantığını keşfeder.",
                Hint = "Ortadaki renkli topa tıkla, 3 kez küçüldüğünde görev tamamlanacak!",
                PreviousId = 0,
                NextId = 2
            },
            new TaskModel
            {
                Id = 2,
                Title = "Parça-Bütün İlişkisi (Robot Yapbozu)",
                Subtitle = "Modülerlik & Parça Birleştirme",
                Concept = "Modülerlik (Decomposition)",
                ConceptBadge = "Ayrıştırma / Modülerlik",
                Icon = "🤖",
                ColorTheme = "#0EA5E9",
                BgGradient = "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
                Description = "Büyük bir problemi küçük parçalara bölerek çöz! Robotun kafa, gövde ve ayak parçalarını yuvalarına yerleştir.",
                Instruction = "Sağdaki robot parçalarını sürükleyip soldaki gölgeli kılavuz yuvalarına bırak.",
                SoundInfo = "Her parça oturduğunda artan perdeli pentatonik nota (Do -> Re -> Mi), bitince neşeli akor çalar.",
                PedagogicOutcome = "Ayrık duran parçaları doğru yerlerine oturtarak işlevsel bir bütünü inşa eder. Modüler düşünme ve problem ayrıştırma kazanımı sağlar.",
                Hint = "Kafayı en üste, gövdeyi ortaya, ayakları alta doğru sürükle.",
                PreviousId = 1,
                NextId = 3
            },
            new TaskModel
            {
                Id = 3,
                Title = "Hedefe Taşıma ve Koordinat",
                Subtitle = "Mekânsal Konum & Manyetik Yuva",
                Concept = "Konumlandırma (X-Y, Snap-to-Target)",
                ConceptBadge = "Koordinat / X-Y",
                Icon = "⭐",
                ColorTheme = "#F59E0B",
                BgGradient = "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                Description = "Yıldızı gökyüzündeki manyetik yuvasına taşıyarak 2 boyutlu düzlemde koordinatları keşfet!",
                Instruction = "Yıldızı tutarak hedef halkaya doğru sürükle ve bırak.",
                SoundInfo = "Sürüklerken yumuşak kayma tonu, hedefe kilitlendiğinde pentatonik çan sesi çalar.",
                PedagogicOutcome = "Nesneyi ekranda basılı tutarak taşır ve hedef alana kilitler. Mekânsal konumlandırma ve koordinat farkındalığı kazanır.",
                Hint = "Yıldızı hedefin içine yaklaştırdığında manyetik olarak yerine oturacaktır.",
                PreviousId = 2,
                NextId = 4
            },
            new TaskModel
            {
                Id = 4,
                Title = "Katman Algısı ve Keşif",
                Subtitle = "7 Parça Arasında Güneşi Bulma (Z-Index)",
                Concept = "Derinlik Hiyerarşisi (Z-Index)",
                ConceptBadge = "Katman / Z-Index",
                Icon = "☁️",
                ColorTheme = "#06B6D4",
                BgGradient = "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                Description = "Güneş gökyüzündeki 7 farklı katmandan birinin arkasında saklanmış! Parçaları tek tek kenara çekip deneyerek güneşi keşfet.",
                Instruction = "Gökyüzündeki 7 bulut katmanını parmağınla kenara çekerek arkasında saklanan güneşi bul ve ortaya çıkar.",
                SoundInfo = "Bulut kayarken rüzgar efekti, gizli simgelerde sevimli tını, güneşi bulunca zafer akoru çalar.",
                PedagogicOutcome = "Katmanlar arasında deneme-yanılma ve araştırma yaparak gizli nesneyi keşfeder. Z-Index katman hiyerarşisi algısı pekişir.",
                Hint = "Bulutları teker teker kenara kaydır, arkasında güneş saklı olanı keşfet!",
                PreviousId = 3,
                NextId = 5
            },
            new TaskModel
            {
                Id = 5,
                Title = "Engeli Temizleme & Hata Ayıklama",
                Subtitle = "Yolu Açma & Neden-Sonuç Analizi",
                Concept = "Hata Ayıklama (Debugging)",
                ConceptBadge = "Hata Ayıklama / Debug",
                Icon = "🧹",
                ColorTheme = "#EF4444",
                BgGradient = "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                Description = "Yolda bir hata (Bug) var ve fırçamız geçemiyor! Akışı tıkayan hatayı Çöp Kutusuna sürükleyip bırakarak yolu temizle.",
                Instruction = "Yoldaki hatayı (Bug) tutup yukarıdaki Çöp Kutusuna 🗑️ sürükle ve içine bırak.",
                SoundInfo = "Böcek çöp kutusuna atıldığında fırlatma efekti ardından fırçanın neşeli ilerleme melodisi çalar.",
                PedagogicOutcome = "İlerlemeyi durduran hatayı tespit eder ve çöp kutusuna atarak temizler. Algoritmik hata ayıklama (debugging) ve engelleri giderme mantığını kavrar.",
                Hint = "Böceği parmağınla tutup Çöp Kutusunun üzerine getir ve içine bırak!",
                PreviousId = 4,
                NextId = 6
            },
            new TaskModel
            {
                Id = 6,
                Title = "Ritmik Yörünge ve Sayaç",
                Subtitle = "Döngü Sayısını Gözlemleyip Tahmin Etme",
                Concept = "Döngü Tekrarı (Loop Iteration)",
                ConceptBadge = "Döngü / Loop",
                Icon = "🔄",
                ColorTheme = "#10B981",
                BgGradient = "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                Description = "Yıldız kendi belirlediği sayıda yörüngede dönüyor! Turları dikkatle izleyip say ve doğru kartı tahmin et.",
                Instruction = "Yıldızın kaç tur döndüğünü izle ve dinle. Ardından alttaki kartlardan doğru sayıyı (1, 2, 3 veya 4) seç.",
                SoundInfo = "Yıldız her turu tamamladığında melodik bir ritim tınısı çalar, doğru tahminde zafer akoru duyulur.",
                PedagogicOutcome = "Görsel ve işitsel döngü tekrarlarını sayarak zihinde algoritma modellemesi yapar. Döngü sayacı mantığını kavrar.",
                Hint = "Yıldız başlangıç kapısından her geçtiğinde bir tur tamamlar. Sesleri ve dönüşleri dikkatlice say!",
                PreviousId = 5,
                NextId = 7
            },
            new TaskModel
            {
                Id = 7,
                Title = "İki Yollu Koşullu Seçim",
                Subtitle = "İşitsel & Görsel Dalga ile Karar Verme",
                Concept = "Karar Mekanizması (If - Else)",
                ConceptBadge = "Koşul / If-Else",
                Icon = "🚪",
                ColorTheme = "#8B5CF6",
                BgGradient = "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                Description = "Eğer mor dalga yayılıyorsa Mor Kapıyı, eğer sarı dalga yayılıyorsa Sarı Kapıyı seç!",
                Instruction = "Merkezdeki sinyali gözlemle ve dinle. Rengine uygun doğru kapıya dokun.",
                SoundInfo = "Doğru kapıda uyumlu pentatonik melodi, yanlışta nazik düşündürücü soru tonu çalar.",
                PedagogicOutcome = "Uyarıcıyı gözlemler ve koşul kuralına göre dallanan iki seçenekten doğru olanı seçer (If-Else).",
                Hint = "Mor dalga gelirse Mor Kapıya, sarı dalga gelirse Sarı Kapıya dokun.",
                PreviousId = 6,
                NextId = 8
            },
            new TaskModel
            {
                Id = 8,
                Title = "Dokunsal Boyut Ölçekleme",
                Subtitle = "Nesne Özelliği Değiştirme & Dar Geçit",
                Concept = "Nesne Özellikleri (Scale / Size)",
                ConceptBadge = "Özellik / Scale",
                Icon = "🔍",
                ColorTheme = "#EC4899",
                BgGradient = "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
                Description = "Püskül dar lazer kapısından geçemeyecek kadar büyük! Boyut kontrolüyle onu küçülterek geçitten geçir.",
                Instruction = "[-] butonuyla Püskül'ü küçült. Kapı yeşile döndüğünde Püskül'ü sürükleyerek veya 'Geç ▶' butonuna basarak bitişe ulaştır.",
                SoundInfo = "Püskül küçüldükçe ses tizleşir, büyüdükçe kalınlaşır. Geçitten geçip bayrağa ulaştığında zafer akoru çalar.",
                PedagogicOutcome = "Nesnelerin değişken özelliklerini (property) kavrar. Boyut (scale) değerini fiziksel sınırlara göre ayarlamayı öğrenir.",
                Hint = "[-] Küçült butonuna basarak boyutu 0.8x seviyesine getir, ardından geçitten geçir!",
                PreviousId = 7,
                NextId = 9
            },
            new TaskModel
            {
                Id = 9,
                Title = "Pentatonik Dizi Hafızası",
                Subtitle = "Sıralı Dizi Mantığı (Array / FIFO)",
                Concept = "Sıralı Dizi Mantığı (Array / Sequence)",
                ConceptBadge = "Dizi / Array",
                Icon = "🎵",
                ColorTheme = "#14B8A6",
                BgGradient = "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
                Description = "Çalan 3 notalık melodi dizisini aklında tut ve aynı sırayla ksilofon tuşlarına bas!",
                Instruction = "Önce sistemin çaldığı sırayı dinle ve izle, ardından aynı sırayla 3 tuşa bas.",
                SoundInfo = "Pentatonik notalar (Do, Re, Mi, Sol, La) sıralı çalar. Dizi tamamlanınca kutlama ksilofonu çalar.",
                PedagogicOutcome = "Sıralı indeks mantığını (Array / List) kavrar. Kısa süreli çalışma belleğiyle adımları sırayla yürütür.",
                Hint = "'Melodiyi Dinle' butonuna basıp tuşların yanıp sönme sırasını takip et.",
                PreviousId = 8,
                NextId = 10
            },
            new TaskModel
            {
                Id = 10,
                Title = "Simetrik Çift Nesne",
                Subtitle = "İlişkili Değişkenler & Senkronizasyon",
                Concept = "İlişkili Değişkenler (Senkronizasyon)",
                ConceptBadge = "Simetri / Değişken",
                Icon = "🪞",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4338ca 100%)",
                Description = "Birinci fırçayı hareket ettirdiğinde ayna ikizi ters yönde hareket eder. İki hedefi aynı anda vur!",
                Instruction = "Sol fırçayı sürükleyerek veya oklarla hareket ettir; her iki fırçanın aynı anda hedefe girmesini sağla.",
                SoundInfo = "İki enstrümanın eşzamanlı armonik düeti çalar, hedefe varıldığında muhteşem akor patlar.",
                PedagogicOutcome = "Bir değişkendeki değişimin ilişkili diğer değişkeni nasıl etkilediğini deneyimler. Senkron çalışma bilinci kazanır.",
                Hint = "Sol fırçayı mavi hedefe yaklaştırdıkça sağ fırça da pembe hedefe yaklaşacaktır.",
                PreviousId = 9,
                NextId = 11
            },
            new TaskModel
            {
                Id = 11,
                ChapterId = 2,
                Title = "Bit Kavramı (0 ve 1 Durumu)",
                Subtitle = "Kapalı (0) ve Açık (1) Mantığı",
                Concept = "İkili Durum (Bit: 0 ve 1)",
                ConceptBadge = "Bit / İkili Durum",
                Icon = "💡",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
                Description = "Tek bir ampulün Kapalı = 0, Açık = 1 anlamına geldiğini keşfet. Anahtarla ampulü yakıp söndürerek bitin nasıl değiştiğini gör!",
                Instruction = "Tuvaldeki anahtara dokunarak ampulü Açık (1) yap, ardından Kapalı (0) konumuna getir.",
                SoundInfo = "Mekanik röle anahtar tık sesi ve dijital onay pıtırtısı.",
                PedagogicOutcome = "Tek bir bitin 0 ve 1 arasındaki ikili durum değişimini anahtarla deneyimleyerek kavrar.",
                Hint = "Anahtara basarak ampulü yak (1), sonra tekrar basarak söndür (0).",
                PreviousId = 10,
                NextId = 12
            },
            new TaskModel
            {
                Id = 12,
                ChapterId = 2,
                Title = "En Küçük Basamak (2^0 = 1)",
                Subtitle = "İlk Basamak ile Hedef Oluşturma",
                Concept = "Basamak Değeri (2^0 = 1)",
                ConceptBadge = "Basamak / 2^0 = 1",
                Icon = "💡",
                ColorTheme = "#10B981",
                BgGradient = "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                Description = "İkilik sistemin ilk basamağı 2^0 = 1 değerindedir. Ampulü yakarak Hedef Sayı: 1'e ulaş!",
                Instruction = "1 değerindeki ampule dokunup yakarak hedef sayıya (1) ulaş.",
                SoundInfo = "Anahtar tıklama ve dijital onay sesi.",
                PedagogicOutcome = "İlk basamağın (2^0 = 1) ondalık değer karşılığını anlar.",
                Hint = "Ampulün üzerine dokunarak onu Açık (1) yap ve toplamı 1'e eşitle.",
                PreviousId = 11,
                NextId = 13
            },
            new TaskModel
            {
                Id = 13,
                ChapterId = 2,
                Title = "İkinci Basamak (2^1 = 2) ve İkili Toplam",
                Subtitle = "2 ve 1 Değerleriyle Hedef Oluşturma",
                Concept = "İkili Toplam (2^1 ve 2^0)",
                ConceptBadge = "Toplam / 2^1 ve 2^0",
                Icon = "💡",
                ColorTheme = "#0EA5E9",
                BgGradient = "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
                Description = "2 ve 1 değerindeki iki ampulü kullanarak 0, 1, 2 ve 3 sayılarını üretebilirsin. Hedef sayıya ulaş!",
                Instruction = "Hedef sayı olan 3'e ulaşmak için uygun ampulleri yak (2 + 1 = 3).",
                SoundInfo = "Röle anahtar klik sesi ve başarı pıtırtısı.",
                PedagogicOutcome = "2 ve 1 basamak değerlerinin toplamıyla ikili kombinasyonları oluşturmayı keşfeder.",
                Hint = "Her iki ampulü de yakarsan 2 + 1 = 3 olur!",
                PreviousId = 12,
                NextId = 14
            },
            new TaskModel
            {
                Id = 14,
                ChapterId = 2,
                Title = "Üçüncü Basamak (2^2 = 4) ile 0–7 Aralığı",
                Subtitle = "4, 2 ve 1 Ağırlıklarıyla 3 Bitlik Sayı",
                Concept = "3 Bitlik Sayı (2^2, 2^1, 2^0)",
                ConceptBadge = "3 Bit / 0-7",
                Icon = "💡",
                ColorTheme = "#F59E0B",
                BgGradient = "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                Description = "Soldan sağa 4, 2 ve 1 basamaklarıyla 0 ile 7 arasındaki tüm sayıları üretebilirsin. Hedef sayıya tam ulaş!",
                Instruction = "Hedef sayı olan 5'e ulaşmak için 4 ve 1 değerli ampulleri yak.",
                SoundInfo = "Mekanik klik sesleri ve dijital başarı tınısı.",
                PedagogicOutcome = "4, 2, 1 ağırlıklarıyla 3 bitlik sayı kurgulama yeteneği kazanır.",
                Hint = "4 + 1 = 5! Ortadaki 2'yi kapalı tut, 4 ve 1'i yak.",
                PreviousId = 13,
                NextId = 15
            },
            new TaskModel
            {
                Id = 15,
                ChapterId = 2,
                Title = "Dördüncü Basamak (2^3 = 8) ile 0–15 Aralığı",
                Subtitle = "8, 4, 2, 1 Ağırlıklarıyla 4 Bitlik Sayı",
                Concept = "4 Bitlik Sayı (Nibble / 0-15)",
                ConceptBadge = "4 Bit / 0-15",
                Icon = "💡",
                ColorTheme = "#8B5CF6",
                BgGradient = "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                Description = "8, 4, 2, 1 ağırlıklarına sahip 4 ampul ile 0'dan 15'e kadar olan sayıları oluşturabilirsin. Hangi basamakların 1 olması gerektiğini belirle!",
                Instruction = "Hedef sayı olan 10'a ulaşmak için doğru ampulleri yak (8 + 2 = 10).",
                SoundInfo = "Röle tıkırtısı ve onay sesi.",
                PedagogicOutcome = "4 bitlik sayı basamaklarını analiz ederek hedefe ulaşır.",
                Hint = "8 ve 2 değerli ampulleri yakarsan 8 + 2 = 10 olur!",
                PreviousId = 14,
                NextId = 16
            },
            new TaskModel
            {
                Id = 16,
                ChapterId = 2,
                Title = "5 Bitlik Tam Panel (16, 8, 4, 2, 1)",
                Subtitle = "Tam Panel Hedef Bulmaca & Kontrol",
                Concept = "5 Bitlik Panel (0-31)",
                ConceptBadge = "5 Bit / 0-31",
                Icon = "🎛️",
                ColorTheme = "#EC4899",
                BgGradient = "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
                Description = "16, 8, 4, 2, 1 değerleriyle 1 ile 31 arasındaki sayıları oluştur. Hedef sayıya ulaş ve 'Kontrol Et' butonuna bas!",
                Instruction = "Hedef sayı olan 7'ye ulaşmak için 4, 2 ve 1 ampullerini yak, ardından 'Kontrol Et'e bas.",
                SoundInfo = "Tıklama sesleri ve doğrulama efekti.",
                PedagogicOutcome = "5 bitlik panelde tam kontrol ve doğrulama mantığını kavrar.",
                Hint = "4 + 2 + 1 = 7 yapar. 16 ve 8 kapalı kalsın, diğerlerini yakıp 'Kontrol Et'e bas.",
                PreviousId = 15,
                NextId = 17
            },
            new TaskModel
            {
                Id = 17,
                ChapterId = 2,
                Title = "Bit Dizisinden Ondalık Sayı Okuma",
                Subtitle = "İkili Kodu (Binary) Ondalık Sayıya (Decimal) Çevirme",
                Concept = "Binary -> Decimal Dönüşümü",
                ConceptBadge = "Dönüşüm / Kod Okuma",
                Icon = "🔍",
                ColorTheme = "#06B6D4",
                BgGradient = "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                Description = "Hazır yanan 5 bitlik ikilik kodu (0 ve 1 dizisini) oku ve karşılık gelen ondalık sayıyı seçeneklerden seç!",
                Instruction = "Ampullerin yanan basamaklarını (1'leri) topla ve alttaki kartlardan doğru sayıyı seç.",
                SoundInfo = "Pop tıklamaları ve dijital kutlama sesi.",
                PedagogicOutcome = "İkilik koddaki bitleri çözümleyerek ondalık değere dönüştürme pratiği yapar.",
                Hint = "Yanan ampullerin üzerindeki değerleri topla (Örn: 8 + 2 + 1 = 11).",
                PreviousId = 16,
                NextId = 18
            },
            new TaskModel
            {
                Id = 18,
                ChapterId = 2,
                Title = "Eksik Biti Tamamlama",
                Subtitle = "Kısmi Toplamdan Hedefe Ulaşma",
                Concept = "Fark Analizi & Eksik Bit",
                ConceptBadge = "Fark / Eksik Bit",
                Icon = "🧩",
                ColorTheme = "#F97316",
                BgGradient = "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
                Description = "Bazı ampuller önceden açık verilmiştir. Hedef sayıya ulaşmak için eksik olan basamağı bulup yak veya söndür!",
                Instruction = "Mevcut toplama bak, hedef sayı olan 13'e ulaşmak için eksik basamağı aç ve 'Kontrol Et'e bas.",
                SoundInfo = "Röle tık sesi ve onay efekti.",
                PedagogicOutcome = "Mevcut durum ile hedef durum arasındaki farkı hesaplayıp ikilik basamakları optimize eder.",
                Hint = "Mevcut toplam 9 ise (8 + 1), hedefe (13) ulaşmak için 4 değerli ampulü yakmalısın!",
                PreviousId = 17,
                NextId = 19
            },
            new TaskModel
            {
                Id = 19,
                ChapterId = 2,
                Title = "Çift ve Tek Sayıların Son Biti (LSB)",
                Subtitle = "En Sağdaki Bitin (2^0 = 1) Belirleyiciliği",
                Concept = "En Düşük Anlamlı Bit (LSB / Tek-Çift Kuralı)",
                ConceptBadge = "LSB / Tek-Çift",
                Icon = "⚖️",
                ColorTheme = "#14B8A6",
                BgGradient = "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
                Description = "İkilik sistemde en sağdaki bit (1 değerli ampul) 1 ise sayı TEK, 0 ise ÇİFT'tir. Hedef sayı kuralına uygun sayıyı kur!",
                Instruction = "Hedef: Değeri 14 olan ÇİFT bir sayı oluştur (En sağdaki 1 biti kapalı 0 olmalı).",
                SoundInfo = "Tıklama ve kural doğrulama tınısı.",
                PedagogicOutcome = "En düşük anlamlı bitin (LSB) tek ve çift sayıları belirleme kuralını anlar.",
                Hint = "14 çift bir sayıdır: 8 + 4 + 2 = 14. En sağdaki 1 ampulü mutlaka kapalı (0) olmalıdır!",
                PreviousId = 18,
                NextId = 20
            },
            new TaskModel
            {
                Id = 20,
                ChapterId = 2,
                Title = "Bit Kaydırma Mantığı (x2 ve /2)",
                Subtitle = "Sola Kaydır (x2) & Sağa Kaydır (/2)",
                Concept = "Bit Kaydırma (Bitshift: << ve >>)",
                ConceptBadge = "Kaydırma / Bitshift",
                Icon = "↔️",
                ColorTheme = "#3B82F6",
                BgGradient = "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
                Description = "İkilik sistemde bir biti bir basamak sola kaydırmak sayıyı 2 ile çarpar (x2), sağa kaydırmak 2'ye böler (/2)! Kaydırarak hedefe ulaş.",
                Instruction = "Yanan 2 bitini 'Sola Kaydır (x2)' butonunu kullanarak hedef sayı olan 8'e ulaştır.",
                SoundInfo = "Hızlı kayma pıtırtısı ve dijital başarı sinyali.",
                PedagogicOutcome = "Bit kaydırma işleminin (Bitwise Shift) aritmetik çarpma ve bölme etkisini fark eder.",
                Hint = "'Sola Kaydır' butonuna bastığında bit sola kayar ve değeri 2 katına çıkar (2 -> 4 -> 8).",
                PreviousId = 19,
                NextId = 21
            },
            new TaskModel
            {
                Id = 21,
                ChapterId = 2,
                Title = "Anahtar Koşulu ile Hedef Bit Kilidi",
                Subtitle = "Koşullu Onay (If Target Achieved Then Unlock)",
                Concept = "Koşullu Mantık Kilidi (If Condition)",
                ConceptBadge = "Koşul / Bit Kilidi",
                Icon = "🔐",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4338ca 100%)",
                Description = "Hedef bit kombinasyonu tam oluşmadan anahtar devreyi açmaz! Doğru ampulleri yak, ardından Onay Anahtarını çevirerek kilidi aç.",
                Instruction = "Hedef sayı olan 19'a (16 + 2 + 1) ulaş, ardından devreyi tamamlamak için Onay Anahtarına dokun.",
                SoundInfo = "Röle açılma tıkırtısı ve kilit açılma tınısı.",
                PedagogicOutcome = "Koşullu mantık (if condition) ile veri doğrulama ve durum kilidi açma mekanizmasını kavrar.",
                Hint = "Önce 16, 2 ve 1 ampullerini yak (16 + 2 + 1 = 19). Sonra alttaki Onay Anahtarına dokun.",
                PreviousId = 20,
                NextId = 22
            },
            new TaskModel
            {
                Id = 22,
                ChapterId = 2,
                Title = "Final İkilik Toplam Sınavı",
                Subtitle = "5 Ampul Paneli ile Hedefe Ulaşma & Sıfırlama Kuralı",
                Concept = "Büyük Final Sınavı (5 Bit Binary Mastery)",
                ConceptBadge = "Final / 5 Bit Master",
                Icon = "👑",
                ColorTheme = "#F59E0B",
                BgGradient = "linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)",
                Description = "Tüm 2^n basamaklarını (16, 8, 4, 2, 1) kullanarak verilen hedef sayıya (7) tek seferde ulaş ve 'Kontrol Et'e bas. Hatalıysa devre sıfırlanır!",
                Instruction = "5 ampulü kullanarak Hedef Sayı olan 7'yi oluştur ve 'Kontrol Et' butonuna bas. Yanlışsa baştan denersin!",
                SoundInfo = "Tıklama sesleri ve büyük zafer şöleni.",
                PedagogicOutcome = "Tüm ikilik basamakları ustalıkla birleştirir, hata durumunda kendini düzelterek hedefe ulaşır.",
                Hint = "Hedef 7: 4 + 2 + 1 = 7. Yalnızca 4, 2 ve 1 ampullerini yakıp 'Kontrol Et'e bas!",
                PreviousId = 21,
                NextId = 0
            }
        };

        public static List<TaskModel> GetAll() => Tasks.ToList();

        public static List<TaskModel> GetByChapter(int chapterId) => Tasks.Where(t => t.ChapterId == chapterId).ToList();

        public static TaskModel? GetById(int id) => id <= 0 ? null : Tasks.FirstOrDefault(t => t.Id == id);
    }
}
