import { ComponentStory, ComponentMeta } from "@storybook/react";
import { GlassWidget } from "../components/GlassWidget";
import { Glass } from "../lib/Glass";
import { SimEngine } from "../lib/SimEngine";
import { Stage, Layer } from "react-konva";

const engine = new SimEngine();
const root: Glass = engine.getGlass();
root.pour({ volume: 250, id: 0 });

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Glass",
  component: GlassWidget,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    glass: {
      name: "glass",
      defaultValue: root,
      description: "This is the Glass abstraction used for rendering.",
      control: {
        type: null,
      },
    },
    onSelect: {
      name: "onSelect",
      defaultValue: () => {},
      description: "This is triggered when the the glass icon is selected.",
      control: {
        type: null,
      },
    },
  },
} as ComponentMeta<typeof GlassWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GlassWidget> = (args) => (
  <Stage width={500} height={500}>
    <Layer>
      <GlassWidget {...args} />
    </Layer>
  </Stage>
);

export const Unselected = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Unselected.args = {
  x: 20,
  y: 20,
  height: 50,
  width: 30,
  fontSize: 8,
  isSelected: false,
};

export const Selected = Template.bind({});
Selected.args = {
  x: 20,
  y: 20,
  height: 50,
  width: 30,
  fontSize: 8,
  isSelected: true,
};
