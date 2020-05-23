import HMR from '@sveltech/routify/hmr'
import App from './App.svelte';

const app = HMR(App, {
    target: document.getElementById("appRoutify")
}, 'routify-app')

export default app;