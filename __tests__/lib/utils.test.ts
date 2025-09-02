import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatPhoneNumber, logger } from "@/lib/utils";

describe("Utils", () => {
  describe("formatPhoneNumber", () => {
    it("should format 11-digit phone number correctly", () => {
      const result = formatPhoneNumber("11987654321");
      expect(result).toBe("(11) 98765-4321");
    });

    it("should format 10-digit phone number correctly", () => {
      const result = formatPhoneNumber("1187654321");
      expect(result).toBe("(11) 8765-4321");
    });

    it("should handle phone number with special characters", () => {
      const result = formatPhoneNumber("(11) 98765-4321");
      expect(result).toBe("(11) 98765-4321");
    });

    it("should handle phone number with spaces", () => {
      const result = formatPhoneNumber("11 98765 4321");
      expect(result).toBe("(11) 98765-4321");
    });

    it("should return original number if cannot format", () => {
      const result = formatPhoneNumber("12345");
      expect(result).toBe("12345");
    });

    it("should handle null input", () => {
      const result = formatPhoneNumber(null);
      expect(result).toBe("Não informado");
    });

    it("should handle undefined input", () => {
      const result = formatPhoneNumber(undefined);
      expect(result).toBe("Não informado");
    });

    it("should handle empty string", () => {
      const result = formatPhoneNumber("");
      expect(result).toBe("Não informado");
    });
  });

  describe("logger", () => {
    let originalEnv: string | undefined;
    let consoleSpy: any;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
      consoleSpy = {
        error: vi.spyOn(console, "error").mockImplementation(() => {}),
        warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
        info: vi.spyOn(console, "info").mockImplementation(() => {}),
      };
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      vi.restoreAllMocks();
    });

    it("should log error in development environment", () => {
      process.env.NODE_ENV = "development";
      const error = new Error("Test error");

      logger.error("Test error message", error);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Test error message",
        error
      );
    });

    it("should not log error in production environment", () => {
      process.env.NODE_ENV = "production";
      const error = new Error("Test error");

      logger.error("Test error message", error);

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it("should log warning in development environment", () => {
      process.env.NODE_ENV = "development";
      const data = { key: "value" };

      logger.warn("Test warning message", data);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        "Test warning message",
        data
      );
    });

    it("should not log warning in production environment", () => {
      process.env.NODE_ENV = "production";
      const data = { key: "value" };

      logger.warn("Test warning message", data);

      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it("should log info in development environment", () => {
      process.env.NODE_ENV = "development";
      const data = { key: "value" };

      logger.info("Test info message", data);

      expect(consoleSpy.info).toHaveBeenCalledWith("Test info message", data);
    });

    it("should not log info in production environment", () => {
      process.env.NODE_ENV = "production";
      const data = { key: "value" };

      logger.info("Test info message", data);

      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it("should handle logger calls without data parameter", () => {
      process.env.NODE_ENV = "development";

      logger.error("Test error message");
      logger.warn("Test warning message");
      logger.info("Test info message");

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Test error message",
        undefined
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        "Test warning message",
        undefined
      );
      expect(consoleSpy.info).toHaveBeenCalledWith(
        "Test info message",
        undefined
      );
    });
  });
});
