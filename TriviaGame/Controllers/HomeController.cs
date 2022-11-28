using Microsoft.AspNetCore.Mvc;

namespace TriviaGame.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
