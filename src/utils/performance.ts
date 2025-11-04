/**
 * Performance monitoring utilities
 * Tracks Web Vitals and performance metrics
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  fid?: number; // First Input Delay (deprecated, use INP)
  lcp?: number; // Largest Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint

  // Performance marks
  marks: Map<string, number>;
  measures: Map<string, number>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    marks: new Map(),
    measures: new Map(),
  };

  private onMetricCallback?: (metric: Metric) => void;

  /**
   * Initialize Web Vitals tracking
   */
  init(onMetric?: (metric: Metric) => void) {
    this.onMetricCallback = onMetric;

    // Track Core Web Vitals
    onCLS((metric) => {
      this.metrics.cls = metric.value;
      this.handleMetric(metric);
    });

    onFCP((metric) => {
      this.metrics.fcp = metric.value;
      this.handleMetric(metric);
    });

    onFID((metric) => {
      this.metrics.fid = metric.value;
      this.handleMetric(metric);
    });

    onLCP((metric) => {
      this.metrics.lcp = metric.value;
      this.handleMetric(metric);
    });

    onTTFB((metric) => {
      this.metrics.ttfb = metric.value;
      this.handleMetric(metric);
    });

    onINP((metric) => {
      this.metrics.inp = metric.value;
      this.handleMetric(metric);
    });

    // Track performance marks for key interactions
    this.trackPerformanceMarks();
  }

  /**
   * Handle a Web Vital metric
   */
  private handleMetric(metric: Metric) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}`, metric);
    }

    // Call custom callback if provided
    if (this.onMetricCallback) {
      this.onMetricCallback(metric);
    }

    // Send to analytics if available
    this.sendToAnalytics(metric);
  }

  /**
   * Send metrics to analytics
   */
  private sendToAnalytics(metric: Metric) {
    // Use existing analytics tracking if available
    interface WindowWithTrackEvent extends Window {
      trackEvent?: (event: {
        event: string;
        category: string;
        label: string;
        value: number;
        properties?: Record<string, unknown>;
      }) => void;
    }
    const windowWithTrackEvent = window as WindowWithTrackEvent;
    if (typeof window !== 'undefined' && windowWithTrackEvent.trackEvent) {
      windowWithTrackEvent.trackEvent({
        event: 'web_vital',
        category: 'performance',
        label: metric.name,
        value: Math.round(metric.value),
        properties: {
          id: metric.id,
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          navigationType: metric.navigationType,
        },
      });
    }
  }

  /**
   * Track performance marks for key interactions
   */
  private trackPerformanceMarks() {
    // Mark initial page load
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('page-load-start');

      // Mark when DOM is ready
      if (document.readyState === 'complete') {
        performance.mark('dom-ready');
      } else {
        window.addEventListener('load', () => {
          performance.mark('dom-ready');
          this.measure('page-load', 'page-load-start', 'dom-ready');
        });
      }
    }
  }

  /**
   * Create a performance mark
   */
  mark(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
      this.metrics.marks.set(name, performance.now());
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number | null {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        const measure = endMark
          ? performance.measure(name, startMark, endMark)
          : performance.measure(name, startMark);

        const duration = measure.duration;
        this.metrics.measures.set(name, duration);

        return duration;
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
        return null;
      }
    }
    return null;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get a specific metric value
   */
  getMetric(name: keyof Omit<PerformanceMetrics, 'marks' | 'measures'>): number | undefined {
    return this.metrics[name];
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    let score = 100;
    const penalties: number[] = [];

    // FCP penalty (>1.8s is slow)
    if (this.metrics.fcp && this.metrics.fcp > 1800) {
      penalties.push(Math.min(15, (this.metrics.fcp - 1800) / 100));
    }

    // LCP penalty (>2.5s is slow)
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      penalties.push(Math.min(20, (this.metrics.lcp - 2500) / 100));
    }

    // CLS penalty (>0.1 is poor)
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      penalties.push(Math.min(20, this.metrics.cls * 100));
    }

    // TBT penalty (>300ms is slow) - approximate from INP
    if (this.metrics.inp && this.metrics.inp > 200) {
      penalties.push(Math.min(15, (this.metrics.inp - 200) / 10));
    }

    // TTFB penalty (>800ms is slow)
    if (this.metrics.ttfb && this.metrics.ttfb > 800) {
      penalties.push(Math.min(10, (this.metrics.ttfb - 800) / 100));
    }

    score -= penalties.reduce((sum, penalty) => sum + penalty, 0);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    return (
      (this.metrics.fcp === undefined || this.metrics.fcp < 1800) &&
      (this.metrics.lcp === undefined || this.metrics.lcp < 2500) &&
      (this.metrics.cls === undefined || this.metrics.cls < 0.1) &&
      (this.metrics.inp === undefined || this.metrics.inp < 200) &&
      (this.metrics.ttfb === undefined || this.metrics.ttfb < 800)
    );
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(onMetric?: (metric: Metric) => void): void {
  if (typeof window !== 'undefined') {
    performanceMonitor.init(onMetric);
  }
}

/**
 * Mark a performance milestone
 */
export function markPerformance(name: string): void {
  performanceMonitor.mark(name);
}

/**
 * Measure performance between marks
 */
export function measurePerformance(name: string, startMark: string, endMark?: string): number | null {
  return performanceMonitor.measure(name, startMark, endMark);
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return performanceMonitor.getMetrics();
}

/**
 * Get performance score
 */
export function getPerformanceScore(): number {
  return performanceMonitor.getPerformanceScore();
}

/**
 * Check if performance meets targets
 */
export function isPerformanceGood(): boolean {
  return performanceMonitor.isPerformanceGood();
}
