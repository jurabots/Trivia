using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entites.EntitiModel
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }
        public DateTime LastGameDate { get; set; }
        public bool IsGameOrganizer { get; set; }
        public Guid ConnectionID { get; set; }
        public string CharacterColor { get; set; }
    }
}
