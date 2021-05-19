<?php
header('Access-Control-Allow-Origin: *');
$data = [
    1 => [
        'articleId' => "0001",
        'name' => 'Macbook Pro',
        'image' => 'https://cdn.pixabay.com/photo/2014/09/24/14/29/macbook-459196_960_720.jpg',
        'price' => 1500,
        'description' => ''
    ],
    2 => [
        'articleId' => "0002",
        'name' => 'Smartphone',
        'image' => 'https://cdn.pixabay.com/photo/2014/08/05/10/30/iphone-410324_960_720.jpg',
        'price' => 500,
        'description' => ''
    ],
    3 => [
        'articleId' => "0003",
        'name' => 'Set perifericos',
        'image' => 'https://cdn.pixabay.com/photo/2017/05/11/11/15/workplace-2303851_960_720.jpg',
        'price' => 350,
        'description' => ''
    ],
    4 => [
        'articleId' => "0004",
        'name' => 'iMac 24"',
        'image' => 'https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_960_720.jpg',
        'price' => 1350,
        'description' => ''
    ]
];

$articleId =  $_GET['articleId'] ?? null;

if ($articleId === null || false === isset($data[$articleId])) {
    http_response_code(404);
} else {
    header('Content-Type: application/json');
    echo json_encode($data[$articleId]);
}