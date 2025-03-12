import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jsonContent } = req.body;
    
    if (!jsonContent) {
      return res.status(400).json({ error: 'Missing JSON content' });
    }
    
    // Extract H5P content from JSON string if needed
    let h5pParams = jsonContent;
    if (typeof jsonContent === 'string') {
      try {
        h5pParams = JSON.parse(jsonContent);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON content' });
      }
    }

    // Ensure the content has the required structure
    if (!h5pParams.library || !h5pParams.params) {
      return res.status(400).json({ 
        error: 'Invalid H5P content structure',
        details: 'Content must include library and params fields'
      });
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

    console.log('Sending request to H5P API:', {
      url: `${process.env.H5P_API_ENDPOINT}/h5p/new`,
      body: requestBody
    });
    
    // Make request to H5P API
    const response = await axios.post(
      `${process.env.H5P_API_ENDPOINT}/h5p/new`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.H5P_API_KEY
        }
      }
    );
    
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
      details: error.message
    };
    
    // Add response data if available
    if (error.response) {
      errorResponse.statusCode = error.response.status;
      errorResponse.responseData = error.response.data;
      console.error('H5P API error response:', error.response.data);
    }
    
    return res.status(500).json(errorResponse);
  }
} 