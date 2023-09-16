import {
  INPUT_TESTID,
  SUBMIT_TESTID,
  CIRCLE_TESTID,
  CLEAR_TESTID,
  DELETE_TESTID,
} from "../../src/components/stack-page/constants";
import { ElementStates } from "../../src/types/element-states";
import { LETTER, qTestId } from "./helpers";

const CIRCLE_QUERY = qTestId(CIRCLE_TESTID);

const TEXT = "t";
const addedElements = 3;

describe("stack page", () => {
  beforeEach(() => {
    cy.visit("stack");
  });

  it("should be disabled button when there is no text", () => {
    cy.get(qTestId(SUBMIT_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(qTestId(CLEAR_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(qTestId(DELETE_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
  });

  it("should animate adding new element", () => {
    cy.get(qTestId(INPUT_TESTID)).type(TEXT);
    cy.get(qTestId(SUBMIT_TESTID)).click();

    cy.get(CIRCLE_QUERY).last().as("top");

    cy.get("@top").find(LETTER).should("have.text", TEXT);

    cy.get("@top")
      .should("have.attr", "class")
      .should(($class) => {
        expect($class).to.contain(ElementStates.Changing);
      });

    cy.wait(500);

    cy.get("@top")
      .should("have.attr", "class")
      .should(($class) => {
        expect($class).to.contain(ElementStates.Default);
      });
  });

  it("should delete element", () => {
    for (let i = 0; i < addedElements; i += 1) {
      cy.get(qTestId(INPUT_TESTID)).type(TEXT);
      cy.get(qTestId(SUBMIT_TESTID)).click();
    }

    cy.get(CIRCLE_QUERY)
      .should("have.length", addedElements);
    cy.get(qTestId(DELETE_TESTID)).click();
    cy.get(CIRCLE_QUERY)
      .should("have.length", addedElements - 1);
  });

  it("should clear stack", () => {
    for (let i = 0; i < addedElements; i += 1) {
      cy.get(qTestId(INPUT_TESTID)).type(TEXT);
      cy.get(qTestId(SUBMIT_TESTID)).click();
    }

    cy.get(CIRCLE_QUERY)
      .should("have.length", addedElements);
    cy.get(qTestId(CLEAR_TESTID)).click();
    cy.get(CIRCLE_QUERY)
      .should("have.length", 0);
  });
});
