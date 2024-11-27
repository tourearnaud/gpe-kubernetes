using Microsoft.EntityFrameworkCore;

namespace quest_web.Models 
{
    /// <summary>
    /// Contexte de base de données pour l'application API.
    /// Ce contexte permet de gérer les entités et de configurer les options de la base de données.
    /// </summary>
    public class APIDbContext : DbContext
    {
        /// <summary>
        /// Constructeur qui accepte les options de DbContext pour permettre l'utilisation de différentes configurations, 
        /// y compris les tests avec une base de données en mémoire.
        /// </summary>
        /// <param name="options">Options de configuration du contexte.</param>
        public APIDbContext(DbContextOptions<APIDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Table des utilisateurs dans la base de données.
        /// </summary>
        public DbSet<User> User { get; set; }

        /// <summary>
        /// Table des articles dans la base de données.
        /// </summary>
        public DbSet<Articles> Articles { get; set; }

        /// <summary>
        /// Table des catégories dans la base de données.
        /// </summary>
        public DbSet<Categories> Categories { get; set; }

        /// <summary>
        /// Table des âges dans la base de données.
        /// </summary>
        public DbSet<Age> Age { get; set; }

        /// <summary>
        /// Table des commentaires dans la base de données.
        /// </summary>
        public DbSet<Commentaire> Commentaire { get; set; }

         /// <summary>
        /// Table des messages dans la base de données.
        /// </summary>
        public DbSet<Message> Messages { get; set; }


        /// <summary>
        /// Configuration de la connexion à la base de données.
        /// Utilise MySQL avec les informations de connexion spécifiées.
        /// </summary>
        /// <param name="optionsBuilder">Le générateur d'options pour configurer le contexte.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured) // Vérifie si le contexte est déjà configuré (utile pour les tests en mémoire)
            {
                optionsBuilder.UseMySQL("server=127.0.0.1;database=GPE;user=toure;password=root");
                optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking); // Désactive le suivi des modifications pour optimiser les performances.
            }
        }
    }
}
