using DataAccessLayer.Repositories;
using Entities.EntityModel;

namespace TriviaGame.Services.Impl
{
    public class PlayerService : IPlayerService
    {
        #region Dependencies

        IPlayerRepository _playerRepository;

        #endregion

        #region ctor
        public PlayerService(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }
        #endregion

        #region Public method

        public IList<Player> GetPlayersByPeriod(int period)
        {
            return _playerRepository.GetPlayerByPeriod(period);
        }

        #endregion
    }
}
