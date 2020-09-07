import { parseAtts } from "./util";

test("should parse atts safely", () => {
  const MockElement = ({
    dataset: {
      prefectureName: '"></input><script>alert(1)</script>',
    },
  } as unknown) as HTMLElement;
  const atts = parseAtts(MockElement);
  expect(atts.prefectureName).not.toContain("<script>");
});
