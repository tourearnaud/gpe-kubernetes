using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;

namespace quest_web.Controllers
{
    [Route("api/commentaires")]
    [ApiController]
    public class CommentaireController : ControllerBase
    {
        private readonly APIDbContext context;

        public CommentaireController(APIDbContext context)
        {
            this.context = context;
        }

        // Récupère la liste des commentaires associés à un article spécifique
        [HttpGet("article/{articleId}")]
        public async Task<IActionResult> GetByArticleId(int articleId)
        {
            var commentaires = await context.Commentaire
                .Where(c => c.ArticlesId == articleId)
                .ToListAsync();

            var result = commentaires.Select(c => new 
            {
                c.Id,
                c.contenue,
                c.Timestamp,
                Username = context.User.Where(u => u.Id == c.UserId).Select(u => u.Username).FirstOrDefault()
            }).ToList();

            // Retourner un tableau vide avec un statut 200 au lieu de 404
            return Ok(result);
        }


        // Récupère le nombre total de commentaires associés à un article
        [HttpGet("article/{articleId}/count")]
        public async Task<IActionResult> GetCommentCountByArticleId(int articleId)
        {
            var count = await context.Commentaire
                .Where(c => c.ArticlesId == articleId)
                .CountAsync();

            return Ok(new { count });
        }

        // Récupère le nombre total de commentaires pour tous les articles d'un utilisateur spécifique
        [HttpGet("user/{userId}/count")]
        public async Task<IActionResult> GetCommentCountByUserId(int userId)
        {
            var count = await context.Commentaire
                .Where(c => context.Articles.Any(a => a.Id == c.ArticlesId && a.UserId == userId))
                .CountAsync();

            return Ok(new { count });
        }

        // Crée une nouvelle entité Commentaire et l'enregistre dans la base de données
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> RegisterComment([FromBody] Commentaire commentaire)
        {
            if (string.IsNullOrWhiteSpace(commentaire.contenue))
            {
                return BadRequest("Le contenu du commentaire ne peut pas être vide.");
            }

            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

            var current_user = await context.User.Where(u => u.Username == currentUserID).FirstOrDefaultAsync();
            if (current_user == null)
            {
                return Unauthorized("Utilisateur non trouvé.");
            }

            var entity = new Commentaire
            {
                UserId = current_user.Id,
                Username = current_user.Username,
                Timestamp = DateTime.UtcNow,
                contenue = commentaire.contenue,
                ArticlesId = commentaire.ArticlesId
            };

            context.Commentaire.Add(entity);
            await context.SaveChangesAsync();

            return Ok(entity);
        }

        // Met à jour une entité Commentaire existante
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] Commentaire commentaire)
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

            var current_user = await context.User.Where(u => u.Username == currentUserID).FirstOrDefaultAsync();
            if (current_user == null || current_user.Role != 0)
            {
                return StatusCode(403, "Vous n'avez pas les droits");
            }

            var commentaireToUpdate = await context.Commentaire.FindAsync(id);
            if (commentaireToUpdate == null)
            {
                return NotFound("Commentaire non trouvé");
            }

            commentaireToUpdate.contenue = commentaire.contenue;
            await context.SaveChangesAsync();

            return Ok(commentaireToUpdate);
        }

        // Supprime une entité Commentaire de la base de données
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

            var current_user = await context.User.Where(u => u.Username == currentUserID).FirstOrDefaultAsync();
            if (current_user == null || current_user.Role != 0)
            {
                return StatusCode(403, "Vous n'avez pas les droits");
            }

            var commentaireToDelete = await context.Commentaire.FindAsync(id);
            if (commentaireToDelete == null)
            {
                return NotFound("Commentaire non trouvé");
            }

            context.Commentaire.Remove(commentaireToDelete);
            await context.SaveChangesAsync();

            return Ok(commentaireToDelete);
        }

        // Récupère une entité Commentaire spécifique par son ID
        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var commentaireById = await context.Commentaire.FindAsync(id);
            return commentaireById == null ? NotFound("Commentaire non trouvé") : Ok(commentaireById);
        }
    }
}
