# H5P Course Presentation: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Course Presentation content via the REST API. Following these exact patterns is essential for creating functional slide-based presentations.

## 1. Top-Level Structure Requirements

A working H5P Course Presentation **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.CoursePresentation 1.24",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual course presentation content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.CoursePresentation 1.24`)
3. **Nested Params Structure**: Presentation content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Title of the Presentation",
  "license": "U",
  "defaultLanguage": "en",
  "extraTitle": "Title of the Presentation",
  "mainLibrary": "H5P.CoursePresentation",
  "preloadedDependencies": [
    {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
    {"machineName": "H5P.CoursePresentation", "majorVersion": 1, "minorVersion": 24}
  ]
}
```

### Required Dependencies:

The framework requires these minimum dependencies for functionality:

- **H5P.CoursePresentation**: Main content type
- **H5P.AdvancedText**: For text content
- **H5P.Image**: For image content
- **H5P.JoubelUI**: For UI elements
- **H5P.Transition**: For slide transitions
- **H5P.FontIcons**: For icons
- **FontAwesome**: For additional icons
- **jQuery.ui**: For interactive UI elements

**Additional dependencies based on content:**
- If using questions: `H5P.Question`, `H5P.MultiChoice`, etc.
- If using drag and drop: `H5P.DragQuestion`
- If using shapes: `H5P.Shape`
- If using single choice sets: `H5P.SingleChoiceSet`
- And any other specific content types used within slides

## 3. Presentation Structure

The main structure for a Course Presentation is defined in the `params.params.presentation` object:

```json
"params": {
  "presentation": {
    "slides": [
      // Array of slide objects
    ],
    "keywordListEnabled": true,
    "globalBackgroundSelector": {
      "fillGlobalBackground": "#f28d8d" // Global background color
    },
    "keywordListAlwaysShow": false,
    "keywordListAutoHide": false,
    "keywordListOpacity": 90
  },
  "override": {
    // Override settings
  },
  "l10n": {
    // Localization strings
  }
}
```

### Key Components:

1. **Slides Array**: Contains all slides in the presentation
2. **Keyword List Settings**: Controls the sidebar navigation menu
3. **Global Background**: Sets background color for all slides
4. **Override Settings**: Controls various display options
5. **Localization**: Text strings for UI elements

## 4. Slide Structure

Each slide in the presentation follows this structure:

```json
{
  "elements": [
    // Array of slide elements (content)
  ],
  "keywords": [
    {"main": "Title of Slide"}
  ],
  "slideBackgroundSelector": {
    // Optional slide-specific background
  }
}
```

### Critical Slide Requirements:

1. **Elements Array**: Contains all content elements on the slide
2. **Keywords**: Optional navigation labels for the slide
3. **Background**: Optional slide-specific background settings

## 5. Slide Elements (Content)

Each element on a slide follows this structure:

```json
{
  "x": 14.16, // X position as percentage (0-100)
  "y": 36.67, // Y position as percentage (0-100)
  "width": 25.94, // Width as percentage (0-100)
  "height": 40, // Height as percentage (0-100)
  "action": {
    "library": "H5P.Image 1.1", // Content type library
    "params": {
      // Content-specific parameters
    },
    "subContentId": "e815c500-a786-436f-ae17-0867dc941b44",
    "metadata": {
      // Content metadata
    }
  },
  "alwaysDisplayComments": false,
  "backgroundOpacity": 0,
  "displayAsButton": false,
  "buttonSize": "big",
  "goToSlideType": "specified",
  "invisible": false,
  "solution": "" // Optional solution text
}
```

### Critical Element Requirements:

1. **Position and Size**: `x`, `y`, `width`, and `height` define element placement
2. **Action Object**: Contains library, parameters, and metadata for the content
3. **SubContentId**: Unique UUID for the element
4. **Display Settings**: Control how the element appears and behaves

## 6. Specific Content Type Examples

### 6.1 Text Content (H5P.AdvancedText)

```json
"action": {
  "library": "H5P.AdvancedText 1.1",
  "params": {
    "text": "<h2><span style=\"font-size:2.25em\"><strong>Text Title</strong></span></h2>\n"
  },
  "subContentId": "4ffc5247-0ecc-4e3c-bb9b-0c356f9b6db0",
  "metadata": {
    "contentType": "Text",
    "license": "U",
    "title": "Untitled Text",
    "authors": [],
    "changes": []
  }
}
```

### 6.2 Image Content (H5P.Image)

```json
"action": {
  "library": "H5P.Image 1.1",
  "params": {
    "decorative": false,
    "contentName": "Image",
    "expandImage": "Expand Image",
    "minimizeImage": "Minimize Image",
    "file": {
      "path": "images/image-jp019LEn.png",
      "mime": "image/png",
      "copyright": {"license": "U"},
      "width": 1504,
      "height": 1174
    },
    "alt": "ALT TEXT",
    "title": "test"
  },
  "subContentId": "e815c500-a786-436f-ae17-0867dc941b44",
  "metadata": {
    "contentType": "Bild",
    "license": "U",
    "title": "Untitled Image",
    "authors": [],
    "changes": []
  }
}
```

### 6.3 Multiple Choice Question (H5P.MultiChoice)

```json
"action": {
  "library": "H5P.MultiChoice 1.16",
  "params": {
    "media": {
      "disableImageZooming": false
    },
    "answers": [
      {
        "correct": true,
        "tipsAndFeedback": {
          "tip": "",
          "chosenFeedback": "",
          "notChosenFeedback": ""
        },
        "text": "<div>Correct Answer</div>\n"
      },
      {
        "correct": false,
        "tipsAndFeedback": {
          "tip": "",
          "chosenFeedback": "",
          "notChosenFeedback": ""
        },
        "text": "<div>Incorrect Answer</div>\n"
      }
    ],
    "overallFeedback": [
      {"from": 0, "to": 100, "feedback": "Feedback for all score ranges"}
    ],
    "behaviour": {
      "enableRetry": true,
      "enableSolutionsButton": true,
      "enableCheckButton": true,
      "type": "auto",
      "singlePoint": false,
      "randomAnswers": true,
      "showSolutionsRequiresInput": true,
      "confirmCheckDialog": false,
      "confirmRetryDialog": false,
      "autoCheck": false,
      "passPercentage": 100,
      "showScorePoints": true
    },
    "UI": {
      // UI text strings
    },
    "question": "<p>Multiple Choice Question</p>\n"
  },
  "subContentId": "b1868c7f-1c64-4cc1-9aa5-2c5351ce1682",
  "metadata": {
    "contentType": "Multiple Choice",
    "license": "U",
    "title": "Multiple Choice",
    "authors": [],
    "changes": [],
    "extraTitle": "Multiple Choice"
  }
}
```

### 6.4 Single Choice Set (H5P.SingleChoiceSet)

```json
"action": {
  "library": "H5P.SingleChoiceSet 1.11",
  "params": {
    "choices": [
      {
        "subContentId": "a5225ba6-a5e7-4baf-8345-23221a9bfbce",
        "question": "<p>Question 1</p>\n",
        "answers": [
          "<p>The first alternative is the correct one</p>\n",
          "<p>This is wrong</p>\n",
          "<p>This is also wrong</p>\n"
        ]
      },
      {
        "subContentId": "d7d0755c-6556-4a4e-9d7a-eca32fb1bb8e",
        "question": "<p>Question 2</p>\n",
        "answers": [
          "<p>The first is the correct one</p>\n",
          "<p>Wrong answer</p>\n"
        ]
      }
    ],
    "overallFeedback": [
      {"from": 0, "to": 50, "feedback": "Score range 0-50"},
      {"from": 51, "to": 100, "feedback": "Score range 51-100"}
    ],
    "behaviour": {
      "autoContinue": true,
      "timeoutCorrect": 2000,
      "timeoutWrong": 3000,
      "soundEffectsEnabled": true,
      "enableRetry": true,
      "enableSolutionsButton": true,
      "passPercentage": 100
    },
    "l10n": {
      // Localization strings
    }
  },
  "subContentId": "814b58a0-b72e-4695-9d36-a8ad4ec1838e",
  "metadata": {
    "contentType": "Single Choice Set",
    "license": "U",
    "title": "Question Set Title",
    "authors": [],
    "changes": [],
    "extraTitle": "Question Set Title"
  }
}
```

### 6.5 Shape (H5P.Shape)

```json
"action": {
  "library": "H5P.Shape 1.0",
  "params": {
    "shape": {
      "fillColor": "#fff",
      "borderWidth": 0,
      "borderStyle": "solid",
      "borderColor": "#000",
      "borderRadius": 0
    },
    "type": "rectangle",
    "line": {
      "borderColor": "#000000",
      "borderWidth": "1",
      "borderStyle": "solid"
    }
  },
  "subContentId": "73a10cc4-28ae-41d5-9c47-d40dec5717a2",
  "metadata": {
    "contentType": "Shape"
  }
}
```

### 6.6 Drag and Drop (H5P.DragQuestion)

```json
"action": {
  "library": "H5P.DragQuestion 1.14",
  "params": {
    "scoreShow": "Check",
    "submit": "Submit",
    "tryAgain": "Retry",
    "scoreExplanation": "Scoring explanation text",
    "question": {
      "settings": {
        "size": {
          "width": 620,
          "height": 310
        },
        "background": {
          "path": "images/image-uNIiYwbV.jpg",
          "mime": "image/jpeg",
          "copyright": {"license": "U"},
          "width": 700,
          "height": 499
        }
      },
      "task": {
        "elements": [
          // Draggable elements
        ],
        "dropZones": [
          {
            "x": 8.06,
            "y": 22.58,
            "width": 5,
            "height": 2.5,
            "correctElements": [],
            "showLabel": true,
            "backgroundOpacity": 100,
            "tipsAndFeedback": {"tip": ""},
            "single": false,
            "autoAlign": false,
            "type": {"library": "H5P.DragQuestionDropzone 0.1"},
            "label": "<div>Dropzone Label</div>\n"
          }
        ]
      }
    },
    "overallFeedback": [
      {"from": 0, "to": 100, "feedback": "0-100"}
    ],
    "behaviour": {
      // Behavior settings
    }
  },
  "subContentId": "84b73cbd-ebe9-41ab-8c51-6ce4857b6e87",
  "metadata": {
    "contentType": "Drag and Drop",
    "license": "U",
    "title": "Drag and Drop Title",
    "authors": [],
    "changes": [],
    "extraTitle": "Drag and Drop Title"
  }
}
```

## 7. Presentation Settings

### 7.1 Keyword List (Navigation Menu)

```json
"keywordListEnabled": true,        // Enable/disable keyword navigation
"keywordListAlwaysShow": false,    // Always show keywords or only on hover
"keywordListAutoHide": false,      // Auto-hide keywords after a delay
"keywordListOpacity": 90           // Opacity of the keyword list (0-100)
```

### 7.2 Global Background

```json
"globalBackgroundSelector": {
  "fillGlobalBackground": "#f28d8d"  // Background color for all slides
}
```

### 7.3 Override Settings

```json
"override": {
  "activeSurface": false,              // Activate entire surface as button
  "hideSummarySlide": false,           // Hide the summary slide
  "summarySlideSolutionButton": true,  // Show solution button on summary
  "summarySlideRetryButton": true,     // Show retry button on summary
  "enablePrintButton": false,          // Enable print functionality
  "social": {
    "showFacebookShare": false,
    "facebookShare": {
      "url": "@currentpageurl",
      "quote": "I scored @score out of @maxScore on a task at @currentpageurl."
    },
    "showTwitterShare": false,
    "twitterShare": {
      "statement": "I scored @score out of @maxScore on a task at @currentpageurl.",
      "url": "@currentpageurl",
      "hashtags": "h5p, course"
    },
    "showGoogleShare": false,
    "googleShareUrl": "@currentpageurl"
  }
}
```

### 7.4 Localization (l10n)

```json
"l10n": {
  "slide": "Slide",
  "score": "Score",
  "yourScore": "Your Score",
  "maxScore": "Max Score",
  "total": "Total",
  "totalScore": "Total Score",
  "showSolutions": "Show solutions",
  "retry": "Retry",
  "exportAnswers": "Export text",
  "hideKeywords": "Hide sidebar navigation menu",
  "showKeywords": "Show sidebar navigation menu",
  "fullscreen": "Fullscreen",
  "exitFullscreen": "Exit fullscreen",
  "prevSlide": "Previous slide",
  "nextSlide": "Next slide",
  "currentSlide": "Current slide",
  "lastSlide": "Last slide",
  "solutionModeTitle": "Exit solution mode",
  "solutionModeText": "Solution Mode",
  "summaryMultipleTaskText": "Multiple tasks",
  "scoreMessage": "You achieved:",
  "shareFacebook": "Share on Facebook",
  "shareTwitter": "Share on Twitter",
  "shareGoogle": "Share on Google+",
  "summary": "Summary",
  "solutionsButtonTitle": "Show comments",
  "printTitle": "Print",
  "printIngress": "How would you like to print this presentation?",
  "printAllSlides": "Print all slides",
  "printCurrentSlide": "Print current slide"
  // Plus additional accessibility strings
}
```

## 8. Common Issues and Solutions

1. **Issue**: Elements not appearing on slides at the correct position
   **Solution**: Ensure x, y, width, and height values are correct percentages (0-100)

2. **Issue**: Interactive elements not functioning
   **Solution**: Check that all required dependencies are included and that the behavior settings are properly configured

3. **Issue**: Summary slide not showing scores correctly
   **Solution**: Verify that all interactive elements have the correct metadata and subContentId values

4. **Issue**: Navigation menu (keywords) not appearing
   **Solution**: Make sure keywordListEnabled is set to true and that slides have keywords defined

5. **Issue**: Background colors not applying
   **Solution**: Check the globalBackgroundSelector and individual slideBackgroundSelector objects

6. **Issue**: Content not displaying correctly
   **Solution**: Verify each element has proper subContentId and complete action object with library and params

## 9. Complete Example Structure

Below is a minimal working example combining all required elements:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Example Course Presentation",
    "license": "U",
    "defaultLanguage": "en",
    "extraTitle": "Example Course Presentation",
    "mainLibrary": "H5P.CoursePresentation",
    "preloadedDependencies": [
      {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
      {"machineName": "H5P.CoursePresentation", "majorVersion": 1, "minorVersion": 24}
    ]
  },
  "library": "H5P.CoursePresentation 1.24",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Example Course Presentation",
      "license": "U",
      "defaultLanguage": "en",
      "extraTitle": "Example Course Presentation",
      "mainLibrary": "H5P.CoursePresentation",
      "preloadedDependencies": [
        {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
        {"machineName": "H5P.CoursePresentation", "majorVersion": 1, "minorVersion": 24}
      ]
    },
    "params": {
      "presentation": {
        "slides": [
          {
            "elements": [
              {
                "x": 10,
                "y": 10,
                "width": 80,
                "height": 15,
                "action": {
                  "library": "H5P.AdvancedText 1.1",
                  "params": {
                    "text": "<h2>Example Slide Title</h2>"
                  },
                  "subContentId": "83e73ab7-52dd-4482-b4de-b18c94c93b2a",
                  "metadata": {
                    "contentType": "Text",
                    "license": "U",
                    "title": "Slide Title",
                    "authors": [],
                    "changes": []
                  }
                },
                "alwaysDisplayComments": false,
                "backgroundOpacity": 0,
                "displayAsButton": false,
                "buttonSize": "big",
                "goToSlideType": "specified",
                "invisible": false,
                "solution": ""
              },
              {
                "x": 10,
                "y": 30,
                "width": 40,
                "height": 40,
                "action": {
                  "library": "H5P.Image 1.1",
                  "params": {
                    "decorative": false,
                    "contentName": "Image",
                    "file": {
                      "path": "images/example-image.jpg",
                      "mime": "image/jpeg",
                      "copyright": {"license": "U"},
                      "width": 800,
                      "height": 600
                    },
                    "alt": "Example image"
                  },
                  "subContentId": "e815c500-a786-436f-ae17-0867dc941b44",
                  "metadata": {
                    "contentType": "Image",
                    "license": "U",
                    "title": "Example Image",
                    "authors": [],
                    "changes": []
                  }
                },
                "alwaysDisplayComments": false,
                "backgroundOpacity": 0,
                "displayAsButton": false,
                "buttonSize": "big",
                "goToSlideType": "specified",
                "invisible": false,
                "solution": ""
              }
            ],
            "keywords": [
              {"main": "Example Slide"}
            ],
            "slideBackgroundSelector": {}
          }
        ],
        "keywordListEnabled": true,
        "globalBackgroundSelector": {
          "fillGlobalBackground": "#ffffff"
        },
        "keywordListAlwaysShow": false,
        "keywordListAutoHide": false,
        "keywordListOpacity": 90
      },
      "override": {
        "activeSurface": false,
        "hideSummarySlide": false,
        "summarySlideSolutionButton": true,
        "summarySlideRetryButton": true,
        "enablePrintButton": false,
        "social": {
          "showFacebookShare": false,
          "showTwitterShare": false,
          "showGoogleShare": false
        }
      },
      "l10n": {
        "slide": "Slide",
        "score": "Score",
        "yourScore": "Your Score",
        "maxScore": "Max Score",
        "total": "Total",
        "totalScore": "Total Score",
        "showSolutions": "Show solutions",
        "retry": "Retry",
        "summary": "Summary"
      }
    }
  }
}
```

