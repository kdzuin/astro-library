import type { Preview,  Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, RouterContextProvider, RouterProvider, Router } from '@tanstack/react-router'
import '@/styles.css';



const withSbTanstackRouter: Decorator = (Story, context) => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" })
  const memoryHistory = createMemoryHistory({ initialEntries: ["/"] })
  const routeTree = rootRoute.addChildren([indexRoute])
  const router = new Router({ routeTree, history: memoryHistory, context: context.parameters.routerContext })

  return <RouterProvider router={router} defaultComponent={() => <Story {...context} />} />
}

const withSbQueryClient: Decorator = (Story, context) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  )
}


// Create a query client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});


const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withSbTanstackRouter,
    withSbQueryClient,
  ],
};

export default preview;
