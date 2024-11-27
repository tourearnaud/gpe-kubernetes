using Xunit;
using quest_web.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace quest_web.Tests.Models
{
    public class MessageTests
    {
        [Fact]
        public void Message_Should_SetAndGetPropertiesCorrectly()
        {
            // Arrange & Act
            var message = new Message
            {
                Id = 1,
                Sender = "User1",
                Recipient = "User2",
                Content = "Hello, how are you?",
                Timestamp = DateTime.Now
            };

            // Assert
            Assert.Equal(1, message.Id);
            Assert.Equal("User1", message.Sender);
            Assert.Equal("User2", message.Recipient);
            Assert.Equal("Hello, how are you?", message.Content);
            Assert.Equal(DateTime.Now.Date, message.Timestamp.Date); // Compare uniquement la date
        }

        [Fact]
        public void Message_Sender_ShouldNotBeNullOrEmpty()
        {
            // Arrange
            var message = new Message
            {
                Sender = null, // Sender manquant
                Recipient = "User2",
                Content = "Hello",
                Timestamp = DateTime.Now
            };

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(message);
            Validator.TryValidateObject(message, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("Sender") && v.ErrorMessage.Contains("required"));
        }

        [Fact]
        public void Message_Recipient_ShouldNotBeNullOrEmpty()
        {
            // Arrange
            var message = new Message
            {
                Sender = "User1",
                Recipient = null, // Recipient manquant
                Content = "Hello",
                Timestamp = DateTime.Now
            };

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(message);
            Validator.TryValidateObject(message, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("Recipient") && v.ErrorMessage.Contains("required"));
        }

        [Fact]
        public void Message_Content_ShouldNotBeNullOrEmpty()
        {
            // Arrange
            var message = new Message
            {
                Sender = "User1",
                Recipient = "User2",
                Content = null, // Content manquant
                Timestamp = DateTime.Now
            };

            // Act
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(message);
            Validator.TryValidateObject(message, context, validationResults, true);

            // Assert
            Assert.Contains(validationResults, v => v.MemberNames.Contains("Content") && v.ErrorMessage.Contains("required"));
        }

        [Fact]
        public void Message_Timestamp_ShouldBeSetCorrectly()
        {
            // Arrange
            var timestamp = DateTime.UtcNow;
            var message = new Message
            {
                Sender = "User1",
                Recipient = "User2",
                Content = "Testing timestamp",
                Timestamp = timestamp
            };

            // Act & Assert
            Assert.Equal(timestamp, message.Timestamp);
        }
    }
}
