import ReactDOM from 'react-dom/client'
import {createElement as e, StrictMode} from 'react'
import ErrorBoundary from './ErrorBoundary'
import {ModalProvider} from './context'
import {getProperties, getPropertyManagers, getAccountants} from './api'
import App from './App'
import './global.css'


const
    boot = async () => {
        try {
            const [propManagers, accountants, properties] =
                await Promise.all([
                    getPropertyManagers(), getAccountants(), getProperties()])

            render({propManagers, accountants, properties})

        } catch (e) {
            console.error(e)
            render({error: 'Failed to fetch properties'})
        }
    },

    render = props =>
        ReactDOM
            .createRoot(document.getElementById('root'))
            .render(
                e(StrictMode, {},
                    e(ModalProvider, {},
                        e(ErrorBoundary, {},
                            e(App, props)))))


boot()
