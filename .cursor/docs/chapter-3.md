# Chapter 3: Bootstrap the App Backend with Supabase

## Lesson 3.17 - Initial Supabase Setup

> **Purpose:** Set up Supabase project and integrate Supabase JavaScript client into the Vue.js application.

### Overview

Create a Supabase organization and project, then install and configure the Supabase JavaScript client for database interactions.

---

### Step 1: Create Supabase Project

**Location:** Supabase Dashboard

#### Tasks

- [ ] Sign up/in to supabase
- [ ] Create organization
- [ ] Create new project

---

### Step 2: Install Supabase Client

**Location:** Terminal

#### Tasks

- [ ] Go to JS docs and copy: `npm install @supabase/supabase-js@2.43.4`
- [ ] Copy code from initialising:

```typescript
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'publishable-or-anon-key')
```

---

### Step 3: Create Supabase Client File

**File:** `src/lib/supabaseClient.ts`

#### Tasks

- [ ] Create new folder `lib` in src
- [ ] Create new file `supabaseClient.ts`
- [ ] Paste code from initialising here
- [ ] Now replace with own url
- [ ] And replace anon key
- [ ] Add export in front of const

---

### Step 4: Test Supabase Client

**File:** `app.vue`

#### Tasks

- [ ] In app.vue add: `import { supabase } from '@/lib/supabaseClient'`
- [ ] Add: `console.log(supabase)`
- [ ] Run dev (Terminal)
- [ ] Inspect console

---

## Lesson 3.18 - Environment Variables

> **Purpose:** Move Supabase credentials to environment variables for security and configuration management.

### Overview

Replace hardcoded Supabase URL and key with environment variables using Vite's environment variable system.

---

### Step 1: Update Supabase Client

**File:** `src/lib/supabaseClient.ts`

#### Tasks

- [ ] Change create client to:

```typescript
export const supabase = createClient(
  import.meta.env.VITE_SUPBASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)
```

---

### Step 2: Create Environment File

**File:** `.env`

#### Tasks

- [ ] Create new file `.env` and add:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

---

### Step 3: Update Gitignore

**File:** `.gitignore`

#### Tasks

- [ ] Add `.env` below tsbuildinfo

---

## Lesson 3.19 - Create Projects Table

> **Purpose:** Create the projects table in Supabase with appropriate columns and data types.

### Overview

Design and create the projects table schema with columns for name, slug, status, and collaborators.

---

### Step 1: Create Table Schema

**Location:** Supabase Dashboard

#### Tasks

- [ ] In supabase add projects new table and uncheck RLS
- [ ] Add new column name: Text, is not nullable
- [ ] Add new column slug: text, is not nullable
- [ ] Add new column status: text, in-progress, is not nullable
- [ ] Add new column collaborators: text, [], is not nullable
- [ ] Add new row with first project and first-project

---

## Lesson 3.20 - Database Migration Setup

> **Purpose:** Set up Supabase migrations for version-controlled database schema changes.

### Overview

Create a proper SQL migration file to define the projects table schema with enum types and proper constraints.

---

### Step 1: Create Migration SQL

**Location:** Supabase SQL Editor

#### Tasks

- [ ] Run:

```sql
DROP table IF EXISTS projects;
DROP type IF EXISTS current_status; 

CREATE type current_status as enum ('in-progress', 'completed');

CREATE TABLE 
  projects (
    id bigint primary key generated always as identity not null,
    created_at timestamp default now() not null,
    name text not null,
    slug text unique not null,
    status current_status not null,
    collaborators text array default array[]::varchar[] not null
  );
```

---

## Lesson 3.21 - Supabase CLI Setup

> **Purpose:** Install and configure Supabase CLI for local development and migration management.

### Overview

Set up Supabase CLI to manage migrations, link to remote project, and reset database locally.

---

### Step 1: Install Supabase CLI

**Location:** Terminal

#### Tasks

- [ ] `npm install supabase --save-dev`

---

### Step 2: Configure Package Scripts

**File:** `package.json`

#### Tasks

- [ ] Under scripts add: `"supabase:init": "supabase init"`
- [ ] Terminal: `npm run supabase:init`
- [ ] Under scripts add: `"supabase:login": "supabase login"`
- [ ] Terminal: `npm run supabase:login`
- [ ] Add this under scripts and replace project ref: `"supabase:link": "supabase link --project-ref YOUR_PROJECT_REF"`
- [ ] Terminal: `npm run supabase:link`

---

## Lesson 3.22 - Create Migration

> **Purpose:** Create a new migration file for the projects schema and apply it to the database.

### Overview

Generate a new migration file, copy the SQL schema, and reset the database to apply migrations.

---

### Step 1: Create Migration

**File:** `package.json`

#### Tasks

