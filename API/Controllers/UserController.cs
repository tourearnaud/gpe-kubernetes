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
    /// Contrôleur permettant de gérer les utilisateurs.
    /// </summary>
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase 
    {
        private APIDbContext context;

        /// <summary>
        /// Constructeur du contrôleur User.
        /// Initialise le contexte de base de données pour effectuer des opérations sur l'entité User.
        /// </summary>
        /// <param name="context">Le contexte de la base de données injecté via l'injection de dépendances.</param>
        public UserController(APIDbContext context) 
        {
            this.context = context;
        }

        /// <summary>
        /// Met à jour une entité User existante dans la base de données.
        /// L'accès est restreint aux administrateurs ou au propriétaire de l'utilisateur.
        /// </summary>
        /// <param name="user">Les nouvelles données de l'entité User.</param>
        /// <param name="Id">L'ID de l'entité User à mettre à jour.</param>
        /// <returns>Le résultat de l'opération, avec un message d'erreur si l'utilisateur n'a pas les droits ou si l'entité n'existe pas.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("/user/{Id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser(int Id, [FromForm] IFormFile? ImageFile, [FromForm] string? Username, [FromForm] string? Password, [FromForm] string? city, [FromForm] string? email, [FromForm] string? country, [FromForm] string? address, [FromForm] int? zipCode, [FromForm] string? phoneNumber)
        {
            // Récupère l'utilisateur authentifié
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var current_user = await context.User.SingleOrDefaultAsync(u => u.Username == currentUserID);
            if (current_user == null) return StatusCode(401, "Utilisateur non trouvé");

            if (current_user.Role == UserRole.ROLE_ADMIN || current_user.Id == Id)
            {
                var User_ = await context.User.FindAsync(Id);
                if (User_ != null)
                {
                    // Mise à jour des champs utilisateur
                    if (!string.IsNullOrWhiteSpace(Username)) User_.Username = Username;
                    if (!string.IsNullOrWhiteSpace(Password)) User_.Password = Password;
                    if (!string.IsNullOrWhiteSpace(city)) User_.city = city;
                    if (!string.IsNullOrWhiteSpace(email)) User_.email = email;
                    if (!string.IsNullOrWhiteSpace(country)) User_.country = country;
                    if (!string.IsNullOrWhiteSpace(address)) User_.address = address;
                    if (zipCode.HasValue) User_.zipCode = zipCode.Value;
                    if (!string.IsNullOrWhiteSpace(phoneNumber)) User_.phoneNumber = phoneNumber;

                    // Gestion de l'image
                    if (ImageFile != null)
                    {
                        // Crée un nom de fichier unique pour éviter les conflits
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);

                        // Chemin pour sauvegarder l'image
                        var filePath = Path.Combine("API", "Uploads", "Profiles", fileName);
                        // LOG : Pour vérifier où le fichier sera sauvegardé
                        Console.WriteLine($"Saving file at: {filePath}");
                        Directory.CreateDirectory(Path.GetDirectoryName(filePath)); // Crée le répertoire si nécessaire

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await ImageFile.CopyToAsync(stream);
                        }

                        // Mise à jour du nom de l'image dans la base de données
                        User_.ImageName = fileName;
                    }

                    // Sauvegarde des changements dans la base de données
                    context.User.Update(User_);
                    await context.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "Les informations ont été mises à jour !",
                        imageName = User_.ImageName // Retourne le nom de l'image
                    });
                }

                return NotFound(new { message = "Utilisateur introuvable." });
            }
            else
            {
                return StatusCode(403, "Vous n'avez pas les droits pour cette action.");
            }
        }

        /// <summary>
        /// Supprime une entité User de la base de données, accessible aux administrateurs ou au propriétaire de l'utilisateur.
        /// </summary>
        /// <param name="Id">L'ID de l'entité User à supprimer.</param>
        /// <returns>Le résultat de l'opération, avec un message d'erreur si l'utilisateur n'a pas les droits ou si l'entité n'existe pas.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("/user/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int Id)
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

            // Récupère l'utilisateur courant et son rôle dans la base de données.
            var current_user = context.User.Where(u => u.Username == currentUserID).ToListAsync();
            var UserRole = current_user.Result[0].Role;            
            var UserID = current_user.Result[0].Id; 

            // Crée une instance de l'entité User avec l'ID spécifié pour la suppression.
            var entity = new User()
            {
                Id = Id
            };

            // Vérifie si l'utilisateur est administrateur ou le propriétaire de l'utilisateur cible.
            if (UserRole == 0 || UserID == Id) 
            {
                // Attache l'entité au contexte et la supprime de la base de données.
                context.User.Attach(entity);
                context.User.Remove(entity);
                await context.SaveChangesAsync();
                return Ok(entity);
            }
            else
            {
                // Si l'utilisateur n'a pas les droits, renvoie un statut 403 avec un message d'erreur.
                return StatusCode(403, "Vous n'avez pas les droits");
            }
        }

        /// <summary>
        /// Récupère une entité User spécifique dans la base de données par son ID.
        /// </summary>
        /// <param name="Id">L'ID de l'entité User à récupérer.</param>
        /// <returns>L'entité User correspondante ou un message d'erreur si non trouvée.</returns>
        [Route("/user/{Id}")]
        [HttpGet]
        public async Task<IActionResult> GetById(int Id)
        {
            // Récupère l'entité User correspondant à l'ID spécifié.
            var userById = context.User.Where(u => u.Id == Id);
            return Ok(userById);
        }

        /// <summary>
        /// Récupère la liste de toutes les entités User dans la base de données.
        /// </summary>
        /// <returns>Une liste d'objets User contenant toutes les entrées trouvées en base.</returns>
        [Route("/user")]
        [HttpGet]
        public List<User> Get()
        {
            // Utilise le contexte pour récupérer toutes les entités User et les retourne sous forme de liste.
            var user = context.User.ToList();
            return user;
        }
    }
}
