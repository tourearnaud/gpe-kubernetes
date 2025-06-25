using Xunit;
using quest_web.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace quest_web.Tests.Models
{
    public class CommentaireTests
    {
        [Fact]
        public void Commentaire_Should_SetAndGetPropertiesCorrectly()
        {
            // Arrange & Act
            var commentaire = new Commentaire
            {
                Id = 1,
                contenue = "Ceci est un commentaire.",
                numner_like = 5,
                ArticlesId = 10,
                UserId = 100,
                Username = "TestUser",
                Timestamp = DateTime.UtcNow
            };

            // Assert
            Assert.Equal(1, commentaire.Id);
            Assert.Equal("Ceci est un commentaire.", commentaire.contenue);
            Assert.Equal(5, commentaire.numner_like);
            Assert.Equal(10, commentaire.ArticlesId);
            Assert.Equal(100, commentaire.UserId);
            Assert.Equal("TestUser", commentaire.Username);
            Assert.Equal(DateTime.UtcNow.Date, commentaire.Timestamp.Date); // Vérifie uniquement la date
        }

        [Fact]
        public void Commentaire_Contenue_ShouldNotExceedMaxLength()
        {
            // Arrange
            var commentaire = new Commentaire { contenue = new string('a', 256) }; // 256 caractères

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(commentaire);
            Validator.TryValidateObject(commentaire, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("contenue") && v.ErrorMessage.Contains("cannot exceed 255 characters"));
        }

        [Fact]
        public void Commentaire_NumnerLike_ShouldDefaultToZero()
        {
            // Arrange & Act
            var commentaire = new Commentaire();

            // Assert
            Assert.Equal(0, commentaire.numner_like);
        }

        [Fact]
        public void Commentaire_Username_ShouldNotBeNullOrEmpty()
        {
            // Arrange
            var commentaire = new Commentaire { Username = null }; // Username manquant

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(commentaire);
            Validator.TryValidateObject(commentaire, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("Username") && v.ErrorMessage.Contains("required"));
        }

        [Fact]
        public void Commentaire_Timestamp_ShouldBeSetCorrectly()
        {
            // Arrange
            var timestamp = DateTime.UtcNow;
            var commentaire = new Commentaire
            {
                Timestamp = timestamp
            };

            // Act & Assert
            Assert.Equal(timestamp, commentaire.Timestamp);
        }
    }
}
