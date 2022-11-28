using Entities.EntityModel;

namespace DataAccessLayer.Repositories
{
    public interface IPlayerRepository
    {
        IList<Player> GetPlayerByPeriod(int dayPeriod);
        Player GetPlayerByConnectionId(string? connectionId,string characterColor);
    }
}
