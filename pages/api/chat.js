import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';

// Function to fetch available H5P library versions
async function getH5PLibraryVersions() {
  try {
    const response = await fetch(`${process.env.H5P_API_ENDPOINT}/h5p/libraries`);
    if (!response.ok) {
      throw new Error(`Failed to fetch H5P libraries: ${response.statusText}`);
    }
    const libraries = await response.json();
    
    // Create a map of library names to their latest versions
    const libraryVersions = {};
    
    if (Array.isArray(libraries)) {
      libraries
        // Only consider runnable libraries
        .filter(lib => lib.runnable === true)
        .forEach(lib => {
          if (lib.machineName && lib.majorVersion && lib.minorVersion) {
            const name = lib.machineName;
            const version = `${lib.majorVersion}.${lib.minorVersion}`;
            
            // Only update if this is a newer version
            if (!libraryVersions[name] || version > libraryVersions[name]) {
              libraryVersions[name] = version;
            }
          }
        });
    }
    
    // Log the found versions
    console.log('Found H5P library versions:', libraryVersions);
    
    // If no versions were found, throw an error
    if (Object.keys(libraryVersions).length === 0) {
      throw new Error('No valid library versions found in API response');
    }
    
    return libraryVersions;
  } catch (error) {
    console.error('Error fetching H5P libraries:', error);
    // Return default versions if API call fails
    const defaultVersions = {
      'H5P.MultiChoice': '1.16',
      'H5P.TrueFalse': '1.8',
      'H5P.Blanks': '1.14',
      'H5P.InteractiveVideo': '1.27',
      'H5P.BranchingScenario': '1.8',
      'H5P.DragQuestion': '1.14',
      'H5P.CoursePresentation': '1.25',
      'H5P.QuestionSet': '1.20',
      'H5P.Summary': '1.10',
      'H5P.DialogCards': '1.8',
      'H5P.InteractiveBook': '1.11',
      'H5P.MarkTheWords': '1.11',
      'H5P.Flashcards': '1.5',
      'H5P.ImageHotspots': '1.10',
      'H5P.ArithmeticQuiz': '1.1',
      'H5P.DragText': '1.10',
      'H5P.Essay': '1.5',
      'H5P.FindTheHotspot': '1.0',
      'H5P.Audio': '1.5',
      'H5P.Accordion': '1.0'
    };
    console.log('Using default library versions:', defaultVersions);
    return defaultVersions;
  }
}

