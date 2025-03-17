# H5P Branching Scenario: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Branching Scenario content via the REST API. Following these exact patterns is essential for creating functional branching scenarios.

## 1. Top-Level Structure Requirements

A working H5P Branching Scenario **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.BranchingScenario 1.7",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      "branchingScenario": {
        // Actual content structure
      }
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.BranchingScenario 1.7`)
3. **Nested Params Structure**: Content must be in `params.params.branchingScenario` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Branching Scenario Title",
  "license": "U",
  "defaultLanguage": "en",
  "extraTitle": "Additional Title",
  "mainLibrary": "H5P.BranchingScenario",
  "preloadedDependencies": [
    {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.BranchingQuestion", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    // Additional dependencies for specific content types
    {"machineName": "H5P.BranchingScenario", "majorVersion": 1, "minorVersion": 7}
  ]
}
```

### Required Dependencies:

The framework requires these minimum dependencies for functionality:

- **H5P.AdvancedText**: For text content
- **H5P.BranchingQuestion**: For branching decision points
- **FontAwesome**: For icons
- **H5P.JoubelUI**: For UI elements
- **H5P.Transition**: For transitions between screens
- **H5P.FontIcons**: For additional icons
- **H5P.BranchingScenario**: Main content type

**Additional dependencies for specific content:**
- If using Course Presentations: `H5P.CoursePresentation`
- If using links: `H5P.Link`
- Other content types as needed

## 3. Content Structure - The Critical "Type" Pattern

The **most important structure** that causes branching scenarios to fail is the content array format. Each content must use a precise "type wrapper" pattern:

```json
"content": [
  {
    "type": {
      "library": "H5P.AdvancedText 1.1",
      "params": {
        // Content specific parameters
      },
      "subContentId": "22a7d04c-c94c-43dd-81c3-cf7b4b84efe5", // UUID format
      "metadata": {
        "contentType": "Text",
        "license": "U",
        "title": "Content Title",
        "authors": [],
        "changes": [],
        "extraTitle": "Content Title"
      }
    },
    "showContentTitle": false,
    "proceedButtonText": "Next",
    "forceContentFinished": "useBehavioural",
    "feedback": {"subtitle": ""},
    "contentBehaviour": "useBehavioural",
    "nextContentId": 1, // MUST be numeric integer
    "contentId": 0      // MUST be numeric integer
  },
  // Additional content nodes...
]
```

### Critical "Type Wrapper" Requirements:

1. **Type Object**: Each content node **must** wrap its content in a `type` object
2. **Library Definition**: Each `type` must specify exact library with version
3. **SubContentId**: Every content **must** have a unique UUID format `subContentId`
4. **Metadata**: Each content must have complete metadata
5. **Navigation IDs**: All `contentId` and `nextContentId` values **must** be numeric integers (not strings)
6. **Behavioral Properties**: Each node needs properties like `showContentTitle`, `forceContentFinished`, etc.

## 4. Content Type Implementations

### 4.1 Text Content (H5P.AdvancedText)

```json
"type": {
  "library": "H5P.AdvancedText 1.1",
  "params": {
    "text": "<p>Your HTML content here</p>\n"
  },
  "subContentId": "22a7d04c-c94c-43dd-81c3-cf7b4b84efe5",
  "metadata": {
    "contentType": "Text",
    "license": "U",
    "title": "Text Title",
    "authors": [],
    "changes": [],
    "extraTitle": "Text Title"
  }
}
```

### 4.2 Branching Question (H5P.BranchingQuestion)

```json
"type": {
  "library": "H5P.BranchingQuestion 1.0",
  "params": {
    "branchingQuestion": {
      "alternatives": [
        {
          "nextContentId": 2,  // NUMERIC ID
          "feedback": {"title": "", "subtitle": ""},
          "text": "Option A"
        },
        {
          "nextContentId": 3,  // NUMERIC ID
          "feedback": {"title": "", "subtitle": ""},
          "text": "Option B"
        }
      ],
      "question": "<p>Your question text here?</p>\n"
    },
    "proceedButtonText": "Proceed"
  },
  "subContentId": "e5e00618-26fc-4f4e-bdb3-dd39cdc1e144",
  "metadata": {
    "contentType": "Branching Question",
    "license": "U",
    "title": "Question Title",
    "authors": [],
    "changes": [],
    "extraTitle": "Question Title"
  }
}
```

### 4.3 Course Presentation (H5P.CoursePresentation)

