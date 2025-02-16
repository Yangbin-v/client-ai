import pluginVue from 'eslint-plugin-vue';

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
    },
    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    },
    {
        rules: {
            'semi': ['error', 'always'],
            'semi-spacing': ['error', {before: false, after: true}],
            'object-curly-spacing': ['error', 'never'],
            'arrow-spacing': ['error', {before: true, after: true}],
            'space-before-function-paren': ['error', 'never'],
            'indent': ['error', 4],
        }
    },
    ...pluginVue.configs['flat/essential'],
    {
        rules: {
            '@typescript-eslint/prefer-ts-expect-error': 'off',
        }
    }
];
