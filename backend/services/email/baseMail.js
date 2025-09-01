// services/email/baseEmail.js
export const baseMail = (content) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; 
                  overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="padding: 20px 30px; text-align: center; border-bottom: 1px solid #eee;">
          <h2 style="margin: 0; color: #333;">NoahPlanet</h2>
        </div>

        <!-- Body -->
        <div style="padding: 30px; text-align: center;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee;">
          <div style="margin-bottom: 10px;">
            Visit our website: 
            <a href="https://noahplanet.com" style="color: #007bff; text-decoration: none;">noahplanet.com</a>
          </div>
          <div>
            Follow us:
            <a href="https://facebook.com/noahplanet" style="margin: 0 5px; color: #3b5998; text-decoration: none;">Facebook</a> |
            <a href="https://twitter.com/noahplanet" style="margin: 0 5px; color: #1da1f2; text-decoration: none;">Twitter</a> |
            <a href="https://instagram.com/noahplanet" style="margin: 0 5px; color: #e4405f; text-decoration: none;">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  `;
};