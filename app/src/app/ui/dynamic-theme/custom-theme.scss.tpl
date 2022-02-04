@import '~@angular/material/theming';
@import './overrides/adf-style-fixes.theme';
@import "./dynamic-theme/theme-configuration";
@import "./dynamic-theme/typography";
@import "./dynamic-theme/custom-theme-palettes";

$primary: map-get($theme, 'primary-color');
$accent: map-get($theme, 'accent-color');
$baseFontSize: map-get($theme, 'base-font-size');
$fontFamily: map-get($theme, 'font-family');

@if $baseFontSize {
  @include baseFontSize($baseFontSize);
}

@if $fontFamily {
  @include baseFontFamily($fontFamily);
}

$alfresco-typography: get-mat-typography($baseFontSize, $fontFamily, $alfresco-typography);
@include mat-core($alfresco-typography);

$palettes: get-mat-palettes($primary, $accent);
$custom-theme: mat-light-theme(
  map-get($palettes, primary),
  map-get($palettes, accent),
  map-get($palettes, warning),
);
