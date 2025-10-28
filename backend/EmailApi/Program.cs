
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAll");

// Ensure wwwroot/uploads exists
var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
var uploadsDir = Path.Combine(webRoot, "uploads");
Directory.CreateDirectory(uploadsDir);

// Database location
var dataDir = Path.Combine(Directory.GetCurrentDirectory(), "data");
Directory.CreateDirectory(dataDir);
var dbPath = Path.Combine(dataDir, "assets.db");
var connString = new SqliteConnectionStringBuilder { DataSource = dbPath }.ToString();

// Initialize DB
using (var conn = new SqliteConnection(connString))
{
    conn.Open();
    var cmd = conn.CreateCommand();
    cmd.CommandText = @"
        CREATE TABLE IF NOT EXISTS Assets (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            FileName TEXT NOT NULL,
            OriginalName TEXT,
            ContentType TEXT,
            Size INTEGER,
            UploadedAt TEXT,
            OriginalPath TEXT,
            Data BLOB
        );";
    cmd.ExecuteNonQuery();
    conn.Close();
}

// Contact endpoint: sends email via SMTP (MailerSend)
app.MapPost("/api/contact", async (ContactRequest req, IConfiguration config) =>
{
    // Basic validation
    if (string.IsNullOrWhiteSpace(req?.Email) || string.IsNullOrWhiteSpace(req?.Message) || string.IsNullOrWhiteSpace(req?.FirstName))
    {
        return Results.Json(new { success = false, error = "Please provide name, email and message." }, statusCode: 400);
    }

    var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? config["Smtp:Host"];
    var smtpPortStr = Environment.GetEnvironmentVariable("SMTP_PORT") ?? config["Smtp:Port"];
    var smtpUser = Environment.GetEnvironmentVariable("SMTP_USER") ?? config["Smtp:Username"];
    var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASS") ?? config["Smtp:Password"];
    var fromEmail = Environment.GetEnvironmentVariable("SMTP_FROM") ?? config["Smtp:FromEmail"] ?? smtpUser;
    var fromName = Environment.GetEnvironmentVariable("SMTP_FROM_NAME") ?? config["Smtp:FromName"] ?? "BuildBetter Contact";
    var toEmail = Environment.GetEnvironmentVariable("SMTP_TO") ?? config["Smtp:ToEmail"] ?? "you@example.com";
    var adminEmail = Environment.GetEnvironmentVariable("SMTP_ADMIN") ?? config["Smtp:AdminEmail"] ?? fromEmail;

    if (string.IsNullOrWhiteSpace(smtpHost) || string.IsNullOrWhiteSpace(smtpPortStr) || string.IsNullOrWhiteSpace(smtpUser) || string.IsNullOrWhiteSpace(smtpPass))
    {
        return Results.Json(new { success = false, error = "SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS." }, statusCode: 500);
    }

    if (!int.TryParse(smtpPortStr, out var smtpPort))
    {
        smtpPort = 587;
    }

    var message = new MimeMessage();
    message.From.Add(new MailboxAddress(fromName, fromEmail));
    message.To.Add(MailboxAddress.Parse(toEmail));
    message.Subject = string.IsNullOrWhiteSpace(req.Subject) ? "New contact request" : req.Subject;

    var bodyBuilder = new BodyBuilder();
    bodyBuilder.HtmlBody = $@"
        <h2>New contact request</h2>
        <p><strong>Name:</strong> {req.FirstName} {req.LastName}</p>
        <p><strong>Email:</strong> {req.Email}</p>
        <p><strong>Phone:</strong> {req.Phone}</p>
        <p><strong>Subject:</strong> {req.Subject}</p>
        <p><strong>Message:</strong><br/>{System.Net.WebUtility.HtmlEncode(req.Message)}</p>
    ";
    bodyBuilder.TextBody = $@"Name: {req.FirstName} {req.LastName}\nEmail: {req.Email}\nPhone: {req.Phone}\nSubject: {req.Subject}\nMessage: {req.Message}";
    message.Body = bodyBuilder.ToMessageBody();

    try
    {
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(smtpUser, smtpPass);
        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);
        return Results.Json(new { success = true, message = "Email sent" }, statusCode: 200);
    }
    catch (System.Exception ex)
    {
        var em = ex.Message ?? string.Empty;
        if (em.Contains("MS42225") || em.IndexOf("trial", System.StringComparison.OrdinalIgnoreCase) >= 0)
        {
            // attempt fallback to admin email if different
            if (!string.Equals(adminEmail, toEmail, StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    var fallback = new MimeMessage();
                    fallback.From.Add(new MailboxAddress(fromName, fromEmail));
                    fallback.To.Add(MailboxAddress.Parse(adminEmail));
                    fallback.Subject = message.Subject + " (fallback delivery)";
                    fallback.Body = message.Body;
                    using var smtp2 = new SmtpClient();
                    await smtp2.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                    await smtp2.AuthenticateAsync(smtpUser, smtpPass);
                    await smtp2.SendAsync(fallback);
                    await smtp2.DisconnectAsync(true);
                    return Results.Json(new { success = true, message = "Original blocked by trial; resent to admin." }, statusCode: 200);
                }
                catch (System.Exception ex2)
                {
                    return Results.Json(new { success = false, error = "Send blocked (trial) and resend failed: " + ex2.Message }, statusCode: 500);
                }
            }
        }
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
});

