<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

// Get the API Key from environment variables
$apiKey = getenv('GEMINI_API_KEY');
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API key is not configured on the server.']);
    exit();
}

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON in request body']);
    exit();
}

// Extract model and prompt from the request
$model = $data['model'] ?? 'gemini-2.5-flash'; // Default model
$prompt = $data['prompt'] ?? null;
$generationConfig = $data['generationConfig'] ?? null;

if (!$prompt) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt is missing from the request body']);
    exit();
}

// Construct the payload for the Google Generative AI API
$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ]
];

if ($generationConfig) {
    $payload['generationConfig'] = $generationConfig;
}

// Determine the correct API URL based on the model
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
if (strpos($model, 'imagen') !== false) {
     $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateImage?key={$apiKey}";
}


// Initialize cURL session
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// Execute the cURL request
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

curl_close($ch);

// Handle cURL errors
if ($curl_error) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $curl_error]);
    exit();
}

// Forward the HTTP status code and response from the Gemini API
http_response_code($httpcode);
echo $response;

?>