# H5P Accordion: Definitive Structure Guide

This document provides a comprehensive, detailed specification for creating properly structured H5P Accordion content via the REST API. Following these exact patterns is essential for creating functional accordion interfaces.

## 1. Top-Level Structure Requirements

A working H5P Accordion **must** maintain this exact top-level structure:

```json
{
  "h5p": {
    // Metadata, dependencies, configuration
  },
  "library": "H5P.Accordion 1.0",
  "params": {
    "metadata": {
      // DUPLICATE of top-level h5p metadata
    },
    "params": {
      "panels": [
        // Array of accordion panels
      ],
      "behaviour": {
        // Behavior settings
      },
      "l10n": {
        // UI text labels
      },
      "hTag": "h2" // Heading level for panel titles
    }
  }
}
```

### Critical Requirements:

1. **Dual Metadata Structure**: The H5P framework requires both the top-level `h5p` object AND duplicated metadata in `params.metadata`
2. **Exact Library Definition**: Must specify the library name and version (`H5P.Accordion 1.0`)
3. **Panels Array**: Must contain at least one panel with title and content
4. **hTag Parameter**: Specifies the heading level for panel titles (typically "h2")

## 2. Metadata and Dependencies

Both the top-level `h5p` object and the `params.metadata` section **must** include identical information:

