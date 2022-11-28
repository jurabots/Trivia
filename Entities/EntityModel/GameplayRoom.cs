
namespace Entities.EntityModel
{
    public class GameplayRoom
    {
        public int Id { get; set; }
        public int MaxPlayers { get; set; }
        public IList<Player> Players { get; set; }

        public GameplayRoom()
        {
            Players = new List<Player>();
        }
    }
}
