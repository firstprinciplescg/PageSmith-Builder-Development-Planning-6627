// Supabase Edge Function for secure OpenAI API calls
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3'

// Handle OPTIONS request for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request data
    const { prompt, contentType, context } = await req.json()
    
    // Get API key from environment variable (secure)
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Configure OpenAI
    const configuration = new Configuration({ apiKey })
    const openai = new OpenAIApi(configuration)
    
    // Get system prompt based on content type
    const systemPrompt = getSystemPrompt(contentType, context)
    
    // Make OpenAI API call
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: contentType === 'headline' ? 50 : contentType === 'cta' ? 20 : 200,
      temperature: 0.7
    })
    
    // Extract content from response
    const content = completion.data.choices[0].message.content.trim()
    
    // Log request to database (can be implemented if needed)
    // await logRequest(supabaseClient, prompt, contentType, context, content)
    
    // Return generated content
    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate content' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to get system prompt based on content type
function getSystemPrompt(contentType, context) {
  const baseContext = `You are an expert copywriter specializing in high-converting landing pages. You understand marketing psychology, persuasive writing, and web design best practices.`
  
  switch (contentType) {
    case 'headline':
      return `${baseContext} Your task is to create compelling headlines that:
        - Grab attention immediately
        - Communicate clear value propositions
        - Are optimized for conversion
        - Use power words and emotional triggers
        - Are concise but impactful (under 10 words when possible)
        Block context: ${context?.blockType || 'general'}
        Target audience: Professional and business users
        Tone: Professional, confident, action-oriented
        Return only the headline text, no quotes or explanations.`
    case 'paragraph':
      return `${baseContext} Your task is to write engaging paragraphs that:
        - Support the main headline or message
        - Provide clear benefits and value
        - Use persuasive language and social proof
        - Are scannable and easy to read
        - Include emotional appeals and logical reasoning
        - Are 2-4 sentences long
        Block context: ${context?.blockType || 'general'}
        Target audience: Professional and business users
        Tone: Professional, trustworthy, benefit-focused
        Return only the paragraph text, no quotes or explanations.`
    case 'cta':
      return `${baseContext} Your task is to create high-converting call-to-action button text that:
        - Creates urgency and desire
        - Uses action-oriented language
        - Is short and punchy (2-4 words ideal)
        - Removes friction and objections
        - Focuses on benefits, not features
        Block context: ${context?.blockType || 'general'}
        Target audience: Professional and business users
        Tone: Direct, action-oriented, benefit-driven
        Return only the button text, no quotes or explanations.`
    default:
      return `${baseContext} Create engaging, conversion-focused content for a landing page. Be concise, persuasive, and professional.`
  }
}