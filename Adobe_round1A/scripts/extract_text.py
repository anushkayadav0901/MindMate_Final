import os
import cv2
import json
import argparse
from paddleocr import PaddleOCR

def extract_text_from_coordinates(image_path, json_path):
    # Initialize PaddleOCR with English
    ocr = PaddleOCR(use_angle_cls=True, lang="en")

    # Load image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not load image at {image_path}")
        return

    h, w = img.shape[:2]

    # Load and parse JSON data
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if isinstance(data, list) and len(data) == 1 and isinstance(data[0], str):
        data = json.loads(data[0])

    for i, item in enumerate(data):
        if isinstance(item, dict) and 'box' in item and item.get('text') is None:
            box = item['box']
            x1, y1, x2, y2 = box['x1'], box['y1'], box['x2'], box['y2']

            # Clamp coordinates
            x1, y1 = max(0, int(x1)), max(0, int(y1))
            x2, y2 = min(w, int(x2)), min(h, int(y2))

            if x1 >= x2 or y1 >= y2:
                print(f"Skipping invalid box {i}: {box}")
                continue

            cropped = img[y1:y2, x1:x2]
            if cropped is None or cropped.size == 0:
                print(f"Skipping empty crop {i}: {box}")
                continue

            result = ocr.ocr(cropped, cls=True)

            if result and result[0]:
                lines = []
                for line in result[0]:
                    text_segment = line[1][0].strip()
                    if text_segment:
                        lines.append(text_segment)
                        print(f"OCR line: {text_segment}")
                text = " ".join(lines)
                item['text'] = text
            else:
                print(f"Warning: No OCR result for box {i}")
                item['text'] = ""

    # Save the updated JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"OCR completed and saved to {json_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', required=True, help="Path to input image")
    parser.add_argument('--json', required=True, help="Path to JSON with coordinates")
    args = parser.parse_args()

    extract_text_from_coordinates(args.image, args.json)
