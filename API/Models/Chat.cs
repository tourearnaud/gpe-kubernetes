using System;
using System.ComponentModel.DataAnnotations;

namespace quest_web.Models 
{
    /// <summary>
    /// Modèle représentant un message échangé entre utilisateurs.
    /// </summary>
    public class Message
    {
        /// <summary>
        /// Identifiant unique pour chaque message.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Nom de l'utilisateur qui envoie le message.
        /// </summary>
        [Required(ErrorMessage = "Sender is required")]
        public string Sender { get; set; }

        /// <summary>
        /// Nom de l'utilisateur qui reçoit le message.
        /// </summary>
        [Required(ErrorMessage = "Recipient is required")]
        public string Recipient { get; set; }

        /// <summary>
        /// Contenu du message échangé entre les utilisateurs.
        /// </summary>
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; }

        /// <summary>
        /// Date et heure de l'envoi du message.
        /// </summary>
        public DateTime Timestamp { get; set; }

        /// <summary>
        /// Statut du message : vrai si le message a été lu, faux sinon.
        /// </summary>
        public bool IsRead { get; set; } = false;
    }
}
