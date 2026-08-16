export default {
	extends: ['stylelint-config-standard'],
	ignoreFiles: ['dist/**', 'node_modules/**'],
	rules: {
		'color-hex-length': null,
		'no-descending-specificity': null,
	},
};
