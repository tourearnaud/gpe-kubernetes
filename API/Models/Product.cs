using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quest_web.Models
{
    /// <summary>
    /// Modèle représentant l'entité Product dans la base de données.
    /// Utilisé pour gérer les informations des produits et leurs images associées.
    /// </summary>
    public class Product
    {
        /// <summary>
        /// Identifiant unique pour chaque produit.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Identifiant de l'article associé au produit (relation optionnelle).
        /// </summary>
        public int? ArticlesId { get; set; }

        /// <summary>
        /// Chemin ou nom de fichier de l'image associée au produit.
        /// Ce champ est requis.
        /// </summary>
        [Required]
        public string? ProductImage { get; set; }

        /// <summary>
        /// Fichier d'image téléchargé associé au produit, non mappé en base de données.
        /// </summary>
        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
