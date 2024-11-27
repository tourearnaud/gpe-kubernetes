using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quest_web.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ajouter une contrainte d'unicité sur la colonne email
            migrationBuilder.CreateIndex(
                name: "IX_User_email", // Nom de l'index
                table: "User", // Nom de la table
                column: "email", // Colonne concernée
                unique: true // Spécifie que l'index est unique
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Supprimer l'index si la migration est annulée
            migrationBuilder.DropIndex(
                name: "IX_User_email", // Nom de l'index
                table: "User" // Nom de la table
            );
        }
    }
}
