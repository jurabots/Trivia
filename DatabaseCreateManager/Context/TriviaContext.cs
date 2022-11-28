using DatabaseCreateManager.Consts;
using Entities.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace DatabaseCreateManager.Context
{
    public class TriviaContext : DbContext
    {
        #region Properties
        public DbSet<Player> Players { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<GameplayRoom> GameplayRooms { get; set; }
        public DbSet<Question> Questions { get; set; }
        #endregion

        //public TriviaContext(DbContextOptions<TriviaContext> options)
        //    : base(options)
        //{
        //}

        #region Methods
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        { 
            optionsBuilder.UseSqlServer(ConnectionString.connectionString);
        }
        #endregion
    }
}
