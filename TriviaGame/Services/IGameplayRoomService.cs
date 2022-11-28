using Entities.EntityModel;

namespace TriviaGame.Services
{
    public interface IGameplayRoomService
    {
        GameplayRoom CreateGameplayRoom();
        Task SaveGameplayRoom(GameplayRoom room);
        //Task UpdateGameplayRoom(GameplayRoom room);
        Task DeleteGameplayRoom(int roomId);
    }
}
