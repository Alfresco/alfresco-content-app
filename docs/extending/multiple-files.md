### Multiple files

You can have multiple extension files distributed separately.
All additional files are linked via the `$references` property.
The order of declaration defines the order of loading.

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",
  "$references": ["plugin1.json", "plugin2.json"]
}
```

<p class="warning">
All extension files are merged together at runtime.
This allows plugins to overwrite the code from the main application or to alter other plugins.
</p>