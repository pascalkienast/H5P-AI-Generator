# H5P AI Generator - Code Overview

## Project Overview

The H5P AI Generator is a Next.js application that uses Claude AI to generate interactive H5P content for educational purposes. The app provides a conversational interface where users can describe the educational content they want to create, and the AI guides them through generating customized H5P modules.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **AI Integration**: Anthropic Claude API, AcademicCloud API (supporting multiple AI models)
- **Backend**: Next.js API Routes
- **Internationalization**: i18next
- **HTTP Client**: Axios

## Project Structure

```
├── components/            # React components
├── pages/                 # Next.js pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── _app.js            # Next.js app wrapper
│   └── index.js           # Main application page
├── public/                # Static assets
├── styles/                # CSS and styling files
├── utils/                 # Utility functions
├── content-typ-structures/ # H5P content type templates
└── .env.local             # Environment variables
```

## Key Components

### Main Components

1. **ConversationUI.js**: Handles the chat interface between the user and Claude AI.
   - Renders user and assistant messages with appropriate styling
   - Includes typing indicators during response generation
   - Formats content for display, handling special cases like JSON code blocks
   - Manages user input and submission
   - Auto-scrolls to keep the latest messages visible
   - Supports restarting the conversation after completion
   - Displays a "Generate H5P" button in step one when a content type is selected
   - Disables input when step two is active

2. **PreviewModule.js**: Provides a preview of the generated H5P content.
   - Embeds an iframe showing the H5P content from the API endpoint
   - Includes a download button to get the H5P file
   - Shows loading indicators while the preview is being loaded
   - Displays content ID for reference

3. **Layout.js**: Main layout wrapper for the application.
   - Provides consistent header and footer across the application
   - Includes responsive design elements
   - Contains the LanguageSwitcher component
   - Incorporates the ModelSelector component for AI model selection

4. **LanguageSwitcher.js**: Allows users to switch between different languages.
   - Currently supports English and German
   - Persists language choice using browser detection

5. **ModelSelector.js**: Enables selection between different AI models.
   - Supports multiple AI models including Claude, Llama, Mistral, Qwen, and Deepseek
   - Persists model preference in local storage
   - Dynamically communicates selected model to the backend
   - Implements hydration-safe rendering with client-side detection
   - Uses the "isMounted" pattern to prevent server/client rendering mismatches

### Pages

1. **index.js**: The main application page that manages application state and orchestrates the conversation flow with Claude.
   - Implements a multi-step workflow:
     1. Start screen with content type selection
     2. Conversation interface for refining content requirements
     3. Preview interface for the final H5P module
   - Contains state management for the conversation history
   - Extracts structured JSON from Claude's responses to create H5P content
   - Handles error states and loading states
   - Passes required data to the ConversationUI and PreviewModule components
   - Manages current H5P parameters for content updates
   - Handles model selection for different AI backends
   - Tracks the two-step generation process state

### API Routes

1. **chat.js**: Handles communication with Claude AI, including:
   - Setting up system prompts with H5P library information
   - Processing user messages
   - Streaming responses from the AI
   - Formatting content for H5P generation
   - Supports multiple AI model providers (Claude and AcademicCloud API)
   - Dynamically fetches available H5P library versions from the H5P REST API
   - Provides fallback library versions if API is unavailable
   - Updates system prompts with current library versions
   - Supports appending existing H5P content parameters for updates
   - Implements separate system prompts for step 1 (content type selection) and step 2 (H5P generation)

2. **createH5P.js**: Handles the creation of H5P content by:
   - Validating the H5P content structure
   - Making API calls to the H5P REST API server
   - Processing and returning the created content ID
   - Includes special handling for complex content types like Branching Scenario
   - Adds default settings when necessary
   - Implements error handling with detailed error messages
   - Sets appropriate timeouts for API requests

## Two-Step Generation Process

The application implements a two-step generation process for H5P content:

### Step 1: Content Type Selection
- The user describes what they want to create
- The system prompts the AI to analyze the request and recommend an appropriate H5P content type
- The AI provides information about the selected content type's capabilities and limitations
- The user can ask questions or refine their requirements
- The conversation continues until a content type is selected and understood
- A "Generate H5P" button appears when a content type is selected

