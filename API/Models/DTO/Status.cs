namespace quest_web.Models.DTO
{
    /// <summary>
    /// Modèle représentant un statut.
    /// </summary>
    public class Status
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
    }

    /// <summary>
    /// Modèle représentant la requête d'authentification.
    /// </summary>
    public class LoginRequest
    {
        /// <summary>
        /// Nom d'utilisateur pour l'authentification.
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Mot de passe pour l'authentification.
        /// </summary>
        public string Password { get; set; } = string.Empty;
    }

     public class UserRequest
    {
        /// <summary>
        /// Nom d'utilisateur pour identifier l'utilisateur effectuant la requête.
        /// </summary>
        public string Username { get; set; } = string.Empty;
    }
}
