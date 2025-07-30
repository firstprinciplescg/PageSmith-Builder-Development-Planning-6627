/**
 * BlockLoader - Manages loading and providing default blocks
 * Provides a library of pre-built landing page components
 */
export class BlockLoader {
  /**
   * Get default blocks for the block library
   * @returns {Array} Array of block definitions
   */
  static getDefaultBlocks() {
    return [
      {
        id: 'hero-simple',
        name: 'Simple Hero',
        category: 'hero',
        description: 'A clean hero section with headline and CTA',
        html: `
          <div class="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 class="text-5xl font-bold mb-6">Build Amazing Landing Pages</h1>
            <p class="text-xl mb-8 max-w-2xl mx-auto">Create professional landing pages in minutes with our drag-and-drop builder.</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Free
            </button>
          </div>
        `,
        previewHtml: `
          <div class="bg-blue-100 p-2 text-center text-xs">
            <div class="font-bold">Hero Section</div>
            <div class="text-gray-600">Headline + CTA</div>
          </div>
        `,
        editableFields: [
          { selector: 'h1', type: 'text', label: 'Headline' },
          { selector: 'p', type: 'textarea', label: 'Subtitle' },
          { selector: 'button', type: 'text', label: 'Button Text' }
        ]
      },
      {
        id: 'features-grid',
        name: 'Feature Grid',
        category: 'content',
        description: 'A 3-column feature grid with icons',
        html: `
          <div class="py-16 bg-white">
            <div class="max-w-6xl mx-auto px-6">
              <h2 class="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
              <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center">
                  <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-2xl">⚡</span>
                  </div>
                  <h3 class="text-xl font-semibold mb-3">Fast & Easy</h3>
                  <p class="text-gray-600">Build pages in minutes, not hours</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-2xl">🎨</span>
                  </div>
                  <h3 class="text-xl font-semibold mb-3">Beautiful Design</h3>
                  <p class="text-gray-600">Professional templates and components</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-2xl">📱</span>
                  </div>
                  <h3 class="text-xl font-semibold mb-3">Mobile Ready</h3>
                  <p class="text-gray-600">Responsive on all devices</p>
                </div>
              </div>
            </div>
          </div>
        `,
        previewHtml: `
          <div class="bg-gray-50 p-2 text-center text-xs">
            <div class="font-bold">Feature Grid</div>
            <div class="text-gray-600">3 columns</div>
          </div>
        `,
        editableFields: [
          { selector: 'h2', type: 'text', label: 'Section Title' }
        ]
      },
      {
        id: 'contact-form',
        name: 'Contact Form',
        category: 'form',
        description: 'Simple contact form with email and message',
        html: `
          <div class="py-16 bg-gray-50">
            <div class="max-w-2xl mx-auto px-6">
              <h2 class="text-3xl font-bold text-center mb-8">Get In Touch</h2>
              <form class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your message..."></textarea>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        `,
        previewHtml: `
          <div class="bg-blue-50 p-2 text-center text-xs">
            <div class="font-bold">Contact Form</div>
            <div class="text-gray-600">Name, Email, Message</div>
          </div>
        `,
        editableFields: [
          { selector: 'h2', type: 'text', label: 'Form Title' },
          { selector: 'button', type: 'text', label: 'Button Text' }
        ]
      },
      {
        id: 'cta-section',
        name: 'Call to Action',
        category: 'content',
        description: 'Centered CTA with background',
        html: `
          <div class="py-20 bg-blue-600 text-white text-center">
            <div class="max-w-4xl mx-auto px-6">
              <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p class="text-xl mb-8">Join thousands of users who are already building amazing pages.</p>
              <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                Start Building Now
              </button>
            </div>
          </div>
        `,
        previewHtml: `
          <div class="bg-blue-100 p-2 text-center text-xs">
            <div class="font-bold">CTA Section</div>
            <div class="text-gray-600">Call to Action</div>
          </div>
        `,
        editableFields: [
          { selector: 'h2', type: 'text', label: 'CTA Headline' },
          { selector: 'p', type: 'textarea', label: 'CTA Description' },
          { selector: 'button', type: 'text', label: 'Button Text' }
        ]
      },
      {
        id: 'footer-simple',
        name: 'Simple Footer',
        category: 'footer',
        description: 'Clean footer with links and copyright',
        html: `
          <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-6xl mx-auto px-6">
              <div class="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 class="font-bold text-lg mb-4">PageSmith</h3>
                  <p class="text-gray-400">Build beautiful landing pages with ease.</p>
                </div>
                <div>
                  <h4 class="font-semibold mb-4">Product</h4>
                  <ul class="space-y-2 text-gray-400">
                    <li><a href="#" class="hover:text-white">Features</a></li>
                    <li><a href="#" class="hover:text-white">Pricing</a></li>
                    <li><a href="#" class="hover:text-white">Templates</a></li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold mb-4">Company</h4>
                  <ul class="space-y-2 text-gray-400">
                    <li><a href="#" class="hover:text-white">About</a></li>
                    <li><a href="#" class="hover:text-white">Blog</a></li>
                    <li><a href="#" class="hover:text-white">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold mb-4">Support</h4>
                  <ul class="space-y-2 text-gray-400">
                    <li><a href="#" class="hover:text-white">Help Center</a></li>
                    <li><a href="#" class="hover:text-white">Documentation</a></li>
                    <li><a href="#" class="hover:text-white">API</a></li>
                  </ul>
                </div>
              </div>
              <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
                <p>&copy; 2024 PageSmith. All rights reserved.</p>
              </div>
            </div>
          </footer>
        `,
        previewHtml: `
          <div class="bg-gray-800 text-white p-2 text-center text-xs">
            <div class="font-bold">Footer</div>
            <div class="text-gray-300">Links & Copyright</div>
          </div>
        `,
        editableFields: [
          { selector: 'h3', type: 'text', label: 'Brand Name' }
        ]
      }
    ];
  }

  /**
   * Load blocks from JSON files (for future implementation)
   * @param {string} category - Block category to load
   * @returns {Promise<Array>} Promise resolving to blocks array
   */
  static async loadBlocksFromFiles(category = 'all') {
    // Future implementation for loading from external JSON files
    // For now, return default blocks
    return this.getDefaultBlocks();
  }
}