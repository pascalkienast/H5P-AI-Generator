# H5P Interactive Book: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Interactive Book content via the REST API. Following these exact patterns is essential for creating functional interactive books.

## 1. Top-Level Structure Requirements

A working H5P Interactive Book **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.InteractiveBook 1.7",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      // Actual interactive book content and configuration
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.InteractiveBook 1.7`)
3. **Nested Params Structure**: Book content must be in `params.params` (double nesting is required)

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Interactive Book Title",
  "license": "U",
  "mainLibrary": "H5P.InteractiveBook",
  "preloadedDependencies": [
    {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
    {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
    {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
    {"machineName": "H5P.Column", "majorVersion": 1, "minorVersion": 16},
    {"machineName": "H5P.InteractiveBook", "majorVersion": 1, "minorVersion": 7}
  ]
}
```

### Required Dependencies:

The framework requires these minimum dependencies for functionality:

- **H5P.InteractiveBook**: Main content type
- **H5P.Column**: Used for chapter content
- **H5P.AdvancedText**: For text content
- **H5P.Image**: For images (cover and within content)
- **H5P.JoubelUI**: For UI elements
- **H5P.Transition**: For transitions between pages
- **H5P.FontIcons**: For icons
- **FontAwesome**: For additional icons

**Additional dependencies based on content:**
- If using questions: `H5P.Question`, `H5P.MultiChoice`, etc.
- If using videos: `H5P.Video`
- If using other interactive elements: include their specific dependencies

## 3. Interactive Book Structure

The structure of an Interactive Book consists of:

```json
"params": {
  "showCoverPage": true,
  "bookCover": {
    "coverDescription": "<p>Cover description text</p>",
    "coverMedium": {
      // Cover image (H5P.Image)
    }
  },
  "chapters": [
    // Array of chapters
  ],
  "behaviour": {
    "defaultTableOfContents": true,
    "progressIndicators": true,
    "displaySummary": true
  }
}
```

### Key Components:

1. **Cover Page Configuration**:
   - `showCoverPage`: Boolean to show/hide cover page
   - `coverDescription`: HTML text for the cover description
   - `coverMedium`: Cover image (H5P.Image)

2. **Chapters Array**: Contains all chapters of the book

3. **Behavior Settings**:
   - `defaultTableOfContents`: Show table of contents by default
   - `progressIndicators`: Show progress indicators
   - `displaySummary`: Show summary page at the end

## 4. Cover Image Structure

```json
"coverMedium": {
  "params": {
    "file": {
      "path": "https://example.com/image.jpg",
      "mime": "image/jpeg",
      "copyright": {"license": "U"},
      "width": 800,
      "height": 600
    },
    "decorative": false
  },
  "library": "H5P.Image 1.1",
  "subContentId": "fe938ea1-35ca-45b7-86d0-3b56f8ed707d"
}
```

### Critical Cover Image Requirements:

1. **Library**: Must use `H5P.Image` with correct version
2. **SubContentId**: Unique UUID for the image
3. **File Information**: Complete path, MIME type, dimensions, and copyright

## 5. Chapter Structure

Each chapter is implemented as an `H5P.Column` content type:

```json
{
  "params": {
    "content": [
      // Array of content elements
    ]
  },
  "library": "H5P.Column 1.16",
  "metadata": {
    "contentType": "Interaktive Seite (Column)",
    "license": "U",
    "title": "Chapter Title",
    "authors": [],
    "changes": [],
    "extraTitle": "Chapter Title"
  },
  "subContentId": "2e81d02c-871b-40c4-ae33-9ad30c95169c"
}
```

### Critical Chapter Requirements:

1. **Library**: Must use `H5P.Column` with correct version
2. **SubContentId**: Unique UUID for the chapter
3. **Metadata**: Complete metadata with contentType, license, title
4. **Title and extraTitle**: Must be identical and represent the chapter title (shown in table of contents)
5. **Content Array**: Contains all content elements for the chapter

## 6. Chapter Content Elements

Each content element in a chapter follows this structure:

```json
{
  "content": {
    "params": {
      // Content-specific parameters
    },
    "library": "H5P.AdvancedText 1.1", // Or other content type
    "metadata": {
      "contentType": "Text",
      "license": "U",
      "title": "Content Title",
      "authors": [],
      "changes": []
    },
    "subContentId": "83e73ab7-52dd-4482-b4de-b18c94c93b2a"
  },
  "useSeparator": "auto" // Options: "auto", "enabled", "disabled"
}
```

### Critical Content Element Requirements:

1. **Library**: Specify the content type library with correct version
2. **SubContentId**: Unique UUID for each content element
3. **Metadata**: Complete metadata for the content element
4. **useSeparator**: Controls visual separation between content elements

