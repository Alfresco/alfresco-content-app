/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import {FolderRulesService} from "./folder-rules.service";
import {TestBed} from "@angular/core/testing";
// import {Rule} from "../model/rule.model";
import {take} from "rxjs/operators";
import {AlfrescoApiService, CoreTestingModule} from "@alfresco/adf-core";

fdescribe('FolderRulesService', () => {

  let folderRulesService: FolderRulesService,
    alfrescoApiService: AlfrescoApiService


  const dummyResponse = {
    "list": {
      "pagination": {
        "count": 2,
        "hasMoreItems": false,
        "totalItems": 2,
        "skipCount": 0,
        "maxItems": 100
      },
      "entries": [
        {
          "entry": {
            "shared": false,
            "cascade": false,
            "asynchronous": false,
            "name": "rule1",
            "id": "53273531-fb09-4bcc-97c9-dc1d2036275e",
            "triggers": [
              "INBOUND"
            ],
            "actions": [
              {
                "actionDefinitionId": "copy",
                "params": {
                  "deep-copy": false,
                  "destination-folder": "6c98161d-2aa1-4f06-9b37-ed46be28320d",
                  "actionContext": "rule"
                }
              }
            ],
            "enabled": true
          }
        },
        {
          "entry": {
            "shared": false,
            "cascade": false,
            "asynchronous": false,
            "name": "rule2",
            "id": "b21fbf98-41da-4023-bc7e-2e727b3324d4",
            "triggers": [
              "INBOUND"
            ],
            "actions": [
              {
                "actionDefinitionId": "move",
                "params": {
                  "destination-folder": "6c98161d-2aa1-4f06-9b37-ed46be28320d",
                  "actionContext": "rule"
                }
              }
            ],
            "enabled": true
          }
        }
      ]
    }
  }
  // const dummyRules: Partial<Rule>[] = [
  //   {
  //     "shared": false,
  //     "cascade": false,
  //     "asynchronous": false,
  //     "name": "rule1",
  //     "id": "53273531-fb09-4bcc-97c9-dc1d2036275e",
  //     "triggers": [
  //       "INBOUND"
  //     ],
  //     "actions": [
  //       {
  //         "actionDefinitionId": "copy",
  //         "params": {
  //           "deep-copy": false,
  //           "destination-folder": "6c98161d-2aa1-4f06-9b37-ed46be28320d",
  //           "actionContext": "rule"
  //         }
  //       }
  //     ],
  //     "enabled": true
  //   },
  //   {
  //     "shared": false,
  //     "cascade": false,
  //     "asynchronous": false,
  //     "name": "rule2",
  //     "id": "b21fbf98-41da-4023-bc7e-2e727b3324d4",
  //     "triggers": [
  //       "INBOUND"
  //     ],
  //     "actions": [
  //       {
  //         "actionDefinitionId": "move",
  //         "params": {
  //           "destination-folder": "6c98161d-2aa1-4f06-9b37-ed46be28320d",
  //           "actionContext": "rule"
  //         }
  //       }
  //     ],
  //     "enabled": true
  //   }
  // ]


  const firstRuleId = dummyResponse['list']['entries'][0]['entry'].id


  beforeEach((() => {

    TestBed.configureTestingModule({
      imports: [
        CoreTestingModule
    ],
      providers: [
        FolderRulesService
      ]
    })

    folderRulesService = TestBed.inject<FolderRulesService>(FolderRulesService)
    alfrescoApiService = TestBed.inject<AlfrescoApiService>(AlfrescoApiService)
  }))

  // it('should set a list of rules to observable', (done: DoneFn) => {
  //
  //   folderRulesService.loadAllRules()
  //
  //   setTimeout(() => {
  //
  //     let rules$ = folderRulesService.rulesListing$
  //
  //     rules$.subscribe(
  //       res => {
  //
  //         console.log(res)
  //
  //         expect(res).toBeTruthy('No response received')
  //
  //         // expect(res).toEqual(dummyRules)
  //
  //         expect(res[0].id).toBe(firstRuleId)
  //
  //         done()
  //
  //       }
  //     )
  //   })
  //
  //   const req = httpTestingController.expectOne(`https://acadev.envalfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/d91aa433-45f0-4c4c-9fb1-89ade91215aa/rule-sets/-default-/rules`)
  //   expect(req.request.method).toEqual('GET')
  //   req.flush(dummyResponse)
  //
  // })

  it('should set a list of rules to observable', async () => {

      spyOn(alfrescoApiService, 'getInstance').and.returnValue(
      {
        contentClient: {
          callApi: jasmine.createSpy('callApi').and.returnValue(dummyResponse)
        },
        reply: () => {}
      } as any
    );

    // spyOn(AlfrescoApiClient.prototype, 'callApi').and.returnValue(dummyResponse as any)
      // .withArgs('/nodes/d91aa433-45f0-4c4c-9fb1-89ade91215aa/rule-sets/-default-/rules', 'GET',
      //   {}, {}, {}, {}, {}, ['application/json'], ['application/json'])

    let rulesPromise = folderRulesService.rulesListing$
      .pipe(take(2))
      .toPromise();

    folderRulesService.loadAllRules()

    const rules = await rulesPromise

    console.log(rules)

    expect(rules).toBeTruthy('No response received')

    // expect(rules).toEqual(dummyRules)

    expect(rules[0].id).toBe(firstRuleId)

    // expect(request.method).toEqual('GET')

    // const req = httpTestingController.expectOne(`https://acadev.envalfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/d91aa433-45f0-4c4c-9fb1-89ade91215aa/rule-sets/-default-/rules`)

    // req.flush(dummyResponse)

  })


})

