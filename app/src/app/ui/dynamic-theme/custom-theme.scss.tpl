@import '~@angular/material/theming';
@import './overrides/adf-style-fixes.theme';
@import "./dynamic-theme/theme-configuration";
@import "./dynamic-theme/typography";
@import "./dynamic-theme/custom-theme-palettes";

$primary-color: map-get($theme-config, 'primary-color');
$accent-color: map-get($theme-config, 'accent-color');
$base-font-size: map-get($theme-config, 'base-font-size');
$font-family: map-get($theme-config, 'font-family');

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
