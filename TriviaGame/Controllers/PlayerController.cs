using Entities.EntityModel;
using Microsoft.AspNetCore.Mvc;
using TriviaGame.Services;

namespace TriviaGame.Controllers
{
    [Route("api/")]
    public class PlayerController : Controller
    {

        #region Dependencies

        IPlayerService _playerService;

        #endregion

        #region ctor
        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }
        #endregion

        [HttpGet("Players/leaderboard/{daysPeriod:int}")]
        public IList<Player> GetPlayersByPeriod(int daysPeriod)
        {
            return _playerService.GetPlayersByPeriod(daysPeriod);
        }
    }
}
