using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq; // Nécessaire pour Contains dans IEnumerable
using quest_web.Models;
using Xunit;

namespace quest_web.Tests.Models
{
    public class AgeTests
    {
        [Fact]
        public void AgeModel_CanBeInstantiated()
        {
            // Arrange & Act
            var age = new Age();

            // Assert
            Assert.NotNull(age);
            Assert.Equal(0, age.Id); // Vérifie que l'Id est initialisé à 0
            Assert.Equal(string.Empty, age.contenue); // Vérifie que `contenue` est une chaîne vide par défaut
        }

        [Fact]
        public void AgeModel_Contenue_HasMaxLengthOf30()
        {
            // Arrange : crée une instance avec une valeur de "contenue" dépassant la limite de 30 caractères.
            var age = new Age { contenue = new string('a', 31) }; // Dépassement de la limite

            // Act : Valide l'objet et capture les résultats
            var validationContext = new ValidationContext(age);
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(age, validationContext, validationResults, validateAllProperties: true);

            // Assert : Vérifie qu'une erreur de validation est présente pour la propriété "contenue"
            Assert.False(isValid);
            Assert.Contains(validationResults, v => v.MemberNames.Contains("contenue") && v.ErrorMessage.Contains("maximum length of 30"));
        }
    }
}
