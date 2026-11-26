using Microsoft.AspNetCore.Mvc;

namespace project_a.Controllers
{
    public class WorkshopController : Controller
    {
        [Route("Atolye")]
        [Route("Atolye/Index")]
        [Route("Workshop")]
        [Route("Workshop/Index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
