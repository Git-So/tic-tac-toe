import Basic from "./basic";
import Game from "./game";

export default class Data extends Basic {
  private static _instance: Data;
  static getInstance(game: Game): Data {
    if (!this._instance) this._instance = new Data(game);
    return this._instance;
  }

  // 胜利棋子布局集合
  WinChessArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // 获取当前棋局数据
  getChessRecord(): string {
    let record = "";
    for (let el of this.UI.cellArrEl) {
      if (el.childElementCount < 1) {
        record += "N";
        continue;
      }
      let icon_name = (el.childNodes[0] as Element).getAttribute("name");
      record += icon_name == "true" ? "T" : "F";
    }
    return record;
  }

  // 游戏是否获胜
  isWin(): Boolean {
    let chess_arr = this.getChessRecord().split("");
    for (let keys of this.WinChessArr) {
      if (
        chess_arr[keys[0]] != "N" &&
        chess_arr[keys[0]] == chess_arr[keys[1]] &&
        chess_arr[keys[0]] == chess_arr[keys[2]]
      )
        return true;
    }
    return false;
  }

  //  游戏是否结束
  isOver(): Boolean {
    for (let el of this.UI.cellArrEl) {
      if (!el.innerHTML) return false;
    }
    return true;
  }
}
