# H5P MultiChoice: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P MultiChoice content via the REST API. Following these exact patterns is essential for creating functional multiple-choice questions.

## 1. Top-Level Structure Requirements

A working H5P MultiChoice **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.MultiChoice 1.16",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual multiple choice content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Single Question Only**: H5P.MultiChoice is designed to contain exactly one question. For multiple questions, use a different content type like H5P.QuestionSet or H5P.CoursePresentation.
2. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
3. **Exact Library Definition**: Must specify the library name and version (`H5P.MultiChoice 1.16`)
4. **Nested Params Structure**: Question content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Multiple Choice Question",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.MultiChoice",
  "preloadedDependencies": [
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for MultiChoice functionality:

- **H5P.MultiChoice**: Main content type
- **H5P.Question**: Base question framework
- **H5P.JoubelUI**: For UI elements
- **H5P.Transition**: For transitions
- **H5P.FontIcons**: For icons
- **FontAwesome**: For additional icons

## 3. Question Structure

The main structure for a MultiChoice question is defined in the `params.params` object:

```json
"params": {
  "question": "<p>What is the capital of France?</p>",
  "answers": [
    {
      "text": "<div>Paris</div>",
      "correct": true,
      "tipsAndFeedback": {
        "tip": "Hint: City of Lights",
        "chosenFeedback": "Correct! Paris is the capital of France.",
        "notChosenFeedback": ""
      }
    },
    {
      "text": "<div>London</div>",
      "correct": false,
      "tipsAndFeedback": {
        "tip": "",
        "chosenFeedback": "Incorrect. London is the capital of the United Kingdom.",
        "notChosenFeedback": ""
      }
    },
    {
      "text": "<div>Berlin</div>",
      "correct": false,
      "tipsAndFeedback": {
        "tip": "",
        "chosenFeedback": "Incorrect. Berlin is the capital of Germany.",
        "notChosenFeedback": ""
      }
    }
  ],
  "overallFeedback": [
    {"from": 0, "to": 0, "feedback": "Incorrect. The capital of France is Paris."},
    {"from": 1, "to": 100, "feedback": "Correct!"}
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
    "checkAnswerButton": "Check",
    "submitAnswerButton": "Submit",
    "showSolutionButton": "Show solution",
    "tryAgainButton": "Retry",
    "tipsLabel": "Show tip",
    "scoreBarLabel": "You got :num out of :total points",
    "tipAvailable": "Tip available",
    "feedbackAvailable": "Feedback available",
    "readFeedback": "Read feedback",
    "wrongAnswer": "Wrong answer",
    "correctAnswer": "Correct answer",
    "shouldCheck": "Should have been checked",
    "shouldNotCheck": "Should not have been checked",
    "noInput": "Please answer before viewing the solution"
  },
  "media": {
    "disableImageZooming": false
  }
}
```

### Key Components:

1. **Question Text**: The actual question shown to users
2. **Answers Array**: List of answer options
3. **Behavior Settings**: Controls how the question behaves
4. **UI Text**: Customizable labels for the user interface
5. **Media**: Optional media settings
6. **Overall Feedback**: Feedback based on score ranges

## 4. Answer Options Structure

Each answer option in the answers array follows this structure:

```json
{
  "text": "<div>Answer text</div>",
  "correct": true,
  "tipsAndFeedback": {
    "tip": "Optional hint for this answer",
    "chosenFeedback": "Feedback when this answer is selected",
    "notChosenFeedback": "Feedback when this answer is not selected"
  }
}
```

### Critical Answer Requirements:

1. **Text**: The answer text (wrapped in HTML)
2. **Correct**: Boolean indicating if this is a correct answer
3. **Tips and Feedback**: Optional hints and feedback for the answer

## 5. Behavior Settings

The behavior settings control how the question functions:

```json
"behaviour": {
  "enableRetry": true,           // Allow retrying the question
  "enableSolutionsButton": true, // Show solutions button
  "enableCheckButton": true,     // Show check button
  "type": "auto",                // Scoring type ('auto' or 'deterministic')
  "singlePoint": false,          // Award a single point regardless of answers
  "randomAnswers": true,         // Randomize the order of answers
  "showSolutionsRequiresInput": true, // Require input before showing solutions
  "confirmCheckDialog": false,   // Show confirmation dialog when checking
  "confirmRetryDialog": false,   // Show confirmation dialog when retrying
  "autoCheck": false,            // Automatically check answers
  "passPercentage": 100,         // Percentage needed to pass
  "showScorePoints": true        // Show score points
}
```

## 6. UI Settings

Customize the user interface with these settings:

```json
"UI": {
  "checkAnswerButton": "Check",
  "submitAnswerButton": "Submit",
  "showSolutionButton": "Show solution",
  "tryAgainButton": "Retry",
  "tipsLabel": "Show tip",
  "scoreBarLabel": "You got :num out of :total points",
  "tipAvailable": "Tip available",
  "feedbackAvailable": "Feedback available",
  "readFeedback": "Read feedback",
  "wrongAnswer": "Wrong answer",
  "correctAnswer": "Correct answer",
  "shouldCheck": "Should have been checked",
  "shouldNotCheck": "Should not have been checked",
  "noInput": "Please answer before viewing the solution"
}
```

## 7. Overall Feedback

Define feedback based on score ranges:

```json
"overallFeedback": [
  {"from": 0, "to": 0, "feedback": "You got everything wrong."},
  {"from": 1, "to": 99, "feedback": "You got some correct answers."},
  {"from": 100, "to": 100, "feedback": "You got everything correct!"}
]
```

## 8. Media Settings

Optional media settings:

```json
"media": {
  "disableImageZooming": false,
  "startScreenOptions": {
    "title": "Title",
    "hideStartTitle": false
  },
  "type": {
    "library": "H5P.Image 1.1",
    "params": {
      "file": {
        "path": "images/image.jpg",
        "mime": "image/jpeg",
        "copyright": {"license": "U"},
        "width": 800,
        "height": 600
      },
      "alt": "Alternative text"
    }
  }
}
```

## 9. Common Issues and Solutions

1. **Issue**: Answers not being marked as correct or incorrect
   **Solution**: Ensure the `correct` property is correctly set for each answer

2. **Issue**: Tips and feedback not appearing
   **Solution**: Verify the `tipsAndFeedback` object structure for each answer

3. **Issue**: Score not calculating correctly
   **Solution**: Check the `behaviour.type` and `behaviour.singlePoint` settings

4. **Issue**: UI buttons not appearing
   **Solution**: Make sure `behaviour.enableRetry` and `behaviour.enableSolutionsButton` are set correctly

5. **Issue**: Random ordering not working
   **Solution**: Confirm `behaviour.randomAnswers` is set to true

## 10. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Multiple Choice Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.MultiChoice",
    "preloadedDependencies": [
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16}
    ]
  },
  "library": "H5P.MultiChoice 1.16",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Multiple Choice Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.MultiChoice",
      "preloadedDependencies": [
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16}
      ]
    },
    "params": {
      "question": "<p>What is the capital of France?</p>",
      "answers": [
        {
          "text": "<div>Paris</div>",
          "correct": true,
          "tipsAndFeedback": {
            "tip": "Hint: City of Lights",
            "chosenFeedback": "Correct!",
            "notChosenFeedback": ""
          }
        },
        {
          "text": "<div>London</div>",
          "correct": false,
          "tipsAndFeedback": {
            "tip": "",
            "chosenFeedback": "Incorrect.",
            "notChosenFeedback": ""
          }
        },
        {
          "text": "<div>Berlin</div>",
          "correct": false,
          "tipsAndFeedback": {
            "tip": "",
            "chosenFeedback": "Incorrect.",
            "notChosenFeedback": ""
          }
        }
      ],
      "overallFeedback": [
        {"from": 0, "to": 0, "feedback": "Incorrect."},
        {"from": 1, "to": 100, "feedback": "Correct!"}
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
        "checkAnswerButton": "Check",
        "submitAnswerButton": "Submit",
        "showSolutionButton": "Show solution",
        "tryAgainButton": "Retry"
      }
    }
  }
}
```

## 11. Variants and Special Configurations

### 11.1 Single Correct Answer (Radio Buttons)

When you want only one correct answer (radio button style):

```json
"behaviour": {
  "singleAnswer": true,
  "singlePoint": true
}
```

### 11.2 Multiple Correct Answers (Checkboxes)

When you want multiple correct answers (checkbox style):

```json
"behaviour": {
  "singleAnswer": false,
  "singlePoint": false
}
```

### 11.3 Auto-Check Configuration

To automatically check answers when selected:

```json
"behaviour": {
  "autoCheck": true,
  "enableCheckButton": false
}
```

## 12. Summary of Critical Requirements

For a functioning H5P MultiChoice, the most critical elements are:

1. **Single Question Structure**: H5P.MultiChoice can only contain one question. To create a series of multiple-choice questions, you must use a container content type like H5P.QuestionSet or H5P.CoursePresentation.
2. **Dual metadata structure**: Both top-level and nested in params
3. **Complete dependency declarations**: All required libraries declared in both metadata locations
4. **Question text**: Properly formatted HTML
5. **Answer options**: At least one answer with correct/incorrect marking
6. **Behavior settings**: Correct configuration based on question type (single or multiple answers)

By following this guide precisely, you can create reliable H5P MultiChoice questions that function correctly across all devices and platforms. 