using Xunit;
using quest_web.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace quest_web.Tests.Models
{
    public class UserTests
    {
        [Fact]
        public void User_Should_SetAndGetPropertiesCorrectly()
        {
            // Arrange & Act
            var user = new User
            {
                Id = 1,
                Username = "testuser",
                Password = "password123",
                city = "Paris",
                email = "testuser@example.com",
                country = "France",
                address = "123 Rue Example",
                zipCode = 75000,
                phoneNumber = "0123456789",
                Role = UserRole.ROLE_USER,
                ImageName = "profile.jpg",
                ImageFile = new FormFile(null, 0, 0, "ImageFile", "profile.jpg")
            };

            // Assert
            Assert.Equal(1, user.Id);
            Assert.Equal("testuser", user.Username);
            Assert.Equal("password123", user.Password);
            Assert.Equal("Paris", user.city);
            Assert.Equal("testuser@example.com", user.email);
            Assert.Equal("France", user.country);
            Assert.Equal("123 Rue Example", user.address);
            Assert.Equal(75000, user.zipCode);
            Assert.Equal("0123456789", user.phoneNumber);
            Assert.Equal(UserRole.ROLE_USER, user.Role);
            Assert.Equal("profile.jpg", user.ImageName);
            Assert.NotNull(user.ImageFile);
        }

        [Fact]
        public void User_Username_ShouldBeRequired()
        {
            // Arrange
            var user = new User { Username = null }; // Username manquant

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            Validator.TryValidateObject(user, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("Username"));
        }

        [Fact]
        public void User_Password_ShouldBeRequired()
        {
            // Arrange
            var user = new User { Password = null }; // Password manquant

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            Validator.TryValidateObject(user, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("Password"));
        }

        [Fact]
        public void User_Equals_ShouldReturnTrueForEqualPasswords()
        {
            // Arrange
            var user1 = new User { Password = "password123" };
            var user2 = new User { Password = "password123" };

            // Act & Assert
            Assert.True(user1.Equals(user2));
        }

        [Fact]
        public void User_GetHashCode_ShouldReturnSameHashForEqualPasswords()
        {
            // Arrange
            var user1 = new User { Password = "password123" };
            var user2 = new User { Password = "password123" };

            // Act & Assert
            Assert.Equal(user1.GetHashCode(), user2.GetHashCode());
        }

        [Fact]
        public void User_ImageFile_ShouldBeNullable()
        {
            // Arrange
            var user = new User { ImageFile = null };

            // Act & Assert
            Assert.Null(user.ImageFile); // Vérifie que ImageFile peut être null
        }
    }
}
