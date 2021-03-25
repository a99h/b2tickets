import authRoutes from '@/pages/auth/router'
import errorRoutes from '@/pages/error/router'
import utilityRoutes from '@/pages/utility/router'
import UsersRoutes from '@/pages/users/router'
import TicketsRoutes from '@/pages/tickets/router'
import chatRoutes from '@/apps/chat/router/pages'

export default [
  ...authRoutes,
  ...errorRoutes,
  ...utilityRoutes,
  ...UsersRoutes,
  ...TicketsRoutes,
  ...chatRoutes
]