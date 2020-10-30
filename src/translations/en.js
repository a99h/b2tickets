export default {
  common: {
    add: 'Add',
    cancel: 'Cancel',
    contact: 'Contact Us',
    description: 'Description',
    delete: 'Delete',
    edit: 'Edit',
    faq: 'FAQ',
    policy: 'Privacy Policy',
    save: 'Save',
    search: 'Search',
    takeMeBack: 'Take me back',
    title: 'Title',
    tos: 'Terms of Service',
    welcome: 'Welcome!'
  },
  board: {
    titlePlaceholder: 'Enter a title for this card',
    deleteDescription: 'Are you sure you want to delete this card?',
    editCard: 'Edit Card',
    deleteCard: 'Delete Card',
    state: {
      TODO: 'TODO',
      INPROGRESS: 'INPROGRESS',
      TESTING: 'TESTING',
      DONE: 'DONE'
    }
  },
  chat: {
    online: 'Users Online ({count})',
    addChannel: 'Add Channel',
    channel: 'Channel | Channels',
    message: 'Message'
  },
  email: {
    compose: 'Compose Email',
    drafts: 'Drafts',
    emptyList: 'Empty email list',
    inbox: 'Inbox',
    invoice: 'Invoice',
    labels: 'Labels',
    send: 'Send',
    sent: 'Sent',
    starred: 'Starred',
    subject: 'Subject',
    subscribe: 'Subscribe',
    trash: 'Trash',
    work: 'Work'
  },
  todo: {
    addTask: 'Add Task',
    tasks: 'Tasks',
    completed: 'Completed',
    labels: 'Labels'
  },
  dashboard: {
    activity: 'Activity',
    weeklySales: 'Weekly Sales',
    sales: 'Sales',
    recentOrders: 'Recent Orders',
    sources: 'Traffic Sources',
    lastweek: 'vs last week',
    orders: 'Orders',
    customers: 'Customers',
    tickets: 'Support Tickets',
    viewReport: 'View Report'
  },
  usermenu: {
    profile: 'Profile',
    signin: 'Sign In',
    dashboard: 'Dashboard',
    signout: 'Sign Out'
  },
  error: {
    notfound: 'Page Not Found',
    notFoundDesc: 'Sorry we can\'t seem to find the page you\'re looking for.',
    other: 'An Error Occurred',
    unexpected: 'OOPS! Something went wrong here',
    unexpectedDesc: 'Our experts are working to fix the issue.'
  },
  check: {
    title: 'Set New Password',
    backtosign: 'Back to Sign In',
    newpassword: 'New Password',
    button: 'Set new password and Sign in',
    error: 'The action link is invalid',
    verifylink: 'Verifying link...',
    verifyemail: 'Verifying email address...',
    emailverified: 'Email verified! Redirecting...'
  },
  forgot: {
    title: 'Forgot Password?',
    subtitle: 'Enter your account email address and we will send you a link to reset your password.',
    email: 'Email',
    button: 'Request Password Reset',
    backtosign: 'Back to Sign In'
  },
  login: {
    title: 'Sign In',
    email: 'Email',
    password: 'Password',
    button: 'Sign In',
    orsign: 'Or sign in with',
    forgot: 'Forgot password?',
    noaccount: 'Don\'t have an account?',
    create: 'Create one here',
    error: 'The email / password combination is invalid'
  },
  resetPassword: {
    button: 'Set new password and Sign In',
    error: 'Back to Sign In',
    password: 'Password',
    subtitle: 'Please enter a new password',
    title: 'Set new password'
  },
  register: {
    title: 'Create Account',
    name: 'Full name',
    email: 'Email',
    password: 'Password',
    button: 'Create Account',
    orsign: 'Or sign up with',
    agree: 'By signing up, you agree to the',
    account: 'Already have an account?',
    signin: 'Sign In'
  },
  verifyEmail: {
    title: 'Please verify the email',
    subtitle: 'Please check your email for the link to verify the email.',
    button: 'Re-send email'
  },
  utility: {
    maintenance: 'In Maintenance',
    comingSoon: 'We are coming soon',
    comingSoonDesc: 'We are almost there! If you want to get notified when the website goes live, subscribe to our mailing list!'
  },
  faq: {
    call: 'Have other questions? Please reach out '
  },
  menu: {
    board: 'Task Board',
    dashboard: 'Dashboard',
    search: 'Search (press \'ctrl + /\' to focus)',
    logout: 'Logout',
    profile: 'Profile',
    blank: 'Blank Page',
    pages: 'Pages',
    others: 'Others',
    email: 'Email',
    chat: 'Chat',
    tickets: 'Tickets',
    todo: 'Todo',
    users: 'Users',
    usersList: 'List',
    usersEdit: 'Edit',
    auth: 'Auth Pages',
    authLogin: 'Signin / Login',
    authRegister: 'Signup / Register',
    authVerify: 'Verify Email',
    authForgot: 'Forgot Password',
    authReset: 'Reset Password',
    errorPages: 'Error Pages',
    errorNotFound: 'Not Found / 404',
    errorUnexpected: 'Unexpected / 500',
    utilityPages: 'Utility Pages',
    utilityMaintenance: 'Maintenance',
    utilitySoon: 'Coming Soon',
    utilityHelp: 'FAQs / Help',
    levels: 'Menu Levels',
    disabled: 'Menu Disabled',
    docs: 'Documentation',
    feedback: 'Feedback',
    support: 'Support'
  },
  // Vuetify components translations
  $vuetify: {
    badge: 'Badge',
    close: 'Close',
    dataIterator: {
      noResultsText: 'No matching records found',
      loadingText: 'Loading items...'
    },
    dataTable: {
      itemsPerPageText: 'Rows per page:',
      ariaLabel: {
        sortDescending: 'Sorted descending.',
        sortAscending: 'Sorted ascending.',
        sortNone: 'Not sorted.',
        activateNone: 'Activate to remove sorting.',
        activateDescending: 'Activate to sort descending.',
        activateAscending: 'Activate to sort ascending.'
      },
      sortBy: 'Sort by'
    },
    dataFooter: {
      itemsPerPageText: 'Items per page:',
      itemsPerPageAll: 'All',
      nextPage: 'Next page',
      prevPage: 'Previous page',
      firstPage: 'First page',
      lastPage: 'Last page',
      pageText: '{0}-{1} of {2}'
    },
    datePicker: {
      itemsSelected: '{0} selected',
      nextMonthAriaLabel: 'Next month',
      nextYearAriaLabel: 'Next year',
      prevMonthAriaLabel: 'Previous month',
      prevYearAriaLabel: 'Previous year'
    },
    noDataText: 'No data available',
    carousel: {
      prev: 'Previous visual',
      next: 'Next visual',
      ariaLabel: {
        delimiter: 'Carousel slide {0} of {1}'
      }
    },
    calendar: {
      moreEvents: '{0} more'
    },
    fileInput: {
      counter: '{0} files',
      counterSize: '{0} files ({1} in total)'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    },
    pagination: {
      ariaLabel: {
        wrapper: 'Pagination Navigation',
        next: 'Next page',
        previous: 'Previous page',
        page: 'Goto Page {0}',
        currentPage: 'Current Page, Page {0}'
      }
    }
  },
  b2tickets: {
    chat: {
      title: 'Chat | Chats',
      addChannel: 'New channel',
      channel: 'Channel | Channels',
      chatChannels: 'Chat channels',
      online: 'Users Online ({count})',
      message: 'Message',
      request: {
        title: 'Chat request | Chat requests',
        fields: {
          message: 'Message',
          operators_online: 'Operators online',
          user: 'User'
        }
      }
    },
    common: {
      description: 'Let\'s provide best client supporting.',
      loading: 'Loading...',
      select: 'Please select',
      welcome: 'Become a member of our team',
      created_at: 'Created at',
      updated_at: 'Updated at'
    },
    ticket: {
      ticket: 'ticket',
      tickets: 'Tickets',
      actions: {
        createTicket: 'New ticket',
        editTicket: 'Edit ticket',
        showTicket: 'Ticket\'s information'
      },
      fields: {
        createdAt: 'Created at',
        description: 'Description',
        issue: 'Issue',
        ticketClients: 'Clients',
        ticketOperators: 'Operators'
      },
      select: {
        ticketClients: 'ticket clients',
        ticketOperators: 'ticket operators',
        ticketStatus: 'ticket status'
      }
    },
    ticketStatus: {
      status: 'Status',
      active: 'Active',
      open: 'Open',
      closed: 'Closed'
    }
  }
}
