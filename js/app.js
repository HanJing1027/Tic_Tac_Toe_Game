const selectBox = document.querySelector(".select-box");
const selectXBtn = selectBox.querySelector(".playerX");
const selectOBtn = selectBox.querySelector(".playerO");

const difficultyBox = document.querySelector(".difficulty-box");
const easyBtn = document.querySelector(".easy");
const hardBtn = document.querySelector(".hard");

const playBoard = document.querySelector(".play-board");
const players = document.querySelector(".players");
const allBox = document.querySelectorAll(".play-area section span");

const resultBox = document.querySelector(".result-box");
const resultText = document.querySelector(".won-text");
const wonText = document.querySelector(".won-text span");
const closeBtn = document.querySelector(".result-box button");

document.addEventListener("DOMContentLoaded", () => {
  // X & O
  let playerXIcon = "fa-solid fa-xmark";
  let playerOIcon = "fa-solid fa-o";

  // 追蹤是否為玩家回合
  let isPlayerTurn = true;

  // 難易度
  let isHard;

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

  // Player 點擊判斷
  const clickedBox = (elem) => {
    // 若不是玩家回合，則不執行 and 避免bot已選格子遭到玩家覆蓋
    if (!isPlayerTurn || elem.innerHTML != "") return;
    // 變更為 bot 回合
    isPlayerTurn = false;

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
    if (!isHard) {
      setTimeout(bot, 500);
    } else {
      setTimeout(hardBot, 500);
    }
  };

  // Hard Bot 點擊判斷
  const hardBot = () => {
    // 確保是 bot 的回合
    if (isPlayerTurn) return;

    // 檢查遊戲是否已經結束
    if (checkWinner()) return;

    // 若玩家是 O，則 bot 選擇 X，反之亦然 = 取得bot當前使用的符號
    let botSymbol = players.classList.contains("player")
      ? playerXIcon
      : playerOIcon;

    // 若bot是 X，則 玩家等於選擇 O，反之亦然 = 取得玩家當前使用的符號
    let playerSymbol = botSymbol == playerXIcon ? playerOIcon : playerXIcon;

    // 優先檢查能獲勝的一步
    let botMove = findBestMove(botSymbol) || findBestMove(playerSymbol);
    // 如果返回null 沒有最佳步驟
    if (!botMove) {
      // 當沒有最優先步驟優先考慮中間空格
      if (allBox[4].innerHTML == "") {
        botMove = allBox[4];
      } else {
        // 若中間已有則選擇隨機格子則隨機選擇可用的格子
        let availableBoxes = [...allBox].filter((box) => box.innerHTML == "");
        botMove =
          availableBoxes.length > 0
            ? availableBoxes[Math.floor(Math.random() * availableBoxes.length)]
            : null;
      }
    }

    // 當找到步驟，執行bot的移動
    if (botMove) {
      // bot 出手
      botMove.innerHTML = `<i class="${botSymbol}"></i>`;
      // 避免重複點擊
      botMove.style.pointerEvents = "none";
    }

    // 切換回玩家顯示
    players.classList.toggle("active");

    // 檢查勝利後再切換回玩家回合
    if (!checkWinner()) {
      isPlayerTurn = true;
    }
  };

  // 找出最佳移動（獲勝或阻止玩家獲勝）
  const findBestMove = (symbol) => {
    for (let condition of winCondition) {
      // 解構出3個索引
      const [a, b, c] = condition;
      // 取得對應的棋盤內容
      const values = [
        allBox[a].innerHTML,
        allBox[b].innerHTML,
        allBox[c].innerHTML,
      ];

      // 檢查是否有2格是相同符號，並且1格是空的
      if (
        values.filter((v) => v.includes(symbol)).length == 2 &&
        values.includes("")
      ) {
        // 找出可選擇的空格
        const emptyIndex = condition.find(
          (index) => allBox[index].innerHTML == ""
        );
        // 返回可選擇的空格
        return allBox[emptyIndex];
      }
    }

    // 如果沒有找到最佳步驟
    return null;
  };

  // Easy Bot 點擊判斷
  const bot = () => {
    // 確保是 bot 的回合
    if (isPlayerTurn) return;

    // 檢查遊戲是否已經結束
    if (checkWinner()) return;

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
    // bot 出手
    randomBox.innerHTML = `<i class="${botIcon}"></i>`;

    // 切換回玩家顯示
    players.classList.toggle("active");

    // 檢查勝利後再切換回玩家回合
    if (!checkWinner()) {
      isPlayerTurn = true;
    }
  };

  // 勝利判斷
  // 勝利判斷
  const checkWinner = () => {
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

      // 檢查是否三個格子都有內容且都是相同符號
      if (values[0] && values[1] && values[2]) {
        // 檢查是否都包含相同的 icon class
        const hasXmark = (html) => html.includes("fa-xmark");
        const hasO = (html) => html.includes("fa-o");

        // 檢查三個位置是否都是 X 或都是 O
        if (
          (hasXmark(values[0]) && hasXmark(values[1]) && hasXmark(values[2])) ||
          (hasO(values[0]) && hasO(values[1]) && hasO(values[2]))
        ) {
          setTimeout(() => {
            // 顯示遊戲結果
            resultBox.classList.add("show");
            wonText.innerHTML = values[0];
          }, 500);
          isPlayerTurn = false;
          return true;
        }
      }
    }

    // 平局(無人勝利)
    // 檢查是否為平局 回傳 false or ture
    let isDraw = [...allBox].every((box) => box.innerHTML != "");
    if (isDraw) {
      setTimeout(() => {
        resultBox.classList.add("show");
        resultText.innerHTML = "Draw!";
        resultText.style.color = "#7DA0CA";
      }, 500);
      isPlayerTurn = false; // 遊戲結束時鎖定回合
      return true;
    }
    return false;
  };

  // 對每個遊戲格子 新增一個 點擊事件
  allBox.forEach((box) => box.addEventListener("click", () => clickedBox(box)));

  // 玩家選擇 X 或 O
  selectXBtn.addEventListener("click", () => {
    // 確保是玩家回合
    isPlayerTurn = true;
    selectBox.classList.add("hidden");
    setTimeout(() => {
      difficultyBox.classList.add("show"); // 顯示難度選擇框
    }, 200);
  });

  selectOBtn.addEventListener("click", () => {
    // 確保是玩家的回合
    isPlayerTurn = true;
    selectBox.classList.add("hidden");
    setTimeout(() => {
      difficultyBox.classList.add("show"); // 顯示難度選擇框
    }, 200);
    players.classList.add("active", "player");
  });

  // 隨後玩家選擇難度，按下難度按鈕
  easyBtn.addEventListener("click", () => {
    isHard = false;

    allBox.forEach((box) => {
      // 重新啟用點擊
      box.style.pointerEvents = "auto";
    });

    difficultyBox.classList.remove("show"); // 隱藏難度框
    setTimeout(() => {
      playBoard.classList.add("show"); // 顯示遊戲板
    }, 200);
  });

  hardBtn.addEventListener("click", () => {
    isHard = true;

    allBox.forEach((box) => {
      // 重新啟用點擊
      box.style.pointerEvents = "auto";
    });

    difficultyBox.classList.remove("show"); // 隱藏難度框
    setTimeout(() => {
      playBoard.classList.add("show"); // 顯示遊戲板
    }, 200);
  });

  // 重置遊戲函數
  const resetGame = () => {
    // 隱藏結果框
    resultBox.classList.remove("show");

    // 清空所有格子
    allBox.forEach((box) => {
      box.innerHTML = "";
      box.style.pointerEvents = "auto"; // 重新啟用點擊
    });

    // 重置玩家回合
    isPlayerTurn = true;

    // 重置玩家顯示狀態
    players.classList.remove("active");

    // 隱藏遊戲板
    playBoard.classList.remove("show");

    // 重置並顯示選擇框
    selectBox.classList.remove("hidden");

    // 隱藏難度選擇框
    difficultyBox.classList.remove("show");

    // 重置玩家選擇狀態
    players.classList.remove("player");

    // 重置結果文字顏色
    resultText.style.color = "";
  };

  // 關閉result畫面
  closeBtn.addEventListener("click", resetGame);

  // debug
  const debugGameState = () => {
    console.log({
      isPlayerTurn,
      isHard,
      playerState: players.classList.contains("player"),
      activeState: players.classList.contains("active"),
      availableBoxes: [...allBox].filter((box) => box.innerHTML === "").length,
    });
  };
});
