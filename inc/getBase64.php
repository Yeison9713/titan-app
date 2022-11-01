<?php

$nameFile = $_GET['file'];

function curl_get_contents($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}
function imageToBase64($image)
{
    $imageData = base64_encode(curl_get_contents($image));
    $mime_types = [
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'odt' => 'application/vnd.oasis.opendocument.text ',
        'docx' =>
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'gif' => 'image/gif',
        'jpg' => 'image/jpg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'bmp' => 'image/bmp',
    ];
    $ext = pathinfo($image, PATHINFO_EXTENSION);

    if (array_key_exists($ext, $mime_types)) {
        $a = $mime_types[$ext];
    }
    return 'data: ' . $a . ';base64,' . $imageData;
}

print_r(
    json_encode(
        [
            'status' => '0',
            'message' => imageToBase64(
                'https://server1ts.net/datos/image/clientes/' . $nameFile
            ),
        ],
        true
    )
);
