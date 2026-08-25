// Invitation-email HTML template (rendered by lib/render-email.js -> renderInvite).
// Same conventions as email-template.js: {{KEY}} placeholders and
// <!--IF:NAME--> conditional blocks. Table-based inline CSS for email clients.

module.exports = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{SUBJECT}}</title>
</head>
<body style="margin:0; padding:0; background-color:#000000;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; background-color:#000000;">

          <!-- Header Image -->
          <tr>
            <td style="padding:0;">
              <img src="{{HERO_IMAGE_URL}}" alt="{{EVENT_NAME}}" style="width:100%; max-width:100%; display:block; border:0; margin:0;">
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Title -->
                <tr>
                  <td align="center" style="padding-top:36px; padding-bottom:8px; font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:26px; font-weight:bold; letter-spacing:1px;">
                    {{EVENT_NAME_UPPER}}
                  </td>
                </tr>
<!--IF:SUBTITLE-->
                <tr>
                  <td align="center" style="padding-bottom:8px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:15px; letter-spacing:2px;">
                    {{SUBTITLE}}
                  </td>
                </tr>
<!--/IF:SUBTITLE-->

                <!-- Greeting + message -->
                <tr>
                  <td style="padding-top:24px; padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    ¡Hola {{GUEST_NAME}}!
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px; line-height:26px;">
                    {{MESSAGE}}
                  </td>
                </tr>

                <!-- Event data box -->
                <tr>
                  <td style="padding:20px; border:1px solid {{ACCENT_COLOR}};">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom:8px; font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:16px; font-weight:bold;">
                          📅 {{LONG_DATE}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:8px; font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:16px; font-weight:bold;">
                          🕔 Desde las {{DISPLAY_TIME}}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:16px; font-weight:bold;">
                          📍 {{LOCATION}}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA button -->
                <tr>
                  <td align="center" style="padding-top:36px; padding-bottom:40px;">
                    <a href="{{RSVP_URL}}" style="display:inline-block; padding:16px 36px; background-color:{{ACCENT_COLOR}}; color:#000000; font-family:'Courier New',Courier,monospace; font-size:17px; font-weight:bold; text-decoration:none; letter-spacing:1px;">
                      {{CTA_LABEL}} →
                    </a>
                  </td>
                </tr>

                <!-- Divider + signature -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-top:1px solid #444444; font-size:0; line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:32px; font-family:'Courier New',Courier,monospace; color:#888888; font-size:13px;">
                    {{EVENT_NAME}} · <a href="{{SITE_URL}}" style="color:#888888;">{{SITE_HOST}}</a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
