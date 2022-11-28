using DatabaseCreateManager.Context;
using DatabaseCreateManager.DBinitialization;

namespace DatabaseCreateManager
{
    internal class Program
    {
        static void Main(string[] args)
        {
            using(var context = new TriviaContext())
            {
                var created = DbInitializer.InitializeDb(context);
                Console.WriteLine(created ? "Database Created" : "Already Exists");
            }
        }
    }
}