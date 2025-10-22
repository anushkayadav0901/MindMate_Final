import streamlit as st
import json
from gtts import gTTS
import os
import subprocess
import tempfile
import shutil
from pathlib import Path
import time

st.set_page_config(
    page_title="AI Reading Assistant for Dyslexic Students", 
    page_icon="📚",
    layout="wide"
)

# Custom CSS for dyslexic-friendly styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
    
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
    .processing-box {
        background-color: #fff3cd;
        padding: 15px;
        border-radius: 10px;
        border-left: 5px solid #ffc107;
    }
</style>
""", unsafe_allow_html=True)

def run_command(command, description):
    """Run a shell command with progress indication"""
    with st.spinner(f"⏳ {description}..."):
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                st.success(f"✅ {description} completed")
                return True
            else:
                st.error(f"❌ {description} failed: {result.stderr}")
                return False
        except Exception as e:
            st.error(f"❌ {description} error: {e}")
            return False

def process_pdf_files(uploaded_files):
    """Process uploaded PDF files through the entire pipeline"""
    
    # Create temporary directory for processing
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_pdf_dir = os.path.join(temp_dir, "sample_dataset/pdfs")
        temp_output_dir = os.path.join(temp_dir, "sample_dataset/outputs")
        
        # Create directories
        os.makedirs(temp_pdf_dir, exist_ok=True)
        os.makedirs(temp_output_dir, exist_ok=True)
        os.makedirs(os.path.join(temp_dir, "sample_dataset/pdfs/input_pages"), exist_ok=True)
        
        # Save uploaded PDFs
        pdf_paths = []
        for uploaded_file in uploaded_files:
            pdf_path = os.path.join(temp_pdf_dir, uploaded_file.name)
            with open(pdf_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            pdf_paths.append(pdf_path)
        
        st.markdown(f'<div class="success-box">📁 Saved {len(pdf_paths)} PDF file(s) for processing</div>', unsafe_allow_html=True)
        
        # Step 1: Convert PDFs to images
        st.subheader("🔄 Step 1: Converting PDFs to Images")
        for pdf_path in pdf_paths:
            filename = Path(pdf_path).stem
            cmd = f'mutool convert -o "{temp_pdf_dir}/input_pages/{filename}_page-%d.png" -F png -O resolution=200 "{pdf_path}"'
            if not run_command(cmd, f"Converting {filename}"):
                return None
        
        # Step 2: Layout Detection
        st.subheader("🖼️ Step 2: Layout Detection")
        # Modify config to use temp directory
        layout_cmd = f'python scripts/layout_detection.py --config configs/layout_detection_yolo.yaml --input_dir "{temp_pdf_dir}/input_pages" --output_dir "{temp_output_dir}"'
        if not run_command(layout_cmd, "Running layout detection"):
            # Fallback to basic layout detection
            st.info("Using basic processing...")
        
        # Step 3: Text Extraction
        st.subheader("📝 Step 3: Text Extraction")
        image_files = list(Path(f"{temp_pdf_dir}/input_pages").glob("*.png"))
        
        for image_path in image_files:
            base_name = image_path.stem
            extract_cmd = f'python scripts/extract_text.py --image "{image_path}" --json "{temp_output_dir}/{base_name}.json"'
            if not run_command(extract_cmd, f"Extracting text from {base_name}"):
                # Continue with other files even if one fails
                continue
        
        # Step 4: Convert to Structured JSON
        st.subheader("📊 Step 4: Creating Structured Output")
        
        # Copy the enhanced convert_to_structure.py to temp dir
        enhanced_converter = """
import json
import os
import glob
from collections import defaultdict

def process_pdf_json_files(pdf_name, json_files):
    all_data = []
    
    for json_file in sorted(json_files):
        try:
            with open(json_file, "r") as f:
                page_data = json.load(f)
                for block in page_data:
                    block["source_file"] = os.path.basename(json_file)
                all_data.extend(page_data)
        except Exception as e:
            print(f"Error reading {json_file}: {e}")
            continue
    
    if not all_data:
        return None
    
    all_data.sort(key=lambda x: x["box"]["y1"])
    
    document_title = None
    current_heading = None
    structured = {"document_title": "", "headings": []}
    
    for block in all_data:
        text = block["text"].strip()
        if not text or "Source:" in text or "Generated on" in text:
            continue

        if block["name"] == "title":
            if document_title is None:
                document_title = text
                structured["document_title"] = document_title
            else:
                current_heading = {"heading": text, "points": []}
                structured["headings"].append(current_heading)
        elif block["name"] == "plain text":
            if current_heading:
                current_heading["points"].append(text)
            else:
                if not structured["headings"]:
                    structured["headings"].append({"heading": "General", "points": []})
                structured["headings"][-1]["points"].append(text)
    
    return structured

