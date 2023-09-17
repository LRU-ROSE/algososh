import {
  INPUT_TESTID,
  SUBMIT_TESTID,
  CIRCLE_TESTID,
} from "../../src/components/string/constants";
import { ElementStates } from "../../src/types/element-states";
import { LETTER, qTestId } from "./helpers";

const CIRCLE_QUERY = qTestId(CIRCLE_TESTID);

const CHECK_TEXT = "hello";
const CHECK_TEXT_LENGTH = CHECK_TEXT.length;

describe("reverse string pages", () => {
  beforeEach(() => {
    cy.visit("recursion");
  });

  it("should be disabled button when there is no text", () => {
    cy.get(qTestId(SUBMIT_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
  });

  it("should animate correctly", () => {
    cy.get(qTestId(INPUT_TESTID)).type(CHECK_TEXT);
    cy.get(qTestId(SUBMIT_TESTID)).click();

    cy.get(CIRCLE_QUERY).as("circles");

    cy.get("@circles").should("have.length", CHECK_TEXT_LENGTH);

    for (let i = 0; i < Math.floor(CHECK_TEXT_LENGTH / 2); i += 1) {
      cy.get("@circles")
        .eq(i)
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Changing);
        });
      cy.get("@circles")
        .eq(CHECK_TEXT_LENGTH - i - 1)
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Changing);
        });

      if (i - 1 >= 0) {
        cy.get("@circles")
          .eq(i - 1)
          .should("have.attr", "class")
          .should(($class) => {
            expect($class).to.contain(ElementStates.Modified);
          });
        cy.get("@circles")
          .eq(CHECK_TEXT_LENGTH - i)
          .should("have.attr", "class")
          .should(($class) => {
            expect($class).to.contain(ElementStates.Modified);
          });

        cy.get("@circles")
          .eq(i - 1)
          .find(LETTER)
          .as("letter1")
          .should("have.text", CHECK_TEXT[CHECK_TEXT_LENGTH - i]);
        cy.get("@circles")
          .eq(CHECK_TEXT_LENGTH - i)
          .find(LETTER)
          .as("letter3")
          .should("have.text", CHECK_TEXT[i - 1]);
      }

      cy.get("@circles")
        .eq(i)
        .find(LETTER)
        .should("have.text", CHECK_TEXT[i]);
      cy.get("@circles")
        .eq(CHECK_TEXT_LENGTH - i - 1)
        .find(LETTER)
        .should("have.text", CHECK_TEXT[CHECK_TEXT_LENGTH - i - 1]);

      cy.wait(1000);
    }

    if (CHECK_TEXT_LENGTH % 2) {
      cy.get("@circles")
        .eq(Math.floor(CHECK_TEXT_LENGTH / 2))
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Modified);
        });
    }
  });
});
