using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace quest_web.Models 
{
    /// <summary>
    /// Modèle représentant l'entité Articles dans la base de données.
    /// </summary>
    public class Articles
    {
        /// <summary>
        /// Identifiant unique pour chaque entité Article.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Titre de l'article, limité à 30 caractères.
        /// </summary>
        [StringLength(30)]   
        public string titre { get; set; } = string.Empty;

        /// <summary>
        /// Contenu de l'article, limité à 255 caractères.
        /// </summary>
        [StringLength(255)]   
        public string contenue { get; set; } = string.Empty;

        /// <summary>
        /// Adresse liée à l'article.
        /// </summary>
        public string adresses { get; set; } = string.Empty;

        /// <summary>
        /// Code postal associé à l'adresse de l'article.
        /// </summary>
        public int codepostal { get; set; }

        /// <summary>
        /// Coordonnée de longitude pour la localisation de l'article.
        /// </summary>
        public string longitude { get; set; }

        /// <summary>
        /// Coordonnée de latitude pour la localisation de l'article.
        /// </summary>
        public string latitude { get; set; }

        /// <summary>
        /// Prix de l'article.
        /// </summary>
        public int prix { get; set; }

        /// <summary>
        /// Informations météorologiques associées à l'article.
        /// </summary>
        public string weather { get; set; }

        /// <summary>
        /// Identifiant de l'utilisateur associé à l'article (relation optionnelle).
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// Identifiant de la catégorie associée à l'article (relation optionnelle).
        /// </summary>
        public int? CategorieId { get; set; }

        /// <summary>
        /// Identifiant de l'âge associé à l'article (relation optionnelle).
        /// </summary>
        public int? AgeId { get; set; }

        /// <summary>
        /// Nom de l'image associée à l'article.
        /// </summary>
        public string? ImageName { get; set; }
        
        /// <summary>
        /// Fichier d'image téléchargé associé à l'article, non mappé en base de données.
        /// </summary>
        [NotMapped]
        public IFormFile? ImageFile {get;set;} 
    }
}
