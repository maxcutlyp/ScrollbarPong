<!DOCTYPE html>
<html>
<head>
    <title id='title'>Scrollbar Pong</title>
    <script src="./main.js"></script>
    <link rel="stylesheet" type="text/css" href="./style.css"/>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200&display=swap" rel="stylesheet">
</head>
<body>
    <div id='size'>
    </div>
    <div id='screen'>
        <svg id='halfway'>
            <line stroke-dasharray='20, 20' x1=0 y1=100% x2=100% y2=0 style='stroke: #fff; stroke-width: 5;'/>
        </svg>
        <div id='scorediv'>
            <h1>Score: <span id='score'>0</span></h1>
            <h1>Highscore: <span id='highscore'><?php echo($_COOKIE['highscore'] ?: '0') ?></span></h1>
        </div>
    </div>
</body>
</html>