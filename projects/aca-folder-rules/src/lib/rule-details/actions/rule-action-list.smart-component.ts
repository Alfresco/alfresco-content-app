import { Component } from '@angular/core';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'aca-rule-action-list',
  templateUrl: './rule-action-list.smart-component.html',
  styleUrls: ['./rule-action-list.smart-component.scss']
})
export class RuleActionListSmartComponent {
  constructor(public actionsService: ActionsService) {
    this.actionsService.loadActionDefinitions();
    this.actionsService.actionDefinitionsListing$.subscribe((val) => {
      console.log(val);
    });
  }
}
