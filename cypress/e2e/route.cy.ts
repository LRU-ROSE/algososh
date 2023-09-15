describe("Check souting", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("recursion", () => {
    cy.get('a[href$="/recursion"]').click();
    cy.location("pathname").should("include", "/recursion");
    cy.get('[data-type="form"]');
  });

  it("fibonacci", () => {
    cy.get('a[href$="/fibonacci"]').click();
    cy.location("pathname").should("include", "/fibonacci");
    cy.get('[data-type="form"]');
  });

  it("sorting", () => {
    cy.get('a[href$="/sorting"]').click();
    cy.location("pathname").should("include", "/sorting");
    cy.get('[data-type="form"]');
  });

  it("stack", () => {
    cy.get('a[href$="/stack"]').click();
    cy.location("pathname").should("include", "/stack");
    cy.get('[data-type="form"]');
  });

  it("queue", () => {
    cy.get('a[href$="/queue"]').click();
    cy.location("pathname").should("include", "/queue");
    cy.get('[data-type="form"]');
  });

  it("list", () => {
    cy.get('a[href$="/list"]').click();
    cy.location("pathname").should("include", "/list");
    cy.get('[data-type="form"]');
  });
});