Course presentations require a complex structure with slides, elements, and positioning. If using this content type, ensure you include the H5P.CoursePresentation dependency.

Key requirements:
- Slide elements need precise positioning (x, y, width, height)
- Each element needs its own action and subContentId
- Comprehensive l10n and override settings are required

## 5. Navigation and Flow Control

Navigation is controlled through specific properties:

```json
"nextContentId": 1,    // Points to the next content item by numeric ID
"contentId": 0,        // The numeric ID of this content
```

Special navigation values:
- `-1`: Indicates the end of a branch (proceed to end screen)
- Branching question alternatives point to different content IDs

## 6. Start Screen Configuration

The start screen must follow this format:

```json
"startScreen": {
  "startScreenTitle": "<p>Title of the scenario</p>\n",
  "startScreenSubtitle": "<p>Descriptive subtitle</p>\n"
}
```

## 7. End Screen Configuration

The end screen must follow this exact format:

```json
"endScreens": [
  {
    "endScreenTitle": "<p>End screen title</p>\n",
    "endScreenSubtitle": "<p>End screen subtitle</p>\n",
    "contentId": -1,
    "endScreenScore": 0
  }
]
```

## 8. Scoring Configuration

Include a scoring configuration:

```json
"scoringOptionGroup": {
  "scoringOption": "no-score",  // Options: "no-score", "dynamic-score"
  "includeInteractionsScores": true
}
```

## 9. Behavior Settings

Control the global behavior:

```json
"behaviour": {
  "enableBackwardsNavigation": false,
  "forceContentFinished": false,
  "randomizeBranchingQuestions": false
}
```

## 10. Localization Structure

Include comprehensive localization settings:

```json
"l10n": {
  "startScreenButtonText": "Start the course",
  "endScreenButtonText": "Restart the course",
  "backButtonText": "Back",
  "disableProceedButtonText": "Require to complete the current module",
  "replayButtonText": "Replay the video",
  "scoreText": "Your score:",
  "fullscreenAria": "Fullscreen"
}
```

## 11. Special Attributes

Include these additional attributes for complete compatibility:

```json
"preventXAPI": true  // May be needed for certain integration scenarios
```

## 12. Common Issues and Solutions

1. **Issue**: White screen after initial screen
   **Solution**: Ensure content nodes use the "type" wrapper pattern

2. **Issue**: Navigation fails between screens
   **Solution**: Check that contentId and nextContentId use numeric integers, not strings

3. **Issue**: Missing UI elements
   **Solution**: Verify all required dependencies are included (H5P.JoubelUI, etc.)

4. **Issue**: Incomplete rendering of specific content
   **Solution**: Ensure content-specific libraries are included in dependencies

5. **Issue**: End screen not appearing
   **Solution**: Verify end screen format and check that content flows properly to contentId: -1

## 13. Complete Example Structure

