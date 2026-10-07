// Regression check for the hero duck and the 1958 stud click on mobile and desktop.
// Run against a dev server, once per engine: playwright-cli open --browser=msedge (or --browser=webkit for iPhone) && playwright-cli run-code --filename=scripts/motion-check.js
// Set BASE below to the LAN address to reproduce what a phone sees.
async (page) => {
  const BASE = "http://192.168.1.5:3000/";
  const SHOTS = "motion-shots";
  const browser = page.context().browser();
  const pixel = { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36" };
  const iphone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" };
  const desktop = { viewport: { width: 1440, height: 900 } };
  const phone = browser.browserType().name() === "webkit" ? ["iphone", iphone] : ["pixel", pixel];
  const fails = [];
  const report = [];
  const ok = (cond, msg) => { if (!cond) fails.push(msg); };

  for (const [device, opts] of [phone, ["desktop", desktop]]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const tag = `${device}/${reducedMotion}`;
      const ctx = await browser.newContext({ ...opts, reducedMotion });
      const p = await ctx.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("console", (m) => m.type() === "error" && !m.text().includes("WebSocket") && errors.push(m.text()));
      await p.goto(BASE);
      await p.waitForFunction(() => document.querySelector(".duck-svg")?.classList.contains("duck-js"), null, { timeout: 15000 });

      // Duck: sample how many of the parts are visible over time.
      const duck = () => p.$$eval(".duck-part", (els) => els.map((e) => ({ o: +getComputedStyle(e).opacity, t: getComputedStyle(e).transform })));
      const timeline = [];
      for (let t = 0; t <= 2400; t += 200) {
        const parts = await duck();
        timeline.push(parts.filter((x) => x.o > 0.5).length);
        if (t === 200 || t === 1000) await p.locator(".duck-svg").screenshot({ path: `${SHOTS}/${device}-${reducedMotion}-duck-${t}ms.png` });
        await p.waitForTimeout(200);
      }
      const end = await duck();
      await p.locator(".duck-svg").screenshot({ path: `${SHOTS}/${device}-${reducedMotion}-duck-end.png` });
      ok(timeline[0] < end.length, `${tag}: duck starts already assembled (${timeline.join(",")})`);
      ok(end.every((x) => x.o === 1), `${tag}: not all ${end.length} duck parts visible at the end`);
      ok(end.every((x) => x.t === "none" || /matrix\(1, 0, 0, 1, 0, 0\)/.test(x.t)), `${tag}: duck parts not settled`);
      if (reducedMotion === "reduce") ok(timeline.some((n) => n > 0 && n < end.length), `${tag}: no step-by-step fade`);

      // Step 1 only shows the cart.
      await p.getByRole("button", { name: /Тележка/ }).click();
      await p.waitForTimeout(800);
      const step1 = (await duck()).filter((x) => x.o > 0.5).length;
      ok(step1 > 0 && step1 < end.length, `${tag}: step 1 shows ${step1} parts`);

      // Stud click: apart before it scrolls in, joined after.
      const top = p.locator("svg g.top");
      const pose = () => top.evaluate((e) => ({ t: getComputedStyle(e).transform, o: +getComputedStyle(e).opacity }));
      const before = await pose();
      await top.evaluate((e) => e.closest("div").scrollIntoView({ block: "center", behavior: "instant" }));
      await p.waitForTimeout(150);
      await top.screenshot({ path: `${SHOTS}/${device}-${reducedMotion}-stud-150ms.png` }).catch(() => {});
      await p.waitForTimeout(1600);
      const after = await pose();
      await p.locator("svg:has(g.top)").screenshot({ path: `${SHOTS}/${device}-${reducedMotion}-stud-end.png` });
      if (reducedMotion === "reduce") {
        ok(before.o === 0 && before.t === "none", `${tag}: stud start should be hidden in place, got ${JSON.stringify(before)}`);
      } else {
        ok(/-80\)$/.test(before.t), `${tag}: stud start should be apart, got ${before.t}`);
      }
      ok(after.o === 1 && (after.t === "none" || /0, 0\)$/.test(after.t)), `${tag}: stud end not joined: ${JSON.stringify(after)}`);
      ok(errors.length === 0, `${tag}: errors ${errors.join(" | ")}`);
      report.push(`${tag}: duck visible parts per 200ms [${timeline.join(",")}] -> ${end.length}/${end.length}; step1=${step1}; stud ${before.t}/${before.o} -> ${after.t}/${after.o}`);
      await ctx.close();
    }
  }
  return [...report, fails.length ? `FAIL:\n${fails.join("\n")}` : "PASS"].join("\n");
}
