import type { Preview } from '@storybook/nextjs-vite';

// Import global CSS which includes Tailwind
import '../src/app/globals.css';

// Import our theme decorator
import { withTheme } from './preview-decorator';

const preview: Preview = {
    decorators: [withTheme],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
    },
};

export default preview;
