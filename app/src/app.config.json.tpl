{
  "$schema": "../node_modules/@alfresco/adf-core/app.config.schema.json",
  "ecmHost": "${APP_CONFIG_ECM_HOST}",
  "aosHost": "${APP_CONFIG_ECM_HOST}/alfresco/aos",
  "baseShareUrl": "${APP_CONFIG_ECM_HOST}/#/preview/s",
  "providers": "${APP_CONFIG_PROVIDER}",
  "authType": "${APP_CONFIG_AUTH_TYPE}",
  "loginRoute": "login",
  "plugins":{
    "aosPlugin" : ${APP_CONFIG_PLUGIN_AOS}
  },
  "oauth2": {
    "host": "${APP_CONFIG_OAUTH2_HOST}",
    "clientId": "${APP_CONFIG_OAUTH2_CLIENTID}",
    "scope": "openid",
    "secret": "",
    "implicitFlow": ${APP_CONFIG_OAUTH2_IMPLICIT_FLOW},
    "silentLogin": ${APP_CONFIG_OAUTH2_SILENT_LOGIN},
    "publicUrls": ["**/preview/s/*", "**/settings", "**/blank"],
    "redirectSilentIframeUri": "${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI}",
    "redirectUri": "${APP_CONFIG_OAUTH2_REDIRECT_LOGIN}",
    "redirectUriLogout": "${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT}"
  },
  "locale": "en",
  "application": {
    "name": "Alfresco Content Application",
    "version": "2.7.0",
    "logo": "assets/images/alfresco-logo-flower.svg",
    "headerImagePath": "assets/images/mastHead-bg-shapesPattern.svg",
    "copyright": "APP.COPYRIGHT"
  },
  "viewer.maxRetries": 1,
  "sharedLinkDateTimePickerType": "date",
  "headerColor": "#ffffff",
  "headerTextColor": "#000000",
  "customCssPath": "",
  "pagination": {
    "size": 25,
    "supportedPageSizes": [25, 50, 100]
  },
  "files": {
    "excluded": [".DS_Store", "desktop.ini", "Thumbs.db", ".git"],
    "match-options": {
      "nocase": true
    }
  },
  "dateValues": {
    "defaultDateFormat": "mediumDate",
    "defaultDateTimeFormat": "MMM d, y, h:mm",
    "defaultLocale": "en"
  },
  "adf-version-manager": {
    "allowComments": true,
    "allowDownload": true
  },
  "sideNav": {
    "preserveState": true,
    "expandedSidenav": true
  },
  "languages": [
    {
      "key": "de",
      "label": "Deutsch"
    },
    {
      "key": "en",
      "label": "English"
    },
    {
      "key": "es",
      "label": "Español"
    },
    {
      "key": "fr",
      "label": "Français"
    },
    {
      "key": "it",
      "label": "Italiano"
    },
    {
      "key": "ja",
      "label": "日本語"
    },
    {
      "key": "nb",
      "label": "Bokmål"
    },
    {
      "key": "nl",
      "label": "Nederlands"
    },
    {
      "key": "pt-BR",
      "label": "Português (Brasil)"
    },
    {
      "key": "ru",
      "label": "Русский"
    },
    {
      "key": "zh-CN",
      "label": "中文简体"
    },
    {
      "key": "cs",
      "label": "Čeština"
    },
    {
      "key": "da",
      "label": "Dansk"
    },
    {
      "key": "fi",
      "label": "Suomi"
    },
    {
      "key": "pl",
      "label": "Polski"
    },
    {
      "key": "sv",
      "label": "Svenska"
    },
    {
      "key": "ar",
      "label": "العربية",
      "direction": "rtl"
    }
  ],
  "content-metadata": {
    "presets": {
      "custom": [
        {
          "includeAll": true,
          "exclude": [
            "rn:renditioned",
            "cm:versionable",
            "cm:auditable",
            "cm:thumbnailModification",
            "cm:content",
            "cm:author",
            "cm:titled",
            "cm:generalclassifiable",
            "cm:taggable",
            "dp:restrictable",
            "fm:commentsRollup",
            "qshare:shared",

            "exif:exif",
            "cm:effectivity",

            "cm:likesRatingSchemeRollups",
            "cm:lockable",
            "cm:ownable"
          ]
        },
        {
          "title": "APP.CONTENT_METADATA.EXIF_GROUP_TITLE",
          "items": [
            {
              "aspect": "exif:exif",
              "properties": [
                "exif:pixelXDimension",
                "exif:pixelYDimension",
                "exif:dateTimeOriginal",
                "exif:exposureTime",
                "exif:fNumber",
                "exif:flash",
                "exif:focalLength",
                "exif:isoSpeedRatings",
                "exif:orientation",
                "exif:manufacturer",
                "exif:model",
                "exif:software"
              ]
            }
          ]
        },
        {
          "title": "APP.CONTENT_METADATA.EFFECTIVITY_GROUP_TITLE",
          "items": [
            {
              "aspect": "cm:effectivity",
              "properties": [
                "cm:from",
                "cm:to"
              ]
            }
          ]
        }
      ]
    },
    "multi-value-pipe-separator": ", ",
    "multi-value-chips": true
  },
  "search-headers": {
    "filterWithContains": true,
    "app:fields": [
      "cm:name",
      "cm:title",
      "cm:description",
      "TEXT",
      "TAG"
    ],
    "categories": [
      {
        "id": "queryName",
        "name": "SEARCH.SEARCH_HEADER.FILTERS.NAME.TITLE",
        "columnKey": "name",
        "enabled": true,
        "component": {
          "selector": "text",
          "settings": {
            "pattern": "cm:name:'(.*?)'",
            "field": "cm:name",
            "placeholder": "SEARCH.SEARCH_HEADER.FILTERS.NAME.PLACEHOLDER",
            "searchPrefix" : "*",
            "searchSuffix" : "*"
          }
        }
      },
      {
        "id": "checkList",
        "name": "SEARCH.SEARCH_HEADER.FILTERS.TYPE.TITLE",
        "columnKey":"$thumbnail",
        "enabled": true,
        "component": {
          "selector": "check-list",
          "settings": {
            "pageSize": 5,
            "operator": "OR",
            "options": [
              {
                "name": "SEARCH.SEARCH_HEADER.FILTERS.TYPE.FOLDER",
                "value": "TYPE:'cm:folder'"
              },
              {
                "name": "SEARCH.SEARCH_HEADER.FILTERS.TYPE.DOCUMENT",
                "value": "TYPE:'cm:content'"
              }
            ]
          }
        }
      },
      {
        "id": "contentSize",
        "name": "SEARCH.SEARCH_HEADER.FILTERS.SIZE.TITLE",
        "columnKey":"content.sizeInBytes",
        "enabled": true,
        "component": {
          "selector": "check-list",
          "settings": {
            "options": [
              {
                "name": "SEARCH.SEARCH_HEADER.FILTERS.SIZE.SMALL",
                "value": "content.size:[0 TO 1048576> OR TYPE:'cm:folder'"
              },
              {
                "name": "SEARCH.SEARCH_HEADER.FILTERS.SIZE.MEDIUM",
                "value": "content.size:[1048576 TO 52428800] OR TYPE:'cm:folder'"
              },
              {
                "name": "SEARCH.SEARCH_HEADER.FILTERS.SIZE.LARGE",
                "value": "content.size:<52428800 TO 524288000] OR TYPE:'cm:folder'"
              },
              {
                "name": "SEARCH.SEARCH_HEADER.FILTERS.SIZE.HUGE",
                "value": "content.size:<524288000 TO MAX] OR TYPE:'cm:folder'"
              }
            ]
          }
        }
      },
      {
        "id": "createdDateRange",
        "name": "SEARCH.SEARCH_HEADER.FILTERS.DATE.TITLE",
        "columnKey": "createdAt",
        "enabled": true,
        "component": {
          "selector": "date-range",
          "settings": {
            "field": "cm:created",
            "dateFormat": "DD-MMM-YY",
            "maxDate": "today"
          }
        }
      }
    ],
    "highlight": {
      "prefix": " ",
      "postfix": " ",
      "mergeContiguous": true,
      "fields": [
        {
          "field": "cm:title"
        },
        {
          "field": "description",
          "prefix": "(",
          "postfix": ")"
        }
      ]
    },
    "sorting": {
      "options": [
        {
          "key": "name",
          "label": "Name",
          "type": "FIELD",
          "field": "cm:name",
          "ascending": true
        },
        {
          "key": "content.sizeInBytes",
          "label": "Size",
          "type": "FIELD",
          "field": "content.size",
          "ascending": true
        },
        {
          "key": "createdByUser",
          "label": "Author",
          "type": "FIELD",
          "field": "cm:creator",
          "ascending": true
        },
        {
          "key": "createdAt",
          "label": "Created",
          "type": "FIELD",
          "field": "cm:created",
          "ascending": true
        },
        {
          "key": "modifiedAt",
          "label": "SEARCH.SORT.MODIFIED_DATE",
          "type": "FIELD",
          "field": "cm:modified",
          "ascending": true
        },
        {
          "key": "modifiedByUser.displayName",
          "label": "SEARCH.SORT.MODIFIER",
          "type": "FIELD",
          "field": "cm:modifier",
          "ascending": true
        },
        {
          "key": "score",
          "label": "Relevance",
          "type": "SCORE",
          "field": "score",
          "ascending": false
        }
      ],
      "defaults": [
        {
          "key": "score",
          "type": "SCORE",
          "field": "score",
          "ascending": false
        }
      ]
    }
  },
  "aspect-visible": {
    "default" : ["cm:generalclassifiable", "cm:complianceable",
                 "cm:dublincore", "cm:effectivity", "cm:summarizable",
                 "cm:versionable", "cm:templatable","cm:emailed", "emailserver:aliasable",
                 "cm:taggable", "app:inlineeditable", "cm:geographic", "exif:exif",
                 "audio:audio", "cm:indexControl", "dp:restrictable", "smf:customConfigSmartFolder", "smf:systemConfigSmartFolder"],
    "ai": ["ai:products", "ai:dates", "ai:places", "ai:events", "ai:organizations", "ai:people", "ai:things", "ai:quantities", "ai:creativeWorks", "ai:labels", "ai:textLines"]
  }
}