- [ ] Add under scripts: `"db:migrate:new": "supabase migration new projects-schema"`
- [ ] Terminal: `npm run db:migrate:new`

---

### Step 2: Add Migration SQL

**Location:** Supabase SQL Editor

#### Tasks

- [ ] Copy script for projects schema
- [ ] Remove insert data
- [ ] In package.json add under scripts: `"db:reset": "supabase db reset --linked"`
- [ ] Terminal: `npm run db:reset`

---

## Lesson 3.23 - Database Seeding Setup

> **Purpose:** Set up database seeding with Faker.js to generate test data for development.

### Overview

Install Faker.js and create a seed script to populate the database with realistic test data.

---

### Step 1: Install Faker

**Location:** Terminal

#### Tasks

- [ ] `npm install @faker-js/faker --save-dev`

---

### Step 2: Create Seed File

**File:** `database/seed.js`

#### Tasks

- [ ] New folder called `database`
- [ ] Create new file `seed.js`
- [ ] Add: `import {faker} from '@faker-js/faker';`
- [ ] Add: `const personName = faker.person.fullName();`
- [ ] Add: `const personBio = faker.person.bio();`
- [ ] Add: `console.log('Hi my name is ', personName, '. I am a ', personBio);`
- [ ] Terminal: `node database/seed.js`

---

## Lesson 3.24 - Set Up Supabase JavaScript Client in Node Environment

> **Purpose:** Configure Supabase client for Node.js environment to enable server-side database operations like seeding.

### Overview

Set up Supabase client in seed script using Node.js environment variables and service role key for admin operations.

---

### Step 1: Update Seed File

**File:** `database/seed.js`

#### Tasks

- [ ] Clean out all fake data
- [ ] Copy const from `lib/supabaseClient.ts` into seed.js:

```typescript
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)
```

- [ ] Change to:

```typescript
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
)
```

---

### Step 2: Configure Service Role Key

**Location:** Supabase Dashboard

#### Tasks

- [ ] Copy service role key and ref as SERVICE_ROLE_KEY
- [ ] This key has the ability to bypass Row Level Security. Never share it publicly.

---

### Step 3: Update Environment and ESLint

**File:** `.env`

#### Tasks

- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`

---

**File:** `.eslint.cjs`

#### Tasks

- [ ] Add `/* eslint-env node */` to tell eslint where it's run

---

### Step 4: Configure Seed Script

**File:** `package.json`

#### Tasks

- [ ] Add to script: `"db:seed": "node --env-file=.env database/seed.js"`
- [ ] Terminal: `npm run db:seed`

---

## Lesson 3.25 - Seeding the Supabase Remote Database with Fakerjs

> **Purpose:** Implement database seeding function to populate projects table with fake data.

### Overview

Create a seed function that generates multiple project entries using Faker.js and inserts them into the Supabase database.

---

### Step 1: Implement Seed Function

**File:** `database/seed.js`

#### Tasks

- [ ] Remove console.log from seed.js
- [ ] Go to javascript docs and look for insert data on left
- [ ] Add this:

```typescript
const seedProjects = async () => {
  const name = faker.lorem.words(3)

  await supabase.from('projects').insert({
    name: name,
    slug: name.toLocaleLowerCase().replace(/ /g, '-'),
    status: faker.helpers.arrayElement(['in-progress', 'completed']),
    collaborators: faker.helpers.arrayElements([1,2,3])
  })
}

await seedProjects()
```

- [ ] Terminal: `npm run db:reset`
- [ ] Supabase: check table editor
- [ ] Terminal: `npm run db:seed`
- [ ] Supabase: check table editor

---

## Lesson 3.26 - Insert Bulk Entries Into Supabase Database

> **Purpose:** Optimize seeding by batching multiple entries in a single insert operation.

### Overview

Refactor seed function to generate multiple entries in an array and insert them all at once for better performance.

---

### Step 1: Optimize Seed Function

**File:** `database/seed.js`

#### Tasks

- [ ] Change seed.js to:

```typescript
const seedProjects = async (numEntries) => {
  const projects = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)

    projects.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      collaborators: faker.helpers.arrayElements([1, 2, 3])
    })
  }

  await supabase.from('projects').insert(projects)
}

