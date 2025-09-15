<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuration Saved Successfully</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
            <h1>✅ Configuration Saved Successfully!</h1>
            <p>Your event RSVP website configuration has been generated</p>
        </header>

        <div style="padding: 40px 30px; text-align: center;">
            <?php if (isset($_SESSION['success'])): ?>
                <div class="success-message" style="margin-bottom: 30px;">
                    <?php echo $_SESSION['success']; unset($_SESSION['success']); ?>
                </div>
            <?php endif; ?>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 30px 0;">
                <h2 style="color: #28a745; margin-bottom: 20px;">🎯 Next Steps</h2>
                
                <div style="text-align: left; max-width: 600px; margin: 0 auto;">
                    <h3 style="color: #667eea; margin-bottom: 15px;">Phase 1: Review Your Configuration</h3>
                    <ol style="margin-bottom: 25px;">
                        <li>Download your configuration file below</li>
                        <li>Review all settings for accuracy</li>
                        <li>Make note of your GitHub username and repository name</li>
                    </ol>

                    <h3 style="color: #667eea; margin-bottom: 15px;">Phase 2: Website Generation</h3>
                    <ol style="margin-bottom: 25px;">
                        <li>Provide this configuration to your developer</li>
                        <li>They will generate all website files</li>
                        <li>Complete project structure will be created</li>
                    </ol>

                    <h3 style="color: #667eea; margin-bottom: 15px;">Phase 3: Deployment & Testing</h3>
                    <ol style="margin-bottom: 25px;">
                        <li>GitHub repository will be created</li>
                        <li>Netlify deployment will be configured</li>
                        <li>You'll test the live website thoroughly</li>
                        <li>Any bugs will be fixed promptly</li>
                    </ol>
                </div>
            </div>

            <div style="margin: 30px 0;">
                <a href="download.php" class="btn-primary" style="margin: 10px;">
                    📥 Download Configuration File
                </a>
                <a href="view-config.php" class="btn-secondary" style="margin: 10px;">
                    👀 View Configuration Details
                </a>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #1976d2; margin-bottom: 15px;">📋 Important Notes</h3>
                <ul style="text-align: left; max-width: 500px; margin: 0 auto;">
                    <li><strong>GitHub Account:</strong> Ensure your GitHub account is accessible</li>
                    <li><strong>Email Access:</strong> Check the notification email you provided</li>
                    <li><strong>Testing:</strong> Plan time for thorough website testing</li>
                    <li><strong>Timeline:</strong> Full deployment typically takes 2-3 hours</li>
                </ul>
            </div>

            <div style="margin-top: 40px;">
                <a href="index.php" class="btn-secondary">
                    ← Create Another Configuration
                </a>
            </div>
        </div>
    </div>

    <script>
        // Auto-scroll to show success message
        document.addEventListener('DOMContentLoaded', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    </script>
</body>
</html>
