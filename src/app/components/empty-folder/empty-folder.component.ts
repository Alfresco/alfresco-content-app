import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-empty-folder',
  templateUrl: './empty-folder.component.html',
  styleUrls: ['./empty-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: { class: 'app-empty-folder' }
})
export class EmptyFolderComponent {

    @Input()
    icon = 'cake';

    @Input()
    title = '';

    @Input()
    subtitle = '';
}
