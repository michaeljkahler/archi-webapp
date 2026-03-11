#!/usr/bin/env python3
"""
extract_images.py — Extracts images from ARCHI source PDFs.

Requires: pip install pymupdf Pillow

Usage:
    python extract_images.py

Place the source PDFs in ../_sources/ before running.
Extracted images are saved to ../public/images/.
"""

import os
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Error: PyMuPDF not installed. Run: pip install pymupdf")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCES_DIR = os.path.join(SCRIPT_DIR, '..', '_sources')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, '..', 'public', 'images')

# Species PDFs → output subdirectory mapping
SPECIES_PDFS = {
    'ARCHI_Chenes_Hetre.pdf': 'flowcharts',
    'ARCHI_Chataignier.pdf': 'flowcharts',
    'ARCHI_Platane.pdf': 'flowcharts',
    'ARCHI_Douglas.pdf': 'flowcharts',
    'ARCHI_Epicea.pdf': 'flowcharts',
    'ARCHI_Pins.pdf': 'flowcharts',
    'ARCHI_Sapin_pectine.pdf': 'flowcharts',
    'ARCHI_Cedre_Atlas.pdf': 'flowcharts',
}

GUIDE_PDF = 'ARCHI_Guide_utilisation.pdf'

# Minimum image size to extract (skip tiny icons)
MIN_WIDTH = 100
MIN_HEIGHT = 100


def extract_page_images(pdf_path, output_subdir, prefix):
    """Extract full page renders as PNG images."""
    out_dir = os.path.join(OUTPUT_DIR, output_subdir)
    os.makedirs(out_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    count = 0

    for page_num in range(len(doc)):
        page = doc[page_num]
        # Render at 2x for good quality
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)

        filename = f"{prefix}_p{page_num + 1}.png"
        filepath = os.path.join(out_dir, filename)
        pix.save(filepath)
        count += 1
        print(f"  Page {page_num + 1} → {filepath}")

    doc.close()
    return count


def extract_embedded_images(pdf_path, output_subdir, prefix):
    """Extract embedded images from PDF pages."""
    out_dir = os.path.join(OUTPUT_DIR, output_subdir)
    os.makedirs(out_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    count = 0

    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)

        for img_idx, img_info in enumerate(image_list):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image['image']
            image_ext = base_image['ext']
            width = base_image['width']
            height = base_image['height']

            if width < MIN_WIDTH or height < MIN_HEIGHT:
                continue

            filename = f"{prefix}_p{page_num + 1}_{img_idx}.png"
            filepath = os.path.join(out_dir, filename)

            with open(filepath, 'wb') as f:
                f.write(image_bytes)

            count += 1
            print(f"  Image {count}: {width}x{height} → {filepath}")

    doc.close()
    return count


def main():
    if not os.path.isdir(SOURCES_DIR):
        print(f"Error: Sources directory not found: {SOURCES_DIR}")
        print("Create _sources/ and place PDFs there. See _sources/README.md")
        sys.exit(1)

    total = 0

    # Extract flowchart pages from species PDFs
    for pdf_name, subdir in SPECIES_PDFS.items():
        pdf_path = os.path.join(SOURCES_DIR, pdf_name)
        if not os.path.isfile(pdf_path):
            print(f"Skipping {pdf_name} (not found)")
            continue

        prefix = pdf_name.replace('ARCHI_', '').replace('.pdf', '').lower()
        print(f"\nExtracting pages from {pdf_name}...")
        count = extract_page_images(pdf_path, subdir, prefix)
        total += count

    # Extract DMA illustrations from guide
    guide_path = os.path.join(SOURCES_DIR, GUIDE_PDF)
    if os.path.isfile(guide_path):
        print(f"\nExtracting DMA images from {GUIDE_PDF}...")
        count = extract_embedded_images(guide_path, 'dma', 'guide')
        total += count
    else:
        print(f"\nSkipping {GUIDE_PDF} (not found)")

    print(f"\nDone. Extracted {total} images total.")


if __name__ == '__main__':
    main()