### Step 2: H5P Generation
- When the user clicks the "Generate H5P" button, the system transitions to step 2
- A new system prompt is used that focuses on generating the JSON structure for the selected content type
- The AI creates a complete H5P content structure based on the conversation history
- The generated structure is sent to the H5P REST API for creation
- The user can preview and download the resulting H5P module
- The user can continue refining or start a new generation

Benefits of this two-step approach:
- More focused guidance at each stage
- Clearer content type selection before generation
- Prevents generating content with inappropriate content types
- Improves overall success rate for complex content types

## System Prompts

The application uses sophisticated system prompts to guide the AI in generating appropriate H5P content:

### Base System Prompt Structure for Step 1 (Content Type Selection)

The system prompt focuses on:
- Content type analysis based on the user's request
- Detailed explanations of each content type's capabilities and limitations
- Clear recommendations for the most appropriate content type
- Guiding the user to select the right content type before proceeding to generation
- Highlighting key limitations of each content type to set proper expectations
- No JSON generation at this stage

### Base System Prompt Structure for Step 2 (H5P Generation)

The system prompt in `chat.js` consists of several key sections:

1. **Role Definition**: Defines the AI as an H5P content creation specialist
   ```
   You are an AI assistant specialized in creating H5P content. Your goal is to generate complete, production-ready H5P content in a single response without asking clarifying questions.
   ```

2. **Supported Content Types**: Lists 20 supported H5P content types with detailed descriptions
   ```
   SUPPORTED_CONTENT_TYPES:
   1. Multiple Choice ('H5P.MultiChoice'): A question with multiple answer options where one or more can be correct.
   2. True/False ('H5P.TrueFalse'): A statement that can be marked as either true or false.
   ...
   ```

3. **Content Type Selection Guidelines**: Provides guidance on when to use each content type
   ```
   CONTENT TYPE SELECTION GUIDELINES:
   - For simple quizzes or single questions, use Multiple Choice or True/False
   - For text-based learning exercises, use Fill in the Blanks or Mark the Words
   ...
   ```

4. **Known Issues**: Warns about potential problems with complex content types
   ```
   KNOWN ISSUES:
   - Interactive Video: May sometimes generate content that fails to load properly or create corrupt H5P files
   - Branching Scenario: Complex structure requires careful planning
   ...
   ```

5. **Default Recommendations**: Suggests safer options for various scenarios
   ```
   DEFAULT RECOMMENDATIONS:
   1. For simple, single-topic educational content, start with Multiple Choice, True/False, or Fill in the Blanks
   2. For most quiz requests, Multiple Choice is the safest and most reliable option
   ...
   ```

6. **Process Guidelines**: Outlines how the AI should approach content generation
   ```
   PROCESS:
   1. Ask clarifying questions to understand what the user wants to create.
   2. Gather specific details about the content, such as:
      - The subject matter and educational goal
      - The target audience
   ...
   ```

