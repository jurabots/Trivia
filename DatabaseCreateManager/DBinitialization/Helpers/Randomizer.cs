using Entities.Enums;

namespace DatabaseCreateManager.DBinitialization.Helpers
{
    public class Randomizer
    {
        #region Public method
        public static DateTime RandomDate()
        {
            DateTime start = new DateTime(2022, 9, 23);
            int range = (DateTime.Today - start).Days;
            return start.AddDays(new Random().Next(range)).Date;
        }

        public static int RandomScore()
        {
            return new Random().Next(700);
        }

        public static string RandomColor()
        {
            if (new Random().Next(0, 2) % 2 == 0)
                return PlayerColorEnum.Red.ToString();
            else
                return PlayerColorEnum.Green.ToString();
        }

        public static bool RandomIsGameOrganizer()
        {
            if (new Random().Next(0, 2) % 2 == 0)
                return true;
            else
                return false;
        }

        public static string RandomNamePlayer()
        {
            var random = new Random().Next(0, 4);
            switch (random)
            {
                case 0:
                    return PlayerNamesEnum.Arthur.ToString();
                case 1:
                    return PlayerNamesEnum.Alex.ToString();
                case 2:
                    return PlayerNamesEnum.Jhon.ToString();
                case 3:
                    return PlayerNamesEnum.Yuri.ToString();

                default:
                    return PlayerNamesEnum.Arthur.ToString();
            }
        }

        public static int RandowAnswer()
        {
            var random = new Random().Next(0, 4);
            return random;
        }
        #endregion
    }
}
