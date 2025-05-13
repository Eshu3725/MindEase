import cv2
import numpy as np
import time
import pyaudio
import wave
from tensorflow.keras.models import load_model
from collections import Counter
import librosa

# Load the trained models
video_model = load_model('video_model.h5')
audio_model = load_model('audio_model.h5')

# Define emotion labels (ensure both models have the same label order)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Open webcam
cap = cv2.VideoCapture(0)

# List to store predicted emotions
predicted_emotions_video = []
faces_data = []  # List to store actual face data for predictions

# Function to record audio for a given duration
def record_audio(duration=2):
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    frames = []
    for _ in range(0, int(16000 / 1024 * duration)):
        data = stream.read(1024)
        frames.append(data)
    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save the audio to a temporary file
    filename = 'temp_audio.wav'
    wf = wave.open(filename, 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(16000)
    wf.writeframes(b''.join(frames))
    wf.close()

    return filename

# Function to extract MFCC features from audio
def extract_mfcc(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    
    # Pad or truncate MFCCs to (40, 130)
    mfcc = np.pad(mfcc, ((0, 0), (0, 130 - mfcc.shape[1])), mode='constant')
    
    # Ensure shape (40, 130, 1) for input to model
    mfcc = np.expand_dims(mfcc, axis=-1)
    
    return np.expand_dims(mfcc, axis=0)  # Add batch dimension (1, 40, 130, 1)

# Get start time
start_time = time.time()
duration = 15  # seconds

print("⚡ Starting 15-second real-time webcam and audio emotion detection...")

while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠️ Failed to grab frame from webcam.")
        break

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

    if len(faces) > 0:
        for (x, y, w, h) in faces:
            face = gray_frame[y:y+h, x:x+w]
            face = cv2.resize(face, (48, 48))
            face = face.astype('float32') / 255.0
            face = np.expand_dims(face, axis=-1)  # Shape becomes (48, 48, 1)
            face = np.expand_dims(face, axis=0)  # Shape becomes (1, 48, 48, 1)

            # Store the face data for video model prediction
            faces_data.append(face)

            # Video model prediction
            video_prediction = video_model.predict(face)
            predicted_class_video = np.argmax(video_prediction)
            predicted_emotions_video.append(emotion_labels[predicted_class_video])

            # Draw box and label on video frame
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255,0,0), 2)
            cv2.putText(frame, emotion_labels[predicted_class_video], (x, y-10), cv2.FONT_HERSHEY_SIMPLEX,
                        0.9, (255,0,0), 2)

    # Record audio every 2 seconds (adjust as needed)
    audio_file = record_audio(duration=2)
    audio_mfcc = extract_mfcc(audio_file)

    # Predict using audio model
    try:
        audio_prediction = audio_model.predict(audio_mfcc)
        if audio_prediction.shape[-1] > 0:  # Ensure the prediction output is valid
            predicted_class_audio = np.argmax(audio_prediction)
            predicted_emotions_audio.append(emotion_labels[predicted_class_audio])
        else:
            print("⚠️ Invalid prediction output from audio model.")
    except Exception as e:
        print(f"⚠️ Error while predicting audio emotion: {e}")

    # Display the frame with emotion
    cv2.imshow('Real-time Emotion Detection', frame)

    # Check if 15 seconds are over
    if time.time() - start_time > duration:
        print("\n⏰ 15 seconds complete!")
        break

    # Optional: Press 'q' to quit early
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("\n🛑 Interrupted by user (q pressed).")
        break

cap.release()
cv2.destroyAllWindows()

# Now combine both video and audio model predictions
if predicted_emotions_video and predicted_emotions_audio:
    # Majority vote on both video and audio predictions
    majority_video_emotion = Counter(predicted_emotions_video).most_common(1)[0][0]
    majority_audio_emotion = Counter(predicted_emotions_audio).most_common(1)[0][0]

    print(f"\n✅ Video Prediction: {majority_video_emotion}")
    print(f"✅ Audio Prediction: {majority_audio_emotion}")
    
    # Combine video and audio predictions by averaging softmax outputs
    video_softmax = np.mean([video_model.predict(face_data) for face_data in faces_data], axis=0)
    audio_softmax = np.mean([audio_model.predict(np.expand_dims(audio_data, axis=0)) for audio_data in predicted_emotions_audio], axis=0)

    final_softmax = (video_softmax + audio_softmax) / 2
    final_prediction = np.argmax(final_softmax, axis=-1)

    print(f"\n✅ Final Predicted Emotion (Video + Audio): {emotion_labels[final_prediction]}")
else:
    print("\n⚠️ No faces or audio detected during the session.")
