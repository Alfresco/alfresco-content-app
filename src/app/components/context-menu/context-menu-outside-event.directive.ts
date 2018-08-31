import { Directive, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Directive({
  selector: '[acaContextMenuOutsideEvent]'
})

export class OutsideEventDirective implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    @Output() clickOutside: EventEmitter<null> = new EventEmitter();

    constructor() {}

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            fromEvent(document.body, 'click')
                .pipe(delay(1))
                .subscribe(() => this.clickOutside.next())
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
