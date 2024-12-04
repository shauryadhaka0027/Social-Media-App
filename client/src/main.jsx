
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import App from './App'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
     <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
 </BrowserRouter>
)
