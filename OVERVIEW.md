# H5P AI Generator - Code Overview

## Project Overview

The H5P AI-1 Generator is a Next.js application that uses Claude AI to generate interactive H5P content for educational purposes. The app provides a conversational interface where users can describe the educational content they want to create, and the AI guides them through generating customized H5P modules.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **AI Integration**: Anthropic Claude API
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

2. **PreviewModule.js**: Provides a preview of the generated H5P content.
   - Embeds an iframe showing the H5P content from the API endpoint
   - Includes a download button to get the H5P file
   - Shows loading indicators while the preview is being loaded
   - Displays content ID for reference

3. **Layout.js**: Main layout wrapper for the application.
   - Provides consistent header and footer across the application
   - Includes responsive design elements
   - Contains the LanguageSwitcher component

4. **LanguageSwitcher.js**: Allows users to switch between different languages.
   - Currently supports English and German
   - Persists language choice using browser detection

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

### API Routes

1. **chat.js**: Handles communication with Claude AI, including:
   - Setting up system prompts with H5P library information
   - Processing user messages
   - Streaming responses from the AI
   - Formatting content for H5P generation
   - Contains detailed guidelines for Claude about:
     - 20 supported H5P content types with descriptions
     - Content type selection guidelines
     - Known issues with complex H5P types
     - Default recommendations for different educational scenarios
   - Dynamically fetches available H5P library versions from the H5P REST API
   - Provides fallback library versions if API is unavailable
   - Handles streaming API responses for a better user experience

2. **createH5P.js**: Handles the creation of H5P content by:
   - Validating the H5P content structure
   - Making API calls to the H5P REST API server
   - Processing and returning the created content ID
   - Includes special handling for complex content types like Branching Scenario
   - Adds default settings when necessary
   - Implements error handling with detailed error messages
   - Sets appropriate timeouts for API requests

## Application Flow

1. User starts by describing the educational content they want to create
2. The application communicates with Claude via the `/api/chat` endpoint
3. Claude generates structured H5P content based on the conversation
4. The generated content is sent to an H5P REST API server via `/api/createH5P`
5. The user can preview and download the generated H5P module

## Key Features

- **Conversational Interface**: Uses a chat-like interface for interacting with Claude AI
- **Multiple H5P Content Types**: Supports various content types including:
  - Multiple Choice
  - True/False
  - Fill in the Blanks
  - Interactive Video
  - Branching Scenario
  - Drag and Drop
  - Course Presentation
  - Question Set
  - Summary
  - Dialog Cards
  - Interactive Book
  - Mark the Words
  - Flashcards
  - Image Hotspots
  - Arithmetic Quiz
  - Drag Text
  - Essay
  - Find the Hotspot
  - Audio
  - Accordion
- **Preview Capability**: Allows users to preview the H5P content before downloading
- **Internationalization**: Supports multiple languages through i18next

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

### API Integration (api/chat.js)

This endpoint:
- Fetches available H5P library versions
- Creates detailed system prompts for Claude with library information
- Manages the conversation with Claude
- Handles streaming responses back to the client
- Provides comprehensive guidance to Claude about content type selection
- Implements fallback mechanisms for API failures
- Logs detailed information for debugging purposes

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