## 10. Testing Validation

To validate your Course Presentation structure:

1. Ensure all structure patterns match exactly as specified
2. Upload to your H5P endpoint
3. Verify that:
   - All slides display correctly
   - Navigation between slides works
   - Interactive elements function properly
   - The summary slide appears and works correctly (if not hidden)
   - The keyword navigation menu appears (if enabled)

## 11. Advanced Features

### 11.1 Navigation and Flow Control

Course Presentation provides several ways to control navigation:

1. **Standard Navigation**: Default next/previous buttons
2. **Keyword Navigation**: Side menu for jumping to specific slides
3. **Element-based Navigation**: Elements can be configured to navigate to specific slides

To set an element to navigate to a specific slide when clicked:

```json
{
  "displayAsButton": true,
  "buttonSize": "big",
  "goToSlideType": "specified",
  "goToSlide": 3 // 0-based index, so this navigates to the 4th slide
}
```

### 11.2 Element Comments and Solutions

Elements can include additional explanatory text:

```json
{
  "alwaysDisplayComments": true, // Show comments permanently
  "backgroundOpacity": 70, // Background opacity for comments
  "solution": "<p>This is an explanation or solution text.</p>"
}
```

### 11.3 Slide Backgrounds

Each slide can have a unique background:

```json
"slideBackgroundSelector": {
  "fillSlideBackground": "#f0f0f0", // Background color
  "imageSlideBackground": {
    "path": "images/background.jpg",
    "mime": "image/jpeg",
    "copyright": {"license": "U"},
    "width": 1920,
    "height": 1080
  }
}
```

## 12. Summary of Critical Requirements

For a functioning H5P Course Presentation, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Proper slide structure**: Each slide with elements array and correct positioning
4. **Unique subContentIds**: Every content element needs a UUID-format subContentId
5. **Element positioning**: Correct x, y, width, and height values as percentages
6. **Action object structure**: Each element needs proper library, params, and metadata

By following this guide precisely, you can create reliable H5P Course Presentations that function correctly across all devices and platforms. 