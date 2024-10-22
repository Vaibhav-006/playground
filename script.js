// Initialize CodeMirror with autoCloseTags for HTML, CSS, and JS editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
  mode: 'xml',
  theme: 'material',
  lineNumbers: true,
  autoCloseTags: true,  // Enable auto closing of HTML tags
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-editor'), {
  mode: 'css',
  theme: 'material',
  lineNumbers: true,
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-editor'), {
  mode: 'javascript',
  theme: 'material',
  lineNumbers: true,
});

// Function to update the output preview
function updateOutput() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = `<script>${jsEditor.getValue()}<\/script>`;

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

// Add event listeners to update output when content is changed
htmlEditor.on('change', updateOutput);
cssEditor.on('change', updateOutput);
jsEditor.on('change', updateOutput);

// Save code to localStorage
document.getElementById('save-button').addEventListener('click', () => {
  const code = {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  };
  localStorage.setItem('savedCode', JSON.stringify(code));
  alert('Code saved!');
});

// Load code from localStorage
document.getElementById('load-button').addEventListener('click', () => {
  const savedCode = localStorage.getItem('savedCode');
  if (savedCode) {
    const code = JSON.parse(savedCode);
    htmlEditor.setValue(code.html);
    cssEditor.setValue(code.css);
    jsEditor.setValue(code.js);
    updateOutput();
    alert('Code loaded!');
  } else {
    alert('No saved code found.');
  }
});

// Share code by generating a URL
document.getElementById('share-button').addEventListener('click', () => {
  const code = {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  };
  const encodedCode = encodeURIComponent(JSON.stringify(code));
  const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`;
  navigator.clipboard.writeText(shareUrl).then(() => alert('Share URL copied to clipboard!'));
});

// Fullscreen preview
document.getElementById('fullscreen-button').addEventListener('click', () => {
  const outputFrame = document.getElementById('output');
  if (outputFrame.requestFullscreen) {
    outputFrame.requestFullscreen();
  } else if (outputFrame.mozRequestFullScreen) { /* Firefox */
    outputFrame.mozRequestFullScreen();
  } else if (outputFrame.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    outputFrame.webkitRequestFullscreen();
  } else if (outputFrame.msRequestFullscreen) { /* IE/Edge */
    outputFrame.msRequestFullscreen();
  }
});

// Load shared code from URL if present
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedCode = urlParams.get('code');
  if (sharedCode) {
    try {
      const code = JSON.parse(decodeURIComponent(sharedCode));
      htmlEditor.setValue(code.html);
      cssEditor.setValue(code.css);
      jsEditor.setValue(code.js);
      updateOutput();
    } catch (error) {
      alert('Invalid shared code.');
    }
  }

  // Trigger initial output update
  updateOutput();

  // Remove the welcome overlay after a few seconds
  setTimeout(() => {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    welcomeOverlay.style.display = 'none';
  }, 3000); // Matches the fadeOut animation time
});
