import { Glass } from "./Glass";
import { IGlassAddress } from "./IGlassAddress";

/**
 * A simple simulation engine for the Glass Overflow.
 */
export class SimEngine {
  /**
   * The list of unique levels in the Sim.
   */
  public levels: number[] = [];

  /**
   * The Sim Level Glass counter so that each glass gets assigned a unique id.
   */
  public glassesCounter = 0;

  /**
   * A list of all glasses arrange in levels.
   */
  public glasses: { [level: number]: Glass[] } = [];

  /**
   * A list of all Glass entities in the simulation.
   */
  public entities: Glass[] = [];

  /**
   * This is for tracking all the instances of glasses.
   */
  public getInstanceNumber() {
    const currentInstance = this.glassesCounter;
    this.glassesCounter++;
    return currentInstance;
  }

  /**
   * Get the highest level in the stack of glasses.
   */
  public getMaxLevel() {
    return Math.max(...this.levels);
  }

  /**
   * Gets the total volume of content in the entire stack.
   */
  public getTotalVolume() {
    return this.entities
      .map((glass) => glass.getTotalContent())
      .reduce((p, c) => p + c, 0);
  }

  /**
   * Gets the volume per level.
   */
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

  /**
   * Returns the Glass object on a specific address. Otherwise returns undefined.
   * @param address
   */
  public getGlassByAddress(address: IGlassAddress): Glass | undefined {
    if (this.glasses[address.level])
      return this.glasses[address.level][address.levelIndex];
    return undefined;
  }

  /**
   * Returns the glass whether it needs to be created or if already exists.
   * @param parent The parent glass requiring the child. Undefined if root.
   * @param maxCapacity The maximum capacity of the glass, defaults to 250.
   * @param isLeftOrRoot Whether we are looking for the left child or right child glass.
   */
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

  /**
   * Prepares the entire level by prepping all glasses in that level.
   * @param level The level to prepare.
   * @private
   */
  private prepLevel(level: number) {
    if (this.glasses[level] === undefined) {
      this.levels.push(level);
      this.glasses[level] = [];
      for (let j = 0; j < level + 1; j++) {
        this.prepGlass(level, j, 250);
      }
    }
  }

  /**
   * Creates or initializes a glass of a particular level and index. Also creates
   * the level if it doesn't exist.
   * @param level
   * @param levelIndex
   * @param maxCapacity
   * @private
   */
  private createOrInitGlass(
    level: number,
    levelIndex: number,
    maxCapacity: number
  ) {
    this.prepLevel(level);
    return this.prepGlass(level, levelIndex, maxCapacity);
  }

  /**
   * Creates or initializes a glass of a particular level and index. Does not create the
   * level if it doesn't exist. Used in conjunction with `createOrInitGlass()`.
   * @param level
   * @param levelIndex
   * @param maxCapacity
   * @private
   */
  private prepGlass(level: number, levelIndex: number, maxCapacity: number) {
    let glass = this.glasses[level][levelIndex];
    if (glass) {
      return glass;
    } else {
      glass = new Glass(
        level,
        levelIndex,
        maxCapacity,
        this.getInstanceNumber(),
        this
      );
      this.glasses[level][levelIndex] = glass;
      this.entities.push(glass);
    }
    return glass;
  }
}
