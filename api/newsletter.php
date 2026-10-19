<?php
declare(strict_types=1);

// Handle CORS
$allowed_origins = [
    'https://waddatdrinks.com',
    'https://www.waddatdrinks.com',
    'https://waddatbeverageltd.com',
    'https://www.waddatbeverageltd.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true) || preg_match('/^https?:\/\/(.+\.)?waddat(drinks|beverageltd)\.com$/', $origin)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Ensure POST method only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

// Read raw JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    // Fallback if submitted via standard form POST
    $data = $_POST;
}

// Extract and normalize fields
$name = trim((string)($data['name'] ?? $data['Name'] ?? ''));
$email = trim((string)($data['email'] ?? $data['Email'] ?? ''));

// Validate all required fields are present
if ($name === '' || $email === '') {
    http_response_code(400);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Both Name and Email are required.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

// Server-side Web3Forms configuration (never exposed to client)
$accessKey = '39a22fee-235b-4cdf-b13e-b1cfb18175ff';
$subject = 'New Newsletter Signup: ' . $name;

// Prepare payload for Web3Forms
$payload = array_merge($data, [
    'access_key' => $accessKey,
    'subject' => $subject,
    'name' => $name,
    'email' => $email,
    'from_name' => 'Waddat Drinks Newsletter Signup'
]);

// Forward the submission to https://api.web3Forms.com/submit using cURL
$ch = curl_init('https://api.web3forms.com/submit');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json'
    ],
    CURLOPT_TIMEOUT => 20,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

$decodedResponse = json_decode((string)$response, true);
$web3Success = ($httpCode === 200 && is_array($decodedResponse) && !empty($decodedResponse['success']));

header('Content-Type: application/json; charset=UTF-8');

if ($web3Success) {
    http_response_code(200);
    echo $response;
    exit;
}

// Fallback: If Web3Forms restricts server-to-server calls or errors, send email via PHP mail()
$to = 'hello@waddat.com';
$mailSubject = $subject;
$mailHeaders = [
    'From: Waddat Website <no-reply@waddatdrinks.com>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];
$mailBody = "New Newsletter Signup from Waddat Website:\n\n"
    . "Name: " . $name . "\n"
    . "Email: " . $email . "\n\n"
    . "--\nSubmitted on " . date('Y-m-d H:i:s') . " UTC via waddatdrinks.com";

@mail($to, $mailSubject, $mailBody, implode("\r\n", $mailHeaders));

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'You’re in! Watch out for new flavours and promos.'
]);
exit;
