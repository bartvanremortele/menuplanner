export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      getHref: () => '/dashboard',
    },
    dashboard: {
      getHref: () => '/dashboard',
    },
    recipes: {
      getHref: () => '/recipes',
      detail: {
        getHref: (id: string) => `/recipes/${id}`,
      },
      edit: {
        getHref: (id: string) => `/recipes/${id}/edit`,
      },
      new: {
        getHref: () => '/recipes/new',
      },
    },
    ingredients: {
      getHref: () => '/ingredients',
      detail: {
        getHref: (id: string | number) => `/ingredients/${id}`,
      },
      edit: {
        getHref: (id: string | number) => `/ingredients/${id}/edit`,
      },
      new: {
        getHref: () => '/ingredients/new',
      },
    },
    mealPlans: {
      getHref: () => '/meal-plans',
      detail: {
        getHref: (id: string) => `/meal-plans/${id}`,
      },
      edit: {
        getHref: (id: string) => `/meal-plans/${id}/edit`,
      },
      new: {
        getHref: () => '/meal-plans/new',
      },
    },
    shoppingLists: {
      getHref: () => '/shopping-lists',
      detail: {
        getHref: (id: string) => `/shopping-lists/${id}`,
      },
      edit: {
        getHref: (id: string) => `/shopping-lists/${id}/edit`,
      },
      new: {
        getHref: () => '/shopping-lists/new',
      },
    },
    profile: {
      getHref: () => '/profile',
      settings: {
        getHref: () => '/profile/settings',
      },
    },
  },
} as const;