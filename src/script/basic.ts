import Game from "./game";

export default class Basic {
  protected constructor(private game: Game) {}

  protected get AI() {
    return this.game.AI;
  }

  protected get Config() {
    return this.game.Config;
  }

  protected get Data() {
    return this.game.Data;
  }

  protected get Event() {
    return this.game.Event;
  }

  protected get UI() {
    return this.game.UI;
  }
}
