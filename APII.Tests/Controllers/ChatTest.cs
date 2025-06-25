using Microsoft.AspNetCore.Mvc;
using quest_web.Controllers;
using quest_web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace quest_web.Tests.Controllers
{
    public class ChatControllerTests
    {
        private readonly ChatController _controller;

        public ChatControllerTests()
        {
            // Initialisation du contrôleur ChatController pour les tests
            _controller = new ChatController();
        }

        [Fact]
        public async Task SendMessage_ShouldReturnOk_WhenMessageIsValid()
        {
            // Arrange: Création d'un objet Message valide
            var message = new Message
            {
                Sender = "user1",
                Recipient = "user2",
                Content = "Hello, this is a test message."
            };

            // Act: Appel de la méthode SendMessage avec le message valide
            var result = await _controller.SendMessage(message);

            // Assert: Vérifie que la réponse est de type OkObjectResult et que le contenu du message de succès est correct
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Message envoyé avec succès.", okResult.Value);
        }

        [Fact]
        public async Task SendMessage_ShouldReturnBadRequest_WhenMessageIsNull()
        {
            // Arrange: Passe un message nul pour simuler une erreur
            Message message = null;

            // Act: Appel de la méthode SendMessage avec un message nul
            var result = await _controller.SendMessage(message);

            // Assert: Vérifie que la réponse est de type BadRequestObjectResult et que le message d'erreur est correct
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Le message est vide.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetMessages_ShouldReturnMessagesBetweenUsers_WhenSenderAndRecipientAreValid()
        {
            // Arrange: Envoie deux messages entre deux utilisateurs et un message entre un autre utilisateur
            await _controller.SendMessage(new Message { Sender = "user1", Recipient = "user2", Content = "Hello from user1 to user2" });
            await _controller.SendMessage(new Message { Sender = "user2", Recipient = "user1", Content = "Hello from user2 to user1" });
            await _controller.SendMessage(new Message { Sender = "user3", Recipient = "user1", Content = "Hello from user3 to user1" });

            // Act: Récupère les messages entre "user1" et "user2" uniquement
            var result = await _controller.GetMessages("user1", "user2");

            // Assert: Vérifie que la réponse est de type OkObjectResult et que les messages retournés sont corrects
            var okResult = Assert.IsType<OkObjectResult>(result);
            var messages = Assert.IsType<List<Message>>(okResult.Value);

            // Vérifie qu'il y a deux messages entre "user1" et "user2" dans le résultat
            Assert.Equal(2, messages.Count);
            Assert.Equal("Hello from user1 to user2", messages[0].Content);
            Assert.Equal("Hello from user2 to user1", messages[1].Content);
        }

        [Fact]
        public async Task GetMessages_ShouldReturnBadRequest_WhenSenderOrRecipientIsInvalid()
        {
            // Act: Appel de la méthode GetMessages avec des paramètres expéditeur et destinataire vides
            var result = await _controller.GetMessages("", "user2");

            // Assert: Vérifie que la réponse est de type BadRequestObjectResult et que le message d'erreur est correct
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Les paramètres expéditeur et destinataire sont obligatoires.", badRequestResult.Value);
        }
    }
}
