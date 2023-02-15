import { createRoot } from 'react-dom/client'

import App from './components/App/App'
import 'antd/dist/reset.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
