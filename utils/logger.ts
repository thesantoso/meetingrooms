export interface ApiLog {
  type: "REQUEST" | "RESPONSE" | "ERROR";
  method: string;
  url: string;
  timestamp: string;
  duration?: number;
  status?: number;
  headers?: Record<string, string>;
  data?: any;
  error?: any;
}

class ApiLogger {
  private isEnabled: boolean = __DEV__;
  private logs: ApiLog[] = [];
  private maxLogs: number = 100;

  constructor() {
    if (this.isEnabled) {
      console.log("🚀 API Logger initialized - Debug mode enabled");
    }
  }

  enable() {
    this.isEnabled = true;
    console.log("🔍 API Debug Logger enabled");
  }

  disable() {
    this.isEnabled = false;
    console.log("🔇 API Debug Logger disabled");
  }

  private formatTimestamp(): string {
    return new Date().toISOString().split("T")[1].split(".")[0];
  }

  private addToHistory(log: ApiLog) {
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  logRequest(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, string>
  ) {
    if (!this.isEnabled) return;

    const timestamp = this.formatTimestamp();
    const log: ApiLog = {
      type: "REQUEST",
      method: method.toUpperCase(),
      url,
      timestamp,
      data,
      headers,
    };

    this.addToHistory(log);

    console.log(
      `%c🚀 API REQUEST [${timestamp}]`,
      "color: #2196F3; font-weight: bold;",
      `\n📍 ${method.toUpperCase()} ${url}`,
      data ? `\n📦 Data:` : "",
      data ? data : "",
      headers ? `\n📋 Headers:` : "",
      headers ? headers : ""
    );
  }

  logResponse(
    method: string,
    url: string,
    status: number,
    data: any,
    duration: number,
    headers?: Record<string, string>
  ) {
    if (!this.isEnabled) return;

    const timestamp = this.formatTimestamp();
    const isSuccess = status >= 200 && status < 300;

    const log: ApiLog = {
      type: "RESPONSE",
      method: method.toUpperCase(),
      url,
      timestamp,
      status,
      duration,
      data,
      headers,
    };

    this.addToHistory(log);

    const statusColor = isSuccess ? "#4CAF50" : "#F44336";
    const statusIcon = isSuccess ? "✅" : "❌";

    console.log(
      `%c${statusIcon} API RESPONSE [${timestamp}] ${duration}ms`,
      `color: ${statusColor}; font-weight: bold;`,
      `\n📍 ${method.toUpperCase()} ${url}`,
      `\n📊 Status: ${status}`,
      `\n⏱️ Duration: ${duration}ms`,
      `\n📦 Response:`,
      data,
      headers ? `\n📋 Headers:` : "",
      headers ? headers : ""
    );
  }

  logError(method: string, url: string, error: any, duration?: number) {
    if (!this.isEnabled) return;

    const timestamp = this.formatTimestamp();
    const log: ApiLog = {
      type: "ERROR",
      method: method.toUpperCase(),
      url,
      timestamp,
      duration,
      error,
    };

    this.addToHistory(log);

    console.error(
      `%c💥 API ERROR [${timestamp}] ${duration ? duration + "ms" : ""}`,
      "color: #F44336; font-weight: bold;",
      `\n📍 ${method.toUpperCase()} ${url}`,
      `\n❌ Error:`,
      error,
      duration ? `\n⏱️ Duration: ${duration}ms` : ""
    );
  }

  // Get logs for debugging
  getLogs(): ApiLog[] {
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    if (this.isEnabled) {
      console.log("🗑️ API logs cleared");
    }
  }

  // Print logs summary
  printSummary() {
    if (!this.isEnabled) return;

    const requests = this.logs.filter((log) => log.type === "REQUEST").length;
    const responses = this.logs.filter((log) => log.type === "RESPONSE").length;
    const errors = this.logs.filter((log) => log.type === "ERROR").length;

    console.log(
      "%c📊 API LOGS SUMMARY",
      "color: #9C27B0; font-weight: bold; font-size: 14px;",
      `\n📤 Requests: ${requests}`,
      `\n📥 Responses: ${responses}`,
      `\n❌ Errors: ${errors}`,
      `\n📋 Total Logs: ${this.logs.length}`
    );
  }
}

// Export singleton instance
export const apiLogger = new ApiLogger();

// Export for global access in development
if (__DEV__) {
  // @ts-ignore
  global.apiLogger = apiLogger;
  console.log("💡 Access logger globally with: apiLogger.printSummary()");
}
