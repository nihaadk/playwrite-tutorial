import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
  // by tage name
  page.locator("input");

  // by tage name the first element and click
  page.locator("input").first().click();

  // by id
  page.locator("#inputEmail1");

  // by class
  page.locator(".shape-rectangle");

  // by attribute
  page.locator('[type="email"]');

  // by class value (full)
  page.locator(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
  );

  // combine different selectors
  page.locator('input[type="email"][nbinput]');

  // by XPath (not recommended)
  page.locator('//*[@id="inputEmail1"]');

  // by exact text match
  page.locator(':text-is("Using the Grid")');
});

test("Use facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByText("Using the Grid").click();

  await page.getByTitle("IoT Dashboard").click();

  await page.getByTestId("SignIn").click();
});

test("Locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();

  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  await page.locator("nb-card").nth(3).getByRole("button").click();
});

test("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click();

  // not recommended
  await page
    .locator(':text-is("Using the Grid")')
    .locator("...")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reuse the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailControl = basicForm.getByRole("textbox", { name: "Email" });
  const passwordControl = basicForm.getByRole("textbox", { name: "Password" });
  const checkbox = basicForm.locator("nb-checkbox");
  const signInButton = basicForm.getByRole("button");

  await emailControl.fill("test@test.com");
  await passwordControl.fill("foofoofoo");
  await checkbox.click();
  await signInButton.click();

  await expect(emailControl).toHaveValue("test@test.com");
  await expect(passwordControl).toHaveValue("foofoofoo");
});

test("Extracting values", async ({ page }) => {
  // signel text value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.getByRole("button").textContent();
  await expect(buttonText).toEqual("Submit");

  // multiple text values
  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents();
  await expect(allRadioButtonsLabels).toContain("Option 1");

  // input value
  const emailControl = basicForm.getByRole("textbox", { name: "Email" });
  await emailControl.fill("test@test.com");
  const emailValue = await emailControl.inputValue();
  expect(emailValue).toEqual("test@test.com");

  // get attribute value
  const placeholderValue = await emailControl.getAttribute("placeholder");
  await expect(placeholderValue).toEqual("Email");
});

test("Assetrions", async ({ page }) => {
    const basicFormButton = page.locator("nb-card").filter({ hasText: "Basic form" }).getByRole("button");

    // General assertions
    const v = 5;
    expect(v).toBe(5);

    const text = await basicFormButton.textContent();
    expect(text).toEqual("Submit");

    // Locator assertions
    // wait 5 sec for the element to appear
    await expect(basicFormButton).toHaveText("Submit");

    // Soft assertions
    // don't stop the test if the assertion fails
    await expect(basicFormButton).toHaveText("Submit");
    await basicFormButton.click();
});
