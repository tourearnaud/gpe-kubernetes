using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Controllers;
using quest_web.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;

namespace quest_web.Tests.Controllers
{
    public class ArticlesControllerTests
    {
        private readonly DbContextOptions<APIDbContext> _dbContextOptions;

        public ArticlesControllerTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase_Articles")
                .Options;
        }

        [Fact]
        public void Get_ShouldReturnAllArticles()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.Articles.Add(new Articles { titre = "Article 1", contenue = "Content 1" });
            context.Articles.Add(new Articles { titre = "Article 2", contenue = "Content 2" });
            context.SaveChanges();

            var controller = new ArticlesController(context);

            // Act
            var result = controller.Get();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("Article 1", result[0].titre);
            Assert.Equal("Article 2", result[1].titre);
        }

        [Fact]
        public async Task RegisterUser_ShouldAddNewArticle_WhenAuthorized()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "user1" });
            context.SaveChanges();

            var controller = new ArticlesController(context);

            var article = new Articles { titre = "New Article", contenue = "New Content", adresses = "Test Address" };

            // Mock JWT authentication
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "user1"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act
            var result = await controller.RegisterUser(article);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var addedArticle = Assert.IsType<Articles>(okResult.Value);
            Assert.Equal("New Article", addedArticle.titre);
            Assert.Equal(1, context.Articles.Count());
        }

        [Fact]
        public async Task UpdateUser_ShouldUpdateArticle_WhenUserIsAdminOrOwner()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.Articles.Add(new Articles { Id = 1, titre = "Old Title", contenue = "Old Content", UserId = 1 });
            context.SaveChanges();

            var controller = new ArticlesController(context);

            // Mock JWT authentication with admin role
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            var updatedArticle = new Articles { contenue = "Updated Content" };

            // Act
            var result = await controller.UpdateUser(updatedArticle, 1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var article = Assert.IsType<Articles>(okResult.Value);
            Assert.Equal("Updated Content", article.contenue);
        }

        [Fact]
        public async Task DeleteUser_ShouldDeleteArticle_WhenUserIsAdminOrOwner()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.Articles.Add(new Articles { Id = 1, titre = "Test Article", contenue = "Content" });
            context.SaveChanges();

            var controller = new ArticlesController(context);

            // Mock JWT authentication with admin role
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act
            var result = await controller.DeleteUser(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deletedArticle = Assert.IsType<Articles>(okResult.Value);
            Assert.Equal(1, deletedArticle.Id);
            Assert.Empty(context.Articles);
        }

        [Fact]
        public async Task GetById_ShouldReturnArticleById()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.Articles.Add(new Articles { Id = 1, titre = "Test Article", contenue = "Content" });
            context.SaveChanges();

            var controller = new ArticlesController(context);

            // Act
            var result = await controller.GetById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var article = Assert.IsType<List<Articles>>(okResult.Value).FirstOrDefault();
            Assert.NotNull(article);
            Assert.Equal("Test Article", article.titre);
        }
    }
}
