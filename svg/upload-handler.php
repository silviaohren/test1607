<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $docsDir = __DIR__ . '/data/docs/';
    if (!is_dir($docsDir)) {
        mkdir($docsDir, 0755, true);
    }

    // CAMBIA INFO SITO HANDLING (unchanged)
    if (isset($_POST['bio-text'])) {
        file_put_contents($docsDir . 'bio.txt', $_POST['bio-text']);
    }
    if (isset($_FILES['bio-pic']) && $_FILES['bio-pic']['error'] === UPLOAD_ERR_OK) {
        move_uploaded_file($_FILES['bio-pic']['tmp_name'], $docsDir . 'bio-pic.jpg');
    }
    if (isset($_FILES['cv-upload']) && $_FILES['cv-upload']['error'] === UPLOAD_ERR_OK) {
        move_uploaded_file($_FILES['cv-upload']['tmp_name'], $docsDir . 'cv.pdf');
    }
    if (isset($_FILES['privacy-upload']) && $_FILES['privacy-upload']['error'] === UPLOAD_ERR_OK) {
        move_uploaded_file($_FILES['privacy-upload']['tmp_name'], $docsDir . 'privacy.pdf');
    }
    if (isset($_POST['contact-email']) && filter_var($_POST['contact-email'], FILTER_VALIDATE_EMAIL)) {
        file_put_contents(__DIR__ . '/data/docs/contact-email.txt', $_POST['contact-email']);
    }
    if (isset($_FILES['favicon-upload']) && $_FILES['favicon-upload']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['favicon-upload']['name'], PATHINFO_EXTENSION));
        $allowed = ['ico', 'png', 'svg'];
        if (in_array($ext, $allowed)) {
            $target = __DIR__ . '/favicon.' . $ext;
            move_uploaded_file($_FILES['favicon-upload']['tmp_name'], $target);
        }
    }

    // PROJECT UPLOADS (FILM, DOCUMENTARY, COMMERCIAL, LIBRARIES)
    $categories = [
        'film' => 'data/film',
        'documentary' => 'data/documentary',
        'commercial' => 'data/commercial',
        'libraries' => 'data/libraries'
    ];
    if (isset($_POST['category']) && isset($categories[$_POST['category']])) {
        $cat = $categories[$_POST['category']];
        $catDir = __DIR__ . '/' . $cat . '/';
        if (!is_dir($catDir)) {
            mkdir($catDir, 0755, true);
        }
        // Get title and year for filename
        $title = isset($_POST['title']) ? $_POST['title'] : 'untitled';
        $year = isset($_POST['year']) ? $_POST['year'] : date('Y');
        $safeTitle = preg_replace('/[^a-zA-Z0-9_-]/', '_', strtolower($title));
        $filenameBase = $safeTitle . '-' . $year;
        // Save poster(s)
        foreach ($_FILES as $key => $file) {
            if (strpos($key, 'poster') !== false && $file['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $posterTarget = $catDir . 'poster-' . $filenameBase . '.' . $ext;
                move_uploaded_file($file['tmp_name'], $posterTarget);
            }
        }
        // Save info as JSON
        $info = $_POST;
        unset($info['category']); // Don't include category in info
        $jsonFile = $catDir . 'info-' . $filenameBase . '.json';
        file_put_contents($jsonFile, json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    // Redirect or show success message
    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        header('Location: upload-success.html');
        exit;
    } else {
        http_response_code(200);
        exit;
    }
}
?> 