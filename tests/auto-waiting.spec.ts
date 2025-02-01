import { expect, test } from "@playwright/test";

const resultText = "Data loaded with AJAX get request.";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("Auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  //  await successButton.click();

  const text = await successButton.textContent();
  expect(text).toEqual(resultText);
});

test("Manuel waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // wait for the element to be attached to the DOM
  await successButton.waitFor({ state: "attached" });
  const text = await successButton.allTextContents();
  expect(text).toContain(resultText);
});

test("Manuel waiting with the timeout", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  await expect(successButton).toHaveText(resultText, {
    timeout: 5000,
  });
});

test("Alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // wait for element
  await page.waitForSelector(".bg-success");

  // wait for particular (spec) response
  await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  // wait for network calls to finish (NOT RECOMMENDED)
  await page.waitForLoadState("networkidle");

  // wait hardcode time
  await page.waitForTimeout(5000);

  const text = await successButton.allTextContents();
  expect(text).toContain(resultText);
});
