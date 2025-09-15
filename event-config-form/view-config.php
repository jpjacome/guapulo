<?php
// Get the latest configuration file
$configFile = 'saved_configs/latest_config.json';

if (!file_exists($configFile)) {
    header("Location: index.php");
    exit();
}

$config = json_decode(file_get_contents($configFile), true);

// Helper function to format values
function formatConfigValue($value) {
    if (is_array($value)) {
        return implode(', ', $value);
    }
    if ($value === 'yes') return '✅ Yes';
    if ($value === 'no') return '❌ No';
    if (empty($value)) return '<em>Not specified</em>';
    return htmlspecialchars($value);
}

// Helper function to get color palette display
function getColorPaletteDisplay($scheme) {
    $palettes = [
        'elegant_wedding' => ['name' => 'Elegant Wedding', 'colors' => ['#F5E6E8', '#FFF8DC', '#2F4F2F']],
        'fun_birthday' => ['name' => 'Fun Birthday', 'colors' => ['#FF6B6B', '#FFE66D', '#4ECDC4']],
        'professional_corporate' => ['name' => 'Professional Corporate', 'colors' => ['#2E86AB', '#F8F9FA', '#343A40']],
        'casual_bbq' => ['name' => 'Casual BBQ', 'colors' => ['#D2691E', '#F5F5DC', '#8B4513']],
        'baby_shower' => ['name' => 'Sweet Baby Shower', 'colors' => ['#B8E6B8', '#B6D7FF', '#E6E6FA']]
    ];
    
    if (isset($palettes[$scheme])) {
        $palette = $palettes[$scheme];
        $colorBoxes = '';
        foreach ($palette['colors'] as $color) {
            $colorBoxes .= "<span style='display:inline-block;width:20px;height:20px;background:{$color};border:1px solid #ccc;margin:0 2px;border-radius:3px;'></span>";
        }
        return $palette['name'] . ' ' . $colorBoxes;
    }
    
    return formatConfigValue($scheme);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Configuration Details</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .config-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .config-table th,
        .config-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .config-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #667eea;
        }
        .config-table tr:hover {
            background-color: #f8f9ff;
        }
        .section-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: bold;
            text-align: center;
        }
        .print-btn {
            margin: 20px 0;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📋 Configuration Details</h1>
            <p>Review your complete event RSVP website configuration</p>
        </header>

        <div style="padding: 40px 30px;">
            <div class="no-print" style="text-align: center; margin-bottom: 30px;">
                <button onclick="window.print()" class="btn-secondary print-btn">🖨️ Print Configuration</button>
                <a href="download.php" class="btn-primary">📥 Download JSON File</a>
            </div>

            <table class="config-table">
                <tr class="section-header">
                    <td colspan="2">📅 EVENT DETAILS</td>
                </tr>
                <tr><th>Event Type</th><td><?= formatConfigValue($config['event_type'] ?? '') ?></td></tr>
                <tr><th>Event Name</th><td><?= formatConfigValue($config['event_name'] ?? '') ?></td></tr>
                <tr><th>Event Date</th><td><?= formatConfigValue($config['event_date'] ?? '') ?></td></tr>
                <tr><th>Event Time</th><td><?= formatConfigValue($config['event_time'] ?? '') ?></td></tr>
                <tr><th>Location</th><td><?= formatConfigValue($config['event_location'] ?? '') ?></td></tr>
                <tr><th>Google Maps</th><td><?= formatConfigValue($config['google_maps'] ?? '') ?></td></tr>
                <?php if (!empty($config['maps_address'])): ?>
                <tr><th>Maps Address</th><td><?= formatConfigValue($config['maps_address']) ?></td></tr>
                <?php endif; ?>

                <tr class="section-header">
                    <td colspan="2">✍️ CONTENT & MESSAGING</td>
                </tr>
                <tr><th>Host Names</th><td><?= formatConfigValue($config['host_names'] ?? '') ?></td></tr>
                <tr><th>Invitation Tone</th><td><?= formatConfigValue($config['invitation_tone'] ?? '') ?></td></tr>
                <tr><th>Welcome Message</th><td><?= formatConfigValue($config['welcome_message'] ?? '') ?></td></tr>
                <tr><th>Event Description</th><td><?= formatConfigValue($config['event_description'] ?? '') ?></td></tr>
                <tr><th>Gift Information</th><td><?= formatConfigValue($config['gift_information'] ?? '') ?></td></tr>
                <tr><th>RSVP Deadline</th><td><?= formatConfigValue($config['rsvp_deadline'] ?? '') ?></td></tr>
                <tr><th>Special Instructions</th><td><?= formatConfigValue($config['special_instructions'] ?? '') ?></td></tr>

                <tr class="section-header">
                    <td colspan="2">🎨 DESIGN & BRANDING</td>
                </tr>
                <tr><th>Logo Available</th><td><?= formatConfigValue($config['logo_available'] ?? '') ?></td></tr>
                <?php if (!empty($config['logo_description'])): ?>
                <tr><th>Logo Description</th><td><?= formatConfigValue($config['logo_description']) ?></td></tr>
                <?php endif; ?>
                <tr><th>Hero Media</th><td><?= formatConfigValue($config['hero_media'] ?? '') ?></td></tr>
                <?php if (!empty($config['hero_description'])): ?>
                <tr><th>Hero Description</th><td><?= formatConfigValue($config['hero_description']) ?></td></tr>
                <?php endif; ?>
                <tr><th>Favicon</th><td><?= formatConfigValue($config['favicon'] ?? '') ?></td></tr>
                <tr><th>Color Scheme</th><td><?= getColorPaletteDisplay($config['color_scheme'] ?? '') ?></td></tr>
                
                <?php if ($config['color_scheme'] === 'custom'): ?>
                <tr><th>Primary Color</th><td><?= formatConfigValue($config['primary_color_hex'] ?? '') ?></td></tr>
                <tr><th>Secondary Color</th><td><?= formatConfigValue($config['secondary_color_hex'] ?? '') ?></td></tr>
                <tr><th>Text Color</th><td><?= formatConfigValue($config['text_color_hex'] ?? '') ?></td></tr>
                <?php endif; ?>

                <tr class="section-header">
                    <td colspan="2">📝 FORM & FUNCTIONALITY</td>
                </tr>
                <tr><th>Dietary Restrictions Field</th><td><?= formatConfigValue($config['dietary_restrictions'] ?? '') ?></td></tr>
                <tr><th>Plus-One Guests</th><td><?= formatConfigValue($config['plus_one'] ?? '') ?></td></tr>
                <tr><th>Phone Number Required</th><td><?= formatConfigValue($config['phone_required'] ?? '') ?></td></tr>
                <tr><th>Custom Questions</th><td><?= formatConfigValue($config['custom_questions'] ?? '') ?></td></tr>
                <tr><th>Expected Attendees</th><td><?= formatConfigValue($config['expected_attendees'] ?? '') ?></td></tr>

                <tr class="section-header">
                    <td colspan="2">⚙️ CMS & TECHNICAL SETUP</td>
                </tr>
                <tr><th>GitHub Username</th><td><?= formatConfigValue($config['github_username'] ?? '') ?></td></tr>
                <tr><th>Repository Name</th><td><?= formatConfigValue($config['repository_name'] ?? '') ?></td></tr>
                <tr><th>Repository Visibility</th><td><?= formatConfigValue($config['repository_visibility'] ?? '') ?></td></tr>
                <tr><th>CMS Editors</th><td><?= formatConfigValue($config['cms_editors'] ?? '') ?></td></tr>
                <tr><th>Branch Protection</th><td><?= formatConfigValue($config['branch_protection'] ?? '') ?></td></tr>

                <tr class="section-header">
                    <td colspan="2">🚀 DEPLOYMENT & NOTIFICATIONS</td>
                </tr>
                <tr><th>Spam Protection</th><td><?= formatConfigValue($config['spam_protection'] ?? '') ?></td></tr>
                <tr><th>Custom Domain</th><td><?= formatConfigValue($config['custom_domain'] ?? '') ?></td></tr>
                <tr><th>Notification Email</th><td><?= formatConfigValue($config['notification_email'] ?? '') ?></td></tr>
                <tr><th>Additional Notifications</th><td><?= formatConfigValue($config['additional_notifications'] ?? '') ?></td></tr>
                <tr><th>SEO Page Title</th><td><?= formatConfigValue($config['seo_title'] ?? '') ?></td></tr>

                <tr class="section-header">
                    <td colspan="2">🌟 ADVANCED FEATURES</td>
                </tr>
                <tr><th>Countdown Timer</th><td><?= formatConfigValue($config['countdown_timer'] ?? '') ?></td></tr>
                <tr><th>Social Sharing</th><td><?= formatConfigValue($config['social_sharing'] ?? '') ?></td></tr>
                <tr><th>Photo Gallery</th><td><?= formatConfigValue($config['photo_gallery'] ?? '') ?></td></tr>
                <?php if ($config['photo_gallery'] === 'yes' && !empty($config['gallery_photos'])): ?>
                <tr><th>Gallery Photos Count</th><td><?= formatConfigValue($config['gallery_photos']) ?></td></tr>
                <?php endif; ?>
                <tr><th>External Links</th><td><?= formatConfigValue($config['external_links'] ?? '') ?></td></tr>
                <tr><th>Analytics</th><td><?= formatConfigValue($config['analytics'] ?? '') ?></td></tr>
                <tr><th>Multilingual</th><td><?= formatConfigValue($config['multilingual'] ?? '') ?></td></tr>
                <?php if ($config['multilingual'] === 'yes' && !empty($config['additional_languages'])): ?>
                <tr><th>Additional Languages</th><td><?= formatConfigValue($config['additional_languages']) ?></td></tr>
                <?php endif; ?>

                <tr class="section-header">
                    <td colspan="2">✅ FINAL VERIFICATION</td>
                </tr>
                <tr><th>Event Summary</th><td><?= formatConfigValue($config['event_summary'] ?? '') ?></td></tr>
                <tr><th>Technical Requirements Confirmed</th><td><?= formatConfigValue($config['technical_confirmed'] ?? '') ?></td></tr>
                <tr><th>Ready for Development</th><td><?= formatConfigValue($config['ready_for_development'] ?? '') ?></td></tr>
            </table>

            <div class="no-print" style="text-align: center; margin-top: 40px;">
                <a href="success.php" class="btn-secondary">← Back to Success Page</a>
                <a href="index.php" class="btn-secondary">Create New Configuration</a>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">📅 Configuration Generated</h3>
                <p><strong>Date:</strong> <?= date('F j, Y \a\t g:i A') ?></p>
                <p><strong>File:</strong> event-rsvp-config-<?= date('Y-m-d-H-i-s') ?>.json</p>
            </div>
        </div>
    </div>
</body>
</html>
