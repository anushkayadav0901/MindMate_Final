import streamlit as st
import json
import os
import subprocess
import tempfile
import shutil
from pathlib import Path
import glob
from collections import defaultdict
import requests
import io

st.set_page_config(
    page_title="AI Reading Assistant for Dyslexic Students", 
    page_icon="📚",
    layout="wide"
)

# Custom CSS for dyslexic-friendly styling
st.markdown("""
<style>
    .dyslexic-text {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 18px;
        line-height: 1.6;
        color: #333;
        letter-spacing: 0.5px;
    }
    .main-header {
        color: #2E86AB;
        text-align: center;
        padding: 20px;
    }
    .section-box {
        background-color: #f0f8ff;
        padding: 20px;
        border-radius: 10px;
        margin: 10px 0;
        border-left: 5px solid #2E86AB;
    }
    .success-box {
        background-color: #d4edda;
        padding: 15px;
        border-radius: 10px;
        border-left: 5px solid #28a745;
    }
    .stButton button {
        width: 100%;
    }
</style>
""", unsafe_allow_html=True)

def ensure_directories():
    """Create all required directories"""
    directories = [
        "sample_dataset/pdfs",
        "sample_dataset/pdfs/input_pages", 
        "sample_dataset/outputs",
        "schema"
    ]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

def run_command(command, description):
    """Run a shell command with progress indication"""
    with st.spinner(f"⏳ {description}..."):
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=os.getcwd())
            if result.returncode == 0:
                st.success(f"✅ {description} completed")
                return True, result.stdout
            else:
                st.error(f"❌ {description} failed: {result.stderr}")
                return False, result.stderr
        except Exception as e:
            st.error(f"❌ {description} error: {e}")
            return False, str(e)

