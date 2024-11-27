using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using System.Threading.Tasks;

namespace quest_web.Controllers
{
    /// <summary>
    /// Contrôleur permettant de gérer les entités Age.
    /// </summary>
    [Route("age")]
    [ApiController]
    public class AgeController : ControllerBase 
    {
        private readonly APIDbContext context;

        /// <summary>
        /// Constructeur du contrôleur Age.
        /// Initialise le contexte de base de données pour effectuer des opérations sur l'entité Age.
        /// </summary>
        public AgeController(APIDbContext context) 
        {
            this.context = context;
        }

        /// <summary>
        /// Récupère la liste de toutes les entités Age dans la base de données.
        /// </summary>
        [HttpGet]
        public async Task<List<Age>> Get()
        {
            return await context.Age.ToListAsync();
        }

        /// <summary>
        /// Crée une nouvelle entité Age et l'enregistre dans la base de données.
        /// </summary>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] Age age)
        {
            var entity = new Age { contenue = age.contenue };
            context.Age.Add(entity);
            await context.SaveChangesAsync();
            return Ok(entity);
        }

        /// <summary>
        /// Met à jour une entité Age existante dans la base de données.
        /// </summary>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateUser([FromBody] Age age, int Id)
        {
            var currentUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await context.User.FirstOrDefaultAsync(u => u.Username == currentUserID);

            if (currentUser == null || currentUser.Role != UserRole.ROLE_ADMIN)
            {
                return StatusCode(403, "Vous n'avez pas les droits");
            }

            var Age_ = await context.Age.FindAsync(Id);
            if (Age_ == null)
            {
                return NotFound("Cette Id n'existe pas");
            }

            Age_.contenue = age.contenue;
            await context.SaveChangesAsync();
            return Ok(Age_);
        }

        /// <summary>
        /// Supprime une entité Age de la base de données.
        /// </summary>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteUser(int Id)
        {
            var currentUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await context.User.FirstOrDefaultAsync(u => u.Username == currentUserID);

            if (currentUser == null || currentUser.Role != UserRole.ROLE_ADMIN)
            {
                return StatusCode(403, "Vous n'avez pas les droits");
            }

            var age = await context.Age.FindAsync(Id);
            if (age == null)
            {
                return NotFound("Cette Id n'existe pas");
            }

            context.Age.Remove(age);
            await context.SaveChangesAsync();
            return Ok(age);
        }

        /// <summary>
        /// Récupère une entité Age spécifique dans la base de données par son ID.
        /// </summary>
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetById(int Id)
        {
            var age = await context.Age.FirstOrDefaultAsync(u => u.Id == Id);
            if (age == null)
            {
                return NotFound("Cette Id n'existe pas");
            }
            return Ok(age);
        }
    }
}
