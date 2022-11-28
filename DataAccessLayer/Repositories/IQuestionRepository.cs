using Entities.EntityModel;

namespace DataAccessLayer.Repositories
{
    public interface IQuestionRepository
    {
        Task<Question> GetRandomQuestionByCategoery(int categoryId);
    }
}
