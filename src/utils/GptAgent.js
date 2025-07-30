/**
 * GptAgent - Handles OpenAI GPT integration for content generation and styling
 * Provides AI assistance for creating and enhancing page content
 */
import supabase from '../lib/supabase';

export class GptAgent {
  static isInitialized = false;
  
  /**
   * Check if GPT is ready to use
   */
  static isReady() {
    return this.isInitialized;
  }
  
  /**
   * Initialize GPT agent
   * This no longer requires API key as we're using Supabase Edge Functions
   */
  static async initialize() {
    try {
      // Check if user is authenticated (optional)
      // const { data: { user } } = await supabase.auth.getUser();
      
      // Mark as initialized - we don't need API key client-side anymore
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize GPT agent:', error);
      return false;
    }
  }
  
  /**
   * Generate content using Supabase Edge Function
   * @param {string} prompt - User prompt for content generation
   * @param {string} contentType - Type of content to generate (headline, paragraph, etc.)
   * @param {Object} context - Additional context about the page/block
   * @returns {Promise<string>} Generated content
   */
  static async generateContent(prompt, contentType, context = {}) {
    try {
      // Call the secure Edge Function instead of OpenAI directly
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt, contentType, context }
      });
      
      if (error) throw new Error(error.message || 'Failed to generate content');
      
      // Log request to Supabase for analytics (non-blocking)
      this.logToSupabase({
        prompt,
        content_type: contentType,
        context: context,
        generated_content: data.content
      });
      
      return data.content;
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to mock responses if the API call fails
      return await this.mockGptResponse(prompt, contentType, context);
    }
  }
  
  /**
   * Improve existing content using Supabase Edge Function
   * @param {string} existingContent - Content to improve
   * @param {string} instructions - Instructions for improvement
   * @returns {Promise<string>} Improved content
   */
  static async improveContent(existingContent, instructions) {
    try {
      // Call the secure Edge Function instead of OpenAI directly
      const { data, error } = await supabase.functions.invoke('improve-content', {
        body: { content: existingContent, instructions }
      });
      
      if (error) throw new Error(error.message || 'Failed to improve content');
      
      // Log the improved content
      this.logToSupabase({
        prompt: instructions,
        content_type: 'improvement',
        context: { existingContent },
        generated_content: data.content
      });
      
      return data.content;
    } catch (error) {
      console.error('Error improving content:', error);
      return await this.mockContentImprovement(existingContent, instructions);
    }
  }
  
  /**
   * Log activity to Supabase
   * @param {Object} data - Data to log
   */
  static async logToSupabase(data) {
    try {
      await supabase.from('gpt_requests_x7h2k9').insert({
        ...data,
        timestamp: new Date()
      }).select();
    } catch (error) {
      console.warn('Failed to log to Supabase:', error);
      // Fail silently - don't block the main functionality
    }
  }
  
  /**
   * Mock GPT response for development/demo purposes (fallback)
   * @param {string} prompt - User prompt
   * @param {string} contentType - Type of content
   * @param {Object} context - Additional context
   * @returns {Promise<string>} Generated content
   */
  static async mockGptResponse(prompt, contentType, context) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate content based on type
    switch (contentType) {
      case 'headline':
        return this.generateHeadline(prompt, context);
      case 'paragraph':
        return this.generateParagraph(prompt, context);
      case 'cta':
        return this.generateCTA(prompt, context);
      default:
        return 'Generated content will appear here.';
    }
  }
  
  /**
   * Generate a headline based on prompt (fallback method)
   * @param {string} prompt - User prompt
   * @param {Object} context - Additional context
   * @returns {string} Generated headline
   */
  static generateHeadline(prompt, context) {
    const headlines = [
      'Transform Your Online Presence Today',
      'Build Beautiful Websites Without Code',
      'Create Landing Pages That Convert',
      'Design Like a Pro, No Experience Required',
      'Your Vision, Our Technology',
      'Websites That Work As Hard As You Do',
      'Stunning Designs Made Simple',
      'Unlock Your Website\'s Potential'
    ];
    
    // Use keywords from prompt to influence selection if available
    if (prompt.toLowerCase().includes('professional')) {
      return 'Professional Websites Built in Minutes';
    } else if (prompt.toLowerCase().includes('easy') || prompt.toLowerCase().includes('simple')) {
      return 'Simple Website Building for Everyone';
    } else if (prompt.toLowerCase().includes('fast') || prompt.toLowerCase().includes('quick')) {
      return 'Launch Your Website in Record Time';
    }
    
    // Otherwise return random headline
    return headlines[Math.floor(Math.random() * headlines.length)];
  }
  
  /**
   * Generate a paragraph based on prompt (fallback method)
   * @param {string} prompt - User prompt
   * @param {Object} context - Additional context
   * @returns {string} Generated paragraph
   */
  static generateParagraph(prompt, context) {
    const paragraphs = [
      'Our intuitive drag-and-drop builder makes website creation accessible to everyone. No coding skills required—just your creativity and our powerful tools. Build professional-looking pages in minutes that would normally take days with traditional methods.',
      'Stand out from the competition with a beautifully designed website that captures your brand\'s essence. Our templates are crafted by professional designers and optimized for engagement, ensuring your visitors stay longer and convert better.',
      'Every business deserves a great website. Our platform provides enterprise-level features at prices small businesses can afford. Start with our free tier and scale as you grow, with no hidden fees or complicated upgrade paths.',
      'Join thousands of satisfied customers who have transformed their online presence with our platform. Our average user launches their first page within 30 minutes of signing up, and reports a 40% increase in engagement compared to their old websites.'
    ];
    
    // Use context to influence selection if available
    if (context.blockType === 'hero') {
      return 'Create stunning landing pages in minutes with our intuitive drag-and-drop builder. No coding required. Start with professionally designed templates and customize every element to match your brand. Launch faster and convert better with PageSmith.';
    } else if (context.blockType === 'features') {
      return 'Our platform offers everything you need to build high-converting pages. Enjoy responsive designs, SEO optimization, fast loading speeds, and built-in analytics—all without touching a line of code. Focus on growing your business while we handle the technical details.';
    }
    
    // Otherwise return random paragraph
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
  }
  
  /**
   * Generate a call-to-action button text (fallback method)
   * @param {string} prompt - User prompt
   * @param {Object} context - Additional context
   * @returns {string} Generated CTA text
   */
  static generateCTA(prompt, context) {
    const ctas = [
      'Get Started Free',
      'Start Building Now',
      'Try It Free',
      'Launch Your Site',
      'Join Free For 14 Days',
      'See It In Action',
      'Create Your Page',
      'Start Your Free Trial'
    ];
    
    // Use prompt to influence selection if available
    if (prompt.toLowerCase().includes('buy') || prompt.toLowerCase().includes('purchase')) {
      return 'Buy Now';
    } else if (prompt.toLowerCase().includes('learn') || prompt.toLowerCase().includes('more')) {
      return 'Learn More';
    } else if (prompt.toLowerCase().includes('contact') || prompt.toLowerCase().includes('support')) {
      return 'Contact Us';
    }
    
    // Otherwise return random CTA
    return ctas[Math.floor(Math.random() * ctas.length)];
  }
  
  /**
   * Mock content improvement (fallback method)
   * @param {string} existingContent - Content to improve
   * @param {string} instructions - Instructions for improvement
   * @returns {Promise<string>} Improved content
   */
  static async mockContentImprovement(existingContent, instructions) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Apply basic improvements based on instructions
    let improvedContent = existingContent;
    
    if (instructions.toLowerCase().includes('professional')) {
      improvedContent = improvedContent
        .replace(/amazing/gi, 'exceptional')
        .replace(/great/gi, 'premium')
        .replace(/good/gi, 'high-quality')
        .replace(/fast/gi, 'efficient')
        .replace(/easy/gi, 'streamlined');
    } else if (instructions.toLowerCase().includes('concise') || instructions.toLowerCase().includes('shorter')) {
      if (improvedContent.length > 100) {
        improvedContent = improvedContent.split('.').slice(0, 2).join('.') + '.';
      }
    } else if (instructions.toLowerCase().includes('persuasive') || instructions.toLowerCase().includes('conversion')) {
      if (!improvedContent.includes('?')) {
        if (improvedContent.length < 50) {
          improvedContent = improvedContent + ' Today';
        } else {
          improvedContent = improvedContent + ' Start now and see the difference.';
        }
      }
    } else {
      improvedContent = improvedContent
        .replace(/website/gi, 'professional website')
        .replace(/build/gi, 'create')
        .replace(/make/gi, 'design')
        .replace(/get/gi, 'obtain');
    }
    
    return improvedContent;
  }
}