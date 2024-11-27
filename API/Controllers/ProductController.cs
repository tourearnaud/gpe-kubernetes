using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using quest_web.Models;
using quest_web.Models.DTO;
using quest_web.Repository.Abastract;

namespace quest_web.Controllers
{
    /// <summary>
    /// Contrôleur permettant de gérer les produits et leurs images.
    /// </summary>
    [Route("api/[controller]/{action}")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IFileService _fileService;      // Service pour gérer les fichiers (images).
        private readonly IProductRepository _productRepo; // Repository pour gérer les opérations liées aux produits.

        /// <summary>
        /// Constructeur du contrôleur Product.
        /// Initialise les services de fichiers et de gestion des produits.
        /// </summary>
        /// <param name="fs">Service de gestion des fichiers injecté.</param>
        /// <param name="productRepo">Repository de gestion des produits injecté.</param>
        public ProductController(IFileService fs, IProductRepository productRepo)
        {
            this._fileService = fs;
            this._productRepo = productRepo;
        }

        /// <summary>
        /// Ajoute un produit avec une image à la base de données.
        /// </summary>
        /// <param name="model">Objet Articles contenant les informations du produit à ajouter, y compris le fichier d'image.</param>
        /// <returns>Le statut de l'ajout, avec un message de succès ou d'erreur.</returns>
        [HttpPost]
        public IActionResult Add([FromForm]Articles model)
        {
            var status = new Status(); // Crée un objet Status pour retourner le résultat.

            // Vérifie si les données du modèle sont valides.
            if (!ModelState.IsValid)
            {
                status.StatusCode = 0;
                status.Message = "Please pass the valid data";
                return Ok(status);
            }
            
            // Vérifie si un fichier d'image est fourni.
            if (model.ImageFile != null)
            {
                // Enregistre l'image en utilisant le service de fichiers et récupère le résultat.
                var fileResult = _fileService.SaveImage(model.ImageFile);
                if (fileResult.Item1 == 1) // Vérifie si l'enregistrement a réussi.
                {
                    model.ImageName = fileResult.Item2; // Affecte le nom de l'image sauvegardée au modèle.
                }

                // Ajoute le produit dans la base de données via le repository de produits.
                var productResult = _productRepo.Add(model);
                if (productResult)
                {
                    status.StatusCode = 1;
                    status.Message = "Added successfully";
                }
                else
                {
                    status.StatusCode = 0;
                    status.Message = "Error on adding product";
                }
            }
            return Ok(status); // Retourne le statut avec le message approprié.
        }
    }
}
