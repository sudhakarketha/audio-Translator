# Audio Translator

This project extracts audio from a video file, transcribes the audio to text, and stores the transcription in a MySQL database.

## Setup

### 1. MySQL Database

1. Start your MySQL server.
2. Run the `setup_mysql.sql` script in your MySQL client:
   ```sql
   SOURCE setup_mysql.sql;
   ```
3. Create a MySQL user and grant access if needed.

### 2. Python Environment

1. Install Python 3.x
2. Install required packages:
   ```sh
   pip install -r requirements.txt
   ```
3. Install [ffmpeg](https://ffmpeg.org/download.html) and add it to your system PATH (required by moviepy).

## Usage

1. Update the database credentials in `audio_translator.py` (look for `db_config`).
2. Run the script:
   ```sh
   python audio_translator.py
   ```
3. Enter the path to your video file when prompted.

## Notes
- The script uses Google Speech Recognition API (internet required, limited usage).
- For large files or production, consider a paid or local speech-to-text engine. 