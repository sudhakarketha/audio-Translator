# import os
# from pydub import AudioSegment
# import speech_recognition as sr
# from typing import Any
# import pymysql
# from pathlib import Path
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import tempfile

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# def extract_audio(video_path: str, audio_path: str) -> None:
#     """Extract audio from video file using pydub"""
#     try:
#         # Convert video to audio
#         audio = AudioSegment.from_file(video_path)
#         audio.export(audio_path, format="wav")
#     except Exception as e:
#         print(f"Error extracting audio: {e}")
#         raise

# def transcribe_audio(audio_path: str) -> str:
#     """Transcribe audio to text using Google Speech Recognition"""
#     recognizer: Any = sr.Recognizer()
    
#     try:
#         with sr.AudioFile(audio_path) as source:
#             print("Analyzing audio file...")
#             # Adjust for ambient noise and record
#             recognizer.adjust_for_ambient_noise(source)
#             audio = recognizer.record(source)
            
#         print("Sending to Google Speech Recognition...")
#         # Explicitly specify language and show all recognition options
#         result = recognizer.recognize_google(
#             audio,
#             language="en-US",
#             show_all=False
#         )
#         if not result:
#             return "No speech detected in the audio"
#         return result
        
#     except sr.UnknownValueError:
#         return "Could not understand audio - speech unclear or no speech detected"
#     except sr.RequestError as e:
#         return f"Could not request results from Google Speech Recognition service; {str(e)}"
#     except Exception as e:
#         return f"An error occurred during transcription: {str(e)}"

# def get_db_connection():
#     """Get MySQL database connection"""
#     return pymysql.connect(
#         host='localhost',
#         user='root',
#         password='Suman@123',
#         database='audio_translator_db'
#     )

# def save_to_mysql(video_name: str, transcription: str) -> None:
#     """Save transcription to MySQL database"""
#     connection = get_db_connection()
#     try:
#         with connection.cursor() as cursor:
#             sql = "INSERT INTO transcriptions (video_name, transcription) VALUES (%s, %s)"
#             cursor.execute(sql, (video_name, transcription))
#             connection.commit()
#     finally:
#         connection.close()

# @app.route('/transcribe', methods=['POST'])
# def transcribe_video():
#     if 'video' not in request.files:
#         return jsonify({'success': False, 'error': 'No video file provided'}), 400
    
#     video_file = request.files['video']
#     if not video_file or not video_file.filename:
#         return jsonify({'success': False, 'error': 'No selected file'}), 400

#     try:
#         with tempfile.TemporaryDirectory() as temp_dir:
#             filename = secure_filename(video_file.filename or "uploaded_video")
#             video_path = os.path.join(temp_dir, filename)
#             video_file.save(video_path)
#             video_file.stream.close()

#             audio_path = os.path.join(temp_dir, 'temp_audio.wav')

#             print("Extracting audio...")
#             extract_audio(video_path, audio_path)

#             print("Transcribing audio...")
#             transcription = transcribe_audio(audio_path)

#             save_to_mysql(os.path.basename(video_path), transcription)

#             return jsonify({
#                 'success': True,
#                 'transcription': transcription
#             })
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# @app.route('/transcriptions', methods=['GET'])
# def get_transcriptions():
#     connection = get_db_connection()
#     try:
#         with connection.cursor() as cursor:
#             cursor.execute("SELECT * FROM transcriptions ORDER BY created_at DESC")
#             columns = [col[0] for col in cursor.description]
#             transcriptions = [
#                 dict(zip(columns, row))
#                 for row in cursor.fetchall()
#             ]
#             return jsonify(transcriptions)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
#     finally:
#         connection.close()

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)





import os
from pydub import AudioSegment
import speech_recognition as sr
from typing import Any
import pymysql
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

