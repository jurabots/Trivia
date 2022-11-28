using System.ComponentModel.DataAnnotations;

namespace Entities.EntityModel
{
    public class Question
    {
        public int Id { get; set; }
        [Required]
        [StringLength(300)]
        public string Text { get; set; }
        public IList<Answer> Answers { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
