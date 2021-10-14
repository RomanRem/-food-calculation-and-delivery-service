<?php
$_POST = json_decode(file_get_contents("php://input"),true); //без этой штуки пхп не будет работать с json
echo var_dump($_POST);