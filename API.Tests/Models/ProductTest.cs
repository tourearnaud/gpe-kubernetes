using Xunit;
using quest_web.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace quest_web.Tests.Models
{
    public class ProductTests
    {
        [Fact]
        public void Product_Should_SetAndGetPropertiesCorrectly()
        {
            // Arrange & Act
            var product = new Product
            {
                Id = 1,
                ArticlesId = 10,
                ProductImage = "image.jpg",
                ImageFile = new FormFile(null, 0, 0, "ImageFile", "image.jpg")
            };

            // Assert
            Assert.Equal(1, product.Id);
            Assert.Equal(10, product.ArticlesId);
            Assert.Equal("image.jpg", product.ProductImage);
            Assert.NotNull(product.ImageFile);
        }

        [Fact]
        public void Product_ProductImage_ShouldBeRequired()
        {
            // Arrange
            var product = new Product { ProductImage = null }; // ProductImage manquant

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(product, null, null);
            Validator.TryValidateObject(product, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("ProductImage"));
        }

        [Fact]
        public void Product_ImageFile_ShouldBeNullable()
        {
            // Arrange
            var product = new Product { ImageFile = null };

            // Act & Assert
            Assert.Null(product.ImageFile); // Vérifie que ImageFile peut être null
        }
    }
}
