using DatabaseCreateManager.Context;
using Entities.EntityModel;

namespace DataAccessLayer.Repositories.Imp
{
    public class GameplayRoomRepository : IGameplayRoomRepository
    {
        #region Public method

        public async Task DeleteGameplayRoom(int roomId)
        {
            using (TriviaContext db = new TriviaContext())
            {
                var room = db.GameplayRooms.Find(roomId);

                if (room == null)
                    return; //throw ex

                var players = db.Players.Where(x => x.GameplayRoomId == room.Id);
                db.Players.RemoveRange(players);
                db.GameplayRooms.Remove(room);
                await db.SaveChangesAsync();

            }
        }

        public async Task SaveGameplayRoom(GameplayRoom room)
        {
            using (TriviaContext db = new TriviaContext())
            {
                await db.GameplayRooms.AddAsync(room);
                await db.SaveChangesAsync();
            }
        }

        //public async Task UpdateGameplayRoom(GameplayRoom room)
        //{
        //}

        #endregion
    }
}
