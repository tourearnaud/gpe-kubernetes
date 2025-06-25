using quest_web.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using quest_web.Repository.Abastract;
using quest_web.Repository.Implementation;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Charger les variables d'environnement
Env.Load();

// Récupérer l'URL de l'API uniquement (le reste, on ne récupère plus ici)
var apiUrl = builder.Configuration["API_URL"];
if (string.IsNullOrEmpty(apiUrl))
{
    throw new Exception("La variable API_URL est manquante dans la configuration.");
}

// Lire la configuration pour activer ou désactiver HTTPS
var httpsSettings = builder.Configuration.GetSection("HttpsSettings");
bool useHttps = httpsSettings.GetValue<bool>("UseHttps");
int httpPort = httpsSettings.GetValue<int>("HttpPort");
int httpsPort = httpsSettings.GetValue<int>("HttpsPort");

// Configurer Kestrel pour HTTP/HTTPS selon la configuration
builder.WebHost.ConfigureKestrel(options =>
{
    if (useHttps)
    {
        options.ListenAnyIP(httpsPort, listenOptions =>
        {
            listenOptions.UseHttps(builder.Configuration["Kestrel:Endpoints:Https:Certificate:Path"],
                                   builder.Configuration["Kestrel:Endpoints:Https:Certificate:Password"]);
        });
        Console.WriteLine($"✔️ HTTPS activé sur le port {httpsPort}");
    }
    else
    {
        options.ListenAnyIP(httpPort);
        Console.WriteLine($"⚠️ HTTPS désactivé. HTTP activé sur le port {httpPort}");
    }
});

// --- MODIFICATION ICI ---
// Au lieu de récupérer manuellement les variables d'env pour la connexion,
// on récupère la chaîne de connexion dans la configuration (appsettings.json ou appsettings.Production.json)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<APIDbContext>(options =>
{
    options.UseMySQL(connectionString);
});

// Ajout des services pour l'injection de dépendances
builder.Services.AddTransient<IFileService, FileService>();
builder.Services.AddTransient<IProductRepository, ProductRepostory>();

// Ajout de SignalR pour la gestion des communications en temps réel
builder.Services.AddSignalR();

// Ajout des contrôleurs MVC
builder.Services.AddControllers();

// Configuration de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    // Configuration pour JWT dans Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Saisir 'Bearer {token}' dans la boîte ci-dessous (sans guillemets). Exemple : Bearer abc123xyz"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configuration de l'authentification JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "http://oec.com",
            ValidAudience = "http://oec.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("lqkdgjqdighsuihfiqufha"))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Échec de l'authentification : {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var username = context.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"Token validé. Utilisateur : {username}");
                return Task.CompletedTask;
            }
        };
    });

// Configuration CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", $"http://localhost:{httpPort}")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Application des migrations de la base de données
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<APIDbContext>();
    context.Database.SetCommandTimeout(100);
    context.Database.Migrate();
}

// Configuration pour servir les fichiers statiques du dossier "Uploads"
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Resources"
});

// Nouveau middleware pour les photos de profil
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "API", "Uploads", "Profiles")),
    RequestPath = "/uploads/Profiles"
});

// Configuration du pipeline HTTP
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

if (useHttps)
{
    app.UseHttpsRedirection(); // Redirection vers HTTPS si activé
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.Run();
