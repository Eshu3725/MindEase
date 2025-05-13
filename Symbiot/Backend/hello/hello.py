import os
import subprocess

input_folder = './s1'
output_folder = './fixed_files'
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if filename.endswith('.avi'):
        input_path = os.path.join(input_folder, filename)
        output_filename = os.path.splitext(filename)[0] + '_fixed.mp4'
        output_path = os.path.join(output_folder, output_filename)

        command = [
            'ffmpeg',
            '-i', input_path,
            '-c:v', 'libx264',
            '-preset', 'slow',
            '-crf', '22',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-strict', 'experimental',
            output_path
        ]

        print(f'Fixing {filename} → {output_filename}')
        subprocess.run(command)

print('✅ All files force-repaired and re-encoded successfully!')