## 7. Specific Content Type Examples

### 7.1 Text Content (H5P.AdvancedText)

```json
"content": {
  "params": {
    "text": "<h2>Chapter Title</h2><p>Text content goes here</p>"
  },
  "library": "H5P.AdvancedText 1.1",
  "metadata": {
    "contentType": "Text",
    "license": "U",
    "title": "Text Title",
    "authors": [],
    "changes": []
  },
  "subContentId": "83e73ab7-52dd-4482-b4de-b18c94c93b2a"
}
```

### 7.2 Multiple Choice Question (H5P.MultiChoice)

```json
"content": {
  "params": {
    "question": "<p>What is this example demonstrating?</p>",
    "answers": [
      {"text": "Option A", "correct": true},
      {"text": "Option B", "correct": false},
      {"text": "Option C", "correct": false}
    ]
  },
  "library": "H5P.MultiChoice 1.16",
  "metadata": {
    "contentType": "Multiple Choice",
    "license": "U",
    "title": "Question Title",
    "authors": [],
    "changes": []
  },
  "subContentId": "c7457dc3-6fba-47d7-a909-20bafc918cb6"
}
```

### 7.3 Image Content (H5P.Image)

```json
"content": {
  "params": {
    "file": {
      "path": "images/example-image.jpg",
      "mime": "image/jpeg",
      "copyright": {"license": "U"},
      "width": 800,
      "height": 600
    },
    "decorative": false
  },
  "library": "H5P.Image 1.1",
  "metadata": {
    "contentType": "Image",
    "license": "U",
    "title": "Image Title",
    "authors": [],
    "changes": []
  },
  "subContentId": "7b5e6d8a-c944-42fc-b02e-a96f87632abc"
}
```

## 8. Behavior Settings

The behavior settings control various aspects of the book's user interface:

```json
"behaviour": {
  "defaultTableOfContents": true,    // Show table of contents by default
  "progressIndicators": true,        // Show progress indicators
  "displaySummary": true             // Show summary page at the end
}
```

### Optional Behavior Settings:

- `autoPlayVideo`: Automatically play videos in the book
- `showPageNumbers`: Display page numbers
- `hideCopyright`: Hide copyright information
- `enablePrint`: Allow printing
- `hideCover`: Completely hide cover (alternative to showCoverPage)

## 9. Navigation Features

The Interactive Book includes several built-in navigation features:

1. **Table of Contents**: Generated from chapter titles
2. **Progress Indicators**: Visual indication of progress through chapters
3. **Page Numbers**: Optional display of page numbers
4. **Summary Page**: Optional end page showing completion status

These features are controlled through the behavior settings and do not need additional configuration beyond setting the appropriate boolean values.

## 10. Common Issues and Solutions

1. **Issue**: Chapter titles not appearing in table of contents
   **Solution**: Ensure both `title` and `extraTitle` are present and identical in chapter metadata

2. **Issue**: Interactive elements not functioning
   **Solution**: Check that all required dependencies for interactive elements are included

3. **Issue**: Content not displaying correctly
   **Solution**: Verify each content element has proper `subContentId` and complete metadata

4. **Issue**: Cover image not displaying
   **Solution**: Check cover image configuration including path, MIME type, and dimensions

5. **Issue**: Progress indicators not working
   **Solution**: Ensure `progressIndicators: true` in behavior settings

## 11. Complete Example Structure

