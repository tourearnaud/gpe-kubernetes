using Microsoft.AspNetCore.SignalR;
using quest_web.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class ChatHub : Hub
{
    private readonly APIDbContext _context;

    public ChatHub(APIDbContext context)
    {
        _context = context;
    }

    public async Task SendMessage(string sender, string recipient, string content)
    {
        // Créer un message
        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            Content = content,
            Timestamp = DateTime.UtcNow,
            IsRead = false
        };

        // Sauvegarder le message dans la base de données
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Notifier le destinataire en temps réel
        await Clients.User(recipient).SendAsync("ReceiveMessage", message);

        // Notification pour le destinataire
        await Clients.User(recipient).SendAsync("NotifyNewMessage", message);
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}
