import { parseAtts } from "./util";

test("should parse atts safely", () => {
  const MockDataset = {
    dataset: {
      prefectureLabel: '"></label><script>alert(1)</script>',
    },
  };
  const atts = parseAtts(MockDataset as any);
  expect(atts.prefectureLabel).not.toContain("<script>");
});
