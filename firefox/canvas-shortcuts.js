const state = {
  fileKbdEls: null,
};

const DIALOG_ID = "canvas-shortcuts-help";
const FILE_CLASS = ".submission-file";
const FILE_KBD_CLASS = ".file-kbd";
const KBD_STYLE_BASE = `background-color: #eee;
    border-radius: 3px;
    border: 1px solid #b4b4b4;
    box-shadow:
      0 1px 1px rgba(0, 0, 0, 0.2),
      0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
    color: #333;
    display: inline-block;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;`;
let dialogHelpEl = null;

const SPEEDGRADER_FRAME_SELECTOR = "#iframe_holder #speedgrader_iframe";

function isFileHotKeysActive() {
  state.fileKbdEls = document.querySelectorAll(FILE_KBD_CLASS);
  return !(state.fileKbdEls === null || state.fileKbdEls.length === 0);
}

const ASCII_A_LOWER_OFFSET = 88;
const ASCII_NUMBER_OFFSET = 48;
const BIGGEST_NUMBER = 9;
const NUM_LETTERS_IN_ALPHABET = 26;

/**
 * 1-9, a-z, null (if run out of files)
 * @param {number} index starts at zero
 * @returns {string | null}
 */
function getFileHotKey(index) {
  if (index < BIGGEST_NUMBER) {
    return index + 1 + "";
  } else if (index < BIGGEST_NUMBER + NUM_LETTERS_IN_ALPHABET) {
    return String.fromCharCode(index + ASCII_A_LOWER_OFFSET);
  } else {
    return null;
  }
}

/**
 *
 * @param {string} keyPressed "1"-"9", "a"-"z" are valid
 */
function selectFile(keyPressed) {
  const ascii = keyPressed.charCodeAt(0);
  const ASCII_NUMBER_RANGE = [49, 57];
  const ASCII_CHAR_RANGE = [97, 122];
  let index = -1;
  if (ascii >= ASCII_NUMBER_RANGE[0] && ascii <= ASCII_NUMBER_RANGE[1]) {
    index = parseInt(ascii) - ASCII_NUMBER_OFFSET - 1;
  } else if (ascii >= ASCII_CHAR_RANGE[0] && ascii <= ASCII_CHAR_RANGE[1]) {
    index = ascii - ASCII_A_LOWER_OFFSET;
  }

  // select file
  const fileAnchorEls = document.querySelectorAll(
    FILE_CLASS + " a.display_name"
  );
  if (index < fileAnchorEls.length && index >= 0) {
    fileAnchorEls[index].click();
    const speedGraderFrameEl = document.querySelector(
      SPEEDGRADER_FRAME_SELECTOR
    );
    console.log("load", speedGraderFrameEl);
    if (speedGraderFrameEl !== null) {
      setTimeout(() => {
        const pagesContainer =
          speedGraderFrameEl.contentDocument.querySelector(".Pages");
        console.log("load frame", pagesContainer);
        pagesContainer.focus();
      }, 1000);
    }
  }
}

/**
 * @returns {boolean}
 */
function toggleFileHotKeys() {
  const kbdStyle =
    KBD_STYLE_BASE +
    `
    position: absolute;
    top: 0;
    left: 0;
  `;

  // element has relative positioning
  const fileDomEls = document.querySelectorAll(FILE_CLASS);

  // toggle
  if (!isFileHotKeysActive()) {
    fileDomEls.forEach((el, key) => {
      const numberEl = document.createElement("kbd");
      numberEl.className = FILE_KBD_CLASS.substring(1);
      numberEl.innerHTML = getFileHotKey(key);
      numberEl.style = kbdStyle;
      el.appendChild(numberEl);
    });
  } else {
    state.fileKbdEls.forEach((el) => el.remove());
    state.fileKbdEls = null;
  }
}

/**
 * Listen for shortcuts (each is a combination with "Alt").
 *
 * SpeedGrader
 * ===========
 * Alt+F1 for help.
 *
 * @param {KeyboardEvent} e
 */
