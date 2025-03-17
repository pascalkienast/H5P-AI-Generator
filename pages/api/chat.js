import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Function to fetch available H5P library versions
async function getH5PLibraryVersions() {
  // Use hardcoded library versions instead of making API calls
  console.log('Using predefined H5P library versions');
  
  // Return hardcoded default versions
  const libraryVersions = {
    'H5P.MultiChoice': '1.16',
    'H5P.TrueFalse': '1.8',
    'H5P.Blanks': '1.14',
    'H5P.BranchingScenario': '1.7',
    'H5P.DragQuestion': '1.14',
    'H5P.CoursePresentation': '1.24',
    'H5P.QuestionSet': '1.17',
    'H5P.Summary': '1.10',
    'H5P.InteractiveBook': '1.7',
    'H5P.DragText': '1.10',
    'H5P.Accordion': '1.0',
    'H5P.Questionnaire': '1.3'
  };
  
  console.log('Using H5P library versions:', libraryVersions);
  return libraryVersions;
}

// Helper function to compare semantic versions
function compareVersions(v1, v2) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

// Get default version for a specific content type
function getDefaultVersion(contentType) {
  const defaults = {
      'H5P.MultiChoice': '1.16',
      'H5P.TrueFalse': '1.8',
      'H5P.Blanks': '1.14',
    'H5P.BranchingScenario': '1.7',
      'H5P.DragQuestion': '1.14',
    'H5P.CoursePresentation': '1.24',
    'H5P.QuestionSet': '1.17',
      'H5P.Summary': '1.10',
    'H5P.InteractiveBook': '1.7',
      'H5P.DragText': '1.10',
    'H5P.Accordion': '1.0',
    'H5P.Questionnaire': '1.3'
  };
  
  return defaults[contentType] || '1.0';
}

// Function to update library versions in the system prompt
function updateSystemPrompt(basePrompt, libraryVersions) {
  let updatedPrompt = basePrompt;
  
  // Update library versions in the content types list and examples
  Object.entries(libraryVersions).forEach(([library, version]) => {
    // Update in the SUPPORTED_CONTENT_TYPES section
    const libraryPattern = new RegExp(`'${library}'`, 'g');
    updatedPrompt = updatedPrompt.replace(libraryPattern, `'${library} ${version}'`);
  });
  
  return updatedPrompt;
}

