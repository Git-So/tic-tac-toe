import Config from "./config";
import Data from "./data";
import UI from "./ui";
import Event from "./event";
import AI from "./ai";

export default class Game {
  get Config(): Config {
    return Config.getInstance();
  }

  get Data(): Data {
    return Data.getInstance(this);
  }

  get UI(): UI {
    return UI.getInstance(this);
  }

  get Event(): Event {
    return Event.getInstance(this);
  }

  get AI(): AI {
    return AI.getInstance(this);
  }

  run() {
    this.Event.register();
    this.UI.sync();
  }
}
