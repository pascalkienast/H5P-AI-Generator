# H5P Content Structure Documentation

This directory contains documentation and structure guides for different H5P content types supported by the H5P-AI-Generator application.

## Purpose

These files serve as references for the AI when generating H5P content. They provide:

1. Detailed explanations of the required JSON structure for each content type
2. Examples of valid content structures
3. Specific format requirements for the H5P-AI-Generator API

## Critical Structure Requirements

For all H5P content types, the following structure **must** be followed:

```json
{
  "library": "H5P.ContentTypeName MajorVersion.MinorVersion",
  "params": {
    "metadata": {
      "title": "Content Title",
      "license": "U",
      "extraTitle": "Content Title"
    },
    "params": {
      // Content-specific parameters
    }
  }
}
```

### Important Rules

- **DO NOT** include a top-level `h5p` object
- **DO NOT** wrap the JSON in any additional objects
- **DO NOT** duplicate metadata in different places
- For `params.metadata`, only include: `title`, `license`, `extraTitle` (and optionally `authors` and `changes`)
- **DO NOT** include `preloadedDependencies`, `mainLibrary`, `embedTypes`, etc.
- Always include a proper `subContentId` as a UUID for each sub-content item
- Always ensure `extraTitle` matches `title` in all metadata objects

## Example Files

- `questionset-example.json`: A complete example of a valid QuestionSet structure
- `questionset-structure-guide.md`: Detailed documentation for the QuestionSet content type
- `h5p-api-test-script.md`: Testing instructions and commands for the H5P API

## Debugging Common Issues

When content generation fails, the most common issues are:

1. Including a top-level `h5p` object
2. Duplicating metadata in multiple locations
3. Using incorrect or invalid `subContentId` values
4. Not following the simplified structure required by the API

## For Developers

If you need to test the API directly, refer to the `h5p-api-test-script.md` file for example commands and test structures. 