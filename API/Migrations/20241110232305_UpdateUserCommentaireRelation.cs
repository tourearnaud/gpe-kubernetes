using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quest_web.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserCommentaireRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Commentaire_User_UserId",
                table: "Commentaire");

            migrationBuilder.DropIndex(
                name: "IX_Commentaire_UserId",
                table: "Commentaire");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Commentaire_UserId",
                table: "Commentaire",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Commentaire_User_UserId",
                table: "Commentaire",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");
        }
    }
}
