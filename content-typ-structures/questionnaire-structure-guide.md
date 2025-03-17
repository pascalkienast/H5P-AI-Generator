# H5P Questionnaire: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Questionnaire content via the REST API. Following these exact patterns is essential for creating functional questionnaires.

## 1. Top-Level Structure Requirements

A working H5P Questionnaire **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.Questionnaire 1.3",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "introPage": {
      // Optional introduction page
    },
    "progressType": "dots",
    "elements": [
      // Array of question elements
    ],
    "uiElements": {
      // UI element labels
    },
    "l10n": {
      // UI text labels
    },
    "successScreenOptions": {
      // Success screen configuration
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.Questionnaire 1.3`)
3. **Elements Array**: Must contain at least one question element

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Questionnaire Example",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.Questionnaire",
  "preloadedDependencies": [
    {"machineName": "H5P.Questionnaire", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.SimpleMultiChoice", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.OpenEndedQuestion", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for Questionnaire functionality:

- **H5P.Questionnaire**: Main content type
- **H5P.SimpleMultiChoice**: For multiple choice questions
- **H5P.OpenEndedQuestion**: For open-ended questions
- **H5P.JoubelUI**: For UI elements
- **FontAwesome**: For icons

## 3. Questionnaire Structure

The main structure for a Questionnaire is defined in the params object:

```json
"params": {
  "introPage": {
    "showIntroPage": true,
    "title": "Questionnaire Introduction",
    "introduction": "This is an introduction to the questionnaire."
  },
  "progressType": "dots",
  "elements": [
    // Question elements go here
  ],
  "uiElements": {
    "questionnaireTitle": "Questionnaire",
    "requiredMessage": "This question requires an answer",
    "requiredText": "required",
    "timeoutMessage": "Unable to submit questionnaire right now. Please try again later."
  },
  "l10n": {
    "nextButton": "Next",
    "prevButton": "Previous",
    "closeButton": "Close",
    "submitButton": "Submit",
    "requiredMessage": "This question requires an answer",
    "requiredText": "required",
    "submitButtonCheckboxes": "Submit form",
    "submitButtonText": "Submit",
    "submitSuccessful": "Form submitted successfully.",
    "submitUnsuccessful": "Form could not be submitted.",
    "submitMessage": "Your answers have been submitted!",
    "submitConfirm": "Submit your answers? After submitting, you won't be able to change your answers."
  },
  "successScreenOptions": {
    "enableSuccessScreen": true,
    "successScreenImage": {},
    "successMessage": "Thank you for completing the questionnaire!",
    "successComment": "Your answers have been submitted."
  }
}
```

### Key Components:

1. **Intro Page**: Optional introduction page for the questionnaire
2. **Progress Type**: Type of progress indicator to show ("dots", "textual", or "none")
3. **Elements**: Array of question elements
4. **UI Elements**: Customizable labels for the user interface
5. **L10n**: Localization settings for UI text
6. **Success Screen Options**: Configuration for the success screen

## 4. Question Elements

The Questionnaire supports two main types of question elements:

### 4.1 Open-ended Questions

```json
{
  "library": "H5P.OpenEndedQuestion 1.0",
  "subContentId": "unique-id-1",
  "metadata": {
    "contentType": "Open Ended Question"
  },
  "params": {
    "question": "What do you think about this questionnaire?",
    "placeholderText": "Enter your answer here...",
    "messageLength": "long"
  },
  "requiredField": true
}
```

#### Open-ended Question Parameters:

- **question**: The question text
- **placeholderText**: Placeholder text for the input field
- **messageLength**: Size of the input field ("short", "medium", or "long")
- **requiredField**: Whether an answer is required

### 4.2 Multiple Choice Questions

```json
{
  "library": "H5P.SimpleMultiChoice 1.1",
  "subContentId": "unique-id-2",
  "metadata": {
    "contentType": "Simple Multi Choice"
  },
  "params": {
    "question": "Which of the following options do you prefer?",
    "inputType": "checkbox",
    "alternatives": [
      {
        "text": "Option 1",
        "id": "0",
        "correct": false
      },
      {
        "text": "Option 2",
        "id": "1",
        "correct": false
      },
      {
        "text": "Option 3",
        "id": "2",
        "correct": false
      }
    ]
  },
  "requiredField": true
}
```

#### Multiple Choice Question Parameters:

- **question**: The question text
- **inputType**: Type of input field ("checkbox" for multiple selection or "radio" for single selection)
- **alternatives**: Array of options
- **requiredField**: Whether an answer is required

## 5. Intro Page

The optional introduction page structure:

```json
"introPage": {
  "showIntroPage": true,
  "title": "Questionnaire Introduction",
  "introduction": "This is an introduction to the questionnaire."
}
```

## 6. UI Elements and Localization

UI elements and localization settings provide customizable text labels:

```json
"uiElements": {
  "questionnaireTitle": "Questionnaire",
  "requiredMessage": "This question requires an answer",
  "requiredText": "required",
  "timeoutMessage": "Unable to submit questionnaire right now. Please try again later."
},
"l10n": {
  "nextButton": "Next",
  "prevButton": "Previous",
  "closeButton": "Close",
  "submitButton": "Submit",
  "requiredMessage": "This question requires an answer",
  "requiredText": "required",
  "submitButtonCheckboxes": "Submit form",
  "submitButtonText": "Submit",
  "submitSuccessful": "Form submitted successfully.",
  "submitUnsuccessful": "Form could not be submitted.",
  "submitMessage": "Your answers have been submitted!",
  "submitConfirm": "Submit your answers? After submitting, you won't be able to change your answers."
}
```

## 7. Success Screen

The success screen configuration:

```json
"successScreenOptions": {
  "enableSuccessScreen": true,
  "successScreenImage": {},
  "successMessage": "Thank you for completing the questionnaire!",
  "successComment": "Your answers have been submitted."
}
```

## 8. Common Issues and Solutions

1. **Issue**: Questions not appearing in the questionnaire
   **Solution**: Ensure each question element has a valid library reference and unique subContentId

2. **Issue**: Required fields not being enforced
   **Solution**: Make sure the `requiredField` parameter is set to true for required questions

3. **Issue**: Success screen not showing
   **Solution**: Verify that `successScreenOptions.enableSuccessScreen` is set to true

4. **Issue**: Progress indicator not showing correctly
   **Solution**: Check that `progressType` is set to a valid value ("dots", "textual", or "none")

5. **Issue**: Multiple choice questions not working
   **Solution**: Ensure the `inputType` is correctly set to "checkbox" or "radio" and alternatives have valid IDs

## 9. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Questionnaire Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.Questionnaire",
    "preloadedDependencies": [
      {"machineName": "H5P.Questionnaire", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.SimpleMultiChoice", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "H5P.OpenEndedQuestion", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3}
    ]
  },
  "library": "H5P.Questionnaire 1.3",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Questionnaire Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.Questionnaire",
      "preloadedDependencies": [
        {"machineName": "H5P.Questionnaire", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.SimpleMultiChoice", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "H5P.OpenEndedQuestion", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3}
      ]
    },
    "progressType": "dots",
    "elements": [
      {
        "library": "H5P.OpenEndedQuestion 1.0",
        "subContentId": "unique-id-1",
        "metadata": {
          "contentType": "Open Ended Question"
        },
        "params": {
          "question": "What do you think about this questionnaire?",
          "placeholderText": "Enter your answer here...",
          "messageLength": "long"
        },
        "requiredField": true
      },
      {
        "library": "H5P.SimpleMultiChoice 1.1",
        "subContentId": "unique-id-2",
        "metadata": {
          "contentType": "Simple Multi Choice"
        },
        "params": {
          "question": "Which of the following options do you prefer?",
          "inputType": "radio",
          "alternatives": [
            {
              "text": "Option 1",
              "id": "0",
              "correct": false
            },
            {
              "text": "Option 2",
              "id": "1",
              "correct": false
            }
          ]
        },
        "requiredField": true
      }
    ],
    "uiElements": {
      "questionnaireTitle": "Questionnaire",
      "requiredMessage": "This question requires an answer",
      "requiredText": "required"
    },
    "successScreenOptions": {
      "enableSuccessScreen": true,
      "successMessage": "Thank you for completing the questionnaire!",
      "successComment": "Your answers have been submitted."
    }
  }
}
```

## 10. Variants and Special Configurations

### 10.1 Without Intro Page

To create a questionnaire without an introduction page:

```json
"introPage": {
  "showIntroPage": false
}
```

### 10.2 Different Progress Indicators

To use a different type of progress indicator:

```json
"progressType": "textual" // Options: "dots", "textual", "none"
```

### 10.3 Long Answer Questions

For questions that require longer answers:

```json
{
  "library": "H5P.OpenEndedQuestion 1.0",
  "subContentId": "unique-id-3",
  "metadata": {
    "contentType": "Open Ended Question"
  },
  "params": {
    "question": "Please provide detailed feedback about your experience.",
    "placeholderText": "Enter your detailed feedback here...",
    "messageLength": "long"
  },
  "requiredField": false
}
```

### 10.4 Multiple Selection Questions

For questions that allow multiple selections:

```json
{
  "library": "H5P.SimpleMultiChoice 1.1",
  "subContentId": "unique-id-4",
  "metadata": {
    "contentType": "Simple Multi Choice"
  },
  "params": {
    "question": "Which of the following features would you like to see? (Select all that apply)",
    "inputType": "checkbox",
    "alternatives": [
      {
        "text": "Feature 1",
        "id": "0",
        "correct": false
      },
      {
        "text": "Feature 2",
        "id": "1",
        "correct": false
      },
      {
        "text": "Feature 3",
        "id": "2",
        "correct": false
      },
      {
        "text": "Feature 4",
        "id": "3",
        "correct": false
      }
    ]
  },
  "requiredField": true
}
```

### 10.5 Disabled Success Screen

To disable the success screen:

```json
"successScreenOptions": {
  "enableSuccessScreen": false
}
```

## 11. Advanced Features

### 11.1 HTML Formatting in Questions

Questions can include HTML formatting:

```json
"params": {
  "question": "<p>What do you think about <strong>this feature</strong>?</p><p>Please provide your honest feedback.</p>"
}
```

### 11.2 Rich Text in Alternatives

Multiple choice alternatives can include rich text:

```json
"alternatives": [
  {
    "text": "Option with <strong>bold</strong> text",
    "id": "0",
    "correct": false
  },
  {
    "text": "Option with <em>italic</em> text",
    "id": "1",
    "correct": false
  }
]
```

### 11.3 Mixed Question Types

A questionnaire can include both open-ended and multiple choice questions:

```json
"elements": [
  {
    "library": "H5P.OpenEndedQuestion 1.0",
    // Open-ended question parameters
  },
  {
    "library": "H5P.SimpleMultiChoice 1.1",
    // Multiple choice question parameters
  },
  {
    "library": "H5P.OpenEndedQuestion 1.0",
    // Another open-ended question
  },
  {
    "library": "H5P.SimpleMultiChoice 1.1",
    // Another multiple choice question
  }
]
```

## 12. Summary of Critical Requirements

For a functioning H5P Questionnaire, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Unique subContentId for each element**: Each question must have a unique identifier
4. **Valid library references**: Each question must reference the correct library
5. **At least one question element**: The elements array must contain at least one question
6. **Properly structured question parameters**: Each question type has specific required parameters

By following this guide precisely, you can create reliable H5P Questionnaire content that functions correctly across all devices and platforms. 