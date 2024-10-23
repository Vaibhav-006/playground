// Initialize CodeMirror with autoCloseTags and autoCloseBrackets for HTML, CSS, and JS editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
  mode: 'xml',
  theme: 'material',
  lineNumbers: true,
  autoCloseTags: true,  // Enable auto closing of HTML tags
  extraKeys: {
    'Ctrl-/': 'toggleComment',  // Enable comment toggling with Ctrl + /
    'Cmd-/': 'toggleComment'    // For macOS users with Cmd + /
  }
});

// Pre-fill the HTML editor with the default boilerplate
htmlEditor.setValue(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>`);

const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-editor'), {
  mode: 'css',
  theme: 'material',
  lineNumbers: true,
  autoCloseBrackets: true,  // Enable auto closing of (), {}, and ""
  extraKeys: {
    'Ctrl-/': 'toggleComment',  // Enable comment toggling with Ctrl + /
    'Cmd-/': 'toggleComment'    // For macOS users with Cmd + /
  }
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-editor'), {
  mode: 'javascript',
  theme: 'material',
  lineNumbers: true,
  autoCloseBrackets: true,  // Enable auto closing of (), {}, and ""
  extraKeys: {
    'Ctrl-/': 'toggleComment',  // Enable comment toggling with Ctrl + /
    'Cmd-/': 'toggleComment'    // For macOS users with Cmd + /
  }
});

// Function to update the output preview
function updateOutput() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;

  // Wrap JS code in try-catch for error handling
  const jsContent = `
    <script>
      try {
        ${jsEditor.getValue()}
      } catch (error) {
        document.body.innerHTML = '<pre style="color: red;">' + error + '</pre>';
      }
    </script>`;

  const outputContent = `
    <html>
      <head>
        ${cssContent}
      </head>
      <body>
        ${htmlContent}
        ${jsContent}
      </body>
    </html>
  `;

  const outputFrame = document.getElementById('output');
  outputFrame.srcdoc = outputContent;
}

// Debounce updateOutput for better performance
let debounceTimer;
function debounceUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateOutput, 300); // 300ms delay
}

// Apply debouncing for each editor
htmlEditor.on('change', debounceUpdate);
cssEditor.on('change', debounceUpdate);
jsEditor.on('change', debounceUpdate);

// Font Size Adjustment with Slider
let currentFontSize = 14; // Default font size

document.getElementById('font-size-button').addEventListener('click', () => {
  const slider = document.getElementById('font-size-slider');
  slider.style.display = slider.style.display === 'none' ? 'inline-block' : 'none';
});

document.getElementById('font-size-slider').addEventListener('input', (event) => {
  const fontSize = event.target.value;
  setEditorFontSize(fontSize);
});

function setEditorFontSize(fontSize) {
  const editors = [htmlEditor, cssEditor, jsEditor];
  editors.forEach(editor => {
    editor.getWrapperElement().style.fontSize = `${fontSize}px`;
  });
}

// Remove welcome overlay after a few seconds
window.addEventListener('load', () => {
  updateOutput();  // Trigger initial output update

  setTimeout(() => {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    if (welcomeOverlay) {
      welcomeOverlay.style.display = 'none';
    }
  }, 3000); // Matches the fadeOut animation time
});
