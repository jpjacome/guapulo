<?php
// Get the latest configuration file
$configFile = 'saved_configs/latest_config.json';

if (!file_exists($configFile)) {
    header("Location: index.php");
    exit();
}

$config = json_decode(file_get_contents($configFile), true);

// Prepare download headers
header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="event-rsvp-config-' . date('Y-m-d-H-i-s') . '.json"');
header('Content-Length: ' . filesize($configFile));

// Output the file
readfile($configFile);
exit();
?>
