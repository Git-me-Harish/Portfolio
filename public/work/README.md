# Work Images

Place your project images here. Naming convention:

## Profile Photo
- /public/photo.jpg  (any aspect ratio, min 800x800)

## Highlighted Work (WorkGrid)
Each project needs:
- /public/work/{project-slug}-main.jpg   → main hero image (16:9, min 900x506)
- /public/work/{project-slug}-1.jpg      → thumbnail 1 (16:9)
- /public/work/{project-slug}-2.jpg      → thumbnail 2 (16:9)
- /public/work/{project-slug}-3.jpg      → thumbnail 3 (16:9)
- /public/work/{project-slug}-4.jpg      → thumbnail 4 (16:9)

## Current project slugs
- nlm       (Neural Language Model)
- cv        (Computer Vision Pipeline)
- rec       (Recommendation Engine)
- fraud     (Fraud Detection System)

## Enabling images in work-grid.tsx
Once you drop your images here, in work-grid.tsx:
1. Uncomment the <Image> tag in the ProjectCard component (replace the placeholder div)
2. Uncomment the <Image> tag in the detail view hero section
3. Uncomment the thumbnail <Image> tags in the thumbImages.map()

## Enabling profile photo in about-grid.tsx
1. Drop photo.jpg into /public/
2. In about-grid.tsx, uncomment:
   <Image src="/photo.jpg" alt="Your Name" fill className="object-cover" priority />
3. Remove the placeholder div below it
