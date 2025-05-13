import os
from emotion_detector import EmotionDetector

def get_emotion_api():
    base_dir = os.path.dirname(__file__)
    video_model = os.path.join(base_dir, 'video_model.h5')
    audio_model = os.path.join(base_dir, 'audio_model.h5')

    detector = EmotionDetector(video_model, audio_model)
    result = detector.get_final_emotion()
    return result

if __name__ == "__main__":
    emotion = get_emotion_api()
    print(emotion)
