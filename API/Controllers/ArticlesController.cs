using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Models;
using MySql.Data.MySqlClient;
using System.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace quest_web.Controllers
{
    /// <summary>
    /// Contrôleur permettant de gérer les entités Articles.
    /// </summary>
    [Route("articles")]
    [ApiController]
    public class ArticlesController : ControllerBase 
    {
        private APIDbContext context;

        /// <summary>
        /// Constructeur du contrôleur Articles.
        /// Initialise le contexte de base de données pour effectuer des opérations sur l'entité Articles.
        /// </summary>
        /// <param name="context">Le contexte de la base de données injecté via l'injection de dépendances.</param>
        public ArticlesController(APIDbContext context) 
        {
            this.context = context;
        }

        /// <summary>
        /// Récupère la liste de toutes les entités Articles dans la base de données.
        /// </summary>
        /// <returns>Une liste d'objets Articles contenant toutes les entrées trouvées en base.</returns>
        [Route("/articles")]
        [HttpGet]
        public List<Articles> Get()
        {
            // Utilise le contexte pour récupérer toutes les entités Articles et les retourne sous forme de liste.
            var articles = context.Articles.ToList();
            return articles;
        }

        /// <summary>
        /// Crée une nouvelle entité Articles et l'enregistre dans la base de données.
        /// L'accès est limité aux utilisateurs authentifiés avec JWT.
        /// </summary>
        /// <param name="articles">Objet Articles à ajouter, envoyé dans le corps de la requête.</param>
        /// <returns>L'entité créée avec un statut de succès.</returns>
        /*[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] 
        [Route("/articles")]
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] Articles articles)
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

            // Récupère l'utilisateur courant dans la base de données pour obtenir son identifiant.
            var current_user = context.User.Where(u => u.Username == currentUserID).ToListAsync();
            var UserID = current_user.Result[0].Id;

            // Crée une nouvelle entité Articles basée sur les données reçues et l'identifiant utilisateur.
            var entity = new Articles()
            {
                titre = articles.titre,
                contenue = articles.contenue,
                adresses = articles.adresses,
                codepostal = articles.codepostal,
                longitude = articles.longitude,
                latitude = articles.latitude,
                UserId = UserID
            };                 

            // Ajoute l'entité au contexte et enregistre les changements dans la base de données.
            context.Articles.Add(entity);
            await context.SaveChangesAsync();
            return Ok(entity);
        }*/

        /// <summary>
        /// Met à jour une entité Articles existante dans la base de données.
        /// L'accès est restreint aux administrateurs ou aux utilisateurs propriétaires de l'entité.
        /// </summary>
        /// <param name="articles">Les nouvelles données de l'entité Articles.</param>
        /// <param name="Id">L'ID de l'entité Articles à mettre à jour.</param>
        /// <returns>Le résultat de l'opération, avec un message d'erreur si l'utilisateur n'a pas les droits ou si l'entité n'existe pas.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] 
        [Route("/articles/{Id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] Articles articles, int Id)
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;

            // Récupère l'utilisateur courant et son rôle dans la base de données.
            var current_user = context.User.Where(u => u.Username == currentUserID).ToListAsync();
            var userId = current_user.Result[0].Id;
            var UserRole = current_user.Result[0].Role;
            
            // Recherche de l'entité Articles à mettre à jour via l'ID fourni.
            var Articles_ = await context.Articles.FindAsync(Id);

            // Si l'utilisateur est administrateur ou propriétaire de l'article, autorise la mise à jour.
            if (UserRole == 0 || Id == userId) 
            {
                if (Articles_ != null) 
                {
                    // Met à jour uniquement les champs nécessaires.
                    Articles_.contenue = articles.contenue;
                    context.Update(Articles_);
                    await context.SaveChangesAsync();
                    return Ok(Articles_);
                }
                else 
                {
                    // Si l'entité n'existe pas, renvoie un statut 401 avec un message d'erreur.
                    return StatusCode(401, "Cette Id existe pas");
                }
            }
            else 
            {
                // Si l'utilisateur n'a pas les droits, renvoie un statut 403 avec un message d'erreur.
                return StatusCode(403, "Vous n'avez pas les droits");
            }
        }

        /// <summary>
        /// Supprime une entité Articles de la base de données, accessible aux administrateurs ou propriétaires de l'article.
        /// </summary>
        /// <param name="Id">L'ID de l'entité Articles à supprimer.</param>
        /// <returns>Le résultat de l'opération, avec un message d'erreur si l'utilisateur n'a pas les droits ou si l'entité n'existe pas.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] 
        [Route("/articles/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int Id)
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;

            // Récupère l'utilisateur courant et son rôle dans la base de données.
            var current_user = context.User.Where(u => u.Username == currentUserID).ToListAsync();
            var userId = current_user.Result[0].Id;
            var UserRole = current_user.Result[0].Role;

            // Crée une instance de l'entité Articles avec l'ID spécifié pour la suppression.
            var entityarticles = new Articles()
            {
                Id = Id
            };

            // Si l'utilisateur est administrateur ou propriétaire de l'article, autorise la suppression.
            if (UserRole == 0 || Id == userId) 
            {            
                // Attache l'entité au contexte et la supprime de la base de données.
                context.Articles.Attach(entityarticles);
                context.Articles.Remove(entityarticles);
                await context.SaveChangesAsync();
                return Ok(entityarticles);
            }
            else 
            {
                // Si l'utilisateur n'a pas les droits, renvoie un statut 403 avec un message d'erreur.
                return StatusCode(403, "Vous n'avez pas les droits");
            }
        }

        /// <summary>
        /// Récupère une entité Articles spécifique dans la base de données par son ID.
        /// </summary>
        /// <param name="Id">L'ID de l'entité Articles à récupérer.</param>
        /// <returns>L'entité Articles correspondante ou un message d'erreur si non trouvée.</returns>
        [Route("/articles/{Id}")]
        [HttpGet]
        public async Task<IActionResult> GetById(int Id)
        {
            // Récupère l'entité Articles correspondant à l'ID spécifié.
            var articlesById = context.Articles.Where(u => u.Id == Id);
            return Ok(articlesById);
        }
    }
}
