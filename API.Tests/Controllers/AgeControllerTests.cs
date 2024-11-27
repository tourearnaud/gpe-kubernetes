using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
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
    public class AgeControllerTests
    {
        private DbContextOptions<APIDbContext> CreateNewContextOptions()
        {
            return new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
        }

        [Fact]
        public async Task Get_ShouldReturnAllAges()
        {
            using var context = new APIDbContext(CreateNewContextOptions());
            context.Age.Add(new Age { contenue = "Test Age 1" });
            context.Age.Add(new Age { contenue = "Test Age 2" });
            context.SaveChanges();

            var controller = new AgeController(context);

            var result = await controller.Get();

            Assert.Equal(2, result.Count);
            Assert.Equal("Test Age 1", result[0].contenue);
            Assert.Equal("Test Age 2", result[1].contenue);
        }


        [Fact]
        public async Task RegisterUser_ShouldAddNewAge_WhenAuthorized()
        {
            using var context = new APIDbContext(CreateNewContextOptions());
            var controller = new AgeController(context);

            var age = new Age { contenue = "New Age" };

            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            var result = await controller.RegisterUser(age);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var addedAge = Assert.IsType<Age>(okResult.Value);
            Assert.Equal("New Age", addedAge.contenue);
            Assert.Equal(1, context.Age.Count());
        }

        [Fact]
public async Task UpdateUser_ShouldUpdateAge_WhenUserIsAdmin()
{
    using var context = new APIDbContext(CreateNewContextOptions());
    context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
    context.Age.Add(new Age { Id = 1, contenue = "Old Content" });
    context.SaveChanges();

    var controller = new AgeController(context);

    var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, "admin"), // Assurez-vous que l'ID correspond au Username dans la base
    }, "mock"));
    controller.ControllerContext = new ControllerContext
    {
        HttpContext = new DefaultHttpContext { User = userClaims }
    };

    var updatedAge = new Age { contenue = "Updated Content" };

   var result = await controller.UpdateUser(updatedAge, 1);

    var objectResult = Assert.IsType<OkObjectResult>(result); // Modification ici
    Assert.Equal(200, objectResult.StatusCode);
    var age = Assert.IsType<Age>(objectResult.Value);
    Assert.Equal("Updated Content", age.contenue);
}

[Fact]
public async Task DeleteUser_ShouldDeleteAge_WhenUserIsAdmin()
{
    using var context = new APIDbContext(CreateNewContextOptions());
    context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
    context.Age.Add(new Age { Id = 1, contenue = "Test Age" });
    context.SaveChanges();

    var controller = new AgeController(context);

    var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, "admin"), // Assurez-vous que l'ID correspond au Username dans la base
    }, "mock"));
    controller.ControllerContext = new ControllerContext
    {
        HttpContext = new DefaultHttpContext { User = userClaims }
    };

    var result = await controller.DeleteUser(1);

    var objectResult = Assert.IsType<OkObjectResult>(result); // Modification ici
    Assert.Equal(200, objectResult.StatusCode);
    var deletedAge = Assert.IsType<Age>(objectResult.Value);
    Assert.Equal(1, deletedAge.Id);
    Assert.Empty(context.Age);
}

        
        [Fact]
        public async Task GetById_ShouldReturnAgeById()
        {
            using var context = new APIDbContext(CreateNewContextOptions());
            context.Age.Add(new Age { Id = 1, contenue = "Test Age" });
            context.SaveChanges();

            var controller = new AgeController(context);

            var result = await controller.GetById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var age = Assert.IsAssignableFrom<Age>(okResult.Value);
            Assert.NotNull(age);
            Assert.Equal("Test Age", age.contenue);
        }
    }
}
