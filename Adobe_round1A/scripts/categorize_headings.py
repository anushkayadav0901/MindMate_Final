import json
import os
import re

# === HARDCODED PATHS ===
INPUT_FOLDER = "sample_dataset/outputs"
OUTPUT_FILE = "sample_dataset/schema/output_schema.json"

def categorize_level(index, page_number):
    if page_number == 0 and index == 0:
        return "Title"
    elif index == 0:
        return "H1"
    elif index == 1:
        return "H2"
    else:
        return "H3"

def extract_title_and_outline_from_page(data, page_number):
    heading_blocks = []

    for block in data:
        text = block.get("text", "").strip()
        name = block.get("name", "").lower()

        if name == "title" or text.endswith(":"):
            heading_blocks.append({
                "text": text,
                "box": block.get("box", {}),
                "page": page_number
            })

    heading_blocks.sort(key=lambda x: (x["box"]["y1"], x["box"]["x1"]))

    structured_headings = []
    for idx, block in enumerate(heading_blocks):
        level = categorize_level(idx, page_number)
        structured_headings.append({
            "level": level,
            "text": block["text"],
            "page": block["page"]
        })

    return heading_blocks, structured_headings

if __name__ == "__main__":
    document_title = "Document"
    outline = []
    page_file_map = {}

    for file in os.listdir(INPUT_FOLDER):
        if not file.endswith(".json"):
            continue

        match = re.search(r"page[-_](\d+)\.json", file)
        if match:
            page_number = int(match.group(1)) - 1
            page_file_map[page_number] = file

    for page_number in sorted(page_file_map):
        path = os.path.join(INPUT_FOLDER, page_file_map[page_number])
        with open(path, "r") as f:
            page_data = json.load(f)

        heading_blocks, page_outline = extract_title_and_outline_from_page(page_data, page_number)

        if page_number == 0 and heading_blocks:
            document_title = heading_blocks[0]["text"]

        outline.extend(page_outline)

    structured_output = {
        "title": document_title.strip(),
        "outline": outline
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(structured_output, f, indent=2)

    print(f"Saved structured output to: {OUTPUT_FILE}")
