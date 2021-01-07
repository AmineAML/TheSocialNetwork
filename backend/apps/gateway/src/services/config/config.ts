export const config = () => ({
    port: process.env.API_GATEWAY_PORT,
    node_env: process.env.NODE_ENV === 'production'
})