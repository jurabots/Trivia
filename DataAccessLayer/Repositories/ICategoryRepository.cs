using Entities.EntityModel;

namespace DataAccessLayer.Repositories
{
    public interface ICategoryRepository
    {
        Task<IList<Category>> GetCategoriesAsync();
    }
}
