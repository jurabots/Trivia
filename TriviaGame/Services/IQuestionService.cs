using TriviaGame.Response;

namespace TriviaGame.Services
{
    public interface IQuestionService
    {
        Task<RandomQuestionResponse> GetQuestionByCategory(int category);
    }
}
