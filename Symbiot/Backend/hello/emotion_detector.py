import cv2

class EmotionDetector:
    def __init__(self, video_model_path, audio_model_path):
        self.video_model_path = video_model_path
        self.audio_model_path = audio_model_path
        self.face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        # TODO: Load your real models here (Keras, PyTorch, etc.)

    def analyze_audio(self, video_path):
        # TODO: Replace this with real audio emotion analysis
        # For now, return a dummy emotion like 'sad', 'angry', 'happy', etc.
        return "sad"

    def analyze_video(self, frame):
        # TODO: Replace this with real video emotion analysis (using models)
        # For now, return a dummy value
        return "happy"

    def get_final_emotion(self, video_path):
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        face_detected = 0
        video_emotions = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_detector.detectMultiScale(gray, 1.3, 5)
            if len(faces) > 0:
                face_detected += 1
                video_emotions.append(self.analyze_video(frame))  # collect video emotions

        cap.release()
        print(f"[DEBUG] Frames processed: {frame_count}, Faces detected: {face_detected}")

        audio_emotion = self.analyze_audio(video_path)

        # Decide final emotion:
        if face_detected == 0:
            final_emotion = audio_emotion
            video_result = "No Face Detected"
        else:
            # Majority vote from collected video emotions (for now just pick the first one)
            # You can upgrade this to a majority vote later
            video_result = video_emotions[0] if video_emotions else "happy"
            # Combine logic: prioritize audio 'sad' if detected
            if audio_emotion == "sad":
                final_emotion = "sad"
            else:
                final_emotion = video_result

        return {
            "video": video_result,
            "audio": audio_emotion,
            "final": final_emotion
        }
