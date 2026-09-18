const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });

  // Markdown-it custom configuration
  const mdOptions = {
    html: true,
    breaks: false,
    linkify: true
  };
  const mdLib = markdownIt(mdOptions);

  // Automated external link safety: inject target="_blank" and rel="noopener noreferrer"
  const defaultRender = mdLib.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  mdLib.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex('href');
    if (hrefIndex >= 0) {
      const href = tokens[idx].attrs[hrefIndex][1];
      if (/^https?:\/\//i.test(href)) {
        tokens[idx].attrPush(['target', '_blank']);
        tokens[idx].attrPush(['rel', 'noopener noreferrer']);
      }
    }
    return defaultRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", mdLib);

  // Custom filters
  eleventyConfig.addFilter("truncate", function(str, len = 140) {
    if (!str) return "";
    if (str.length <= len) return str;
    return str.substring(0, len).trim() + "...";
  });

  eleventyConfig.addFilter("wordCount", function(content) {
    if (!content) return 0;
    const clean = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return clean ? clean.split(" ").length : 0;
  });

  eleventyConfig.addFilter("dateIso", function(date) {
    return new Date(date || Date.now()).toISOString();
  });

  eleventyConfig.addFilter("year", function() {
    return new Date().getFullYear();
  });

  // Global collections
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/services/*.md").filter(item => !item.inputPath.endsWith("index.md"));
  });

  eleventyConfig.addCollection("pests", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pests/*.md").filter(item => !item.inputPath.endsWith("index.md"));
  });

  eleventyConfig.addCollection("locations", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/locations/*.md").filter(item => !item.inputPath.endsWith("index.md"));
  });

  eleventyConfig.addCollection("guides", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pest-control/*.md").filter(item => !item.inputPath.endsWith("index.md"));
  });

  eleventyConfig.addCollection("costs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pest-control-cost/*.md").filter(item => !item.inputPath.endsWith("index.md"));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