```json
{
  "embedTypes": ["iframe"],
  "language": "en",
  "title": "Accordion Example",
  "license": "U",
  "defaultLanguage": "en",
  "mainLibrary": "H5P.Accordion",
  "preloadedDependencies": [
    {"machineName": "H5P.Accordion", "majorVersion": 1, "minorVersion": 0},
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
    {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for Accordion functionality:

- **H5P.Accordion**: Main content type
- **FontAwesome**: For icons (collapse/expand)
- **H5P.AdvancedText**: For panel content (required for proper content rendering)

## 3. Accordion Structure

The main structure for an Accordion is defined in the params.params object:

```json
"params": {
  "panels": [
    {
      "title": "First Panel Title",
      "content": {
        "params": {
          "text": "<p>This is the content for the first panel. You can include HTML formatting.</p>"
        },
        "library": "H5P.AdvancedText 1.1",
        "subContentId": "e381920b-2991-4e1a-96d5-9be91faed613",
        "metadata": {
          "contentType": "Text",
          "license": "U",
          "title": "Unbenannt: Text",
          "authors": [],
          "changes": []
        }
      }
    },
    {
      "title": "Second Panel Title",
      "content": {
        "params": {
          "text": "<p>This is the content for the second panel.</p>"
        },
        "library": "H5P.AdvancedText 1.1",
        "subContentId": "82cd104f-7f2f-4a74-98b7-ea9e01a55589",
        "metadata": {
          "contentType": "Text",
          "license": "U",
          "title": "Unbenannt: Text",
          "authors": [],
          "changes": []
        }
      }
    }
  ],
  "behaviour": {
    "expandAll": false,
    "equalHeight": false,
    "randomizedPanels": false
  },
  "l10n": {
    "expandPanelLabel": "Expand panel",
    "collapsePanelLabel": "Collapse panel"
  },
  "hTag": "h2"
}
```

### Key Components:

1. **Panels**: Array of accordion panels, each with a title and content
2. **Behavior Settings**: Controls how the accordion behaves
3. **UI Text (l10n)**: Customizable labels for the user interface
4. **hTag**: Specifies the heading level for panel titles (typically "h2")

## 4. Panel Structure

Each panel in the `panels` array follows this structure:

```json
{
  "title": "Panel Title",
  "content": {
    "params": {
      "text": "<p>Panel content with HTML formatting.</p>"
    },
    "library": "H5P.AdvancedText 1.1",
    "subContentId": "e381920b-2991-4e1a-96d5-9be91faed613",
    "metadata": {
      "contentType": "Text",
      "license": "U",
      "title": "Unbenannt: Text",
      "authors": [],
      "changes": []
    }
  }
}
```

### Panel Components:

1. **Title**: The heading text shown in the collapsed state
2. **Content**: A complete content object with its own library reference

#### Content Object Structure:

- **params**: Contains the actual content parameters (text for AdvancedText)
- **library**: Must specify "H5P.AdvancedText 1.1" (or other compatible content type)
- **subContentId**: A unique UUID for each content object (required)
- **metadata**: Content-specific metadata

#### Content Formatting within AdvancedText:

The text parameter within AdvancedText supports full HTML formatting including:
  - Paragraphs: `<p>Text</p>`
  - Headings: `<h2>Heading</h2>`
  - Lists: `<ul><li>Item</li></ul>`
  - Links: `<a href="https://example.com">Link</a>`
  - Images: `<img src="image.jpg" alt="description">`
  - Formatting: `<strong>Bold</strong>`, `<em>Italic</em>`
  - Tables: `<table><tr><td>Cell</td></tr></table>`

## 5. Behavior Settings

The behavior settings control how the accordion functions:

```json
"behaviour": {
  "expandAll": false,     // Whether all panels should be expanded by default
  "equalHeight": false,   // Whether all panels should have the same height
  "randomizedPanels": false // Whether to randomize the order of panels
}
```

## 6. Localization (l10n) Settings

The l10n settings provide customizable text labels for the UI:

```json
"l10n": {
  "expandPanelLabel": "Expand panel",
  "collapsePanelLabel": "Collapse panel"
}
```

## 7. Common Issues and Solutions

1. **Issue**: Panels not expanding/collapsing
   **Solution**: Ensure the library version is correct and FontAwesome dependency is included

2. **Issue**: Content not displaying
   **Solution**: Make sure H5P.AdvancedText is included in preloadedDependencies

3. **Issue**: Content appears but without styling
   **Solution**: Verify that HTML tags are properly closed and nested

4. **Issue**: Missing subContentId
   **Solution**: Generate a unique UUID for each content object

5. **Issue**: Icons not appearing
   **Solution**: Ensure FontAwesome dependency is properly included in both metadata locations

6. **Issue**: Panel titles not formatted correctly
   **Solution**: Check that the hTag parameter is properly set

## 8. Complete Example Structure

Below is a minimal working example:

```json
{
  "h5p": {
    "embedTypes": ["iframe"],
    "language": "en",
    "title": "Accordion Example",
    "license": "U",
    "defaultLanguage": "en",
    "mainLibrary": "H5P.Accordion",
    "preloadedDependencies": [
      {"machineName": "H5P.Accordion", "majorVersion": 1, "minorVersion": 0},
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
      {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1}
    ]
  },
  "library": "H5P.Accordion 1.0",
  "params": {
    "metadata": {
      "embedTypes": ["iframe"],
      "language": "en",
      "title": "Accordion Example",
      "license": "U",
      "defaultLanguage": "en",
      "mainLibrary": "H5P.Accordion",
      "preloadedDependencies": [
        {"machineName": "H5P.Accordion", "majorVersion": 1, "minorVersion": 0},
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1}
      ]
    },
    "params": {
      "panels": [
        {
          "title": "First Panel",
          "content": {
            "params": {
              "text": "<p>Content for the first panel.</p>"
            },
            "library": "H5P.AdvancedText 1.1",
            "subContentId": "e381920b-2991-4e1a-96d5-9be91faed613",
            "metadata": {
              "contentType": "Text",
              "license": "U",
              "title": "Unbenannt: Text",
              "authors": [],
              "changes": []
            }
          }
        },
        {
          "title": "Second Panel",
          "content": {
            "params": {
              "text": "<p>Content for the second panel.</p>"
            },
            "library": "H5P.AdvancedText 1.1",
            "subContentId": "82cd104f-7f2f-4a74-98b7-ea9e01a55589",
            "metadata": {
              "contentType": "Text",
              "license": "U",
              "title": "Unbenannt: Text",
              "authors": [],
              "changes": []
            }
          }
        }
      ],
      "behaviour": {
        "expandAll": false,
        "equalHeight": false
      },
      "l10n": {
        "expandPanelLabel": "Expand panel",
        "collapsePanelLabel": "Collapse panel"
      },
      "hTag": "h2"
    }
  }
}
```

## 9. Variants and Special Configurations

### 9.1 All Panels Expanded

To have all panels expanded by default:

```json
"behaviour": {
  "expandAll": true,
  "equalHeight": false
}
```

### 9.2 Equal Panel Heights

To ensure all panels have the same height:

```json
"behaviour": {
  "expandAll": false,
  "equalHeight": true
}
```

### 9.3 Randomized Panel Order

To randomize the order of panels:

```json
"behaviour": {
  "expandAll": false,
  "equalHeight": false,
  "randomizedPanels": true
}
```

### 9.4 Using Other Content Types

Panels can use content types other than H5P.AdvancedText:

```json
"panels": [
  {
    "title": "Panel with Image",
    "content": {
      "params": {
        // Parameters specific to the content type
      },
      "library": "H5P.Image 1.1",
      "subContentId": "unique-uuid-here",
      "metadata": {
        "contentType": "Image",
        "license": "U",
        "title": "Example Image",
        "authors": [],
        "changes": []
      }
    }
  }
]
```

## 10. Generating SubContentIds

Each content object requires a unique subContentId. These should be UUIDs in the format:
`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (e.g., "e381920b-2991-4e1a-96d5-9be91faed613")

You can generate these using standard UUID libraries or online generators. Each panel's content must have its own unique subContentId.

## 11. Summary of Critical Requirements

For a functioning H5P Accordion, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: H5P.Accordion, FontAwesome, and H5P.AdvancedText must be declared in both metadata locations
3. **Panels array**: Must contain at least one panel with title and content
4. **Content objects**: Each panel must contain a properly structured content object with library reference
5. **SubContentId**: Each content object requires a unique UUID
6. **hTag parameter**: Must be specified (typically "h2")

By following this guide precisely, you can create reliable H5P Accordion content that functions correctly across all devices and platforms. 