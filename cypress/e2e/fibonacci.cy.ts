import {
  INPUT_TESTID,
  SUBMIT_TESTID,
  CIRCLE_TESTID,
} from "../../src/components/fibonacci-page/constants";
import {
  getFibonacciNumbers,
} from "../../src/components/fibonacci-page/fibonacci";
import { LETTER, qTestId } from "./helpers";


const INPUT_NUMBER = 10;
const numbers = getFibonacciNumbers(INPUT_NUMBER);

describe("fibonacci page", () => {
  beforeEach(() => {
    cy.visit("fibonacci");
  });

  it("should be disabled button when there is no text", () => {
    cy.get(qTestId(SUBMIT_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
  });

  it("should animate correctly", () => {
    cy.get(qTestId(INPUT_TESTID)).type(INPUT_NUMBER.toString());
    cy.get(qTestId(SUBMIT_TESTID)).click();

    for (let i = 0; i < INPUT_NUMBER + 1; i += 1) {
      cy.get(qTestId(CIRCLE_TESTID))
        .eq(i)
        .find(LETTER)
        .then((p) => {
          const n = p.text();

          if (i === 0 || i === 1) {
            expect(n, "text").to.equal("1");
          } else {
            expect(n, "text").to.equal(String(numbers[i]));
          }
        });
    }
    cy.wait(500);
  });
});
