using System.Collections.Generic;
using System.Linq;

namespace project_a.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
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
                NextId = 0
            }
        };

        public static List<TaskModel> GetAll() => Tasks;

        public static TaskModel? GetById(int id) => Tasks.FirstOrDefault(t => t.Id == id);
    }
}
