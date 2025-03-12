import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate H5P API endpoint
    if (!process.env.H5P_API_ENDPOINT) {
      console.error('H5P_API_ENDPOINT environment variable is not set');
      return res.status(500).json({ error: 'H5P API endpoint not configured' });
    }

    if (!process.env.H5P_API_ENDPOINT.startsWith('https://')) {
      console.error('H5P_API_ENDPOINT must use HTTPS');
      return res.status(500).json({ error: 'H5P API endpoint must use HTTPS' });
    }

    console.log('createH5P endpoint called with body:', JSON.stringify(req.body, null, 2));
    
    const { jsonContent } = req.body;
    
    if (!jsonContent) {
      console.error('Missing JSON content in request');
      return res.status(400).json({ error: 'Missing JSON content' });
    }
    
    // Extract H5P content from JSON string if needed
    let h5pParams = jsonContent;
    if (typeof jsonContent === 'string') {
      try {
        console.log('Parsing JSON string content');
        h5pParams = JSON.parse(jsonContent);
      } catch (err) {
        console.error('Failed to parse JSON content:', err);
        return res.status(400).json({ error: 'Invalid JSON content' });
      }
    }

    // Ensure the content has the required structure
    if (!h5pParams.library || !h5pParams.params) {
      console.error('Invalid content structure:', h5pParams);
      return res.status(400).json({ 
        error: 'Invalid H5P content structure',
        details: 'Content must include library and params fields'
      });
    }

    // Validate the content structure based on the library type
    if (h5pParams.library.startsWith('H5P.QuestionSet')) {
      if (!h5pParams.params.params?.questions) {
        console.error('Invalid QuestionSet structure - missing questions array');
        return res.status(400).json({
          error: 'Invalid QuestionSet structure',
          details: 'QuestionSet must include questions array'
        });
      }
    }

    // Format the request body according to H5P API requirements
    const requestBody = {
      library: h5pParams.library,
      params: {
        metadata: {
          title: h5pParams.params.metadata?.title || 'Untitled Content',
          license: h5pParams.params.metadata?.license || 'U',
          authors: h5pParams.params.metadata?.authors || [],
          changes: h5pParams.params.metadata?.changes || [],
          extraTitle: h5pParams.params.metadata?.extraTitle || '',
        },
        params: h5pParams.params.params
      }
    };

    // Add default QuestionSet settings if not present
    if (h5pParams.library.startsWith('H5P.QuestionSet')) {
      requestBody.params.params = {
        ...requestBody.params.params,
        progressType: requestBody.params.params.progressType || 'dots',
        passPercentage: requestBody.params.params.passPercentage || 50,
        showResults: requestBody.params.params.showResults !== false,
        randomQuestions: requestBody.params.params.randomQuestions !== false,
        endGame: {
          showResultPage: true,
          showSolutionButton: true,
          showRetryButton: true,
          ...requestBody.params.params.endGame
        },
        texts: {
          prevButton: 'Previous',
          nextButton: 'Next',
          finishButton: 'Finish',
          textualProgress: 'Question: @current of @total',
          questionLabel: 'Question',
          jumpToQuestion: 'Jump to question %d',
          readSpeakerProgress: 'Question @current of @total',
          unansweredText: 'Unanswered',
          answeredText: 'Answered',
          currentQuestionText: 'Current question',
          ...requestBody.params.params.texts
        }
      };
    }

    const apiUrl = `${process.env.H5P_API_ENDPOINT}/h5p/new`;
    console.log('Making request to H5P API:', {
      url: apiUrl,
      body: JSON.stringify(requestBody, null, 2),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.H5P_API_KEY ? 'present' : 'missing'
      }
    });

    // Set timeout to 30 seconds to avoid long-running requests
    const response = await axios.post(
      apiUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.H5P_API_KEY
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('H5P API response:', response.data);
    
    // Return content ID
    return res.status(200).json({ 
      contentId: response.data.contentId,
      apiEndpoint: process.env.H5P_API_ENDPOINT
    });
  } catch (error) {
    console.error('Error creating H5P content:', error);
    
    // Structure error response
    const errorResponse = {
      error: 'Failed to create H5P content',
      details: error.message,
      stack: error.stack
    };
    
    // Add response data if available
    if (error.response) {
      errorResponse.statusCode = error.response.status;
      errorResponse.responseData = error.response.data;
      console.error('H5P API error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'H5P API request timed out',
        details: 'The request to the H5P API took too long to respond'
      });
    }
    
    return res.status(500).json(errorResponse);
  }
} 