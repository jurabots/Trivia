using DataAccessLayer.Repositories;
using Entities.EntityModel;

namespace TriviaGame.Services.Impl
{
    public class CategoryService : ICategoryService
    {
        #region Dependencies

        ICategoryRepository _categoryRepository;

        #endregion

        #region ctor
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        #endregion

        #region Public method

        public async Task<IList<Category>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.GetCategoriesAsync();
        }

        #endregion
    }
}
