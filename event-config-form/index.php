<?php
session_start();

// Handle form submission
if ($_POST) {
    $config = $_POST;
    
    // Save to JSON file
    $json_data = json_encode($config, JSON_PRETTY_PRINT);
    file_put_contents('saved_configs/config_' . date('Y-m-d_H-i-s') . '.json', $json_data);
    
    // Also save as latest config
    file_put_contents('saved_configs/latest_config.json', $json_data);
    
    $_SESSION['success'] = "Configuration saved successfully!";
    header("Location: success.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event RSVP Website Configuration</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🎉 Event RSVP Website Configuration</h1>
            <p>Complete this form to configure your custom event RSVP website with CMS integration</p>
        </header>

        <form method="POST" action="" class="config-form" id="configForm">
            
            <!-- EVENT DETAILS SECTION -->
            <section class="form-section">
                <h2>📅 Event Details</h2>
                
                <div class="form-group">
                    <label for="event_type">1. Event Type*</label>
                    <select name="event_type" id="event_type" required>
                        <option value="">Select event type...</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="BBQ">BBQ</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="event_name">2. Event Name/Title*</label>
                    <input type="text" name="event_name" id="event_name" placeholder="e.g., Sarah & John's Wedding" required>
                    <small>Exactly as you want it displayed on the website</small>
                </div>

                <div class="form-group">
                    <label for="event_date">3. Event Date*</label>
                    <input type="date" name="event_date" id="event_date" required>
                </div>

                <div class="form-group">
                    <label for="event_time">4. Event Time*</label>
                    <input type="text" name="event_time" id="event_time" placeholder="e.g., 6:00 PM - 11:00 PM" required>
                </div>

                <div class="form-group">
                    <label for="event_location">5. Event Location*</label>
                    <textarea name="event_location" id="event_location" placeholder="Full address or venue name" required></textarea>
                </div>

                <div class="form-group">
                    <label for="google_maps">6. Google Maps Integration</label>
                    <select name="google_maps" id="google_maps">
                        <option value="yes">Yes - Include Google Maps</option>
                        <option value="no">No - Text only</option>
                    </select>
                    <input type="text" name="maps_address" id="maps_address" placeholder="Address for Google Maps (if different from above)">
                </div>
            </section>

            <!-- CONTENT & MESSAGING SECTION -->
            <section class="form-section">
                <h2>✍️ Content & Messaging</h2>
                
                <div class="form-group">
                    <label for="host_names">7. Host Names*</label>
                    <input type="text" name="host_names" id="host_names" placeholder="e.g., Sarah Smith & John Doe" required>
                </div>

                <div class="form-group">
                    <label for="invitation_tone">8. Invitation Tone*</label>
                    <select name="invitation_tone" id="invitation_tone" required>
                        <option value="">Select tone...</option>
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                        <option value="fun">Fun</option>
                        <option value="elegant">Elegant</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="welcome_message">9. Welcome Message*</label>
                    <textarea name="welcome_message" id="welcome_message" placeholder="2-3 sentences for the main page welcome" required></textarea>
                </div>

                <div class="form-group">
                    <label for="event_description">10. Event Description*</label>
                    <textarea name="event_description" id="event_description" placeholder="Activities, food, dress code expectations..." required></textarea>
                </div>

                <div class="form-group">
                    <label for="gift_information">11. Gift Information</label>
                    <textarea name="gift_information" id="gift_information" placeholder="Registry details, cash gifts, or no gifts policy"></textarea>
                </div>

                <div class="form-group">
                    <label for="rsvp_deadline">12. RSVP Deadline*</label>
                    <input type="date" name="rsvp_deadline" id="rsvp_deadline" required>
                </div>

                <div class="form-group">
                    <label for="special_instructions">13. Special Instructions</label>
                    <textarea name="special_instructions" id="special_instructions" placeholder="Parking, accessibility, items to bring..."></textarea>
                </div>
            </section>

            <!-- DESIGN & BRANDING SECTION -->
            <section class="form-section">
                <h2>🎨 Design & Branding</h2>
                
                <div class="form-group">
                    <label for="logo_available">14. Logo Availability</label>
                    <select name="logo_available" id="logo_available">
                        <option value="no">No - Create text-based logo</option>
                        <option value="yes">Yes - I have a logo</option>
                    </select>
                    <textarea name="logo_description" id="logo_description" placeholder="Describe your logo or desired style"></textarea>
                </div>

                <div class="form-group">
                    <label for="hero_media">15. Hero Media Preference</label>
                    <select name="hero_media" id="hero_media">
                        <option value="image">Image Background</option>
                        <option value="video">Video Background</option>
                        <option value="gradient">Gradient Background</option>
                    </select>
                    <textarea name="hero_description" id="hero_description" placeholder="Describe the style or mood you want"></textarea>
                </div>

                <div class="form-group">
                    <label for="favicon">16. Favicon</label>
                    <select name="favicon" id="favicon">
                        <option value="yes">Yes - Create favicon</option>
                        <option value="no">No - Use default</option>
                    </select>
                </div>

                <div class="form-group color-palette">
                    <label>17-19. Color Scheme</label>
                    <p>Choose a pre-designed palette or create custom colors:</p>
                    
                    <div class="palette-options">
                        <div class="palette-option">
                            <input type="radio" name="color_scheme" value="elegant_wedding" id="elegant_wedding">
                            <label for="elegant_wedding">
                                <div class="palette-preview">
                                    <span style="background-color: #F5E6E8;"></span>
                                    <span style="background-color: #FFF8DC;"></span>
                                    <span style="background-color: #2F4F2F;"></span>
                                </div>
                                Elegant Wedding
                            </label>
                        </div>
                        
                        <div class="palette-option">
                            <input type="radio" name="color_scheme" value="fun_birthday" id="fun_birthday">
                            <label for="fun_birthday">
                                <div class="palette-preview">
                                    <span style="background-color: #FF6B6B;"></span>
                                    <span style="background-color: #FFE66D;"></span>
                                    <span style="background-color: #4ECDC4;"></span>
                                </div>
                                Fun Birthday
                            </label>
                        </div>
                        
                        <div class="palette-option">
                            <input type="radio" name="color_scheme" value="professional_corporate" id="professional_corporate">
                            <label for="professional_corporate">
                                <div class="palette-preview">
                                    <span style="background-color: #2E86AB;"></span>
                                    <span style="background-color: #F8F9FA;"></span>
                                    <span style="background-color: #343A40;"></span>
                                </div>
                                Professional Corporate
                            </label>
                        </div>
                        
                        <div class="palette-option">
                            <input type="radio" name="color_scheme" value="casual_bbq" id="casual_bbq">
                            <label for="casual_bbq">
                                <div class="palette-preview">
                                    <span style="background-color: #D2691E;"></span>
                                    <span style="background-color: #F5F5DC;"></span>
                                    <span style="background-color: #8B4513;"></span>
                                </div>
                                Casual BBQ
                            </label>
                        </div>
                        
                        <div class="palette-option">
                            <input type="radio" name="color_scheme" value="baby_shower" id="baby_shower">
                            <label for="baby_shower">
                                <div class="palette-preview">
                                    <span style="background-color: #B8E6B8;"></span>
                                    <span style="background-color: #B6D7FF;"></span>
                                    <span style="background-color: #E6E6FA;"></span>
                                </div>
                                Sweet Baby Shower
                            </label>
                        </div>
                        
                        <div class="palette-option">
                            <input type="radio" name="color_scheme" value="custom" id="custom">
                            <label for="custom">Custom Colors</label>
                        </div>
                    </div>
                    
                    <div id="custom-colors" style="display: none;">
                        <div class="form-group">
                            <label for="primary_color">Primary Color (Hex)</label>
                            <input type="color" name="primary_color" id="primary_color">
                            <input type="text" name="primary_color_hex" placeholder="#FF6B6B">
                        </div>
                        <div class="form-group">
                            <label for="secondary_color">Secondary Color (Hex)</label>
                            <input type="color" name="secondary_color" id="secondary_color">
                            <input type="text" name="secondary_color_hex" placeholder="#FFE66D">
                        </div>
                        <div class="form-group">
                            <label for="text_color">Text Color (Hex)</label>
                            <input type="color" name="text_color" id="text_color">
                            <input type="text" name="text_color_hex" placeholder="#333333">
                        </div>
                    </div>
                </div>
            </section>

            <!-- FORM & FUNCTIONALITY SECTION -->
            <section class="form-section">
                <h2>📝 Form & Functionality</h2>
                
                <div class="form-group">
                    <label for="dietary_restrictions">20. Dietary Restrictions Field</label>
                    <select name="dietary_restrictions" id="dietary_restrictions">
                        <option value="yes">Yes - Include dietary restrictions</option>
                        <option value="no">No - Skip this field</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="plus_one">21. Plus-One Guests Allowed</label>
                    <select name="plus_one" id="plus_one">
                        <option value="yes">Yes - Allow plus-one guests</option>
                        <option value="no">No - Individual RSVPs only</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="phone_required">22. Phone Number Required</label>
                    <select name="phone_required" id="phone_required">
                        <option value="yes">Yes - Require phone number</option>
                        <option value="no">No - Optional phone number</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="custom_questions">23. Custom Form Questions</label>
                    <textarea name="custom_questions" id="custom_questions" placeholder="List any additional questions (one per line)"></textarea>
                </div>

                <div class="form-group">
                    <label for="expected_attendees">24. Expected Attendee Count</label>
                    <input type="number" name="expected_attendees" id="expected_attendees" placeholder="50">
                </div>
            </section>

            <!-- CMS & TECHNICAL SETUP SECTION -->
            <section class="form-section">
                <h2>⚙️ CMS & Technical Setup</h2>
                
                <div class="form-group">
                    <label for="github_username">25. GitHub Username*</label>
                    <input type="text" name="github_username" id="github_username" placeholder="your-github-username" required>
                </div>

                <div class="form-group">
                    <label for="repository_name">26. Repository Name</label>
                    <input type="text" name="repository_name" id="repository_name" placeholder="event-name-rsvp-website">
                </div>

                <div class="form-group">
                    <label for="repository_visibility">27. Repository Visibility</label>
                    <select name="repository_visibility" id="repository_visibility">
                        <option value="public">Public (Recommended for free Netlify)</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="cms_editors">28. CMS Editor Access</label>
                    <input type="text" name="cms_editors" id="cms_editors" placeholder="github-username1, github-username2">
                    <small>GitHub usernames who can edit content (comma separated)</small>
                </div>

                <div class="form-group">
                    <label for="branch_protection">29. Branch Protection</label>
                    <select name="branch_protection" id="branch_protection">
                        <option value="no">No - Allow direct edits</option>
                        <option value="yes">Yes - Require pull requests</option>
                    </select>
                </div>
            </section>

            <!-- DEPLOYMENT & NOTIFICATIONS SECTION -->
            <section class="form-section">
                <h2>🚀 Deployment & Notifications</h2>
                
                <div class="form-group">
                    <label for="spam_protection">30. Spam Protection</label>
                    <select name="spam_protection" id="spam_protection">
                        <option value="yes">Yes - Enable reCAPTCHA (Recommended)</option>
                        <option value="no">No - Basic protection only</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="custom_domain">31. Custom Domain</label>
                    <input type="text" name="custom_domain" id="custom_domain" placeholder="your-domain.com (optional)">
                    <small>Leave empty to use Netlify subdomain</small>
                </div>

                <div class="form-group">
                    <label for="notification_email">32. Notification Email*</label>
                    <input type="email" name="notification_email" id="notification_email" placeholder="your-email@example.com" required>
                    <small>Where to send RSVP submissions</small>
                </div>

                <div class="form-group">
                    <label for="additional_notifications">33. Additional Notifications</label>
                    <input type="text" name="additional_notifications" id="additional_notifications" placeholder="Slack webhook URL (optional)">
                </div>

                <div class="form-group">
                    <label for="seo_title">34. SEO Page Title*</label>
                    <input type="text" name="seo_title" id="seo_title" placeholder="How the site appears in search results" required>
                </div>
            </section>

            <!-- ADVANCED FEATURES SECTION -->
            <section class="form-section">
                <h2>🌟 Advanced Features</h2>
                
                <div class="form-group">
                    <label for="countdown_timer">35. Countdown Timer</label>
                    <select name="countdown_timer" id="countdown_timer">
                        <option value="yes">Yes - Show countdown to event</option>
                        <option value="no">No - Skip countdown</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="social_sharing">36. Social Sharing</label>
                    <select name="social_sharing" id="social_sharing">
                        <option value="yes">Yes - Include Facebook/Twitter share buttons</option>
                        <option value="no">No - Skip social sharing</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="photo_gallery">37. Photo Gallery</label>
                    <select name="photo_gallery" id="photo_gallery">
                        <option value="no">No - Skip photo gallery</option>
                        <option value="yes">Yes - Include photo gallery</option>
                    </select>
                    <input type="number" name="gallery_photos" id="gallery_photos" placeholder="Number of photos" min="1" max="20">
                </div>

                <div class="form-group">
                    <label for="external_links">38. External Links</label>
                    <textarea name="external_links" id="external_links" placeholder="Registry, social media, other websites (one per line)"></textarea>
                </div>

                <div class="form-group">
                    <label for="analytics">39. Analytics</label>
                    <input type="text" name="analytics" id="analytics" placeholder="Google Analytics tracking ID (optional)">
                </div>

                <div class="form-group">
                    <label for="multilingual">40. Multilingual</label>
                    <select name="multilingual" id="multilingual">
                        <option value="no">No - English only</option>
                        <option value="yes">Yes - Additional languages needed</option>
                    </select>
                    <input type="text" name="additional_languages" id="additional_languages" placeholder="Spanish, French, etc.">
                </div>
            </section>

            <!-- FINAL VERIFICATION SECTION -->
            <section class="form-section">
                <h2>✅ Final Verification</h2>
                
                <div class="form-group">
                    <label for="event_summary">41. Complete Event Summary</label>
                    <textarea name="event_summary" id="event_summary" placeholder="Confirm: [EVENT_NAME] on [DATE] at [TIME] hosted by [HOSTS]" readonly></textarea>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" name="technical_confirmed" value="yes" required>
                        42. I understand this includes CMS, GitHub integration, and requires user testing
                    </label>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" name="ready_for_development" value="yes" required>
                        43. I'm ready to begin development with these specifications
                    </label>
                </div>
            </section>

            <div class="form-actions">
                <button type="submit" class="btn-primary">💾 Save Configuration & Generate Files</button>
                <button type="button" class="btn-secondary" onclick="previewSummary()">👀 Preview Summary</button>
            </div>
        </form>
    </div>

    <script src="script.js"></script>
</body>
</html>
