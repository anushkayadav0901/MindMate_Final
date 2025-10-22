import streamlit as st
import json
from gtts import gTTS
import base64
import os

st.set_page_config(page_title="AI Reading Assistant for Dyslexic Students", page_icon="📚")

# Custom CSS for dyslexic-friendly styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Dyslexic&display=swap');
    
    .dyslexic-text {
        font-family: 'Open Dyslexic', Arial, sans-serif;
        font-size: 18px;
        line-height: 1.6;
        color: #333;
    }
    .main-header {
        color: #2E86AB;
        text-align: center;
    }
    .section-box {
        background-color: #f0f8ff;
        padding: 20px;
        border-radius: 10px;
        margin: 10px 0;
        border-left: 5px solid #2E86AB;
    }
</style>
""", unsafe_allow_html=True)

def main():
    st.markdown('<h1 class="main-header">🧠 AI Reading Assistant for Dyslexic Students</h1>', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="dyslexic-text">
    This assistant helps you read and understand content by:
    • Converting text to clear audio
    • Breaking content into manageable sections
    • Using dyslexic-friendly formatting
    </div>
    """, unsafe_allow_html=True)
    
    # File upload
    uploaded_file = st.file_uploader("📁 Upload your structured JSON file", type=["json"])
    
    if uploaded_file is not None:
        try:
            # Load JSON data
            data = json.load(uploaded_file)
            
            # Display document title
            st.markdown(f'<div class="section-box"><h2>📄 {data["document_title"]}</h2></div>', unsafe_allow_html=True)
            
            # Display content with dyslexic-friendly formatting
            for i, section in enumerate(data["headings"]):
                with st.container():
                    st.markdown(f'<div class="section-box"><h3>📌 {section["heading"]}</h3>', unsafe_allow_html=True)
                    
                    for j, point in enumerate(section["points"]):
                        st.markdown(f'<div class="dyslexic-text">• {point}</div>', unsafe_allow_html=True)
                    
                    st.markdown('</div>', unsafe_allow_html=True)
            
            # Text-to-Speech functionality
            st.markdown("---")
            st.subheader("🎧 Audio Reading Assistant")
            
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button("🔊 Read Entire Document Aloud"):
                    # Combine all text
                    full_text = f"Document Title: {data['document_title']}. "
                    for section in data["headings"]:
                        full_text += f"Section: {section['heading']}. "
                        for point in section["points"]:
                            full_text += f"{point}. "
                    
                    # Generate audio
                    tts = gTTS(text=full_text, lang='en', slow=True)
                    tts.save("output_audio.mp3")
                    
                    # Play audio
                    audio_file = open("output_audio.mp3", "rb")
                    audio_bytes = audio_file.read()
                    
                    st.audio(audio_bytes, format="audio/mp3")
                    st.success("✅ Audio ready! Click play to listen.")
            
            with col2:
                if st.button("📊 Read Statistics Only"):
                    stats_text = f"Document has {len(data['headings'])} sections and {sum(len(s['points']) for s in data['headings'])} total points."
                    tts = gTTS(text=stats_text, lang='en', slow=True)
                    tts.save("stats_audio.mp3")
                    
                    audio_file = open("stats_audio.mp3", "rb")
                    audio_bytes = audio_file.read()
                    st.audio(audio_bytes, format="audio/mp3")
                    
        except Exception as e:
            st.error(f"Error loading JSON file: {e}")

if __name__ == "__main__":
    main()