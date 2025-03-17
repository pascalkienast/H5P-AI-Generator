# H5P DragText: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P DragText content via the REST API. Following these exact patterns is essential for creating functional drag text exercises.

## 1. Top-Level Structure Requirements

A working H5P DragText **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.DragText 1.8",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "taskDescription": "Drag the words into the correct boxes.",
    "textField": "This is *a* sample *text* with *draggable* words.",
    "overallFeedback": [
      {"from": 0, "to": 40, "feedback": "You need more practice!"},
      {"from": 41, "to": 80, "feedback": "Good effort!"},
      {"from": 81, "to": 100, "feedback": "Excellent!"}
    ],
    "behaviour": {
      // Behavior settings
    },
    "l10n": {
      // UI text labels
    },
    "media": {
      // Optional media
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.DragText 1.8`)
3. **Special Text Format**: Draggable words must be marked with asterisks (e.g., `*word*`)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Drag Text Example",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.DragText",
  "preloadedDependencies": [
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "H5P.DragText", "majorVersion": 1, "minorVersion": 8}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for DragText functionality:

- **H5P.DragText**: Main content type
- **H5P.Question**: Base question framework
- **H5P.JoubelUI**: For UI elements
- **FontAwesome**: For icons

## 3. Exercise Structure

The main structure for a DragText exercise is defined in the params object:

```json
"params": {
  "taskDescription": "Drag the words into the correct boxes.",
  "textField": "This is *a* sample *text* with *draggable* words.",
  "overallFeedback": [
    {"from": 0, "to": 40, "feedback": "You need more practice!"},
    {"from": 41, "to": 80, "feedback": "Good effort!"},
    {"from": 81, "to": 100, "feedback": "Excellent!"}
  ],
  "behaviour": {
    "enableRetry": true,
    "enableSolutionsButton": true,
    "instantFeedback": false,
    "enableCheckButton": true,
    "caseSensitive": true,
    "showSolutionsRequiresInput": true,
    "confirmCheckDialog": false,
    "confirmRetryDialog": false,
    "customDragAndDropWidth": false,
    "dragAndDropWidth": 20
  },
  "l10n": {
    "checkAnswer": "Check",
    "showSolution": "Show solution",
    "tryAgain": "Retry",
    "dropZoneIndex": "Drop Zone @index.",
    "empty": "Drop Zone @index is empty.",
    "contains": "Drop Zone @index contains draggable @draggable.",
    "correctText": "@text is placed correctly",
    "incorrectText": "@text is placed incorrectly",
    "ariaDraggableIndex": "Draggable @index of @count.",
    "tipLabel": "Show tip",
    "tipsLabel": "Tips",
    "correctAnswer": "Correct answer:",
    "feedback": "Feedback",
    "scoreBarLabel": "You got :num out of :total points"
  },
  "media": {
    "disableImageZooming": false
  }
}
```

### Key Components:

1. **Task Description**: Instructions for the exercise
2. **Text Field**: Text with marked draggable words
3. **Behavior Settings**: Controls how the exercise behaves
4. **UI Text (l10n)**: Customizable labels for the user interface
5. **Overall Feedback**: Feedback based on score ranges
6. **Media Settings**: Optional settings for media elements

## 4. Marking Draggable Words

Draggable words are specified in the `textField` by enclosing them in asterisks:

```json
"textField": "This is *a* sample *text* with *draggable* words."
```

In this example, the words "a", "text", and "draggable" will be draggable elements.

### Rules for Marking Words:

1. Words must be enclosed in single asterisks: `*word*`
2. Multiple consecutive words can be marked as a single draggable unit: `*multiple words*`
3. Spaces should not be included inside the asterisks unless they are part of the draggable text
4. Special characters are allowed inside the asterisks: `*special-character*`

## 5. Behavior Settings

The behavior settings control how the exercise functions:

```json
"behaviour": {
  "enableRetry": true,             // Allow retrying the exercise
  "enableSolutionsButton": true,   // Show solutions button
  "instantFeedback": false,        // Provide feedback immediately when words are dropped
  "enableCheckButton": true,       // Show check button
  "caseSensitive": true,           // Make answers case sensitive
  "showSolutionsRequiresInput": true, // Require input before showing solutions
  "confirmCheckDialog": false,     // Show confirmation dialog before checking
  "confirmRetryDialog": false,     // Show confirmation dialog before retrying
  "customDragAndDropWidth": false, // Use custom width for draggable elements
  "dragAndDropWidth": 20           // Width for draggable elements (if customDragAndDropWidth is true)
}
```

## 6. Localization (l10n) Settings

The l10n settings provide customizable text labels for the UI:

```json
"l10n": {
  "checkAnswer": "Check",
  "showSolution": "Show solution",
  "tryAgain": "Retry",
  "dropZoneIndex": "Drop Zone @index.",
  "empty": "Drop Zone @index is empty.",
  "contains": "Drop Zone @index contains draggable @draggable.",
  "correctText": "@text is placed correctly",
  "incorrectText": "@text is placed incorrectly",
  "ariaDraggableIndex": "Draggable @index of @count.",
  "tipLabel": "Show tip",
  "tipsLabel": "Tips",
  "correctAnswer": "Correct answer:",
  "feedback": "Feedback",
  "scoreBarLabel": "You got :num out of :total points"
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

## 8. Media Settings

Optional settings for media elements:

```json
"media": {
  "disableImageZooming": false
}
```

## 9. Common Issues and Solutions

1. **Issue**: Draggable words not appearing
   **Solution**: Ensure words are properly marked with asterisks (`*word*`)

2. **Issue**: Incorrect order of draggable words
   **Solution**: The order of draggable words is determined by their order in the text

3. **Issue**: Case sensitivity issues
   **Solution**: Set `behaviour.caseSensitive` to `false` if case should be ignored

4. **Issue**: Feedback not appearing
   **Solution**: Ensure `overallFeedback` array has correct ranges and feedback text

5. **Issue**: Inconsistent spacing
   **Solution**: Be careful with spaces inside asterisks, as they become part of the draggable text

## 10. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Drag Text Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.DragText",
    "preloadedDependencies": [
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.DragText", "majorVersion": 1, "minorVersion": 8}
    ]
  },
  "library": "H5P.DragText 1.8",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Drag Text Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.DragText",
      "preloadedDependencies": [
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.DragText", "majorVersion": 1, "minorVersion": 8}
      ]
    },
    "taskDescription": "Fill in the missing words",
    "textField": "H5P makes it easy to create *interactive* content by providing a range of *content* types for various *needs*.",
    "behaviour": {
      "enableRetry": true,
      "enableSolutionsButton": true,
      "instantFeedback": false,
      "enableCheckButton": true
    }
  }
}
```

## 11. Variants and Special Configurations

### 11.1 Instant Feedback

For providing feedback immediately when words are dropped:

```json
"behaviour": {
  "instantFeedback": true,
  // other properties...
}
```

### 11.2 Case Insensitive

To make the exercise ignore case when checking answers:

```json
"behaviour": {
  "caseSensitive": false,
  // other properties...
}
```

### 11.3 Custom Draggable Width

To set a custom width for draggable elements:

```json
"behaviour": {
  "customDragAndDropWidth": true,
  "dragAndDropWidth": 30,
  // other properties...
}
```

### 11.4 With Media

Adding an image to the exercise:

```json
"media": {
  "type": {
    "library": "H5P.Image 1.1",
    "params": {
      "file": {
        "path": "images/image.jpg",
        "mime": "image/jpeg",
        "copyright": {"license": "U"},
        "width": 500,
        "height": 300
      },
      "alt": "Descriptive text for the image"
    }
  },
  "disableImageZooming": false
}
```

## 12. Advanced Text Formatting

### 12.1 HTML Formatting

The `textField` can include HTML formatting:

```json
"textField": "<p>This is a <strong>formatted</strong> text with *draggable* words.</p>"
```

### 12.2 Multiple Paragraphs

Multiple paragraphs can be included:

```json
"textField": "<p>This is the first paragraph with *draggable* words.</p><p>This is the second paragraph with more *draggable* words.</p>"
```

### 12.3 Special Characters

Special characters can be included in draggable words:

```json
"textField": "Use special characters like *@#$%* or *ñáéíóú* in draggable words."
```

## 13. Summary of Critical Requirements

For a functioning H5P DragText exercise, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Proper marking of draggable words**: Words enclosed in asterisks
4. **Text field**: Must contain at least one draggable word
5. **Behavior settings**: Must have appropriate settings for the desired functionality

By following this guide precisely, you can create reliable H5P DragText exercises that function correctly across all devices and platforms. 