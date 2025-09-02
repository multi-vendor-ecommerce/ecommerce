// services/email/baseMail.js
export const baseMail = (content, title = "NoahPlanet") => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; 
                  overflow: hidden; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);">

        <!-- Header -->
        <div style="background: #1a73e8; padding: 20px 30px; text-align: center; color: #fff;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">${title}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 35px; text-align: center; color: #333; font-size: 15px; line-height: 1.6;">
          ${content}
        </div>

        <!-- Divider -->
        <div style="border-top: 1px solid #eee; margin: 0 20px;"></div>

        <!-- Footer -->
        <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #888;">
          <div style="margin-bottom: 10px;">
            Visit our website: 
            <a href="https://noahplanet.com" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none;">noahplanet.com</a>
          </div>
          <div>
            Follow us:
            <a href="https://facebook.com/noahplanet" target="_blank" rel="noopener noreferrer" style="margin: 0 5px; color: #3b5998;">Facebook</a> |
            <a href="https://twitter.com/noahplanet" target="_blank" rel="noopener noreferrer" style="margin: 0 5px; color: #1da1f2;">Twitter</a> |
            <a href="https://instagram.com/noahplanet" target="_blank" rel="noopener noreferrer" style="margin: 0 5px; color: #e4405f;">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  `;
};