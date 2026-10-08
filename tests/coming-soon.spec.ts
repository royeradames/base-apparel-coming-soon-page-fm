import { expect, test, type Page } from "@playwright/test";

const trackWrites = (page: Page) => {
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(`${request.method()} ${request.url()}`); });
  return writes;
};

test("renders the supplied brand, heading, intro, hero and honest demo note", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Base Apparel coming soon page | Royer Adames");
  await expect(page.getByRole("banner").getByRole("img", { name: "Base Apparel" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("We're coming soon");
  await expect(page.getByText(/Hello fellow shoppers! We're currently building our new fashion store/)).toBeVisible();
  await expect(page.getByText("Demo only: nothing is sent.")).toBeVisible();
  const hero = page.getByRole("img", { name: /model in a peach button-up shirt/ });
  await expect(hero).toBeVisible();
  expect(await hero.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole("textbox", { name: "Email address" })).toHaveAttribute("placeholder", "Email Address");
});

test("declares one site name in the footer, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-name")).toHaveText("Base Apparel coming soon page");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Base Apparel coming soon page");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /launch-news email form/);
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: "Base Apparel coming soon page", url: "https://base-apparel-coming-soon-page-fm.royeradames.com" });
});

test("empty and badly formatted emails show the design's error state and keep focus on the field", async ({ page }) => {
  const writes = trackWrites(page);
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  const submit = page.getByRole("button", { name: "Submit email for launch news" });
  await submit.click();
  await expect(page.getByText("Please provide an email address")).toBeVisible();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription("Please provide an email address");
  await expect(email).toBeFocused();
  await expect(page.locator(".email-control")).toHaveCSS("border-top-color", "rgb(249, 100, 100)");
  await expect(page.locator(".error-icon")).toBeVisible();

  await email.fill("janeappleseed#email.com");
  await expect(page.getByText("Please provide a valid email")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Please provide a valid email")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("");

  await email.fill("jane@example.com");
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.locator(".error-icon")).toHaveCount(0);
  expect(writes).toEqual([]);
});

test("a valid email is accepted by the demo without sending anything", async ({ page }) => {
  const writes = trackWrites(page);
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  const submit = page.getByRole("button", { name: "Submit email for launch news" });
  await email.fill("  jane@example.com ");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Thanks! jane@example.com passed the check, but this demo doesn't save or send it.");
  await expect(submit).toBeEnabled();
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
  expect(writes).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
});

test("submit button has hover and keyboard focus states", async ({ page }) => {
  await page.goto("/");
  const submit = page.getByRole("button", { name: "Submit email for launch news" });
  const before = await submit.evaluate(element => getComputedStyle(element).backgroundImage);
  await submit.hover();
  await expect.poll(() => submit.evaluate(element => getComputedStyle(element).backgroundImage)).not.toBe(before);
  await page.mouse.move(0, 0);
  await page.getByRole("textbox", { name: "Email address" }).focus();
  await page.keyboard.press("Tab");
  await expect(submit).toBeFocused();
  await expect(submit).toHaveCSS("outline-style", "solid");
});

test("follows the Figma arrangement at mobile, tablet and desktop", async ({ page }) => {
  const box = async (selector: string) => (await page.locator(selector).boundingBox())!;
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  let hero = await box(".hero img");
  expect(Math.round(hero.width)).toBe(375);
  expect(Math.round(hero.height)).toBe(250);
  let control = await box(".email-control");
  expect(Math.round(control.width)).toBe(311);
  expect(Math.round(control.height)).toBe(48);
  expect(Math.round((await box(".submit")).width)).toBe(64);

  await page.setViewportSize({ width: 768, height: 1024 });
  hero = await box(".hero img");
  expect(Math.round(hero.width)).toBe(768);
  expect(Math.round(hero.height)).toBe(400);
  control = await box(".email-control");
  expect(Math.round(control.width)).toBe(445);
  expect(Math.round(control.x)).toBe(162);

  await page.setViewportSize({ width: 1440, height: 800 });
  hero = await box(".hero img");
  expect(Math.round(hero.x)).toBe(830);
  expect(Math.round(hero.width)).toBe(610);
  expect(Math.round(hero.y)).toBe(0);
  expect(Math.round(hero.height)).toBeGreaterThanOrEqual(800);
  const heading = await box("h1");
  expect(Math.round(heading.x)).toBe(165);
  expect(Math.round(heading.y)).toBe(248);
  control = await box(".email-control");
  expect(Math.round(control.width)).toBe(445);
  expect(Math.round(control.height)).toBe(56);
  const logo = await box(".brand img");
  expect([Math.round(logo.x), Math.round(logo.y), Math.round(logo.width)]).toEqual([165, 80, 158]);
});

test("fits narrow and enlarged layouts with the family text and target floors", async ({ page }) => {
  for (const width of [320, 375, 400, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Submit email for launch news" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallText = await page.locator("h1, p, input, footer, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const control of await page.locator("a, button, input").all()) {
      expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
