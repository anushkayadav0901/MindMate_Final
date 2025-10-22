#!/bin/bash
set -e

# Create output directories if they don't exist
mkdir -p sample_dataset/pdfs/input_pages
mkdir -p sample_dataset/outputs
mkdir -p sample_dataset/schema

# Step 1: Convert all PDFs to images with unique filenames
echo "Converting PDFs to images..."
for pdf in sample_dataset/pdfs/*.pdf; do
    filename=$(basename "$pdf" .pdf)
    echo "Processing $filename..."
    mutool convert -o "sample_dataset/pdfs/input_pages/${filename}_page-%d.png" -F png -O resolution=200 "$pdf"
done

# Step 2: Layout detection on all images
echo "Running layout detection..."
python scripts/layout_detection.py --config configs/layout_detection_yolo.yaml

# Step 3: Text extraction for all converted images
echo "Extracting text..."
for image in sample_dataset/pdfs/input_pages/*.png; do
    base=$(basename "$image" .png)
    echo "Processing $base..."
    python scripts/extract_text.py \
        --image "$image" \
        --json "sample_dataset/outputs/${base}.json"
done



echo "Pipeline completed successfully!"
