using Entities.EntityModel;
using Microsoft.AspNetCore.Mvc;
using TriviaGame.Services;

namespace TriviaGame.Controllers
{
    [Route("api/")]
    public class CategoryController : Controller
    {
        #region Dependecies

        ICategoryService _categoryService;

        #endregion

        #region ctor
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        #endregion

        [HttpGet("Categories")]
        public async Task<IList<Category>> GetCategoriesAsync()
        {
            return await _categoryService.GetAllCategoriesAsync();
        }
    }
}
