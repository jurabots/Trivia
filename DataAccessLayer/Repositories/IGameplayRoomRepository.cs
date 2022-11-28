using Entities.EntityModel;

namespace DataAccessLayer.Repositories
{
    public interface IGameplayRoomRepository
    {
        Task SaveGameplayRoom(GameplayRoom room);
        Task DeleteGameplayRoom(int roomId);
        //Task UpdateGameplayRoom(GameplayRoom room);
    }
}
