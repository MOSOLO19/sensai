// Simple rate limiter for Gemini API
class RateLimiter {
  constructor(maxRequests = 150, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async waitForAvailability() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(now);
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Wrapper for Gemini API calls with retry logic
export async function withRateLimit(apiCall, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await rateLimiter.waitForAvailability();
      const result = await apiCall();
      
      // Log success for monitoring
      console.log(`AI API call successful on attempt ${attempt + 1}`);
      
      return result;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      
      // Log error for monitoring
      console.error(`AI API call failed on attempt ${attempt + 1}:`, error.message);
      
      if (isLastAttempt) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000))
      );
    }
  }
} 