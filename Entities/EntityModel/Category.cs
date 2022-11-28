using System.ComponentModel.DataAnnotations;

namespace Entities.EntityModel
{
    public class Category
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public IList<Question>? Questions { get; set; }

    }
}
