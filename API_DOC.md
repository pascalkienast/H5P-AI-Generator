# H5P REST API Documentation

This document provides detailed information about the REST API endpoints for working with H5P content. Each section follows a logical user flow, from discovering content types to creating and managing interactive content.

## Table of Contents
- [Introduction](#introduction)
  - [Architecture Overview](#architecture-overview)
  - [Communication Flow](#communication-flow)
- [Getting Started](#getting-started)
  - [Setup Requirements](#setup-requirements)
  - [Authentication](#authentication)
- [Content Type Management](#content-type-management)
  - [Listing Available Content Types](#listing-available-content-types)
  - [Getting Content Type Details](#getting-content-type-details)
  - [Installing Content Types](#installing-content-types)
  - [Viewing Content Type Demos](#viewing-content-type-demos)
- [Content Creation and Management](#content-creation-and-management)
  - [Creating New Content](#creating-new-content)
  - [Content Structure Requirements](#content-structure-requirements)
  - [Editing Content](#editing-content)
  - [Viewing Content](#viewing-content)
  - [Retrieving Content Parameters](#retrieving-content-parameters)
  - [Downloading Content](#downloading-content)
  - [Deleting Content](#deleting-content)
- [File Operations](#file-operations)
  - [Uploading Files](#uploading-files)
  - [Downloading Files](#downloading-files)
- [User Data and Interactions](#user-data-and-interactions)
  - [Managing User Progress](#managing-user-progress)
  - [xAPI Integration](#xapi-integration)
- [Advanced Usage](#advanced-usage)
  - [Using Multiple Libraries Together](#using-multiple-libraries-together)
  - [Customizing Content Parameters](#customizing-content-parameters)

## Introduction

This documentation covers the REST API endpoints for H5P, a framework for creating and sharing interactive HTML5 content. The API allows you to integrate H5P content creation and display into your own applications.

### Architecture Overview

The H5P application follows a client-server architecture where:

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

Each of these steps involves one or more API calls, which are documented in the following sections.

## Getting Started

### Setup Requirements

Before using the H5P REST API, ensure you have:

1. A running H5P server instance (typically on http://localhost:8080)
2. Any necessary API keys or authentication tokens

### Authentication

*Note: The current implementation uses a simple user object with basic information. More advanced authentication systems can be implemented based on your requirements.*

## Content Type Management

Before creating H5P content, you need to understand what content types (libraries) are available and how to install them.

### Listing Available Content Types

To see all available content types (installed and available for installation):

```bash
# Get all available content types
curl -X GET "http://localhost:8080/h5p/libraries" \
  -H "Accept: application/json"
```

The response includes details about each library such as:
- Title and machine name
- Version information
- Whether it's runnable (can be used as a standalone content type)
- Usage statistics (instances count)

You can filter the response to only show runnable content types (those that can be used as standalone content):

```bash
# List only runnable content types
curl -s "http://localhost:8080/h5p/libraries" | grep -o '"title":"[^"]*","machineName":"[^"]*","majorVersion":[0-9]*,"minorVersion":[0-9]*,"patchVersion":[0-9]*.*"runnable":true'
```

Common runnable content types include:
- H5P.InteractiveVideo - For creating videos with interactive elements
- H5P.MultiChoice - For multiple-choice questions
- H5P.DragQuestion - For drag and drop activities
- H5P.Blanks - For fill-in-the-blanks exercises
- H5P.TrueFalse - For true/false questions
- H5P.Summary - For summary activities
- H5P.DragText - For drag the words exercises
- H5P.Questionnaire - For creating surveys

### Getting Content Type Details

To get detailed information about a specific content type:

```bash
# Get details for a specific content type
curl -X GET "http://localhost:8080/h5p/libraries/H5P.InteractiveVideo-1.27" \
  -H "Accept: application/json"
```

You can replace `H5P.InteractiveVideo-1.27` with any other content type, such as:
- `H5P.MultiChoice-1.16`
- `H5P.DragQuestion-1.14`
- `H5P.Blanks-1.14`

### Installing Content Types

To install a content type:

```bash
# Install a content type (e.g., Interactive Video)
curl -X POST "http://localhost:8080/h5p/libraries/install" \
  -H "Content-Type: application/json" \
  -d '{
    "machineName": "H5P.InteractiveVideo",
    "majorVersion": 1,
    "minorVersion": 27,
    "patchVersion": 9
  }'
```

This will install the specified content type and all its dependencies. The response will include information about the installed content type and its dependencies.

To install a different content type, just change the `machineName`, `majorVersion`, `minorVersion`, and `patchVersion` accordingly:

```bash
# Install Multiple Choice
curl -X POST "http://localhost:8080/h5p/libraries/install" \
  -H "Content-Type: application/json" \
  -d '{
    "machineName": "H5P.MultiChoice",
    "majorVersion": 1,
    "minorVersion": 16,
    "patchVersion": 14
  }'
```

```bash
# Install Drag and Drop
curl -X POST "http://localhost:8080/h5p/libraries/install" \
  -H "Content-Type: application/json" \
  -d '{
    "machineName": "H5P.DragQuestion",
    "majorVersion": 1,
    "minorVersion": 14,
    "patchVersion": 22
  }'
```

When you install a content type, all its dependencies are automatically installed as well, including editor libraries needed for creating content of that type.

### Viewing Content Type Demos

Many content types include demo content that shows how they work:

```bash
# Get demo content for a content type
curl -X GET "http://localhost:8080/h5p/libraries/H5P.InteractiveVideo-1.27/demo" \
  -H "Accept: application/json"
```

## Content Creation and Management

After installing the desired content types, you can create, edit, view, and manage H5P content.

### Creating New Content

The most reliable way to create new H5P content is through the `/h5p/new` endpoint:

```bash
# Create new H5P content (Interactive Video example)
curl -X POST "http://localhost:8080/h5p/new" \
  -H "Content-Type: application/json" \
  -d '{
    "library": "H5P.InteractiveVideo 1.27",
    "params": {
      "params": {
        "interactiveVideo": {
          "video": {
            "startScreenOptions": {
              "title": "Test Video",
              "hideStartTitle": false
            },
            "files": [
              {
                "path": "https://test.com/video.mp4",
                "mime": "video/mp4",
                "copyright": {
                  "license": "U"
                }
              }
            ]
          }
        }
      },
      "metadata": {
        "title": "Test API Video",
        "license": "U"
      }
    }
  }'
```

This endpoint returns a JSON response with the content ID:

```json
{"contentId": 3164784622}
```

### Content Structure Requirements

When creating H5P content, the JSON body must include:

1. `library`: The content type with version (e.g., "H5P.InteractiveVideo 1.27")
2. `params.params`: The content-specific parameters structure
3. `metadata`: At minimum, the title and license information

The structure of `params.params` depends on the content type being created. For example:

- **Interactive Video**: Requires the `interactiveVideo` object with video information
- **Multiple Choice**: Requires a `question` string and an array of `answers`
- **Drag and Drop**: Requires `question`, `background`, and `dropZones` definitions

### Editing H5P Content

**Important Note**: The H5P editing process follows a version-based approach rather than an edit-in-place model. When you "edit" existing content, you're actually creating a new content item with your changes, receiving a new content ID. The original content remains unchanged unless explicitly deleted.

Editing existing H5P content involves several API calls to retrieve, modify, and save the content as a new version. The process typically follows these steps:

#### 1. Retrieving Content for Editing

To edit existing content, first retrieve the current content parameters using the `/h5p/params/{contentId}` endpoint:

```bash
# Get content parameters for editing
curl -X GET "http://localhost:8080/h5p/params/{contentId}" \
  -H "Accept: application/json"
```

You can also access the editing interface directly, which will retrieve these parameters automatically:

```bash
# Get content for editing (loads editor UI)
curl -X GET "http://localhost:8080/h5p/edit/{contentId}" \
  -H "Accept: application/json"
```

Example response from the params endpoint for a Multiple Choice content type:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "license": "U",
    "mainLibrary": "H5P.MultiChoice",
    "preloadedDependencies": [
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16}
    ],
    "title": "OER Grundlagen Quiz"
  },
  "library": "H5P.MultiChoice 1.16",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "license": "U",
      "mainLibrary": "H5P.MultiChoice",
      "preloadedDependencies": [
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16}
      ],
      "title": "OER Grundlagen Quiz"
    },
    "params": {
      "question": "Was bedeutet OER?",
      "answers": [
        {"text": "Open Educational Resources", "correct": true},
        {"text": "Online Education Rooms", "correct": false}
      ]
    }
  }
}
```

#### 2. Opening the Editor Interface

When you access the editor interface through the URL:

```
http://localhost:8080/h5p/edit/{contentId}
```

The system loads the H5P editor with the content parameters pre-filled. However, it's important to understand that you're preparing to create a new content item based on these parameters, not directly modifying the existing content.

The editor interface depends on the content type, but generally includes:

- Title field for the content
- Metadata fields (accessible via a button)
- Content-specific fields (questions, answers, media, etc.)
- Preview option

#### 3. Making Changes to Content

There are two approaches to modify H5P content:

##### A. Creating a New Version (Standard Approach)

When submitting changes through the H5P editor UI, the system actually uses the `/h5p/new` endpoint to create a new content item with your modifications, rather than updating the existing content. If using the API directly, you would:

```bash
# Create new version of content based on existing parameters
curl -X POST "http://localhost:8080/h5p/new" \
  -H "Content-Type: application/json" \
  -d '{
    "library": "H5P.MultiChoice 1.16",
    "params": {
      "metadata": {
        "title": "Updated OER Quiz",
        "license": "U"
      },
      "params": {
        "question": "Was bedeutet OER? (Updated)",
        "answers": [
          {"text": "Open Educational Resources", "correct": true},
          {"text": "Online Education Rooms", "correct": false},
          {"text": "Open Electronic Records", "correct": false}
        ]
      }
    }
  }'
```

The response will include a new content ID:

```json
{"contentId": 2020504142}
```

##### B. Updating Existing Content (Alternative Approach)

Some H5P implementations also support direct updates to existing content using the PATCH method, though this doesn't create the version history that the standard approach provides:

```bash
# Update existing content directly
curl -X PATCH "http://localhost:8080/h5p/content/{contentId}" \
  -H "Content-Type: application/json" \
  -d '{
    "library": "H5P.InteractiveVideo 1.27",
    "params": {
      "metadata": {
        "title": "Updated Title",
        "license": "U"
      },
      "params": {
        "interactiveVideo": {
          "video": {
            "startScreenOptions": {
              "title": "Updated Video Title",
              "hideStartTitle": false
            },
            "files": [
              {
                "path": "videos/video-612MMAcN.mp4",
                "mime": "video/mp4",
                "copyright": {"license": "U"}
              }
            ]
          }
        }
      }
    }
  }'
```

The request must include:
- The complete `library` identifier with version
- The `params` object with both `metadata` and content-specific parameters
- Any new or modified content elements

#### 4. Content Version Management

Since the standard editing approach creates a new content version with a new ID, consider implementing version management in your application:

1. **Track Content Versions**: Maintain a mapping between original content and its subsequent versions
2. **Update References**: If your application references H5P content by ID, update these references when new versions are created
3. **Clean Up Old Versions**: Implement a policy for deleting outdated versions to prevent accumulation of unused content

#### 5. Handling Content-Specific Editing

Different content types have unique editing requirements:

**Multiple Choice:**
- Modifying the `question` field updates the question text
- Adding, removing, or updating elements in the `answers` array changes the available options
- Setting `correct: true` marks an answer as correct

**Interactive Video:**
- Interactions are stored in the `interactiveVideo.assets.interactions` array
- Each interaction includes position (`x`, `y`), time range (`duration`), and type-specific parameters
- To add a new interaction, append to the interactions array with the appropriate library and parameters

**Interactive Book:**
- Book content is organized in `chapters` array
- Each chapter uses `H5P.Column` library to structure its content
- To add a new chapter, append to the chapters array with appropriate structure

#### 6. Uploading New Media Files

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

#### 7. Testing the Updated Content

After creating a new version or updating existing content, you can view it at:

```
http://localhost:8080/h5p/play/{contentId}
```

If using the standard approach, replace `{contentId}` with the new ID returned when creating the new version:

```
http://localhost:8080/h5p/play/{newContentId}
```

Note that when using the version-based approach, the original content will still be accessible at its original URL.

### Editing Best Practices

When editing H5P content via the API, follow these best practices:

1. **Preserve Structure**: Always maintain the overall structure of the content parameters.

2. **Complete Updates**: Include all parameters in your update request, not just the changed portions.

3. **Version Compatibility**: Ensure the library version in your update matches the original content's version.

4. **Media Management**: When updating media files, use the proper file upload endpoint before referencing them in content parameters.

5. **Backup Before Editing**: Before making significant changes, consider downloading a copy of the content using:
   ```bash
   curl -X GET "http://localhost:8080/h5p/download/{contentId}" --output backup.h5p
   ```

6. **Incremental Edits**: For complex content types, make small, incremental changes rather than attempting to modify everything at once.

7. **Testing**: Always test the edited content after making changes to ensure it behaves as expected.

### Common Editing Operations

Here are examples of common editing operations for different content types:

**Adding an answer option to Multiple Choice:**
```json
{
  "library": "H5P.MultiChoice 1.16",
  "params": {
    "metadata": { "title": "Quiz Title" },
    "params": {
      "question": "Original question",
      "answers": [
        {"text": "Existing option 1", "correct": true},
        {"text": "Existing option 2", "correct": false},
        {"text": "New option", "correct": false}
      ]
    }
  }
}
```

**Updating an image in Course Presentation:**
```json
{
  "library": "H5P.CoursePresentation 1.25",
  "params": {
    "metadata": { "title": "Presentation Title" },
    "params": {
      "presentation": {
        "slides": [
          {
            "elements": [
              {
                "action": {
                  "library": "H5P.Image 1.1",
                  "params": {
                    "file": {
                      "path": "images/new_image-8f7e2d4b.jpg",
                      "mime": "image/jpeg",
                      "copyright": { "license": "U" }
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```

**Adding a page to Interactive Book:**
```json
{
  "library": "H5P.InteractiveBook 1.11",
  "params": {
    "metadata": { "title": "Book Title" },
    "params": {
      "chapters": [
        // Existing chapters here
        {
          "params": {
            "content": [
              {
                "content": {
                  "library": "H5P.AdvancedText 1.1",
                  "params": {
                    "text": "<p>New chapter content</p>"
                  }
                }
              }
            ]
          },
          "library": "H5P.Column 1.18",
          "metadata": {
            "title": "New Chapter Title"
          }
        }
      ]
    }
  }
}
```

### Retrieving Content Parameters

To retrieve the complete parameter structure of H5P content:

```bash
# Get full content parameters including metadata, library dependencies, and content structure
curl -X GET "http://localhost:8080/h5p/params/{contentId}" \
  -H "Accept: application/json"
```

### Viewing Content

To view or play content:

```bash
# Get/Play H5P content by ID
curl -X GET "http://localhost:8080/h5p/play/{contentId}"
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

## User Data and Interactions

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

## Advanced Usage

### Using Multiple Libraries Together

In this example, we can see a real-world implementation of combining multiple H5P libraries to create rich interactive content:

1. **Interactive Video as a Container**:
   - The Interactive Video serves as a primary container for other content types
   - It provides a timeline-based approach where content appears at specific timestamps
   - Embedded elements can include simple content (text, images) and complex interactive elements (questions, drag activities)
   - The summary feature appears at the end, providing a recap of the video content

2. **Other Container-Type Content**:

   a) **Branching Scenario**:
   - Allows creation of non-linear, decision-based content
   - Each branch point can contain different content types (video, images, questions)
   - Users navigate different paths based on their choices
   - The content structure includes:
     - A series of content screens (branching points)
     - Decision options that determine the next screen
     - Alternative paths based on user choices
     - Various content types embedded at each screen

   b) **Interactive Book**:
   - Organizes content into chapters and pages with a table of contents for navigation
   - Each page is typically implemented using a Column content type to structure the layout
   - Supports embedding multiple interactive elements per page (questions, media, text)
   - Provides progress tracking across chapters and interactive elements
   - Includes features like:
     - Chapter navigation with progress indicators
     - A summary page showing completion status of all interactions
     - Full-screen mode for focused learning
     - Support for multilingual content

   c) **Course Presentation**:
   - Provides a slide-based approach for organizing content
   - Each slide can contain multiple content types
   - Navigation is typically linear but can include custom navigation options
   - Supports a wide range of embedded content types

   d) **Column**:
   - Arranges multiple content vertically on a single page
   - Simpler container that focuses on layout rather than interactive navigation
   - Useful for combining related content elements in a single view

### Example: Interactive Video with Multiple Choice and True/False Questions

Our analysis of the content with ID `2893205493` shows it contains an Interactive Video with embedded question elements:

```json
{
  "interactiveVideo": {
    "video": {
      "startScreenOptions": {
        "title": "Video with Questions",
        "hideStartTitle": false
      },
      "files": [
        {
          "path": "videos/video-612MMAcN.mp4",
          "mime": "video/mp4",
          "copyright": {"license": "U"}
        }
      ]
    },
    "assets": {
      "interactions": [
        {
          "library": "H5P.MultiChoice 1.16",
          "params": {
            "question": "What is shown in this video?",
            "answers": [
              {"text": "Option 1", "correct": true},
              {"text": "Option 2", "correct": false}
            ]
          },
          "duration": {"from": 15, "to": 30},
          "x": 30,
          "y": 30,
          "pause": true
        },
        {
          "library": "H5P.TrueFalse 1.8",
          "params": {
            "question": "Is H5P interactive?",
            "correct": "true",
            "l10n": {"trueText": "True", "falseText": "False"}
          },
          "duration": {"from": 45, "to": 60},
          "x": 70,
          "y": 40,
          "pause": true
        }
      ]
    },
    "summary": {
      "task": {
        "library": "H5P.Summary 1.10",
        "params": {"intro": "Choose the correct statement."}
      },
      "displayAt": 3
    }
  }
}
```

This example shows:
- Two question interactions at different timestamps (15s and 45s)
- Different question types (Multiple Choice and True/False)
- Both questions are configured to pause the video when they appear
- A summary task appears at the end of the video

### Example: Branching Scenario with Multiple Content Types

The Branching Scenario content type provides a powerful non-linear navigation structure where users choose their own path through the content. From our analysis of content ID `975960658`, we can see how it creates a decision tree with different embedded content types:

```json
{
  "library": "H5P.BranchingScenario 1.8",
  "params": {
    "branchingScenario": {
      "content": [
        {
          "type": {
            "library": "H5P.CoursePresentation 1.25",
            "params": {
              "presentation": {
                "slides": [
                  {
                    "elements": [
                      {
                        "action": {
                          "library": "H5P.AdvancedText 1.1",
                          "params": {
                            "text": "<p>ttttt</p>"
                          }
                        }
                      },
                      {
                        "action": {
                          "library": "H5P.Image 1.1",
                          "params": {
                            "file": {
                              "path": "images/image-b5e77ck4.png",
                              "mime": "image/png"
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          },
          "contentId": 0,
          "nextContentId": 1
        },
        {
          "type": {
            "library": "H5P.BranchingQuestion 1.0",
            "params": {
              "branchingQuestion": {
                "alternatives": [
                  {
                    "nextContentId": 2,
                    "text": "xx"
                  },
                  {
                    "nextContentId": 3,
                    "text": "xx3"
                  }
                ],
                "question": "<p>xx oder xx3</p>"
              }
            }
          },
          "contentId": 1,
          "nextContentId": -1
        },
        {
          "type": {
            "library": "H5P.CoursePresentation 1.25",
            "params": {
              "presentation": {
                "slides": [
                  {
                    "elements": [
                      {
                        "action": {
                          "library": "H5P.Blanks 1.14",
                          "params": {
                            "text": "Trage die fehlenden Wörter ein!",
                            "questions": [
                              "<p>H5P-Inhalte können mit einem *Browser/Web-Browser:Etwas, das du jeden Tag nutzt* betrachtet werden.</p>"
                            ]
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          },
          "contentId": 2,
          "nextContentId": -1
        },
        {
          "type": {
            "library": "H5P.AdvancedText 1.1",
            "params": {
              "text": "<p>blabla</p>"
            }
          },
          "contentId": 3,
          "nextContentId": -1
        }
      ],
      "startScreen": {
        "startScreenTitle": "",
        "startScreenSubtitle": ""
      },
      "endScreens": [
        {
          "endScreenTitle": "",
          "endScreenSubtitle": "",
          "contentId": -1
        }
      ],
      "behaviour": {
        "enableBackwardsNavigation": false,
        "randomizeBranchingQuestions": false
      }
    }
  }
}
```

This structure shows how a Branching Scenario works:

1. **Content Array**: The scenario consists of an array of content objects, each with a unique `contentId`.

2. **Navigation Flow**:
   - Each content item has a `nextContentId` that determines where to go next 
   - A `nextContentId` of `-1` indicates an endpoint in the flow
   - Branching questions have multiple `alternatives`, each with its own `nextContentId`

3. **Content Types Used**:
   - `H5P.CoursePresentation`: Used for content screens with multiple elements
   - `H5P.BranchingQuestion`: Creates decision points with multiple paths
   - `H5P.AdvancedText`: Simple text content
   - `H5P.Image`: Image content
   - `H5P.Blanks`: Fill-in-the-blanks activity embedded in a Course Presentation

4. **Flow Structure**:
   - The scenario starts with a Course Presentation (contentId: 0)
   - Then presents a Branching Question (contentId: 1)
   - Depending on the user's choice, they proceed to either:
     - A Course Presentation with a Fill-in-the-blanks activity (contentId: 2)
     - A simple text content (contentId: 3)

5. **Multi-level Nesting**:
   - The structure demonstrates three levels of nesting:
     - Level 1: Branching Scenario as the container
     - Level 2: Course Presentation as an embedded content type
     - Level 3: Interactive elements (Text, Image, Blanks) embedded within Course Presentation

This example illustrates how the Branching Scenario creates a complete interactive experience by combining multiple content types into a decision-tree structure, allowing for personalized learning paths.

### Example: Interactive Book Structure

Based on our analysis of the content with ID `3014012899`, here's how an Interactive Book is structured:

```json
{
  "library": "H5P.InteractiveBook 1.11",
  "params": {
    "chapters": [
      {
        "params": {
          "content": [
            {
              "content": {
                "library": "H5P.Blanks 1.14",
                "params": {
                  "text": "Trage die fehlenden Wörter ein!",
                  "questions": ["<p>H5P-Inhalte können mit einem *Browser/Web-Browser:Etwas, das du jeden Tag nutzt* betrachtet werden.</p>"],
                  "behaviour": {
                    "enableRetry": true,
                    "enableSolutionsButton": true,
                    "showSolutionsRequiresInput": true
                  }
                }
              }
            }
          ]
        },
        "library": "H5P.Column 1.18",
        "metadata": {
          "title": "Chapter One Title"
        }
      },
      {
        "params": {
          "content": [
            {
              "content": {
                "library": "H5P.OpenEndedQuestion 1.0",
                "params": {
                  "question": "Text entry question"
                }
              }
            },
            {
              "content": {
                "library": "H5P.Image 1.1",
                "params": {
                  // Image parameters
                }
              }
            }
          ]
        },
        "library": "H5P.Column 1.18",
        "metadata": {
          "title": "Chapter Two Title"
        }
      },
      {
        "params": {
          "content": [
            {
              "content": {
                "library": "H5P.MultiChoice 1.16",
                "params": {
                  "question": "<p>Multiple choice question</p>",
                  "answers": [
                    {
                      "correct": true,
                      "text": "<div>Option 1</div>"
                    },
                    {
                      "correct": false,
                      "text": "<div>Option 2</div>"
                    }
                  ]
                }
              }
            },
            {
              "content": {
                "library": "H5P.AdvancedText 1.1",
                "params": {
                  "text": "<p>Additional text content</p>"
                }
              }
            }
          ]
        },
        "library": "H5P.Column 1.18",
        "metadata": {
          "title": "Chapter Three Title"
        }
      }
    ],
    "behaviour": {
      "defaultTableOfContents": true,
      "progressIndicators": true,
      "displaySummary": true
    }
  }
}
```

This structure demonstrates how Interactive Book:
1. Organizes content into multiple chapters, each implemented as a Column content
2. Embeds various interactive elements within each chapter (Blanks, OpenEndedQuestion, MultiChoice)
3. Supports mixed media content including text, images, and interactive elements
4. Provides navigation and progress tracking features

### Container Content Types Comparison

The following table compares the key features of major H5P container content types:

| Container Type | Organization Structure | Navigation Pattern | Key Features | Best Used For |
|----------------|------------------------|-------------------|--------------|---------------|
| **Interactive Video** | Timeline-based | Linear with interactions at specific timestamps | Video as primary media; interactions appear at timestamps | Video-based learning with embedded activities |
| **Branching Scenario** | Decision tree | Non-linear with user-determined paths | Multiple paths based on user choices; varied outcomes | Simulations, decision training, personalized learning paths |
| **Interactive Book** | Chapters and pages | Chapter-based with table of contents | Table of contents; progress tracking; summary page | Structured learning content similar to textbooks; course modules |
| **Course Presentation** | Slides | Linear or custom navigation | Slide-based presentation; keyword navigation | Presentations with interactive elements; guided tutorials |
| **Column** | Vertical stack | Scrolling | Simple vertical arrangement of content | Single-page content with multiple elements |

### Important Compatibility Notes

When working with complex H5P content types, keep these compatibility considerations in mind:

1. **Not All Libraries Can Be Combined**: Only specific content types are designed to serve as containers for other content.

2. **Container Content Types**: From our analysis, the available container types include:
   - Interactive Video (H5P.InteractiveVideo) - Embeds content at specific timestamps in a video
   - Course Presentation (H5P.CoursePresentation) - Embeds content on slides
   - Column (H5P.Column) - Arranges content vertically
   - Interactive Book (H5P.InteractiveBook) - Organizes content into chapters and pages
   - Branching Scenario (H5P.BranchingScenario) - Creates decision trees with different content paths
   - Question Set (limited to question-type content)

3. **Nesting Limitations**:
   - Most container types can embed other content, but container types typically cannot be nested within each other
   - For example, you cannot embed an Interactive Video inside another Interactive Video
   - Some containers may have restrictions on which content types they can embed

4. **Performance Considerations**:
   - Complex content with many embedded elements increases loading time and resource usage
   - Heavy use of video content with many interactions can impact performance
   - Consider splitting very complex scenarios into multiple smaller connected contents

### Performance and Complexity Considerations

When designing complex H5P content that combines multiple libraries, consider these additional points:

1. **Depth of Nesting**: 
   - Branching Scenarios allow for deep nesting (scenario → content item → interactive elements)
   - This flexibility enables complex learning experiences but requires careful planning

2. **Content Reusability**:
   - Container types don't easily allow reusing the same content across different paths
   - For frequently repeated content, consider using separate H5P content items and linking between them

3. **Testing Requirements**:
   - More complex structures require thorough testing of all possible paths
   - For Branching Scenarios, create a flowchart of decision points to ensure all paths function correctly

4. **User Navigation Experience**:
   - Consider providing visual cues about the user's current position in complex structures
   - For Branching Scenarios, implement clear feedback about choices and their consequences

### Learning from Existing Content

One of the most effective ways to understand how to combine libraries is to examine existing content. The `/h5p/params/{contentId}` endpoint is invaluable for this purpose:

```bash
# Get the full parameter structure of an existing Interactive Video
curl -X GET "http://localhost:8080/h5p/params/{contentId}" -H "Accept: application/json"
```

Using this endpoint, you can:
1. Study how complex content is structured
2. Learn which parameters are required for each content type
3. Understand how nested libraries reference each other
4. Extract templates for creating similar content

The examples provided in this documentation were developed by analyzing real H5P content using this endpoint, revealing the exact structure of Interactive Video and Branching Scenario content types.

### Customizing Content Parameters

Each H5P content type has its own unique parameter structure. To understand the parameter structure for a specific content type:

1. Create an example content through the UI
2. Use the network inspector to capture the JSON data sent to the server
3. Use that as a template for your API calls

#### Parameter Structure for Common Content Types

**Multiple Choice (H5P.MultiChoice):**
```json
{
  "question": "What is H5P?",
  "answers": [
    {
      "text": "An interactive content creation framework",
      "correct": true,
      "tipsAndFeedback": {
        "tip": "H5P stands for HTML5 Package",
        "chosenFeedback": "Correct!",
        "notChosenFeedback": ""
      }
    },
    {
      "text": "A programming language",
      "correct": false
    }
  ],
  "behaviour": {
    "enableRetry": true,
    "enableSolutionsButton": true,
    "singlePoint": true,
    "randomAnswers": true
  }
}
```

**True/False (H5P.TrueFalse):**
```json
{
  "question": "H5P stands for HTML5 Package",
  "correct": "true",
  "l10n": {
    "trueText": "True",
    "falseText": "False",
    "correctText": "Correct!",
    "wrongText": "Wrong!"
  }
}
```

**Fill in the Blanks (H5P.Blanks):**
```json
{
  "text": "H5P stands for *HTML5 Package*",
  "questions": ["HTML5 Package"],
  "behaviour": {
    "caseSensitive": false,
    "showSolutionsRequiresInput": true
  }
}
```

**Drag and Drop (H5P.DragQuestion):**
```json
{
  "question": {
    "settings": {
      "background": {
        "path": "background.jpg"
      }
    },
    "task": {
      "elements": [
        {
          "type": "image",
          "x": 10,
          "y": 10,
          "width": 30,
          "height": 30,
          "path": "element1.jpg"
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
}
```

Example parameter structures for more content types can be found in the [H5P Content Type Hub](https://h5p.org/content-types-and-applications).

### Performance Considerations

When working with complex H5P content that combines multiple libraries:

1. **Library Dependencies**: The system has to load all required libraries, which can impact loading time.
2. **Content Size**: Complex content with many embedded elements can be larger in size.
3. **Memory Usage**: Interactive videos with many interaction points can use more browser memory.

For optimal performance:

- Use the minimum number of libraries needed to achieve your goal
- Optimize media assets (compress images and videos)
- If creating very complex content, consider splitting it into multiple smaller connected contents 