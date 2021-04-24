import Basic from "./basic";
import Game from "./game";

export default class AI extends Basic {
  private static _instance: AI;
  static getInstance(game: Game): AI {
    if (!this._instance) this._instance = new AI(game);
    return this._instance;
  }

  // 获取不同棋子布局分数
  getChessScore(chess: string): number {
    // 简化布局种类
    let chess_num = 0;
    chess.split("").forEach((status) => {
      chess_num += status == "T" ? 4 : status == "F" ? 1 : 0;
    });

    // 不同布局不同分数
    switch (chess_num) {
      case 0:
        return 20;
      case 1:
        return 50;
      case 2:
        return 1000;
      case 4:
        return 50;
      case 5:
        return 10;
      case 8:
        return 500;
    }
    return 0;
  }

  // 获取最优落子元素
  getMaxScoreElement(): Element {
    let record = this.Data.getChessRecord().split("");
    let score_map = new Map();
    let max_score = 0;
    let max_score_key = 0;
    // 活子评分
    this.Data.WinChessArr.forEach((keys) => {
      // 当前布局分数
      let score = this.getChessScore(
        record[keys[0]] + record[keys[1]] + record[keys[2]]
      );

      // 预选落子添加分数
      keys.forEach((key) => {
        if (record[key] != "N") return;
        if (!score_map.has(key)) score_map.set(key, 0);
        score_map.set(key, score_map.get(key) + score);
      });
    });

    // 获取最大分数
    score_map.forEach((score, key) => {
      if (max_score <= score) {
        max_score = score;
        max_score_key = key;
      }
    });
    return this.UI.cellArrEl[max_score_key];
  }

  //  落子
  play() {
    this.Config.setBool(this.Config.KEY_IS_LOCK, true); // 锁定落子
    this.UI.play(this.getMaxScoreElement()); // 落子
    this.Config.setBool(this.Config.KEY_IS_LOCK, false); // 解锁落子
  }
}
