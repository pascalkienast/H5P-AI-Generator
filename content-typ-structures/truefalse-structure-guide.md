# H5P TrueFalse: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P TrueFalse content via the REST API. Following these exact patterns is essential for creating functional true/false questions.

## 1. Top-Level Structure Requirements

A working H5P TrueFalse **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.TrueFalse 1.8",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual true/false content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.TrueFalse 1.8`)
3. **Nested Params Structure**: Question content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "True or False Question",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.TrueFalse",
  "preloadedDependencies": [
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.TrueFalse", "majorVersion": 1, "minorVersion": 8}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for TrueFalse functionality:

- **H5P.TrueFalse**: Main content type
- **H5P.Question**: Base question framework
- **H5P.JoubelUI**: For UI elements
- **H5P.FontIcons**: For icons
- **FontAwesome**: For additional icons

## 3. Question Structure

The main structure for a TrueFalse question is defined in the `params.params` object:

```json
"params": {
  "question": "<p>Paris is the capital of France.</p>",
  "correct": "true",
  "media": {
    "params": {
      // Optional media parameters
    },
    "library": "H5P.Image 1.1"
  },
  "behaviour": {
    "enableRetry": true,
    "enableSolutionsButton": true,
    "enableCheckButton": true,
    "confirmCheckDialog": false,
    "confirmRetryDialog": false,
    "autoCheck": false,
    "passPercentage": 100
  },
  "l10n": {
    "trueText": "True",
    "falseText": "False",
    "correctText": "Correct!",
    "wrongText": "Wrong!",
    "scoreBarLabel": "You got :num out of :total points",
    "tipAvailable": "Tip available",
    "feedbackAvailable": "Feedback available",
    "readFeedback": "Read feedback",
    "showSolutionButton": "Show solution",
    "tryAgain": "Retry",
    "checkAnswer": "Check",
    "submitAnswer": "Submit",
    "feedback": "Feedback",
    "correctAnswerMessage": "Correct answer"
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
```

### Key Components:

1. **Question Text**: The statement that is either true or false
2. **Correct Answer**: Either "true" or "false" (as a string)
3. **Media**: Optional media to display with the question
4. **Behavior Settings**: Controls how the question behaves
5. **Localization (l10n)**: Text strings for UI elements
6. **Confirmation Dialogs**: Settings for check and retry confirmations

## 4. Behavior Settings

The behavior settings control how the question functions:

```json
"behaviour": {
  "enableRetry": true,          // Allow retrying the question
  "enableSolutionsButton": true, // Show solutions button
  "enableCheckButton": true,     // Show check button
  "confirmCheckDialog": false,   // Show confirmation dialog when checking
  "confirmRetryDialog": false,   // Show confirmation dialog when retrying
  "autoCheck": false,            // Automatically check answers
  "passPercentage": 100          // Percentage needed to pass
}
```

## 5. Localization (l10n) Settings

Customize the text labels:

```json
"l10n": {
  "trueText": "True",              // Label for true button
  "falseText": "False",            // Label for false button
  "correctText": "Correct!",       // Text shown when answer is correct
  "wrongText": "Wrong!",           // Text shown when answer is wrong
  "scoreBarLabel": "You got :num out of :total points",
  "tipAvailable": "Tip available",
  "feedbackAvailable": "Feedback available",
  "readFeedback": "Read feedback",
  "showSolutionButton": "Show solution",
  "tryAgain": "Retry",
  "checkAnswer": "Check",
  "submitAnswer": "Submit",
  "feedback": "Feedback",
  "correctAnswerMessage": "Correct answer"
}
```

## 6. Media Settings

Optional media element to display with the question:

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

## 7. Confirmation Dialog Settings

Optional dialogs for confirming check and retry actions:

```json
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
```

## 8. Common Issues and Solutions

1. **Issue**: Answer not being evaluated correctly
   **Solution**: Ensure the `correct` property is exactly "true" or "false" (as a string)

2. **Issue**: True/False buttons not displaying correctly
   **Solution**: Verify the `l10n` object has proper `trueText` and `falseText` values

3. **Issue**: Feedback not appearing
   **Solution**: Check that `l10n.correctText` and `l10n.wrongText` are set

4. **Issue**: UI buttons not appearing
   **Solution**: Make sure `behaviour.enableRetry` and `behaviour.enableSolutionsButton` are set correctly

5. **Issue**: Confirmation dialogs appearing unexpectedly
   **Solution**: Set `behaviour.confirmCheckDialog` and `behaviour.confirmRetryDialog` to false

## 9. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "True or False Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.TrueFalse",
    "preloadedDependencies": [
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.TrueFalse", "majorVersion": 1, "minorVersion": 8}
    ]
  },
  "library": "H5P.TrueFalse 1.8",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "True or False Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.TrueFalse",
      "preloadedDependencies": [
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.TrueFalse", "majorVersion": 1, "minorVersion": 8}
      ]
    },
    "params": {
      "question": "<p>Paris is the capital of France.</p>",
      "correct": "true",
      "behaviour": {
        "enableRetry": true,
        "enableSolutionsButton": true,
        "enableCheckButton": true,
        "confirmCheckDialog": false,
        "confirmRetryDialog": false,
        "autoCheck": false,
        "passPercentage": 100
      },
      "l10n": {
        "trueText": "True",
        "falseText": "False",
        "correctText": "Correct!",
        "wrongText": "Wrong!",
        "showSolutionButton": "Show solution",
        "tryAgain": "Retry",
        "checkAnswer": "Check"
      }
    }
  }
}
```

## 10. Variants and Special Configurations

### 10.1 Auto-Check Configuration

To automatically check answers when selected:

```json
"behaviour": {
  "autoCheck": true,
  "enableCheckButton": false
}
```

### 10.2 With Media

Adding an image to the question:

```json
"media": {
  "params": {
    "file": {
      "path": "images/paris.jpg",
      "mime": "image/jpeg",
      "copyright": {"license": "U"},
      "width": 800,
      "height": 600
    },
    "alt": "Image of Paris"
  },
  "library": "H5P.Image 1.1"
}
```

### 10.3 With Custom Button Labels

Customizing the button labels:

```json
"l10n": {
  "trueText": "Yes",
  "falseText": "No",
  "correctText": "That's right!",
  "wrongText": "Sorry, that's incorrect."
}
```

## 11. Summary of Critical Requirements

For a functioning H5P TrueFalse question, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Question text**: Properly formatted HTML statement
4. **Correct answer**: Must be exactly "true" or "false" (as a string)
5. **Localization settings**: At minimum, the `trueText` and `falseText` labels

By following this guide precisely, you can create reliable H5P TrueFalse questions that function correctly across all devices and platforms. 