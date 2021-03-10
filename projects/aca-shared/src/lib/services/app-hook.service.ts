import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppHookService {
  /**
   * Gets emitted when user reload the node
   */
  reload = new Subject<any>();

  /**
   * Gets emitted when user reset the node
   */
  reset = new Subject<any>();

  /**
   * Gets emitted when user delete the node
   */
  nodesDeleted = new Subject<any>();

  /**
   * Gets emitted when user delete the library
   */
  libraryDeleted = new Subject<string>();

  /**
   * Gets emitted when user reload the library
   */
  libraryCreated = new Subject<SiteEntry>();

  /**
   * Gets emitted when user update the library
   */
  libraryUpdated = new Subject<SiteEntry>();

  /**
   * Gets emitted when user join the library
   */
  libraryJoined = new Subject<string>();

  /**
   * Gets emitted when user left the library
   */
  libraryLeft = new Subject<string>();

  /**
   * Gets emitted when library throws 400 error code
   */
  library400Error = new Subject<any>();

  /**
   * Gets emitted when user join the library
   */
  joinLibraryToggle = new Subject<string>();

  /**
   * Gets emitted when user unlink the node
   */
  linksUnshared = new Subject<any>();

  /**
   * Gets emitted when user mark the the favorite library
   */
  favoriteLibraryToggle = new Subject<any>();
}
