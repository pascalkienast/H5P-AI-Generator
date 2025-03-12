import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  de: {
    translation: {
      "title": "H5P AI Generator",
      "createContent": "H5P-Inhalte mit KI erstellen",
      "description": "Beschreiben Sie den interaktiven Inhalt, den Sie erstellen möchten, und unsere KI wird ihn für Sie generieren.",
      "whatCreate": "Was möchten Sie erstellen?",
      "placeholder": "z.B. Erstelle ein Quiz über europäische Hauptstädte",
      "startCreating": "Erstellen starten",
      "supportedTypes": "Unterstützte Inhaltstypen:",
      "tips": "Tipps:",
      "tipsContent": "Für die meisten Bildungsinhalte beginnen Sie am besten mit Multiple Choice oder Question Set. Komplexe Typen wie Branching Scenario oder Interactive Video erfordern möglicherweise zusätzliche Bearbeitung nach der Generierung.",
      "conversation": "Konversation",
      "generating": "H5P-Inhalt wird generiert",
      "generatingDesc": "Bitte warten Sie, während wir Ihren interaktiven Inhalt erstellen...",
      "error": "Fehler",
      "generatedModule": "Generiertes H5P-Modul",
      "downloadH5P": "H5P herunterladen",
      "startNew": "Neue Generierung starten",
      "send": "Senden",
      "typeMessage": "Nachricht eingeben...",
      "contentTypes": {
        "multipleChoice": "Multiple Choice Fragen",
        "trueFalse": "Wahr/Falsch Fragen",
        "fillBlanks": "Lückentexte",
        "dragDrop": "Drag and Drop",
        "imageHotspots": "Bild-Hotspots",
        "coursePresentation": "Kurspräsentation",
        "questionSet": "Fragensammlung",
        "dialogCards": "Dialogkarten",
        "markWords": "Wörter markieren",
        "flashcards": "Karteikarten",
        "interactiveVideo": "Interaktives Video",
        "branchingScenario": "Verzweigtes Szenario",
        "arithmeticQuiz": "Arithmetik-Quiz",
        "dragText": "Text ziehen",
        "essay": "Aufsatz",
        "findHotspot": "Hotspot finden",
        "audio": "Audio",
        "accordion": "Akkordeon",
        "summary": "Zusammenfassung",
        "interactiveBook": "Interaktives Buch"
      },
      "warnings": {
        "corruptFiles": "(Warnung: kann beschädigte Dateien erzeugen)",
        "complex": "(komplex)"
      }
    }
  },
  en: {
    translation: {
      "title": "H5P AI Generator",
      "createContent": "Create H5P Content with AI",
      "description": "Describe the interactive content you want to create, and our AI will generate it for you.",
      "whatCreate": "What would you like to create?",
      "placeholder": "e.g., Create a quiz about European capitals",
      "startCreating": "Start Creating",
      "supportedTypes": "Supported Content Types:",
      "tips": "Tips:",
      "tipsContent": "For most educational content, start with Multiple Choice or Question Set. Complex types like Branching Scenario or Interactive Video may require additional editing after generation.",
      "conversation": "Conversation",
      "generating": "Generating H5P Content",
      "generatingDesc": "Please wait while we create your interactive content...",
      "error": "Error",
      "generatedModule": "Generated H5P Module",
      "downloadH5P": "Download H5P",
      "startNew": "Start New Generation",
      "send": "Send",
      "typeMessage": "Type your message...",
      "contentTypes": {
        "multipleChoice": "Multiple Choice Questions",
        "trueFalse": "True/False Questions",
        "fillBlanks": "Fill in the Blanks",
        "dragDrop": "Drag and Drop",
        "imageHotspots": "Image Hotspots",
        "coursePresentation": "Course Presentation",
        "questionSet": "Question Set",
        "dialogCards": "Dialog Cards",
        "markWords": "Mark the Words",
        "flashcards": "Flashcards",
        "interactiveVideo": "Interactive Video",
        "branchingScenario": "Branching Scenario",
        "arithmeticQuiz": "Arithmetic Quiz",
        "dragText": "Drag Text",
        "essay": "Essay",
        "findHotspot": "Find the Hotspot",
        "audio": "Audio",
        "accordion": "Accordion",
        "summary": "Summary",
        "interactiveBook": "Interactive Book"
      },
      "warnings": {
        "corruptFiles": "(warning: may create corrupt files)",
        "complex": "(complex)"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 