# H5P AI Generator

A Next.js application that uses advanced AI models to generate interactive H5P content for education. This application allows users to describe the educational content they want to create and guides them through a conversational process to produce customized H5P modules.

## Features

- Conversational AI interface for content creation
- Support for multiple AI models:
  - Claude (Anthropic)
  - Deepseek R1
  - Mistral Large Instruct
  - Llama 3.3 70B Instruct
  - Qwen 2.5 72B Instruct
- Support for multiple H5P content types:
  - Multiple Choice
  - True/False
  - Fill in the Blanks
  - Question Set (for quizzes with multiple questions)
  - Branching Scenario (for complex interactive content)
  - Course Presentation (for slide-based content)
  - Interactive Book (for chapter-based content)
  - Drag and Drop
  - Drag Text
  - Accordion
  - Summary
  - Questionnaire
- Two-step generation process:
  1. Content type selection with AI guidance
  2. Detailed H5P structure generation
- Instant preview of generated H5P modules
- Easy download of the final H5P file
- Multi-language support (English and German)

## Getting Started

### Prerequisites

- Node.js 14.x or later
- An H5P REST API server running (see [H5P REST API](https://github.com/pascalkienast/H5P-REST-API))
- Academic Cloud API key for open-source ai-models
- Optional: An Anthropic API key for Claude


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/h5p-ai-generator.git
   cd h5p-ai-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key
   AI_API_KEY=your_academic_cloud_api_key 
   AI_API_ENDPOINT=your_academic_cloud_endpoint 
   H5P_API_KEY=your_h5p_api_key
   H5P_API_ENDPOINT=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Select AI Model**: Choose your preferred AI model from the dropdown menu
2. **Describe Your Content**: Enter a description of the H5P content you want to create (e.g., "Create a quiz about European capitals")
3. **Content Type Selection**: The AI will recommend the most appropriate H5P content type and explain its features
4. **Refine Requirements**: Continue the conversation to provide more details about your content needs
5. **Generate H5P**: When ready, click the "Generate H5P" button that appears
6. **Preview and Download**: View the generated module directly in the browser and download the H5P file
7. **Refine if Needed**: Continue the conversation to make adjustments to the generated content

## What is H5P?

H5P is an open-source framework for creating interactive content for the web. It allows educators to create rich, interactive learning experiences without requiring programming skills. Content created with H5P can be easily shared and embedded in various learning platforms.

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key for accessing Claude AI
- `AI_API_KEY`: Your Academic Cloud API key for accessing  AI models 
- `AI_API_ENDPOINT`: The base URL for the Academic Cloud API 
- `H5P_API_KEY`: API key for authenticating with the H5P REST API server
- `H5P_API_ENDPOINT`: The base URL of your H5P REST API server

## Deployment

### Using Docker

The application comes with a ready-to-use Dockerfile for easy deployment:

```bash
docker build -t h5p-ai-generator .
docker run -p 3000:3000 --env-file .env.local h5p-ai-generator
```

### Cloud Deployment Options

The application can be deployed to various cloud platforms:

- **Vercel**: Optimized for Next.js applications
- **Coolify**: Self-hosted alternative to Heroku/Netlify
- **Any hosting provider** that supports Docker containers

## Technologies Used

- Next.js - React framework
- Tailwind CSS - Styling
- Multiple AI models - Content generation
- H5P - Interactive content framework

## License

MIT

## Acknowledgments

- H5P for providing the open-source framework for interactive content
- Anthropic for the Claude AI model
- Academic Cloud for providing additional AI model options 