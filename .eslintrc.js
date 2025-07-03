module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    root: true,
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'baseui'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'prettier/prettier': 'off',
        // 关闭所有规则
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
        'react': {
            version: 'detect',
        },
    },
}
