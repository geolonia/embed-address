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

// describe("parse api key from dom", () => {
//   it("should parse with geolonia flag", () => {
//     const { document: mocDocument } = new JSDOM(`<html><body>
//       <script src="https://external.example.com/?geolonia-api-key=abc"></script>
//     </body></html>`).window;

//     const params = parseApiKey(mocDocument);
//     expect("abc").toBe(params.key);
//     expect("v1").toBe(params.stage);
//   });

//   it("should parse with geolonia flag", () => {
//     const { document: mocDocument } = new JSDOM(`<html><body>
//       <script src="https://external.example.com/jquery.js"></script>
//       <script src="https://external.example.com/?geolonia-api-key=def"></script>
//     </body></html>`).window;

//     const params = parseApiKey(mocDocument);
//     expect("def").toBe(params.key);
//     expect("v1").toBe(params.stage);
//   });

//   it('should be "YOUR-API-KEY" and "dev"', () => {
//     const { document: mocDocument } = new JSDOM(`<html><body>
//       <script src="https://external.example.com/jquery.js"></script>
//       <script type="text/javascript" src="https://api.geolonia.com/dev/embed?geolonia-api-key=YOUR-API-KEY"></script>
//     </body></html>`).window;

//     const params = parseApiKey(mocDocument);
//     expect("YOUR-API-KEY").toBe(params.key);
//     expect("v1").toBe(params.stage);
//   });

//   it('should be "YOUR-API-KEY" and "v1"', () => {
//     const { document: mocDocument } = new JSDOM(`<html><body>
//       <script src="https://external.example.com/jquery.js"></script>
//       <script type="text/javascript" src="https://api.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY"></script>
//     </body></html>`).window;

//     const params = parseApiKey(mocDocument);
//     expect("YOUR-API-KEY").toBe(params.key);
//     expect("v1").toBe(params.stage);
//   });

//   it('should be "YOUR-API-KEY" and "v123.4"', () => {
//     const { document: mocDocument } = new JSDOM(`<html><body>
//       <script src="https://external.example.com/jquery.js"></script>
//       <script type="text/javascript" src="https://api.geolonia.com/v123.4/embed?geolonia-api-key=YOUR-API-KEY"></script>
//     </body></html>`).window;

//     const params = parseApiKey(mocDocument);
//     expect("YOUR-API-KEY").toBe(params.key);
//     expect("v123.4").toBe(params.stage);
//   });
// });
