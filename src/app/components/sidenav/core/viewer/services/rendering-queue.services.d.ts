/**
 *
 * RenderingQueueServices rendering of the views for pages and thumbnails.
 *
 */
export declare class RenderingQueueServices {
  renderingStates: {
    INITIAL: number;
    RUNNING: number;
    PAUSED: number;
    FINISHED: number;
  };
  CLEANUP_TIMEOUT: number;
  pdfViewer: any;
  pdfThumbnailViewer: any;
  onIdle: any;
  highestPriorityPage: any;
  idleTimeout: any;
  printing: any;
  isThumbnailViewEnabled: any;
  /**
   * @param pdfViewer
   */
  setViewer(pdfViewer: any): void;
  /**
   * @param pdfThumbnailViewer
   */
  setThumbnailViewer(pdfThumbnailViewer: any): void;
  /**
   * @param  view
   */
  isHighestPriority(view: any): boolean;
  renderHighestPriority(currentlyVisiblePages: any): void;
  getHighestPriority(visible: any, views: any, scrolledDown: any): any;
  /**
   * @param view
   */
  isViewFinished(view: any): boolean;
  /**
   * Render a page or thumbnail view. This calls the appropriate function
   * based on the views state. If the view is already rendered it will return
   * false.
   * @param view
   */
  renderView(view: any): boolean;
}
