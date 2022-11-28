using DatabaseCreateManager.Context;
using Entities.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repositories.Imp
{
    public class QuestionRepository : IQuestionRepository
    {
        #region Public methods
        public async Task<Question> GetRandomQuestionByCategoery(int categoryId)
        {
            using(TriviaContext db = new TriviaContext())
            {
                var allCategory = db.Categories.Include(x => x.Questions).ThenInclude(x => x.Answers).ToList();
                var concreteCategory = allCategory.Find(c => c.Id == categoryId);
                return concreteCategory.Questions.Skip(new Random().Next(concreteCategory.Questions.Count)).FirstOrDefault();

            }
        }
        #endregion
    }
}
