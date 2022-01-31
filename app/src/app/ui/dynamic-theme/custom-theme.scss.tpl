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

$custom-typography: get-mat-typography($baseFontSize, $fontFamily, $alfresco-typography);

@include mat-core($custom-typography);

$palettes: get-mat-palettes($primary, $accent);

$custom-theme: mat-light-theme(
  map-get($palettes, primary),
  map-get($palettes, accent),
  map-get($palettes, warning),
);



// -----custom background------
// $foreground: map-get($custom-theme, foreground);
// $background: map-get($custom-theme, background);
// $card: map-get($background, card);

// $new-background-color: #44a594;
// $new-card-color: #76aba1; // calculate lighter color
// $new-selected-button: rgba(255, 255, 255, 20%);
// $background: map_merge($background, (background: $new-background-color));

// $background: map_merge($background, (card: $new-card-color));
// $background: map_merge($background, (modal: $new-card-color));
// $background: map_merge($background, (dialog: $new-card-color));
// $background: map_merge($background, (selected-button: $new-selected-button));

// // Update texts
// // $new-foreground-text-color: #cc3434;
// // $foreground: map_merge($foreground, (text: $new-foreground-text-color));
// // $foreground: map_merge($foreground, (secondary-text: $new-foreground-text-color));
// // $custom-theme: map_merge($custom-theme, (foreground: $foreground));
// // Update texts

// $custom-theme: map_merge($custom-theme, (background: $background));

// @debug('--------------');
// @debug($background);
// -----custom background------

