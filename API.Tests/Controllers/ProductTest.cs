using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using quest_web.Controllers;
using quest_web.Models;
using quest_web.Models.DTO;
using quest_web.Repository.Abastract;
using System.IO;
using Xunit;
using System;

namespace quest_web.Tests.Controllers
{
    public class ProductControllerTests
    {
        private readonly Mock<IFileService> _fileServiceMock;
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly ProductController _controller;

        public ProductControllerTests()
        {
            // Initialisation des mocks pour les services de fichier et de repository
            _fileServiceMock = new Mock<IFileService>();
            _productRepoMock = new Mock<IProductRepository>();
            
            // Initialisation du contrôleur avec les services injectés
            _controller = new ProductController(_fileServiceMock.Object, _productRepoMock.Object);
        }

        [Fact]
        public void Add_ShouldReturnSuccessStatus_WhenProductIsAddedSuccessfully()
        {
            // Arrange
            var model = new Articles
            {
                titre = "Test Product",
                contenue = "This is a test product",
                codepostal = 12345,
                ImageFile = new FormFile(
                    new MemoryStream(new byte[0]), 0, 0, "Data", "test.jpg") // Image fictive
            };

            // Mock du service de fichier pour retourner un succès d'enregistrement
            _fileServiceMock.Setup(fs => fs.SaveImage(It.IsAny<IFormFile>()))
                            .Returns(new Tuple<int, string>(1, "test.jpg"));
            // Mock du repository de produit pour retourner un succès d'ajout
            _productRepoMock.Setup(pr => pr.Add(It.IsAny<Articles>())).Returns(true);

            // Act
            var result = _controller.Add(model);

            // Assert: Vérifie que le résultat est de type OkObjectResult
            var okResult = Assert.IsType<OkObjectResult>(result);
            var status = Assert.IsType<Status>(okResult.Value);
            Assert.Equal(1, status.StatusCode);
            Assert.Equal("Added successfully", status.Message);
        }

        [Fact]
        public void Add_ShouldReturnErrorStatus_WhenProductAdditionFails()
        {
            // Arrange
            var model = new Articles
            {
                titre = "Test Product",
                contenue = "This is a test product",
                codepostal = 12345,
                ImageFile = new FormFile(
                    new MemoryStream(new byte[0]), 0, 0, "Data", "test.jpg") // Image fictive
            };

            // Mock du service de fichier pour retourner un succès d'enregistrement
            _fileServiceMock.Setup(fs => fs.SaveImage(It.IsAny<IFormFile>()))
                            .Returns(new Tuple<int, string>(1, "test.jpg"));
            // Mock du repository de produit pour retourner un échec d'ajout
            _productRepoMock.Setup(pr => pr.Add(It.IsAny<Articles>())).Returns(false);

            // Act
            var result = _controller.Add(model);

            // Assert: Vérifie que le résultat est de type OkObjectResult avec un message d'erreur
            var okResult = Assert.IsType<OkObjectResult>(result);
            var status = Assert.IsType<Status>(okResult.Value);
            Assert.Equal(0, status.StatusCode);
            Assert.Equal("Error on adding product", status.Message);
        }

        [Fact]
        public void Add_ShouldReturnInvalidDataStatus_WhenModelStateIsInvalid()
        {
            // Arrange
            var model = new Articles(); // Modèle sans informations pour provoquer une erreur de validation
            _controller.ModelState.AddModelError("Titre", "Required");

            // Act
            var result = _controller.Add(model);

            // Assert: Vérifie que le statut est "invalid data" si les données ne sont pas valides
            var okResult = Assert.IsType<OkObjectResult>(result);
            var status = Assert.IsType<Status>(okResult.Value);
            Assert.Equal(0, status.StatusCode);
            Assert.Equal("Please pass the valid data", status.Message);
        }

        [Fact]
        public void Add_ShouldReturnErrorStatus_WhenImageFileIsNull()
        {
            // Arrange
            var model = new Articles
            {
                titre = "Test Product",
                contenue = "This is a test product",
                codepostal = 12345,
                ImageFile = null // Pas d'image pour ce test
            };

            // Act
            var result = _controller.Add(model);

            // Assert: Vérifie que le statut est d'erreur si l'image est absente
            var okResult = Assert.IsType<OkObjectResult>(result);
            var status = Assert.IsType<Status>(okResult.Value);
            Assert.Equal(0, status.StatusCode);
            Assert.Equal("Please pass the valid data", status.Message);
        }
    }
}
