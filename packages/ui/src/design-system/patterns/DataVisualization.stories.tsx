import type { Meta, StoryObj } from "@storybook/react";

import { BarChart } from "@/components/BarChart";
import { PieChart } from "@/components/PieChart";
import { SquarePlot } from "@/components/SquarePlot";
import { Canvas, Frame, FrameRow } from "@/design-system/_canvas";

import { ScreenHeading } from "./_helpers";

// Deterministic, realistic data so the page looks the same on every load.
const days = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(Date.UTC(2025, 8, 1 + i));
  return date.toISOString().split("T")[0];
});
const dailyDonations = [
  4200, 6100, 5400, 7900, 9300, 8800, 6400, 5900, 7200, 10400, 12800, 11900, 14600, 18200,
];
const dailyMatching = dailyDonations.map((value, i) => Math.round(value * (0.42 + (i % 4) * 0.04)));

const fundingByCategory = [
  { name: "Developer tooling", value: 182000 },
  { name: "Infrastructure", value: 146000 },
  { name: "Education", value: 64000 },
  { name: "Climate", value: 48000 },
  { name: "Community", value: 37000 },
  { name: "Research", value: 23000 },
];

const topProjects = [
  { label: "Ethers.js", value: 48200 },
  { label: "Protocol Guild", value: 41900 },
  { label: "L2BEAT", value: 33600 },
  { label: "Hypercerts", value: 27400 },
  { label: "Foundry", value: 22100 },
  { label: "Giveth", value: 17800 },
  { label: "Viem", value: 14300 },
  { label: "Snapshot", value: 9600 },
];

const meta = {
  title: "Design System/Patterns & Screens/Data Visualization",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

export const DataVisualization: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Patterns & Screens"
      title="Data Visualization"
      description="Charts used in round reports and results pages: daily activity over time, how funding splits across categories, and how the matching pool is distributed across projects."
    >
      <FrameRow>
        <Frame name="Round report / Overview" meta="Desktop · 1440" width={1440} bleed>
          <div className="flex flex-col gap-10 px-[120px] py-14">
            <ScreenHeading
              title="GG24: Open Source Software — results"
              description="$500,000 matching pool · 148 projects · 12,904 unique donors"
            />
            <div className="grid grid-cols-[1fr_auto] items-start gap-8">
              <BarChart
                width={680}
                data={[
                  { name: "Donations", x: days, y: dailyDonations, color: "#25BDCE" },
                  { name: "Matching", x: days, y: dailyMatching, color: "#645AD8" },
                ]}
                title="Daily donations"
                description="Crowdfunded donations and estimated matching, in USD"
                xAxisTitle="Date"
                yAxisTitle="USD"
                isDateAxis
              />
              <PieChart
                width={480}
                height={420}
                data={fundingByCategory}
                title="Funding by category"
                description="Share of the matching pool, in USD"
                total="$500k"
                totalLabel="Pool"
              />
            </div>
          </div>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Bar chart · categorical" meta="Component" width={840}>
          <BarChart
            width={740}
            data={[
              { name: "2024", x: ["Q1", "Q2", "Q3", "Q4"], y: [124000, 151000, 98000, 212000] },
              {
                name: "2025",
                x: ["Q1", "Q2", "Q3", "Q4"],
                y: [168000, 194000, 143000, 260000],
                color: "#FF7043",
              },
            ]}
            title="Quarterly donations"
            description="Total donated per quarter, year over year"
            xAxisTitle="Quarter"
            yAxisTitle="USD"
          />
        </Frame>
        <Frame name="Pie chart · donut" meta="Component" width={560}>
          <PieChart
            width={460}
            data={[
              { name: "Ethereum", value: 41 },
              { name: "Optimism", value: 23 },
              { name: "Arbitrum", value: 18 },
              { name: "Base", value: 12 },
              { name: "Polygon", value: 6 },
            ]}
            title="Donations by network"
            description="Share of donations, %"
            total="12.9k"
            totalLabel="Donors"
          />
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Square plot · matching distribution" meta="Component" width={1100}>
          <div className="flex flex-col gap-6">
            <ScreenHeading
              title="Matching distribution"
              description="Each square is proportional to the matching funds a project received."
            />
            <SquarePlot
              width={1000}
              values={topProjects.map((project) => project.value)}
              labels={topProjects.map((project) => project.label)}
            />
          </div>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
