import { Hono } from 'hono'
import appRouter from './routes/index.routes'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1', appRouter )

export default app