// Asset endpoints
app.MapGet("/api/assets", () =>
{
    using var conn = new SqliteConnection(connString);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT Id, FileName, OriginalName, ContentType, Size, UploadedAt, OriginalPath FROM Assets ORDER BY UploadedAt DESC;";
    using var reader = cmd.ExecuteReader();
    var list = new System.Collections.Generic.List<object>();
    while (reader.Read())
    {
        var id = reader.IsDBNull(0) ? 0 : reader.GetInt64(0);
        var fileName = reader.IsDBNull(1) ? null : reader.GetString(1);
        var originalName = reader.IsDBNull(2) ? null : reader.GetString(2);
        var contentType = reader.IsDBNull(3) ? null : reader.GetString(3);
        long? size = reader.IsDBNull(4) ? (long?)null : reader.GetInt64(4);
        var uploadedAt = reader.IsDBNull(5) ? null : reader.GetString(5);
        var originalPath = reader.IsDBNull(6) ? null : reader.GetString(6);
        list.Add(new {
            id = id,
            fileName = fileName,
            originalName = originalName,
            contentType = contentType,
            size = size,
            uploadedAt = uploadedAt,
            originalPath = originalPath,
            url = $"/api/assets/{id}"
        });
    }
    conn.Close();
    return Results.Ok(new { success = true, assets = list });
});

app.MapGet("/api/assets/{id:int}", (int id) =>
{
    using var conn = new SqliteConnection(connString);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT FileName, ContentType, Data FROM Assets WHERE Id = @id LIMIT 1;";
    cmd.Parameters.AddWithValue("@id", id);
    using var reader = cmd.ExecuteReader();
    if (!reader.Read())
    {
        conn.Close();
        return Results.NotFound(new { success = false, error = "Asset not found" });
    }
    var contentType = reader.IsDBNull(1) ? "application/octet-stream" : reader.GetString(1);
    var blob = reader.IsDBNull(2) ? null : (byte[])reader.GetValue(2);
    conn.Close();
    if (blob == null) return Results.NotFound(new { success = false, error = "No data" });
    return Results.File(blob, contentType);
});

app.MapGet("/api/assets/name/{name}", (string name) =>
{
    using var conn = new SqliteConnection(connString);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT Id, FileName FROM Assets WHERE OriginalName = @n OR FileName = @n LIMIT 1;";
    cmd.Parameters.AddWithValue("@n", name);
    var id = cmd.ExecuteScalar();
    conn.Close();
    if (id == null) return Results.NotFound(new { success = false, error = "Not found" });
    return Results.Redirect($"/api/assets/{id}");
});

app.MapGet("/", () => "BuildBetter Email API (SMTP + Assets DB) is running.");

app.Run();

public class ContactRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Subject { get; set; }
    public string? Message { get; set; }
}