await seedProjects(10)
```

- [ ] Terminal: `npm run db:seed`

---

## Lesson 3.27 - Query Supabase from Vue.js Script Setup

> **Purpose:** Fetch projects data from Supabase and display it in a Vue component.

### Overview

Create a function to query Supabase database and use Vue's reactivity system to display the data in the template.

---

### Step 1: Create Query Function

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Add: `import {supabase} from '@/lib/supabaseClient'`
- [ ] Add:

```typescript
const getProjects = async () => {
  const { data, error} = await supabase.from('projects').select()

  if (error) console.log(error)

  console.log('projects: ', data)
}
```

- [ ] Go to vue.js docs/guide/essentials/life cycle hooks

---

## Lesson 3.28 - Use Immediately Invoked Function Expression in Script Setup

> **Purpose:** Execute async data fetching immediately when component loads using IIFE pattern.

### Overview

Wrap the async query function in an immediately invoked function expression (IIFE) to execute it on component mount.

---

### Step 1: Implement IIFE

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Add login into new function and delete old function:

```typescript
;(async () => {
  const { data, error } = await supabase.from('projects').select()

  if (error) console.log(error)

  console.log('projects: ', data)
})()
```

- [ ] Terminal: `npm run dev`
- [ ] Change to:

```typescript
;(async () => {
  const { data, error } = await supabase.from('projects').select()

  if (error) console.log(error)

  return data
})()
```

---

## Lesson 3.29 - Introduction to Vue.js Reactivity System and Using Refs

> **Purpose:** Store fetched data in a reactive ref to enable template updates when data changes.

### Overview

Use Vue's `ref()` to create reactive state that automatically updates the template when data is fetched.

---

### Step 1: Create Reactive State

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Add after import above function: `let projects: any`
- [ ] Then after if add: `projects = data`
- [ ] After return data add: `console.log('projects: ', projects)`
- [ ] Terminal: `npm run dev`
- [ ] Make sure seed.js is correct format
- [ ] Script should look like this:

```vue
<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'

let projects: any
;(async () => {
  const { data, error } = await supabase.from('projects').select()

  if (error) console.log(error)

  projects = data

  console.log('projects: ', projects)
})()
</script>
```

- [ ] Add in template under router link: `{{ posts }}`
- [ ] Change let to: `let projects: any`
- [ ] Add `.value` for refs
- [ ] Terminal: `npm run dev` and check if data is showing

---

## Lesson 3.30 - Provide TypeScript Type Definitions for Refs in Vue.js Script Setup

> **Purpose:** Add proper TypeScript types to refs for type safety and better IDE support.

### Overview

Define TypeScript types for refs to ensure type safety and enable autocomplete in the template.

---

### Step 1: Type Ref Properly

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Update ref: `const posts = ref<any[] | null>(null)`
- [ ] Change the call for posts: `{{ posts ? posts[0] : '' }}`
- [ ] Now make it a loop for each item:

```vue
<ul>
  <li v-for="post in posts" :key="post.id">
   {{ post. }}
  </li>
</ul>
```

---

## Lesson 3.31 - Add TypeScript Support to Supabase in Vue.js

> **Purpose:** Generate TypeScript types from Supabase schema for type-safe database queries.

### Overview

Use Supabase CLI to generate TypeScript types from the database schema and integrate them into the Vue.js application.

---

### Step 1: Generate Types

**Location:** Supabase Dashboard

#### Tasks

- [ ] Go to api docs / tables: https://supabase.com/docs/guides/api/rest/generating-types

---

**File:** `package.json`

#### Tasks

- [ ] Add script for types: `"supabase:types": "npx supabase gen types typescript --project-id sxzckwgvucbknxgldqkr --schema public > database/types.ts"`
- [ ] Change database.types to database/types.ts: `"supabase:types": "npx supabase gen types typescript --project-id sxzckwgvucbknxgldqkr --schema public > database.types.ts"`
- [ ] Terminal: `npm run supabase:types`

---

### Step 2: Integrate Types

**File:** `src/lib/supabaseClient.ts`

#### Tasks

- [ ] Add import: `import type { Database } from '../../database/types'`
- [ ] Update create client for this database: `export const supabase = createClient<Database>(`

---

**File:** `tsconfig.app.json`

#### Tasks

- [ ] Add inside include array: `"database/types.ts"`

---

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Add import: `import type { Tables } from '../../../database/types'`
- [ ] Update ref: `const posts = ref<Tables<'posts'>[] | null>(null)`
- [ ] Now update the li: `<li v-for="post in posts" :key="post.id">{{ post.subject }}`

---

## Lesson 3.32 - Create a New Page for Tasks with Database Migration, Seed and Types

> **Purpose:** Create a tasks table with proper schema, migration, seeding, and TypeScript types.

### Overview

Set up a complete tasks feature with database migration, seed data, and type-safe queries following the same pattern as projects.

---

### Step 1: Create Migration

**File:** `package.json`

#### Tasks

- [ ] Remove posts-schema from db:migrate
- [ ] Terminal: `npm run db:migrate:new assigned_posts-schema`

---

**File:** Migration file

#### Tasks

- [ ] Add SQL schema for tasks table
- [ ] Terminal: `npm run db:reset`
- [ ] Terminal: `npm run db:seed`
- [ ] Pages: create folder assignedPosts
- [ ] assignedPosts: create index.vue
- [ ] Copy index.vue file and paste here (see CSV for full template)
