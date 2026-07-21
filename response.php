<?php
// ============================================================
// response.php
// URL de respuesta configurada en Payphone Developer.
// Payphone redirige aquí después del pago con: ?id=...&clientTransactionId=...
// ============================================================

// 1. Capturar parámetros de la URL de respuesta
$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
$clientTxId = isset($_GET["clientTransactionId"]) ? $_GET["clientTransactionId"] : "";

// 2. Credenciales: se leen de una variable de entorno, NUNCA se escriben aquí.
//    En Docker se inyecta con: docker run -e PAYPHONE_TOKEN="tu-token" ...
$token = getenv('PAYPHONE_TOKEN');
if (!$token) {
    echo "<h2>Error de configuración</h2><p>Falta la variable de entorno PAYPHONE_TOKEN.</p>";
    exit;
}

// Si no llegaron los parámetros, no se puede confirmar nada
if ($id === 0 || $clientTxId === "") {
    echo "<h2>No se recibieron los parámetros de la transacción</h2>";
    echo "<p>El pago pudo haber sido cancelado.</p>";
    exit;
}

// 3. Cabeceras de la solicitud
$headers = [
    "Authorization: Bearer " . $token,
    "Content-Type: application/json"
];

// 4. Cuerpo JSON exigido por el API de confirmación de la Cajita
$data = ["id" => $id, "clientTxId" => $clientTxId];
$json = json_encode($data);

// 5. Solicitud POST servidor-servidor al API de confirmación
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL,
    "https://paymentbox.payphonetodoesposible.com/api/confirm");
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($curl);
curl_close($curl);

// 6. Procesar la respuesta del API
$result = json_decode($response, true);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmación de pago - Closet Urbano</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root{ --cream:#F8F3EC; --ink:#231F20; --rose:#A8233F; --line:#E7DBC9; }
        body { font-family:'Inter',sans-serif; max-width: 480px; margin: 60px auto; padding: 0 20px; color: var(--ink); background:var(--cream); }
        h2 { font-family:'Fraunces',serif; font-size: 26px; color: <?php echo ($result["transactionStatus"] ?? "") === "Approved" ? "#2e7d32" : "#A8233F"; ?>; }
        p { font-size: 14.5px; }
        pre { background: #fff; border:1px solid var(--line); padding: 14px; border-radius: 10px; font-size: 12.5px; overflow-x: auto; }
        a { display: inline-block; margin-top: 18px; color: var(--rose); text-decoration: none; font-weight:600; font-size:14px; }
    </style>
</head>
<body>
<?php
if (($result["transactionStatus"] ?? "") === "Approved") {
    echo "<h2>✅ Pago Aprobado</h2>";
    echo "<p><strong>ID Transacción:</strong> " . $result["transactionId"] . "</p>";
    echo "<p><strong>Autorización:</strong> " . $result["authorizationCode"] . "</p>";
    echo "<p><strong>Monto:</strong> $" . number_format($result["amount"] / 100, 2) . " " . $result["currency"] . "</p>";
    echo "<p><strong>Tarjeta:</strong> " . ($result["cardBrand"] ?? "") . " **** " . ($result["lastDigits"] ?? "") . "</p>";
} else {
    echo "<h2>❌ Pago No Aprobado</h2>";
    echo "<p>Estado: " . ($result["transactionStatus"] ?? "Desconocido") . "</p>";
}
?>
    <h3>Respuesta completa del API:</h3>
    <pre><?php echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE); ?></pre>

    <a href="index.html">← Volver a la tienda</a>
</body>
</html>
