import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'lib-aca-dev-tools',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'lib-aca-dev-tools' },
    templateUrl: './aca-dev-tools.component.html',
    styleUrls: ['./aca-dev-tools.component.scss']
})
export class AcaDevToolsComponent implements OnInit {
    model: CodeModel = null;

    private code: string;

    constructor(private route: ActivatedRoute, private http: HttpClient) {}

    ngOnInit() {
        const routeData = this.route.snapshot.data;
        if (!routeData) {
            return;
        }

        this.http.get(routeData.configPath, { responseType: 'text' }).subscribe(
            config => {
                let code = config;

                const override = sessionStorage.getItem('aca.extension.config');
                if (override) {
                    code = override;
                }

                this.model = {
                    language: 'json',
                    uri: 'app.extensions.json',
                    value: code
                };
                this.code = code;
            },
            err => {
                console.log(err);
            }
        );
    }

    onCodeChanged(value: string) {
        this.code = value;
    }

    saveChanges() {
        sessionStorage.setItem('aca.extension.config', this.code);
        // window.location.reload(true);
    }

    revertChanges() {
        sessionStorage.removeItem('aca.extension.config');
        window.location.reload(true);
    }
}
