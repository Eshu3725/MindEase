from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import random
import cgi
import os

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

class EmotionAnalysisHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = {
            "message": "Emotion Analysis API is running"
        }

        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        if self.path == '/upload-video-and-blog/':
            # Parse form data
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )

            # Get blog post content
            blog_post = ""
            if 'blog_post' in form:
                blog_post = form['blog_post'].value

            # Generate mock emotion analysis results with weighted probabilities
            emotions = {
                "happy": 0.25,    # Common emotion
                "neutral": 0.20,  # Common emotion
                "sad": 0.15,      # Somewhat common
                "surprised": 0.10,
                "angry": 0.10,
                "content": 0.08,
                "excited": 0.05,
                "fearful": 0.04,
                "disgusted": 0.03 # Rare emotion
            }

            # Helper function for weighted random selection
            def weighted_choice(choices):
                total = sum(choices.values())
                r = random.uniform(0, total)
                upto = 0
                for choice, weight in choices.items():
                    upto += weight
                    if upto > r:
                        return choice
                # Fallback
                return "neutral"

            # Get emotions for video and audio
            video_emotion = weighted_choice(emotions)
            audio_emotion = weighted_choice(emotions)

            # More sophisticated emotion fusion algorithm
            # If both emotions match, that's definitely the final emotion
            if video_emotion == audio_emotion:
                final_emotion = video_emotion
            # If audio detects strong emotions, prioritize those
            elif audio_emotion in ["sad", "angry", "fearful"]:
                final_emotion = audio_emotion
            # If video shows strong emotions, prioritize those
            elif video_emotion in ["happy", "surprised", "excited"]:
                final_emotion = video_emotion
            # Default to video emotion in other cases
            else:
                final_emotion = video_emotion

            emotion_result = {
                "video": video_emotion,
                "audio": audio_emotion,
                "final": final_emotion
            }

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {
                "emotion": emotion_result,
                "blog_post": blog_post
            }

            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {
                "error": "Endpoint not found"
            }

            self.wfile.write(json.dumps(response).encode())

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, EmotionAnalysisHandler)
    print(f"Starting mock server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
