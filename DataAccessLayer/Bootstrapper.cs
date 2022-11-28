using DataAccessLayer.Repositories;
using DataAccessLayer.Repositories.Imp;
using DataAccessLayer.Settings;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccessLayer
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddDataAccessLayer(this IServiceCollection services, string connectionString)
        {
            services.AddSingleton(_ => new DatabaseSettings { ConnectionString = connectionString });

            services.AddTransient<IAnswerRepository, AnswerRepository>();
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IGameplayRoomRepository, GameplayRoomRepository>();
            services.AddTransient<IPlayerRepository, PlayerRepository>();
            services.AddTransient<IQuestionRepository, QuestionRepository>();


            return services;
        }
    }
}

