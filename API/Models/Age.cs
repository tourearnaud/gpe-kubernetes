using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace quest_web.Models 
{
    /// <summary>
    /// Modèle représentant l'entité Age dans la base de données.
    /// </summary>
    public class Age
    {
        /// <summary>
        /// Identifiant unique pour chaque entité Age.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Champ texte pour contenir des informations liées à l'âge, avec une longueur maximale de 30 caractères.
        /// </summary>
        [StringLength(30)]   
        public string contenue { get; set; } = string.Empty;
    }
}
