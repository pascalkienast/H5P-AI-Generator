# H5P Blanks (Fill-in-the-Blanks): Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Blanks (Fill-in-the-Blanks) content via the REST API. Following these exact patterns is essential for creating functional fill-in-the-blanks exercises.

## 1. Top-Level Structure Requirements

A working H5P Blanks **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.Blanks 1.14",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual fill-in-the-blanks content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.Blanks 1.14`)
3. **Nested Params Structure**: Exercise content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Fill-in-the-Blanks Example",
  "license": "U",
  "defaultLanguage": "en",
  "extraTitle": "Fill-in-the-Blanks Example", 
  "mainLibrary": "H5P.Blanks",
  "preloadedDependencies": [
    {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.TextUtilities", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for Blanks functionality:

- **H5P.Blanks**: Main content type
- **H5P.Question**: Base question framework
- **H5P.JoubelUI**: For UI elements
- **FontAwesome**: For icons
- **H5P.Image**: For images in content
- **H5P.Transition**: For animations and transitions
- **H5P.FontIcons**: For additional icons
- **H5P.TextUtilities**: For text processing

## 3. Exercise Structure

The main structure for a Blanks exercise is defined in the `params.params` object:

```json
"params": {
  "text": "<p>Instructions for the fill-in-the-blanks exercise</p>",
  "questions": [
    "<p>Paragraph 1 with blanks marked like *this*.</p>",
    "<p>Paragraph 2 with *another* blank.</p>"
  ],
  "overallFeedback": [
    {"from": 0, "to": 100, "feedback": "You got @score of @total blanks correct."}
  ],
  "showSolutions": "Show solutions",
  "tryAgain": "Try again",
  "checkAnswer": "Check",
  "submitAnswer": "Submit",
  "notFilledOut": "Please fill in all blanks",
  "answerIsCorrect": "':ans' is correct",
  "answerIsWrong": "':ans' is wrong",
  "answeredCorrectly": "Answered correctly",
  "answeredIncorrectly": "Answered incorrectly",
  "solutionLabel": "Correct answer:",
  "inputLabel": "Blank input @num of @total",
  "inputHasTipLabel": "Tip available",
  "tipLabel": "Tip",
  "scoreBarLabel": "You got :num out of :total points",
  "behaviour": {
    "enableRetry": true,
    "enableSolutionsButton": true,
    "enableCheckButton": true,
    "caseSensitive": false,
    "showSolutionsRequiresInput": true,
    "separateLines": false,
    "autoCheck": false,
    "confirmCheckDialog": false,
    "confirmRetryDialog": false,
    "acceptSpellingErrors": false
  },
  "a11yCheck": "Check the answers. The responses will be marked as correct, incorrect, or unanswered.",
  "a11yShowSolution": "Show the solution. The task will be marked with its correct solution.",
  "a11yRetry": "Retry the task. Reset all responses and start the task over again.",
  "a11yCheckingModeHeader": "Checking mode",
  "media": {
    // Optional media parameters
  },
  "confirmCheck": {
    "header": "Finish?",
    "body": "Are you sure you want to finish?",
    "cancelLabel": "Cancel",
    "confirmLabel": "Finish"
  },
  "confirmRetry": {
    "header": "Retry?",
    "body": "Are you sure you want to retry?",
    "cancelLabel": "Cancel",
    "confirmLabel": "Confirm"
  }
}
```

### Key Components:

1. **Text**: Instructions for the fill-in-the-blanks exercise
2. **Questions Array**: Array of paragraphs with blanks marked with asterisks (*blank*)
3. **Behavior Settings**: Controls how the exercise behaves
4. **UI Text**: Customizable labels for the user interface
5. **Media**: Optional media to display with the exercise
6. **Overall Feedback**: Feedback based on score ranges
7. **Confirmation Dialog Settings**: For check and retry confirmations
8. **Accessibility (a11y) Settings**: Labels for screen readers and accessibility tools

## 4. Marking Blanks in Text

Blanks are marked directly in the question paragraphs using asterisks:

```json
"questions": [
  "<p>The capital of France is *Paris*.</p>",
  "<p>The capital of Italy is *Rome*.</p>"
]
```

The `text` field does NOT contain the blanks - it contains instructions for the exercise:

```json
"text": "<p>Fill in the capitals of European countries in the paragraphs below.</p>"
```

You can also provide tip text within the blank:

```json
"questions": [
  "<p>The capital of France is *Paris:The city of lights*.</p>"
]
```

## 5. Questions Array

The `questions` array contains paragraphs with blanks marked with asterisks:

```json
"questions": [
  "<p>First paragraph with *blank1* to fill in.</p>",
  "<p>Second paragraph with *blank2* to fill in.</p>"
]
```

Each entry is a complete paragraph with blanks marked inline. The system automatically extracts the blanks based on the asterisk notation.

## 6. Behavior Settings

The behavior settings control how the exercise functions:

```json
"behaviour": {
  "enableRetry": true,              // Allow retrying the exercise
  "enableSolutionsButton": true,    // Show solutions button
  "enableCheckButton": true,        // Show check button
  "caseSensitive": false,           // Make answers case-sensitive
  "showSolutionsRequiresInput": true, // Require input before showing solutions
  "separateLines": false,           // Put each blank on a separate line
  "autoCheck": false,               // Automatically check answers when filled
  "confirmCheckDialog": false,      // Show confirmation dialog when checking
  "confirmRetryDialog": false,      // Show confirmation dialog when retrying
  "acceptSpellingErrors": false     // Accept minor spelling errors
}
```

## 7. Media Settings

Optional media element to display with the exercise:

```json
"media": {
  "type": {
    "params": {
      "contentName": "Image",
      "file": {
        "path": "images/image.jpg",
        "mime": "image/jpeg",
        "width": 800,
        "height": 600,
        "copyright": {"license": "U"}
      },
      "alt": "Alternative text",
      "title": "Image title",
      "decorative": false,
      "expandImage": "Expand Image",
      "minimizeImage": "Minimize Image"
    },
    "library": "H5P.Image 1.1",
    "subContentId": "a3ed0e6c-d9b0-4330-b4fa-9ed3c328d1e5",
    "metadata": {
      "title": "Image title",
      "authors": [{"name": "Author Name", "role": "Author"}],
      "source": "https://example.com/source",
      "license": "U",
      "licenseVersion": "4.0",
      "contentType": "Image",
      "changes": []
    }
  },
  "disableImageZooming": true
}
```

## 8. Overall Feedback Settings

Define feedback based on score ranges:

```json
"overallFeedback": [
  {"from": 0, "to": 100, "feedback": "You got @score of @total blanks correct."}
]
```

You can define multiple ranges:

```json
"overallFeedback": [
  {"from": 0, "to": 20, "feedback": "You need more practice!"},
  {"from": 21, "to": 80, "feedback": "Good effort!"},
  {"from": 81, "to": 100, "feedback": "Excellent!"}
]
```

## 9. Accessibility Settings

Provide text for screen readers and accessibility tools:

```json
"a11yCheck": "Check the answers. The responses will be marked as correct, incorrect, or unanswered.",
"a11yShowSolution": "Show the solution. The task will be marked with its correct solution.",
"a11yRetry": "Retry the task. Reset all responses and start the task over again.",
"a11yCheckingModeHeader": "Checking mode"
```

## 10. Common Issues and Solutions

1. **Issue**: Blanks not being recognized
   **Solution**: Ensure blanks are properly marked with asterisks `*` in the `questions` array paragraphs

2. **Issue**: Text appearing without blanks
   **Solution**: Make sure to put blanks in the `questions` array paragraphs, not in the `text` field

3. **Issue**: Case sensitivity causing problems
   **Solution**: Set `behaviour.caseSensitive` to false to ignore case differences

4. **Issue**: Tips not appearing
   **Solution**: Make sure tips are properly formatted within the blank as `*answer:tip*`

5. **Issue**: UI buttons not appearing
   **Solution**: Check that `behaviour.enableRetry` and `behaviour.enableSolutionsButton` are set correctly

6. **Issue**: Images not displaying
   **Solution**: Verify the `media` object has the correct structure and file path

## 11. Complete Example Structure

Below is a working example based on the actual implementation:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Fill in the Blanks",
    "license": "U",
    "defaultLanguage": "en",
    "extraTitle": "Fill in the Blanks",
    "mainLibrary": "H5P.Blanks",
    "preloadedDependencies": [
      {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.TextUtilities", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14}
    ]
  },
  "library": "H5P.Blanks 1.14",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Fill in the Blanks",
      "license": "U",
      "defaultLanguage": "en",
      "extraTitle": "Fill in the Blanks",
      "mainLibrary": "H5P.Blanks",
      "preloadedDependencies": [
        {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.TextUtilities", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14}
      ]
    },
    "params": {
      "questions": [
        "<p>Bilberries <em>(Vaccinium myrtillus)</em>, also known as *blue*berries are edible, nearly black berries found in nutrient-poor soils.</p>",
        "<p>*Cloud*berries <em>(Rubus chamaemorus)</em> are edible orange berries similar to raspberries or blackberries found in alpine and arctic tundra.</p>",
        "<p>Redcurrant <em>(Ribes rubrum)</em> are red translucent berries with a diameter of 8–10 mm, and are closely related to its black colored relative *black*currant.</p>"
      ],
      "text": "<p>Insert the missing words in this text about berries found in Norwegian forests and mountainous regions.</p>",
      "behaviour": {
        "enableRetry": true,
        "enableSolutionsButton": true,
        "enableCheckButton": true,
        "caseSensitive": false,
        "showSolutionsRequiresInput": true,
        "separateLines": false,
        "autoCheck": true,
        "confirmCheckDialog": false,
        "confirmRetryDialog": false,
        "acceptSpellingErrors": false
      },
      "showSolutions": "Show solutions",
      "tryAgain": "Try again",
      "checkAnswer": "Check",
      "notFilledOut": "Please fill in all blanks",
      "answerIsCorrect": "':ans' is correct",
      "answerIsWrong": "':ans' is wrong",
      "answeredCorrectly": "Answered correctly",
      "answeredIncorrectly": "Answered incorrectly",
      "solutionLabel": "Correct answer:",
      "inputLabel": "Blank input @num of @total",
      "inputHasTipLabel": "Tip available",
      "tipLabel": "Tip",
      "submitAnswer": "Submit",
      "scoreBarLabel": "You got :num out of :total points",
      "a11yCheck": "Check the answers. The responses will be marked as correct, incorrect, or unanswered.",
      "a11yShowSolution": "Show the solution. The task will be marked with its correct solution.",
      "a11yRetry": "Retry the task. Reset all responses and start the task over again.",
      "a11yCheckingModeHeader": "Checking mode",
      "overallFeedback": [
        {"from": 0, "to": 100, "feedback": "You got @score of @total blanks correct."}
      ],
      "media": {
        "type": {
          "params": {
            "contentName": "Image",
            "file": {
              "path": "images/file-wPECdwoc.jpg",
              "mime": "image/jpeg",
              "width": 1588,
              "height": 458,
              "copyright": {"license": "U"}
            },
            "alt": "Image of blueberries",
            "title": "Image of blueberries",
            "decorative": false,
            "expandImage": "Expand Image",
            "minimizeImage": "Minimize Image"
          },
          "library": "H5P.Image 1.1",
          "subContentId": "a3ed0e6c-d9b0-4330-b4fa-9ed3c328d1e5",
          "metadata": {
            "title": "A bucketful of freshly picked bilberries.",
            "authors": [{"name": "Mikko Muinonen", "role": "Author"}],
            "source": "https://www.flickr.com/photos/mikeancient/5685771257/",
            "license": "CC BY-ND",
            "licenseVersion": "4.0",
            "contentType": "Image",
            "changes": []
          }
        },
        "disableImageZooming": true
      },
      "confirmCheck": {
        "header": "Finish ?",
        "body": "Are you sure you wish to finish ?",
        "cancelLabel": "Cancel",
        "confirmLabel": "Finish"
      },
      "confirmRetry": {
        "header": "Retry ?",
        "body": "Are you sure you wish to retry ?",
        "cancelLabel": "Cancel",
        "confirmLabel": "Confirm"
      }
    }
  }
}
```

## 12. Variants and Special Configurations

### 12.1 Case-Sensitive Configuration

To create exercises where case matters:

```json
"behaviour": {
  "caseSensitive": true
}
```

### 12.2 Each Blank on Separate Line

For longer exercises where each blank should be on its own line:

```json
"behaviour": {
  "separateLines": true
}
```

### 12.3 Auto-Check Configuration

To automatically check answers when all blanks are filled:

```json
"behaviour": {
  "autoCheck": true
}
```

### 12.4 With Built-In Tips

Adding tips directly in the text:

```json
"questions": [
  "<p>The capital of France is *Paris:The city of lights*.</p>"
]
```

### 12.5 Disabling Image Zooming

To prevent users from zooming in on images:

```json
"media": {
  "disableImageZooming": true
}
```

## 13. Summary of Critical Requirements

For a functioning H5P Blanks exercise, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Questions array with proper blank marking**: Using asterisks to mark blanks within HTML paragraphs
4. **Text field for instructions**: Contains overall instructions, not the blanks
5. **Behavior settings**: Properly configured for the intended exercise type
6. **Accessibility parameters**: Ensure the content is accessible to all users

By following this guide precisely, you can create reliable H5P Fill-in-the-Blanks exercises that function correctly across all devices and platforms. 