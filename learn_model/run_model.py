#!/usr/bin/env python3
"""
Wrapper for convert_to_structure.py to make it easier to call from Flask
"""
import os
import sys
import json
import argparse
from convert_to_structure import main as convert_main

def process_pdf(input_pdf_path, output_json_path):
    """
    Process a PDF file and return structured content
    """
    try:
        # Call your main conversion function
        # Adjust based on how convert_to_structure.py works
        result = convert_main(input_pdf_path, output_json_path)
        
        if result and os.path.exists(output_json_path):
            with open(output_json_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            return {"error": "No output generated"}
            
    except Exception as e:
        return {"error": f"Model processing failed: {str(e)}"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process PDF to structured JSON')
    parser.add_argument('--input', required=True, help='Input PDF path')
    parser.add_argument('--output', required=True, help='Output JSON path')
    
    args = parser.parse_args()
    
    result = process_pdf(args.input, args.output)
    print(json.dumps(result, indent=2))