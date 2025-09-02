import type { Preview,  Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, RouterContextProvider, RouterProvider, Router } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from "../src/components/ui/sidebar";
import '@/styles.css';



const withSbTanstackRouter: Decorator = (Story, context) => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" })
  const memoryHistory = createMemoryHistory({ initialEntries: ["/"] })
  const routeTree = rootRoute.addChildren([indexRoute])
  const router = new Router({ routeTree, history: memoryHistory, context: context.parameters.routerContext })

  return <RouterProvider router={router} defaultComponent={() => <Story {...context} />} />
}

export const withSbSidebarProvider: Decorator = (Story) => {
  return (
  <SidebarProvider>
    <div className="flex w-full">
      <SidebarInset>
        <main className="flex-1 w-full px-6 py-4 pe-15">
           <Story />
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
  )
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
