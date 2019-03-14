<?php

$m = isset($_GET["m"]) ? $_GET["m"] : null;

$input = json_decode(file_get_contents('php://input'), true);

if($m === "compiler") {
    $data = [
        "language" => "cpp",
        "language_v" => "default",
        "input" => $input["input"],
        "code" => $input["code"],
        "client" => "web"
    ];

    $payload = json_encode($data);

    $ch = curl_init("https://compiler.run/api/run");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLINFO_HEADER_OUT, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

    // Set HTTP Header for POST request 
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    ]);

    $result = curl_exec($ch);
    header("Content-Type: application/json");
    echo $result;

    // var_dump($result);
    // var_dump(curl_error($ch));

    curl_close($ch);    
}