using Xunit;
using quest_web.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace quest_web.Tests.Models
{
    public class CategoriesTests
    {
        [Fact]
        public void Categories_Should_SetAndGetPropertiesCorrectly()
        {
            // Arrange & Act
            var category = new Categories
            {
                Id = 1,
                contenue = "Test Category"
            };

            // Assert
            Assert.Equal(1, category.Id);
            Assert.Equal("Test Category", category.contenue);
        }

        [Fact]
        public void Categories_Should_ValidateStringLengthAttributes()
        {
            // Arrange
            var category = new Categories
            {
                contenue = new string('a', 31) // `contenue` exceeds max length of 30
            };

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(category, null, null);
            Validator.TryValidateObject(category, context, validationResults, true);

            // Assert
            Assert.True(validationResults.Any(v => v.MemberNames.Contains("contenue")));
        }
    }
}
