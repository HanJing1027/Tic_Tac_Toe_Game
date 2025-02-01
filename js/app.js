const selectBox = document.querySelector(".select-box");
const selectXBtn = selectBox.querySelector(".playerX");
const selectYBtn = selectBox.querySelector(".playerO");
const playBoard = document.querySelector(".play-board");

const hiddenBox = () => {
  selectBox.classList.add("hidden");
  setTimeout(() => {
    playBoard.classList.add("show");
  }, 200);
};

selectXBtn.addEventListener("click", hiddenBox);
selectYBtn.addEventListener("click", hiddenBox);