function shortcutListener(e) {
  const COMMENT_FRAME_ID = "comment_rce_textarea_ifr";
  const arrowLeftEl = document.querySelector(".icon-arrow-left.prev");
  const arrowRightEl = document.querySelector(".icon-arrow-right.next");
  const studentSelectEl = document.getElementById("students_selectmenu-button");
  const commentFrame = document.getElementById(COMMENT_FRAME_ID);
  const commentSubmitBtnEl = document.getElementById("comment_submit_button");
  const commentTextEl = commentFrame.contentDocument.getElementById("tinymce");
  commentFrame.contentDocument.addEventListener("keydown", function (event) {
    // Submit the comment.
    if (event.altKey && event.key === "Enter") {
      // Create and dispatch the event on the top window
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "KeyEnter",
        code: "KeyEnter",
        altKey: true,
        bubbles: true,
      });

      // Dispatch to top window
      top.dispatchEvent(keydownEvent);
    }
  });

  const gradeInputEl = document.getElementById("grading-box-extended");
  const viewRubricBtnEl = document.querySelector(
    ".toggle_full_rubric.edit.btn"
  );

  // SpeedGrader
  if (window.location.pathname.endsWith("gradebook/speed_grader")) {
    if (isFileHotKeysActive()) {
      // toggle no matter what key is pressed
      toggleFileHotKeys();
      // get file
      selectFile(e.key);
    } else if (e.altKey) {
      if (e.code === "F1" && dialogHelpEl !== null) {
        dialogHelpEl.showModal();
      } else if (e.code === "Period") {
        arrowRightEl.click();
      } else if (e.code === "Comma") {
        arrowLeftEl.click();
      } else if (e.code === "ArrowDown") {
        studentSelectEl.click();
      } else if (
        e.code === "KeyEnter" &&
        document.activeElement.id === COMMENT_FRAME_ID
      ) {
        commentSubmitBtnEl.click();
      } else if (e.code === "KeyC") {
        commentTextEl.focus();
      } else if (e.code === "KeyS" || e.code === "KeyG") {
        gradeInputEl.focus();
      } else if (e.code === "KeyR") {
        viewRubricBtnEl.click();
        // get element here because it was hidden before
        const firstRubricEl = document.querySelector(".rating-tier.assessing");
        firstRubricEl.focus();
      } else if (e.code === "KeyL") {
        // go to file toggle
        toggleFileHotKeys();
      }
    } else if (
      e.code === "Escape" &&
      document.activeElement.id === DIALOG_ID &&
      dialogHelpEl !== null
    ) {
      dialogHelpEl.close();
    }
  }
}

if (window.location.hostname.endsWith("instructure.com")) {
  window.addEventListener("keydown", shortcutListener);
  console.log(
    "%cUsing 'Canvas Shortcuts' extension.\nPress 'Alt+F1' for help.",
    "background-color: green; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px; line-height: 2; display: block; text-align: center"
  );
  dialogHelpEl = document.createElement("dialog");

  dialogHelpEl.id = DIALOG_ID;
  dialogHelpEl.innerHTML = `
  <style>
    kbd {${KBD_STYLE_BASE}}
    ul {margin-bottom: 1rem}
  </style>
  <h3>Canvas Shortcuts Help</h3>
  <ul>
    <li><kbd>Alt+&gt;</kbd> || <kbd>Alt+&lt;</kbd> = Cycle through submissions.</li>
    <li><kbd>Alt+ArrowDown</kbd> = Open the dropdown of students.</li>
    <li><kbd>Alt+C</kbd> = Focus on the comment input box.</li>
    <li><kbd>Alt+Enter</kbd> = Submit comment (if comment box is focused).</li>
    <li><kbd>Alt+S</kbd> || <kbd>Alt+G</kbd> = Put the (S)core or (G)rade in.</li>
    <li><kbd>Alt+R</kbd> = Toggle rubric and focus on the first rubric item.</li>
    <li><kbd>Alt+L</kbd> <kbd>[1-9a-z]</kbd> = Open a file. <kbd>Alt+L</kbd> first, followed by a key.</li>
    <li><kbd>Esc</kbd> = Close this help dialog.</li>
  </ul>
  <form method="dialog">
    <button class="btn">Close</button>
  </form>`;
  document.body.appendChild(dialogHelpEl);
} else {
  window.removeEventListener("keydown", shortcutListener);
}
