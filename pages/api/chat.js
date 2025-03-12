import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../../utils/prompts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '', // Add fallback for empty string
    });
    
    // Convert the messages format to match Anthropic's expected format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
      max_tokens: 4000,
    });
    
    // Check if response contains JSON
    const hasJson = response.content.some(content => 
      content.type === 'text' && content.text.includes('```json')
    );
    
    return res.status(200).json({
      response: response.content,
      hasJson,
      needsMoreInfo: !hasJson // Add flag to indicate if more info is needed
    });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with Anthropic API',
      details: error.message 
    });
  }
} 