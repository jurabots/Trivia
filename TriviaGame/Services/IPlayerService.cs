using Entities.EntityModel;

namespace TriviaGame.Services
{
    public interface IPlayerService
    {
        IList<Player> GetPlayersByPeriod(int period);
    }
}
