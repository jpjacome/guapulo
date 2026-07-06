// Confirmation-email HTML template (rendered by lib/render-email.js).
// Lives in the repo so the email is fully driven by _data/event-config.json —
// EmailJS is just the delivery pipe (its template is only {{{html_content}}}).
//
// Placeholders: {{KEY}} — filled by render-email.js.
// Conditional blocks: <!--IF:NAME--> ... <!--/IF:NAME--> — removed when empty.
// Kept as table-based inline-styled HTML for email-client compatibility.

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

          <!-- Header Image (Full Width - No Padding) -->
          <tr>
            <td style="padding:0;">
              <img src="{{HERO_IMAGE_URL}}" alt="{{EVENT_NAME}}" style="width:100%; max-width:100%; display:block; border:0; margin:0;">
            </td>
          </tr>

          <!-- Main Content (With Side Padding) -->
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Title -->
                <tr>
                  <td style="padding-top:32px; padding-bottom:32px; font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:20px; font-weight:bold;">
                    {{TITLE_LINE}}
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding-bottom:32px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    ¡Hola {{GUEST_NAME}}!
                  </td>
                </tr>

                <!-- Intro message -->
                <tr>
                  <td style="padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    {{INTRO}}
                  </td>
                </tr>

                <!-- Event details -->
                <tr>
                  <td style="padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:18px; line-height:32px;">
                    🤖 <strong>¡Nos vemos pronto!<br> Te esperamos el {{LONG_DATE}} desde las {{DISPLAY_TIME}}</strong>
                  </td>
                </tr>

<!--IF:NOTE_BOX-->
                <!-- Highlight box (BYOB etc.) -->
                <tr>
                  <td style="padding:16px; border:1px solid {{ACCENT_COLOR}}; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    {{NOTE_BOX}}
                  </td>
                </tr>
                <tr>
                  <td style="height:32px; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
<!--/IF:NOTE_BOX-->

<!--IF:CAR_DIRECTIONS-->
                <!-- Section: Si vienes en auto -->
                <tr>
                  <td style="padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:18px; font-weight:bold;">
                    🚘 Si vienes en auto
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    {{CAR_DIRECTIONS}}
                  </td>
                </tr>
<!--IF:CAR_MAPS_URL-->
                <tr>
                  <td style="padding-bottom:32px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    <a href="{{CAR_MAPS_URL}}" style="color:{{ACCENT_COLOR}}; text-decoration:underline;">📍 Ver ubicación en Google Maps</a>
                  </td>
                </tr>
<!--/IF:CAR_MAPS_URL-->
<!--/IF:CAR_DIRECTIONS-->

<!--IF:WALK_DIRECTIONS-->
                <!-- Section: Si vienes a pie -->
                <tr>
                  <td style="padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:{{ACCENT_COLOR}}; font-size:18px; font-weight:bold;">
                    👣 Si vienes a pie
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    {{WALK_DIRECTIONS}}
                  </td>
                </tr>
<!--IF:WALK_MAPS_URL-->
                <tr>
                  <td style="padding-bottom:32px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    <a href="{{WALK_MAPS_URL}}" style="color:{{ACCENT_COLOR}}; text-decoration:underline;">📍 Ver ubicación en Google Maps</a>
                  </td>
                </tr>
<!--/IF:WALK_MAPS_URL-->
<!--/IF:WALK_DIRECTIONS-->

<!--IF:CONTACT_TEXT-->
                <!-- Contact Info -->
                <tr>
                  <td style="padding-bottom:32px; font-family:'Courier New',Courier,monospace; color:#ffffff; font-size:16px;">
                    {{CONTACT_TEXT}}
<!--IF:CONTACT_EMAIL-->
                    <a href="mailto:{{CONTACT_EMAIL}}" style="color:{{ACCENT_COLOR}}; text-decoration:underline;">{{CONTACT_EMAIL}}</a>
<!--/IF:CONTACT_EMAIL-->
<!--IF:CONTACT_PHONE-->
                    · <a href="tel:{{CONTACT_PHONE_TEL}}" style="color:{{ACCENT_COLOR}}; text-decoration:underline;">{{CONTACT_PHONE}}</a>
<!--/IF:CONTACT_PHONE-->
                  </td>
                </tr>
<!--/IF:CONTACT_TEXT-->

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
                    {{EVENT_NAME}}
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
