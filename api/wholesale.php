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
$businessName = trim((string)($data['business_name'] ?? $data['businessName'] ?? $data['Business Name'] ?? $data['name'] ?? ''));
$email = trim((string)($data['email'] ?? $data['Email'] ?? ''));
$message = trim((string)($data['message'] ?? $data['Message'] ?? ''));

// Validate all required fields are present
if ($businessName === '' || $email === '' || $message === '') {
    http_response_code(400);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'All fields (Business Name, Email, and Message) are required.'
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
$accessKey = '9e75e3c3-e0ff-475b-9d68-67e621ced028';
$subject = 'New Wholesale Enquiry: ' . $businessName;

// Prepare payload for Web3Forms
$payload = array_merge($data, [
    'access_key' => $accessKey,
    'subject' => $subject,
    'business_name' => $businessName,
    'name' => $businessName,
    'email' => $email,
    'message' => $message,
    'from_name' => 'Waddat Drinks Wholesale Enquiry'
]);

// Forward the submission to https://api.web3forms.com/submit using cURL
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

header('Content-Type: application/json; charset=UTF-8');

if ($response === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Something went wrong. Please try again.',
        'error' => $curlError
    ]);
    exit;
}

http_response_code($httpCode > 0 ? $httpCode : 200);
echo $response;
exit;
