import type { Meta, StoryObj } from "@storybook/nextjs";
import { Sidebar } from "./sidebar";

// Define the props type for your Sidebar component
type SidebarProps = {
  isDesktop?: boolean;
  isSidebarOpen?: boolean;
  // Add any other props your Sidebar component accepts
};

const meta: Meta<typeof Sidebar> = {
  title: "UI/Organisms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen", // Sidebar typically takes full height
  },
  tags: ["autodocs"],
  render: (args: SidebarProps) => {
    return (
      <Sidebar
        {...args}
        // Pass any additional props your component needs
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isDesktop: true,
    isSidebarOpen: true, // Assume open for demonstration
  },
};

export const MobileView: Story = {
  args: {
    isDesktop: false,
    isSidebarOpen: true, // Assume open for demonstration
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1", // Simulate mobile viewport
    },
  },
};