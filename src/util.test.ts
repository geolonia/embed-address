import { parseAtts, parseApiKey } from "./util";
import { JSDOM } from "jsdom";

test("should parse atts safely", () => {
  const MockElement = ({
    dataset: {
      prefectureName: '"></input><script>alert(1)</script>',
    },
  } as unknown) as HTMLElement;
  const atts = parseAtts(MockElement);
  expect(atts.prefectureName).not.toContain("<script>");
});

describe("parse api key from dom", () => {
  it("should parse with geolonia flag", () => {
    const { document: mocDocument } = new JSDOM(`<html><body>
      <script src="https://external.example.com/?geolonia-api-key=abc"></script>
    </body></html>`).window;

    const { apiKey, stage } = parseApiKey(mocDocument);
    expect(apiKey).toBe("abc");
    expect(stage).toBe("dev");
  });

  it('should be "YOUR-API-KEY" and "dev"', () => {
    const { document: mocDocument } = new JSDOM(`<html><body>
      <script src="https://external.example.com/jquery.js"></script>
      <script type="text/javascript" src="https://api.geolonia.com/dev/embed-address?geolonia-api-key=YOUR-API-KEY"></script>
    </body></html>`).window;

    const { apiKey, stage } = parseApiKey(mocDocument);
    expect(apiKey).toBe("YOUR-API-KEY");
    expect(stage).toBe("dev");
  });

  it('should be "YOUR-API-KEY" and "v1"', () => {
    const { document: mocDocument } = new JSDOM(`<html><body>
      <script src="https://external.example.com/jquery.js"></script>
      <script type="text/javascript" src="https://api.geolonia.com/v1/embed-address?geolonia-api-key=YOUR-API-KEY"></script>
    </body></html>`).window;

    const { apiKey, stage } = parseApiKey(mocDocument);
    expect(apiKey).toBe("YOUR-API-KEY");
    expect(stage).toBe("v1");
  });

  it('should be "YOUR-API-KEY" and "v123.4"', () => {
    const { document: mocDocument } = new JSDOM(`<html><body>
      <script src="https://external.example.com/jquery.js"></script>
      <script type="text/javascript" src="https://api.geolonia.com/v123.4/embed-address?geolonia-api-key=YOUR-API-KEY"></script>
    </body></html>`).window;

    const { apiKey, stage } = parseApiKey(mocDocument);
    expect(apiKey).toBe("YOUR-API-KEY");
    expect(stage).toBe("v123.4");
  });
});
