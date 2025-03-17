# H5P DragQuestion (Drag and Drop): Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P DragQuestion (Drag and Drop) content via the REST API. Following these exact patterns is essential for creating functional drag and drop exercises.

## 1. Top-Level Structure Requirements

A working H5P DragQuestion **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.DragQuestion 1.14",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual drag and drop content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.DragQuestion 1.14`)
3. **Nested Params Structure**: Exercise content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Drag and Drop Example",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.DragQuestion",
  "preloadedDependencies": [
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
    {"machineName": "H5P.DragQuestion", "majorVersion": 1, "minorVersion": 14}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for DragQuestion functionality:

- **H5P.DragQuestion**: Main content type
- **H5P.Question**: Base question framework
- **H5P.JoubelUI**: For UI elements
- **jQuery.ui**: For drag and drop functionality
- **FontAwesome**: For icons

## 3. Exercise Structure

The main structure for a DragQuestion exercise is defined in the `params.params` object:

```json
"params": {
  "scoreShow": "Check",
  "submit": "Submit",
  "tryAgain": "Retry",
  "scoreExplanation": "Correct answers give +1 point. Incorrect answers give -1 point. The lowest possible score is 0.",
  "question": {
    "settings": {
      "size": {
        "width": 620,
        "height": 310
      },
      "background": {
        "path": "images/background.jpg",
        "mime": "image/jpeg",
        "copyright": {"license": "U"},
        "width": 700,
        "height": 499
      }
    },
    "task": {
      "elements": [
        {
          "type": {
            "library": "H5P.Text 1.1",
            "params": {
              "text": "Draggable text"
            }
          },
          "y": 5,
          "x": 5,
          "width": 15,
          "height": 5,
          "dropZones": [0]
        },
        {
          "type": {
            "library": "H5P.Image 1.1",
            "params": {
              "file": {
                "path": "images/image.jpg",
                "mime": "image/jpeg",
                "copyright": {"license": "U"},
                "width": 300,
                "height": 200
              },
              "alt": "Draggable image"
            }
          },
          "y": 20,
          "x": 5,
          "width": 15,
          "height": 15,
          "dropZones": [1]
        }
      ],
      "dropZones": [
        {
          "x": 50,
          "y": 5,
          "width": 30,
          "height": 10,
          "correctElements": [0],
          "showLabel": true,
          "label": "Text goes here",
          "backgroundOpacity": 70,
          "tipsAndFeedback": {
            "tip": "This is where text should be placed"
          },
          "single": false,
          "autoAlign": false
        },
        {
          "x": 50,
          "y": 20,
          "width": 30,
          "height": 15,
          "correctElements": [1],
          "showLabel": true,
          "label": "Image goes here",
          "backgroundOpacity": 70,
          "tipsAndFeedback": {
            "tip": "This is where the image should be placed"
          },
          "single": false,
          "autoAlign": false
        }
      ]
    }
  },
  "overallFeedback": [
    {"from": 0, "to": 40, "feedback": "You need more practice!"},
    {"from": 41, "to": 80, "feedback": "Good effort!"},
    {"from": 81, "to": 100, "feedback": "Excellent!"}
  ],
  "behaviour": {
    "enableRetry": true,
    "enableCheckButton": true,
    "singlePoint": false,
    "applyPenalties": true,
    "enableScoreExplanation": true,
    "dropZoneHighlighting": "dragging",
    "autoAlignSpacing": 2,
    "enableFullScreen": false,
    "showScorePoints": true,
    "showTitle": true
  },
  "grabbablePrefix": "Grabbable {num} of {total}.",
  "grabbableSuffix": "Placed in dropzone {num}.",
  "dropzonePrefix": "Dropzone {num} of {total}.",
  "noDropzone": "No dropzone.",
  "tipLabel": "Show tip.",
  "correctAnswer": "Correct answer",
  "wrongAnswer": "Wrong answer",
  "feedbackHeader": "Feedback",
  "scoreBarLabel": "You got :num out of :total points",
  "scoreExplanationButtonLabel": "Show score explanation"
}
```

### Key Components:

1. **Question Settings**: Defines the background and size of the exercise area
2. **Task Elements**: The draggable items
3. **Drop Zones**: The target areas where items can be dropped
4. **Behavior Settings**: Controls how the exercise behaves
5. **UI Text**: Customizable labels for the user interface
6. **Overall Feedback**: Feedback based on score ranges

## 4. Draggable Elements

Each draggable element in the `elements` array follows this structure:

```json
{
  "type": {
    "library": "H5P.Text 1.1", // or H5P.Image 1.1
    "params": {
      // Content-specific parameters
    }
  },
  "y": 5,              // Y position (percentage)
  "x": 5,              // X position (percentage)
  "width": 15,         // Width (percentage)
  "height": 5,         // Height (percentage)
  "dropZones": [0, 1]  // Array of drop zone indices where this element can be placed
}
```

### Element Types:

1. **Text Element**:
```json
"type": {
  "library": "H5P.Text 1.1",
  "params": {
    "text": "Draggable text"
  }
}
```

2. **Image Element**:
```json
"type": {
  "library": "H5P.Image 1.1",
  "params": {
    "file": {
      "path": "images/image.jpg",
      "mime": "image/jpeg",
      "copyright": {"license": "U"},
      "width": 300,
      "height": 200
    },
    "alt": "Draggable image"
  }
}
```

## 5. Drop Zones

Each drop zone in the `dropZones` array follows this structure:

```json
{
  "x": 50,                 // X position (percentage)
  "y": 5,                  // Y position (percentage)
  "width": 30,             // Width (percentage)
  "height": 10,            // Height (percentage)
  "correctElements": [0],  // Array of element indices that can be correctly placed here
  "showLabel": true,       // Whether to show the label
  "label": "Text goes here", // Label text
  "backgroundOpacity": 70, // Opacity of the background (0-100)
  "tipsAndFeedback": {
    "tip": "This is where text should be placed"
  },
  "single": false,         // Whether only one element can be placed here
  "autoAlign": false       // Whether to automatically align dropped elements
}
```

## 6. Behavior Settings

The behavior settings control how the exercise functions:

```json
"behaviour": {
  "enableRetry": true,             // Allow retrying the exercise
  "enableCheckButton": true,       // Show check button
  "singlePoint": false,            // Award a single point for the whole exercise
  "applyPenalties": true,          // Apply penalties for incorrect answers
  "enableScoreExplanation": true,  // Show score explanation
  "dropZoneHighlighting": "dragging", // When to highlight drop zones (always/dragging/never)
  "autoAlignSpacing": 2,           // Spacing for auto-alignment
  "enableFullScreen": false,       // Allow full-screen mode
  "showScorePoints": true,         // Show score points
  "showTitle": true                // Show title
}
```

## 7. Overall Feedback Settings

Define feedback based on score ranges:

```json
"overallFeedback": [
  {"from": 0, "to": 40, "feedback": "You need more practice!"},
  {"from": 41, "to": 80, "feedback": "Good effort!"},
  {"from": 81, "to": 100, "feedback": "Excellent!"}
]
```

## 8. Common Issues and Solutions

1. **Issue**: Draggable elements not appearing
   **Solution**: Ensure elements have correct position (x, y) and size (width, height) values

2. **Issue**: Elements can't be dropped in drop zones
   **Solution**: Verify that element's `dropZones` array includes the correct drop zone indices

3. **Issue**: Correct answers not being recognized
   **Solution**: Check that drop zone's `correctElements` array includes the correct element indices

4. **Issue**: Drop zones not visible
   **Solution**: Make sure `backgroundOpacity` is set to a value greater than 0

5. **Issue**: Automatic alignment not working
   **Solution**: Set drop zone's `autoAlign` to true and adjust `autoAlignSpacing`

## 9. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Drag and Drop Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.DragQuestion",
    "preloadedDependencies": [
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
      {"machineName": "H5P.DragQuestion", "majorVersion": 1, "minorVersion": 14}
    ]
  },
  "library": "H5P.DragQuestion 1.14",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Drag and Drop Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.DragQuestion",
      "preloadedDependencies": [
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
        {"machineName": "H5P.DragQuestion", "majorVersion": 1, "minorVersion": 14}
      ]
    },
    "params": {
      "question": {
        "settings": {
          "size": {
            "width": 620,
            "height": 310
          }
        },
        "task": {
          "elements": [
            {
              "type": {
                "library": "H5P.Text 1.1",
                "params": {
                  "text": "Draggable text"
                }
              },
              "y": 5,
              "x": 5,
              "width": 15,
              "height": 5,
              "dropZones": [0]
            }
          ],
          "dropZones": [
            {
              "x": 50,
              "y": 5,
              "width": 30,
              "height": 10,
              "correctElements": [0],
              "showLabel": true,
              "label": "Text goes here",
              "backgroundOpacity": 70
            }
          ]
        }
      },
      "behaviour": {
        "enableRetry": true,
        "enableCheckButton": true,
        "singlePoint": false,
        "applyPenalties": true,
        "enableScoreExplanation": true,
        "dropZoneHighlighting": "dragging",
        "autoAlignSpacing": 2,
        "showScorePoints": true
      }
    }
  }
}
```

## 10. Variants and Special Configurations

### 10.1 Single Answer Configuration

For exercises where each drop zone accepts only one element:

```json
"dropZones": [
  {
    "single": true,
    // other properties...
  }
]
```

### 10.2 Auto-Align Configuration

To automatically align elements when dropped:

```json
"dropZones": [
  {
    "autoAlign": true,
    "autoAlignSpacing": 2,
    // other properties...
  }
]
```

### 10.3 With Background Image

Adding a background image to the exercise:

```json
"settings": {
  "size": {
    "width": 620,
    "height": 400
  },
  "background": {
    "path": "images/map.jpg",
    "mime": "image/jpeg",
    "copyright": {"license": "U"},
    "width": 620,
    "height": 400
  }
}
```

### 10.4 Drop Zone Highlighting

Controlling when drop zones are highlighted:

```json
"behaviour": {
  "dropZoneHighlighting": "always" // Options: "always", "dragging", "never"
}
```

## 11. Advanced Features

### 11.1 Multiple Correct Elements

A drop zone can accept multiple correct elements:

```json
"dropZones": [
  {
    "correctElements": [0, 1, 2],
    // other properties...
  }
]
```

### 11.2 Multiple Possible Drop Zones

An element can be correctly placed in multiple drop zones:

```json
"elements": [
  {
    "dropZones": [0, 1, 2],
    // other properties...
  }
]
```

### 11.3 Tips and Feedback

Adding tips and feedback to drop zones:

```json
"dropZones": [
  {
    "tipsAndFeedback": {
      "tip": "This is a hint for where this element should go",
      "feedbackOnCorrect": "Well done!",
      "feedbackOnIncorrect": "Try again!"
    },
    // other properties...
  }
]
```

## 12. Summary of Critical Requirements

For a functioning H5P DragQuestion exercise, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Elements array**: Properly configured draggable elements with correct positions and sizes
4. **Drop zones array**: Properly configured drop areas with correct positions and sizes
5. **Correct mappings**: Elements' `dropZones` arrays must reference the correct drop zone indices
6. **Correct answers**: Drop zones' `correctElements` arrays must reference the correct element indices

By following this guide precisely, you can create reliable H5P Drag and Drop exercises that function correctly across all devices and platforms. 