def extract_audio(video_path: str, audio_path: str) -> None:
    """Extract audio from video file using pydub"""
    try:
        audio = AudioSegment.from_file(video_path)
        audio.export(audio_path, format="wav")
    except Exception as e:
        print(f"Error extracting audio: {e}")
        raise

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio to text using Google Speech Recognition"""
    recognizer: Any = sr.Recognizer()
    
    try:
        with sr.AudioFile(audio_path) as source:
            print("Analyzing audio file...")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.record(source)
        
        print("Sending to Google Speech Recognition...")
        result = recognizer.recognize_google(
            audio,
            language="en-US",
            show_all=False
        )
        if not result:
            return "No speech detected in the audio"
        return result
        
    except sr.UnknownValueError:
        return "Could not understand audio - speech unclear or no speech detected"
    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {str(e)}"
    except Exception as e:
        return f"An error occurred during transcription: {str(e)}"

def get_db_connection():
    """Get MySQL database connection"""
    return pymysql.connect(
        host='localhost',
        user='root',
        password='Suman@123',
        database='audio_translator_db'
    )

def save_to_mysql(video_name: str, transcription: str) -> None:
    """Save transcription to MySQL database"""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO transcriptions (video_name, transcription) VALUES (%s, %s)"
            cursor.execute(sql, (video_name, transcription))
            connection.commit()
    finally:
        connection.close()

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'video' not in request.files:
        return jsonify({'success': False, 'error': 'No video file provided'}), 400
    
    video_file = request.files['video']
    if not video_file or not video_file.filename:
        return jsonify({'success': False, 'error': 'No selected file'}), 400

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            filename = secure_filename(video_file.filename or "uploaded_video")
            video_path = os.path.join(temp_dir, filename)
            video_file.save(video_path)
            video_file.stream.close()

            audio_path = os.path.join(temp_dir, 'temp_audio.wav')

            print("Extracting audio...")
            extract_audio(video_path, audio_path)

            print("Transcribing audio...")
            transcription = transcribe_audio(audio_path)

            # Save only if transcription is valid
            if transcription not in [
                "Could not understand audio - speech unclear or no speech detected",
                "No speech detected in the audio"
            ] and not transcription.startswith("An error occurred"):
                save_to_mysql(os.path.basename(video_path), transcription)

            return jsonify({
                'success': True,
                'transcription': transcription
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/transcriptions', methods=['GET'])
def get_transcriptions():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM transcriptions ORDER BY created_at DESC")
            columns = [col[0] for col in cursor.description]
            transcriptions = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
            return jsonify(transcriptions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()


@app.route('/transcriptions/<int:id>', methods=['DELETE'])
def delete_transcription(id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM transcriptions WHERE id = %s", (id,))
            connection.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        connection.close()


if __name__ == "__main__":
    app.run(port=5000, debug=True)
















# import os
# from pydub import AudioSegment
# import speech_recognition as sr
# from typing import Any
# import pymysql
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import tempfile

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# def extract_audio(video_path: str, audio_path: str) -> None:
#     """Extract audio from video file using pydub"""
#     try:
#         audio = AudioSegment.from_file(video_path)
#         audio.export(audio_path, format="wav")
#     except Exception as e:
#         print(f"Error extracting audio: {e}")
#         raise

# def transcribe_audio(audio_path: str) -> str:
#     """Transcribe audio to text using Google Speech Recognition"""
#     recognizer: Any = sr.Recognizer()
    
#     try:
#         with sr.AudioFile(audio_path) as source:
#             print("Analyzing audio file...")
#             recognizer.adjust_for_ambient_noise(source)
#             audio = recognizer.record(source)
        
#         print("Sending to Google Speech Recognition...")
#         result = recognizer.recognize_google(
#             audio,
#             language="en-US",
#             show_all=False
#         )
#         if not result:
#             return "No speech detected in the audio"
#         return result
        
#     except sr.UnknownValueError:
#         return "Could not understand audio - speech unclear or no speech detected"
#     except sr.RequestError as e:
#         return f"Could not request results from Google Speech Recognition service; {str(e)}"
#     except Exception as e:
#         return f"An error occurred during transcription: {str(e)}"

# def get_db_connection():
#     """Get MySQL database connection"""
#     return pymysql.connect(
#         host='localhost',
#         user='root',
#         password='Suman@123',
#         database='audio_translator_db'
#     )

# def save_to_mysql(video_name: str, transcription: str) -> None:
#     """Save transcription to MySQL database"""
#     connection = get_db_connection()
#     try:
#         with connection.cursor() as cursor:
#             sql = "INSERT INTO transcriptions (video_name, transcription) VALUES (%s, %s)"
#             cursor.execute(sql, (video_name, transcription))
#             connection.commit()
#     finally:
#         connection.close()

# @app.route('/transcribe', methods=['POST'])
# def transcribe_video():
#     if 'video' not in request.files:
#         return jsonify({'success': False, 'error': 'No video file provided'}), 400
    
#     video_file = request.files['video']
#     if not video_file or not video_file.filename:
#         return jsonify({'success': False, 'error': 'No selected file'}), 400

#     try:
#         with tempfile.TemporaryDirectory() as temp_dir:
#             filename = secure_filename(video_file.filename or "uploaded_video")
#             video_path = os.path.join(temp_dir, filename)
#             video_file.save(video_path)
#             video_file.stream.close()

#             audio_path = os.path.join(temp_dir, 'temp_audio.wav')

#             print("Extracting audio...")
#             extract_audio(video_path, audio_path)

#             print("Transcribing audio...")
#             transcription = transcribe_audio(audio_path)

#             # Save only if transcription is valid
#             if transcription not in [
#                 "Could not understand audio - speech unclear or no speech detected",
#                 "No speech detected in the audio"
#             ] and not transcription.startswith("An error occurred"):
#                 save_to_mysql(os.path.basename(video_path), transcription)

#             return jsonify({
#                 'success': True,
#                 'transcription': transcription
#             })
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# @app.route('/transcriptions', methods=['GET'])
# def get_transcriptions():
#     connection = get_db_connection()
#     try:
#         with connection.cursor() as cursor:
#             cursor.execute("SELECT * FROM transcriptions ORDER BY created_at DESC")
#             columns = [col[0] for col in cursor.description]
#             transcriptions = [
#                 dict(zip(columns, row))
#                 for row in cursor.fetchall()
#             ]
#             return jsonify(transcriptions)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
#     finally:
#         connection.close()

# @app.route('/transcriptions/<int:transcription_id>', methods=['DELETE'])
# def delete_transcription(transcription_id):
#     """Delete a transcription by ID"""
#     connection = get_db_connection()
#     try:
#         with connection.cursor() as cursor:
#             cursor.execute("DELETE FROM transcriptions WHERE id = %s", (transcription_id,))
#             connection.commit()
#             if cursor.rowcount == 0:
#                 return jsonify({'success': False, 'error': 'Transcription not found'}), 404
#         return jsonify({'success': True}), 200
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500
#     finally:
#         connection.close()

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)
