
export default class Player {
  constructor() {
    this.health = null;
    this.hits = new Array();
    this.gameSessions = new Array();
    this.hitsPerSecond = new Array();
  }

  saveGameSessions(time, hits) {
    this.gameSessions.push({ time, hits, graphHits: this.hits });
  }

  playerHealthReset() {
    this.health = null;
  }

  init(gameMode) {
    if (gameMode === 'challenge') {
      this.health = 3;
    }
  }

  addHit(x, y, target) {
    this.hits.push({ x, y, target });
  }
}
