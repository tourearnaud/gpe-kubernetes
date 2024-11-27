using System;
using System.ComponentModel.DataAnnotations;

namespace quest_web.Models 
{
    /// <summary>
    /// Modèle représentant l'entité Commentaire dans la base de données.
    /// </summary>
    public class Commentaire
    {
        /// <summary>
        /// Identifiant unique pour chaque commentaire.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Contenu du commentaire, limité à 255 caractères.
        /// </summary>
        [Required(ErrorMessage = "Contenue is required")]
        [StringLength(255, ErrorMessage = "Contenue cannot exceed 255 characters.")]
        public string contenue { get; set; } = string.Empty;

        /// <summary>
        /// Nombre de "likes" associés au commentaire.
        /// </summary>
        public int numner_like { get; set; } = 0;

        /// <summary>
        /// Identifiant de l'article auquel ce commentaire est associé.
        /// </summary>
        public int? ArticlesId { get; set; }

        /// <summary>
        /// Identifiant de l'utilisateur ayant posté le commentaire (clé étrangère).
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// Nom d'utilisateur associé au commentaire.
        /// </summary>
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Date et heure de création du commentaire.
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
