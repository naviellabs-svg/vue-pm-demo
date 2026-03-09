# Backend: Supabase Integration Patterns

## Overview

Patterns for integrating Supabase as a backend service, including client setup, database queries, TypeScript types, migrations, and seeding.

## When to Use

- ✅ Backend-as-a-Service (BaaS) setup
- ✅ Real-time database operations
- ✅ Authentication integration
- ✅ Type-safe database queries
- ✅ Database migrations and seeding

## Supabase Client Setup

### Basic Client Configuration

**File:** `src/lib/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../database/types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)
```

### Environment Variables

**File:** `.env`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

**File:** `.gitignore`

```
.env
.env.local
.env.*.local
```

## Database Queries Pattern

### Centralized Query Functions

**File:** `src/utils/supaQueries.ts`

```typescript
import { supabase } from '@/lib/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'

// Simple query
export const projectsQuery = supabase.from('projects').select()

// Query with type
export type Projects = QueryData<typeof projectsQuery>

// Dynamic query function
export const projectQuery = (slug: string) => 
  supabase
    .from('projects')
    .select(`
      *,
      tasks(
        id,
        name,
        status,
        due_date
      )
    `)
    .eq('slug', slug)
    .single()

export type Project = QueryData<ReturnType<typeof projectQuery>>

// Complex nested query
export const tasksWithProjectsQuery = supabase
  .from('tasks')
  .select(`
    *,
    projects (
      id,
      name,
      slug
    )
  `)

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>
```

### Usage in Components

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { projectsQuery, type Projects } from '@/utils/supaQueries'

const projects = ref<Projects | null>(null)

const getProjects = async () => {
  const { data, error, status } = await projectsQuery

  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }

  projects.value = data
}

await getProjects()
</script>
```

## TypeScript Type Generation

### Generate Types from Schema

**File:** `package.json`

```json
{
  "scripts": {
    "supabase:types": "npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > database/types.ts"
  }
}
```

**Run:**

```bash
npm run supabase:types
```

### Use Generated Types

**File:** `src/lib/supabaseClient.ts`

```typescript
import type { Database } from '../../database/types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)
```

**File:** `src/pages/projects/index.vue`

```typescript
import type { Tables } from '@/database/types'

const projects = ref<Tables<'projects'>[] | null>(null)
```

## Database Migrations

### Supabase CLI Setup

**Install:**

```bash
npm install supabase --save-dev
```

**Package Scripts:**

```json
{
  "scripts": {
    "supabase:init": "supabase init",
    "supabase:login": "supabase login",
    "supabase:link": "supabase link --project-ref YOUR_PROJECT_REF",
    "db:migrate:new": "supabase migration new migration-name",
    "db:reset": "supabase db reset --linked"
  }
}
```

### Create Migration

**File:** `supabase/migrations/YYYYMMDDHHMMSS_projects-schema.sql`

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
    description text,
    collaborators text array default array[]::varchar[] not null
  );
```

**Apply Migration:**

```bash
npm run db:reset
```

## Database Seeding

### Seed Script Setup

**File:** `database/seed.js`

```javascript
/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

const seedProjects = async (numEntries) => {
  logStep('Seeding projects...')
  const projects = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)

    projects.push({
      name: name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      description: faker.lorem.paragraph(2),
      collaborators: faker.helpers.arrayElements([1, 2, 3])
    })
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projects)
    .select('id')

  if (error) return logErrorAndExit('Projects', error)

  logStep('Projects seeded successfully.')
  return data
}

const seedDatabase = async (numEntriesPerTable) => {
  await seedProjects(numEntriesPerTable)
}

const numEntriesPerTable = 10
seedDatabase(numEntriesPerTable)
```

**Package Script:**

```json
{
  "scripts": {
    "db:seed": "node --env-file=.env database/seed.js"
  }
}
```

**Run:**

```bash
npm run db:seed
```

## Update Operations

### Update Query Pattern

**File:** `src/utils/supaQueries.ts`

```typescript
export const updateProjectQuery = (updatedProject = {}, id: number) => {
  return supabase
    .from('projects')
    .update(updatedProject)
    .eq('id', id)
}
```

**Usage:**

```typescript
const updateProject = async () => {
  if (!project.value) return

  const { tasks, id, ...projectProperties } = project.value

  const { error, status } = await updateProjectQuery(
    projectProperties,
    project.value.id
  )

  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }
}
```

## Error Handling

### Supabase Error Pattern

```typescript
const { data, error, status } = await projectsQuery

if (error) {
  useErrorStore().setError({ error, customCode: status })
  return
}

if (data) {
  projects.value = data
}
```

### Error Types

```typescript
import type { PostgrestError } from '@supabase/supabase-js'

// Supabase errors
if (error) {
  // error.code - PostgreSQL error code
  // error.message - Error message
  // error.details - Additional details
  // error.hint - Helpful hint
  // status - HTTP status code
}
```

## Best Practices

1. **Centralize queries:** Put all Supabase queries in `utils/supaQueries.ts`
2. **Type safety:** Generate and use TypeScript types from schema
3. **Error handling:** Always handle errors and use error store
4. **Service role key:** Only use in server-side scripts (seed.js)
5. **Environment variables:** Never commit `.env` files
6. **Migrations:** Use migrations for schema changes
7. **Seeding:** Use Faker.js for realistic test data

## Common Gotchas

1. **Service role key:** Never expose in client-side code
2. **Type generation:** Run after schema changes
3. **Query types:** Use `QueryData<typeof query>` for type inference
4. **Nested queries:** Use parentheses syntax for relations
5. **Single queries:** Use `.single()` for single row results
6. **Array columns:** Use `text array` type in PostgreSQL

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase TypeScript Support](https://supabase.com/docs/reference/javascript/typescript-support)
