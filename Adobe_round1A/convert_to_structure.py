import json
import os
import glob
from collections import defaultdict

def process_pdf_json_files(pdf_name, json_files):
    """Process all JSON files for a single PDF and create structured output"""
    
    all_data = []
    
    # Read and combine all JSON files for this PDF
    for json_file in sorted(json_files):  # Sort to maintain page order
        try:
            with open(json_file, "r") as f:
                page_data = json.load(f)
                # Add page information to each block
                for block in page_data:
                    block["source_file"] = os.path.basename(json_file)
                all_data.extend(page_data)
        except Exception as e:
            print(f"⚠️  Error reading {json_file}: {e}")
            continue
    
    if not all_data:
        print(f"❌ No data found for PDF: {pdf_name}")
        return
    
    # Step 1: Sort elements by their vertical position (y1)
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
                # If plain text appears before a heading, ignore or add default heading
                if not structured["headings"]:
                    structured["headings"].append({"heading": "General", "points": []})
                structured["headings"][-1]["points"].append(text)
    
    return structured

def main():
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    outputs_dir = os.path.join(current_dir, "sample_dataset", "outputs")
    
    # Find all JSON files in the outputs directory
    json_files = glob.glob(os.path.join(outputs_dir, "*.json"))
    
    if not json_files:
        print("❌ No JSON files found in sample_dataset/outputs/")
        return
    
    # Group JSON files by PDF name
    pdf_files = defaultdict(list)
    
    for json_file in json_files:
        filename = os.path.basename(json_file)
        
        # Extract PDF name from filename patterns like:
        # "news-automata_page-1.json", "news_page-2.json", etc.
        if '_page-' in filename:
            # Pattern: pdfname_page-X.json
            pdf_name = filename.split('_page-')[0]
        elif 'page-' in filename and not '_' in filename:
            # Pattern: page-X.json (no PDF name)
            pdf_name = "document"
        else:
            # Other patterns, use filename without extension
            pdf_name = os.path.splitext(filename)[0]
        
        pdf_files[pdf_name].append(json_file)
    
    print(f"📁 Found {len(pdf_files)} PDF(s) with JSON files:")
    for pdf_name, files in pdf_files.items():
        print(f"   📄 {pdf_name}: {len(files)} page(s)")
    
    # Process each PDF separately
    for pdf_name, json_files in pdf_files.items():
        print(f"\n🔄 Processing PDF: {pdf_name}")
        
        structured_data = process_pdf_json_files(pdf_name, json_files)
        
        if structured_data:
            # Create output filename based on PDF name
            output_filename = f"structured_output_{pdf_name}.json"
            output_path = os.path.join(current_dir, "schema", output_filename)
            
            # Ensure schema directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save structured output for this PDF
            with open(output_path, "w") as f:
                json.dump(structured_data, f, indent=2)
            
            print(f"✅ Saved structured output for '{pdf_name}' at: {output_path}")
            print(f"   📊 Document title: {structured_data['document_title']}")
            print(f"   📑 Number of headings: {len(structured_data['headings'])}")
            
            # Count total points
            total_points = sum(len(heading['points']) for heading in structured_data['headings'])
            print(f"   📝 Total points: {total_points}")

if __name__ == "__main__":
    main()