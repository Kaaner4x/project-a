using Microsoft.AspNetCore.Mvc;
using project_a.Models;

namespace project_a.Controllers
{
    public class ChapterController : Controller
    {
        [Route("Bolum")]
        [Route("Bolum/{id:int?}")]
        [Route("Chapter")]
        [Route("Chapter/{id:int?}")]
        public IActionResult Index(int? id = null)
        {
            if (id.HasValue && id.Value != 1 && id.Value != 2)
            {
                return RedirectToAction(nameof(Index), new { id = 1 });
            }

            // Eğer id belirtilmediyse (veya /Bolum olarak gelindiyse) tüm görevleri (1-20) tek bir macerada sun
            // id=1 veya id=2 gelirse test uyumluluğu için ilgili bölümün 10 görevini sun
            var tasks = id.HasValue ? TaskRepository.GetByChapter(id.Value) : TaskRepository.GetAll();

            ViewData["ChapterId"] = id ?? 0;
            ViewData["ChapterTitle"] = id.HasValue 
                ? (id.Value == 1 ? "1. Bölüm: Temel Etkileşimler" : "2. Bölüm: Döngüler ve Kararlar")
                : "Püskül'ün Macera Patikası";
            ViewData["ChapterDescription"] = "1'den 20'ye uzanan rengarenk patikayı takip et, kodları çöz ve yıldızları topla!";

            return View(tasks);
        }
    }
}
