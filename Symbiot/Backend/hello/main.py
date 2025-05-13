from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import random

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded files temporarily
UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Mock emotions for demo purposes
EMOTIONS = ["happy", "sad", "angry", "neutral", "surprised"]

@app.get("/")
async def root():
    return {"message": "Emotion Analysis API is running"}

@app.post("/upload-video-and-blog/")
async def upload_video_and_blog(file: UploadFile = File(...), blog_post: str = Form("")):
    try:
        # Save the uploaded file (just for demonstration)
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        print(f"Received file: {file.filename}, size: {len(content)} bytes")
        print(f"Blog post: {blog_post}")

        # Generate mock emotion analysis results
        video_emotion = random.choice(EMOTIONS)
        audio_emotion = random.choice(EMOTIONS)

        # Determine final emotion (just for demonstration)
        if audio_emotion == "sad":
            final_emotion = "sad"
        else:
            final_emotion = video_emotion

        emotion_result = {
            "video": video_emotion,
            "audio": audio_emotion,
            "final": final_emotion
        }

        print("Emotion result:", emotion_result)

        # Clean up the file
        os.remove(file_path)

        # Return the result
        return JSONResponse(content={
            "emotion": emotion_result,
            "blog_post": blog_post
        })

    except Exception as e:
        print("Error in /upload-video-and-blog/:", e)
        return JSONResponse(content={"error": str(e)}, status_code=500)