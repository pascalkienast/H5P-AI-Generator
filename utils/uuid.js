/**
 * Generates a valid UUID v4 string
 * This can be used for subContentId fields in H5P content
 * 
 * @returns {string} A UUID v4 string (e.g., "761cca1f-6432-4a3e-912c-bd31a3bf53de")
 */
export function generateUUID() {
  // Implementation of UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validates if a string is in the format of a UUID v4
 * 
 * @param {string} uuid - The string to validate
 * @returns {boolean} True if the string is a valid UUID v4
 */
export function isValidUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

/**
 * Replaces all subContentId fields in an H5P JSON structure with valid UUIDs
 * This can fix JSON that was generated with invalid subContentId values
 * 
 * @param {Object} jsonContent - The H5P JSON content object
 * @returns {Object} The same object with all subContentIds replaced with valid UUIDs
 */
export function replaceSubContentIds(jsonContent) {
  if (!jsonContent) return jsonContent;
  
  // Deep clone the object to avoid modifying the original
  const clone = JSON.parse(JSON.stringify(jsonContent));
  
  // Recursive function to traverse and replace subContentIds
  function traverse(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    
    // If this object has a subContentId property, replace it
    if (obj.hasOwnProperty('subContentId') && !isValidUUID(obj.subContentId)) {
      obj.subContentId = generateUUID();
    }
    
    // Traverse all properties
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        traverse(obj[key]);
      }
    }
  }
  
  traverse(clone);
  return clone;
}

export default {
  generateUUID,
  isValidUUID,
  replaceSubContentIds
}; 