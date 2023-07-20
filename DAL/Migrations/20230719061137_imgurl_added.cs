using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class imgurl_added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "39ab5cdd-474f-45af-8fd6-9203a4790846", "AQAAAAEAACcQAAAAEMXi+By7SxQa4VM6yWrGKAa8BSrq6Bi5hgbqq2rzdT7hi+IqnDkyyrj8UrAUpWMQdg==", "dae9c7af-cb4c-4523-813b-cb1f6d4a2189" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "728c2768-8031-4ddf-a0fc-8693476f014c", "AQAAAAEAACcQAAAAELWkKhcnnlvTQHtdmBeoN4CbaTiW82+LBthbN4ft4hrWhr64j1erPgbhythJAUS6Cw==", "b1878e0b-b6c5-48f0-98c1-6a6950025cf5" });
        }
    }
}
