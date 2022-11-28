using DatabaseCreateManager.Context;
using Entities.EntityModel;

namespace DataAccessLayer.Repositories.Imp
{
    public class PlayerRepository : IPlayerRepository
    {
        #region Public methods

        public IList<Player> GetPlayerByPeriod(int dayPeriod)
        {
            using(TriviaContext db = new TriviaContext())
            {
                var starySeratchDay = DateTime.UtcNow - TimeSpan.FromDays(dayPeriod);
                var players = db.Players.Where(d => d.LastGameDate > starySeratchDay);

                return players.OrderByDescending(x=> x.LastGameDate).ToList();
            }
        }

        public Player GetPlayerByConnectionId(string? connectionId,string characterColor)
        {
            using(TriviaContext db = new TriviaContext())
            {
                var player = db.Players.Where(p => p.ConnectionID == connectionId).FirstOrDefault();

                if (player == null)
                    return new Player
                    {
                        ConnectionID = connectionId,
                        CharacterColor = characterColor,
                        Name = "Hero" + new string('z',new Random().Next(3)) + new string('x', new Random().Next(3)) + new string('c', new Random().Next(3))
                    };
                else
                    return player;
            }
        }
        #endregion
    }
}