7. **JSON Structure Examples**: Provides detailed examples for various content types
   ```
   Example JSON Structure for Branching Scenario:
   ```json
   {
     "library": "H5P.BranchingScenario",
     "params": {
       ...
   ```

8. **Library Version Management**: The system dynamically fetches and updates the H5P library versions
   ```javascript
   // Function to fetch available H5P library versions
   async function getH5PLibraryVersions() {
     ...
   }

   // Function to update library versions in the system prompt
   function updateSystemPrompt(basePrompt, libraryVersions) {
     ...
   }
   ```

9. **Content Update Support**: For existing content, the system adds a special section to guide updates
   ```javascript
   function appendCurrentH5PtoPrompt(systemPrompt, currentH5PParams) {
     return `${systemPrompt}

   ## Current H5P Content to Update
   
   The user has already generated an H5P module with the following parameters...`;
   }
   ```

## AI Model Integration

The application supports multiple AI models:

1. **Anthropic Claude API**: Primary AI provider with streaming capabilities
   ```javascript
   const anthropic = new Anthropic({
     apiKey: process.env.ANTHROPIC_API_KEY,
   });
   ```

2. **AcademicCloud API**: Alternative provider supporting various models:
   - Deepseek R1
   - Mistral Large Instruct
   - Llama 3.3 70B Instruct
   - Qwen 2.5 72B Instruct
   ```javascript
   const academicCloudConfig = {
     apiKey: process.env.AI_API_KEY,
     apiEndpoint: process.env.AI_API_ENDPOINT,
   };
   ```

3. **Model Selection Interface**: The frontend allows users to select their preferred model
   ```jsx
   <ModelSelector 
     selectedModel={selectedModel} 
     setSelectedModel={setSelectedModel} 
   />
   ```

## Application Flow

1. **Start Screen**: 
   - User selects an AI model from the dropdown
   - User enters a description of the educational content they want to create
   - Application shows supported content types with warnings for complex types

2. **Step 1: Content Type Selection**:
   - The application sends the initial prompt with Step 1 system prompt to the selected AI model
   - The AI analyzes the request and recommends an appropriate content type
   - The user can ask questions or refine requirements through conversation
   - "Generate H5P" button appears when content type is selected

3. **Step 2: H5P Generation**:
   - User clicks "Generate H5P" to transition to Step 2
   - The application sends conversation history with Step 2 system prompt to the AI model
   - The AI generates complete H5P JSON structure
   - The application extracts JSON when it appears in the AI's response

4. **Content Creation**:
   - When valid JSON content is detected, it's sent to the H5P REST API
   - Special validation and enhancements are applied for complex content types
   - Default parameters are added when necessary

5. **Preview and Download**:
   - Successfully created content is displayed in an iframe
   - User can download the H5P file or continue refining the content
   - Content ID and other metadata is displayed for reference

6. **Content Updates**:
   - For existing content, current parameters are included in the system prompt
   - The AI generates an updated version based on user requests
   - Updated content replaces the previous version in the preview

## Hydration Error Handling

The application implements specific techniques to prevent React hydration errors with internationalization:

1. **Consistent Initial Language**: Uses a fixed initial language for server-side rendering
   ```javascript
   const getInitialLanguage = () => {
     // When running on server, always use default language
     if (typeof window === 'undefined') {
       return 'de'; // German as default
     }
     // ...client-side logic
   };
   ```

2. **Safe localStorage Access**: Wraps client-side storage in try-catch for safety
   ```javascript
   try {
     const savedLanguage = localStorage.getItem('i18nextLng');
     // ...
   } catch (error) {
     console.warn('localStorage not available:', error);
   }
   ```

3. **Deferred Rendering Pattern**: Uses the "isMounted" pattern to prevent hydration mismatches
   ```javascript
   const [isMounted, setIsMounted] = useState(false);
   
   useEffect(() => {
     setIsMounted(true);
     // ...client-side only code
   }, []);
   
   if (!isMounted) {
     return <StaticFallbackUI />;
   }
   ```

## JSON Extraction and Processing

The application implements advanced JSON extraction from AI responses:

```javascript
const extractJsonFromResponse = (responseContent) => {
  for (const content of responseContent) {
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/```json([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedJson = JSON.parse(jsonMatch[1].trim());
          return parsedJson;
        } catch (err) {
          return null;
        }
      }
    }
  }
  return null;
};
```

## Error Handling and Resilience

The application implements several layers of error handling:

1. **API Communication Errors**:
   - Timeout handling for external API calls
   - Detailed error logging with context
   - User-friendly error messages

2. **JSON Validation**:
   - Parsing error handling for extracted JSON
   - Structure validation before sending to H5P API
   - Special validation for complex content types

3. **H5P Library Fallbacks**:
   - Default library versions when API is unavailable
   - Graceful degradation when specific services are down
   ```javascript
   const defaultVersions = {
     'H5P.MultiChoice': '1.16',
     'H5P.TrueFalse': '1.8',
     ...
   };
   ```

4. **UI Error States**:
   - Visual indication of errors to users
   - Option to retry or modify content when errors occur
   - Loading states to indicate processing

5. **Hydration Error Prevention**:
   - Client-side only rendering for components with potential mismatches
   - Safe localStorage access patterns
   - Consistent initial state between server and client rendering

## Internationalization

The application uses i18next for internationalization with the following features:
- Support for multiple languages (currently English and German)
- Automatic language detection based on browser settings
- Translation files stored directly in the codebase
- Comprehensive translations for all UI elements and content type descriptions
- Easy extensibility for adding more languages

The translations include:
- General UI elements and buttons
- Content type descriptions
- Error messages
- Tooltips and helper text
- Detailed descriptions of the 20 H5P content types
- Model selector options and descriptions

## Content Type Selection Logic

The application implements sophisticated content type selection logic:
- For simple quizzes: Multiple Choice or True/False
- For text-based learning: Fill in the Blanks or Mark the Words
- For visual content: Drag and Drop or Image Hotspots
- For educational videos: Interactive Video (with caution due to potential issues)
- For presentations: Course Presentation
- For mixed question types: Question Set
- For vocabulary learning: Dialog Cards or Flashcards
- For complex scenarios: Branching Scenario (only when absolutely necessary)
- For mathematical practice: Arithmetic Quiz
- For language learning: Drag Text
- For audio content: Audio content type
- For hierarchical content: Accordion

## Environment Configuration

The application requires the following environment variables:
- `ANTHROPIC_API_KEY`: API key for Anthropic Claude
- `AI_API_KEY`: API key for AcademicCloud API
- `AI_API_ENDPOINT`: URL for AcademicCloud API
- `H5P_API_KEY`: API key for the H5P REST API
- `H5P_API_ENDPOINT`: URL of the H5P REST API server

## Detailed Code Description

### Frontend (index.js)

The main page implements the core application logic:
- State management for conversation and content generation
- Functions for communicating with API endpoints
- UI flow control between conversation and preview states
- Extraction of structured content from AI responses
- JSON extraction and parsing to convert Claude's responses into H5P content
- Error handling with user-friendly messages
- Loading state management for responsive UI feedback
- Model selection and persistence
- Two-step generation state tracking:
  - Step 1: Content type selection state
  - Step 2: H5P generation state

### API Integration (api/chat.js)

This endpoint:
- Fetches available H5P library versions
- Creates detailed system prompts for Claude with library information
- Manages the conversation with Claude and other AI models
- Handles streaming responses back to the client
- Provides comprehensive guidance to Claude about content type selection
- Implements fallback mechanisms for API failures
- Logs detailed information for debugging purposes
- Supports multiple AI model providers
- Implements separate system prompts for each step of the generation process
- Passes conversation history between steps

### H5P Creation (api/createH5P.js)

This endpoint:
- Validates the H5P content structure
- Makes API calls to the H5P REST API server
- Processes responses and error handling
- Returns the created content ID for preview and download
- Performs special handling for complex content types like Branching Scenario
- Adds default parameters when needed to ensure valid H5P content
- Implements timeouts to prevent long-running requests
- Provides detailed error messages to help with troubleshooting

## Development and Deployment

The application can be run locally with `npm run dev` and built for production with `npm run build`. It's also containerized with Docker for easy deployment to various environments. The Dockerfile includes:
- Node.js environment setup
- Dependency installation with package.json
- Build process configuration
- Environment variable handling
- Exposed ports and startup commands

## Security Considerations

The application implements several security measures:
- API keys stored in environment variables
- Input validation before processing user content
- Timeouts for external API calls to prevent resource exhaustion
- Content sanitization for user-generated inputs
- Properly configured CORS handling for API endpoints

## Recent Changes

### Content Type Structure Documentation

The application now automatically loads content-specific structure documentation during Step 2 (H5P Generation). Key improvements include:

1. **Content Type Structure Guides**: Added comprehensive MD files in the `content-typ-structures` directory that contain detailed JSON structures for each supported content type:
   - Each content type has its own dedicated markdown file (e.g., `multichoice-structure-guide.md`)
   - Files include specific structure requirements, examples, and common pitfalls
   - Detailed JSON format specifications with comments and explanations

2. **Automatic Documentation Loading**: The system now automatically:
   - Identifies the selected content type in Step 1 using advanced pattern matching
   - In Step 2, loads the corresponding structure documentation file based on content type
   - Incorporates structure documentation directly into the AI system prompt
   - Provides the AI with precise, content-type-specific JSON templates

3. **Improved JSON Generation Accuracy**: This change significantly improves H5P content generation by:
   - Giving the AI exact structure specifications for the selected content type
   - Reducing common structure errors in complex content types
   - Enforcing proper subContentId usage and library versioning
   - Ensuring consistent metadata structure across all generated content

4. **Implementation Details**:
   - Content type mapping in `getContentTypeStructure()` function in `pages/api/chat.js`
   - Dynamic loading of structure documentation using `fs.readFileSync()`
   - Automatic inclusion in step 2 system prompt when selecting "Generate H5P"
   - Consistent formatting across all content types for predictable AI generation

This enhancement ensures that the AI has the most detailed and up-to-date information about each content type's structure requirements, significantly improving the generation success rate, especially for complex content types like Branching Scenario and Course Presentation. 