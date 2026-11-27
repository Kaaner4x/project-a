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
            var validChapters = TaskRepository.GetAll()
                .Select(t => t.ChapterId)
                .Distinct()
                .ToHashSet();

            if (id.HasValue && !validChapters.Contains(id.Value))
            {
                return RedirectToAction(nameof(Index), new { id = 1 });
            }

            // Eğer id belirtilmediyse (veya /Bolum olarak gelindiyse) tüm görevleri sun
            var tasks = id.HasValue ? TaskRepository.GetByChapter(id.Value) : TaskRepository.GetAll();

            ViewData["ChapterId"] = id ?? 0;
            ViewData["ChapterTitle"] = id.HasValue 
                ? (id.Value == 1 ? "1. Bölüm: Temel Etkileşimler" : (id.Value == 2 ? "2. Bölüm: İkili (Binary) Sayı Sistemi ve Devreler" : $"{id.Value}. Bölüm"))
                : "Püskül'ün Macera Patikası";
            ViewData["ChapterDescription"] = "Renkli patikayı takip et, kodları çöz ve yıldızları topla!";

            return View(tasks);
        }
    }
}
