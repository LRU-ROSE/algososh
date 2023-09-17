import {
  INPUT_TESTID,
  CIRCLE_TESTID,
  ADD_HEAD_TESTID,
  ADD_TAIL_TESTID,
  ADD_INDEX_TESTID,
  DELETE_HEAD_TESTID,
  DELETE_TAIL_TESTID,
  DELETE_INDEX_TESTID,
  CIRCLE_MINI_TESTID,
  INDEX_INPUT_TESTID,
} from "../../src/components/list-page/constants";
import { ElementStates } from "../../src/types/element-states";
import { HEAD, LETTER, TAIL, qTestId } from "./helpers";

const CIRCLE_QUERY = qTestId(CIRCLE_TESTID);

const TEXT = "el";
const checkCircle = (
  el: JQuery<Element>,
  text: string | null,
  headCheck: boolean | null | ((el: JQuery<Element>) => void),
  tailCheck: boolean | null | ((el: JQuery<Element>) => void),
  state: ElementStates
) => {
  cy.wrap(el)
    .should("have.attr", "class")
    .should((className) => {
      expect(className).to.contain(state);
    });
  if (text !== null) {
    expect(el.find(LETTER)).have.text(text);
  }
  if (typeof headCheck === "function") {
    headCheck(
      el
        .parent()
        .find(`${HEAD} ${qTestId(CIRCLE_MINI_TESTID)}`)
    );
  } else if (headCheck !== null) {
    expect(el.parent().find(HEAD)).have.text(
      headCheck ? "head" : ""
    );
  }
  if (typeof tailCheck === "function") {
    tailCheck(
      el
        .parent()
        .find(`${TAIL} ${qTestId(CIRCLE_MINI_TESTID)}`)
    );
  } else if (tailCheck != null) {
    expect(el.parent().find(TAIL)).have.text(
      tailCheck ? "tail" : ""
    );
  }
};

