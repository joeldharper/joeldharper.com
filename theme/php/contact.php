<?php

/*! ===================================
 *  Author: BBDesign & WPHunters
 *  -----------------------------------
 *  Email(support):
 * 	bbdesign_sp@yahoo.com
 *  ===================================
 */

// YOUR EMAIL
// ==========
$email = 'user@example.com'; // script will send all messages to this address
$from  = 'mailer@yoursite.com';

// DO NOT EDIT CHANGE ANYTHING BELOW THIS LINE
// ===========================================

if(!isset($_POST['fullname'], $_POST['email'], $_POST['message'])) {
    show_error('Some fields are empty.');
}

// validate name
$nameField = clear_field($_POST['fullname'], null);
$nameField_len = mb_strlen($nameField, 'utf-8');
if($nameField_len < 6) {
    show_error('"Name" field is too short.');
} else if($nameField_len >= 300) {
    show_error('"Name" field is too big. Maximum length is 150 characters.');
}

// validate email
$emailField = clear_field($_POST['email'], null);
$emailField_len = mb_strlen($emailField, 'utf-8');
if($nameField_len >= 300) {
    show_error('"Email" field is too big. Maximum length is 150 characters.');
} else if(!validate_email($emailField)) {
    show_error('"Email" field is invalid.');
}

// validate message
$msgField = clear_field($_POST['message']);
$msgField_len = mb_strlen($msgField, 'utf-8');
if($msgField_len < 30) {
    show_error('"Subject" field is too short.');
} else if($msgField_len >= 6000) {
    show_error('"Subject" field is too big. Maximum length is 3000 characters.');
}

// COMPOSE MESSAGE
// ==================
$messageBody = <<<HTML
<html>
    <body>
        <strong>From:</strong> {$nameField}<br/>
        <strong>Email:</strong> {$emailField}<br/>
        <hr/>
        {$msgField}
    </body>
</html>
HTML;
$messageTitle = '[Contact Form] Message from site';
$headers  = "From: {$from}\r\n";
$headers .= "Content-type: text/html\r\n";

// now lets send the email.
mail($email, $messageTitle, $messageBody, $headers);
die('Message has been sent!');

// FUNCTIONS
// =========
function show_error($text) {
    header('HTTP/1.1 400 Bad Request');
    die($text);
}

function clear_field($value, $allowed_tags = '<b><i><u><a>') {
    $value = strip_tags($value, $allowed_tags);
    $value = trim(preg_replace('/\s+/u', ' ', $value));
    return $value;
}

// based on a regex by Michael Rushton
function validate_email($value) {
    $pattern = '/^(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){255,})(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){65,}@)(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22))(?:\\.(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-+[a-z0-9]+)*)|(?:\\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\\]))$/iD';

    return preg_match($pattern, $value);
}