import React, { useRef, useState } from "react";
import {
  ITextFieldStyles,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import { SimWidget } from "../components/SimWidget";
import { IGlassAddress } from "../lib/IGlassAddress";
import { useStrictMode } from "react-konva";
import { Sim } from "../lib/Sim";
import { fmtNum } from "../utils/num";

const maxVolume = 20000;
const initialVolume = 1586;
const initialAddress: IGlassAddress = {
  level: 0,
  levelIndex: 0,
};
const textFieldThinStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {
    width: 40,
  },
};
const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {
    width: 60,
  },
};

export const HomePage: React.FC = () => {
  useStrictMode(true);

  const slider = useRef<HTMLInputElement>(null);

  const [waterVolumeText, setWaterVolumeText] = useState<string>(
    initialVolume.toString()
  );
  const [levelText, setLevelText] = useState("0");
  const [levelIndexText, setLevelIndexText] = useState("0");

  const [waterVolume, setWaterVolume] = useState(initialVolume);
  const [address, setAddress] = useState<IGlassAddress>(initialAddress);

  const sim = new Sim();
  sim.root.pour({ volume: waterVolume, id: 0 });
  const selectedGlass = address
    ? sim.engine.getGlassByAddress(address)
    : undefined;

  const selectedSummaryText = selectedGlass
    ? `Selected i${selectedGlass.level}:j${selectedGlass.levelIndex} = ${fmtNum(
        selectedGlass.getTotalContent()
      )}`
    : "";

  return (
    <Stack
      disableShrink
      tokens={{
        padding: 20,
      }}
    >
      <Stack.Item align="center">
        <Stack horizontal disableShrink>
          <Stack.Item>
            <TextField
              width={10}
              label="Volume: "
              value={waterVolumeText}
              underlined
              onChange={(e, v) => {
                if (v) {
                  setWaterVolumeText(v);
                }
              }}
              styles={textFieldStyles}
              maxLength={5}
            />
          </Stack.Item>

          <Stack.Item>
            <TextField
              label="Level: "
              value={levelText}
              underlined
              onChange={(e, v) => {
                if (v && !isNaN(Number(v))) {
                  setLevelText(v);
                }
              }}
              styles={textFieldThinStyles}
              maxLength={2}
            />
          </Stack.Item>

          <Stack.Item>
            <TextField
              label="Level Index: "
              value={levelIndexText}
              underlined
              onChange={(e, v) => {
                if (v && !isNaN(Number(v))) {
                  setLevelIndexText(v);
                }
              }}
              styles={textFieldThinStyles}
              maxLength={2}
            />
          </Stack.Item>

          <Stack.Item>
            <PrimaryButton
              text="Set"
              onClick={() => {
                let mVolume = Number(waterVolumeText);
                const mLevel = isNaN(Number(levelText)) ? 0 : Number(levelText);
                const mLevelIndex = isNaN(Number(levelIndexText))
                  ? 0
                  : Number(levelIndexText);

                if (!isNaN(mVolume)) {
                  if (mVolume > maxVolume) mVolume = maxVolume;
                  if (mVolume < 0) mVolume = 0;
                  setWaterVolume(mVolume);
                  setWaterVolumeText(mVolume.toString());
                  if (slider.current) {
                    const a = slider.current as HTMLInputElement;
                    a.value = mVolume.toString();
                  }
                  console.log(`Number ${mVolume}`);
                }

                setAddress({
                  level: mLevel,
                  levelIndex: mLevelIndex,
                });
                setLevelText(mLevel.toString());
                setLevelIndexText(mLevelIndex.toString());
              }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item align="center">
        <Stack horizontal>
          <Stack.Item>
            <input
              ref={slider}
              type="range"
              min={0}
              max={maxVolume}
              defaultValue={waterVolume}
              className="slider"
              onChange={(e) => {
                setWaterVolume(Number(e.target.value));
                setWaterVolumeText(e.target.value.toString());
              }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item align="center">
        <SimWidget
          x={0}
          y={0}
          volume={waterVolume}
          glassHeight={40}
          glassWidth={30}
          glasFontSize={8}
          glassHorizontalMargin={0}
          glassVerticalMargin={0}
          pyramidMarginLeft={50}
          selectedGlass={address}
          onSelectGlass={(a) => {
            setAddress(a);
            setLevelText(a.level.toString());
            setLevelIndexText(a.levelIndex.toString());
          }}
          sim={sim}
        />
      </Stack.Item>

      <Stack.Item align="center">
        {selectedGlass ? <p>{selectedSummaryText}</p> : undefined}
      </Stack.Item>
    </Stack>
  );
};
