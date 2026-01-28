import { mailTransporter } from "../config/mail";

function escapeHtml(input: string) {
  // Compatible with older TS targets, no replaceAll usage.
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return input.replace(/[&<>"']/g, (ch) => map[ch]);
}

function getFromEmail() {
  return (
    process.env.FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    "no-reply@alumni.local"
  );
}

export async function sendAdminCreatedUserEmail(params: {
  to: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const { to, username, password, firstName, lastName } = params;

  const from = getFromEmail();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const loginUrl = `${frontendUrl}/login`;

  const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const greeting = displayName ? `Poštovani ${displayName},` : "Poštovani,";

  const subject = "Alumni Club nalog je kreiran";

  const text = `${greeting}

Administrator vam je kreirao nalog za Alumni Club platformu.

Korisničko ime: ${username}
Lozinka: ${password}

Prijava: ${loginUrl}

Preporuka: nakon prve prijave promijenite lozinku.
`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
    <p>${greeting}</p>
    <p>Administrator vam je kreirao nalog za <b>Alumni Club</b> platformu.</p>

    <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb;">
      <p style="margin: 0;"><b>Korisničko ime:</b> ${escapeHtml(username)}</p>
      <p style="margin: 6px 0 0 0;"><b>Lozinka:</b> ${escapeHtml(password)}</p>
    </div>

    <p style="margin-top: 16px;">
      <a href="${loginUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;text-decoration:none;background:#1f2937;color:white;">
        Prijavi se
      </a>
    </p>

    <p style="color:#6b7280;font-size:12px;margin-top:16px;">
      Preporuka: nakon prve prijave promijenite lozinku.
    </p>
  </div>`;

  return mailTransporter.sendMail({
    from: `"FIT Alumni Club" <${from}>`,
    to,
    subject,
    text,
    html,
  });
}
