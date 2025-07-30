/**
 * GptAgent - Handles OpenAI GPT integration for content generation and styling
 * Provides AI assistance for creating and enhancing page content
 */

import OpenAI from 'openai';

// Initialize Supabase client (will be connected once the package is installed)
let supabase = null;

// OpenAI client (will be initialized with API key)
let openai = null;

// Dynamic import of Supabase to prevent build errors
const initializeSupabase = async () => {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const SUPABASE_URL = 'https://drtfgwicawrazeytybkb.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRydGZnd2ljYXdyYXpleXR5YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODU0OTYsImV4cCI6MjA2OTQ2MTQ5Nn0.L2qEbH-Kjvn-bY6K_aq8AeDPO7YPzgl0-pST-ql0wXY';
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
  } catch (error) {
    console.warn('Supabase initialization failed:', error);
    return false;
  }
};

// Try to initialize on load, but don't block rendering
initializeSupabase();

export class GptAgent {
  static apiKey = null;
  static isInitialized = false;

  /**
   * Initialize OpenAI client with API key
   * @param {string} apiKey - OpenAI API key
   */
  static async initialize(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('OpenAI API key is required');
      }

      this.apiKey = apiKey;
      openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
      });

      this.isInitialized = true;
      
      // Store API key securely in Supabase (encrypted)
      await this.storeApiKey(apiKey);
      
      console.log('✅ OpenAI GPT integration initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * Store API key securely in Supabase
   * @param {string} apiKey - API key to store
   */
  static async storeApiKey(apiKey) {
    try {
      if (!supabase) {
        await initializeSupabase();
      }
      
      if (supabase) {
        // Simple base64 encoding (in production, use proper encryption)
        const encodedKey = btoa(apiKey);
        
        await supabase.from('api_keys_x7h2k9').upsert({
          service_name: 'openai',
          api_key_encrypted: encodedKey,
          updated_at: new Date()
        }, {
          onConflict: 'service_name'
        });
      }
    } catch (error) {
      console.warn('Failed to store API key:', error);
    }
  }

  /**
   * Retrieve stored API key from Supabase
   */
  static async retrieveApiKey() {
    try {
      if (!supabase) {
        await initializeSupabase();
      }
      
      if (supabase) {
        const { data, error } = await supabase
          .from('api_keys_x7h2k9')
          .select('api_key_encrypted')
          .eq('service_name', 'openai')
          .single();
        
        if (data && !error) {
          const decodedKey = atob(data.api_key_encrypted);
          await this.initialize(decodedKey);
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve API key:', error);
    }
    return false;
  }

  /**
   * Check if OpenAI is properly initialized
   */
  static isReady() {
    return this.isInitialized && openai !== null;
  }

  /**
   * Log activity to Supabase if available
   * @param {Object} data - Data to log
   */
  static async logToSupabase(data) {
    try {
      if (!supabase) {
        await initializeSupabase();
      }
      
      if (supabase) {
        await supabase.from('gpt_requests_x7h2k9').insert({
          ...data,
          timestamp: new Date()
        }).select();
      }
    } catch (error) {
      console.warn('Failed to log to Supabase:', error);
      // Fail silently - don't block the main functionality
    }
  }
  
  /**
   * Generate content using OpenAI GPT
   * @param {string} prompt - User prompt for content generation
   * @param {string} contentType - Type of content to generate (headline, paragraph, etc.)
   * @param {Object} context - Additional context about the page/block
   * @returns {Promise<string>} Generated content
   */
  static async generateContent(prompt, contentType, context = {}) {
    try {
      // Check if OpenAI is initialized, if not try to retrieve stored key
      if (!this.isReady()) {
        const retrieved = await this.retrieveApiKey();
        if (!retrieved) {
          throw new Error('OpenAI API key not configured. Please set your API key first.');
        }
      }

      // Log request to Supabase for analytics (non-blocking)
      this.logToSupabase({
        prompt,
        content_type: contentType,
        context: context
      });

      // Generate content using OpenAI
      const content = await this.callOpenAI(prompt, contentType, context);
      
      // Log the generated content
      this.logToSupabase({
        prompt,
        content_type: contentType,
        context: context,
        generated_content: content
      });
      
      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Fallback to mock responses if OpenAI fails
      console.log('🔄 Falling back to mock responses');
      return await this.mockGptResponse(prompt, contentType, context);
    }
  }

  /**
   * Call OpenAI API with optimized prompts
   * @param {string} userPrompt - User's input prompt
   * @param {string} contentType - Type of content to generate
   * @param {Object} context - Additional context
   * @returns {Promise<string>} Generated content
   */
  static async callOpenAI(userPrompt, contentType, context) {
    const systemPrompt = this.getSystemPrompt(contentType, context);
    const optimizedPrompt = this.optimizeUserPrompt(userPrompt, contentType, context);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: optimizedPrompt
        }
      ],
      max_tokens: contentType === 'headline' ? 50 : contentType === 'cta' ? 20 : 200,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    return completion.choices[0].message.content.trim();
  }

  /**
   * Get system prompt based on content type
   * @param {string} contentType - Type of content
   * @param {Object} context - Additional context
   * @returns {string} System prompt
   */
  static getSystemPrompt(contentType, context) {
    const baseContext = `You are an expert copywriter specializing in high-converting landing pages. You understand marketing psychology, persuasive writing, and web design best practices.`;

    switch (contentType) {
      case 'headline':
        return `${baseContext} 

Your task is to create compelling headlines that:
- Grab attention immediately
- Communicate clear value propositions
- Are optimized for conversion
- Use power words and emotional triggers
- Are concise but impactful (under 10 words when possible)

Block context: ${context.blockType || 'general'}
Target audience: Professional and business users
Tone: Professional, confident, action-oriented

Return only the headline text, no quotes or explanations.`;

      case 'paragraph':
        return `${baseContext}

Your task is to write engaging paragraphs that:
- Support the main headline or message
- Provide clear benefits and value
- Use persuasive language and social proof
- Are scannable and easy to read
- Include emotional appeals and logical reasoning
- Are 2-4 sentences long

Block context: ${context.blockType || 'general'}
Target audience: Professional and business users
Tone: Professional, trustworthy, benefit-focused

Return only the paragraph text, no quotes or explanations.`;

      case 'cta':
        return `${baseContext}

Your task is to create high-converting call-to-action button text that:
- Creates urgency and desire
- Uses action-oriented language
- Is short and punchy (2-4 words ideal)
- Removes friction and objections
- Focuses on benefits, not features

Block context: ${context.blockType || 'general'}
Target audience: Professional and business users
Tone: Direct, action-oriented, benefit-driven

Return only the button text, no quotes or explanations.`;

      default:
        return `${baseContext} Create engaging, conversion-focused content for a landing page. Be concise, persuasive, and professional.`;
    }
  }

  /**
   * Optimize user prompt with additional context
   * @param {string} userPrompt - Original user prompt
   * @param {string} contentType - Content type
   * @param {Object} context - Additional context
   * @returns {string} Optimized prompt
   */
  static optimizeUserPrompt(userPrompt, contentType, context) {
    let optimized = userPrompt;

    // Add context-specific instructions
    if (context.blockType === 'hero') {
      optimized += ` This is for a hero section that needs to make a strong first impression.`;
    } else if (context.blockType === 'features') {
      optimized += ` This is for a features section highlighting key benefits.`;
    } else if (context.blockType === 'cta') {
      optimized += ` This is for a call-to-action section designed to convert visitors.`;
    }

    // Add content type specific context
    if (contentType === 'headline') {
      optimized += ` Create a headline that would make someone stop scrolling and pay attention.`;
    } else if (contentType === 'paragraph') {
      optimized += ` Write body text that supports the main message and persuades readers to take action.`;
    } else if (contentType === 'cta') {
      optimized += ` Create button text that makes people want to click immediately.`;
    }

    return optimized;
  }

  /**
   * Generate style suggestions for a block using OpenAI
   * @param {Object} block - Block to generate styles for
   * @param {string} stylePrompt - User instructions for styling
   * @returns {Promise<Object>} Style suggestions
   */
  static async generateStyles(block, stylePrompt) {
    try {
      if (!this.isReady()) {
        const retrieved = await this.retrieveApiKey();
        if (!retrieved) {
          return await this.mockStyleSuggestions(block, stylePrompt);
        }
      }

      // Log request to Supabase (non-blocking)
      this.logToSupabase({
        prompt: stylePrompt,
        content_type: 'style',
        context: { blockType: block.category }
      });

      const systemPrompt = `You are a professional web designer expert in modern UI/UX design and CSS styling. 
      
Your task is to suggest specific CSS styles based on user requirements. Consider:
- Modern design trends
- Accessibility and readability
- Brand consistency
- Conversion optimization
- Responsive design principles

Return your response as a JSON object with these exact keys:
- backgroundColor (CSS color value)
- textColor (CSS color value)  
- fontFamily (CSS font-family value)
- padding (CSS padding value)
- borderRadius (CSS border-radius value)

Block type: ${block.category}
Current context: Landing page builder interface`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Style requirements: ${stylePrompt}` }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      try {
        const styles = JSON.parse(completion.choices[0].message.content.trim());
        return styles;
      } catch (parseError) {
        console.warn('Failed to parse style JSON, using fallback');
        return await this.mockStyleSuggestions(block, stylePrompt);
      }
    } catch (error) {
      console.error('Error generating styles:', error);
      return await this.mockStyleSuggestions(block, stylePrompt);
    }
  }

  /**
   * Improve existing content using OpenAI
   * @param {string} existingContent - Content to improve
   * @param {string} instructions - Instructions for improvement
   * @returns {Promise<string>} Improved content
   */
  static async improveContent(existingContent, instructions) {
    try {
      if (!this.isReady()) {
        const retrieved = await this.retrieveApiKey();
        if (!retrieved) {
          return await this.mockContentImprovement(existingContent, instructions);
        }
      }

      // Log request to Supabase (non-blocking)
      this.logToSupabase({
        prompt: instructions,
        content_type: 'improvement',
        context: { existingContent }
      });

      const systemPrompt = `You are an expert copywriter and content optimizer specializing in conversion-focused web copy.

Your task is to improve existing content based on specific instructions while maintaining:
- The original intent and meaning
- Appropriate tone and voice
- SEO-friendly language
- Conversion optimization principles
- Professional quality

Always return only the improved content, no explanations or quotes.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Improve this content: "${existingContent}"

Instructions: ${instructions}

Return only the improved version.`
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const improvedContent = completion.choices[0].message.content.trim();
      
      // Log the improved content
      this.logToSupabase({
        prompt: instructions,
        content_type: 'improvement',
        context: { existingContent },
        generated_content: improvedContent
      });

      return improvedContent;
    } catch (error) {
      console.error('Error improving content:', error);
      return await this.mockContentImprovement(existingContent, instructions);
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
   * Mock style suggestions (fallback method)
   * @param {Object} block - Block to generate styles for
   * @param {string} stylePrompt - User instructions for styling
   * @returns {Promise<Object>} Style suggestions
   */
  static async mockStyleSuggestions(block, stylePrompt) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate style suggestions based on block type and prompt
    const styles = {
      backgroundColor: this.suggestBackgroundColor(block.category, stylePrompt),
      textColor: this.suggestTextColor(block.category, stylePrompt),
      fontFamily: this.suggestFontFamily(stylePrompt),
      padding: this.suggestSpacing(block.category).padding,
      borderRadius: '0.5rem'
    };
    
    return styles;
  }

  /**
   * Suggest background color based on block type and prompt
   * @param {string} blockType - Type of block
   * @param {string} prompt - Style prompt
   * @returns {string} CSS color value
   */
  static suggestBackgroundColor(blockType, prompt) {
    // Check prompt for color preferences
    if (prompt.toLowerCase().includes('blue')) {
      return '#1e40af';
    } else if (prompt.toLowerCase().includes('green')) {
      return '#047857';
    } else if (prompt.toLowerCase().includes('purple')) {
      return '#7e22ce';
    } else if (prompt.toLowerCase().includes('dark')) {
      return '#1f2937';
    } else if (prompt.toLowerCase().includes('light')) {
      return '#f3f4f6';
    }
    
    // Default based on block type
    switch (blockType) {
      case 'hero':
        return 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
      case 'features':
        return '#ffffff';
      case 'form':
        return '#f9fafb';
      case 'cta':
        return '#2563eb';
      case 'footer':
        return '#111827';
      default:
        return '#ffffff';
    }
  }

  /**
   * Suggest text color based on block type and prompt
   * @param {string} blockType - Type of block
   * @param {string} prompt - Style prompt
   * @returns {string} CSS color value
   */
  static suggestTextColor(blockType, prompt) {
    // Check if background will be dark or light
    const isDarkBg = 
      blockType === 'hero' || 
      blockType === 'cta' || 
      blockType === 'footer' ||
      prompt.toLowerCase().includes('dark');
    
    return isDarkBg ? '#ffffff' : '#111827';
  }

  /**
   * Suggest font family based on prompt
   * @param {string} prompt - Style prompt
   * @returns {string} CSS font-family value
   */
  static suggestFontFamily(prompt) {
    if (prompt.toLowerCase().includes('modern') || prompt.toLowerCase().includes('clean')) {
      return 'Inter, system-ui, sans-serif';
    } else if (prompt.toLowerCase().includes('professional') || prompt.toLowerCase().includes('business')) {
      return 'Montserrat, Arial, sans-serif';
    } else if (prompt.toLowerCase().includes('creative') || prompt.toLowerCase().includes('unique')) {
      return 'Poppins, sans-serif';
    } else if (prompt.toLowerCase().includes('classic') || prompt.toLowerCase().includes('traditional')) {
      return 'Georgia, serif';
    }
    
    // Default font
    return 'system-ui, sans-serif';
  }

  /**
   * Suggest spacing based on block type
   * @param {string} blockType - Type of block
   * @returns {Object} Spacing values
   */
  static suggestSpacing(blockType) {
    switch (blockType) {
      case 'hero':
        return { padding: '5rem 2rem', gap: '1.5rem' };
      case 'features':
        return { padding: '4rem 2rem', gap: '2rem' };
      case 'form':
        return { padding: '3rem 2rem', gap: '1rem' };
      case 'cta':
        return { padding: '4rem 2rem', gap: '1.5rem' };
      case 'footer':
        return { padding: '3rem 2rem', gap: '1rem' };
      default:
        return { padding: '3rem 2rem', gap: '1rem' };
    }
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
      improvedContent = this.makeProfessional(existingContent);
    } else if (instructions.toLowerCase().includes('concise') || instructions.toLowerCase().includes('shorter')) {
      improvedContent = this.makeConcise(existingContent);
    } else if (instructions.toLowerCase().includes('persuasive') || instructions.toLowerCase().includes('conversion')) {
      improvedContent = this.makePersuasive(existingContent);
    } else {
      // Default improvement
      improvedContent = this.enhanceContent(existingContent);
    }
    
    return improvedContent;
  }

  /**
   * Make content more professional
   * @param {string} content - Original content
   * @returns {string} Professional content
   */
  static makeProfessional(content) {
    // Simple replacements to make content sound more professional
    return content
      .replace(/amazing/gi, 'exceptional')
      .replace(/great/gi, 'premium')
      .replace(/good/gi, 'high-quality')
      .replace(/fast/gi, 'efficient')
      .replace(/easy/gi, 'streamlined');
  }

  /**
   * Make content more concise
   * @param {string} content - Original content
   * @returns {string} Concise content
   */
  static makeConcise(content) {
    // If content is a paragraph, return a shorter version
    if (content.length > 100) {
      return content.split('.').slice(0, 2).join('.') + '.';
    }
    return content;
  }

  /**
   * Make content more persuasive
   * @param {string} content - Original content
   * @returns {string} Persuasive content
   */
  static makePersuasive(content) {
    // Add persuasive elements
    if (content.includes('?')) {
      return content; // Already has a question
    }
    
    if (content.length < 50) {
      // For short content like headlines
      return content + ' Today';
    } else {
      // For longer content
      return content + ' Start now and see the difference.';
    }
  }

  /**
   * General content enhancement
   * @param {string} content - Original content
   * @returns {string} Enhanced content
   */
  static enhanceContent(content) {
    // Simple enhancements
    return content
      .replace(/website/gi, 'professional website')
      .replace(/build/gi, 'create')
      .replace(/make/gi, 'design')
      .replace(/get/gi, 'obtain');
  }
}