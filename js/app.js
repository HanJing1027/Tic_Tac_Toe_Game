const selectBox = document.querySelector(".select-box");
const selectXBtn = selectBox.querySelector(".playerX");
const selectOBtn = selectBox.querySelector(".playerO");
const playBoard = document.querySelector(".play-board");

const players = document.querySelector(".players");
const allBox = document.querySelectorAll(".play-area section span");

document.addEventListener("DOMContentLoaded", () => {
  // X & O
  let playerXIcon = "fa-solid fa-xmark";
  let playerOIcon = "fa-solid fa-o";
  // 追蹤是否為玩家回合
  let isPlayerTure = true;

  // Player 點擊判斷
  const clickedBox = (elem) => {
    // 若不是玩家回合，則不執行
    if (!isPlayerTure) return;
    // 變更為 bot 回合
    isPlayerTure = false;

    if (players.classList.contains("player")) {
      elem.innerHTML = `<i class="${playerOIcon}"></i>`;
    } else {
      elem.innerHTML = `<i class="${playerXIcon}"></i>`;
    }
    // 切換玩家順序顯示
    players.classList.toggle("active");
    // 避免連點
    elem.style.pointerEvents = "none";

    // 檢查是否獲勝 並 return 避免bot再次出手
    if (checkWinner()) return;

    // 延遲.5秒後bot出手
    setTimeout(bot, 500);
  };

  // Bot 點擊判斷
  const bot = () => {
    // 塞選出box當中innerHTML為空的元素並做出選擇
    let availableBoxes = [...allBox].filter((box) => box.innerHTML == "");
    let randomBox =
      availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
    // 沒有可選格子時直接 return
    if (randomBox.length == 0) return;

    // 若玩家是 O，則 bot 選擇 X，反之亦然
    let botIcon = players.classList.contains("player")
      ? playerXIcon
      : playerOIcon;
    randomBox.innerHTML = `<i class="${botIcon}"></i>`;

    // 切換回玩家顯示
    players.classList.toggle("active");

    // 檢查是否獲勝
    checkWinner();

    // 還原為玩家回合
    isPlayerTure = true;
  };

  // 勝利判斷
  const checkWinner = () => {
    // 勝利條件(橫向、值像、斜向)
    const winCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  };

  // 判斷每一種勝利條件
  for (let condition of winCondition) {
    // 解構出3個索引
    const [a, b, c] = condition;
    // 取得對應的棋盤內容
    const values = [
      allBox[a].innerHTML,
      allBox[b].innerHTML,
      allBox[c].innerHTML,
    ];
    // 檢查是否三個格子都有相同的值(O or X)
    // 若某一條線上的所有格子都被同一玩家填滿，則該玩家獲勝
    if (values[0] && values[0] == values[1] && values[0] == values[2]) {
      setTimeout(() => {
        // 勝利結果
      }, 500);
    }
  }

  // 對每個遊戲格子 新增一個 點擊事件
  allBox.forEach((box) => box.addEventListener("click", () => clickedBox(box)));

  // 玩家選擇
  selectXBtn.addEventListener("click", () => {
    selectBox.classList.add("hidden");
    setTimeout(() => {
      playBoard.classList.add("show");
    }, 200);
  });

  selectOBtn.addEventListener("click", () => {
    selectBox.classList.add("hidden");
    setTimeout(() => {
      playBoard.classList.add("show");
    }, 200);
    players.classList.add("active", "player");
  });
});
