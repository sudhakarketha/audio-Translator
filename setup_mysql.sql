CREATE DATABASE IF NOT EXISTS audio_translator_db;
USE audio_translator_db;

CREATE TABLE IF NOT EXISTS transcriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_name VARCHAR(255),
    transcription TEXT
); 