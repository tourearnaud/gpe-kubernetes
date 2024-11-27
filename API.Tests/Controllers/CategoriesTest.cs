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
    public class CategoriesControllerTests
    {
        private readonly DbContextOptions<APIDbContext> _dbContextOptions;

        public CategoriesControllerTests()
        {
            // Configuration du contexte de la base de données en mémoire pour les tests
            _dbContextOptions = new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
        }

        [Fact]
        public void Get_ShouldReturnAllCategories()
        {
            // Arrange: Initialisation du contexte et ajout de quelques entités Categories en base
            using var context = new APIDbContext(_dbContextOptions);
            context.Categories.Add(new Categories { contenue = "Test Category 1" });
            context.Categories.Add(new Categories { contenue = "Test Category 2" });
            context.SaveChanges();

            var controller = new CategoriesController(context);

            // Act: Appel de la méthode Get pour récupérer toutes les catégories
            var result = controller.Get();

            // Assert: Vérification du nombre de catégories et de leur contenu
            Assert.Equal(2, result.Count);
            Assert.Equal("Test Category 1", result[0].contenue);
            Assert.Equal("Test Category 2", result[1].contenue);
        }

        [Fact]
        public async Task RegisterUser_ShouldAddNewCategory_WhenAuthorized()
        {
            // Arrange: Initialisation du contexte, du contrôleur et création de l'entité Categories
            using var context = new APIDbContext(_dbContextOptions);
            var controller = new CategoriesController(context);
            var category = new Categories { contenue = "New Category" };

            // Mock JWT authentication: Création d'un utilisateur factice avec un JWT simulé
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act: Appel de la méthode RegisterUser pour ajouter une nouvelle catégorie
            var result = await controller.RegisterUser(category);

            // Assert: Vérifie que la réponse est de type OkObjectResult et contient la catégorie ajoutée
            var okResult = Assert.IsType<OkObjectResult>(result);
            var addedCategory = Assert.IsType<Categories>(okResult.Value);
            Assert.Equal("New Category", addedCategory.contenue);
            Assert.Equal(1, context.Categories.Count());
        }

        [Fact]
        public async Task UpdateUser_ShouldUpdateCategory_WhenUserIsAdmin()
        {
            // Arrange: Ajout d'un utilisateur admin et d'une catégorie dans le contexte
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.Categories.Add(new Categories { Id = 1, contenue = "Old Content" });
            context.SaveChanges();

            var controller = new CategoriesController(context);

            // Mock JWT authentication: Création d'un utilisateur admin simulé avec un JWT
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Création de la catégorie mise à jour
            var updatedCategory = new Categories { contenue = "Updated Content" };

            // Act: Appel de la méthode UpdateUser pour mettre à jour la catégorie
            var result = await controller.UpdateUser(updatedCategory, 1);

            // Assert: Vérifie que la réponse est de type OkObjectResult et contient la catégorie mise à jour
            var okResult = Assert.IsType<OkObjectResult>(result);
            var category = Assert.IsType<Categories>(okResult.Value);
            Assert.Equal("Updated Content", category.contenue);
        }

        [Fact]
        public async Task DeleteUser_ShouldDeleteCategory_WhenUserIsAdmin()
        {
            // Arrange: Ajout d'un utilisateur admin et d'une catégorie dans le contexte
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.Categories.Add(new Categories { Id = 1, contenue = "Test Category" });
            context.SaveChanges();

            var controller = new CategoriesController(context);

            // Mock JWT authentication: Création d'un utilisateur admin simulé avec un JWT
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act: Appel de la méthode DeleteUser pour supprimer la catégorie
            var result = await controller.DeleteUser(1);

            // Assert: Vérifie que la réponse est de type OkObjectResult et contient la catégorie supprimée
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deletedCategory = Assert.IsType<Categories>(okResult.Value);
            Assert.Equal(1, deletedCategory.Id);
            Assert.Empty(context.Categories);
        }

        [Fact]
        public async Task GetById_ShouldReturnCategoryById()
        {
            // Arrange: Ajout d'une catégorie dans le contexte
            using var context = new APIDbContext(_dbContextOptions);
            context.Categories.Add(new Categories { Id = 1, contenue = "Test Category" });
            context.SaveChanges();

            var controller = new CategoriesController(context);

            // Act: Appel de la méthode GetById pour récupérer une catégorie par son Id
            var result = await controller.GetById(1);

            // Assert: Vérifie que la réponse est de type OkObjectResult et contient la catégorie demandée
            var okResult = Assert.IsType<OkObjectResult>(result);
            var category = Assert.IsType<List<Categories>>(okResult.Value).FirstOrDefault();
            Assert.NotNull(category);
            Assert.Equal("Test Category", category.contenue);
        }
    }
}
