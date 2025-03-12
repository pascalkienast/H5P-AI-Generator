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

    // Special validation for Branching Scenario
    if (h5pParams.library.startsWith('H5P.BranchingScenario')) {
      if (!h5pParams.params.params?.branchingScenario?.content) {
        console.error('Invalid Branching Scenario structure - missing content array');
        return res.status(400).json({
          error: 'Invalid Branching Scenario structure',
          details: 'Branching Scenario must include content array under params.params.branchingScenario'
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

    // Add default Branching Scenario settings if not present
    if (h5pParams.library.startsWith('H5P.BranchingScenario')) {
      if (!requestBody.params.params.branchingScenario.startScreen) {
        requestBody.params.params.branchingScenario.startScreen = {
          startScreenTitle: requestBody.params.metadata.title,
          startScreenSubtitle: ''
        };
      }
      if (!requestBody.params.params.branchingScenario.endScreens) {
        requestBody.params.params.branchingScenario.endScreens = [{
          endScreenTitle: 'Completed',
          endScreenSubtitle: '',
          contentId: '-1'
        }];
      }
    }

    const apiUrl = `${process.env.H5P_API_ENDPOINT}/h5p/new`;
    console.log('Making request to H5P API:', {
      url: apiUrl,
      body: JSON.stringify(requestBody, null, 2)
    });

    // Set timeout to 30 seconds to avoid long-running requests
    const response = await axios.post(
      apiUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.H5P_API_KEY && { 'x-api-key': process.env.H5P_API_KEY })
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('H5P API response:', response.data);
    
    // Return the content ID and API endpoint for embedding
    return res.status(200).json({
      contentId: response.data.contentId,
      apiEndpoint: process.env.H5P_API_ENDPOINT
    });

  } catch (error) {
    console.error('Error creating H5P content:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({
        error: 'H5P API error',
        details: error.response.data,
        statusCode: error.response.status
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(504).json({
        error: 'H5P API timeout',
        details: 'No response received from H5P API'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
} 