describe("list page works correctly", () => {
  beforeEach(() => {
    cy.visit("list");
  });

  it("all buttons should be disabled when no text", () => {
    cy.get(qTestId(ADD_HEAD_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(qTestId(ADD_TAIL_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(qTestId(ADD_INDEX_TESTID)).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
  });

  it("should display default list correctly", () => {
    cy.wait(1000);
    let length = 0;
    cy.get(CIRCLE_QUERY).then((list) => {
      length = list.length;
    });

    cy.get(CIRCLE_QUERY).each((el, index) => {
      checkCircle(
        el,
        null,
        index === 0,
        index === length - 1,
        ElementStates.Default
      );
    });
  });

  it("should add head element correctly", () => {
    cy.wait(1000);
    cy.get(qTestId(INPUT_TESTID)).type(TEXT);
    cy.get(qTestId(ADD_HEAD_TESTID)).click();

    cy.get(CIRCLE_QUERY)
      .first()
      .then((el) => {
        checkCircle(
          el,
          null,
          (miniCircle) => {
            checkCircle(miniCircle, TEXT, false, false, ElementStates.Changing);
          },
          null,
          ElementStates.Default
        );
      });

    cy.wait(500);
    cy.get(CIRCLE_QUERY)
      .first()
      .then((el) => {
        checkCircle(el, TEXT, true, false, ElementStates.Modified);
      });

    cy.wait(500);
    cy.get(CIRCLE_QUERY)
      .first()
      .then((el) => {
        checkCircle(el, TEXT, true, false, ElementStates.Default);
      });
  });

  it("should add tail element correctly", () => {
    cy.wait(1000);
    cy.get(qTestId(INPUT_TESTID)).type(TEXT);
    cy.get(qTestId(ADD_TAIL_TESTID)).click();

    cy.get(CIRCLE_QUERY)
      .last()
      .then((el) => {
        checkCircle(
          el,
          null,
          (miniCircle) => {
            checkCircle(miniCircle, TEXT, false, false, ElementStates.Changing);
          },
          null,
          ElementStates.Default
        );
      });

    cy.wait(500);
    cy.get(CIRCLE_QUERY)
      .last()
      .then((el) => {
        checkCircle(el, TEXT, false, true, ElementStates.Modified);
      });

    cy.wait(500);
    cy.get(CIRCLE_QUERY)
      .last()
      .then((el) => {
        checkCircle(el, TEXT, false, true, ElementStates.Default);
      });
  });

  it("should delete head element correctly", () => {
    cy.wait(1000);
    let value = "";
    let length = 0;
    cy.get(CIRCLE_QUERY).then((list) => {
      length = list.length;
    });
    cy.get(CIRCLE_QUERY)
      .first()
      .find(LETTER)
      .then((el) => {
        value = el.text();
      })
      .then(() => {
        cy.get(qTestId(DELETE_HEAD_TESTID)).click();
        cy.get(CIRCLE_QUERY)
          .eq(0)
          .then((el) => {
            checkCircle(
              el,
              "",
              true,
              (miniCircle) => {
                checkCircle(
                  miniCircle,
                  value,
                  false,
                  false,
                  ElementStates.Changing
                );
              },
              ElementStates.Default
            );
          });
        cy.wait(500);
        cy.get(CIRCLE_QUERY).then(($list) => {
          expect($list.length).to.eq(Math.max(0, length - 1));
        });
      })
      .end();
  });

  it("should delete tail element correctly", () => {
    cy.wait(1000);
    let value = "";
    let length = 0;
    cy.get(CIRCLE_QUERY).then((list) => {
      length = list.length;
    });
    cy.get(CIRCLE_QUERY)
      .last()
      .find(LETTER)
      .then((el) => {
        value = el.text();
      })
      .then(() => {
        cy.get(qTestId(DELETE_TAIL_TESTID)).click();
        cy.get(CIRCLE_QUERY)
          .last()
          .then((el) => {
            checkCircle(
              el,
              "",
              false,
              (miniCircle) => {
                checkCircle(
                  miniCircle,
                  value,
                  false,
                  false,
                  ElementStates.Changing
                );
              },
              ElementStates.Default
            );
          });
        cy.wait(500);
        cy.get(CIRCLE_QUERY).then(($list) => {
          expect($list.length).to.eq(Math.max(0, length - 1));
        });
      })
      .end();
  });

  it("should add element by index correctly", () => {
    cy.wait(1000);
    cy.get(qTestId(INPUT_TESTID)).type(TEXT);
    cy.get(CIRCLE_QUERY)
      .then(($list) => {
        const length = $list.length;
        const index = Math.round(Math.random() * length);

        cy.get(qTestId(INDEX_INPUT_TESTID)).type(index.toString());
        cy.get(qTestId(ADD_INDEX_TESTID)).click();

        for (let i = 0; i <= index; i += 1) {
          cy.get(CIRCLE_QUERY)
            .eq(i)
            .then((el) => {
              checkCircle(
                el,
                null,
                (miniCircle) => {
                  checkCircle(
                    miniCircle,
                    TEXT,
                    false,
                    false,
                    ElementStates.Changing
                  );
                },
                null,
                ElementStates.Default
              );
            });
          if (i > 0) {
            cy.get(CIRCLE_QUERY)
              .eq(i - 1)
              .then((el) => {
                checkCircle(el, null, null, null, ElementStates.Changing);
              });
          }
          cy.wait(500);
        }

        cy.get(CIRCLE_QUERY)
          .eq(index)
          .then((el) => {
            checkCircle(el, TEXT, null, null, ElementStates.Modified);
          });

        cy.wait(500);

        cy.get(CIRCLE_QUERY)
          .eq(index)
          .then((el) => {
            checkCircle(el, TEXT, null, null, ElementStates.Default);
          });

        cy.get(CIRCLE_QUERY).then((newList) => {
          expect(newList.length).to.eq(length + 1);
        });
      })
      .end();
  });

  it("should delete element by index correctly", () => {
    cy.wait(1000);
    cy.get(CIRCLE_QUERY)
      .then((list) => {
        const length = list.length;
        const index = Math.floor(Math.random() * length);
        const value = list.eq(index).find(LETTER).eq(0).text();

        cy.get(qTestId(INDEX_INPUT_TESTID)).type(index.toString());
        cy.get(qTestId(DELETE_INDEX_TESTID)).click();

        for (let i = 0; i <= index; i += 1) {
          cy.get(CIRCLE_QUERY)
          .eq(i)
          .then((el) => {
            checkCircle(el, null, null, null, ElementStates.Changing);
          });

          cy.wait(500);
        }
        cy.get(CIRCLE_QUERY)
        .eq(index)
        .then((el) => {
          checkCircle(el, "", null, (miniCircle) => {
            checkCircle(miniCircle, value, null, null, ElementStates.Changing);
          }, ElementStates.Default);
        });

        cy.wait(500);
          cy.get(CIRCLE_QUERY).then((newList) => {
            expect(newList.length).to.eq(length - 1);
          });
      })
      .end();
  });
});
