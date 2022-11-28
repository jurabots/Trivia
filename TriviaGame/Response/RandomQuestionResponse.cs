using Entities.EntityModel;

namespace TriviaGame.Response
{
    public class RandomQuestionResponse
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public IList<Answer>? Answers { get; set; }
    }
}
