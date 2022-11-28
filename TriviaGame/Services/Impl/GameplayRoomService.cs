using DataAccessLayer.Repositories;
using Entities.EntityModel;

namespace TriviaGame.Services.Impl
{
    public class GameplayRoomService : IGameplayRoomService
    {
        #region Dependencies

        IGameplayRoomRepository _gameplayRoomRepository;

        #endregion

        #region ctor
        public GameplayRoomService(IGameplayRoomRepository gameplayRoomRepository)
        {
            _gameplayRoomRepository = gameplayRoomRepository;
        }
        #endregion

        #region Public methods

        public GameplayRoom CreateGameplayRoom()
        {
            return new GameplayRoom();
        }

        public async Task DeleteGameplayRoom(int roomId)
        {
            await _gameplayRoomRepository.DeleteGameplayRoom(roomId);
        }

        public async Task SaveGameplayRoom(GameplayRoom room)
        {
            await _gameplayRoomRepository.SaveGameplayRoom(room);
        }

        //public async Task UpdateGameplayRoom(GameplayRoom room)
        //{
        //    await _gameplayRoomRepository.UpdateGameplayRoom(room);
        //}

        #endregion
    }
}
