import { describe, it, expect } from "vitest";
import { calculateRateLimitState, MAX_ATTEMPTS, BLOCK_DURATION_MINUTES } from "../rate-limit";

describe("Rate Limit Policy Logic", () => {
  it("allows first failures and increases attempts", () => {
    const now = new Date();
    const windowStartedAt = new Date(now.getTime() - 1 * 60 * 1000); // 1 min ago
    
    const state = calculateRateLimitState(1, windowStartedAt, now);
    expect(state.attempts).toBe(2);
    expect(state.windowStartedAt).toBe(windowStartedAt);
    expect(state.blockedUntil).toBeNull();
  });

  it("blocks user when threshold is reached", () => {
    const now = new Date();
    const windowStartedAt = new Date(now.getTime() - 5 * 60 * 1000); // 5 mins ago
    
    const state = calculateRateLimitState(MAX_ATTEMPTS - 1, windowStartedAt, now);
    expect(state.attempts).toBe(MAX_ATTEMPTS);
    expect(state.blockedUntil).toBeInstanceOf(Date);
    expect(state.blockedUntil?.getTime()).toBeGreaterThan(now.getTime());
  });

  it("resets expired attempt window", () => {
    const now = new Date();
    const windowStartedAt = new Date(now.getTime() - (BLOCK_DURATION_MINUTES + 1) * 60 * 1000); // older than window
    
    // Even if previous attempts were at max, the window reset overrides it
    const state = calculateRateLimitState(MAX_ATTEMPTS, windowStartedAt, now);
    expect(state.attempts).toBe(1);
    expect(state.windowStartedAt).toBe(now);
    expect(state.blockedUntil).toBeNull();
  });
});
