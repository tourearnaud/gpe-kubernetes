using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Controllers;
using quest_web.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;

namespace quest_web.Tests.Controllers
{
    public class CommentaireControllerTests
    {
        private readonly DbContextOptions<APIDbContext> _dbContextOptions;

        public CommentaireControllerTests()
        {
            // Configuration de la base de données en mémoire pour les tests
            _dbContextOptions = new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
        }

        [Fact]
        public async Task GetByArticleId_ShouldReturnCommentaires_WhenCommentairesExistForArticle()
        {
            // Arrange
            using var context = new APIDbContext(_dbContextOptions);
            context.Commentaire.Add(new Commentaire { ArticlesId = 1, contenue = "Test commentaire", UserId = 1, Timestamp = DateTime.UtcNow });
            context.SaveChanges();

            var controller = new CommentaireController(context);

            // Act
            var result = await controller.GetByArticleId(1);

            // Assert: Vérifie que la réponse est de type OkObjectResult et contient des commentaires
            var okResult = Assert.IsType<OkObjectResult>(result);
            var commentaires = Assert.IsType<object>(okResult.Value);
            Assert.NotNull(commentaires);
        }

        [Fact]
        public async Task RegisterComment_ShouldAddComment_WhenContentIsValid()
        {
            // Arrange: Création d'un utilisateur et d'un commentaire valide
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "user1" });
            context.SaveChanges();

            var controller = new CommentaireController(context);
            var commentaire = new Commentaire { contenue = "Test content", ArticlesId = 1 };

            // Simule l'authentification de l'utilisateur via ClaimsPrincipal
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "user1"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act: Appel de la méthode RegisterComment avec un commentaire valide
            var result = await controller.RegisterComment(commentaire);

            // Assert: Vérifie que la réponse est de type OkObjectResult et que le commentaire est bien ajouté
            var okResult = Assert.IsType<OkObjectResult>(result);
            var addedComment = Assert.IsType<Commentaire>(okResult.Value);
            Assert.Equal("Test content", addedComment.contenue);
            Assert.Equal(1, context.Commentaire.Count());
        }

        [Fact]
        public async Task UpdateComment_ShouldUpdateComment_WhenUserIsAdmin()
        {
            // Arrange: Ajout d'un utilisateur administrateur et d'un commentaire existant
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.Commentaire.Add(new Commentaire { Id = 1, contenue = "Old content" });
            context.SaveChanges();

            var controller = new CommentaireController(context);

            // Simule l'authentification de l'administrateur via ClaimsPrincipal
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            var updatedComment = new Commentaire { contenue = "Updated content" };

            // Act: Appel de la méthode UpdateComment avec un nouveau contenu
            var result = await controller.UpdateComment(1, updatedComment);

            // Assert: Vérifie que la réponse est de type OkObjectResult et que le contenu est mis à jour
            var okResult = Assert.IsType<OkObjectResult>(result);
            var comment = Assert.IsType<Commentaire>(okResult.Value);
            Assert.Equal("Updated content", comment.contenue);
        }

        [Fact]
        public async Task DeleteComment_ShouldDeleteComment_WhenUserIsAdmin()
        {
            // Arrange: Ajout d'un utilisateur administrateur et d'un commentaire
            using var context = new APIDbContext(_dbContextOptions);
            context.User.Add(new User { Id = 1, Username = "admin", Role = UserRole.ROLE_ADMIN });
            context.Commentaire.Add(new Commentaire { Id = 1, contenue = "Test content" });
            context.SaveChanges();

            var controller = new CommentaireController(context);

            // Simule l'authentification de l'administrateur via ClaimsPrincipal
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaims }
            };

            // Act: Appel de la méthode DeleteComment avec l'ID du commentaire
            var result = await controller.DeleteComment(1);

            // Assert: Vérifie que la réponse est de type OkObjectResult et que le commentaire est supprimé
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deletedComment = Assert.IsType<Commentaire>(okResult.Value);
            Assert.Equal(1, deletedComment.Id);
            Assert.Empty(context.Commentaire);
        }

        [Fact]
        public async Task GetCommentCountByArticleId_ShouldReturnCount_WhenCommentsExistForArticle()
        {
            // Arrange: Ajout de deux commentaires pour un même article
            using var context = new APIDbContext(_dbContextOptions);
            context.Commentaire.Add(new Commentaire { ArticlesId = 1, contenue = "Comment 1" });
            context.Commentaire.Add(new Commentaire { ArticlesId = 1, contenue = "Comment 2" });
            context.SaveChanges();

            var controller = new CommentaireController(context);

            // Act: Appel de la méthode GetCommentCountByArticleId pour obtenir le nombre de commentaires
            var result = await controller.GetCommentCountByArticleId(1);

            // Assert: Vérifie que la réponse est de type OkObjectResult et que le nombre de commentaires est correct
            var okResult = Assert.IsType<OkObjectResult>(result);
            var countObject = Assert.IsType<object>(okResult.Value);
            Assert.NotNull(countObject);
        }
    }
}
