import {
  INPUT_TESTID,
  SUBMIT_TESTID,
  CIRCLE_TESTID,
  CLEAR_TESTID,
  DELETE_TESTID,
} from "../../src/components/queue-page/constants";
import { ElementStates } from "../../src/types/element-states";

const TEXT = "t";
const COUNT = 4;

describe("queue page", () => {
  beforeEach(() => {
    cy.visit("queue");
  });

  it("add button should be disabled without text", () => {
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

  it("should add new elements correctly", () => {
    for (let i = 0; i < COUNT; i += 1) {
      cy.get(`[data-testid="${INPUT_TESTID}"]`).type(i + TEXT);
      cy.get(`[data-testid="${SUBMIT_TESTID}"]`).click();

      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(i)
        .parent()
        .find('[data-type="letter"]')
        .should("have.text", i + TEXT);
      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(i)
        .parent()
        .find('[data-type="tail"]')
        .should("have.text", "tail");
      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(0)
        .parent()
        .find('[data-type="head"]')
        .should("have.text", "head");

      if (i > 0) {
        cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
          .eq(i - 1)
          .parent()
          .find('[data-type="tail"]')
          .should("not.have.text", "tail");
      }

      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(i)
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Changing);
        });

      cy.wait(500);

      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(i)
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Default);
        });
    }
  });

  it("should delete elements correctly", () => {
    for (let i = 0; i < COUNT; i += 1) {
      cy.get(`[data-testid="${INPUT_TESTID}"]`).type(i + TEXT);
      cy.get(`[data-testid="${SUBMIT_TESTID}"]`).click();
    }
    cy.wait(COUNT * 500);
    cy.get(`[data-testid="${DELETE_TESTID}"]`).click();
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .eq(0)
      .should("have.attr", "class")
      .should(($class) => {
        expect($class).to.contain(ElementStates.Changing);
      });

    cy.wait(500);

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .eq(0)
      .should("have.attr", "class")
      .should(($class) => {
        expect($class).to.contain(ElementStates.Default);
      });

      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(0)
        .find('[data-type="letter"]')
        .should("have.text", "");
      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(0)
        .parent()
        .find('[data-type="head"]')
        .should("have.text", "");
      cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(1)
        .parent()
        .find('[data-type="head"]')
        .should("have.text", "head");
  });

  it("should clear queue correctly", () => {
    for (let i = 0; i < COUNT; i += 1) {
      cy.get(`[data-testid="${INPUT_TESTID}"]`).type(i + TEXT);
      cy.get(`[data-testid="${SUBMIT_TESTID}"]`).click();
    }

    cy.wait(COUNT * 500);
    cy.get(`[data-testid="${CLEAR_TESTID}"]`).click();
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`).each((el) => {
      expect(el.find('[data-type="letter"]').text()).to.eq("");
      expect(el.parent().find('[data-type="head"]').text()).to.eq("");
      expect(el.parent().find('[data-type="tail"]').text()).to.eq("");
    });
  });
});
