import {
  INPUT_TESTID,
  SUBMIT_TESTID,
  CIRCLE_TESTID,
  CLEAR_TESTID,
  DELETE_TESTID,
} from "../../src/components/stack-page/constants";
import { ElementStates } from "../../src/types/element-states";

const TEXT = "t";
const addedElements = 3;

describe("stack page", () => {
  beforeEach(() => {
    cy.visit("stack");
  });

  it("should be disabled button when there is no text", () => {
    cy.get(`[data-testid="${SUBMIT_TESTID}"]`).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(`[data-testid="${CLEAR_TESTID}"]`).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(`[data-testid="${DELETE_TESTID}"]`).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
  });

  it("should animate adding new element", () => {
    cy.get(`[data-testid="${INPUT_TESTID}"]`).type(TEXT);
    cy.get(`[data-testid="${SUBMIT_TESTID}"]`).click();

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`).last().as("top");

    cy.get("@top").find('[data-type="letter"]').should("have.text", TEXT);

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
      cy.get(`[data-testid="${INPUT_TESTID}"]`).type(TEXT);
      cy.get(`[data-testid="${SUBMIT_TESTID}"]`).click();
    }

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .should("have.length", addedElements);
    cy.get(`[data-testid="${DELETE_TESTID}"]`).click();
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .should("have.length", addedElements - 1);
  });

  it("should clear stack", () => {
    for (let i = 0; i < addedElements; i += 1) {
      cy.get(`[data-testid="${INPUT_TESTID}"]`).type(TEXT);
      cy.get(`[data-testid="${SUBMIT_TESTID}"]`).click();
    }

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .should("have.length", addedElements);
    cy.get(`[data-testid="${CLEAR_TESTID}"]`).click();
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .should("have.length", 0);
  });
});
