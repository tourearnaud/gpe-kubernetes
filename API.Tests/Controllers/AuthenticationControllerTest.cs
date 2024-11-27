using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Controllers;
using quest_web.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;

namespace quest_web.Tests.Controllers
{
    public class AuthenticationControllerTests
    {
        private readonly DbContextOptions<APIDbContext> _dbContextOptions;

        public AuthenticationControllerTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase_Authentication")
                .Options;
        }

        [Fact]
        public async Task RegisterUser_ShouldReturnConflict_WhenUsernameAlreadyExists()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Username = "existing_user", phoneNumber = "123456789" });
            context.SaveChanges();

            var controller = new AuthenticationController(context);
            var newUser = new User { Username = "existing_user", phoneNumber = "987654321" };

            // Act
            var result = await controller.RegisterUser(newUser);

            // Assert
            var conflictResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(409, conflictResult.StatusCode);
            Assert.Equal("Ce username existe déjà", conflictResult.Value);
        }

        [Fact]
        public async Task RegisterUser_ShouldReturnOk_WhenUserIsRegisteredSuccessfully()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            var controller = new AuthenticationController(context);
            var newUser = new User
            {
                Username = "new_user",
                Password = "password123",
                phoneNumber = "123456789"
            };

            // Act
            var result = await controller.RegisterUser(newUser);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("new_user " + newUser.Role, okResult.Value);
            Assert.Equal(1, context.User.Count(u => u.Username == "new_user"));
        }

        [Fact]
        public async Task AuthenticateUser_ShouldReturnUnauthorized_WhenUsernameIsIncorrect()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Username = "existing_user", Password = "password123" });
            context.SaveChanges();

            var controller = new AuthenticationController(context);
            var loginUser = new User { Username = "wrong_user", Password = "password123" };

            // Act
            var result = await controller.AuthenticateUser(loginUser);

            // Assert
            var unauthorizedResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
            Assert.Equal("Mauvais nom d'utilisateur", unauthorizedResult.Value);
        }

        [Fact]
        public async Task AuthenticateUser_ShouldReturnUnauthorized_WhenPasswordIsIncorrect()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Username = "existing_user", Password = "password123" });
            context.SaveChanges();

            var controller = new AuthenticationController(context);
            var loginUser = new User { Username = "existing_user", Password = "wrong_password" };

            // Act
            var result = await controller.AuthenticateUser(loginUser);

            // Assert
            var unauthorizedResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
            Assert.Equal("Mauvais mot de passe", unauthorizedResult.Value);
        }

        [Fact]
        public async Task AuthenticateUser_ShouldReturnToken_WhenCredentialsAreCorrect()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Username = "valid_user", Password = "password123" });
            context.SaveChanges();

            var controller = new AuthenticationController(context);
            var loginUser = new User { Username = "valid_user", Password = "password123" };

            // Act
            var result = await controller.AuthenticateUser(loginUser);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var tokenResult = Assert.IsType<dynamic>(okResult.Value);
            Assert.NotNull(tokenResult.token);
            Assert.NotNull(tokenResult.expiration);
        }

        [Fact]
        public async Task GetMe_ShouldReturnUserInfo_WhenUserIsAuthenticated()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "authenticated_user" });
            context.SaveChanges();

            var controller = new AuthenticationController(context);

            // Mock JWT authentication
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "authenticated_user"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act
            var result = await controller.GetMe();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var userInfo = Assert.IsType<IQueryable<User>>(okResult.Value);
            Assert.Equal("authenticated_user", userInfo.First().Username);
        }
    }
}
