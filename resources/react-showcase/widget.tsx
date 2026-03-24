import {
  McpUseProvider,
  useWidget,
  type WidgetMetadata,
} from "mcp-use/react";
import React, { useState } from "react";
import "../styles.css";
import { propSchema, type ReactShowcaseProps } from "./types";

export const widgetMetadata: WidgetMetadata = {
  description:
    "Interactive React widget showcase — auto-discovered from resources/",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: true,
    invoking: "Loading...",
    invoked: "Ready",
  },
};

const ReactShowcase: React.FC = () => {
  const { props, isPending, theme, displayMode, requestDisplayMode } =
    useWidget<ReactShowcaseProps>();

  const [count, setCount] = useState(0);

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div className="p-6 bg-white dark:bg-gray-950">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </span>
          </div>
        </div>
      </McpUseProvider>
    );
  }

  const isDark = theme === "dark";

  return (
    <McpUseProvider autoSize>
      <div className="p-6 space-y-5 bg-white dark:bg-gray-950">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            👋 Hello, {props?.name ?? "World"}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This is an auto-discovered React widget from{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">
              resources/
            </code>
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Counter
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              −
            </button>
            <span className="w-12 text-center text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {count}
            </span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              +
            </button>
          </div>
        </div>

        {/* Theme info */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Theme: {isDark ? "Dark" : "Light"}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Detected via <code>useWidget().theme</code>
            </p>
          </div>
        </div>

        {/* Display mode */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Display mode:{" "}
              <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">
                {displayMode}
              </code>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => requestDisplayMode("inline")}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                displayMode === "inline"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Inline
            </button>
            <button
              onClick={() => requestDisplayMode("fullscreen")}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                displayMode === "fullscreen"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Fullscreen
            </button>
          </div>
        </div>

        {/* Widget type badge */}
        {props?.type && (
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Widget type: <strong>{props.type}</strong>
          </div>
        )}
      </div>
    </McpUseProvider>
  );
};

export default ReactShowcase;
