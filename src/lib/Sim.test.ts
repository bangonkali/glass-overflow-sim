import { Glass } from "./Glass";
import { Portion } from "./Portion";
import { SimEngine } from "./SimEngine";

it("initialization creates 1 glass", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();

  expect(engine.entities.length).toBe(1);
  expect(engine.getInstanceNumber()).toBe(1);
  expect(engine.getMaxLevel()).toBe(0);
  expect(engine.getTotalVolume()).toBe(0);
  expect(root.left).toBe(undefined);
  expect(root.right).toBe(undefined);
});

it("pouring 250 creates 1 full glass and prepare next level glasses", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour(new Portion(250, 0));

  expect(engine.entities.length).toBe(3);
  expect(engine.getInstanceNumber()).toBe(3);
  expect(engine.getMaxLevel()).toBe(1);
  expect(engine.getTotalVolume()).toBe(250);
  expect(root.getTotalContent()).toBe(250);
  expect(root.left?.getTotalContent()).toBe(0);
  expect(root.right?.getTotalContent()).toBe(0);
});

it("pouring 750 creates 3 full glass and prepare next level glasses", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour(new Portion(750, 0));

  expect(engine.entities.length).toBe(6);
  expect(engine.getTotalVolume()).toBe(750);
  expect(root.getTotalContent()).toBe(250);
  expect(root.left?.getTotalContent()).toBe(250);
  expect(root.right?.getTotalContent()).toBe(250);
});

it("pouring 750 sets 250 on level 0 and 500 on level 1", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour(new Portion(750, 0));
  const vpl = engine.getVolumePerLevel();

  expect(vpl[0].total).toBe(250);
  expect(vpl[1].total).toBe(500);
  expect(vpl[2].total).toBe(0);
});

it("get glass by address @ 750", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour(new Portion(750, 0));
  const glass1 = engine.getGlassByAddress({ level: 0, levelIndex: 0 });
  const glass2 = engine.getGlassByAddress({ level: 1, levelIndex: 0 });
  const glass3 = engine.getGlassByAddress({ level: 1, levelIndex: 1 });
  const glass4 = engine.getGlassByAddress({ level: 1, levelIndex: 2 });

  expect(glass1?.getTotalContent()).toBe(250);
  expect(glass2?.getTotalContent()).toBe(250);
  expect(glass3?.getTotalContent()).toBe(250);
  expect(glass4?.getTotalContent()).toBe(undefined);
});

it("get glass by address @ 1000", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour(new Portion(1000, 0));
  const glass1 = engine.getGlassByAddress({ level: 0, levelIndex: 0 });
  const glass2 = engine.getGlassByAddress({ level: 1, levelIndex: 0 });
  const glass3 = engine.getGlassByAddress({ level: 1, levelIndex: 1 });
  const glass4 = engine.getGlassByAddress({ level: 2, levelIndex: 0 });
  const glass5 = engine.getGlassByAddress({ level: 2, levelIndex: 1 });
  const glass6 = engine.getGlassByAddress({ level: 2, levelIndex: 2 });

  expect(glass1?.getTotalContent()).toBe(250);
  expect(glass2?.getTotalContent()).toBe(250);
  expect(glass3?.getTotalContent()).toBe(250);
  expect(glass4?.getTotalContent()).toBe(62.5);
  expect(glass5?.getTotalContent()).toBe(125);
  expect(glass6?.getTotalContent()).toBe(62.5);
});

it("glass with multiple portions can sum total", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  glass.pour(new Portion(10, 0));
  glass.pour(new Portion(10, 1));
  glass.pour(new Portion(10, 2));
  expect(glass.getTotalContent()).toBe(30);
});

it("glass naming", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.getName()).toBe(`L: 0 LI: 0 INST: 0 `);
});

it("glass is 0,0", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 0, levelIndex: 0 })).toBe(true);
});

it("glass is not - level not the same", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 1, levelIndex: 0 })).toBe(false);
});

it("glass is not - index not the same", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 0, levelIndex: 1 })).toBe(false);
});
