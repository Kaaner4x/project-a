using Microsoft.AspNetCore.Mvc;
using project_a.Models;

namespace project_a.Controllers
{
    public class TaskController : Controller
    {
        [Route("Gorev")]
        [Route("Gorev/{id:int}")]
        [Route("Gorev/Index/{id:int?}")]
        [Route("Task")]
        [Route("Task/{id:int}")]
        [Route("Task/Index/{id:int?}")]
        public IActionResult Index(int id = 1)
        {
            if (id < 1)
            {
                return RedirectToAction(nameof(Index), new { id = 1 });
            }

            var task = TaskRepository.GetById(id);
            if (task == null)
            {
                return RedirectToAction(nameof(Index), new { id = 1 });
            }

            return View(task);
        }
    }
}
