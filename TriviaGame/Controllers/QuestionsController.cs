using Microsoft.AspNetCore.Mvc;
using TriviaGame.Response;
using TriviaGame.Services;

namespace TriviaGame.Controllers
{
    [Route("api/")]
    public class QuestionsController : Controller
    {
        #region Dependecies

        IQuestionService _questionService;

        #endregion

        #region ctor
        public QuestionsController(IQuestionService questionService)
        {
            _questionService = questionService;
        }
        #endregion

        [HttpGet("Questions/By_category/{categoryId:int}")]
        public async Task<RandomQuestionResponse> GetQuestionByCategory(int categoryId)
        {
            return await _questionService.GetQuestionByCategory(categoryId);
        }
    }
}
