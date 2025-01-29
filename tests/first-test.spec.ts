import { test } from "@playwright/test";

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
