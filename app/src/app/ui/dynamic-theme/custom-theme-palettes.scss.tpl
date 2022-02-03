@import './colors';
@import './dynamic-theme/custom-palette-creator.scss';

$primary: ${PRIMARY_COLOR};
$accent: ${ACCENT_COLOR};

$custom-theme-primary-palette: createColorPalette($primary, 'primary');
$custom-theme-accent-palette: createColorPalette($accent, 'accent');

$mat-primary-palette: mat-palette($custom-theme-primary-palette, 500);
$mat-accent-palette: mat-palette($custom-theme-accent-palette, 500);
$mat-warn-palette: mat-palette($aca-warn, A100);
