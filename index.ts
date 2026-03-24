import { MCPServer, text, widget, object } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "widget-gallery",
  title: "Widget Gallery",
  version: "1.0.0",
  description: "All widget types side-by-side",
  baseUrl: process.env.MCP_URL || "http://localhost:3000",
  favicon: "favicon.ico",
  icons: [
    { src: "icon.svg", mimeType: "image/svg+xml", sizes: ["512x512"] },
  ],
});

// ─── A) React Widget (auto-discovered from resources/) ──────────────────────

server.tool(
  {
    name: "show-react-widget",
    description:
      "Show an interactive React widget (auto-discovered from resources/)",
    schema: z.object({
      name: z.string().optional().describe("Your name"),
    }),
    widget: {
      name: "react-showcase",
      invoking: "Loading...",
      invoked: "Ready",
    },
  },
  async ({ name }) => {
    return widget({
      props: { name: name ?? "World", type: "react" },
      output: text("Showing React widget from resources/ folder"),
    });
  }
);

// ─── B) Raw HTML Widget ─────────────────────────────────────────────────────

server.uiResource({
  type: "rawHtml",
  name: "html-greeting",
  title: "HTML Greeting Card",
  props: {
    name: { type: "string", required: true, description: "Name to greet" },
    color: {
      type: "string",
      required: false,
      description: "Background color",
    },
  },
  htmlContent: `
    <div style="padding: 24px; border-radius: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: system-ui; text-align: center;">
      <h1 style="margin: 0 0 8px; font-size: 28px;">👋 Hello, {{name}}!</h1>
      <p style="margin: 0; opacity: 0.9;">This widget is rendered from raw HTML — no React, no build step.</p>
      <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.15); border-radius: 8px; font-size: 14px;">
        <code>server.uiResource({ type: "rawHtml" })</code>
      </div>
    </div>
  `,
  exposeAsTool: true,
});

// ─── C) RemoteDom Widget (MCP-UI) ──────────────────────────────────────────

server.uiResource({
  type: "remoteDom",
  name: "mcp-ui-poll",
  title: "Quick Poll",
  props: {
    question: {
      type: "string",
      required: true,
      description: "Poll question",
    },
  },
  script: `
    const container = document.createElement('ui-stack');
    container.setAttribute('direction', 'column');
    container.setAttribute('gap', '12');

    const title = document.createElement('ui-text');
    title.setAttribute('variant', 'heading');
    title.textContent = '📊 ' + (props.question || 'What do you think?');
    container.appendChild(title);

    const options = ['👍 Great', '🤔 Interesting', '👎 Not for me'];
    let selected = null;
    const buttons = [];

    options.forEach((opt, i) => {
      const btn = document.createElement('ui-button');
      btn.textContent = opt;
      btn.setAttribute('variant', 'secondary');
      btn.addEventListener('click', () => {
        selected = i;
        result.textContent = 'You voted: ' + opt;
        buttons.forEach((b, j) => {
          b.setAttribute('variant', j === i ? 'primary' : 'secondary');
        });
      });
      container.appendChild(btn);
      buttons.push(btn);
    });

    const result = document.createElement('ui-text');
    result.setAttribute('variant', 'body');
    result.textContent = 'Click to vote!';
    container.appendChild(result);

    const footer = document.createElement('ui-text');
    footer.setAttribute('variant', 'caption');
    footer.textContent = 'Built with server.uiResource({ type: "remoteDom" })';
    container.appendChild(footer);

    document.body.appendChild(container);
  `,
  exposeAsTool: true,
});

// ─── D) Programmatic mcpApps Widget ─────────────────────────────────────────

server.uiResource({
  type: "mcpApps",
  name: "programmatic-counter",
  title: "Programmatic Counter",
  props: {
    initial: {
      type: "number",
      required: false,
      description: "Initial count",
    },
    label: {
      type: "string",
      required: false,
      description: "Counter label",
    },
  },
  htmlTemplate: `<!DOCTYPE html>
<html>
<head><style>
  body { margin: 0; font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100px; }
  .counter { text-align: center; padding: 24px; }
  .count { font-size: 48px; font-weight: bold; color: #3b82f6; }
  .label { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
  .buttons { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
  button { padding: 8px 20px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer; font-size: 16px; }
  button:hover { background: #f3f4f6; }
  .meta { margin-top: 12px; font-size: 12px; color: #9ca3af; }
</style></head>
<body>
  <div class="counter">
    <div class="label" id="label">Counter</div>
    <div class="count" id="count">0</div>
    <div class="buttons">
      <button onclick="decrement()">−</button>
      <button onclick="increment()">+</button>
    </div>
    <div class="meta"><code>server.uiResource({ type: "mcpApps" })</code></div>
  </div>
  <script>
    let count = 0;
    function increment() { count++; update(); }
    function decrement() { count--; update(); }
    function update() { document.getElementById('count').textContent = count; }
    const params = new URLSearchParams(window.location.search);
    if (params.get('initial')) { count = parseInt(params.get('initial')); update(); }
    if (params.get('label')) { document.getElementById('label').textContent = params.get('label'); }
  </script>
</body>
</html>`,
  exposeAsTool: true,
  metadata: {
    prefersBorder: true,
    autoResize: true,
  },
});

// ─── E) Client Detection Tool ───────────────────────────────────────────────

server.tool(
  {
    name: "detect-client",
    description:
      "Show info about the connecting client and its capabilities",
    schema: z.object({}),
  },
  async (_params, ctx) => {
    const info = ctx.client.info();
    const supportsApps = ctx.client.supportsApps();
    const capabilities = ctx.client.capabilities();

    return text(
      `Client Info:\n` +
        `  Name: ${info.name ?? "unknown"}\n` +
        `  Version: ${info.version ?? "unknown"}\n` +
        `  Supports MCP Apps: ${supportsApps}\n` +
        `  Capabilities: ${JSON.stringify(capabilities, null, 2)}`
    );
  }
);

server.listen().then(() => console.log("Widget Gallery running"));
