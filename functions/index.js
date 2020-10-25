const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const puppeteer = require("puppeteer");

const scrapeImages = async (username) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}`);

  await page.waitForSelector("img ", {
    visible: true,
  });

  //   Screen shots of Loaded Page
  await page.screenshot({ path: username + ".png" });

  // Execute code in the DOM
  const data = await page.evaluate(() => {
    const images = document.querySelectorAll("img");

    const urls = Array.from(images).map((v) => v.src);

    return urls;
  });

  await browser.close();
  return data;
};

exports.scraper = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const body = JSON.parse(request.body);
    const data = await scrapeImages(body.username);
    response.send(data);
  });
});
