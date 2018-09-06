/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { ThumbnailService } from '@alfresco/adf-core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output,
    QueryList, ViewEncapsulation, ViewChild, ViewChildren, ElementRef, TemplateRef, ContentChild } from '@angular/core';
import { MinimalNodeEntity, QueryBody } from 'alfresco-js-api';
import { Subject } from 'rxjs';
import { MatListItem } from '@angular/material';
import { debounceTime, filter } from 'rxjs/operators';
import { EmptySearchResultComponent, SearchComponent } from '@alfresco/adf-content-services';

@Component({
    selector: 'app-search-input-control',
    templateUrl: './search-input-control.component.html',
    styleUrls: ['./search-input-control.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('active', style({ transform: 'translateX(0%)', 'margin-left': '13px' })),
            state('inactive', style({ transform: 'translateX(81%)'})),
            state('no-animation', style({ transform: 'translateX(0%)', width: '100%' })),
            transition('inactive => active',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
            transition('active => inactive',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
        ])
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-control' }
})
export class SearchInputControlComponent implements OnInit, OnDestroy {

    /** Toggles whether to use an expanding search control. If false
     * then a regular input is used.
     */
    @Input()
    expandable = true;

    /** Toggles highlighting of the search term in the results. */
    @Input()
    highlight = false;

    /** Type of the input field to render, e.g. "search" or "text" (default). */
    @Input()
    inputType = 'text';

    /** Toggles auto-completion of the search input field. */
    @Input()
    autocomplete = false;

    /** Toggles "find-as-you-type" suggestions for possible matches. */
    @Input()
    liveSearchEnabled = true;

    /** Maximum number of results to show in the live search. */
    @Input()
    liveSearchMaxResults = 5;

    /** @deprecated in 2.1.0 */
    @Input()
    customQueryBody: QueryBody;

    /** Emitted when the search is submitted pressing ENTER button.
     * The search term is provided as value of the event.
     */
    @Output()
    submit: EventEmitter<any> = new EventEmitter();

    /** Emitted when the search term is changed. The search term is provided
     * in the 'value' property of the returned object.  If the term is less
     * than three characters in length then the term is truncated to an empty
     * string.
     */
    @Output()
    searchChange: EventEmitter<string> = new EventEmitter();

    /** Emitted when a file item from the list of "find-as-you-type" results is selected. */
    @Output()
    optionClicked: EventEmitter<any> = new EventEmitter();

    @ViewChild('search')
    searchAutocomplete: SearchComponent;

    @ViewChild('searchInput')
    searchInput: ElementRef;

    @ViewChildren(MatListItem)
    private listResultElement: QueryList<MatListItem>;

    @ContentChild(EmptySearchResultComponent)
    emptySearchTemplate: EmptySearchResultComponent;

    searchTerm = '';
    subscriptAnimationState: string;
    noSearchResultTemplate: TemplateRef <any> = null;
    skipToggle = false;
    toggleDebounceTime = 200;

    private toggleSearch = new Subject<any>();
    private focusSubject = new Subject<FocusEvent>();

    constructor(private thumbnailService: ThumbnailService) {

        this.toggleSearch.asObservable().pipe(debounceTime(this.toggleDebounceTime)).subscribe(() => {
            if (this.expandable && !this.skipToggle) {
                this.subscriptAnimationState = this.subscriptAnimationState === 'inactive' ? 'active' : 'inactive';

                if (this.subscriptAnimationState === 'inactive') {
                    this.searchTerm = '';
                    this.searchAutocomplete.resetResults();
                    if ( document.activeElement.id === this.searchInput.nativeElement.id) {
                        this.searchInput.nativeElement.blur();
                    }
                }
            }
            this.skipToggle = false;
        });
    }

    applySearchFocus(animationDoneEvent) {
        if (animationDoneEvent.toState === 'active') {
            this.searchInput.nativeElement.focus();
        }
    }

    ngOnInit() {
        this.subscriptAnimationState = this.expandable ? 'inactive' : 'no-animation';
        this.setupFocusEventHandlers();
    }

    isNoSearchTemplatePresent(): boolean {
        return this.emptySearchTemplate ? true : false;
    }

    ngOnDestroy(): void {
        if (this.focusSubject) {
            this.focusSubject.unsubscribe();
            this.focusSubject = null;
        }

        if (this.toggleSearch) {
            this.toggleSearch.unsubscribe();
            this.toggleSearch = null;
        }
    }

    searchSubmit(event: any) {
        this.submit.emit(event);
        this.toggleSearchBar();
    }

    inputChange(event: any) {
        this.searchChange.emit(event);
    }

    getAutoComplete(): string {
        return this.autocomplete ? 'on' : 'off';
    }

    getMimeTypeIcon(node: MinimalNodeEntity): string {
        let mimeType;

        if (node.entry.content && node.entry.content.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }

        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    isSearchBarActive() {
        return this.subscriptAnimationState === 'active' && this.liveSearchEnabled;
    }

    toggleSearchBar() {
        if (this.toggleSearch) {
            this.toggleSearch.next();
        }
    }

    elementClicked(item: any) {
        if (item.entry) {
            this.optionClicked.next(item);
            this.toggleSearchBar();
        }
    }

    onFocus($event): void {
        this.focusSubject.next($event);
    }

    onBlur($event): void {
        this.focusSubject.next($event);
    }

    activateToolbar() {
        if (!this.isSearchBarActive()) {
            this.toggleSearchBar();
        }
    }

    selectFirstResult() {
        if ( this.listResultElement && this.listResultElement.length > 0) {
            const firstElement: MatListItem = <MatListItem> this.listResultElement.first;
            firstElement._getHostElement().focus();
        }
    }

    onRowArrowDown($event: KeyboardEvent): void {
        const nextElement: any = this.getNextElementSibling(<Element> $event.target);
        if (nextElement) {
            nextElement.focus();
        }
    }

    onRowArrowUp($event: KeyboardEvent): void {
        const previousElement: any = this.getPreviousElementSibling(<Element> $event.target);
        if (previousElement) {
            previousElement.focus();
        } else {
            this.searchInput.nativeElement.focus();
            this.focusSubject.next(new FocusEvent('focus'));
        }
    }

    private setupFocusEventHandlers() {
        this.focusSubject.pipe(
            debounceTime(50),
            filter(($event: any) => {
                return this.isSearchBarActive() && ($event.type === 'blur' || $event.type === 'focusout');
            })
        ).subscribe(() => {
            this.toggleSearchBar();
        });
    }

    clear(event: any) {
        this.searchTerm = '';
        this.searchChange.emit('');
        this.skipToggle = true;
    }

    private getNextElementSibling(node: Element): Element {
        return node.nextElementSibling;
    }

    private getPreviousElementSibling(node: Element): Element {
        return node.previousElementSibling;
    }

}
