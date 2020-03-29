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
import * as tslib_1 from "tslib";
import { browser, protractor, ExpectedConditions as EC, by } from 'protractor';
import { BROWSER_WAIT_TIMEOUT, E2E_ROOT_PATH, EXTENSIBILITY_CONFIGS } from '../configs';
var path = require('path');
var fs = require('fs');
var StreamZip = require('node-stream-zip');
var Utils = /** @class */ (function () {
    function Utils() {
    }
    // generate a random value
    Utils.random = function () {
        return Math.random().toString(36).substring(5, 10).toLowerCase();
    };
    // local storage
    Utils.clearLocalStorage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.executeScript('window.localStorage.clear();')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // session storage
    Utils.clearSessionStorage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.executeScript('window.sessionStorage.clear();')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.getSessionStorage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.executeScript('return window.sessionStorage.getItem("app.extension.config");')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Utils.setSessionStorageFromConfig = function (configFileName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var configFile, fileContent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configFile = E2E_ROOT_PATH + "/resources/extensibility-configs/" + configFileName;
                        fileContent = JSON.stringify(fs.readFileSync(configFile, { encoding: 'utf8' }));
                        return [4 /*yield*/, browser.executeScript("window.sessionStorage.setItem('app.extension.config', " + fileContent + ");")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.resetExtensionConfig = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var defConfig;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defConfig = E2E_ROOT_PATH + "/resources/extensibility-configs/" + EXTENSIBILITY_CONFIGS.DEFAULT_EXTENSIONS_CONFIG;
                        return [4 /*yield*/, this.setSessionStorageFromConfig(defConfig)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.retryCall = function (fn, retry, delay) {
        if (retry === void 0) { retry = 30; }
        if (delay === void 0) { delay = 1000; }
        var pause = function (duration) { return new Promise(function (res) { return setTimeout(res, duration); }); };
        var run = function (retries) {
            return fn().catch(function (err) { return (retries > 1 ? pause(delay).then(function () { return run(retries - 1); }) : Promise.reject(err)); });
        };
        return run(retry);
    };
    Utils.waitUntilElementClickable = function (element) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.elementToBeClickable(element), BROWSER_WAIT_TIMEOUT).catch(Error)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.typeInField = function (elem, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var i, c;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < value.length)) return [3 /*break*/, 5];
                        c = value.charAt(i);
                        return [4 /*yield*/, elem.sendKeys(c)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.sleep(100)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Utils.clearFieldWithBackspace = function (elem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var text, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, elem.getAttribute('value')];
                    case 1:
                        text = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < text.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, elem.sendKeys(protractor.Key.BACK_SPACE)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Utils.fileExistsOnOS = function (fileName, folderName, subFolderName) {
        if (folderName === void 0) { folderName = ''; }
        if (subFolderName === void 0) { subFolderName = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, filePath, tries;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.getProcessedConfig()];
                    case 1:
                        config = _a.sent();
                        filePath = path.join(config.params.downloadFolder, folderName, subFolderName, fileName);
                        tries = 15;
                        return [2 /*return*/, new Promise(function (resolve) {
                                var checkExist = setInterval(function () {
                                    fs.access(filePath, function (error) {
                                        tries--;
                                        if (error && tries === 0) {
                                            clearInterval(checkExist);
                                            resolve(false);
                                        }
                                        if (!error) {
                                            clearInterval(checkExist);
                                            resolve(true);
                                        }
                                    });
                                }, 500);
                            })];
                }
            });
        });
    };
    Utils.renameFile = function (oldName, newName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, oldFilePath, newFilePath, fileExists;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.getProcessedConfig()];
                    case 1:
                        config = _a.sent();
                        oldFilePath = path.join(config.params.downloadFolder, oldName);
                        newFilePath = path.join(config.params.downloadFolder, newName);
                        return [4 /*yield*/, this.fileExistsOnOS(oldName)];
                    case 2:
                        fileExists = _a.sent();
                        if (fileExists) {
                            fs.rename(oldFilePath, newFilePath, function (err) {
                                if (err) {
                                    console.log('==== rename err: ', err);
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.unzip = function (filename, unzippedName) {
        if (unzippedName === void 0) { unzippedName = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, filePath, output, zip;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.getProcessedConfig()];
                    case 1:
                        config = _a.sent();
                        filePath = path.join(config.params.downloadFolder, filename);
                        output = path.join(config.params.downloadFolder, unzippedName ? unzippedName : '');
                        zip = new StreamZip({
                            file: filePath,
                            storeEntries: true
                        });
                        return [4 /*yield*/, zip.on('error', function (err) { console.log('=== unzip err: ', err); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, zip.on('ready', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!unzippedName) return [3 /*break*/, 2];
                                            return [4 /*yield*/, fs.mkdirSync(output)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, zip.extract(null, output, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                return tslib_1.__generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, zip.close()];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                        case 3:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.pressEscape = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.actions().sendKeys(protractor.Key.ESCAPE).perform()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.pressTab = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.actions().sendKeys(protractor.Key.TAB).perform()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.pressCmd = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.actions().sendKeys(protractor.Key.COMMAND).perform()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.releaseKeyPressed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.actions().sendKeys(protractor.Key.NULL).perform()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.getBrowserLog = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.manage().logs().get('browser')];
            });
        });
    };
    Utils.formatDate = function (date) {
        return new Date(date).toLocaleDateString('en-US');
    };
    Utils.uploadFileNewVersion = function (fileFromOS) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var el;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        el = browser.element(by.id('app-upload-file-version'));
                        return [4 /*yield*/, el.sendKeys(E2E_ROOT_PATH + "/resources/test-files/" + fileFromOS)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.string257 = 'assembly doctor offender limit clearance inspiration baker fraud active apples trait brainstorm concept breaks down presidential \
    reluctance summary communication patience books opponent banana economist head develop project swear unanimous read conservation';
    Utils.string513 = 'great indirect brain tune other expectation fun silver drain tumble rhythm harmful wander picture distribute opera complication copyright \
    explosion snack ride pool machinery pair frog joint wrestle video referee drive window cage falsify happen tablet horror thank conception \
    extension decay dismiss platform respect ceremony applaud absorption presentation dominate race courtship soprano body \
    lighter track cinema tread tick climate lend summit singer radical flower visual negotiation promises cooperative live';
    return Utils;
}());
export { Utils };
//# sourceMappingURL=utils.js.map