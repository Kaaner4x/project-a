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
                Subtitle = "Tıklama & Ses Tetikleme",
                Concept = "Olay Tetikleme (OnClick)",
                ConceptBadge = "Olay / Event",
                Icon = "👆",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
                Description = "Tuval üzerinde parıldayan sevimli fırça nesnesine dokunarak ilk algoritmik eylemini başlat!",
                Instruction = "Ekranda parıldayan fırçaya veya müzik topuna 3 kez tıkla/dokun.",
                SoundInfo = "Her dokunuşta Do (C4 - 261 Hz) notası ve ışıltı çanları çalar.",
                PedagogicOutcome = "Sabit nesneyi fark eder ve dokunarak/tıklayarak ilk eylemi başlatır. Görsel odaklanma ve olay güdümlü programlama (Event-Driven) mantığı edinir.",
                Hint = "Farenle veya parmağınla ortadaki parlayan sevimli nesneye dokun!",
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
                Subtitle = "Derinlik Hiyerarşisi (Z-Index)",
                Concept = "Derinlik Hiyerarşisi (Z-Index)",
                ConceptBadge = "Katman / Z-Index",
                Icon = "☁️",
                ColorTheme = "#06B6D4",
                BgGradient = "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                Description = "Güneş bulutun arkasında saklanmış! Öndeki katmanı kenara çekerek güneşi gökyüzüne çıkar.",
                Instruction = "Öndeki bulutu tutup sağa veya sola doğru sürükle, arkasındaki güneşi ortaya çıkar.",
                SoundInfo = "Bulut kayarken rüzgar efekti, güneş çıkınca sıcak majör akor çalar.",
                PedagogicOutcome = "Öndeki nesneyi kenara çekip altındaki gizli hedefi keşfeder. Görsel derinlik ve Z-Index katman hiyerarşisi algısı pekişir.",
                Hint = "Pofuduk bulutu parmağınla tutup tuvalin kenarına doğru çek.",
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
                Description = "Yolda bir engel var ve fırçamız geçemiyor! Akışı tıkayan engeli kenara fırlatıp yolu temizle.",
                Instruction = "Yolun ortasındaki taşı tutup tuvalin dışına fırlat veya 'Engeli Temizle' butonuna bas.",
                SoundInfo = "Fırlatma efekti ardından fırçanın neşeli ilerleme melodisi çalar.",
                PedagogicOutcome = "İlerlemeyi durduran engeli tespit eder ve yolu açar. Algoritmik hata ayıklama (debugging) ve engelleri giderme mantığını kavrar.",
                Hint = "Büyük taşı yukarı veya sağa doğru sürükleyip bırak.",
                PreviousId = 4,
                NextId = 6
            },
            new TaskModel
            {
                Id = 6,
                Title = "Ritmik Yörünge ve Sayaç",
                Subtitle = "Döngü Tekrarı & Sayaç Ayarı",
                Concept = "Döngü Tekrarı (Loop Iteration)",
                ConceptBadge = "Döngü / Loop",
                Icon = "🔄",
                ColorTheme = "#10B981",
                BgGradient = "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                Description = "Fırçayı kovalamana gerek yok; ona kaç tur atacağını söyle! Tur sayısını seç ve döngüyü başlat.",
                Instruction = "1x, 2x, 3x veya 4x tur sayısını belirle ve 'Döngüyü Başlat' butonuna tıkla.",
                SoundInfo = "Her tamamlanan turda ritmik perküsyon ve nota çalar, sayaç senkronize akar.",
                PedagogicOutcome = "Öngörülebilir durum tekrarını kavrar. Sürekli manuel işlem yerine döngü sayacı parametresi belirler.",
                Hint = "İstediğin tur sayısını seçtikten sonra yeşil 'Döngüyü Başlat' düğmesine bas.",
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
                Description = "Fırça dar tünelden geçemeyecek kadar büyük! Boyut kontrolüyle onu küçülterek tünelden geçir.",
                Instruction = "[-] ve [+] butonlarıyla fırçayı küçült, tünel yüksekliğine sığdığında 'Tünelden Geç'e bas.",
                SoundInfo = "Boyut küçüldükçe ses tizleşir, büyüdükçe kalınlaşır. Tünelden geçişte zafer akoru çalar.",
                PedagogicOutcome = "Nesnelerin değişken özelliklerini (property) kavrar. Boyut (scale) değerini amaca göre ayarlar.",
                Hint = "[-] butonuna 2-3 kez basarak fırçanın boyutunu tünelin genişliğine denk getir.",
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
                Title = "Döngü ile Geometrik Kare",
                Subtitle = "4 Adımlı Tekrarlı Çizim",
                Concept = "Döngü Tekrarı (Repeat 4 Times)",
                ConceptBadge = "Döngü / Loop",
                Icon = "🔄",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
                Description = "İleri git ve 90 derece dön eylemini 4 kez tekrarla! Püskül'ün arkasında bıraktığı ışıklı izle kareyi tamamla.",
                Instruction = "4 adımlı döngüyü çalıştırmak için 'Döngüyü Başlat' butonuna tıkla.",
                SoundInfo = "Her kenar çizildiğinde yükselen bir pentatonik melodi (Do - Re - Mi - Sol) çalar.",
                PedagogicOutcome = "Aynı kod satırını art arda yazmak yerine döngü bloğuyla (Loop) tekrar etmeyi ve açı kavramını keşfeder.",
                Hint = "Döngü butonuna tıkla ve Püskül'ün her kenarı sırayla nasıl çizdiğini izle.",
                PreviousId = 10,
                NextId = 12
            },
            new TaskModel
            {
                Id = 12,
                ChapterId = 2,
                Title = "İç İçe Yıldız Deseni",
                Subtitle = "İç İçe Döngüler (Nested Loops)",
                Concept = "İç İçe Döngü (Nested Loop)",
                ConceptBadge = "İç İçe Döngü",
                Icon = "⭐",
                ColorTheme = "#EC4899",
                BgGradient = "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
                Description = "Büyük bir döngünün içinde küçük bir döngü çalıştır! 5 köşeli parlak bir yıldız çiz ve parıltıları izle.",
                Instruction = "Yıldız döngüsünü başlat; her köşede Püskül minik bir ışıltı çemberi döner.",
                SoundInfo = "Köşelerde çınlayan parlak zil ve akor dizisi.",
                PedagogicOutcome = "Döngü içinde başka bir döngü yürütme mantığını görsel simetriyle kavrar.",
                Hint = "'Yıldızı Çiz' butonuna basarak iç içe dönen ritmik hareketi gözlemle.",
                PreviousId = 11,
                NextId = 13
            },
            new TaskModel
            {
                Id = 13,
                ChapterId = 2,
                Title = "Koşullu Kapı (Sensör Algısı)",
                Subtitle = "Renk Eşleşmesi ve If-Else",
                Concept = "Koşullu Mantık (If / Else)",
                ConceptBadge = "Koşul / If-Else",
                Icon = "🚦",
                ColorTheme = "#F59E0B",
                BgGradient = "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                Description = "Sensör gelen rengi okur: Eğer renk yeşil ise kapı açılır, kırmızı ise durur! Doğru sinyali ver.",
                Instruction = "Trafik ışığındaki 'Yeşil Işık' butonuna basarak sensörün kapıyı açmasını sağla.",
                SoundInfo = "Doğru renkte pozitif akor ve açılan kapı çıngırağı çalar.",
                PedagogicOutcome = "Sensör girdisini değerlendiren 'Eğer / Değilse' karar yapısını deneyimler.",
                Hint = "Kırmızıda dur, yeşilde geç! Butonlardan yeşil olanı seçmelisin.",
                PreviousId = 12,
                NextId = 14
            },
            new TaskModel
            {
                Id = 14,
                ChapterId = 2,
                Title = "Adım Sayacı Değişkeni",
                Subtitle = "Skor / Değişken Değeri Değiştirme",
                Concept = "Değişkenler (Counter Variable)",
                ConceptBadge = "Değişken / Variable",
                Icon = "🔢",
                ColorTheme = "#10B981",
                BgGradient = "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                Description = "Her tıklama sayacı 1 artırır! Sayacı hedef sayıya (5) ulaştırarak enerji kutusunu doldur.",
                Instruction = "Enerji butonuna tıklayarak sayacı tam 5 yap.",
                SoundInfo = "Her artışta yükselen frekansta su damlası sesi, 5'e ulaşınca kutlama akoru.",
                PedagogicOutcome = "Hafızada bir değer saklamayı ve bu değeri adım adım artırma (Increment) mantığını öğrenir.",
                Hint = "Butona 5 kez basarak sayaç göstergesini doldur.",
                PreviousId = 13,
                NextId = 15
            },
            new TaskModel
            {
                Id = 15,
                ChapterId = 2,
                Title = "Bozuk Kodu Onar (Bug Hunting)",
                Subtitle = "Yanlış Adımı Bulma ve Düzeltme",
                Concept = "Hata Ayıklama (Debugging)",
                ConceptBadge = "Hata Ayıklama",
                Icon = "🐞",
                ColorTheme = "#EF4444",
                BgGradient = "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                Description = "Algoritmada 1 yanlış blok var! Karakter yanlış yöne dönüyor. Hatalı bloğu tersine çevirerek yolu aç.",
                Instruction = "Hatalı yöne bakan 'Sola Dön' bloğuna dokunup onu 'Sağa Dön' olarak düzelt.",
                SoundInfo = "Hata düzeltilince sihirli düzelme sesi ve Püskül neşe melodisi.",
                PedagogicOutcome = "Algoritma akışındaki mantıksal hatayı izleyip tespit etme (Trace & Debug) becerisi kazanır.",
                Hint = "Püskül'ün yıldıza ulaşması için sağa dönmesi gerekir; kırmızı işaretli bloğa tıkla.",
                PreviousId = 14,
                NextId = 16
            },
            new TaskModel
            {
                Id = 16,
                ChapterId = 2,
                Title = "Müzikal Fonksiyon Bloğu",
                Subtitle = "Yeniden Kullanılabilir Fonksiyon Çağrısı",
                Concept = "Fonksiyonlar (Functions / Procedures)",
                ConceptBadge = "Fonksiyon / Method",
                Icon = "🧩",
                ColorTheme = "#8B5CF6",
                BgGradient = "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                Description = "3 adımlı bir müzikal hareketi tek bir 'DansEt()' fonksiyonu olarak paketledik! Fonksiyonu çağır ve dansı başlat.",
                Instruction = "'DansEt()' fonksiyon butonuna tıkla ve kaydedilmiş blok grubunun tek seferde çalışmasını izle.",
                SoundInfo = "Fonksiyon tetiklendiğinde senkron ritmik melodi ve dans figürü sesleri.",
                PedagogicOutcome = "Tekrarlanan kod parçalarını bir fonksiyon altında toplayıp çağırma (Reusability) kavramını keşfeder.",
                Hint = "Tek tek adım vermek yerine 'DansEt()' paket fonksiyonunu tetikle.",
                PreviousId = 15,
                NextId = 17
            },
            new TaskModel
            {
                Id = 17,
                ChapterId = 2,
                Title = "Parametreli Fonksiyon (Renk & Hız)",
                Subtitle = "Argüman Aktarımı",
                Concept = "Parametreler (Function Arguments)",
                ConceptBadge = "Parametre / Argument",
                Icon = "🎛️",
                ColorTheme = "#0EA5E9",
                BgGradient = "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
                Description = "Aynı fonksiyona farklı parametreler ver! Renk paletinden bir renk ve hız seçerek Püskül'ün hareketini özelleştir.",
                Instruction = "Parametrelerden bir renk seç (Mavi/Pembe) ve 'Uygula' butonuna tıkla.",
                SoundInfo = "Seçilen renge göre bas veya tiz tonlu melodik yanıt.",
                PedagogicOutcome = "Fonksiyonların dışarıdan parametre alarak farklı sonuçlar üretebileceğini kavrar.",
                Hint = "İstediğin renk butonuna basarak parametreyi belirle.",
                PreviousId = 16,
                NextId = 18
            },
            new TaskModel
            {
                Id = 18,
                ChapterId = 2,
                Title = "Kuyruk & Dizi Hafızası (Queue / Array)",
                Subtitle = "FIFO Mantığı ile Yol Oluşturma",
                Concept = "Diziler ve Kuyruk (Data Structure: Queue)",
                ConceptBadge = "Dizi / Queue",
                Icon = "📋",
                ColorTheme = "#14B8A6",
                BgGradient = "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
                Description = "Adımları sırayla kuyruğa ekle: 'İleri', 'Yukarı', 'İleri'. Çalıştır dediğinde sırayla yürütülsün!",
                Instruction = "Yön oklarına tıklayarak 3 adımlı komut listesini oluştur, sonra 'Yürüt'e bas.",
                SoundInfo = "Kuyruktaki her adım yürütüldüğünde sıralı pentatonik notalar.",
                PedagogicOutcome = "Komutların bir listede sırayla depolanıp sırayla yürütülmesi (Queue / Execution Stack) mantığını kavrar.",
                Hint = "Aşağıdaki oklardan 3 tanesine basıp ardından yeşil 'Yürüt' butonuna bas.",
                PreviousId = 17,
                NextId = 19
            },
            new TaskModel
            {
                Id = 19,
                ChapterId = 2,
                Title = "Olay Dinleyicisi (Klavye & Ok Tuşları)",
                Subtitle = "Gerçek Zamanlı Klavye/Buton Olayları",
                Concept = "Klavye Olayları (Event Listeners: KeyPress)",
                ConceptBadge = "Olay Dinleyici",
                Icon = "⌨️",
                ColorTheme = "#F97316",
                BgGradient = "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
                Description = "Ok butonlarıyla veya klavyedeki ok tuşlarıyla Püskül'ü yönlendir ve labirentteki 3 yıldızı topla!",
                Instruction = "Ekrandaki yön butonlarını veya klavye ok tuşlarını kullanarak yıldızlara ulaş.",
                SoundInfo = "Her yıldız alındığında neşeli çan sesi ve pentatonik yükseliş.",
                PedagogicOutcome = "Sürekli olay dinleme (Continuous Event Handling) ve etkileşimli kontrol döngüsünü öğrenir.",
                Hint = "Püskül'ü hareket ettirmek için yön oklarını kullan.",
                PreviousId = 18,
                NextId = 20
            },
            new TaskModel
            {
                Id = 20,
                ChapterId = 2,
                Title = "Bölüm Sonu Ustalık Görevi (Master Loop)",
                Subtitle = "Tüm Öğrenilenlerin Senfonisi",
                Concept = "Algoritmik Senfoni (Algorithmic Synthesis)",
                ConceptBadge = "Ustalık / Master",
                Icon = "👑",
                ColorTheme = "#6366F1",
                BgGradient = "linear-gradient(135deg, #818cf8 0%, #4338ca 100%)",
                Description = "Döngü, koşul, parametre ve ritmi birleştir! Püskül ile 4 köşeli kristal tapınağını uyandır ve 2. Bölüm Ustalık Kupasını kazan!",
                Instruction = "'Kristal Senfoniyi Başlat' butonuna tıkla ve tüm kristallerin ışıldamasını izle.",
                SoundInfo = "Tüm pentatonik gamların birleştiği zengin kutlama müziği ve alkışlar.",
                PedagogicOutcome = "Öğrenilen tüm temel kavramları (Döngü, Koşul, Fonksiyon, Olay) tek bir algoritmik sistemde birleştirir.",
                Hint = "Büyük mor butona bas ve 2. Bölümün büyük senfonisini izle!",
                PreviousId = 19,
                NextId = 0
            }
        };

        public static List<TaskModel> GetAll() => Tasks;

        public static List<TaskModel> GetByChapter(int chapterId) => Tasks.Where(t => t.ChapterId == chapterId).ToList();

        public static TaskModel? GetById(int id) => Tasks.FirstOrDefault(t => t.Id == id);
    }
}
