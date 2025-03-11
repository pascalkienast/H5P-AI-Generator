# H5P AI Generator

A Next.js application that leverages Claude AI to generate interactive H5P content. This application allows users to describe the educational content they want to create and guides them through a conversational process to generate customized H5P modules.

## Features

- Conversational AI interface for content creation
- Support for multiple H5P content types:
  - Multiple Choice
  - True/False
  - Fill in the Blanks
  - Interactive Video
- Instant preview of generated H5P modules
- Easy download of the final H5P file

## Getting Started

### Prerequisites

- Node.js 14.x or later
- An H5P REST API server running (see [H5P REST API](https://github.com/pascalkienast/H5P-REST-API))
- An Anthropic API key for Claude

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
   H5P_API_KEY=your_h5p_api_key
   H5P_API_ENDPOINT=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. On the start page, enter a description of the H5P content you want to create (e.g., "Create a quiz about European capitals")
2. Engage in a short conversation with the AI to refine your content requirements
3. Once enough information is gathered, the AI will generate the H5P module
4. Preview the generated module and download the H5P file

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key for accessing Claude AI
- `H5P_API_KEY`: API key for authenticating with the H5P REST API server
- `H5P_API_ENDPOINT`: The base URL of your H5P REST API server

## Technologies Used

- Next.js - React framework
- Tailwind CSS - Utility-first CSS framework
- Anthropic API - Claude AI model
- H5P REST API - For creating and managing H5P content

## Project Structure

```
/
├── components/       # React components
├── pages/            # Next.js pages and API routes
├── styles/           # Global styles
├── utils/            # Utility functions
└── public/           # Static assets
```

## License

MIT

## Acknowledgments

- H5P for providing the open-source framework for interactive content
- Anthropic for the Claude AI model 