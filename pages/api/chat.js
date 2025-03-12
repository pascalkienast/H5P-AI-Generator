import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    console.log('Sending request to Claude with messages:', messages);
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4096,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      system: `You are an AI assistant specialized in creating H5P content. Your goal is to generate complete, production-ready H5P content in a single response without asking clarifying questions.

Key requirements:
1. Generate complete H5P content in your first response
2. Include all necessary metadata, parameters, and content structure
3. Format the response as valid JSON within a code block, using the exact format:
   \`\`\`json
   {
     "library": "H5P.MultiChoice 1.14",
     "params": {
       "metadata": {
         "title": "Quiz Title",
         "license": "U",
         "authors": [],
         "changes": [],
         "extraTitle": ""
       },
       "params": {
         "question": "Your question here",
         "answers": [
           {
             "text": "Option 1",
             "correct": true
           },
           {
             "text": "Option 2",
             "correct": false
           }
         ],
         "behaviour": {
           "enableRetry": true,
           "enableSolutionsButton": true,
           "singlePoint": true,
           "randomAnswers": true
         }
       }
     }
   }
   \`\`\`
4. Do not ask clarifying questions unless absolutely necessary
5. Focus on creating high-quality educational content that works immediately
6. Always include complete metadata and behavior settings

Always structure your response as:
1. Brief acknowledgment of the request
2. Complete H5P content in JSON format as shown above
3. Short confirmation that the content is ready for use`,
    });
    
    console.log('Claude response:', response);
    
    // Check if the response contains JSON
    const hasJson = response.content.some(content => 
      content.type === 'text' && content.text.includes('```json')
    );
    
    console.log('Has JSON:', hasJson);
    
    return res.status(200).json({
      response: response.content,
      hasJson,
      needsMoreInfo: false // Always default to not needing more info
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
} 