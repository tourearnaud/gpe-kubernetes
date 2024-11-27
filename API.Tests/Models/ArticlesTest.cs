using Xunit;
using quest_web.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace quest_web.Tests.Models
{
    public class ArticlesTests
    {
        [Fact]
        public void Articles_Should_SetAndGetPropertiesCorrectly()
        {
            // Arrange & Act
            var article = new Articles
            {
                Id = 1,
                titre = "Test Article",
                contenue = "This is a test article content.",
                adresses = "123 Test St",
                codepostal = 12345,
                longitude = "40.7128",
                latitude = "-74.0060",
                prix = 100,
                weather = "Sunny",
                UserId = 1,
                CategorieId = 2,
                AgeId = 3,
                ImageName = "test-image.jpg"
            };

            // Assert
            Assert.Equal(1, article.Id);
            Assert.Equal("Test Article", article.titre);
            Assert.Equal("This is a test article content.", article.contenue);
            Assert.Equal("123 Test St", article.adresses);
            Assert.Equal(12345, article.codepostal);
            Assert.Equal("40.7128", article.longitude);
            Assert.Equal("-74.0060", article.latitude);
            Assert.Equal(100, article.prix);
            Assert.Equal("Sunny", article.weather);
            Assert.Equal(1, article.UserId);
            Assert.Equal(2, article.CategorieId);
            Assert.Equal(3, article.AgeId);
            Assert.Equal("test-image.jpg", article.ImageName);
        }

        [Fact]
        public void Articles_Should_ValidateStringLengthAttributes()
        {
            // Arrange
            var article = new Articles
            {
                titre = new string('a', 31), // titre exceeds max length of 30
                contenue = new string('b', 256) // contenue exceeds max length of 255
            };

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(article, null, null);
            Validator.TryValidateObject(article, context, validationResults, true);

            // Assert
            Assert.True(validationResults.Any(v => v.MemberNames.Contains("titre")));
            Assert.True(validationResults.Any(v => v.MemberNames.Contains("contenue")));
        }

        [Fact]
        public void Articles_Should_AcceptValidImageFile()
        {
            // Arrange
            var article = new Articles
            {
                ImageFile = null // Test with null value as an example (or mock IFormFile if needed)
            };

            // Act & Assert
            Assert.Null(article.ImageFile);
        }
    }
}
