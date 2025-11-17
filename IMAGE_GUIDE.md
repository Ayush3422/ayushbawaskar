# Image & Screenshot Guide

## 📸 How to Add Project Images/GIFs

### 1. **Prepare Your Images**

Export key figures from your Jupyter notebooks:
```python
# In your notebook
import matplotlib.pyplot as plt

# Create your plot
plt.figure(figsize=(10, 6))
plt.plot(data)
plt.title("Training Accuracy Over Time")

# Save as high-quality image
plt.savefig('training-accuracy.png', dpi=300, bbox_inches='tight')

# For animations/GIFs (install imageio first)
import imageio
images = []
for epoch in range(num_epochs):
    # Generate frame
    plt.figure()
    plt.plot(data[:epoch])
    
    # Save frame to bytes
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    images.append(imageio.imread(buf))
    plt.close()

# Create GIF
imageio.mimsave('training-progress.gif', images, duration=0.5)
```

### 2. **Organize Your Images**

Create a folder structure in the `public` directory:

```
public/
  └── projects/
      ├── classifier-architecture.png
      ├── classifier-training.png
      ├── classifier-results.gif
      ├── classifier-confusion-matrix.png
      ├── chatbot-ui.png
      ├── chatbot-conversation.gif
      ├── dashboard-overview.gif
      └── ...
```

### 3. **Update Project Data**

The images are already referenced in `src/data/projects.js`:
```javascript
screenshots: [
  "/projects/classifier-architecture.png",
  "/projects/classifier-training.png",
  "/projects/classifier-results.gif",
  "/projects/classifier-confusion-matrix.png"
]
```

Just add your actual images to the `public/projects/` folder with matching filenames!

### 4. **Best Practices**

**Image Types:**
- `.png` - For static plots, diagrams, architecture
- `.gif` - For animations, training progress, UI demos
- `.jpg` - For photos (usually not needed for tech projects)

**Recommended Sizes:**
- Width: 1200-1600px for detail pages
- File size: < 2MB per image, < 5MB for GIFs
- Aspect ratio: 16:9 or 4:3 works well

**What to Capture:**
- 📊 Model architecture diagrams
- 📈 Training/validation curves
- 🎯 Confusion matrices & metrics
- 💻 Code execution outputs
- 🖼️ UI screenshots (for full-stack projects)
- 🎬 GIFs showing functionality

### 5. **Screenshot Tools**

**For Notebooks:**
- Jupyter: File → Download as → PNG/HTML then screenshot
- Google Colab: Right-click cell output → Save image
- VS Code: Use built-in screenshot tool

**For GIFs:**
- **Windows**: ScreenToGif (free)
- **Mac**: Kap (free)
- **Linux**: Peek (free)
- **Cross-platform**: OBS Studio

**For Diagrams:**
- Draw.io / diagrams.net (free)
- Excalidraw (simple sketches)
- Mermaid (code-based diagrams)

### 6. **Quick Image Optimization**

Reduce file sizes without losing quality:
```bash
# Install imagemagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Optimize PNG
magick convert input.png -quality 85 -resize 1600x output.png

# Optimize GIF
magick convert input.gif -fuzz 5% -layers Optimize output.gif
```

Or use online tools:
- TinyPNG.com (PNG/JPG compression)
- Ezgif.com (GIF optimization)

---

## 🔗 Notebook Links

### Add Colab/Kaggle Links

In `src/data/projects.js`, add your notebook URLs:

```javascript
{
  title: "AI Image Classifier",
  // ... other fields
  colab: "https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID",
  kaggle: "https://www.kaggle.com/code/USERNAME/NOTEBOOK",
  notebook: "https://github.com/USERNAME/REPO/blob/main/notebook.ipynb"
}
```

### How to Share Notebooks

**Google Colab:**
1. File → Share
2. Set to "Anyone with the link can view"
3. Copy the link

**Kaggle:**
1. Click "Share" on your notebook
2. Make it Public
3. Copy the URL

**GitHub:**
1. Push your `.ipynb` file to GitHub
2. GitHub automatically renders notebooks
3. Copy the file URL

---

## 🎨 Placeholder Images

Currently, the site shows placeholders if images are missing. When you add real images:
1. Place them in `public/projects/`
2. Use exact filenames from `projects.js`
3. Refresh the browser - images will load automatically!

No code changes needed! 🎉
