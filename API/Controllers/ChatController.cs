using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quest_web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;

namespace quest_web.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly APIDbContext _context;

        public ChatController(APIDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Envoie un message d'un utilisateur à un autre et l'enregistre en base de données.
        /// </summary>
        [Route("send")]
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Content))
                return BadRequest("Le contenu du message est requis.");

            message.Timestamp = DateTime.UtcNow;
            message.IsRead = false; // Par défaut, le message est non lu
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        /// <summary>
        /// Récupère tous les messages échangés entre deux utilisateurs.
        /// </summary>
        [Route("messages")]
        [HttpGet]
        public async Task<IActionResult> GetMessages(string sender, string recipient)
        {
            if (string.IsNullOrWhiteSpace(sender) || string.IsNullOrWhiteSpace(recipient))
                return BadRequest("Les paramètres expéditeur et destinataire sont obligatoires.");

            var userMessages = await _context.Messages
                .Where(m => (m.Sender == sender && m.Recipient == recipient) ||
                            (m.Sender == recipient && m.Recipient == sender))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(userMessages);
        }

        /// <summary>
        /// Marque tous les messages non lus entre deux utilisateurs comme lus.
        /// </summary>
        [Route("mark-as-read")]
        [HttpPost]
        public async Task<IActionResult> MarkAsRead(string sender, string recipient)
        {
            var unreadMessages = await _context.Messages
                .Where(m => m.Sender == sender && m.Recipient == recipient && !m.IsRead)
                .ToListAsync();

            unreadMessages.ForEach(m => m.IsRead = true);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Messages marqués comme lus." });
        }

        /// <summary>
        /// Récupère les messages non lus pour un utilisateur.
        /// </summary>
        [Route("unread")]
        [HttpGet]
        public async Task<IActionResult> GetUnreadMessages(string recipient)
        {
            var unreadMessages = await _context.Messages
                .Where(m => m.Recipient == recipient && !m.IsRead)
                .ToListAsync();

            return Ok(unreadMessages);
        }
    }
}