// Function to update library versions in the system prompt
function updateSystemPrompt(basePrompt, libraryVersions) {
  let updatedPrompt = basePrompt;
  
  // Update library versions in the content types list and examples
  Object.entries(libraryVersions).forEach(([library, version]) => {
    // Update in the SUPPORTED_CONTENT_TYPES section
    const libraryPattern = new RegExp(`'${library}'`, 'g');
    updatedPrompt = updatedPrompt.replace(libraryPattern, `'${library} ${version}'`);
    
    // Update in JSON examples
    const jsonLibraryPattern = new RegExp(`"library":\\s*"${library}"`, 'g');
    updatedPrompt = updatedPrompt.replace(jsonLibraryPattern, `"library": "${library} ${version}"`);
    
    // Update nested libraries in examples
    const nestedLibraryPattern = new RegExp(`"library":\\s*"${library}"`, 'g');
    updatedPrompt = updatedPrompt.replace(nestedLibraryPattern, `"library": "${library} ${version}"`);
  });
  
  return updatedPrompt;
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

When the user asks for changes, always respond with a complete updated JSON structure, not just the changed parts. Ensure the output is valid JSON inside a code block.`;
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

// Base system prompt without version numbers
const baseSystemPrompt = `You are an AI assistant specialized in creating H5P content. Your goal is to generate complete, production-ready H5P content in a single response without asking clarifying questions.

SUPPORTED_CONTENT_TYPES:
1. Multiple Choice ('H5P.MultiChoice'): A question with multiple answer options where one or more can be correct.
2. True/False ('H5P.TrueFalse'): A statement that can be marked as either true or false.
3. Fill in the Blanks ('H5P.Blanks'): Text with words removed that the user must fill in.
4. Interactive Video ('H5P.InteractiveVideo'): Video with interactive elements at specific timestamps.
5. Branching Scenario ('H5P.BranchingScenario'): A complex, non-linear, decision-based content type that creates personalized learning paths.
6. Drag and Drop ('H5P.DragQuestion'): Tasks where users drag items to designated drop zones.
7. Course Presentation ('H5P.CoursePresentation'): Slide-based presentation with interactive elements.
8. Question Set ('H5P.QuestionSet'): A sequence of different question types combined in one set.
9. Summary ('H5P.Summary'): Allows users to select correct statements from a list.
10. Dialog Cards ('H5P.DialogCards'): Two-sided cards for practicing/memorizing information.
11. Interactive Book ('H5P.InteractiveBook'): Multi-chapter content with various activities.
12. Mark the Words ('H5P.MarkTheWords'): Users identify specific words in a text by clicking on them.
13. Flashcards ('H5P.Flashcards'): Card-based memory and learning exercises.
14. Image Hotspots ('H5P.ImageHotspots'): Interactive points on an image that reveal information.
15. Arithmetic Quiz ('H5P.ArithmeticQuiz'): Mathematical operations practice with time limits.
16. Drag Text ('H5P.DragText'): Text where words are draggable to complete sentences.
17. Essay ('H5P.Essay'): Long-form text responses with keyword-based assessment.
18. Find the Hotspot ('H5P.FindTheHotspot'): Users must locate specific areas in an image.
19. Audio ('H5P.Audio'): Audio files with player controls.
20. Accordion ('H5P.Accordion'): Collapsible content panels for organizing information.

CONTENT TYPE SELECTION GUIDELINES:
- For simple quizzes or single questions, use Multiple Choice or True/False
- For text-based learning exercises, use Fill in the Blanks or Mark the Words
- For visual content organization, use Drag and Drop or Image Hotspots 
- For educational videos with questions, use Interactive Video (with caution)
- For slide-based presentations, use Course Presentation
- For mixed question types in sequence, use Question Set
- For vocabulary or term learning, use Dialog Cards or Flashcards
- For complex, decision-based scenarios, use Branching Scenario ONLY when truly needed
- For mathematical practice, use Arithmetic Quiz
- For language learning with text arrangement, use Drag Text
- For audio-based content, use Audio content type
- For hierarchical organization of content, use Accordion

KNOWN ISSUES:
- Interactive Video: May sometimes generate content that fails to load properly or create corrupt H5P files
- Branching Scenario: Complex structure requires careful planning
- Complex content types may exceed size limitations in some systems

DEFAULT RECOMMENDATIONS:
1. For simple, single-topic educational content, start with Multiple Choice, True/False, or Fill in the Blanks
2. For most quiz requests, Multiple Choice is the safest and most reliable option
3. Only suggest Branching Scenario when:
   - The user specifically requests it
   - The content absolutely requires non-linear, decision-based paths
   - The user needs a simulation or scenario-based training
4. For image-based learning, Image Hotspots often provides better engagement than static images
5. When creating educational assessments, Question Set creates a better organized experience than individual questions

PROCESS:
1. Ask clarifying questions to understand what the user wants to create.
2. Gather specific details about the content, such as:
   - The subject matter and educational goal
   - The target audience
   - Specific questions, answers, or content to include
   - Preferred content type (if the user doesn't specify, recommend the SIMPLEST appropriate option that meets their needs)
3. After 2-3 questions, generate the JSON parameters based on user input.

Key requirements:
1. Generate complete H5P content in your first response
2. Include all necessary metadata, parameters, and content structure
3. Format the response as valid JSON within a code block
4. Do not ask clarifying questions unless absolutely necessary
5. Focus on creating high-quality educational content that works immediately
6. Always include complete metadata and behavior settings
7. For multiple questions, use H5P.QuestionSet as the main library

Example JSON Structure for Branching Scenario:
\`\`\`json
{
  "library": "H5P.BranchingScenario",
  "params": {
    "metadata": {
      "title": "Your Title",
      "license": "U",
      "authors": [
        {
          "name": "Author Name",
          "role": "Author"
        }
      ]
    },
    "params": {
      "branchingScenario": {
        "content": [
          {
            "type": {
              "library": "H5P.BranchingQuestion",
              "params": {
                "branchingQuestion": {
                  "question": "Your question here",
                  "alternatives": [
                    {
                      "text": "Option 1",
                      "nextContentId": "1",
                      "feedbackText": "Feedback for option 1"
                    },
                    {
                      "text": "Option 2",
                      "nextContentId": "2",
                      "feedbackText": "Feedback for option 2"
                    }
                  ]
                }
              }
            },
            "contentId": "0",
            "nextContentId": "-1"
          },
          {
            "type": {
              "library": "H5P.AdvancedText",
              "params": {
                "text": "<p>Your content here</p>"
              }
            },
            "contentId": "1",
            "nextContentId": "-1"
          }
        ],
        "startScreen": {
          "startScreenTitle": "Your Title",
          "startScreenSubtitle": "Optional subtitle"
        },
        "endScreens": [
          {
            "endScreenTitle": "Completion Title",
            "endScreenSubtitle": "Optional completion subtitle",
            "contentId": "-1"
          }
        ]
      }
    }
  }
}
\`\`\`

Example JSON Structure for Question Set:
\`\`\`json
{
  "library": "H5P.QuestionSet",
  "params": {
    "metadata": {
      "title": "Quiz Title",
      "license": "U",
      "authors": [],
      "changes": [],
      "extraTitle": ""
    },
    "params": {
      "introPage": {
        "showIntroPage": true,
        "title": "Quiz Title",
        "introduction": "Quiz introduction text"
      },
      "questions": [
        {
          "library": "H5P.MultiChoice",
          "params": {
            "question": "Your question here",
            "answers": [
              {
                "text": "Option 1",
                "correct": true,
                "tipsAndFeedback": {
                  "tip": "",
                  "chosenFeedback": "Correct!",
                  "notChosenFeedback": ""
                }
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
              "randomAnswers": true,
              "showSolutionsRequiresInput": true
            },
            "l10n": {
              "nextQuestion": "Next Question",
              "showSolution": "Show Solution",
              "retry": "Retry"
            },
            "UI": {
              "showQuestionNumber": true,
              "questionLabel": "Question"
            }
          }
        }
      ],
      "progressType": "dots",
      "passPercentage": 50,
      "showResults": true,
      "randomQuestions": true,
      "endGame": {
        "showResultPage": true,
        "showSolutionButton": true,
        "showRetryButton": true
      },
      "texts": {
        "prevButton": "Previous",
        "nextButton": "Next",
        "finishButton": "Finish",
        "textualProgress": "Question: @current of @total",
        "questionLabel": "Question",
        "jumpToQuestion": "Jump to question %d",
        "readSpeakerProgress": "Question @current of @total",
        "unansweredText": "Unanswered",
        "answeredText": "Answered",
        "currentQuestionText": "Current question"
      }
    }
  }
}
\`\`\`

Additional JSON Structures for Other Content Types:

For True/False:
\`\`\`json
{
  "library": "H5P.TrueFalse",
  "params": {
    "params": {
      "question": "Is this statement true?",
      "correct": "true",
      "l10n": {
        "trueText": "True",
        "falseText": "False",
        "correctText": "Correct!",
        "wrongText": "Incorrect!"
      },
      "behaviour": {
        "enableRetry": true,
        "enableSolutionsButton": true,
        "confirmCheckDialog": false,
        "confirmRetryDialog": false,
        "autoCheck": false
      }
    },
    "metadata": {
      "title": "Title of the True/False Question",
      "license": "U"
    }
  }
}
\`\`\`

For Fill in the Blanks:
\`\`\`json
{
  "library": "H5P.Blanks",
  "params": {
    "params": {
      "text": "Paris is the capital of *France:French Republic*.",
      "questions": ["France"],
      "behaviour": {
        "caseSensitive": false,
        "showSolutionsRequiresInput": true,
        "autoCheck": false,
        "enableRetry": true,
        "enableSolutionsButton": true,
        "acceptSpellingErrors": false
      }
    },
    "metadata": {
      "title": "Title of the Fill in the Blanks",
      "license": "U"
    }
  }
}
\`\`\`

For Drag and Drop:
\`\`\`json
{
  "library": "H5P.DragQuestion",
  "params": {
    "params": {
      "question": {
        "settings": {
          "background": {
            "path": "https://example.com/background.jpg",
            "mime": "image/jpeg",
            "copyright": {
              "license": "U"
            }
          }
        },
        "task": {
          "elements": [
            {
              "type": "text",
              "x": 10,
              "y": 10,
              "width": 30,
              "height": 30,
              "task": "Drag this element"
            }
          ],
          "dropZones": [
            {
              "x": 50,
              "y": 50,
              "width": 40,
              "height": 40,
              "correctElements": [0]
            }
          ]
        }
      }
    },
    "metadata": {
      "title": "Title of the Drag and Drop",
      "license": "U"
    }
  }
}
\`\`\`

For Image Hotspots:
\`\`\`json
{
  "library": "H5P.ImageHotspots",
  "params": {
    "params": {
      "image": {
        "path": "https://example.com/image.jpg",
        "mime": "image/jpeg",
        "copyright": {
          "license": "U"
        }
      },
      "hotspots": [
        {
          "position": {
            "x": 30,
            "y": 30
          },
          "content": "<p>Information about this hotspot</p>",
          "header": "Hotspot Title"
        }
      ],
      "hotspotSettings": {
        "icon": "plus",
        "color": "navy"
      }
    },
    "metadata": {
      "title": "Title of the Image Hotspots",
      "license": "U"
    }
  }
}
\`\`\`

IMPORTANT GUIDELINES:
1. Always use proper nested structure with "params" inside "params" as shown in examples
2. For all content types:
   - Include appropriate metadata with at least a title
   - Set "license": "U" for all content
   - Include all required behavior parameters
   - Provide meaningful feedback for interactive elements
3. For Branching Scenario content (only when appropriate):
   - Each content item needs a unique "contentId"
   - "nextContentId" determines navigation flow (-1 indicates an endpoint)
   - Questions must reference valid contentIds in alternatives
   - Create a logical flow of content with meaningful branching decisions
4. For Interactive Video (use cautiously):
   - Provide clear instructions about the need for an actual video URL
   - Keep interactions simple to reduce the chance of corruption
   - Explain to the user that manual adjustments may be needed
5. For Fill in the Blanks, use the format *word:hint* where "word" is the correct answer and "hint" is optional
6. The JSON must be correctly formatted with no syntax errors

Always structure your response as:
1. Brief acknowledgment of the request
2. Complete H5P content in JSON format as shown above
3. Short confirmation that the content is ready for use`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, currentH5PParams, modelProvider = 'llama-3.3-70b-instruct' } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    // Fetch available H5P library versions
    const libraryVersions = await getH5PLibraryVersions();
    console.log('Available H5P library versions:', libraryVersions);
    
    // Update system prompt with actual versions
    let systemPrompt = updateSystemPrompt(baseSystemPrompt, libraryVersions);
    
    // If we have current H5P params, append them to the system prompt
    if (currentH5PParams) {
      console.log('Including existing H5P content in system prompt');
      systemPrompt = appendCurrentH5PtoPrompt(systemPrompt, currentH5PParams);
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