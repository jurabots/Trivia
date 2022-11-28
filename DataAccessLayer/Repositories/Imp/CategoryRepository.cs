using DatabaseCreateManager.Context;
using Entities.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repositories.Imp
{
    public class CategoryRepository : ICategoryRepository
    {
        #region Public methods
        public async Task<IList<Category>> GetCategoriesAsync()
        {
            using(TriviaContext db = new TriviaContext())
            {
                return await db.Categories.ToListAsync();
            }
        }
        #endregion
    }
}
