namespace quest_web.Repository.Abastract
{
    public interface IFileService
    {
        public Tuple<int, string> SaveImage(IFormFile ImageFile);

        public bool DeleteImage(string ImageName);        
    }
}