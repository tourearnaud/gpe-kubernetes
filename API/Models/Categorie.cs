using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace quest_web.Models 
{
    /// <summary>
    /// Modèle représentant l'entité Categories dans la base de données.
    /// </summary>
    public class Categories
    {
        /// <summary>
        /// Identifiant unique pour chaque entité Category.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Champ texte pour contenir la description de la catégorie, avec une longueur maximale de 30 caractères.
        /// </summary>
        [StringLength(30)]   
        public string contenue { get; set; } = string.Empty;
    }
}
