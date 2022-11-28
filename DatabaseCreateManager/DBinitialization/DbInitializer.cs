using DatabaseCreateManager.Context;
using DatabaseCreateManager.DBinitialization.Helpers;
using Entities.EntityModel;
using Entities.Enums;

namespace DatabaseCreateManager.DBinitialization
{
    public static class DbInitializer
    {
        #region Public methods
        public static bool InitializeDb(TriviaContext context)
        {
            int playerAmount = 100;
            int questionsAmount = 500;
            bool created = context.Database.EnsureCreated();

            InitializePlayer(context, playerAmount);
            InitializeCategory(context);
            InitializeQuestions(context, questionsAmount);

            return created;
        }
        #endregion

        #region Private methods
        private static void InitializePlayer(TriviaContext context, int playerAmount)
        {
            if (context.Players.Count() < 0)
            {
                return;
            }

            for (int i = 0; i < playerAmount; i++)
            {
                context.Players.Add(new Player
                {
                    Name = Randomizer.RandomNamePlayer(),
                    Score = Randomizer.RandomScore(),
                    LastGameDate = Randomizer.RandomDate(),
                    IsGameOrganizer = Randomizer.RandomIsGameOrganizer(),
                    ConnectionID = new string('2',10),
                    CharacterColor = Randomizer.RandomColor()
                });
            };

            context.SaveChanges();
        }
        private static void InitializeCategory(TriviaContext context)
        {
            var listCategory = Enum.GetValues(typeof(CategoryEnum)).Cast<CategoryEnum>().ToList();

            foreach (var category in listCategory)
            {
                context.Add(new Category
                {
                    Name = category.ToString(),
                });
            }

            context.SaveChanges();
        }
        private static IList<Answer> GenerateAnswer()
        {
            List<Answer> answers = new List<Answer>();
            int answerAmount = 4;
            var randomCorrectAnwerValue = Randomizer.RandowAnswer();

            for (int j = 0; j < answerAmount; j++)
            {
                if (j == randomCorrectAnwerValue)
                {
                    answers.Add(new Answer
                    {
                        Text = $"Answer {j + 1}",
                        isCorrect = true
                    });
                }
                else
                {
                    answers.Add(new Answer
                    {
                        Text = $"Answer {j + 1}",
                        isCorrect = false
                    });
                }
            }

            return answers;
        }
        
        //need refactoring
        private static void InitializeQuestions(TriviaContext context,int questionAmount)
        {
            IList<Question> questions = new List<Question>();
            int couuntQuestionCategory = 1;

            for (int i = 0; i < questionAmount; i++)
            {
                if (i < 50)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Programming}",
                        CategoryId = 1,
                        Answers = GenerateAnswer()
                    });

                    if (i == 49)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 50 && i < 100)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Sport}",
                        CategoryId = 2,
                        Answers = GenerateAnswer()

                    });

                    if (i == 99)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 100 && i < 150)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Art}",
                        CategoryId = 3,
                        Answers = GenerateAnswer()
                    });

                    if (i == 149)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 150 && i < 200)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Music}",
                        CategoryId = 4,
                        Answers = GenerateAnswer()
                    });

                    if (i == 199)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 200 && i < 250)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Games}",
                        CategoryId = 5,
                        Answers = GenerateAnswer()
                    });

                    if (i == 249)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 250 && i < 300)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Book}",
                        CategoryId = 6,
                        Answers = GenerateAnswer()
                    });

                    if (i == 299)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 300 && i < 350)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Movie}",
                        CategoryId = 7,
                        Answers = GenerateAnswer()
                    });

                    if (i == 349)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 350 && i < 400)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.History}",
                        CategoryId = 8,
                        Answers = GenerateAnswer()
                    });

                    if (i == 399)
                        couuntQuestionCategory = 1;
                }
                else if (i >= 400 && i < 450)
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Animal}",
                        CategoryId = 9,
                        Answers = GenerateAnswer()
                    });

                    if (i == 449)
                        couuntQuestionCategory = 1;
                }
                else
                {
                    questions.Add(new Question
                    {
                        Text = $"This is question {couuntQuestionCategory++} for category {CategoryEnum.Science}",
                        CategoryId = 10,
                        Answers = GenerateAnswer()
                    });

                    if (i == 499)
                        couuntQuestionCategory = 1;
                }
            }

            context.AddRange(questions);
            context.SaveChanges();
        }
        #endregion
    }
}
