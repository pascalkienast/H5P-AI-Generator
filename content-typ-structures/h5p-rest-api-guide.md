# H5P REST API Guide

This document provides a comprehensive guide to the H5P REST API endpoints for integrating H5P content creation and playback into your applications. It focuses on the API mechanisms rather than content type structures, which are covered separately in the content-typ-structures folder.

## Table of Contents
- [Introduction](#introduction)
  - [Architecture Overview](#architecture-overview)
  - [Communication Flow](#communication-flow)
- [Getting Started](#getting-started)
  - [Setup Requirements](#setup-requirements)
  - [Authentication](#authentication)
- [Content Management](#content-management)
  - [Listing Libraries](#listing-libraries)
  - [Installing Libraries](#installing-libraries)
  - [Creating Content](#creating-content)
  - [Editing Content](#editing-content)
  - [Viewing Content](#viewing-content)
  - [Downloading Content](#downloading-content)
  - [Deleting Content](#deleting-content)
- [File Operations](#file-operations)
  - [Uploading Files](#uploading-files)
  - [Downloading Files](#downloading-files)
- [User Data](#user-data)
  - [Managing User Progress](#managing-user-progress)
  - [xAPI Integration](#xapi-integration)

## Introduction

The H5P REST API provides endpoints for managing H5P content, including creation, editing, viewing, and tracking user interactions. This API allows you to integrate H5P functionality into your own applications without requiring the full H5P editor UI.

### Architecture Overview

The H5P application follows a client-server architecture:

1. **Client**: The browser-based H5P editor or player that allows users to create, edit, and view interactive content
2. **Server**: The backend API that handles content management, library management, file operations, and user data

The communication between the client and server happens through RESTful API calls, with JSON as the primary data format for request and response payloads.

### Communication Flow

A typical communication flow in the H5P application involves:

1. **Discovery**: The client fetches available content types (libraries)
2. **Selection/Installation**: The user selects a content type, and the client installs it if needed
3. **Content Creation/Editing**: The user creates or edits content using the H5P editor
4. **Content Display**: The content is displayed using the H5P player
5. **User Interaction**: User interactions with the content are tracked and reported back to the server

## Getting Started

### Setup Requirements

Before using the H5P REST API, ensure you have:

1. A running H5P server instance (typically on http://localhost:8080)
2. Any necessary API keys or authentication tokens

### Authentication

*Note: The current implementation uses a simple user object with basic information. More advanced authentication systems can be implemented based on your requirements.*

## Content Management

### Listing Libraries

To see all available libraries (content types):

```bash
# Get all available libraries
curl -X GET "http://localhost:8080/h5p/libraries" \
  -H "Accept: application/json"
```

To get details for a specific library:

```bash
# Get details for a specific library
curl -X GET "http://localhost:8080/h5p/libraries/H5P.InteractiveVideo-1.27" \
  -H "Accept: application/json"
```

### Installing Libraries

The most reliable way to install libraries is using the AJAX endpoint:

```bash
# Install a library using the AJAX endpoint
curl 'http://localhost:8080/h5p/ajax?action=library-install&id=H5P.Accordion' -X POST -H 'Content-Type: text/plain;charset=UTF-8'
```

The key aspects of this request:
1. The library machine name is passed as a URL parameter (`id=H5P.Accordion`)
2. The request is a simple POST with an empty body
3. The content type is `text/plain;charset=UTF-8` instead of JSON

The response includes the updated list of available libraries with the newly installed one marked with `"installed": true`.

Alternatively, you can use the libraries/install endpoint (though it may be less reliable):

```bash
# Install a library using the libraries/install endpoint
curl -X POST "http://localhost:8080/h5p/libraries/install" \
  -H "Content-Type: application/json" \
  -d '{
    "machineName": "H5P.InteractiveVideo",
    "majorVersion": 1,
    "minorVersion": 27,
    "patchVersion": 9
  }'
```

### Creating Content

To create new H5P content:

```bash
# Create new H5P content
curl -X POST "http://localhost:8080/h5p/new" \
  -H "Content-Type: application/json" \
  -d '{
    "library": "H5P.LibraryName MajorVersion.MinorVersion",
    "params": {
      "metadata": {
        "title": "Content Title",
        "license": "U"
      },
      "params": {
        // Content-specific parameters
      }
    }
  }'
```

The response includes the new content ID:

```json
{"contentId": 1234567890}
```

#### Key Points for Content Creation

1. The `library` field must include the library name and version (e.g., "H5P.InteractiveVideo 1.27")
2. The `params.metadata` field must include at least a title and license
3. The `params.params` field must include the content-specific parameters for the chosen library
4. The exact structure of `params.params` depends on the content type and is documented in the content-typ-structures folder

### Editing Content

**Important Note**: The H5P editing process follows a version-based approach. When you "edit" content, you're actually creating a new version with a new content ID. The original content remains unchanged unless explicitly deleted.

To edit content, you first retrieve the current content parameters:

```bash
# Get content parameters for editing
curl -X GET "http://localhost:8080/h5p/params/{contentId}" \
  -H "Accept: application/json"
```

Then, make your changes and create a new version:

```bash
# Create a new version with modifications
curl -X POST "http://localhost:8080/h5p/new" \
  -H "Content-Type: application/json" \
  -d '{
    "library": "H5P.LibraryName MajorVersion.MinorVersion",
    "params": {
      "metadata": {
        "title": "Updated Title",
        "license": "U"
      },
      "params": {
        // Modified content parameters
      }
    }
  }'
```

The response includes the new content ID:

```json
{"contentId": 9876543210}
```

#### Handling Media Files in Edits

If your edits include new media files, upload them before creating the new content version:

```bash
# Upload a new file for the content
curl -X POST "http://localhost:8080/h5p/content/{contentId}/files" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/new_image.jpg" \
  -F "field=images" \
  -F "contentId={contentId}"
```

The response includes the path to use in your content parameters:

```json
{
  "path": "images/new_image-8f7e2d4b.jpg"
}
```

### Viewing Content

To view or play content:

```bash
# Get/Play H5P content by ID
curl -X GET "http://localhost:8080/h5p/play/{contentId}"
```

### Retrieving Content Parameters

To retrieve the complete parameter structure of content:

```bash
# Get full content parameters
curl -X GET "http://localhost:8080/h5p/params/{contentId}" \
  -H "Accept: application/json"
```

### Downloading Content

To download content as an H5P file:

```bash
# Download H5P content as a file
curl -X GET "http://localhost:8080/h5p/download/{contentId}" \
  --output content.h5p
```

### Deleting Content

To delete content:

```bash
# Delete H5P content by ID
curl -X GET "http://localhost:8080/h5p/delete/{contentId}"
```

### Listing All Content

To list all available content:

```bash
# List all content (returns HTML page)
curl -X GET "http://localhost:8080/"
```

## File Operations

H5P content often includes files like images, videos, and audio.

### Uploading Files

Files are uploaded using multipart/form-data requests:

```bash
# Upload a file for use in H5P content
curl -X POST "http://localhost:8080/h5p/content/{contentId}/files" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/video.mp4" \
  -F "field=videos" \
  -F "contentId={contentId}"
```

### Downloading Files

To download files used in H5P content:

```bash
# Download a file
curl -X GET "http://localhost:8080/h5p/content/{contentId}/files/videos/video.mp4" \
  --output video.mp4
```

## User Data

H5P tracks user interactions with content, especially for learning activities.

### Managing User Progress

To manage user data and progress:

```bash
# Get user data for content
curl -X GET "http://localhost:8080/h5p/contentUserData/{contentId}/{dataType}/{subContentId}"

# Save user data for content
curl -X POST "http://localhost:8080/h5p/contentUserData/{contentId}/{dataType}/{subContentId}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "data={\"progress\":50,\"answers\":[]}&preload=1&invalidate=1"
```

### xAPI Integration

H5P content types send xAPI statements to track user interactions:

```bash
# Send an xAPI statement
curl -X POST "http://localhost:8080/h5p/xapi/statements" \
  -H "Content-Type: application/json" \
  -d '{
    "actor": {
      "objectType": "Agent",
      "name": "User Name",
      "mbox": "mailto:user@example.com"
    },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/answered",
      "display": {
        "en-US": "answered"
      }
    },
    "object": {
      "id": "http://localhost:8080/h5p/content/{contentId}/question/1",
      "objectType": "Activity",
      "definition": {
        "type": "http://adlnet.gov/expapi/activities/question",
        "name": {
          "en-US": "Question 1"
        }
      }
    },
    "result": {
      "success": true,
      "score": {
        "scaled": 1,
        "raw": 1,
        "min": 0,
        "max": 1
      }
    }
  }'
```

## Additional API Features

### Content Type Cache

The API provides endpoints to manage the content type cache:

```bash
# Get available content types from the H5P content type hub
curl -X GET "http://localhost:8080/h5p/ajax?action=content-type-cache"

# Update the content type cache
curl -X POST "http://localhost:8080/h5p/content-type-cache/update"
```

### Library Demos

Many libraries include demo content that shows how they work:

```bash
# Get demo content for a library
curl -X GET "http://localhost:8080/h5p/libraries/H5P.InteractiveVideo-1.27/demo" \
  -H "Accept: application/json"
```

## Error Handling

The H5P API returns structured error responses when issues occur. For example, attempting to install an incompatible library version might result in:

```json
{
  "errorCode": "VALIDATION_FAILED",
  "message": "Validating h5p package failed.",
  "details": [
    {
      "code": "api-version-unsupported",
      "message": "The system was unable to install the component, it requires a newer version of the H5P plugin."
    }
  ],
  "success": false
}
```

## Best Practices

1. **Library Compatibility**: Before installing libraries, check version compatibility with your H5P server.

2. **Content Versioning**: Implement version management for edited content since each edit creates a new content ID.

3. **File Management**: Upload media files before referencing them in content parameters.

4. **Backup Before Editing**: Before making significant changes, consider downloading a backup of the content.

5. **Complete Updates**: When updating content, include all parameters in your request, not just the changed portions.

6. **Incremental Edits**: For complex content types, make small, incremental changes rather than attempting to modify everything at once.

7. **Testing**: Always test your content after making changes to ensure it behaves as expected.

## Conclusion

The H5P REST API provides a powerful way to integrate H5P content creation and management into your applications. By following this guide and referencing the content type structures in the content-typ-structures folder, you can build sophisticated H5P-enabled applications.

For detailed information about specific content type structures, refer to the corresponding guides in the content-typ-structures folder. 