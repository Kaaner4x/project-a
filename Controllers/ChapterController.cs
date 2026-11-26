using Microsoft.AspNetCore.Mvc;
using project_a.Models;

namespace project_a.Controllers
{
    public class ChapterController : Controller
    {
        [Route("Bolum")]
        [Route("Bolum/{id:int}")]
        [Route("Chapter")]
        [Route("Chapter/{id:int}")]
        public IActionResult Index(int id = 1)
        {
            if (id != 1)
            {
                return RedirectToAction(nameof(Index), new { id = 1 });
            }

            var tasks = TaskRepository.GetAll();
            ViewData["ChapterId"] = id;
            ViewData["ChapterTitle"] = "1. Bölüm: Temel Etkileşimler";
            ViewData["ChapterDescription"] = "Püskül ile dokun, sürükle, parçaları birleştir ve ilk algoritmik ritimlerini oluştur!";

            return View(tasks);
        }
    }
}
