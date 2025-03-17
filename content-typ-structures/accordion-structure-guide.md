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
    "panels": [
      // Array of accordion panels
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
2. **Exact Library Definition**: Must specify the library name and version (`H5P.Accordion 1.0`)
3. **Panels Array**: Must contain at least one panel with title and content

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
    {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
  ]
}
```

### Required Dependencies:

The framework requires these dependencies for Accordion functionality:

- **H5P.Accordion**: Main content type
- **FontAwesome**: For icons (collapse/expand)

## 3. Accordion Structure

The main structure for an Accordion is defined in the params object:

```json
"params": {
  "panels": [
    {
      "title": "First Panel Title",
      "content": "<p>This is the content for the first panel. You can include HTML formatting.</p>"
    },
    {
      "title": "Second Panel Title",
      "content": "<p>This is the content for the second panel. You can include HTML formatting, images, lists, etc.</p>"
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
  }
}
```

### Key Components:

1. **Panels**: Array of accordion panels, each with a title and content
2. **Behavior Settings**: Controls how the accordion behaves
3. **UI Text (l10n)**: Customizable labels for the user interface

## 4. Panel Structure

Each panel in the `panels` array follows this structure:

```json
{
  "title": "Panel Title",
  "content": "<p>Panel content with HTML formatting.</p>"
}
```

### Panel Components:

1. **Title**: The heading text shown in the collapsed state
2. **Content**: The HTML content displayed when the panel is expanded

#### Content Formatting:

- Content supports full HTML formatting including:
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

2. **Issue**: HTML content not rendering correctly
   **Solution**: Make sure HTML in the content field is properly formatted and escaped in JSON

3. **Issue**: Content appears but without styling
   **Solution**: Verify that HTML tags are properly closed and nested

4. **Issue**: Uneven panel heights
   **Solution**: Set `behaviour.equalHeight` to true if you want consistent panel heights

5. **Issue**: Icons not appearing
   **Solution**: Ensure FontAwesome dependency is properly included in both metadata locations

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
      {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
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
        {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
      ]
    },
    "panels": [
      {
        "title": "First Panel",
        "content": "<p>Content for the first panel.</p>"
      },
      {
        "title": "Second Panel",
        "content": "<p>Content for the second panel.</p>"
      }
    ],
    "behaviour": {
      "expandAll": false,
      "equalHeight": false
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

### 9.4 Rich Content Panels

For panels with rich HTML content:

```json
"panels": [
  {
    "title": "Rich Content Panel",
    "content": "<h2>Heading Inside Panel</h2><p>This panel contains rich <strong>formatted</strong> content including:</p><ul><li>Lists</li><li>Formatting</li><li>And <a href='https://h5p.org'>links</a></li></ul><table border='1'><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></table>"
  }
]
```

## 10. Advanced Content Types within Accordion

### 10.1 Including Images

Adding images to panel content:

```json
"panels": [
  {
    "title": "Panel with Image",
    "content": "<p>This panel contains an image:</p><img src='https://example.com/image.jpg' alt='Example image' width='300' height='200'>"
  }
]
```

### 10.2 Including Lists

Adding ordered and unordered lists:

```json
"panels": [
  {
    "title": "Panel with Lists",
    "content": "<p>Unordered list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Ordered list:</p><ol><li>First item</li><li>Second item</li><li>Third item</li></ol>"
  }
]
```

### 10.3 Including Tables

Adding tables to organize information:

```json
"panels": [
  {
    "title": "Panel with Table",
    "content": "<table border='1'><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Row 1, Cell 1</td><td>Row 1, Cell 2</td><td>Row 1, Cell 3</td></tr><tr><td>Row 2, Cell 1</td><td>Row 2, Cell 2</td><td>Row 2, Cell 3</td></tr></tbody></table>"
  }
]
```

## 11. Summary of Critical Requirements

For a functioning H5P Accordion, the most critical elements are:

1. **Dual metadata structure**: Both top-level and nested in params
2. **Complete dependency declarations**: H5P.Accordion and FontAwesome must be declared in both metadata locations
3. **Panels array**: Must contain at least one panel with title and content
4. **Properly escaped HTML**: HTML content must be properly formatted and escaped in JSON
5. **Consistent formatting**: Both title and content must be present for each panel

By following this guide precisely, you can create reliable H5P Accordion content that functions correctly across all devices and platforms. 