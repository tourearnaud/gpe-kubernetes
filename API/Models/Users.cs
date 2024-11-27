using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace quest_web.Models 
{
    /// <summary>
    /// Enumération des rôles possibles pour les utilisateurs.
    /// </summary>
    public enum UserRole
    { 
        ROLE_ADMIN,
        ROLE_USER
    }

    /// <summary>
    /// Modèle représentant l'entité User dans la base de données.
    /// Contient les informations de profil et les rôles des utilisateurs.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Identifiant unique pour chaque utilisateur.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Nom d'utilisateur, requis et non vide.
        /// </summary>
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Mot de passe de l'utilisateur, requis et non vide.
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Ville de l'utilisateur.
        /// </summary>
        public string city { get; set; } = string.Empty;

        /// <summary>
        /// Email de l'utilisateur.
        /// </summary>
        public string email { get; set; } = string.Empty;

        /// <summary>
        /// Pays de résidence de l'utilisateur.
        /// </summary>
        public string country { get; set; } = string.Empty;

        /// <summary>
        /// Adresse physique de l'utilisateur.
        /// </summary>
        public string address { get; set; } = string.Empty;

        /// <summary>
        /// Code postal associé à l'adresse de l'utilisateur.
        /// </summary>
        public int zipCode { get; set; } 

        /// <summary>
        /// Numéro de téléphone de l'utilisateur.
        /// </summary>
        public string phoneNumber { get; set; } = string.Empty;

        /// <summary>
        /// Rôle de l'utilisateur (administrateur ou utilisateur standard).
        /// </summary>
        public UserRole? Role { get; set; }

        /// <summary>
        /// Nom de l'image de profil associée à l'utilisateur.
        /// </summary>
        public string? ImageName { get; set; }

        /// <summary>
        /// Fichier d'image téléchargé associé à l'utilisateur, non mappé en base de données.
        /// </summary>
        [NotMapped]
        public IFormFile? ImageFile { get; set; } 

        /// <summary>
        /// Convertit l'objet en chaîne en retournant le mot de passe.
        /// </summary>
        public override string ToString()
        {
            return Password;
        }

        public string? ResetPasswordToken { get; set; } // Stocke le token de réinitialisation
        public DateTime? ResetPasswordTokenExpiry { get; set; } // Stocke la date d'expiration du token


        /// <summary>
        /// Compare l'objet User courant avec un autre en se basant sur le mot de passe.
        /// </summary>
        public override bool Equals(object? obj)
        {
            if (obj is User u) {
                return u.Password == Password;
            }
            return false;
        }

        /// <summary>
        /// Calcule le code de hachage de l'objet User basé sur le mot de passe.
        /// </summary>
        public override int GetHashCode()
            => Password != null ? Password.GetHashCode() : 0;
            
    }
}
