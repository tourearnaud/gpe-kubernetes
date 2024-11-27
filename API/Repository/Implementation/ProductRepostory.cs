using quest_web.Models;
using quest_web.Repository.Abastract;

namespace quest_web.Repository.Implementation
{
    public class ProductRepostory : IProductRepository
    {
		private readonly APIDbContext context;
		public ProductRepostory(APIDbContext context)
		{
			this.context = context;
		}
        public bool Add(Articles model)
        {
			try
			{
				context.Articles.Add(model);
				context.SaveChanges();
				return true;
			}
			catch (Exception ex)
			{

				return false;
			}
        }
    }
}
