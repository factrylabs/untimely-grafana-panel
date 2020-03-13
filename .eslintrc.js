module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'jest': true
    },
    'extends': [
        'plugin:react/recommended',
        'airbnb',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        '@typescript-eslint'
    ],
    'rules': {
        'react/jsx-filename-extension': 0,
        'import/no-extraneous-dependencies': 0,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-continue': 0,
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        }],
    },
    'settings': {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                'js': 'never',
                'jsx': 'never',
                'ts': 'never',
                'tsx': 'never'
            }
        ],
        'import/resolver': {
            'node': {
              'extensions': ['.js', '.jsx', '.ts', '.tsx', '.json']
            }
        },
    }
};
