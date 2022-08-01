const path = require("path");
const container = require("markdown-it-container");
const assetsPath = path.join(__dirname, "../../resources/assets");
const Handlebars = require("handlebars");
const temps = require("./tableTemps");
const wxTemps = require("./wxTemplate");
const { markdownRender, markdownRenderInline } = require("./markdown-render");

module.exports = (md, opt) => {
  md.use(...createContainer("tip", "TIP"))
    .use(...createContainer("warning", "WARNING"))
    .use(...createContainer("danger", "DANGER"))
    .use(...createExplainContainer("explain"))
    .use(...createTableContainer("table", md, opt))
    .use(...createWXContainer("wx", md, opt));
  // explicitly escape Vue syntax
  // .use(container, "v-pre", {
  //   render: (tokens, idx) =>
  //     tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`,
  // });
};

function createContainer(klass, defaultTitle) {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        // const info = token.info.trim().slice(klass.length).trim();
        if (token.nesting === 1) {
          // return `<div class="${klass} custom-block"><p class="custom-block-title">${
          //   info || defaultTitle
          // }</p>\n`;
          return `<div class="${klass}">\n`;
        } else {
          return `</div>\n`;
        }
      },
    },
  ];
}

const createExplainContainer = (klass) => {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<div class="cr-doc-explain">
                    <div class="cr-doc-explain-title">
                      <i class="el-icon-question"></i> 说明：
                    </div>\n`;
        } else {
          return `</div>\n`;
        }
      },
    },
  ];
};

// md插件调render方法只有异步的，没法用vue玩
// const Vue = require("vue");
// const renderer = require("vue-server-renderer").createRenderer();
// const temps = require("./tableTemps");
// const createTable = async (tempKey, data) => {
//   const app = new Vue({
//     template: temps[tempKey],
//     data: {
//       data,
//     },
//   });
//   return await renderer.renderToString(app);
// };

Handlebars.registerHelper("mdrenderinline", function (options) {
  return markdownRenderInline(options.fn(this));
});
Handlebars.registerHelper("mdrender", function (options) {
  return markdownRender(options.fn(this));
});
Handlebars.registerHelper("mdrendercode", function (options) {
  return markdownRender(`\`\`\`${options.fn(this)}`);
});
Handlebars.registerHelper("isDefined", (value) => !!value);

const getspans = (data, field) => {
  return data
    .reduce((result, d, i, array) => {
      if (d[field] || i === array.length) {
        result.push({ idx: i });
      }
      return result;
    }, [])
    .reduce((res, o, i, arr) => {
      const olen = arr[i + 1] ? arr[i + 1].idx : data.length;
      res[o.idx] = olen;
      return res;
    }, {});
};
Handlebars.registerHelper("rowspan", function (context, options) {
  const spans = getspans(context, "interfaceType");
  return context
    .map(function (item, i) {
      const str = spans[i]
        ? `<td rowspan="${spans[i] - i}" class="is-center">${
            item.interfaceType
          }</td>`
        : "";
      return `<tr>${str}${options.fn(item)}</tr>`;
    })
    .join("\n");
});
Handlebars.registerHelper("rowspan1", function (context, options) {
  const spans = getspans(context, "method");
  return context
    .map(function (item, i) {
      const str = spans[i]
        ? `<td rowspan="${spans[i] - i}" class="is-center">${item.method}</td>`
        : "";
      const href = item.path
        ? item.path
        : item.id
        ? `#${item.id}`
        : `#${item.interface}`;
      const astr = `<td class="is-center"><a href="${href}">${item.interface}</a></td>`;
      return `<tr>
          ${str}
          ${astr}
          ${options.fn(item)}
      </tr>`;
    })
    .join("\n");
});
// Handlebars.registerHelper('ifDataTable', function (context, options) {
//     const spans = getspans(context, "data")
// })
// {{#isuiobject data "组件" "类型"}}{{/isuiobject}}
Handlebars.registerHelper("isuiobject", (value, k1, k2) => {
  return value[0] && "isUIObject" in value ? k1 : k2;
});

