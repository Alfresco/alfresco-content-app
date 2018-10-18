### Value expressions

You can use light-weight expression syntax to provide custom parameters for the action payloads.

```text
$(<expression>)
```

Expressions are valid JavaScript blocks that evaluate to values.

Examples:

```text
$('hello world')                //  'hello world'
$('hello' + ', ' + 'world')     //  'hello, world'
$(1 + 1)                        //  2
$([1, 2, 1 + 2])                //  [1, 2, 3]
```
