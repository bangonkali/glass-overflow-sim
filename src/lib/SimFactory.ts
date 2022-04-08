import { Glass } from "./Glass";
import { GlassAddress } from "./GlassAddress";

export class SimFactory {
  public levels: number[] = [];

  public glassesCounter = 0;

  public glasses: { [level: number]: Glass[] } = [];

  public entities: Glass[] = [];

  private getInstanceNumber() {
    const currentInstance = this.glassesCounter;
    this.glassesCounter++;
    return currentInstance;
  }

  public getMaxLevel() {
    return Math.max(...this.levels);
  }

  public getTotalVolume() {
    return this.entities
      .map((glass) => glass.getTotalContent())
      .reduce((p, c) => p + c, 0);
  }

  public getVolumePerLevel() {
    return this.levels.map((level) => {
      const levelTotal = this.glasses[level]
        .map((glass) => glass.getTotalContent())
        .reduce((p, c) => p + c, 0);
      return {
        level: level,
        total: levelTotal,
      };
    });
  }

  public refine() {
    for (let i = 0; i < this.getMaxLevel() + 1; i++) {
      for (let j = 0; j < i + 1; j++) {
        this.createOrInitGlass(i, j, 250);
      }
    }
  }

  public getGlassByAddress(address: GlassAddress): Glass | undefined {
    return this.glasses[address.level][address.levelIndex];
  }

  public getGlass(
    parent: Glass | undefined = undefined,
    maxCapacity = 250,
    isLeftOrRoot = true
  ): Glass {
    let levelIndex = 0;
    let level = 0;

    if (parent !== undefined) {
      level = parent.level + 1;
    }

    if (isLeftOrRoot) {
      levelIndex = parent?.levelIndex ? parent?.levelIndex : 0;
    } else {
      levelIndex = parent?.levelIndex ? parent?.levelIndex + 1 : 1;
    }

    // find glass or else create
    return this.createOrInitGlass(level, levelIndex, maxCapacity);
  }

  private createOrInitGlass(
    level: number,
    levelIndex: number,
    max_capacity: number
  ) {
    if (this.glasses[level] === undefined) {
      this.glasses[level] = [];
    }

    // push all the different levels
    if (this.glasses[level].length === 0) {
      this.levels.push(level);
    }

    let glass = this.glasses[level][levelIndex];
    if (glass) {
      return glass;
    } else {
      glass = new Glass(
        level,
        levelIndex,
        max_capacity,
        this.getInstanceNumber(),
        this
      );
      this.glasses[level][levelIndex] = glass;
      this.entities.push(glass);
    }

    return glass;
  }
}
