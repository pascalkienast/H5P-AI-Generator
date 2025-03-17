# H5P QuestionSet: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P QuestionSet content via the REST API. Following these exact patterns is essential for creating functional quizzes with multiple questions.

## 1. Top-Level Structure Requirements

A working H5P QuestionSet **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.QuestionSet 1.17",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual QuestionSet content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Multiple Questions Container**: H5P.QuestionSet is designed for containing multiple questions of various types. It serves as a container/wrapper for different question types like MultiChoice, TrueFalse, DragText, etc.
2. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
3. **Exact Library Definition**: Must specify the library name and version (`H5P.QuestionSet 1.17`)
4. **Nested Params Structure**: Quiz content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Kitchen Tools Quiz",
  "license": "CC BY",
  "licenseVersion": "4.0",
  "defaultLanguage": "en",
  "extraTitle": "Kitchen Tools Quiz",
  "mainLibrary": "H5P.QuestionSet",
  "preloadedDependencies": [
    {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.DragQuestion", "majorVersion": 1, "minorVersion": 13},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 4},
    {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.TrueFalse", "majorVersion": 1, "minorVersion": 6},
    {"machineName": "H5P.DragText", "majorVersion": 1, "minorVersion": 8},
    {"machineName": "EmbeddedJS", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.Video", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "flowplayer", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.QuestionSet", "majorVersion": 1, "minorVersion": 17}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for QuestionSet functionality:

- **H5P.QuestionSet**: Main content type
- **H5P.Question**: Base question framework
- **H5P.JoubelUI**: For UI elements
- **H5P.Transition**: For transitions
- **H5P.FontIcons**: For icons
- **FontAwesome**: For additional icons
- **jQuery.ui**: For UI interactions
- **Question type libraries**: Dependencies for each question type used in the set

Additionally, include specific dependencies for each question type you plan to use:
- **H5P.AdvancedText**: For formatted text elements
- **H5P.DragQuestion**: For drag and drop questions
- **H5P.Image**: For image content
- **H5P.TrueFalse**: For true/false questions
- **H5P.DragText**: For text-based drag and drop
- **H5P.Video** and **flowplayer**: For video content
- **EmbeddedJS**: For embedded JavaScript functionality

## 3. QuestionSet Structure

The main structure for a QuestionSet is defined in the `params.params` object:

```json
"params": {
  "introPage": {
    "showIntroPage": true,
    "title": "Kitchen Tools Quiz",
    "introduction": "<p><strong>Einführungstext</strong></p>\n",
    "startButtonText": "Start Quiz"
  },
  "questions": [
    // Array of question objects - each with their own library type and parameters
  ],
  "progressType": "dots",
  "passPercentage": 50,
  "showResults": true,
  "disableBackwardsNavigation": false,
  "randomQuestions": false,
  "endGame": {
    "showResultPage": true,
    "showSolutionButton": true,
    "showRetryButton": true,
    "noResultMessage": "Finished",
    "message": "Your result:",
    "overallFeedback": [
      {"from": 0, "to": 100, "feedback": ""}
    ],
    "solutionButtonText": "Show solution",
    "retryButtonText": "Retry",
    "finishButtonText": "Finish",
    "showAnimations": false,
    "skippable": false
  },
  "override": {
    "showSolutionButton": "on",
    "retryButton": "on",
    "checkButton": true
  },
  "texts": {
    "prevButton": "Previous question",
    "nextButton": "Next question",
    "finishButton": "Finish",
    "textualProgress": "Question: @current of @total questions",
    "jumpToQuestion": "Question %d of %total",
    "questionLabel": "Question",
    "readSpeakerProgress": "Question @current of @total",
    "unansweredText": "Unanswered",
    "answeredText": "Answered",
    "currentQuestionText": "Current question"
  }
}
```

### Key Components:

1. **Intro Page**: Optional introduction page for the quiz
2. **Questions Array**: Array of different question objects (NOTE: property name is "questions", not "questionSet")
3. **Progress Tracking**: How to display quiz progress 
4. **Pass Percentage**: Minimum percentage to pass the quiz
5. **Results Display**: Configuration for showing results
6. **End Game Settings**: Configuration for quiz completion
7. **Override Settings**: Override settings for individual questions
8. **Navigation Options**: Control backwards navigation
9. **Text Labels**: Customizable text for buttons and UI elements

## 4. Question Objects Structure

Each question in the questions array has its own structure based on its library type:

```json
{
  "library": "H5P.DragQuestion 1.13",
  "params": {
    // Parameters specific to this library type
    // (Follows the structure for that content type)
  },
  "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
  "metadata": {
    "contentType": "Zuordnungsaufgabe (Drag and Drop)",
    "license": "U",
    "title": "Put these appliances into the correct categories",
    "authors": [],
    "changes": [],
    "extraTitle": "Put these appliances into the correct categories"
  }
}
```

### Critical Question Requirements:

1. **Library Property**: Specifies the question type and version (e.g., `H5P.DragQuestion 1.13`)
2. **Params Structure**: Contains parameters specific to that question type
3. **SubContentId**: Unique identifier for this question within the set
4. **Metadata**: Additional information about the question (title, license, content type)

## 5. Example Question Structures

Below are examples of different question types from a real working quiz:

### 5.1 DragQuestion (Drag and Drop)

```json
{
  "library": "H5P.DragQuestion 1.13",
  "params": {
    "scoreShow": "Check",
    "tryAgain": "Retry",
    "scoreExplanation": "Correct answers give +1 point. Incorrect answers give -1 point. The lowest possible score is 0.",
    "question": {
      "settings": {
        "size": {"width": 620, "height": 310}
      },
      "task": {
        "elements": [
          {
            "x": 40.386362827976,
            "y": 50.482033195212,
            "width": 6.7125754846527,
            "height": 1.3288921243942,
            "dropZones": ["0", "1"],
            "type": {
              "library": "H5P.AdvancedText 1.1",
              "params": {"text": "<p>Refrigerator</p>\n"},
              "subContentId": "d596a404-8f23-42f8-b953-209ba751ba47"
            },
            "backgroundOpacity": 100,
            "multiple": false
          },
          // Additional elements omitted for brevity
        ],
        "dropZones": [
          {
            "x": 8.6206896551724,
            "y": 10.344827586207,
            "width": 11.090517241379,
            "height": 16.903017241379,
            "correctElements": ["0", "1", "2", "3"],
            "showLabel": true,
            "backgroundOpacity": 100,
            "tipsAndFeedback": {"tip": ""},
            "single": false,
            "autoAlign": true,
            "label": "<div>Large Applicance</div>\n"
          },
          // Additional drop zones omitted for brevity
        ]
      }
    },
    "overallFeedback": [{"from": 0, "to": 100}],
    "behaviour": {
      "enableRetry": true,
      "enableCheckButton": true,
      "showSolutionsRequiresInput": true,
      "singlePoint": false,
      "applyPenalties": false,
      "enableScoreExplanation": true,
      "dropZoneHighlighting": "dragging",
      "autoAlignSpacing": 2,
      "enableFullScreen": false,
      "showScorePoints": true,
      "showTitle": true
    },
    // Additional parameters for accessibility and localization
  },
  "subContentId": "7cbc7723-1a41-4f83-b7b0-590f87fda441",
  "metadata": {
    "contentType": "Zuordnungsaufgabe (Drag and Drop)",
    "license": "U",
    "title": "Put these appliances into the correct categories"
  }
}
```

### 5.2 TrueFalse Question

```json
{
  "library": "H5P.TrueFalse 1.6",
  "params": {
    "media": {"disableImageZooming": false},
    "correct": "true",
    "behaviour": {
      "enableRetry": true,
      "enableSolutionsButton": true,
      "enableCheckButton": true,
      "confirmCheckDialog": false,
      "confirmRetryDialog": false,
      "autoCheck": false
    },
    "l10n": {
      "trueText": "True",
      "falseText": "False",
      "score": "You got @score of @total points",
      "checkAnswer": "Check",
      "showSolutionButton": "Show solution",
      "tryAgain": "Retry"
      // Additional localization properties omitted for brevity
    },
    "question": "<p>Utensils are kitchen tools, such as measuring cups, knives, spoons, and forks.</p>\n"
  },
  "subContentId": "373679c1-43b4-427b-a76d-8890cfb90e4b",
  "metadata": {
    "contentType": "Richtig/Falsch-Frage (True/False Question)",
    "license": "U",
    "title": "True/False Question"
  }
}
```

### 5.3 DragText Question

```json
{
  "library": "H5P.DragText 1.8",
  "params": {
    "taskDescription": "<p>Drag the name of the knife next to its description</p>\n",
    "overallFeedback": [{"from": 0, "to": 100}],
    "checkAnswer": "Check",
    "tryAgain": "Retry",
    "showSolution": "Show solution",
    "behaviour": {
      "enableRetry": true,
      "enableSolutionsButton": true,
      "enableCheckButton": true,
      "instantFeedback": false
    },
    "textField": "*Chef's knife* also called a French knife. Has a large, triangular blade. Ideal for slicing, chopping, and dicing.\n\n*Utility knife* is similar to a slicing knife but smaller. It is used for cutting smaller foods items such as tomatoes and apples.\n\n*Bread knife* has a serrated, or saw-tooth-patterned blade for slicing through bread.\n\n*Sharpening steel* a long steel rod on a handle used to help keep knives sharp.\n\n*Slicing knife* is used for cutting large foods, such as meat and poultry.\n\n*Paring knife* is used to pare (cut a very thin layer of peel or outer coating from fruits and vegetables)"
    // Additional parameters omitted for brevity
  },
  "subContentId": "cbd448b6-8d78-4d0a-8f44-718dc7532eeb",
  "metadata": {
    "contentType": "Wörter einordnen (Drag the Words)",
    "license": "U",
    "title": "Knife Descriptions Drag Text"
  }
}
```

## 6. Behavior Settings

The QuestionSet behavior can be controlled with these settings:

```json
"progressType": "dots",          // How to show progress ("dots" or "textual")
"passPercentage": 50,            // Percentage needed to pass
"showResults": true,             // Show results at the end
"randomQuestions": false,        // Randomize question order
"disableBackwardsNavigation": false, // Allow going back to previous questions
"override": {
  "showSolutionButton": "on",    // Force show solution button on all questions
  "retryButton": "on",           // Force retry button on all questions
  "checkButton": true            // Force check button on all questions
}
```

## 7. End Game Settings

Configure the end game/results screen:

```json
"endGame": {
  "showResultPage": true,        // Show final results page
  "showSolutionButton": true,    // Show solution button on results page
  "showRetryButton": true,       // Show retry button on results page
  "noResultMessage": "Finished", // Message when no results to show
  "message": "Your result:",     // Message shown at completion
  "overallFeedback": [
    {"from": 0, "to": 100, "feedback": ""}
  ],
  "solutionButtonText": "Show solution", // Text for solution button
  "retryButtonText": "Retry",           // Text for retry button
  "finishButtonText": "Finish",         // Text for finish button
  "showAnimations": false,              // Show animations on result page
  "skippable": false,                   // Allow skipping result page
  "skipButtonText": "Skip video"        // Text for skip button
}
```

## 8. Text Customization

One important feature of QuestionSet is the ability to customize UI text elements:

```json
"texts": {
  "prevButton": "Previous question",
  "nextButton": "Next question",
  "finishButton": "Finish",
  "textualProgress": "Question: @current of @total questions",
  "jumpToQuestion": "Question %d of %total",
  "questionLabel": "Question",
  "readSpeakerProgress": "Question @current of @total",
  "unansweredText": "Unanswered",
  "answeredText": "Answered",
  "currentQuestionText": "Current question"
}
```

## 9. Complex Question Type: DragQuestion Structure

The DragQuestion type is particularly complex, with detailed structure for elements and drop zones:

### Elements Structure

```json
"elements": [
  {
    "x": 40.386362827976,     // X position as percentage
    "y": 50.482033195212,     // Y position as percentage
    "width": 6.7125754846527, // Width as percentage
    "height": 1.3288921243942, // Height as percentage
    "dropZones": ["0", "1"],  // IDs of dropzones this element can be placed in
    "type": {
      "library": "H5P.AdvancedText 1.1",  // Type of element
      "params": {"text": "<p>Refrigerator</p>\n"}, // Element content
      "subContentId": "d596a404-8f23-42f8-b953-209ba751ba47"
    },
    "backgroundOpacity": 100, // Background opacity
    "multiple": false         // Whether element can be used multiple times
  }
]
```

### Drop Zones Structure

```json
"dropZones": [
  {
    "x": 8.6206896551724,      // X position as percentage
    "y": 10.344827586207,      // Y position as percentage
    "width": 11.090517241379,  // Width as percentage
    "height": 16.903017241379, // Height as percentage
    "correctElements": ["0", "1", "2", "3"], // IDs of elements that belong here
    "showLabel": true,         // Whether to show label
    "backgroundOpacity": 100,  // Background opacity
    "tipsAndFeedback": {"tip": ""}, // Tips for this drop zone
    "single": false,           // Whether only one element can be placed
    "autoAlign": true,         // Whether to automatically align elements
    "label": "<div>Large Applicance</div>\n" // Label text
  }
]
```

## 10. Common Issues and Solutions

1. **Issue**: Questions not displaying correctly
   **Solution**: Ensure each question has the correct library version and parameters

2. **Issue**: Progress tracking not working
   **Solution**: Verify the `progressType` property is set correctly

3. **Issue**: End results not showing
   **Solution**: Check that `showResults` and `endGame.showResultPage` are set to true

4. **Issue**: Retry button not working
   **Solution**: Confirm `override.retryButton` is set to "on"

5. **Issue**: Random ordering not working
   **Solution**: Verify `randomQuestions` is set to true

6. **Issue**: DragQuestion elements not appearing correctly
   **Solution**: Check the positioning values (x, y, width, height) and ensure they're valid percentages

7. **Issue**: Drag and drop not functioning properly
   **Solution**: Ensure correctElements contains valid element IDs and dropZones contains valid dropZone IDs

## 11. Question Type Specifics

### 11.1 DragQuestion (Drag and Drop)

DragQuestion allows creating interactive drag and drop exercises with various elements that can be positioned and configured precisely:

- **Elements**: Can be text (H5P.AdvancedText) or images (H5P.Image)
- **Drop Zones**: Target areas where elements can be placed
- **Scoring**: Configure scoring behavior with `applyPenalties` and `singlePoint`
- **Visual Feedback**: Configure when highlighting appears with `dropZoneHighlighting`

### 11.2 TrueFalse

TrueFalse presents a statement that users must mark as true or false:

- **Question Text**: Statement to be evaluated
- **Correct Answer**: Set via the `correct` property ("true" or "false")
- **Media**: Optional media element to include with the question
- **Behavior**: Configure retry, solutions, and check button behavior

### 11.3 DragText

DragText allows users to drag words into the correct positions in text:

- **Text Field**: The main content with draggable words marked with asterisks (*word*)
- **Task Description**: Instructions shown to the user
- **Instant Feedback**: Configure with `behaviour.instantFeedback`

## 12. Summary of Critical Requirements

For a functioning H5P QuestionSet, the most critical elements are:

1. **Multiple Questions Container**: H5P.QuestionSet is designed for containing multiple questions of various types, as opposed to H5P.MultiChoice which only contains a single question.
2. **Dual metadata structure**: Both top-level and nested in params
3. **Complete dependency declarations**: All required libraries declared in both metadata locations, including those for each question type used
4. **Questions array**: At least one question object with correct library and params - note the property name is "questions" not "questionSet"
5. **Behavior settings**: Correct configuration for question navigation and display
6. **End game settings**: Proper configuration for displaying quiz results
7. **Text customizations**: Proper labeling of navigation and feedback elements

By following this guide precisely, you can create reliable H5P QuestionSet quizzes that function correctly across all devices and platforms.

## 13. Real-World Example Analysis

Analysis of a working QuestionSet example revealed these important insights:

1. QuestionSet can contain many question types within a single quiz, including DragQuestion, TrueFalse, and DragText. The example contains a complex kitchen tools quiz with multiple drag and drop interactions.

2. Each question in a QuestionSet maintains its own complete structure, including metadata, library definition, parameters, and unique subContentId.

3. DragQuestion is highly configurable with precise positioning of elements and drop zones using percentage-based coordinates for responsive layouts.

4. Accessibility and internationalization are built into the structure via localization objects (l10n) and accessibility text properties.

5. Question content can include rich elements like formatted text, images, and specialized interaction types for different learning objectives.

6. The structure supports multilingual content with translation capabilities for UI elements.

7. Complex question types like DragText use special syntax (asterisks around words) to mark draggable content in otherwise normal text.

8. Each question type has its own unique parameter structure but follows consistent patterns for behavior settings and feedback mechanisms. 