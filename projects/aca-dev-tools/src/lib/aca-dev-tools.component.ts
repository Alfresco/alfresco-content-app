import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'aca-dev-tools-main',
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

        const schemaUri = routeData.schemaUri;
        const getSchema = this.http.get(routeData.schemaPath);
        const getConfig = this.http.get(routeData.configPath, {
            responseType: 'text'
        });

        forkJoin([getSchema, getConfig]).subscribe(
            ([schema, config]) => {
                let code = config;

                const override = sessionStorage.getItem('aca.extension.config');
                if (override) {
                    code = override;
                }

                this.model = {
                    language: 'json',
                    uri: 'app.extensions.json',
                    value: code,
                    schemas: [
                        {
                            uri: schemaUri,
                            schema
                        }
                    ]
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

    download() {
        const element = document.createElement('a');
        element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(this.code)
        );
        element.setAttribute('download', 'plugin.json');
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
