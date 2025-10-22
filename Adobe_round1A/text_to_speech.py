import json
from gtts import gTTS
import os

def read_json_aloud(json_file_path):
    # Load your structured JSON
    with open(json_file_path, "r") as f:
        data = json.load(f)
    
    print("📖 Preparing to read:", data["document_title"])
    
    # Combine all content for reading
    full_text = f"Document Title: {data['document_title']}. "
    
    for section in data["headings"]:
        full_text += f"Section: {section['heading']}. "
        for point in section["points"]:
            full_text += f"{point}. "
    
    # Convert to speech with clear, slow pronunciation
    tts = gTTS(text=full_text, lang='en', slow=True)
    output_file = "reading_assistant_output.mp3"
    tts.save(output_file)
    
    print(f"✅ Audio saved as {output_file}")
    
    # Play the audio (macOS)
    os.system(f"afplay {output_file}")
    
    return full_text

# Test with your JSON
if __name__ == "__main__":
    read_json_aloud("schema/structured_output_news-automata-2025-10-06.json")