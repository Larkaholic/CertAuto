import { App } from 'antd';
import { createCache, StyleProvider } from '@ant-design/cssinjs';

// This disables the React 19 compatibility warning
// See: https://ant.design/docs/react/compatible-style
const cache = createCache();

export { App, StyleProvider, cache };
