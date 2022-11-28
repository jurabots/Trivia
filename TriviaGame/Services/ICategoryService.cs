using Entities.EntityModel;

namespace TriviaGame.Services
{
    public interface ICategoryService
    {
        Task<IList<Category>> GetAllCategoriesAsync();
    }
}
