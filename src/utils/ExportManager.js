import JSZip from 'jszip';

/**
 * ExportManager - Handles page export functionality
 * Generates clean HTML, CSS, and JS files for download
 */
export class ExportManager {
  /**
   * Export the current page as a downloadable ZIP file
   * @param {Array} blocks - Array of canvas blocks to export
   */
  static async exportPage(blocks) {
    try {
      const zip = new JSZip();
      
      // Generate HTML content
      const htmlContent = this.generateHTML(blocks);
      const cssContent = this.generateCSS(blocks);
      const jsContent = this.generateJS(blocks);

      // Add files to ZIP
      zip.file('index.html', htmlContent);
      zip.file('style.css', cssContent);
      zip.file('script.js', jsContent);

      // Create assets folder for future use
      const assetsFolder = zip.folder('assets');
      
      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      this.downloadFile(content, 'my-landing-page.zip');
      
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * Generate complete HTML document
   * @param {Array} blocks - Canvas blocks
   * @returns {string} Complete HTML document
   */
  static generateHTML(blocks) {
    const blocksHtml = blocks.map(block => {
      // Apply any content updates to the HTML
      let html = block.html;
      
      if (block.content) {
        Object.entries(block.content).forEach(([selector, value]) => {
          // Simple text replacement - can be enhanced with proper DOM manipulation
          const regex = new RegExp(`(<[^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*>)([^<]*)(</[^>]*>)`, 'i');
          html = html.replace(regex, `$1${value}$3`);
        });
      }
      
      return html;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Landing Page</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    ${blocksHtml}
    <script src="script.js"></script>
</body>
</html>`;
  }

  /**
   * Generate CSS file with custom styles
   * @param {Array} blocks - Canvas blocks
   * @returns {string} CSS content
   */
  static generateCSS(blocks) {
    return `/* PageSmith Generated Styles */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Custom block styles */
${blocks.map(block => block.css || '').filter(Boolean).join('\n')}

/* Responsive utilities */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
}`;
  }

  /**
   * Generate JavaScript file with form handling and interactions
   * @param {Array} blocks - Canvas blocks
   * @returns {string} JavaScript content
   */
  static generateJS(blocks) {
    const hasForm = blocks.some(block => block.category === 'form');
    
    let jsContent = `// PageSmith Generated JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('PageSmith page loaded');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });`;

    if (hasForm) {
      jsContent += `
    
    // Form handling
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // You can replace this with your own form submission logic
            console.log('Form submitted:', data);
            alert('Thank you for your message! We\\'ll get back to you soon.');
            
            // Reset form
            this.reset();
        });
    });`;
    }

    jsContent += `
});`;

    return jsContent;
  }

  /**
   * Download file to user's computer
   * @param {Blob} content - File content
   * @param {string} filename - Name of the file
   */
  static downloadFile(content, filename) {
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}