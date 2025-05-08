/**
 * SpeedGrader: Use arrow keys to cycle through assignments
 */
if (
  window.location.hostname.endsWith("instructure.com") &&
  window.location.pathname.endsWith("gradebook/speed_grader")
) {
  const arrowLeftEl = document.querySelector(".icon-arrow-left.prev");
  const arrowRightEl = document.querySelector(".icon-arrow-right.next");
  window.onkeydown = (e) => {
    if (e.keyCode === 39) {
      arrowRightEl.click();
    } else if (e.keyCode === 37) {
      arrowLeftEl.click();
    }
  };
}
