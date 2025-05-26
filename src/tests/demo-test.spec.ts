import { test, expect } from "@playwright/test";
import { CARTS_API, PRODUCTS_API } from "../components/Utilties/appUtils";
import type { Page } from "@playwright/test";

const mockAPICalls = async ({ page }: { page: Page }) => {
  const CART_API_RESPONSE = await page.request.get(CARTS_API);
  expect(CART_API_RESPONSE.status()).toBe(200);
  const PRODUCTS_API_RESPONSE = await page.request.get(PRODUCTS_API);
  expect(PRODUCTS_API_RESPONSE.status()).toBe(200);
};

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await mockAPICalls({ page });
  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", {
      name: "Mens Casual Premium Slim Fit T-Shirts",
    })
  ).toBeVisible();
});

test("click on cart link", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await mockAPICalls({ page });
  // Click the cart link.
  await page.getByRole("link", { name: "Cart" }).click();
  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", {
      name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    })
  ).toBeVisible();
});

test("on random routes redirect to Page Not Found", async ({ page }) => {
  await page.goto("http://localhost:5173/test");
  await expect(
    page.getByRole("heading", {
      name: "Page Not Found",
    })
  ).toBeVisible();
});

test("on typing some text in search and click on browser back button", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await mockAPICalls({ page });
  // Click the cart link.
  await page.getByRole("link", { name: "Cart" }).click();
  // Type some text in search.
  await page.getByTestId("initialValueInput").fill("shirt");
  // Simulate a back navigation
  await page.goBack();
  await expect(
    page.getByText("Are you sure you want to leave this page?")
  ).toBeVisible();
});
test("on clicking cancel button in confirm dialog", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await mockAPICalls({ page });
  // Click the cart link.
  await page.getByRole("link", { name: "Cart" }).click();
  // Type some text in search.
  await page.getByTestId("initialValueInput").fill("shirt");
  // Simulate a back navigation
  await page.goBack();
  await expect(
    page.getByText("Are you sure you want to leave this page?")
  ).toBeVisible();
  // Click on cancel button in confirm dialog.
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByTestId("initialValueInput")).toHaveValue("shirt");
});
test("on clicking ok button in confirm dialog", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await mockAPICalls({ page });
  // Click the cart link.
  await page.getByRole("link", { name: "Cart" }).click();
  // Type some text in search.
  await page.getByTestId("initialValueInput").fill("te");
  // Simulate a back navigation
  await page.goBack();
  await expect(
    page.getByText("Are you sure you want to leave this page?")
  ).toBeVisible();
  // Click on ok button in confirm dialog.
  await page.getByRole("button", { name: "OK" }).click();
  // Expect the input to be empty after confirming as it will be reset.
  await expect(page.getByTestId("initialValueInput")).toHaveValue("");
});
