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
    /// Contrôleur permettant de gérer les entités Categories.
    /// </summary>
    [Route("categories")]
    [ApiController]
    public class CategoriesController : ControllerBase 
    {
        private APIDbContext context;

        /// <summary>
        /// Constructeur du contrôleur Categories.
        /// Initialise le contexte de base de données pour effectuer des opérations sur l'entité Categories.
        /// </summary>
        /// <param name="context">Le contexte de la base de données injecté via l'injection de dépendances.</param>
        public CategoriesController(APIDbContext context) 
        {
            this.context = context;
        }

        /// <summary>
        /// Récupère la liste de toutes les entités Categories dans la base de données.
        /// </summary>
        /// <returns>Une liste d'objets Categories contenant toutes les entrées trouvées en base.</returns>
        [Route("/categories")]
        [HttpGet]
        public List<Categories> Get()
        {
            // Utilise le contexte pour récupérer toutes les entités Categories et les retourne sous forme de liste.
            var categories = context.Categories.ToList();
            return categories;
        }

        /// <summary>
        /// Crée une nouvelle entité Categories et l'enregistre dans la base de données.
        /// L'accès est limité aux utilisateurs authentifiés avec JWT.
        /// </summary>
        /// <param name="categories">Objet Categories à ajouter, envoyé dans le corps de la requête.</param>
        /// <returns>L'entité créée avec un statut de succès.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("/categories")]
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] Categories categories)
        {
            // Crée une nouvelle entité Categories basée sur les données reçues.
            var entity = new Categories()
            {
                contenue = categories.contenue,
            };                 

            // Ajoute l'entité au contexte et enregistre les changements dans la base de données.
            context.Categories.Add(entity);
            await context.SaveChangesAsync();
            return Ok(entity);
        }

        /// <summary>
        /// Met à jour une entité Categories existante dans la base de données.
        /// L'accès est restreint aux administrateurs via la vérification du rôle de l'utilisateur.
        /// </summary>
        /// <param name="categories">Les nouvelles données de l'entité Categories.</param>
        /// <param name="Id">L'ID de l'entité Categories à mettre à jour.</param>
        /// <returns>Le résultat de l'opération, avec un message d'erreur si l'utilisateur n'a pas les droits ou si l'entité n'existe pas.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("/categories/{Id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] Categories categories, int Id)
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;

            // Récupère l'utilisateur courant et son rôle dans la base de données.
            var current_user = context.User.Where(u => u.Username == currentUserID).ToListAsync();
            var UserId = current_user.Result[0].Id;
            var UserRole = current_user.Result[0].Role;
            
            // Recherche de l'entité Categories à mettre à jour via l'ID fourni.
            var Categories_ = await context.Categories.FindAsync(Id);

            if (UserRole == 0) // Vérifie si l'utilisateur est administrateur.
            {
                if (Categories_ != null) 
                {
                    // Si l'entité existe, met à jour son contenu et enregistre les modifications.
                    Categories_.contenue = categories.contenue;
                    await context.SaveChangesAsync();
                    return Ok(Categories_);
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
        /// Supprime une entité Categories de la base de données, uniquement accessible par les administrateurs.
        /// </summary>
        /// <param name="Id">L'ID de l'entité Categories à supprimer.</param>
        /// <returns>Le résultat de l'opération, avec un message d'erreur si l'utilisateur n'a pas les droits ou si l'entité n'existe pas.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("/categories/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int Id)
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;

            // Récupère l'utilisateur courant et son rôle dans la base de données.
            var current_user = context.User.Where(u => u.Username == currentUserID).ToListAsync();
            var UserId = current_user.Result[0].Id;
            var UserRole = current_user.Result[0].Role;

            // Crée une instance de l'entité Categories avec l'ID spécifié.
            var entitycategories = new Categories()
            {
                Id = Id
            };

            if (UserRole == 0) // Vérifie si l'utilisateur est administrateur.
            {            
                // Attache l'entité au contexte et la supprime de la base de données.
                context.Categories.Attach(entitycategories);
                context.Categories.Remove(entitycategories);
                await context.SaveChangesAsync();

                return Ok(entitycategories);
            }
            else 
            {
                // Si l'utilisateur n'a pas les droits, renvoie un statut 403 avec un message d'erreur.
                return StatusCode(403, "Vous n'avez pas les droits");
            }
        }

        /// <summary>
        /// Récupère une entité Categories spécifique dans la base de données par son ID.
        /// </summary>
        /// <param name="Id">L'ID de l'entité Categories à récupérer.</param>
        /// <returns>L'entité Categories correspondante ou un message d'erreur si non trouvée.</returns>
        [Route("/categories/{Id}")]
        [HttpGet]
        public async Task<IActionResult> GetById(int Id)
        {
            // Récupère l'entité Categories correspondant à l'ID spécifié.
            var categoriesById = context.Categories.Where(u => u.Id == Id);
            return Ok(categoriesById);
        }
    }
}
