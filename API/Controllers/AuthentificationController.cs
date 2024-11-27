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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace quest_web.Controllers
{
    /// <summary>
    /// Contrôleur permettant de gérer l'authentification des utilisateurs.
    /// </summary>
    [Route("users")]
    [ApiController]
    public class AuthenticationController : ControllerBase 
    {
        private APIDbContext context;

        /// <summary>
        /// Constructeur du contrôleur Authentication.
        /// Initialise le contexte de base de données pour effectuer des opérations sur l'entité User.
        /// </summary>
        /// <param name="context">Le contexte de la base de données injecté via l'injection de dépendances.</param>
        public AuthenticationController(APIDbContext context) 
        {
            this.context = context;
        }

        /// <summary>
        /// Inscription d'un nouvel utilisateur et enregistrement de ses informations dans la base de données.
        /// </summary>
        /// <param name="user">Objet User contenant les informations de l'utilisateur.</param>
        /// <returns>Le statut de l'inscription avec le nom d'utilisateur et le rôle de l'utilisateur.</returns>
        [Route("/register")]
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            // Crée une nouvelle instance de l'utilisateur avec les données reçues.
            var entity = new User()
            {
                Username    = user.Username,
                Password    = user.Password,
                address     = user.address,
                city        = user.city,
                email       = user.email,
                country     = user.country,
                zipCode     = user.zipCode,
                phoneNumber = user.phoneNumber,
                Role = user.Role
            };

            // Vérifie si le nom d'utilisateur existe déjà en base pour éviter les doublons.
            if (context.User.Any(u => u.Username == entity.Username))
            {
                return StatusCode(409, "Ce username existe déjà");
            }

            // Vérifie si le numéro de téléphone existe déjà en base pour éviter les doublons.
            if (context.User.Any(u => u.phoneNumber == entity.phoneNumber))
            {
                return StatusCode(409, "Ce numero de téléphone existe déjà");
            }
            else 
            {
                // Ajoute l'utilisateur au contexte et enregistre les modifications dans la base de données.
                context.User.Add(entity);
                await context.SaveChangesAsync();
                return Ok(entity.Username + ' ' + entity.Role);
            }
        }

        /// <summary>
        /// Authentifie un utilisateur et génère un jeton JWT s'il est authentifié avec succès.
        /// </summary>
        /// <param name="user">Objet User contenant le nom d'utilisateur et le mot de passe.</param>
        /// <returns>Un objet avec le jeton et sa date d'expiration, ou un message d'erreur si les informations sont incorrectes.</returns>
        [Route("/authenticate")]
        [HttpPost]
        public async Task<IActionResult> AuthenticateUser([FromBody] User user)
        {
            var entity = new User()
            {
                Username = user.Username,
                Password = user.Password
            };

            // Vérifie si le nom d'utilisateur existe en base.
            if (!context.User.Any(u => u.Username == entity.Username))
            {
                return StatusCode(401, "Mauvais nom d'utilisateur");
            }

            // Vérifie si le mot de passe est correct.
            if (!context.User.Any(u => u.Password == entity.Password)) 
            {
                return StatusCode(401, "Mauvais mot de passe");
            }
            
            // Crée une liste de claims pour le jeton JWT.
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Génère une clé de signature pour le jeton.
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("lqkdgjqdighsuihfiqufha"));

            // Configure le jeton JWT avec les informations d'émetteur, d'audience, et d'expiration.
            var token = new JwtSecurityToken(
                issuer: "http://oec.com",
                audience: "http://oec.com",
                expires: DateTime.UtcNow.AddHours(24),
                claims: claims,
                signingCredentials: new Microsoft.IdentityModel.Tokens.SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            );
            
            // Retourne le jeton et sa date d'expiration.
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo 
            });
        }

        /// <summary>
        /// Récupère les informations de l'utilisateur actuellement authentifié.
        /// L'accès est restreint aux utilisateurs authentifiés avec JWT.
        /// </summary>
        /// <returns>Les informations de l'utilisateur authentifié.</returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("/me")]
        [HttpGet]
        public async Task<IActionResult> GetMe()
        {
            // Récupère les informations de l'utilisateur actuellement authentifié.
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;

            // Recherche les informations de l'utilisateur en base de données.
            var current_user = context.User.Where(u => u.Username == currentUserID);

            // Retourne les informations de l'utilisateur.
            return Ok(current_user);
        }

        private async Task SendResetEmail(string email, string resetLink)
        {
            try
            {
                using (var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new System.Net.NetworkCredential("your-email@gmail.com", "your-password");
                    smtp.EnableSsl = true;

                    var message = new System.Net.Mail.MailMessage
                    {
                        From = new System.Net.Mail.MailAddress("your-email@gmail.com"),
                        Subject = "Réinitialisation de votre mot de passe",
                        Body = $"Bonjour,<br/><br/>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href='{resetLink}'>Réinitialiser le mot de passe</a>.<br/><br/>Ce lien expirera dans 1 heure.",
                        IsBodyHtml = true
                    };

                    message.To.Add(email);
                    await smtp.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de l'envoi de l'email : {ex.Message}");
                throw new Exception("Erreur lors de l'envoi de l'email.");
            }
        }

        [Route("/forgot-password")]
        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            // Vérifie si l'utilisateur existe avec l'email fourni
            var user = await context.User.SingleOrDefaultAsync(u => u.email == email);
            if (user == null)
            {
                return StatusCode(404, "Utilisateur introuvable.");
            }

            // Génère un token unique et définit sa validité
            var token = Guid.NewGuid().ToString();
            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1);

            // Enregistre les modifications
            context.User.Update(user);
            await context.SaveChangesAsync();

           // Récupère l'URL de base depuis les variables d'environnement
            var apiUrl = Environment.GetEnvironmentVariable("API_URL");
            var resetLink = $"{apiUrl}/reset-password?token={token}";

            // Envoie l'email
            await SendResetEmail(user.email, resetLink);

            return Ok("Un email de réinitialisation a été envoyé.");
        }


    }
}
