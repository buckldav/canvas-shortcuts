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
  console.log(
    "%cUsing 'Canvas Shortcuts' extension.\nPress 'Alt+F1' for help.",
    "background-color: green; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px; line-height: 2; display: block; text-align: center"
  );

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

  const dialogHelpEl = document.createElement("dialog");
  const DIALOG_ID = "canvas-shortcuts-help";
  dialogHelpEl.id = DIALOG_ID;
  dialogHelpEl.innerHTML = `
  <h3>Canvas Shortcuts Help</h3>
  <ul>
    <li><kbd>Alt+&gt;</kbd> || <kbd>Alt+&lt;</kbd> || <kbd>Shift+ArrowLeft</kbd> || <kbd>Shift+ArrowRight</kbd> = Cycle through submissions.</li>
    <li><kbd>Alt+ArrowDown</kbd> = Open the dropdown of students.</li>
    <li><kbd>Alt+C</kbd> = Focus on the comment input box.</li>
    <li><kbd>Alt+Enter</kbd> = Submit comment (if comment box is focused).</li>
    <li><kbd>Alt+S</kbd> || <kbd>Alt+G</kbd> = Put the (S)core or (G)rade in.</li>
    <li><kbd>Alt+R</kbd> = Toggle rubric and focus on the first rubric item.</li>
    <li><kbd>Esc</kbd> = Close this help dialog.</li>
  </ul>
  <form method="dialog">
    <button>Close</button>
  </form>`;
  document.body.appendChild(dialogHelpEl);

  // SpeedGrader
  if (window.location.pathname.endsWith("gradebook/speed_grader")) {
    if (
      (e.altKey && e.code === "Period") ||
      (e.shiftKey && e.code === "ArrowRight")
    ) {
      arrowRightEl.click();
    } else if (
      (e.altKey && e.code === "Comma") ||
      (e.shiftKey && e.code === "ArrowLeft")
    ) {
      arrowLeftEl.click();
    } else if (e.altKey) {
      if (e.code === "F1") {
        dialogHelpEl.showModal();
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
      }
    } else if (e.code === "Escape" && document.activeElement.id === DIALOG_ID) {
      dialogHelpEl.close();
    }
  }
}

if (window.location.hostname.endsWith("instructure.com")) {
  window.addEventListener("keydown", shortcutListener);
} else {
  window.removeEventListener("keydown", shortcutListener);
}