Below is a minimal working example combining all required elements:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Branching Scenario Example",
    "license": "U",
    "defaultLanguage": "en",
    "extraTitle": "Branching Example",
    "mainLibrary": "H5P.BranchingScenario",
    "preloadedDependencies": [
      {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "H5P.BranchingQuestion", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.BranchingScenario", "majorVersion": 1, "minorVersion": 7}
    ]
  },
  "library": "H5P.BranchingScenario 1.7",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Branching Scenario Example",
      "license": "U",
      "defaultLanguage": "en",
      "extraTitle": "Branching Example",
      "mainLibrary": "H5P.BranchingScenario",
      "preloadedDependencies": [
        {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "H5P.BranchingQuestion", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.BranchingScenario", "majorVersion": 1, "minorVersion": 7}
      ]
    },
    "params": {
      "branchingScenario": {
        "content": [
          {
            "type": {
              "library": "H5P.AdvancedText 1.1",
              "params": {
                "text": "<p>Welcome to the example!</p>\n"
              },
              "subContentId": "f5e00618-26fc-4f4e-bdb3-dd39cdc1e111",
              "metadata": {
                "contentType": "Text",
                "license": "U",
                "title": "Welcome Text",
                "authors": [],
                "changes": [],
                "extraTitle": "Welcome Text"
              }
            },
            "showContentTitle": false,
            "proceedButtonText": "Next",
            "forceContentFinished": "useBehavioural",
            "feedback": {"subtitle": ""},
            "contentBehaviour": "useBehavioural",
            "nextContentId": 1,
            "contentId": 0
          },
          {
            "type": {
              "library": "H5P.BranchingQuestion 1.0",
              "params": {
                "branchingQuestion": {
                  "alternatives": [
                    {
                      "nextContentId": 2,
                      "feedback": {"title": "", "subtitle": ""},
                      "text": "View option A"
                    },
                    {
                      "nextContentId": 3,
                      "feedback": {"title": "", "subtitle": ""},
                      "text": "View option B"
                    }
                  ],
                  "question": "<p>Which path would you like to take?</p>\n"
                },
                "proceedButtonText": "Proceed"
              },
              "subContentId": "e5e00618-26fc-4f4e-bdb3-dd39cdc1e222",
              "metadata": {
                "contentType": "Branching Question",
                "license": "U",
                "title": "Path Choice",
                "authors": [],
                "changes": [],
                "extraTitle": "Path Choice"
              }
            },
            "showContentTitle": false,
            "proceedButtonText": "Proceed",
            "forceContentFinished": "useBehavioural",
            "feedback": {"subtitle": ""},
            "contentBehaviour": "useBehavioural",
            "contentId": 1
          },
          {
            "type": {
              "library": "H5P.AdvancedText 1.1",
              "params": {
                "text": "<h2>Option A Content</h2><p>This is the content for option A.</p>"
              },
              "subContentId": "e5e00618-26fc-4f4e-bdb3-dd39cdc1e333",
              "metadata": {
                "contentType": "Text",
                "license": "U",
                "title": "Option A Content",
                "authors": [],
                "changes": [],
                "extraTitle": "Option A Content"
              }
            },
            "showContentTitle": false,
            "proceedButtonText": "Proceed",
            "forceContentFinished": "useBehavioural",
            "feedback": {"subtitle": ""},
            "contentBehaviour": "useBehavioural",
            "nextContentId": -1,
            "contentId": 2
          },
          {
            "type": {
              "library": "H5P.AdvancedText 1.1",
              "params": {
                "text": "<h2>Option B Content</h2><p>This is the content for option B.</p>"
              },
              "subContentId": "e5e00618-26fc-4f4e-bdb3-dd39cdc1e444",
              "metadata": {
                "contentType": "Text",
                "license": "U",
                "title": "Option B Content",
                "authors": [],
                "changes": [],
                "extraTitle": "Option B Content"
              }
            },
            "showContentTitle": false,
            "proceedButtonText": "Proceed",
            "forceContentFinished": "useBehavioural",
            "feedback": {"subtitle": ""},
            "contentBehaviour": "useBehavioural",
            "nextContentId": -1,
            "contentId": 3
          }
        ],
        "endScreens": [
          {
            "endScreenTitle": "<p>You've completed the scenario!</p>\n",
            "endScreenSubtitle": "<p>Thanks for exploring this example.</p>\n",
            "contentId": -1,
            "endScreenScore": 0
          }
        ],
        "scoringOptionGroup": {
          "scoringOption": "no-score",
          "includeInteractionsScores": true
        },
        "startScreen": {
          "startScreenTitle": "<p>Example Branching Scenario</p>\n",
          "startScreenSubtitle": "<p>Explore this example to learn about branching scenarios</p>\n"
        },
        "behaviour": {
          "enableBackwardsNavigation": false,
          "forceContentFinished": false,
          "randomizeBranchingQuestions": false
        },
        "l10n": {
          "startScreenButtonText": "Start the course",
          "endScreenButtonText": "Restart the course",
          "backButtonText": "Back",
          "disableProceedButtonText": "Require to complete the current module",
          "replayButtonText": "Replay the video",
          "scoreText": "Your score:",
          "fullscreenAria": "Fullscreen"
        },
        "preventXAPI": true
      }
    }
  }
}
```

## 14. Testing Validation

To validate your branching scenario structure:

1. Ensure all structure patterns match exactly as specified
2. Upload to your H5P endpoint
3. Verify that:
   - The start screen appears correctly
   - Navigation between screens works
   - Branching paths lead to the correct content
   - End screens display properly

## 15. Summary of Critical Requirements

For a functioning H5P Branching Scenario, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Type wrapper**: All content must be wrapped in a `type` object with library, params, subContentId, and metadata
3. **Numeric content IDs**: All content IDs must be numeric integers, not strings
4. **Complete dependency declarations**: All required libraries must be declared in both metadata locations
5. **Unique subContentIds**: Every content element needs a UUID-format subContentId
6. **Comprehensive content properties**: Each content node needs all behavioral properties

By following this guide precisely, you can create reliable H5P Branching Scenarios that function correctly across all screens. 