// Supabase Edge Function for improving content
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
    const { content, instructions } = await req.json()
    
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
    
    // System prompt for improving content
    const systemPrompt = `You are an expert copywriter and content optimizer specializing in conversion-focused web copy. 
    Your task is to improve existing content based on specific instructions while maintaining:
    - The original intent and meaning
    - Appropriate tone and voice
    - SEO-friendly language
    - Conversion optimization principles
    - Professional quality
    Always return only the improved content, no explanations or quotes.`
    
    // Make OpenAI API call
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Improve this content: "${content}" Instructions: ${instructions} Return only the improved version.` }
      ],
      max_tokens: 300,
      temperature: 0.7
    })
    
    // Extract improved content from response
    const improvedContent = completion.data.choices[0].message.content.trim()
    
    // Return improved content
    return new Response(
      JSON.stringify({ content: improvedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to improve content' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})