def process_pdf_files(uploaded_files):
    """Process uploaded PDF files through the entire pipeline"""
    
    # Ensure all directories exist
    ensure_directories()
    
    # Save uploaded PDFs to sample_dataset/pdfs/
    saved_pdfs = []
    for uploaded_file in uploaded_files:
        pdf_path = os.path.join("sample_dataset/pdfs", uploaded_file.name)
        with open(pdf_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        saved_pdfs.append(pdf_path)
    
    st.markdown(f'<div class="success-box">📁 Saved {len(saved_pdfs)} PDF file(s) to sample_dataset/pdfs/</div>', unsafe_allow_html=True)
    
    # Process each PDF
    all_structured_outputs = {}
    
    for pdf_path in saved_pdfs:
        pdf_name = Path(pdf_path).stem
        st.subheader(f"📄 Processing: {pdf_name}")
        
        # Step 1: Convert PDF to images
        st.write("**🔄 Step 1: Converting PDF to images**")
        cmd = f'mutool convert -o "sample_dataset/pdfs/input_pages/{pdf_name}_page-%d.png" -F png -O resolution=200 "{pdf_path}"'
        success, output = run_command(cmd, f"Converting {pdf_name}")
        if not success:
            st.warning(f"⚠️ Skipping {pdf_name} due to conversion failure")
            continue
        
        # Step 2: Layout Detection
        st.write("**🖼️ Step 2: Layout Detection**")
        layout_cmd = 'python scripts/layout_detection.py --config configs/layout_detection_yolo.yaml'
        success, output = run_command(layout_cmd, "Running layout detection")
        
        if not success:
            st.warning("⚠️ Layout detection had issues, but continuing...")
        
        # Step 3: Text Extraction
        st.write("**📝 Step 3: Text Extraction**")
        image_files = glob.glob(f"sample_dataset/pdfs/input_pages/{pdf_name}_page-*.png")
        
        successful_extractions = 0
        for image_path in sorted(image_files):
            base_name = Path(image_path).stem
            json_output_path = f"sample_dataset/outputs/{base_name}.json"
            
            extract_cmd = f'python scripts/extract_text.py --image "{image_path}" --json "{json_output_path}"'
            success, output = run_command(extract_cmd, f"Extracting text from {base_name}")
            if success:
                successful_extractions += 1
        
        if successful_extractions == 0:
            st.error(f"❌ No text extraction succeeded for {pdf_name}")
            continue
        
        # Step 4: Convert to Structured JSON for this PDF
        st.write("**📊 Step 4: Creating Structured Output**")
        
        # Use the enhanced convert_to_structure.py logic
        structured_data = create_structured_json_for_pdf(pdf_name)
        
        if structured_data:
            # Save PDF-specific structured output
            output_filename = f"structured_output_{pdf_name}.json"
            output_path = os.path.join("schema", output_filename)
            
            with open(output_path, "w") as f:
                json.dump(structured_data, f, indent=2)
            
            all_structured_outputs[pdf_name] = {
                "data": structured_data,
                "path": output_path
            }
            
            st.success(f"✅ Created structured output: {output_path}")
        else:
            st.error(f"❌ Failed to create structured JSON for {pdf_name}")
    
    return all_structured_outputs

def create_structured_json_for_pdf(pdf_name):
    """Create structured JSON for a specific PDF"""
    
    # Find all JSON files for this PDF
    json_files = glob.glob(f"sample_dataset/outputs/{pdf_name}_page-*.json")
    
    if not json_files:
        st.error(f"❌ No JSON files found for {pdf_name}")
        return None
    
    all_data = []
    
    # Read and combine all JSON files for this PDF
    for json_file in sorted(json_files):
        try:
            with open(json_file, "r") as f:
                page_data = json.load(f)
                # Add page information to each block
                for block in page_data:
                    block["source_file"] = os.path.basename(json_file)
                all_data.extend(page_data)
        except Exception as e:
            st.warning(f"⚠️ Error reading {json_file}: {e}")
            continue
    
    if not all_data:
        st.error(f"❌ No data found for PDF: {pdf_name}")
        return None
    
    # Sort elements by their vertical position (y1)
    all_data.sort(key=lambda x: x["box"]["y1"])
    
    document_title = None
    current_heading = None
    structured = {"document_title": "", "headings": []}
    
    for block in all_data:
        text = block["text"].strip()
        if not text or "Source:" in text or "Generated on" in text:
            continue

        if block["name"] == "title":
            # First title becomes document title
            if document_title is None:
                document_title = text
                structured["document_title"] = document_title
            else:
                # Start a new heading section
                current_heading = {"heading": text, "points": []}
                structured["headings"].append(current_heading)
        elif block["name"] == "plain text":
            if current_heading:
                current_heading["points"].append(text)
            else:
                # If plain text appears before a heading, add default heading
                if not structured["headings"]:
                    structured["headings"].append({"heading": "General", "points": []})
                structured["headings"][-1]["points"].append(text)
    
    return structured

def google_tts(text, language='en'):
    """Use Google Translate TTS API directly"""
    try:
        # Google Translate TTS URL
        url = f"http://translate.google.com/translate_tts?ie=UTF-8&tl={language}&q={requests.utils.quote(text)}&client=tw-ob"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            return io.BytesIO(response.content)
        else:
            st.error(f"Google TTS API error: {response.status_code}")
            return None
            
    except Exception as e:
        st.error(f"TTS Error: {e}")
        return None

def display_results_section():
    """Display the results section with all processed PDFs"""
    if "processed_pdfs" not in st.session_state:
        st.warning("No processed PDFs found. Please upload and process PDFs first.")
        return
    
    st.markdown("---")
    st.subheader("🎉 Processing Complete!")
    
    # Create tabs for each PDF
    pdf_names = list(st.session_state.processed_pdfs.keys())
    tabs = st.tabs([f"📄 {name}" for name in pdf_names])
    
    for i, pdf_name in enumerate(pdf_names):
        with tabs[i]:
            data = st.session_state.processed_pdfs[pdf_name]["data"]
            file_path = st.session_state.processed_pdfs[pdf_name]["path"]
            
            # Display results
            st.markdown(f'<div class="section-box"><h2>📄 {data["document_title"]}</h2></div>', unsafe_allow_html=True)
            
            for section in data["headings"]:
                with st.container():
                    st.markdown(f'<div class="section-box"><h3>📌 {section["heading"]}</h3>', unsafe_allow_html=True)
                    for point in section["points"]:
                        st.markdown(f'<div class="dyslexic-text">• {point}</div>', unsafe_allow_html=True)
                    st.markdown('</div>', unsafe_allow_html=True)
            
            # Text-to-Speech functionality using Google TTS
            st.markdown("---")
            st.subheader("🎧 Audio Reading Assistant")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.write("**Read Entire Document**")
                if st.button(f"🔊 Generate Audio", key=f"read_full_{pdf_name}"):
                    full_text = f"Document Title: {data['document_title']}. "
                    for section in data["headings"]:
                        full_text += f"Section: {section['heading']}. "
                        for point in section["points"]:
                            full_text += f"{point}. "
                    
                    # Use Google TTS
                    with st.spinner("Generating audio via Google TTS..."):
                        audio_bytes = google_tts(full_text)
                    
                    if audio_bytes:
                        st.session_state[f"audio_full_{pdf_name}"] = audio_bytes
                        st.success("✅ Full document audio generated!")
                    else:
                        st.error("❌ Failed to generate audio")
            
            with col2:
                st.write("**Document Summary**")
                if st.button(f"📊 Generate Summary", key=f"summary_{pdf_name}"):
                    stats_text = f"This document has {len(data['headings'])} main sections and {sum(len(s['points']) for s in data['headings'])} key points."
                    
                    # Use Google TTS
                    with st.spinner("Generating summary audio..."):
                        audio_bytes = google_tts(stats_text)
                    
                    if audio_bytes:
                        st.session_state[f"audio_summary_{pdf_name}"] = audio_bytes
                        st.success("✅ Summary audio generated!")
                    else:
                        st.error("❌ Failed to generate summary audio")
            
            with col3:
                # Download JSON button
                json_str = json.dumps(data, indent=2)
                st.download_button(
                    label="📥 Download JSON",
                    data=json_str,
                    file_name=f"structured_output_{pdf_name}.json",
                    mime="application/json",
                    key=f"download_{pdf_name}"
                )
            
            # Display audio players if they exist
            st.markdown("---")
            st.subheader("🎵 Audio Players")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.write("**Full Document Audio**")
                if f"audio_full_{pdf_name}" in st.session_state:
                    audio_bytes = st.session_state[f"audio_full_{pdf_name}"]
                    st.audio(audio_bytes, format="audio/mp3")
                    
                    # Download button for audio
                    st.download_button(
                        label="📥 Download Full Audio",
                        data=audio_bytes.getvalue(),
                        file_name=f"full_document_{pdf_name}.mp3",
                        mime="audio/mp3",
                        key=f"dl_full_{pdf_name}"
                    )
                else:
                    st.info("Click 'Generate Audio' above to create full document audio")
            
            with col2:
                st.write("**Document Summary Audio**")
                if f"audio_summary_{pdf_name}" in st.session_state:
                    audio_bytes = st.session_state[f"audio_summary_{pdf_name}"]
                    st.audio(audio_bytes, format="audio/mp3")
                    
                    # Download button for audio
                    st.download_button(
                        label="📥 Download Summary Audio",
                        data=audio_bytes.getvalue(),
                        file_name=f"summary_{pdf_name}.mp3",
                        mime="audio/mp3",
                        key=f"dl_summary_{pdf_name}"
                    )
                else:
                    st.info("Click 'Generate Summary' above to create summary audio")

def main():
    st.markdown('<h1 class="main-header">🧠 AI Reading Assistant for Dyslexic Students</h1>', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="dyslexic-text">
    <h3>🎯 Complete PDF Processing Pipeline</h3>
    Upload PDF files and this app will automatically:
    • Convert PDF to images → Detect layout → Extract text → Create structured JSON → Provide audio reading
    </div>
    """, unsafe_allow_html=True)
    
    # Initialize session state
    if "processed_pdfs" not in st.session_state:
        st.session_state.processed_pdfs = {}
    if "processing_complete" not in st.session_state:
        st.session_state.processing_complete = False
    
    # File upload section - only show if processing not complete
    if not st.session_state.processing_complete:
        st.markdown("---")
        st.subheader("📤 Step 1: Upload PDF Files")
        
        uploaded_files = st.file_uploader(
            "Choose PDF files", 
            type=["pdf"], 
            accept_multiple_files=True,
            help="Upload one or multiple PDF files",
            key="file_uploader"
        )
        
        if uploaded_files:
            st.markdown(f'<div class="success-box">📚 Ready to process {len(uploaded_files)} PDF file(s)</div>', unsafe_allow_html=True)
            
            if st.button("🚀 Start Complete Processing", type="primary", key="process_button"):
                with st.expander("🔍 Processing Log", expanded=True):
                    all_outputs = process_pdf_files(uploaded_files)
                
                if all_outputs:
                    # Store results in session state
                    st.session_state.processed_pdfs = all_outputs
                    st.session_state.processing_complete = True
                    st.rerun()  # Force rerun to show results section
                else:
                    st.error("❌ Processing failed for all PDFs. Please check the logs above.")
    
    # Show results section if processing is complete
    if st.session_state.processing_complete:
        display_results_section()
        
        # Add a button to process new PDFs
        st.markdown("---")
        if st.button("🔄 Process New PDFs"):
            # Reset session state (including audio data)
            for key in list(st.session_state.keys()):
                if key.startswith('audio_'):
                    del st.session_state[key]
            st.session_state.processed_pdfs = {}
            st.session_state.processing_complete = False
            st.rerun()

if __name__ == "__main__":
    main()