@import '~@angular/material/theming';
@import './overrides/adf-style-fixes.theme';
@import "./dynamic-theme/theme-configuration";
@import "./dynamic-theme/typography";
@import "./dynamic-theme/custom-theme-palettes";
@import "./dynamic-theme/custom-background-color";
@import "./dynamic-theme/custom-text-color";

$primary-color: map-get($theme-config, 'primaryColor');
$accent-color: map-get($theme-config, 'accentColor');
$background-color: map-get($theme-config, 'backgroundColor');
$text-color: map-get($theme-config, 'textColor');
$base-font-size: map-get($theme-config, 'baseFontSize');
$font-family: map-get($theme-config, 'fontFamily');

$alfresco-typography: get-mat-typography(
  $base-font-size,
  $font-family,
  $alfresco-typography
);

@include mat-core($alfresco-typography);

$palettes: get-mat-palettes($primary-color, $accent-color);
$custom-theme: mat-light-theme(
  map-get($palettes, primary),
  map-get($palettes, accent),
  map-get($palettes, warning),
);

@if $background-color {
  $custom-background: get-custom-backgrond-color($background-color, $custom-theme);
  $custom-theme: map_merge($custom-theme, (background: $custom-background));
}

@if $text-color {
  $custom-foreground: get-custom-text-color($text-color, $custom-theme);
  $custom-theme: map_merge($custom-theme, (foreground: $custom-foreground));
}

@mixin custom-theme($theme) {
  @include angular-material-theme($theme);

  @if $base-font-size {
    @include adf-core-theme($theme, get-custom-adf-font-sizes());
    @include base-font-size($base-font-size);
  } @else {
    @include adf-core-theme($theme);
  }

  @if $font-family {
    @include base-font-family($font-family);
  }

  @include adf-style-fixes($theme);
}
