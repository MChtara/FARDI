"""
Audio Service for generating speech using Edge TTS
"""
import os
import asyncio
import edge_tts
import logging
from models.game_data import DIALOGUE_QUESTIONS

logger = logging.getLogger(__name__)

class AudioService:
    def __init__(self):
        self.audio_dir = os.path.join('static', 'audio')
        os.makedirs(self.audio_dir, exist_ok=True)

    async def generate_audio(self, text, output_path, voice="en-US-ChristopherNeural"):
        """Generate audio file using Edge TTS"""
        try:
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_path)
            logger.info(f"Generated audio file: {output_path}")
        except Exception as e:
            logger.error(f"Error generating audio: {str(e)}")
            raise

    def generate_audio_sync(self, text, output_path, voice="en-US-ChristopherNeural"):
        """Synchronous wrapper for generate_audio"""
        try:
            asyncio.run(self.generate_audio(text, output_path, voice))
            return True
        except Exception as e:
            logger.error(f"Error in synchronous audio generation: {str(e)}")
            return False

    def verify_audio_files(self):
        """Check if audio files exist and are readable"""
        skander_audio_path = os.path.join(self.audio_dir, 'skander_suggestion.mp3')

        if os.path.exists(skander_audio_path):
            file_size = os.path.getsize(skander_audio_path)
            logger.info(f"Audio file exists: {skander_audio_path} (Size: {file_size} bytes)")

            # Try to read a few bytes to verify file is not corrupted
            try:
                with open(skander_audio_path, 'rb') as f:
                    header = f.read(10)  # Read first 10 bytes
                logger.info(f"Successfully read audio file header: {header.hex()}")
                return True
            except Exception as e:
                logger.error(f"Error reading audio file: {str(e)}")
                return False
        else:
            logger.error(f"Audio file does not exist: {skander_audio_path}")
            return False

    def generate_skander_audio(self):
        """Generate audio specifically for SKANDER's question in step 4"""
        skander_audio_path = os.path.join(self.audio_dir, 'skander_suggestion.mp3')

        # Get the text directly from the question in step 4
        step4_question = next((q for q in DIALOGUE_QUESTIONS if q["step"] == 4), None)
        if step4_question:
            # Extract the actual question text to convert to speech
            skander_text = "We could have a dance show or a food tasting."

            try:
                # Use a male voice for SKANDER
                return self.generate_audio_sync(skander_text, skander_audio_path, voice="en-US-GuyNeural")
            except Exception as e:
                logger.error(f"Error generating SKANDER audio file: {str(e)}")

        return False

    def initialize_audio_files(self):
        """Generate audio files for listening questions if they don't exist"""
        # Generate audio for SKANDER's suggestion
        skander_audio_path = os.path.join(self.audio_dir, 'skander_suggestion.mp3')
        if not os.path.exists(skander_audio_path):
            skander_text = "We could have a dance show or a food tasting."
            try:
                self.generate_audio_sync(skander_text, skander_audio_path, voice="en-US-GuyNeural")
                logger.info(f"Generated audio file: {skander_audio_path}")
            except Exception as e:
                logger.error(f"Error generating audio file: {str(e)}")

        # Generate additional audio for other dialogues if needed
        for idx, question in enumerate(DIALOGUE_QUESTIONS):
            if question.get('audio_cue') and question.get('audio_cue') != 'skander_suggestion.mp3':
                audio_path = os.path.join(self.audio_dir, question.get('audio_cue'))
                if not os.path.exists(audio_path):
                    voice = self._get_voice_for_speaker(question['speaker'])

                    try:
                        self.generate_audio_sync(question['question'], audio_path, voice=voice)
                        logger.info(f"Generated audio file: {audio_path}")
                    except Exception as e:
                        logger.error(f"Error generating audio file: {str(e)}")

    def _get_voice_for_speaker(self, speaker):
        """Get appropriate voice based on speaker"""
        voice_mapping = {
            "Ms. Mabrouki": "en-US-JennyNeural",
            "SKANDER": "en-US-GuyNeural",
            "Emna": "en-US-AriaNeural",
            "Ryan": "en-US-BryanNeural",
            "Lilia": "en-US-ElizabethNeural"
        }
        return voice_mapping.get(speaker, "en-US-AriaNeural")

    def generate_custom_audio(self, text, filename, voice="en-US-ChristopherNeural"):
        """Generate custom audio file for API requests"""
        from werkzeug.utils import secure_filename
        
        if not text:
            raise ValueError("No text provided")

        # Make sure the filename is safe
        filename = secure_filename(filename)
        output_path = os.path.join(self.audio_dir, filename)
        
        try:
            success = self.generate_audio_sync(text, output_path, voice=voice)
            if success:
                return f"/static/audio/{filename}"
            else:
                raise Exception("Failed to generate audio")
        except Exception as e:
            logger.error(f"Error generating custom audio: {str(e)}")
            raise