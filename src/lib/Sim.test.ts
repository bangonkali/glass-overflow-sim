import { Glass } from "./Glass";
import { SimEngine } from "./SimEngine";
import { Sim } from "./Sim";

it("initialize sim creates engine and root", () => {
  const sim = new Sim();

  expect(sim.engine.entities.length).toBe(1);
  expect(sim.engine.getInstanceNumber()).toBe(1);
  expect(sim.engine.getMaxLevel()).toBe(0);
  expect(sim.engine.getTotalVolume()).toBe(0);
  expect(sim.root.left).toBe(undefined);
  expect(sim.root.right).toBe(undefined);
});

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
  root.pour({ volume: 250, id: 0 });

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
  root.pour({ volume: 750, id: 0 });

  expect(engine.entities.length).toBe(6);
  expect(engine.getTotalVolume()).toBe(750);
  expect(root.getTotalContent()).toBe(250);
  expect(root.left?.getTotalContent()).toBe(250);
  expect(root.right?.getTotalContent()).toBe(250);
});

it("pouring 750 sets 250 on level 0 and 500 on level 1", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour({ volume: 750, id: 0 });
  const vpl = engine.getVolumePerLevel();

  expect(vpl[0].total).toBe(250);
  expect(vpl[1].total).toBe(500);
  expect(vpl[2].total).toBe(0);
});

it("get glass by address @ 750", () => {
  const engine = new SimEngine();
  const root: Glass = engine.getGlass();
  root.pour({ volume: 750, id: 0 });
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
  root.pour({ volume: 1000, id: 0 });
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
  glass.pour({ volume: 10, id: 0 });
  glass.pour({ volume: 10, id: 1 });
  glass.pour({ volume: 10, id: 2 });
  expect(glass.getTotalContent()).toBe(30);
});

it("glass naming", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.getName()).toBe(`L: 0 LI: 0 INST: 0 `);
});

it("glass 0,0 is addressable 0,0 expect true", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 0, levelIndex: 0 })).toBe(true);
});

it("glass 0,0 is not addressable 0,1 expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 0, levelIndex: 1 })).toBe(false);
});

it("glass 0,0 is not addressable by undefined expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is(undefined)).toBe(false);
});

it("glass level not the same expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 1, levelIndex: 0 })).toBe(false);
});

it("glass index not the same expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 0, levelIndex: 1 })).toBe(false);
});

it("glass level too high expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 1000000, levelIndex: 1 })).toBe(false);
});

it("glass index too high expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 0, levelIndex: 1000000 })).toBe(false);
});

it("glass index and level too high expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 1000000, levelIndex: 1000000 })).toBe(false);
});

it("glass glass level negative expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: -1000000, levelIndex: 1000000 })).toBe(false);
});

it("glass level and index negative expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: -1000000, levelIndex: -1000000 })).toBe(false);
});

it("glass index negative expect false", () => {
  const glass = new Glass(0, 0, 250, 0, new SimEngine());
  expect(glass.is({ level: 1000000, levelIndex: -1000000 })).toBe(false);
});
