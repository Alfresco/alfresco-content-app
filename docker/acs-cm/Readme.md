# Custom Node creation instruction

Use the v1 POST node/{nodeId}/children for creating the custom node with a payload like:

```
{
  "name":"acme document2.txt",
  "nodeType":"acme:document",
  "properties": {
   "acme:documentId": "DOC001",
   "acme:securityClassification":"Public",
   "cm:title":"My text"
  },
  "aspectNames": [
    "acme:securityClassified"
  ]
}
```

Tip: You could use the api explorer with <host-url>/api-explorer/
