import os
import sys
import os.path as osp
import argparse
import json
from typing import List, Dict

sys.path.append(osp.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from pdf_extract_kit.utils.config_loader import load_config, initialize_tasks_and_models
import pdf_extract_kit.tasks

TASK_NAME = 'layout_detection'

def parse_args():
    parser = argparse.ArgumentParser(description="Run layout detection with config.")
    parser.add_argument('--config', required=True, help='Path to config YAML')
    return parser.parse_args()

def results_to_dict(results) -> List[Dict]:
    output = []
    for result in results:
        json_result = result.tojson(normalize=False)
        output.append(json_result)
    return output

def process_image_input(model, input_path: str, output_dir: str):
    results = model.predict_images(input_path, output_dir)
    return results_to_dict(results)

def save_as_json(data: List[Dict], output_dir: str, base_name: str = "layout"):
    os.makedirs(output_dir, exist_ok=True)
    output_path = osp.join(output_dir, f"{base_name}.json")
    
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Saved JSON: {output_path}")

def find_single_pdf(pdf_dir):
    for file in os.listdir(pdf_dir):
        if file.lower().endswith('.pdf'):
            return osp.join(pdf_dir, file)
    raise FileNotFoundError("No PDF found in the specified folder.")

def convert_pdf_to_images(pdf_path, output_image_dir):
    os.makedirs(output_image_dir, exist_ok=True)
    command = f"mutool convert -o {output_image_dir}/page-%d.png -F png -O resolution=300 {pdf_path}"
    print(f"Running: {command}")
    os.system(command)

def main(config_path):
    config = load_config(config_path)
    task_instances = initialize_tasks_and_models(config)
    model = task_instances[TASK_NAME]

    # === CHANGE: Locate PDF and convert to PNG ===
    pdf_folder = "sample_dataset/pdfs"
    image_folder = "sample_dataset/pdfs/input_pages"
    pdf_path = find_single_pdf(pdf_folder)
    
    convert_pdf_to_images(pdf_path, image_folder)

    output_dir = config.get('outputs', 'outputs/layout_detection')

    for file_name in os.listdir(image_folder):
        file_path = osp.join(image_folder, file_name)
        if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            print(f"Processing file: {file_path}")
            results = process_image_input(model, file_path, output_dir)
            if results:
                save_as_json(results, output_dir, base_name=osp.splitext(file_name)[0])
            else:
                print(f"No detection results obtained for {file_name}.")

if __name__ == "__main__":
    args = parse_args()
    main(args.config)
