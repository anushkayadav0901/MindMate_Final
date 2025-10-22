import os
import sys
import json
import tempfile
import subprocess
import glob
import shutil
import time
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Cache for processed textbooks to avoid reprocessing
textbook_cache = {}
CACHE_DURATION = 3600  # 1 hour cache

print("🔧 AI Model Server Starting...")
print(f"📁 Current directory: {current_dir}")

def get_file_hash(file_path):
    """Generate a simple hash for caching"""
    file_stats = os.stat(file_path)
    return hashlib.md5(f"{file_path}{file_stats.st_size}{file_stats.st_mtime}".encode()).hexdigest()

def ensure_directories():
    """Create the exact directory structure your scripts expect"""
    directories = [
        "sample_dataset/pdfs",
        "sample_dataset/pdfs/input_pages", 
        "sample_dataset/outputs",
        "schema"
    ]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

def run_command(command, description):
    """Run a shell command exactly like your Streamlit app"""
    print(f"⏳ {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=current_dir)
        if result.returncode == 0:
            print(f"✅ {description} completed")
            return True, result.stdout
        else:
            print(f"❌ {description} failed: {result.stderr}")
            return False, result.stderr
    except Exception as e:
        print(f"❌ {description} error: {e}")
        return False, str(e)

def process_pdf_like_streamlit(pdf_path, pdf_filename):
    """Process PDF exactly like your Streamlit app_simple.py"""
    
    # Check cache first
    file_hash = get_file_hash(pdf_path)
    if file_hash in textbook_cache:
        cache_time, cached_data = textbook_cache[file_hash]
        if time.time() - cache_time < CACHE_DURATION:
            print("📚 Using cached textbook result")
            return cached_data
    
    # Ensure all directories exist
    ensure_directories()
    
    # Save uploaded PDF to sample_dataset/pdfs/ (exact location your scripts expect)
    target_pdf_path = os.path.join(current_dir, "sample_dataset/pdfs", pdf_filename)
    shutil.copy(pdf_path, target_pdf_path)
    
    print(f"💾 Saved PDF to: {target_pdf_path}")
    
    pdf_name = os.path.splitext(pdf_filename)[0]
    
    # Step 1: Convert PDF to images with optimized resolution for textbooks
    print("🔄 Step 1: Converting PDF to images...")
    cmd = f'mutool convert -o "sample_dataset/pdfs/input_pages/{pdf_name}_page-%d.png" -F png -O resolution=150 "{target_pdf_path}"'
    success, _ = run_command(cmd, f"Converting {pdf_name}")  # Fixed: use _ for unused output
    if not success:
        return None
    
    # Step 2: Layout Detection
    print("🖼️ Step 2: Layout Detection...")
    layout_cmd = 'python scripts/layout_detection.py --config configs/layout_detection_yolo.yaml'
    success, _ = run_command(layout_cmd, "Running layout detection")  # Fixed: use _ for unused output
    
    if not success:
        print("⚠️ Layout detection had issues, but continuing...")
    
    # Step 3: Text Extraction
    print("📝 Step 3: Text Extraction...")
    image_files = glob.glob(f"sample_dataset/pdfs/input_pages/{pdf_name}_page-*.png")
    
    successful_extractions = 0
    for image_path in sorted(image_files):
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        json_output_path = f"sample_dataset/outputs/{base_name}.json"
        
        extract_cmd = f'python scripts/extract_text.py --image "{image_path}" --json "{json_output_path}"'
        success, _ = run_command(extract_cmd, f"Extracting text from {base_name}")  # Fixed: use _ for unused output
        if success:
            successful_extractions += 1
    
    if successful_extractions == 0:
        print("❌ No text extraction succeeded")
        return None
    
    # Step 4: Convert to Structured JSON
    print("📊 Step 4: Creating Structured Output...")
    
    try:
        # Import and use your convert_to_structure.py directly
        from convert_to_structure import process_pdf_json_files
        
        # Find all JSON files for this PDF
        json_files = glob.glob(f"sample_dataset/outputs/{pdf_name}_page-*.json")
        
        if not json_files:
            print("❌ No JSON files found")
            return None
        
        # Process using your exact function
        structured_data = process_pdf_json_files(pdf_name, json_files)
        
        if structured_data:
            print(f"✅ Generated {len(structured_data.get('headings', []))} headings")
            
            # Cache the result
            textbook_cache[file_hash] = (time.time(), structured_data)
            
            return structured_data
        else:
            print("❌ Structure conversion returned empty")
            return None
            
    except Exception as e:
        print(f"❌ convert_to_structure failed: {e}")
        return None

def cleanup_sample_dataset():
    """Clean up the sample_dataset directory for next processing"""
    folders_to_clean = [
        "sample_dataset/pdfs/input_pages",
        "sample_dataset/outputs"
    ]
    
    for folder in folders_to_clean:
        folder_path = os.path.join(current_dir, folder)
        if os.path.exists(folder_path):
            for file in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f"⚠️ Could not delete {file_path}: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "AI Model Server is running",
        "cache_size": len(textbook_cache)
    })

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    temp_dir = None
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        if pdf_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        print(f"📄 Processing PDF: {pdf_file.filename}")
        
        # Clean up previous processing files
        cleanup_sample_dataset()
        
        # Create temporary file for the uploaded PDF
        temp_dir = tempfile.mkdtemp()
        temp_pdf_path = os.path.join(temp_dir, pdf_file.filename)
        pdf_file.save(temp_pdf_path)
        
        # Process the PDF exactly like your Streamlit app
        print("🚀 Starting PDF processing pipeline (Streamlit style)...")
        structured_data = process_pdf_like_streamlit(temp_pdf_path, pdf_file.filename)
        
        if structured_data:
            print("✅ Pipeline completed successfully!")
            return jsonify(structured_data)
        else:
            print("❌ Pipeline failed")
            return jsonify({
                "document_title": pdf_file.filename.replace('.pdf', ''),
                "headings": [
                    {
                        "heading": "Processing Information",
                        "points": ["PDF processing failed. Please check server logs."]
                    }
                ]
            })
        
    except Exception as e:
        print(f"❌ Server error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    finally:
        # Clean up temporary directory
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

@app.route('/clear-cache', methods=['POST'])
def clear_cache():
    """Clear the textbook cache"""
    textbook_cache.clear()
    return jsonify({"message": "Textbook cache cleared", "cache_size": 0})

@app.route('/test-pipeline', methods=['GET'])
def test_pipeline():
    """Test if all pipeline components are available"""
    components = {
        'mutool': subprocess.run(['which', 'mutool'], capture_output=True).returncode == 0,
        'scripts/layout_detection.py': os.path.exists('scripts/layout_detection.py'),
        'scripts/extract_text.py': os.path.exists('scripts/extract_text.py'),
        'configs/layout_detection_yolo.yaml': os.path.exists('configs/layout_detection_yolo.yaml'),
        'convert_to_structure.py': os.path.exists('convert_to_structure.py'),
        'sample_dataset directory': os.path.exists('sample_dataset'),
    }
    
    return jsonify({
        'pipeline_components': components,
        'current_directory': current_dir
    })

@app.route('/cleanup', methods=['POST'])
def cleanup():
    """Clean up processing files"""
    try:
        cleanup_sample_dataset()
        return jsonify({"message": "Cleanup completed"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    PORT = 5001
    print(f"🚀 Starting AI Model Server on http://localhost:{PORT}")
    print("📊 Available endpoints:")
    print("   GET  /health        - Health check")
    print("   POST /process-pdf   - Process PDF file") 
    print("   GET  /test-pipeline - Test pipeline components")
    print("   POST /cleanup       - Clean up processing files")
    print("   POST /clear-cache   - Clear textbook cache")
    
    # Ensure directories exist on startup
    ensure_directories()
    
    app.run(host='0.0.0.0', port=PORT, debug=True)