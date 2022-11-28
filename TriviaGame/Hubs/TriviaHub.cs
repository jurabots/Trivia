using DataAccessLayer.Repositories;
using Entities.EntityModel;
using Microsoft.AspNetCore.SignalR;
using TriviaGame.Services;

namespace TriviaGame.Hubs
{
    public class TriviaHub : Hub
    {
        #region Dependencies

        IPlayerRepository _playerRepository;
        IGameplayRoomService _gameplayRoomService;
        static GameplayRoom gamePlayRoom = new GameplayRoom();

        #endregion

        #region ctor
        public TriviaHub(IPlayerRepository playerRepository, IGameplayRoomService gameplayRoomService)
        {
            _playerRepository = playerRepository;
            _gameplayRoomService = gameplayRoomService;
        }
        #endregion

        #region Public methods

        public async Task Send(string jsonData)
        {
            await Clients.Others.SendAsync("Send",jsonData);
        }

        public async Task Join(string charecterColor)
        {
            var conntectionId = Context.ConnectionId;
            var user = _playerRepository.GetPlayerByConnectionId(conntectionId,charecterColor);

            if (gamePlayRoom.Players.Count == 0)
            {
                gamePlayRoom = _gameplayRoomService.CreateGameplayRoom();
                user.IsGameOrganizer = true;
                gamePlayRoom.MaxPlayers = 2;
                gamePlayRoom.Players.Add(user);

               await _gameplayRoomService.SaveGameplayRoom(gamePlayRoom);
            }
            else
            {
                gamePlayRoom.Players.Add(user);

                //await _gameplayRoomService.UpdateGameplayRoom(gamePlayRoom);

                await Clients.All.SendAsync("OpponentJoined", user.Name, user.CharacterColor, user.IsGameOrganizer);
                await Clients.All.SendAsync("CanPlay");
            }
        }

        
        public async Task Leave()
        {
            if(gamePlayRoom.Players.Count != 0)
            {
                await Clients.All.SendAsync("OpponentLeave");   
                await _gameplayRoomService.DeleteGameplayRoom(gamePlayRoom.Id);
                gamePlayRoom.Players.Clear();
            }
        }

        #endregion
    }
}
