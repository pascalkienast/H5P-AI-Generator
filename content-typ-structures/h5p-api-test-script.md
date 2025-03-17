# H5P API Testing Guide

This document provides test commands and sample structures for manually testing the H5P API integration. Use these examples to diagnose issues with content generation.

## Testing the H5P API Directly

### 1. Test API Availability

Check if the H5P API is accessible:

```bash
curl -v "https://h5p-api2.pascalkienast.de/h5p/libraries" -H "Accept: application/json"
```

### 2. Test Content Creation with Minimal Structure

Create content with a minimal valid structure:

```bash
curl -v -X POST -H "Content-Type: application/json" -H "x-api-key: 12345678" \
  https://h5p-api2.pascalkienast.de/h5p/new \
  -d '{
    "library": "H5P.QuestionSet 1.17",
    "params": {
      "metadata": {
        "title": "Minimal Test",
        "license": "U",
        "extraTitle": "Minimal Test"
      },
      "params": {
        "questions": [
          {
            "library": "H5P.MultiChoice 1.16",
            "params": {
              "question": "<p>Test?</p>",
              "answers": [
                {"text": "Yes", "correct": true},
                {"text": "No", "correct": false}
              ]
            },
            "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
            "metadata": {
              "title": "Test",
              "extraTitle": "Test"
            }
          }
        ]
      }
    }
  }'
```

### 3. Test Content Creation with Complete Structure

Create content with a more complete structure:

```bash
curl -v -X POST -H "Content-Type: application/json" -H "x-api-key: 12345678" \
  https://h5p-api2.pascalkienast.de/h5p/new \
  -d '{
    "library": "H5P.QuestionSet 1.17",
    "params": {
      "metadata": {
        "title": "Complete Test",
        "license": "U",
        "extraTitle": "Complete Test"
      },
      "params": {
        "introPage": {
          "showIntroPage": true,
          "title": "Test Quiz",
          "introduction": "<p>Simple test</p>",
          "startButtonText": "Start"
        },
        "questions": [
          {
            "library": "H5P.MultiChoice 1.16",
            "params": {
              "question": "<p>Test?</p>",
              "answers": [
                {"text": "Yes", "correct": true},
                {"text": "No", "correct": false}
              ]
            },
            "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
            "metadata": {
              "title": "Test",
              "extraTitle": "Test"
            }
          }
        ],
        "progressType": "dots",
        "passPercentage": 50,
        "showResults": true,
        "endGame": {
          "showResultPage": true,
          "showSolutionButton": true,
          "showRetryButton": true,
          "noResultMessage": "Finished",
          "message": "Your result:",
          "overallFeedback": [
            {"from": 0, "to": 100, "feedback": ""}
          ]
        },
        "override": {
          "showSolutionButton": "on",
          "retryButton": "on",
          "checkButton": true
        }
      }
    }
  }'
```

## Testing the Application's API Endpoint

### 1. Test with Minimal Structure

```bash
curl -X POST -H "Content-Type: application/json" \
  "http://localhost:3000/api/createH5P" \
  -d '{
    "jsonContent": {
      "library": "H5P.QuestionSet 1.17",
      "params": {
        "metadata": {
          "title": "Minimal Test",
          "license": "U",
          "extraTitle": "Minimal Test"
        },
        "params": {
          "questions": [
            {
              "library": "H5P.MultiChoice 1.16",
              "params": {
                "question": "<p>Test?</p>",
                "answers": [
                  {"text": "Yes", "correct": true},
                  {"text": "No", "correct": false}
                ]
              },
              "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
              "metadata": {
                "title": "Test",
                "extraTitle": "Test"
              }
            }
          ]
        }
      }
    }
  }'
```

### 2. Test with Complete Structure

```bash
curl -X POST -H "Content-Type: application/json" \
  "http://localhost:3000/api/createH5P" \
  -d '{
    "jsonContent": {
      "library": "H5P.QuestionSet 1.17",
      "params": {
        "metadata": {
          "title": "Complete Test",
          "license": "U",
          "extraTitle": "Complete Test"
        },
        "params": {
          "introPage": {
            "showIntroPage": true,
            "title": "Test Quiz",
            "introduction": "<p>Simple test</p>",
            "startButtonText": "Start"
          },
          "questions": [
            {
              "library": "H5P.MultiChoice 1.16",
              "params": {
                "question": "<p>Test?</p>",
                "answers": [
                  {"text": "Yes", "correct": true},
                  {"text": "No", "correct": false}
                ]
              },
              "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
              "metadata": {
                "title": "Test",
                "extraTitle": "Test"
              }
            }
          ],
          "progressType": "dots",
          "passPercentage": 50,
          "showResults": true,
          "endGame": {
            "showResultPage": true,
            "showSolutionButton": true,
            "showRetryButton": true,
            "noResultMessage": "Finished",
            "message": "Your result:",
            "overallFeedback": [
              {"from": 0, "to": 100, "feedback": ""}
            ]
          },
          "override": {
            "showSolutionButton": "on",
            "retryButton": "on",
            "checkButton": true
          }
        }
      }
    }
  }'
```

## Debugging Common Issues

### 1. Bad Gateway (502) Errors

This typically happens when:
- The H5P API server is unreachable
- The JSON structure is incompatible with the H5P API's expectations
- Required fields are missing in the JSON structure

### 2. Invalid H5P Content Structure

This happens when:
- The JSON structure doesn't match what the application's API expects
- Required fields like `library` or `params` are missing

### 3. SubContentId Issues

- Always use valid UUIDs for `subContentId`
- Example UUID format: `7cbc7723-1a41-4f83-b7b0-590f87fda441`
- Never use placeholder IDs like `unique-id-1`

### 4. Metadata Mismatches

- Ensure `title` and `extraTitle` match in all metadata objects
- Only include the specific metadata fields supported by the app's API 