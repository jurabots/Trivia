using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.EntityModel
{
    public class Player
    {
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string? Name { get; set; }
        [Required]
        [Range(0,700)]
        public int Score { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime LastGameDate { get; set; }
        public bool IsGameOrganizer { get; set; }
        [Required]
        public string? ConnectionID { get; set; }

        [ForeignKey("FK_GameplayRoomId")]
        public int? GameplayRoomId { get; set; }
        public string? CharacterColor { get; set; }
    }
}
