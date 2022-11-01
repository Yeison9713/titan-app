<?php

header('Access-Control-Allow-Origin: *');
$curl = curl_init();

$_DLL = $_POST['url'];
$_PARAMS = json_decode($_POST['data'], true);

curl_setopt_array($curl, [
    CURLOPT_URL => $_DLL,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $_PARAMS,
    CURLOPT_HTTPHEADER => [],
    CURLOPT_FAILONERROR => true,
]);

$response = curl_exec($curl);

if (curl_errno($curl)) {
    $error_msg = curl_error($curl);
    print_r(
        json_encode(
            [
                'status' => '-1',
                'message' => $error_msg,
            ],
            true
        )
    );
} else {
    echo $response;
}

curl_close($curl);
