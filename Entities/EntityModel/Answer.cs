using System.ComponentModel.DataAnnotations;

namespace Entities.EntityModel
{
    public class Answer
    {
        public int Id { get; set; }
        [Required]
        [StringLength(150)]
        public string Text { get; set; }
        public bool isCorrect { get; set; }
    }
}
