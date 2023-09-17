import {
  INPUT_TESTID,
  SUBMIT_TESTID,
  CIRCLE_TESTID,
  CLEAR_TESTID,
  DELETE_TESTID,
} from "../../src/components/queue-page/constants";
import { ElementStates } from "../../src/types/element-states";
import { HEAD, LETTER, TAIL, qTestId } from "./helpers";

const CIRCLE_QUERY = qTestId(CIRCLE_TESTID);

const TEXT = "t";
const COUNT = 4;

describe("queue page", () => {
  beforeEach(() => {
    cy.visit("queue");
  });

  it("add button should be disabled without text", () => {
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

  it("should add new elements correctly", () => {
    for (let i = 0; i < COUNT; i += 1) {
      cy.get(qTestId(INPUT_TESTID)).type(i + TEXT);
      cy.get(qTestId(SUBMIT_TESTID)).click();

      cy.get(CIRCLE_QUERY)
        .eq(i)
        .parent()
        .find(LETTER)
        .should("have.text", i + TEXT);
      cy.get(CIRCLE_QUERY)
        .eq(i)
        .parent()
        .find(TAIL)
        .should("have.text", "tail");
      cy.get(CIRCLE_QUERY)
        .eq(0)
        .parent()
        .find(HEAD)
        .should("have.text", "head");

      if (i > 0) {
        cy.get(CIRCLE_QUERY)
          .eq(i - 1)
          .parent()
          .find(TAIL)
          .should("not.have.text", "tail");
      }

      cy.get(CIRCLE_QUERY)
        .eq(i)
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Changing);
        });

      cy.wait(500);

      cy.get(CIRCLE_QUERY)
        .eq(i)
        .should("have.attr", "class")
        .should(($class) => {
          expect($class).to.contain(ElementStates.Default);
        });
    }
  });

  it("should delete elements correctly", () => {
    for (let i = 0; i < COUNT; i += 1) {
      cy.get(qTestId(INPUT_TESTID)).type(i + TEXT);
      cy.get(qTestId(SUBMIT_TESTID)).click();
    }
    cy.wait(COUNT * 500);
    cy.get(qTestId(DELETE_TESTID)).click();
    cy.get(CIRCLE_QUERY)
      .eq(0)
      .should("have.attr", "class")
      .should(($class) => {
        expect($class).to.contain(ElementStates.Changing);
      });

    cy.wait(500);

    cy.get(CIRCLE_QUERY)
      .eq(0)
      .should("have.attr", "class")
      .should(($class) => {
        expect($class).to.contain(ElementStates.Default);
      });

      cy.get(CIRCLE_QUERY)
        .eq(0)
        .find(LETTER)
        .should("have.text", "");
      cy.get(CIRCLE_QUERY)
        .eq(0)
        .parent()
        .find(HEAD)
        .should("have.text", "");
      cy.get(CIRCLE_QUERY)
        .eq(1)
        .parent()
        .find(HEAD)
        .should("have.text", "head");
  });

  it("should clear queue correctly", () => {
    for (let i = 0; i < COUNT; i += 1) {
      cy.get(qTestId(INPUT_TESTID)).type(i + TEXT);
      cy.get(qTestId(SUBMIT_TESTID)).click();
    }

    cy.wait(COUNT * 500);
    cy.get(qTestId(CLEAR_TESTID)).click();
    cy.get(CIRCLE_QUERY).each((el) => {
      expect(el.find(LETTER).text()).to.eq("");
      expect(el.parent().find(HEAD).text()).to.eq("");
      expect(el.parent().find(TAIL).text()).to.eq("");
    });
  });
});
