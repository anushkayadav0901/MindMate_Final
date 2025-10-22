import json
from gtts import gTTS
import os

class DyslexiaReadingAssistant:
    def __init__(self, json_file_path):
        with open(json_file_path, "r") as f:
            self.data = json.load(f)
        
    def read_section(self, section_index):
        """Read a specific section aloud"""
        if 0 <= section_index < len(self.data["headings"]):
            section = self.data["headings"][section_index]
            text = f"Section: {section['heading']}. "
            for point in section["points"]:
                text += f"{point}. "
            
            self._generate_audio(text, f"section_{section_index}.mp3")
            return text
        return None
    
    def read_full_document(self):
        """Read entire document aloud"""
        text = f"Document Title: {self.data['document_title']}. "
        for section in self.data["headings"]:
            text += f"Section: {section['heading']}. "
            for point in section["points"]:
                text += f"{point}. "
        
        self._generate_audio(text, "full_document.mp3")
        return text
    
    def _generate_audio(self, text, filename):
        """Generate audio file from text"""
        tts = gTTS(text=text, lang='en', slow=True)
        tts.save(filename)
        print(f"✅ Audio saved: {filename}")
        return filename

# Usage
if __name__ == "__main__":
    assistant = DyslexiaReadingAssistant("schema/structured_output.json")
    
    print("Choose reading option:")
    print("1. Read full document")
    print("2. Read specific section")
    
    choice = input("Enter choice (1 or 2): ")
    
    if choice == "1":
        assistant.read_full_document()
    elif choice == "2":
        for i, section in enumerate(assistant.data["headings"]):
            print(f"{i}. {section['heading']}")
        section_choice = int(input("Enter section number: "))
        assistant.read_section(section_choice)