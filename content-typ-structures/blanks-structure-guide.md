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
  "mainLibrary": "H5P.Blanks",
  "preloadedDependencies": [
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
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

## 3. Exercise Structure

The main structure for a Blanks exercise is defined in the `params.params` object:

```json
"params": {
  "text": "H5P stands for *HTML5 Package/HTML5 Packages*. It is used to create *interactive* content.",
  "questions": [
    "HTML5 Package|HTML5 Packages",
    "interactive|Interactive"
  ],
  "overallFeedback": [
    {"from": 0, "to": 20, "feedback": "You need more practice!"},
    {"from": 21, "to": 80, "feedback": "Good effort!"},
    {"from": 81, "to": 100, "feedback": "Excellent!"}
  ],
  "showSolutions": "Show solution",
  "tryAgain": "Retry",
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
  "scoringOption": "correct",
  "media": {
    "params": {
      // Optional media parameters
    },
    "library": "H5P.Image 1.1"
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

1. **Text**: The exercise text with blanks marked using asterisks (*word*)
2. **Questions Array**: List of acceptable answers for each blank, separated by pipe symbols (|)
3. **Behavior Settings**: Controls how the exercise behaves
4. **UI Text**: Customizable labels for the user interface
5. **Media**: Optional media to display with the exercise
6. **Overall Feedback**: Feedback based on score ranges
7. **Confirmation Dialog Settings**: For check and retry confirmations

## 4. Marking Blanks in Text

Blanks are marked using asterisks in the `text` field:

```json
"text": "The capital of France is *Paris*."
```

For blanks with multiple acceptable answers, you can list them in the `questions` array:

```json
"text": "H5P stands for *HTML5 Package*.",
"questions": [
  "HTML5 Package|HTML5 Packages|HTML5 package"
]
```

You can also provide tip text within the blank:

```json
"text": "The capital of France is *Paris:The city of lights*."
```

## 5. Questions Array

The `questions` array contains acceptable answers for each blank:

```json
"questions": [
  "answer1|alternative1|alternative2",
  "answer2|alternative1|alternative2"
]
```

Each entry corresponds to a blank in the `text` field, in order of appearance.

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
  "params": {
    "file": {
      "path": "images/image.jpg",
      "mime": "image/jpeg",
      "copyright": {"license": "U"},
      "width": 800,
      "height": 600
    },
    "alt": "Alternative text"
  },
  "library": "H5P.Image 1.1"
}
```

## 8. Overall Feedback Settings

Define feedback based on score ranges:

```json
"overallFeedback": [
  {"from": 0, "to": 20, "feedback": "You need more practice!"},
  {"from": 21, "to": 80, "feedback": "Good effort!"},
  {"from": 81, "to": 100, "feedback": "Excellent!"}
]
```

## 9. Scoring Options

Control how scoring works:

```json
"scoringOption": "correct" // Options: "correct", "positives", "keywords"
```

- `correct`: Score is based on correct answers only
- `positives`: Score is based on ratio of correct answers to total answers
- `keywords`: Score is based on keywords matched

## 10. Common Issues and Solutions

1. **Issue**: Blanks not being recognized
   **Solution**: Ensure blanks are properly marked with asterisks `*` in the `text` field

2. **Issue**: Alternative answers not being accepted
   **Solution**: Verify the `questions` array has the correct alternative answers with pipe separators

3. **Issue**: Case sensitivity causing problems
   **Solution**: Set `behaviour.caseSensitive` to false to ignore case differences

4. **Issue**: Tips not appearing
   **Solution**: Make sure tips are properly formatted within the blank as `*answer:tip*`

5. **Issue**: UI buttons not appearing
   **Solution**: Check that `behaviour.enableRetry` and `behaviour.enableSolutionsButton` are set correctly

## 11. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Fill-in-the-Blanks Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.Blanks",
    "preloadedDependencies": [
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14}
    ]
  },
  "library": "H5P.Blanks 1.14",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Fill-in-the-Blanks Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.Blanks",
      "preloadedDependencies": [
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14}
      ]
    },
    "params": {
      "text": "H5P stands for *HTML5 Package*. It is used to create *interactive* content.",
      "questions": [
        "HTML5 Package|HTML5 Packages",
        "interactive|Interactive"
      ],
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
  "autoCheck": true,
  "enableCheckButton": false
}
```

### 12.4 With Built-In Tips

Adding tips directly in the text:

```json
"text": "The capital of France is *Paris:The city of lights*. The capital of Italy is *Rome:The eternal city*."
```

## 13. Summary of Critical Requirements

For a functioning H5P Blanks exercise, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Text with proper blank marking**: Using asterisks to mark blanks
4. **Questions array**: Matching the number of blanks in the text
5. **Behavior settings**: Properly configured for the intended exercise type

By following this guide precisely, you can create reliable H5P Fill-in-the-Blanks exercises that function correctly across all devices and platforms. 