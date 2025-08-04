# 💻 Application Overview

MenuPlanner is a comprehensive meal planning and recipe management system. Users can create, organize, and share recipes, plan their meals for the week, generate shopping lists, and track ingredients.

## Core Features

- **Recipe Management**: Create, edit, and organize recipes with ingredients, instructions, and nutritional information
- **Menu Planning**: Plan meals for the week with drag-and-drop interface
- **Shopping Lists**: Automatically generate shopping lists from planned meals
- **Ingredient Tracking**: Track pantry inventory and expiration dates
- **Multi-Platform**: Access from web browser or native mobile apps
- **Real-time Sync**: Data synchronizes across all devices

## Data Model

The application contains the following core models:

### User
Users can have different roles with varying permissions:
- `ADMIN`: Full system access including user management
- `USER`: Standard user with recipe and menu planning access

### Recipe
- Contains ingredients, instructions, preparation time, and servings
- Can be categorized with labels (e.g., vegetarian, gluten-free, quick meals)
- Supports images and nutritional information
- Can be shared publicly or kept private

### Ingredient
- Master list of ingredients with units and categories
- Linked to recipes with quantities
- Supports substitutions and dietary restrictions

### Menu Plan
- Weekly or monthly meal planning
- Links recipes to specific dates and meal types (breakfast, lunch, dinner, snacks)
- Generates shopping lists automatically

### Shopping List
- Generated from menu plans or created manually
- Groups items by store sections
- Tracks purchased vs pending items

## Application Architecture

The application follows a monorepo structure with the following apps:

### Web Application (Next.js)
- Server-side rendering for optimal SEO and performance
- App Router for modern React patterns
- Responsive design that works on all screen sizes
- Progressive Web App capabilities

### Mobile Application (Expo)
- Native iOS and Android apps
- Offline support for viewing recipes
- Camera integration for recipe photos
- Push notifications for meal reminders

### Shared Packages
- `@menuplanner/api`: tRPC router definitions
- `@menuplanner/db`: Database schema and queries
- `@menuplanner/auth`: Authentication logic
- `@menuplanner/ui`: Shared UI components
- `@menuplanner/validators`: Shared validation schemas

## User Journey

1. **Registration**: Users sign up with email or social providers (Google)
2. **Onboarding**: Set dietary preferences and favorite cuisines
3. **Recipe Creation**: Add personal recipes or browse public recipes
4. **Menu Planning**: Drag recipes onto calendar to plan meals
5. **Shopping**: Generate and manage shopping lists
6. **Cooking**: Follow recipes with step-by-step mode

## Technical Highlights

- **Type Safety**: Full end-to-end type safety from database to UI
- **Real-time Updates**: Instant synchronization across devices
- **Offline Support**: Mobile apps work without internet connection
- **Performance**: Optimized queries and lazy loading for fast load times
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support