# Main processing
outputs_dir = "sample_dataset/outputs"
json_files = glob.glob(os.path.join(outputs_dir, "*.json"))

pdf_files = defaultdict(list)
for json_file in json_files:
    filename = os.path.basename(json_file)
    if '_page-' in filename:
        pdf_name = filename.split('_page-')[0]
    elif 'page-' in filename and not '_' in filename:
        pdf_name = "document"
    else:
        pdf_name = os.path.splitext(filename)[0]
    pdf_files[pdf_name].append(json_file)

structured_outputs = {}
for pdf_name, files in pdf_files.items():
    structured_data = process_pdf_json_files(pdf_name, files)
    if structured_data:
        output_filename = f"structured_output_{pdf_name}.json"
        output_path = os.path.join("schema", output_filename)
        os.makedirs("schema", exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(structured_data, f, indent=2)
        structured_outputs[pdf_name] = structured_data
        print(f"Created: {output_path}")

# Save combined output
if structured_outputs:
    combined_output = list(structured_outputs.values())[0]  # Take first PDF for demo
    with open("schema/structured_output.json", "w") as f:
        json.dump(combined_output, f, indent=2)
"""
        
        converter_path = os.path.join(temp_dir, "convert_to_structure.py")
        with open(converter_path, "w") as f:
            f.write(enhanced_converter)
        
        # Run conversion
        convert_cmd = f'cd "{temp_dir}" && python convert_to_structure.py'
        if run_command(convert_cmd, "Creating structured JSON"):
            # Return the path to the final JSON
            final_json_path = os.path.join(temp_dir, "schema/structured_output.json")
            if os.path.exists(final_json_path):
                return final_json_path
        
        return None

def main():
    st.markdown('<h1 class="main-header">🧠 AI Reading Assistant for Dyslexic Students</h1>', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="dyslexic-text">
    <h3>🎯 Complete PDF Processing Pipeline</h3>
    Upload PDF files and this app will automatically:
    • Convert PDF to images
    • Detect layout and structure  
    • Extract text content
    • Create structured JSON
    • Provide audio reading assistance
    </div>
    """, unsafe_allow_html=True)
    
    # File upload section
    st.markdown("---")
    st.subheader("📤 Step 1: Upload PDF Files")
    
    uploaded_files = st.file_uploader(
        "Choose PDF files", 
        type=["pdf"], 
        accept_multiple_files=True,
        help="You can upload one or multiple PDF files"
    )
    
    if uploaded_files:
        st.markdown(f'<div class="success-box">📚 Ready to process {len(uploaded_files)} PDF file(s)</div>', unsafe_allow_html=True)
        
        if st.button("🚀 Start Complete Processing", type="primary"):
            with st.expander("🔍 Processing Log", expanded=True):
                final_json_path = process_pdf_files(uploaded_files)
            
            if final_json_path and os.path.exists(final_json_path):
                st.markdown("---")
                st.subheader("🎉 Processing Complete!")
                
                # Load and display the results
                with open(final_json_path, "r") as f:
                    data = json.load(f)
                
                # Display results
                st.markdown(f'<div class="section-box"><h2>📄 {data["document_title"]}</h2></div>', unsafe_allow_html=True)
                
                for i, section in enumerate(data["headings"]):
                    with st.container():
                        st.markdown(f'<div class="section-box"><h3>📌 {section["heading"]}</h3>', unsafe_allow_html=True)
                        for j, point in enumerate(section["points"]):
                            st.markdown(f'<div class="dyslexic-text">• {point}</div>', unsafe_allow_html=True)
                        st.markdown('</div>', unsafe_allow_html=True)
                
                # Text-to-Speech functionality
                st.markdown("---")
                st.subheader("🎧 Audio Reading Assistant")
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    if st.button("🔊 Read Entire Document"):
                        full_text = f"Document Title: {data['document_title']}. "
                        for section in data["headings"]:
                            full_text += f"Section: {section['heading']}. "
                            for point in section["points"]:
                                full_text += f"{point}. "
                        
                        tts = gTTS(text=full_text, lang='en', slow=True)
                        tts.save("output_audio.mp3")
                        st.audio("output_audio.mp3", format="audio/mp3")
                
                with col2:
                    if st.button("📊 Document Summary"):
                        stats_text = f"This document has {len(data['headings'])} main sections and {sum(len(s['points']) for s in data['headings'])} key points."
                        tts = gTTS(text=stats_text, lang='en', slow=True)
                        tts.save("summary_audio.mp3")
                        st.audio("summary_audio.mp3", format="audio/mp3")
                
                with col3:
                    # Download JSON button
                    json_str = json.dumps(data, indent=2)
                    st.download_button(
                        label="📥 Download JSON",
                        data=json_str,
                        file_name="structured_output.json",
                        mime="application/json"
                    )
            else:
                st.error("❌ Processing failed. Please check the logs above.")

if __name__ == "__main__":
    main()