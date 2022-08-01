"use strict";

const { Service } = require("egg");
const fs = require("fs");
const path = require("path");
// const puppeteer = require("puppeteer");
// const PDFMerger = require("pdf-merger-js");
const wkhtmltopdf = require("wkhtmltopdf");

class PdfService extends Service {
  async generatePDF(platform, category) {
    const { ctx, app } = this;
    const aroutes = await ctx.model.Articles.find({
      $or: [
        {
          platform,
        },
        {
          platform: "public",
        },
      ],
      servicePlatform: category,
    }).select("route");

    const { host } = ctx.req.headers;
    const routes = aroutes.map(
      (rt) => `http://${host}${rt.route}?platform=${platform}`
    );
    if (app.config.wkhtmltopdf && app.config.wkhtmltopdf.command) {
      console.log(app.config.wkhtmltopdf);
      wkhtmltopdf.command = app.config.wkhtmltopdf.command;
    }
    const pdfFilePath = path.join(
      app.baseDir,
      `resources/assets/${category}${platform}.pdf`
    );
    const stream = await new Promise((resolve, reject) => {
      wkhtmltopdf(
        // routes,
        null,
        {
          cookie: "isOutputPdf=true",
          output: pdfFilePath,
          page: routes,
        },
        (err, stream) => {
          if (err) {
            reject(err);
          } else {
            resolve(stream);
          }
        }
      );
      // .pipe(ctx.response);
    });

    // return stream; // 这个流，下载了读不了
    return `${category}${platform}.pdf`;
  }

  // async generatePDF(platform, category) {
  //   const { ctx, app } = this;
  //   const routes = await ctx.model.Articles.find({
  //     $or: [
  //       {
  //         platform,
  //       },
  //       {
  //         platform: "public",
  //       },
  //     ],
  //     servicePlatform: category,
  //   }).select("route");
  //   try {
  //     const browser = await puppeteer.launch({
  //       args: ["--no-sandbox", "--disable-setuid-sandbox"], // linux 上需要
  //       defaultViewport: {
  //         width: 1920,
  //         height: 1080,
  //       },
  //     });
  //     const page = await browser.newPage();
  //     const filename = `${platform}.pdf`;
  //     const PdfFilePath = path.join(
  //       app.baseDir,
  //       `resources/assets/pdf/${filename}`
  //     );
  //     const merger = new PDFMerger();
  //     // console.log(ctx.origin, ctx.protocol, ctx.hostname, ctx.host);
  //     const host = ctx.get("x-forwarded-hosts");
  //     const scheme = ctx.get("x-scheme");
  //     const target = host
  //       ? `${scheme}://${host}`
  //       : `${ctx.protocol}://${ctx.hostname}:7001`;
  //     for (let i = 0; i < routes.length; i++) {
  //       const route = routes[i].route;
  //       // networkidle2 代表还有两个以下的request就考虑navigation结束
  //       // networkidle0 则是全部request结束
  //       ctx.logger.info(
  //         `puppeteer open PDF page: ${target}${route}?platform=${platform}`
  //       );
  //       await page.goto(`${target}${route}?platform=${platform}`, {
  //         waitUntil: "networkidle2",
  //       });
  //       const selector = ".markdown-body";
  //       await page.waitForFunction(
  //         (selector) => !!document.querySelector(selector),
  //         { polling: 600, timeout: 0 },
  //         selector
  //       );
  //       const dimensions = await page.evaluate(() => {
  //         return {
  //           pageHeight: document.querySelector("body").scrollHeight,
  //           width: document.documentElement.clientWidth,
  //           height: document.documentElement.clientHeight,
  //           deviceScaleFactor: window.devicePixelRatio,
  //         };
  //       });
  //       ctx.logger.info("generate pdf");
  //       const pdf = await page.pdf({
  //         // path: `d${i}.pdf`,
  //         timeout: 0,
  //         width: 1920 + "px",
  //         height: dimensions.pageHeight + 100 + "px",
  //         scale: 1,
  //         printBackground: true, // 导出有背景色的
  //         "-webkit-print-color-adjust": "exact",
  //         margin: {
  //           bottom: "80px",
  //         },
  //       });
  //       ctx.logger.info("add pdf");
  //       merger.add(pdf);
  //     }
  //     ctx.logger.info("merge pdf");
  //     merger.save(PdfFilePath);
  //     await browser.close();
  //     ctx.logger.info("browser.close over");
  //     return { data: `/pdf/${filename}` };
  //     // const stream = await fs.readFileSync(PdfFilePath);
  //     // ctx.set("content-disposition", `attachment;filename=${filename}`);
  //     // return stream;
  //   } catch (error) {
  //     ctx.logger.error(error);
  //     return { message: "导出失败" };
  //   }
  // }
}

module.exports = PdfService;