Handlebars.registerHelper("eval", function (fn, ...arg) {
  return eval(fn);
});

Handlebars.registerHelper("interfaceParam", (type, params = []) => {
  if (type === "quote") {
    return "";
  }
  if (type === "initiative") {
    return "(" + params.map((i) => i.param).join(", ") + ")";
  }
  if (type === "passive") {
    return (
      ".callback = function(" + params.map((i) => i.param).join(", ") + "){}"
    );
  }
});
const createTable = (tempKey, data) => Handlebars.compile(temps[tempKey])(data);

const createTableContainer = (klass, md, opt) => {
  const { servicePlatform, platform } = opt.currentNode;
  return [
    container,
    klass,
    {
      render: (tokens, idx) => {
        const token = tokens[idx];
        if (token.nesting === 1) {
          const { info } = token;
          if (info) {
            try {
              const obstr = info
                .replace(/^\s+|\s+$/, "")
                .replace(/^table\s+({.*})/, function (s, c) {
                  return c;
                });
              const ob = JSON.parse(obstr);
              const tags = servicePlatform + platform;
              const filePath = path.join(assetsPath, tags, ob.path);
              // delete require.cache[require.resolve(filePath)];
              for (const cachePath in require.cache) {
                if (cachePath.includes(tags)) {
                  delete require.cache[cachePath];
                }
              }
              const values = require(filePath);
              const value = values[ob.dataKey] || eval(`values.${ob.dataKey}`); // values[ob.dataKey];;
              let html = "";
              try {
                const opt = Object.assign(
                  {
                    md,
                    data: value,
                  },
                  ob
                );
                html = createTable(ob.template, opt);
              } catch (error) {
                console.log(`createTable error: ${error}`);
                console.log(`values.${ob.dataKey}`);
                console.log(ob.template);
                console.log(value);
              }
              return `${html}\n`;
            } catch (error) {
              console.log(`createTableContainer error: ${error}`);
              return `\n`;
            }
          }
        } else {
          return `\n`;
        }
      },
    },
  ];
};

const createWX = (tempKey, data) => Handlebars.compile(wxTemps[tempKey])(data);
const createWXContainer = (klass, md, opt) => {
  const { servicePlatform, platform } = opt.currentNode;
  return [
    container,
    klass,
    {
      render: (tokens, idx) => {
        const token = tokens[idx];
        if (token.nesting === 1) {
          const { info } = token;
          if (info) {
            try {
              const obstr = info
                .replace(/^\s+|\s+$/, "")
                .replace(/^wx\s+({.*})/, function (s, c) {
                  return c;
                });
              const ob = JSON.parse(obstr);
              const tags = servicePlatform + platform;
              const filePath = path.join(assetsPath, tags, ob.path);
              for (const cachePath in require.cache) {
                if (cachePath.includes(tags)) {
                  delete require.cache[cachePath];
                }
              }
              const value = require(filePath);
              let html = "";
              try {
                if (ob.template === "classify") {
                  const data = Object.assign({
                    notMeetApiList: value.filter((item) => !item.isMeetApi),
                    meetApiList: value.filter((item) => item.isMeetApi),
                  });
                  html = createWX(ob.template, data);
                } else if (ob.template === "block") {
                  html = value
                    .map((v) => createWX(ob.template, { data: v }))
                    .join("");
                } else if (ob.template === "desc") {
                  value.map((v) => {
                    Object.keys(v.data).forEach((key) => {
                      html += v.data[key]
                        .map((i) => {
                          return createWX(ob.template, {
                            data: i,
                            type: key,
                          });
                        })
                        .join("");
                    });
                  });
                }
              } catch (error) {
                console.log(`createWX error: ${error}`);
                console.log(`values.${ob.dataKey}`);
                console.log(ob.template);
                console.log(value);
              }
              return `${html}\n`;
            } catch (error) {
              console.log(`createWXContainer error: ${error}`);
              return `\n`;
            }
          }
        } else {
          return `\n`;
        }
      },
    },
  ];
};
