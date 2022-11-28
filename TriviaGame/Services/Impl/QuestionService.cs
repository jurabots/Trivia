using DataAccessLayer.Repositories;
using TriviaGame.Response;

namespace TriviaGame.Services.Impl
{
    public class QuestionService : IQuestionService
    {
        #region Dependencies

        IQuestionRepository _questionRepository;

        #endregion

        #region ctor
        public QuestionService(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }
        #endregion

        #region Public methods

        public async Task<RandomQuestionResponse> GetQuestionByCategory(int category)
        {
            var question = await _questionRepository.GetRandomQuestionByCategoery(category);

            //var getCorrectAnswer = question.Answers.First(a => a.isCorrect == true);

            return new RandomQuestionResponse
            {
                Id = question.Id,
                Text = question.Text,
                Answers = question.Answers
            };
        }

        #endregion
    }
}