// Function to read content type structure documentation
async function getContentTypeStructure(contentType) {
  try {
    // Map the library name to the corresponding markdown file
    const contentTypeToFile = {
      'H5P.MultiChoice': 'multichoice-structure-guide.md',
      'H5P.TrueFalse': 'truefalse-structure-guide.md',
      'H5P.Blanks': 'blanks-structure-guide.md',
      'H5P.BranchingScenario': 'branching-scenario-structure-guide.md',
      'H5P.DragQuestion': 'dragquestion-structure-guide.md',
      'H5P.CoursePresentation': 'course-presentation-structure-guide.md',
      'H5P.QuestionSet': 'questionset-structure-guide.md',
      'H5P.Summary': 'summary-structure-guide.md',
      'H5P.InteractiveBook': 'interactive-book-structure-guide.md',
      'H5P.DragText': 'dragtext-structure-guide.md',
      'H5P.Accordion': 'accordion-structure-guide.md',
      'H5P.Questionnaire': 'questionnaire-structure-guide.md'
    };
    
    const fileName = contentTypeToFile[contentType];
    if (!fileName) {
      throw new Error(`No documentation file found for content type: ${contentType}`);
    }
    
    // Read the file from the content-type-structures folder
    const filePath = path.join(process.cwd(), 'content-typ-structures', fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    return fileContent;
  } catch (error) {
    console.error(`Error reading content type structure for ${contentType}:`, error);
    return `No documentation available for ${contentType}`;
  }
}

// Append current H5P params to the system prompt if they exist
function appendCurrentH5PtoPrompt(systemPrompt, currentH5PParams) {
  if (!currentH5PParams) return systemPrompt;
  
  const h5pParamsString = JSON.stringify(currentH5PParams, null, 2);
  
  return `${systemPrompt}

## Current H5P Content to Update

The user has already generated an H5P module with the following parameters. They may want to modify or update this content. Use these parameters as a starting point for any changes they request. If they ask for changes, provide the complete updated JSON with the modifications applied.

\`\`\`json
${h5pParamsString}
\`\`\`

🚨 IMPORTANT 🚨
When providing refined content, you MUST:
1. Maintain the exact same top-level structure format as shown above
2. Keep ALL the same structure fields (library, params, metadata)
3. NEVER add a top-level "h5p" object to wrap the content
4. NEVER duplicate metadata in different locations
5. Always provide a complete updated JSON, not just the changed parts
6. Ensure the output is valid JSON inside a code block

Always verify your JSON structure before providing the final answer to prevent API errors.
`;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize AcademicCloud API configuration
const academicCloudConfig = {
  apiKey: process.env.AI_API_KEY,
  apiEndpoint: process.env.AI_API_ENDPOINT,
};

// Base system prompt for step 1 - content type selection
const baseSystemPromptStep1 = `You are an AI assistant specialized in creating H5P content. In this first step, your goal is to determine the most appropriate H5P content type for the user's needs and gather detailed information about the content they want to create. DO NOT generate any JSON or code structures yet.

SUPPORTED_CONTENT_TYPES:
1. Multiple Choice ('H5P.MultiChoice'): Contains a SINGLE question with multiple answer options where one or more can be correct. Limited to ONE question per content instance. Best for simple knowledge checks with predefined answers.

2. True/False ('H5P.TrueFalse'): Contains a SINGLE statement that can be marked as either true or false. Limited to ONE statement per content instance. Best for simple factual verification.

3. Fill in the Blanks ('H5P.Blanks'): Text passages with words removed that users must fill in. Good for testing vocabulary, grammar, or recall of specific terms in context.

4. Branching Scenario ('H5P.BranchingScenario'): A complex, non-linear, decision-based content type that creates personalized learning paths. Use ONLY for scenarios where different choices lead to different outcomes. Requires careful planning of the branching logic.

5. Drag and Drop ('H5P.DragQuestion'): Visual tasks where users drag items to designated drop zones. Excellent for categorization, matching, or spatial relationships. Requires images or clear visual organization.

6. Course Presentation ('H5P.CoursePresentation'): Slide-based presentation that can contain various content elements and interactive components on each slide. Good for sequenced learning with mixed content types.

7. Question Set ('H5P.QuestionSet'): A COLLECTION of different question types combined in one set. The BEST CHOICE when multiple questions are needed. Can include Multiple Choice, True/False, and Fill in the Blanks questions.

8. Summary ('H5P.Summary'): Presents a list of statements where users must identify which are correct. Good for reinforcing key points after a lesson.

9. Interactive Book ('H5P.InteractiveBook'): Multi-chapter content with various activities embedded in a book-like interface. Best for comprehensive learning materials divided into logical chapters.

10. Drag Text ('H5P.DragText'): Text where specific words are draggable to complete sentences or paragraphs. Excellent for language learning, sentence construction, or testing word order.

11. Accordion ('H5P.Accordion'): Collapsible content panels for organizing information into expandable sections. Good for FAQ-style content or breaking complex information into manageable chunks.

12. Questionnaire ('H5P.Questionnaire'): Collect feedback and opinions with various question types. Unlike quizzes, these don't have right/wrong answers but gather subjective input.

KEY LIMITATIONS TO CONSIDER:
- Multiple Choice, True/False: Each content instance can contain ONLY ONE question. For multiple questions, use Question Set instead.
- DragQuestion: Requires carefully defined drop zones and draggable elements with precise positioning.
- Branching Scenario: The most complex content type - consider simpler alternatives unless branching paths are essential.
- Interactive Book: Requires substantial content to justify the book format - otherwise, consider simpler content types.
- Fill in the Blanks: Uses special syntax (*answer*) to define the blank spaces and acceptable answers.
- Question Set: The ideal choice for creating a quiz with multiple questions of various types.

CONTENT TYPE SELECTION GUIDELINES:
- For a SINGLE question with choices: use Multiple Choice
- For a SINGLE true/false statement: use True/False
- For MULTIPLE questions of ANY type: use Question Set (this is crucial - don't use individual content types for multi-question quizzes)
- For text passages with missing words: use Fill in the Blanks
- For visual categorization or spatial tasks: use Drag and Drop
- For slide-based lessons with mixed content: use Course Presentation
- For decision trees with different paths: use Branching Scenario (only when truly needed)
- For language learning with word arrangement: use Drag Text
- For expandable/collapsible information sections: use Accordion
- For gathering user opinions or feedback: use Questionnaire
- For multi-chapter comprehensive content: use Interactive Book
- For testing knowledge of key points with true statements: use Summary

INSTRUCTIONS FOR STEP 1:
1. Analyze the user's request and ask clarifying questions to understand what they want to create.
2. If the user wants multiple questions, strongly recommend Question Set rather than individual question types.
3. Once you have enough information, recommend the most appropriate H5P content type.
4. Clearly state your recommendation using the exact library name (e.g., "I recommend using H5P.QuestionSet for this content").
5. Explain why this content type is the best fit and outline what the content will include.
6. If there are any special considerations or limitations with the chosen content type, mention them.
7. Summarize the details gathered so far that will guide the content creation.
8. DO NOT generate any JSON or code structures in this step - this will happen in step 2.

Your response should be conversational and focused on gathering information and recommending a content type. The actual content generation will happen in step 2 when the user clicks the "Generate H5P" button.`;

// Base system prompt for step 2 - H5P JSON generation
const baseSystemPromptStep2 = `You are an AI assistant specialized in creating H5P content. In this second step, your goal is to generate the complete, production-ready H5P JSON content based on the content type selected and information gathered in step 1.

INSTRUCTIONS FOR STEP 2:
1. Generate a complete, valid H5P JSON structure for the selected content type.
2. Include all necessary metadata, parameters, and content structure based on the discussions with the user.
3. Make sure the JSON is correctly formatted and follows the H5P structure requirements for the specific content type.
4. Include the JSON within a code block using the format: \`\`\`json {...} \`\`\`
5. After the JSON code block, briefly explain what you've created.

🚨 CRITICAL API COMPATIBILITY REQUIREMENTS 🚨
To ensure compatibility with the H5P-AI-Generator API, you MUST adhere to the following structure:

\`\`\`json
{
  "library": "H5P.ContentTypeName MajorVersion.MinorVersion",
  "params": {
    "metadata": {
      "title": "Content Title",
      "license": "U",
      "extraTitle": "Content Title"
      // Only include basic metadata fields here
    },
    "params": {
      // Content-specific parameters
    }
  }
}
\`\`\`

⚠️ IMPORTANT STRUCTURE RULES ⚠️
- DO NOT include a top-level "h5p" object
- DO NOT wrap your JSON in any additional objects
- DO NOT duplicate metadata in different places
- For "params.metadata", ONLY include: title, license, extraTitle (and optionally authors and changes)
- DO NOT include preloadedDependencies, mainLibrary, embedTypes, etc.
- Always include a proper subContentId as a UUID for each sub-content item (e.g., "subContentId": "761cca1f-6432-4a3e-912c-bd31a3bf53de")
- Always ensure extraTitle matches title in all metadata objects

📋 EXAMPLE FOR QUESTIONSET 📋
Here's a valid structure for a QuestionSet (simplied):

\`\`\`json
{
  "library": "H5P.QuestionSet 1.17",
  "params": {
    "metadata": {
      "title": "Quiz Title",
      "license": "U",
      "extraTitle": "Quiz Title"
    },
    "params": {
      "introPage": {
        "showIntroPage": true,
        "title": "Quiz Title",
        "introduction": "<p>Introduction text</p>",
        "startButtonText": "Start Quiz"
      },
      "questions": [
        {
          "library": "H5P.MultiChoice 1.16",
          "params": {
            "question": "<p>Question text?</p>",
            "answers": [
              {"text": "Answer 1", "correct": true},
              {"text": "Answer 2", "correct": false}
            ]
          },
          "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
          "metadata": {
            "title": "Question 1",
            "extraTitle": "Question 1"
          }
        }
      ],
      "progressType": "dots",
      "passPercentage": 50,
      "showResults": true
    }
  }
}
\`\`\`

Below are the detailed structure specifications for the selected content type. Follow these guidelines carefully for the content-specific structure, but ALWAYS use the simplified API-compatible metadata structure shown above:`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, currentH5PParams, modelProvider = 'claude', step = 'step1', contentType } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    // Fetch available H5P library versions
    const libraryVersions = await getH5PLibraryVersions();
    console.log('Available H5P library versions:', libraryVersions);
    
    // Choose the appropriate base system prompt based on the step
    let systemPrompt;
    
    if (step === 'step1') {
      console.log('Processing step 1: Content type selection');
      // Step 1: Content type selection
      systemPrompt = updateSystemPrompt(baseSystemPromptStep1, libraryVersions);
    } else if (step === 'step2') {
      console.log('Processing step 2: H5P JSON generation');
      // Step 2: H5P JSON generation
      
      if (!contentType) {
        return res.status(400).json({ error: 'Content type is required for step 2' });
      }
      
      // Get structure documentation for the selected content type
      const contentTypeDoc = await getContentTypeStructure(contentType);
      
      // Combine base prompt with content type structure documentation
      systemPrompt = `${baseSystemPromptStep2}

${contentTypeDoc}

IMPORTANT:
- Use the library version ${libraryVersions[contentType] || 'latest'} for ${contentType}
- Ensure all required fields are included
- Follow the structure format exactly as described above
- Make sure the content matches the user's requirements
- The JSON must be valid and properly formatted`;
    } else if (step === 'refine') {
      console.log('Processing refine step: H5P content refinement');
      // Refinement step: Include current H5P params if available
      
      // Start with step 2 prompt for consistency
      systemPrompt = baseSystemPromptStep2;
      
      // Add content type documentation if we know the content type
      if (contentType) {
        const contentTypeDoc = await getContentTypeStructure(contentType);
        systemPrompt = `${systemPrompt}

${contentTypeDoc}`;
      }
      
      // Add current H5P parameters if available
    if (currentH5PParams) {
      systemPrompt = appendCurrentH5PtoPrompt(systemPrompt, currentH5PParams);
      }
    } else {
      return res.status(400).json({ error: 'Invalid step parameter' });
    }
    
    console.log(`Using AI model: ${modelProvider}`);
    
    // Handle Claude API
    if (modelProvider === 'claude') {
      // Use Anthropic Claude API
      console.log('Sending request to Claude API');
      
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 4096,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        system: systemPrompt,
      });
      
      console.log('Claude response received');
      
      const hasJson = response.content.some(content => 
        content.type === 'text' && content.text.includes('```json')
      );
      
      console.log('Has JSON:', hasJson);
      
      return res.status(200).json({
        response: response.content,
        hasJson,
        needsMoreInfo: false
      });
    } else {
      // Use AcademicCloud Chat API with the specific model
      console.log(`Sending request to AcademicCloud Chat API with model: ${modelProvider}`);
      
      // Prepare messages array with system prompt
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ];
      
      // Make request to AcademicCloud Chat API
      const apiResponse = await axios.post(
        academicCloudConfig.apiEndpoint,
        {
          model: modelProvider,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 4096
        },
        {
          headers: {
            'Authorization': `Bearer ${academicCloudConfig.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('AcademicCloud response received');
      
      // Format the response to match the structure expected by the frontend
      const formattedContent = [
        { type: 'text', text: apiResponse.data.choices[0].message.content }
      ];
      
      const hasJson = formattedContent.some(content => 
        content.type === 'text' && content.text.includes('```json')
      );
      
      console.log('Has JSON:', hasJson);
      
      return res.status(200).json({
        response: formattedContent,
        hasJson,
        needsMoreInfo: false
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
} 