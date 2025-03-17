# H5P Summary: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Summary content via the REST API. Following these exact patterns is essential for creating functional summary exercises.

## 1. Top-Level Structure Requirements

A working H5P Summary **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.Summary 1.10",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "intro": "Select the correct statements.",
    "summaries": [
      // Array of statement groups
    ],
    "overallFeedback": [
      // Feedback based on score ranges
    ],
    "behaviour": {
      // Behavior settings
    },
    "l10n": {
      // UI text labels
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.Summary 1.10`)
3. **Statement Array Structure**: Each item in the `summaries` array must contain correct and incorrect statements

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Summary Example",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.Summary",
  "preloadedDependencies": [
    {"machineName": "H5P.Summary", "majorVersion": 1, "minorVersion": 10},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for Summary functionality:

- **H5P.Summary**: Main content type
- **H5P.JoubelUI**: For UI elements
- **FontAwesome**: For icons

## 3. Exercise Structure

The main structure for a Summary exercise is defined in the params object:

```json
"params": {
  "intro": "Select the correct statements.",
  "summaries": [
    {
      "subContentId": "unique-id-1",
      "tip": "Optional tip for this statement group",
      "summary": [
        "This is a correct statement.",
        "This is an incorrect statement.",
        "This is another incorrect statement.",
        "This is another correct statement."
      ],
      "correct": "0,3" // Indices of correct statements (zero-based)
    },
    {
      "subContentId": "unique-id-2",
      "summary": [
        "This is a correct statement in the second group.",
        "This is an incorrect statement in the second group.",
        "This is another correct statement in the second group."
      ],
      "correct": "0,2"
    }
  ],
  "overallFeedback": [
    {"from": 0, "to": 40, "feedback": "You need more practice!"},
    {"from": 41, "to": 80, "feedback": "Good effort!"},
    {"from": 81, "to": 100, "feedback": "Excellent!"}
  ],
  "behaviour": {
    "enableRetry": true,
    "enableSolutionsButton": true,
    "enableConfirmCheck": false,
    "confirmRetryTitle": "Retry?",
    "confirmRetryBody": "Are you sure you want to retry?"
  },
  "l10n": {
    "intro": "Select the correct statements",
    "summary": "Summary",
    "summaryMultiple": "Summary",
    "nextTaskButton": "Next task",
    "continueTaskButton": "Continue",
    "submitTaskButton": "Submit",
    "prevTaskButton": "Previous task",
    "correctAnswerMessage": "That was correct!",
    "incorrectAnswerMessage": "That was incorrect",
    "remainingAttempts": "Remaining attempts: @number",
    "noMoreAttempts": "No more attempts",
    "submitButtonLabel": "Submit",
    "showSolutionButtonLabel": "Show solution",
    "retryButtonLabel": "Retry",
    "solutionLabel": "Solution",
    "statement": "Statement"
  }
}
```

### Key Components:

1. **Intro**: Introduction text for the exercise
2. **Summaries**: Array of statement groups
3. **Behavior Settings**: Controls how the exercise behaves
4. **UI Text (l10n)**: Customizable labels for the user interface
5. **Overall Feedback**: Feedback based on score ranges

## 4. Statement Groups

Each statement group in the `summaries` array follows this structure:

```json
{
  "subContentId": "unique-id-1",  // Unique identifier for this group
  "tip": "Optional tip for this group", // Optional tip
  "summary": [
    "This is a correct statement.",
    "This is an incorrect statement.",
    "This is another incorrect statement.",
    "This is another correct statement."
  ],
  "correct": "0,3" // Indices of correct statements (zero-based)
}
```

### Critical Requirements for Statement Groups:

1. **Unique subContentId**: Each group must have a unique identifier
2. **Summary Array**: Contains all statements (both correct and incorrect)
3. **Correct String**: Comma-separated list of indices of correct statements (zero-based)
4. **Optional Tip**: Can provide a hint for the user

## 5. Behavior Settings

The behavior settings control how the exercise functions:

```json
"behaviour": {
  "enableRetry": true,          // Allow retrying the exercise
  "enableSolutionsButton": true, // Show solutions button
  "enableConfirmCheck": false,   // Show confirmation dialog before checking
  "confirmRetryTitle": "Retry?", // Title for retry confirmation dialog
  "confirmRetryBody": "Are you sure you want to retry?" // Message for retry confirmation dialog
}
```

## 6. Localization (l10n) Settings

The l10n settings provide customizable text labels for the UI:

```json
"l10n": {
  "intro": "Select the correct statements",
  "summary": "Summary",
  "summaryMultiple": "Summary",
  "nextTaskButton": "Next task",
  "continueTaskButton": "Continue",
  "submitTaskButton": "Submit",
  "prevTaskButton": "Previous task",
  "correctAnswerMessage": "That was correct!",
  "incorrectAnswerMessage": "That was incorrect",
  "remainingAttempts": "Remaining attempts: @number",
  "noMoreAttempts": "No more attempts",
  "submitButtonLabel": "Submit",
  "showSolutionButtonLabel": "Show solution",
  "retryButtonLabel": "Retry",
  "solutionLabel": "Solution",
  "statement": "Statement"
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

1. **Issue**: Statements not being evaluated correctly
   **Solution**: Ensure the `correct` parameter contains zero-based indices of correct statements

2. **Issue**: Statement groups not appearing
   **Solution**: Make sure each group has a unique `subContentId`

3. **Issue**: Navigation buttons not working correctly
   **Solution**: Verify that all l10n strings for buttons are properly defined

4. **Issue**: Feedback not appearing
   **Solution**: Ensure `overallFeedback` array has correct ranges and feedback text

5. **Issue**: Multiple statement groups not showing up
   **Solution**: Check that each group is properly formatted with all required fields

## 9. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Summary Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.Summary",
    "preloadedDependencies": [
      {"machineName": "H5P.Summary", "majorVersion": 1, "minorVersion": 10},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
    ]
  },
  "library": "H5P.Summary 1.10",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Summary Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.Summary",
      "preloadedDependencies": [
        {"machineName": "H5P.Summary", "majorVersion": 1, "minorVersion": 10},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
      ]
    },
    "intro": "Select the correct statements.",
    "summaries": [
      {
        "subContentId": "unique-id-1",
        "summary": [
          "This is a correct statement.",
          "This is an incorrect statement.",
          "This is another correct statement."
        ],
        "correct": "0,2"
      }
    ],
    "behaviour": {
      "enableRetry": true,
      "enableSolutionsButton": true
    }
  }
}
```

## 10. Variants and Special Configurations

### 10.1 Single Statement Group

For a summary with only one statement group:

```json
"summaries": [
  {
    "subContentId": "unique-id-1",
    "summary": [
      "This is a correct statement.",
      "This is an incorrect statement.",
      "This is another incorrect statement.",
      "This is another correct statement."
    ],
    "correct": "0,3"
  }
]
```

### 10.2 Multiple Statement Groups

For a summary with multiple statement groups:

```json
"summaries": [
  {
    "subContentId": "unique-id-1",
    "summary": [
      "This is a correct statement in group 1.",
      "This is an incorrect statement in group 1.",
      "This is another correct statement in group 1."
    ],
    "correct": "0,2"
  },
  {
    "subContentId": "unique-id-2",
    "summary": [
      "This is a correct statement in group 2.",
      "This is an incorrect statement in group 2.",
      "This is another incorrect statement in group 2.",
      "This is another correct statement in group 2."
    ],
    "correct": "0,3"
  },
  {
    "subContentId": "unique-id-3",
    "summary": [
      "This is a correct statement in group 3.",
      "This is an incorrect statement in group 3."
    ],
    "correct": "0"
  }
]
```

### 10.3 With Tips

Adding tips to statement groups:

```json
"summaries": [
  {
    "subContentId": "unique-id-1",
    "tip": "Tip for statement group 1",
    "summary": [
      "This is a correct statement.",
      "This is an incorrect statement.",
      "This is another correct statement."
    ],
    "correct": "0,2"
  },
  {
    "subContentId": "unique-id-2",
    "tip": "Tip for statement group 2",
    "summary": [
      "This is a correct statement in group 2.",
      "This is an incorrect statement in group 2.",
      "This is another correct statement in group 2."
    ],
    "correct": "0,2"
  }
]
```

### 10.4 Confirmation Dialog

Enabling confirmation dialogs for checking and retrying:

```json
"behaviour": {
  "enableRetry": true,
  "enableSolutionsButton": true,
  "enableConfirmCheck": true,
  "confirmRetryTitle": "Retry?",
  "confirmRetryBody": "Are you sure you want to retry?"
}
```

## 11. Advanced Features

### 11.1 HTML Formatting in Statements

The statements can include HTML formatting:

```json
"summary": [
  "This is a <strong>correct</strong> statement.",
  "This is an <em>incorrect</em> statement.",
  "This statement contains a <a href='https://h5p.org'>link</a>.",
  "This is another <strong>correct</strong> statement."
]
```

### 11.2 Multiple Correct Statements

A statement group can have any number of correct statements:

```json
"summary": [
  "This is a correct statement.",
  "This is another correct statement.",
  "This is yet another correct statement.",
  "This is an incorrect statement.",
  "This is another incorrect statement."
],
"correct": "0,1,2"
```

## 12. Summary of Critical Requirements

For a functioning H5P Summary exercise, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Unique subContentId for each group**: Each statement group must have a unique identifier
4. **Correct statement indices**: The `correct` parameter must contain valid indices of correct statements
5. **At least one statement group**: The `summaries` array must contain at least one group
6. **At least one correct statement per group**: Each group must have at least one correct statement

By following this guide precisely, you can create reliable H5P Summary exercises that function correctly across all devices and platforms. 