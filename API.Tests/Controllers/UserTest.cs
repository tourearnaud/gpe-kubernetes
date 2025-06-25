using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Controllers;
using quest_web.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace quest_web.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly DbContextOptions<APIDbContext> _dbContextOptions;

        public UserControllerTests()
        {
            // Configure une base de données en mémoire pour les tests
            _dbContextOptions = new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
        }

       
        [Fact]
        public async Task DeleteUser_ShouldDeleteUser_WhenUserIsAdminOrOwner()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            // Ajouter un utilisateur admin et un utilisateur normal pour le test
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.User.Add(new User { Id = 2, Username = "user", Role = UserRole.ROLE_USER });
            await context.SaveChangesAsync();

            var controller = new UserController(context);

            // Simuler une identité de connexion pour un utilisateur admin
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act : Supprimer l'utilisateur
            var result = await controller.DeleteUser(2);

            // Assert : Vérifier que le résultat est de type OkObjectResult
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deletedUser = Assert.IsType<User>(okResult.Value);
            Assert.Equal(2, deletedUser.Id);

            // Vérifier que l'utilisateur a été supprimé
            Assert.Null(await context.User.FindAsync(2));
        }

        [Fact]
        public async Task GetById_ShouldReturnUserById()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "testUser" });
            await context.SaveChangesAsync();

            var controller = new UserController(context);

            // Act : Récupérer l'utilisateur par ID
            var result = await controller.GetById(1);

            // Assert : Vérifier que le résultat est de type OkObjectResult
            var okResult = Assert.IsType<OkObjectResult>(result);
            var user = Assert.IsType<List<User>>(okResult.Value).FirstOrDefault();
            Assert.NotNull(user);
            Assert.Equal("testUser", user.Username);
        }

        [Fact]
        public void Get_ShouldReturnAllUsers()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "user1" });
            context.User.Add(new User { Id = 2, Username = "user2" });
            context.SaveChanges();

            var controller = new UserController(context);

            // Act : Récupérer tous les utilisateurs
            var result = controller.Get();

            // Assert : Vérifier que deux utilisateurs ont été retournés
            Assert.Equal(2, result.Count);
            Assert.Equal("user1", result[0].Username);
            Assert.Equal("user2", result[1].Username);
        }
    }
}
