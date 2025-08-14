import type { Preview } from '@storybook/nextjs-vite';
import { sb } from 'storybook/test';

// Import global CSS which includes Tailwind
import '../src/app/globals.css';

// Import our theme decorator
import { withTheme } from './preview-decorator';

sb.mock(import('../src/components/features/auth/useGoogleSignIn.ts'), { spy: false });
sb.mock(import('../src/lib/server/actions/sessions.ts'), { spy: false });
// sb.mock(import('../src/lib/server/actions/projects.ts'), { spy: false });
// sb.mock(import('../src/lib/server/actions/auth.ts'), { spy: false });

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
        nextjs: {
            appDirectory: true,
        },
    },
};

export default preview;
