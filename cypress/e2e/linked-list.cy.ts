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
    .should(($class) => {
      expect($class).to.contain(state);
    });
  if (text !== null) {
    expect(el.find('[data-type="letter"]')).have.text(text);
  }
  if (typeof headCheck === "function") {
    headCheck(
      el
        .parent()
        .find(`[data-type="head"] [data-testid="${CIRCLE_MINI_TESTID}"]`)
    );
  } else if (headCheck !== null) {
    expect(el.parent().find('[data-type="head"]')).have.text(
      headCheck ? "head" : ""
    );
  }
  if (typeof tailCheck === "function") {
    tailCheck(
      el
        .parent()
        .find(`[data-type="tail"] [data-testid="${CIRCLE_MINI_TESTID}"]`)
    );
  } else if (tailCheck != null) {
    expect(el.parent().find('[data-type="tail"]')).have.text(
      tailCheck ? "tail" : ""
    );
  }
};

describe("list page works correctly", () => {
  beforeEach(() => {
    cy.visit("list");
  });

  it("all buttons should be disabled when no text", () => {
    cy.get(`[data-testid="${ADD_HEAD_TESTID}"]`).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(`[data-testid="${ADD_TAIL_TESTID}"]`).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
    cy.get(`[data-testid="${ADD_INDEX_TESTID}"]`).should("satisfy", (el) =>
      el[0].matches(":invalid *, :disabled")
    );
  });

  it("should display default list correctly", () => {
    cy.wait(1000);
    let length = 0;
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then((list) => {
      length = list.length;
    });

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`).each((el, index) => {
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
    cy.get(`[data-testid="${INPUT_TESTID}"]`).type(TEXT);
    cy.get(`[data-testid="${ADD_HEAD_TESTID}"]`).click();

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
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
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .first()
      .then((el) => {
        checkCircle(el, TEXT, true, false, ElementStates.Modified);
      });

    cy.wait(500);
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .first()
      .then((el) => {
        checkCircle(el, TEXT, true, false, ElementStates.Default);
      });
  });

  it("should add tail element correctly", () => {
    cy.wait(1000);
    cy.get(`[data-testid="${INPUT_TESTID}"]`).type(TEXT);
    cy.get(`[data-testid="${ADD_TAIL_TESTID}"]`).click();

    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
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
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .last()
      .then((el) => {
        checkCircle(el, TEXT, false, true, ElementStates.Modified);
      });

    cy.wait(500);
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .last()
      .then((el) => {
        checkCircle(el, TEXT, false, true, ElementStates.Default);
      });
  });

  it("should delete head element correctly", () => {
    cy.wait(1000);
    let value = "";
    let length = 0;
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then((list) => {
      length = list.length;
    });
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .first()
      .find('[data-type="letter"]')
      .then((el) => {
        value = el.text();
      })
      .then(() => {
        cy.get(`[data-testid="${DELETE_HEAD_TESTID}"]`).click();
        cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
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
        cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then(($list) => {
          expect($list.length).to.eq(Math.max(0, length - 1));
        });
      })
      .end();
  });

  it("should delete tail element correctly", () => {
    cy.wait(1000);
    let value = "";
    let length = 0;
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then((list) => {
      length = list.length;
    });
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .last()
      .find('[data-type="letter"]')
      .then((el) => {
        value = el.text();
      })
      .then(() => {
        cy.get(`[data-testid="${DELETE_TAIL_TESTID}"]`).click();
        cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
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
        cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then(($list) => {
          expect($list.length).to.eq(Math.max(0, length - 1));
        });
      })
      .end();
  });

  it("should add element by index correctly", () => {
    cy.wait(1000);
    cy.get(`[data-testid="${INPUT_TESTID}"]`).type(TEXT);
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .then(($list) => {
        const length = $list.length;
        const index = Math.round(Math.random() * length);

        cy.get(`[data-testid="${INDEX_INPUT_TESTID}"]`).type(index.toString());
        cy.get(`[data-testid="${ADD_INDEX_TESTID}"]`).click();

        for (let i = 0; i <= index; i += 1) {
          cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
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
            cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
              .eq(i - 1)
              .then((el) => {
                checkCircle(el, null, null, null, ElementStates.Changing);
              });
          }
          cy.wait(500);
        }

        cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
          .eq(index)
          .then((el) => {
            checkCircle(el, TEXT, null, null, ElementStates.Modified);
          });

        cy.wait(500);

        cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
          .eq(index)
          .then((el) => {
            checkCircle(el, TEXT, null, null, ElementStates.Default);
          });

        cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then((newList) => {
          expect(newList.length).to.eq(length + 1);
        });
      })
      .end();
  });

  it("should delete element by index correctly", () => {
    cy.wait(1000);
    cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
      .then((list) => {
        const length = list.length;
        const index = Math.floor(Math.random() * length);
        const value = list.eq(index).find('[data-type="letter"]').eq(0).text();

        cy.get(`[data-testid="${INDEX_INPUT_TESTID}"]`).type(index.toString());
        cy.get(`[data-testid="${DELETE_INDEX_TESTID}"]`).click();

        for (let i = 0; i < index; i += 1) {
          cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
          .eq(index)
          .then((el) => {
            checkCircle(el, null, null, null, ElementStates.Changing);
          });

          cy.wait(500);
        }
        cy.wait(500);
        cy.get(`[data-testid="${CIRCLE_TESTID}"]`)
        .eq(index)
        .then((el) => {
          checkCircle(el, "", null, (miniCircle) => {
            checkCircle(miniCircle, value, null, null, ElementStates.Changing);
          }, ElementStates.Default);
        });

        cy.wait(500);
          cy.get(`[data-testid="${CIRCLE_TESTID}"]`).then((newList) => {
            expect(newList.length).to.eq(length - 1);
          });
      })
      .end();
  });
});
