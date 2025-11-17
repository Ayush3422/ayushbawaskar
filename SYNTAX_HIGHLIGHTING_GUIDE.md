# Code Syntax Highlighting Reference

## 🎨 Current Color Scheme

The project uses a **Dracula-inspired** color scheme for code blocks:

```css
.keyword    { color: #ff79c6; } /* Pink - for import, def, class, etc. */
.string     { color: #50fa7b; } /* Green - for "strings" */
.comment    { color: #6272a4; } /* Gray - for # comments */
.function   { color: #8be9fd; } /* Cyan - for function names */
.number     { color: #bd93f9; } /* Purple - for 123, 45.6 */
.operator   { color: #ff79c6; } /* Pink - for +, -, =, etc. */
.builtin    { color: #ffb86c; } /* Orange - for print, len, etc. */
```

## 🔧 How to Customize

### Option 1: Change to Different Theme

Edit `src/index.css` and replace the colors:

**One Dark (VS Code style):**
```css
.keyword    { color: #c678dd; } /* Purple */
.string     { color: #98c379; } /* Green */
.comment    { color: #5c6370; } /* Gray */
.function   { color: #61afef; } /* Blue */
.number     { color: #d19a66; } /* Orange */
.operator   { color: #56b6c2; } /* Cyan */
.builtin    { color: #e5c07b; } /* Yellow */
```

**Monokai:**
```css
.keyword    { color: #f92672; } /* Red */
.string     { color: #e6db74; } /* Yellow */
.comment    { color: #75715e; } /* Gray */
.function   { color: #a6e22e; } /* Green */
.number     { color: #ae81ff; } /* Purple */
.operator   { color: #f92672; } /* Red */
.builtin    { color: #66d9ef; } /* Cyan */
```

**GitHub Light:**
```css
.keyword    { color: #d73a49; } /* Red */
.string     { color: #032f62; } /* Blue */
.comment    { color: #6a737d; } /* Gray */
.function   { color: #6f42c1; } /* Purple */
.number     { color: #005cc5; } /* Blue */
.operator   { color: #d73a49; } /* Red */
.builtin    { color: #005cc5; } /* Blue */
```

### Option 2: Use a Library

For more advanced syntax highlighting, you can add a library:

#### Prism.js (Lightweight)
```bash
npm install prismjs
```

```javascript
// In ProjectDetail.jsx
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Choose theme

useEffect(() => {
  Prism.highlightAll();
}, []);

// Update code block
<pre><code className="language-python">{project.codeSnippet}</code></pre>
```

#### React Syntax Highlighter (Full-featured)
```bash
npm install react-syntax-highlighter
```

```javascript
// In ProjectDetail.jsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Replace code block with:
<SyntaxHighlighter 
  language={project.language.toLowerCase()} 
  style={tomorrow}
  customStyle={{
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '8px',
    padding: '24px',
  }}
>
  {project.codeSnippet}
</SyntaxHighlighter>
```

## 🎯 Current Simple Approach

The current implementation uses **pure CSS** which:
- ✅ No extra dependencies (lightweight)
- ✅ Fast loading
- ✅ Easy to customize
- ✅ Works for basic highlighting
- ❌ Doesn't parse code (manual highlighting needed)

The code displays beautifully as-is, but colors are applied globally, not per-token.

## 💡 Best Practices

1. **Keep it readable** - Ensure good contrast
2. **Match your theme** - Stay consistent with dark theme
3. **Test accessibility** - Check color contrast ratios
4. **Mobile-friendly** - Ensure code is readable on small screens

## 🔍 Adding Manual Syntax Highlighting

If you want specific words highlighted in your code snippets, you can wrap them:

```javascript
codeSnippet: `# Example with manual highlighting
<span class="keyword">import</span> tensorflow <span class="keyword">as</span> tf

<span class="keyword">def</span> <span class="function">train_model</span>(data):
    <span class="comment"># Build model</span>
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(<span class="number">128</span>, activation=<span class="string">'relu'</span>)
    ])
    <span class="keyword">return</span> model`
```

But this gets tedious! For production, use a library like Prism.js or React Syntax Highlighter.

## 🚀 Recommendation

**For now:** Keep the current CSS-based approach (it's fast and looks good!)

**For later:** If you want perfect syntax highlighting, add React Syntax Highlighter when you have more time.

The current solution is beginner-friendly and keeps your bundle size small! 🎉