Below is a minimal working example combining all required elements:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Example Interactive Book",
    "license": "U",
    "mainLibrary": "H5P.InteractiveBook",
    "preloadedDependencies": [
      {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
      {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
      {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
      {"machineName": "H5P.Column", "majorVersion": 1, "minorVersion": 16},
      {"machineName": "H5P.InteractiveBook", "majorVersion": 1, "minorVersion": 7}
    ]
  },
  "library": "H5P.InteractiveBook 1.7",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Example Interactive Book",
      "license": "U",
      "mainLibrary": "H5P.InteractiveBook",
      "preloadedDependencies": [
        {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
        {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        {"machineName": "H5P.Column", "majorVersion": 1, "minorVersion": 16},
        {"machineName": "H5P.InteractiveBook", "majorVersion": 1, "minorVersion": 7}
      ]
    },
    "params": {
      "showCoverPage": true,
      "bookCover": {
        "coverDescription": "<p>This is an example interactive book.</p>",
        "coverMedium": {
          "params": {
            "file": {
              "path": "https://example.com/cover-image.jpg",
              "mime": "image/jpeg",
              "copyright": {"license": "U"},
              "width": 800,
              "height": 600
            },
            "decorative": false
          },
          "library": "H5P.Image 1.1",
          "subContentId": "fe938ea1-35ca-45b7-86d0-3b56f8ed707d"
        }
      },
      "chapters": [
        {
          "params": {
            "content": [
              {
                "content": {
                  "params": {
                    "text": "<h2>Chapter One</h2><p>This is the content of the first chapter.</p>"
                  },
                  "library": "H5P.AdvancedText 1.1",
                  "metadata": {
                    "contentType": "Text",
                    "license": "U",
                    "title": "Chapter One Text",
                    "authors": [],
                    "changes": []
                  },
                  "subContentId": "83e73ab7-52dd-4482-b4de-b18c94c93b2a"
                },
                "useSeparator": "auto"
              },
              {
                "content": {
                  "params": {
                    "question": "<p>What is this example demonstrating?</p>",
                    "answers": [
                      {"text": "How to create an Interactive Book", "correct": true},
                      {"text": "Something else", "correct": false}
                    ]
                  },
                  "library": "H5P.MultiChoice 1.16",
                  "metadata": {
                    "contentType": "Multiple Choice",
                    "license": "U",
                    "title": "Chapter One Quiz",
                    "authors": [],
                    "changes": []
                  },
                  "subContentId": "c7457dc3-6fba-47d7-a909-20bafc918cb6"
                },
                "useSeparator": "auto"
              }
            ]
          },
          "library": "H5P.Column 1.16",
          "metadata": {
            "contentType": "Interaktive Seite (Column)",
            "license": "U",
            "title": "Chapter One",
            "authors": [],
            "changes": [],
            "extraTitle": "Chapter One"
          },
          "subContentId": "2e81d02c-871b-40c4-ae33-9ad30c95169c"
        },
        {
          "params": {
            "content": [
              {
                "content": {
                  "params": {
                    "text": "<h2>Chapter Two</h2><p>This is the content of the second chapter.</p>"
                  },
                  "library": "H5P.AdvancedText 1.1",
                  "metadata": {
                    "contentType": "Text",
                    "license": "U",
                    "title": "Chapter Two Text",
                    "authors": [],
                    "changes": []
                  },
                  "subContentId": "ea28d0e3-cf11-41c0-b2e5-f8f5b279a24b"
                },
                "useSeparator": "auto"
              }
            ]
          },
          "library": "H5P.Column 1.16",
          "metadata": {
            "contentType": "Interaktive Seite (Column)",
            "license": "U",
            "title": "Chapter Two",
            "authors": [],
            "changes": [],
            "extraTitle": "Chapter Two"
          },
          "subContentId": "6a644281-aa72-4650-ae00-6bf172d56030"
        }
      ],
      "behaviour": {
        "defaultTableOfContents": true,
        "progressIndicators": true,
        "displaySummary": true
      }
    }
  }
}
```

## 12. Testing Validation

To validate your Interactive Book structure:

1. Ensure all structure patterns match exactly as specified
2. Upload to your H5P endpoint
3. Verify that:
   - The cover page appears correctly
   - The table of contents lists all chapters
   - Navigation between chapters works
   - Interactive elements function properly
   - Progress indicators update correctly
   - The summary page appears if enabled

## 13. Advanced Features

### 13.1 Supporting Multiple Content Types

The Interactive Book can include various content types within chapters:

- Text (H5P.AdvancedText)
- Images (H5P.Image)
- Videos (H5P.Video)
- Questions (H5P.MultiChoice, H5P.TrueFalse, H5P.FillInTheBlanks)
- Interactive content (H5P.InteractiveVideo, H5P.CoursePresentation)

For each content type, ensure:
1. Its dependency is included in preloadedDependencies
2. Proper structure with library, params, metadata, and subContentId

### 13.2 Chapter Navigation

Navigation between chapters is handled automatically by the Interactive Book framework. Key aspects:

- Table of contents provides direct navigation to chapters
- Next/previous buttons navigate sequentially
- Progress indicators show completion status
- Completed chapters are marked in the table of contents

### 13.3 Summary Page

The summary page provides an overview of user progress:

- Lists all chapters
- Shows completion status for each chapter
- Indicates scores for interactive elements (if applicable)
- Can be enabled/disabled with the `displaySummary` setting

## 14. Summary of Critical Requirements

For a functioning H5P Interactive Book, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: All required libraries declared in both metadata locations
3. **Proper chapter structure**: Each chapter implemented as H5P.Column with proper metadata
4. **Unique subContentIds**: Every content element needs a UUID-format subContentId
5. **Chapter titles**: Both title and extraTitle must be present and identical
6. **Content structure**: Each content element needs proper library, params, and metadata

By following this guide precisely, you can create reliable H5P Interactive Books that function correctly across all devices and platforms. 