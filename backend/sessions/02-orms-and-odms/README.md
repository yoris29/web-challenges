# ORMs & ODMs

### **Workshop Title:** ORMs & ODMs

### **Objectives:**

By the end of this workshop, you will be able to:

- Understand the core concepts of ORMs and ODMs and their benefits.
- Connect a Node.js application to a MongoDB database using Mongoose.
- Define schemas and models to structure and validate your data.
- Implement data relationships and population in Mongoose.
- Set up Prisma as a modern, type-safe ODM for Postgres.
- Perform CRUD operations using both Mongoose and Prisma.

## 1. What is an ORM / ODM and why do we need it?

### The Core Problem: The "Impedance Mismatch"

In our application code (like JavaScript), we love working with objects. They have properties and methods and can be nicely nested.

```javascript
// We think in objects
const user = {
  id: 1,
  username: "john_doe",
  posts: [
    { id: 101, title: "My first post" },
    { id: 102, title: "My second post" },
  ],
};
```

However, traditional SQL databases think in terms of flat, tabular data (rows and columns). Document databases like MongoDB are closer to objects but still have their own query language and structure.

This difference between how our code represents data (objects) and how the database stores it (tables/documents) is called the **Object-Relational Impedance Mismatch**.

### Life Without an ORM/ODM

Without an ORM or ODM, you have to manually write code to bridge this gap:

1.  Write raw SQL or database-specific queries as strings.
2.  Execute the query using a database driver.
3.  Loop through the results (rows or documents).
4.  Manually map each field to a property on an object you create.

**Example (Manual SQL Query):**

```javascript
// Manually fetching a user and their posts
const userRows = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
const user = {
  id: userRows[0].id,
  username: userRows[0].username,
  posts: [],
};

const postRows = await db.query("SELECT * FROM posts WHERE user_id = ?", [
  userId,
]);
for (const row of postRows) {
  user.posts.push({ id: row.id, title: row.title });
}
```

This is tedious, error-prone, and mixes database logic directly into your application code.

### How ORMs & ODMs Solve This

An ORM/ODM acts as a translator, letting you work with objects in your code while it handles the database communication behind the scenes.

**Example (With an ORM):**

```javascript
// Fetching a user and their posts with an ORM
const user = await User.findById(userId, {
  include: "posts", // Automatically joins and maps the posts
});
```

Notice how we're just using object-oriented methods. The ORM generates the efficient SQL, executes it, and "hydrates" the `User` object with its related `posts`.

### ORM (Object-Relational Mapper):

- **What it is:** A library that maps your application's objects to rows in a relational (SQL) database table (e.g., PostgreSQL, MySQL).
- **Why we need it:**
  - **Productivity:** Hides raw SQL boilerplate, letting you write database queries using your programming language's syntax.
  - **Maintainability:** Centralizes your data model definition in one place. Changing a column is done in the model, not in dozens of scattered SQL strings.
  - **Database Independence:** Makes it easier to switch between different SQL databases because the ORM abstracts the specific SQL dialects.
  - **Advanced Features:** Provides features like query optimization, caching, and transaction management out of the box.

### ODM (Object-Document Mapper):

- **What it is:** The equivalent of an ORM for document databases (like MongoDB). It maps objects to documents.
- **Why we need it:**
  - **Schema Enforcement:** While MongoDB is "schema-less," most real-world applications need a predictable data structure. An ODM like Mongoose allows you to enforce an application-level schema, including data types and validation rules.
  - **Convenience Methods:** Adds helpful methods for querying and manipulating data (e.g., `.populate()` in Mongoose to simulate joins).
  - **Middleware & Hooks:** Allows you to run code before or after certain database operations (e.g., hashing a password before saving a user).
  - **Abstraction:** Provides a cleaner, more object-oriented way to interact with the database than the native driver.

## 2. Introduction to Mongoose

### What is Mongoose?

- The most popular Node.js ODM for MongoDB.
- It provides a straightforward, schema-based solution for modeling your application data.
- It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

### Key Concepts:

- **Schema:** A Mongoose schema defines the structure of the document, default values, validators, etc. It's a blueprint for your data. Think of it as the application-level definition of what a `Course` or `Lesson` should look like.
- **Model:** A Mongoose model is a wrapper on the Mongoose schema. A Mongoose model provides an interface to the database for creating, querying, updating, deleting records, etc. Essentially, it's a constructor compiled from a schema definition, and an instance of a model is a document.
- **Document:** An instance of a model. You can call methods on it like `.save()`.

## 3. Adding Mongoose to a Courses API & Creating Data Models

### 3.1 Install & Connect

```bash
npm install mongoose
```

```javascript
// db.js
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection
  .on("connected", () => console.log("MongoDB connected"))
  .on("error", (err) => console.error("MongoDB error", err));
```

### 3.2 Define Schemas & Models

Here, we define two schemas: `CourseSchema` and `LessonSchema`.

- **`CourseSchema`**:
  - `title`: A required string.
  - `description`: An optional string.
  - `lessons`: An array of `ObjectId`s. The `ref: 'Lesson'` option is crucial. It tells Mongoose that each `ObjectId` in this array refers to a document in the `Lesson` collection. This is what enables population later.
- **`LessonSchema`**:
  - `title`: An optional string.
  - `content`: An optional string.

```javascript
// models/Course.js
const { Schema, model } = require("mongoose");

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

module.exports = model("Course", CourseSchema);
```

```javascript
// models/Lesson.js
const { Schema, model } = require("mongoose");

const LessonSchema = new Schema({
  title: String,
  content: String,
});

module.exports = model("Lesson", LessonSchema);
```

## 4. Using Population & Referencing in Mongoose

**Population** is the process of automatically replacing the specified paths in a document with document(s) from other collection(s). It's Mongoose's way of performing the equivalent of a SQL `JOIN`, but it typically works by running a second query behind the scenes.

When we query for a `Course`, its `lessons` field contains an array of `ObjectId`s. If we want the actual lesson documents, we use `.populate('lessons')`. Mongoose then runs a separate query to find all `Lesson` documents whose `_id` is in the `course.lessons` array and stitches them together.

### 4.1 Add Lesson to Course

This example shows how to link a `Lesson` to a `Course`. We find a `Course` by its ID and use the MongoDB `$push` operator to add a `lessonId` to the `lessons` array.

```javascript
// routes/course.js
router.post("/:courseId/lessons/:lessonId", async (req, res) => {
  const updated = await Course.findByIdAndUpdate(
    req.params.courseId,
    { $push: { lessons: req.params.lessonId } },
    { new: true }
  );
  res.json(updated);
});
```

### 4.2 Retrieve a Course with Lessons

The `.populate('lessons')` call is the key. It tells Mongoose to look at the `lessons` field, see the `ObjectId`s, and replace them with the full `Lesson` documents from the `Lesson` collection.

```javascript
const courseWithLessons = await Course.findById(courseId).populate("lessons");
console.log(courseWithLessons);
```

The `.populate()` call replaces each lesson ID with the full document.

## 5. Introduction to Prisma

### What is Prisma?

Prisma is a next-generation ORM for Node.js and TypeScript. It works with PostgreSQL, MySQL, SQL Server, SQLite, and MongoDB. It's not just an ORM; it's a toolkit that includes:

- **Prisma Client:** A type-safe and auto-generated query builder for your database.
- **Prisma Migrate:** A powerful, declarative data modeling and migration tool.
- **Prisma Studio:** A modern GUI for viewing and editing data in your database.

### Key Concepts:

- **Prisma Schema (`schema.prisma`):** This is the single source of truth for your database schema and application models. You define your data models, relations, and database connection here in a declarative way.
- **Prisma Client:** An auto-generated and type-safe query builder that is tailored to your schema. You use it in your application code to read and write data to your database. It provides methods like `.findUnique()`, `.create()`, `.update()`, etc.
- **Prisma Migrate:** A tool that reads your Prisma schema, compares it to the state of your database, and generates and applies the necessary SQL migrations to sync them. This provides a safe, version-controlled way to evolve your database schema.

## 6. Adding Prisma to a Courses API & Creating Data Models

### 6.1 Install & Initialize

First, install the Prisma CLI and Client packages.

```bash
npm install prisma --save-dev
npm install @prisma/client
```

Next, initialize Prisma in your project, specifying `postgresql` as the data source.

```bash
npx prisma init --datasource-provider postgresql
```

This creates a `prisma` directory with a `schema.prisma` file and adds a `DATABASE_URL` variable to your `.env` file. Update it with your PostgreSQL connection string.

Now, create a reusable Prisma Client instance.

```javascript
// prismaClient.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;
```

### 6.2 Define Schema & Run Migrations

Define your models in `prisma/schema.prisma`.

- **`Course` model**:
  - `id`: An auto-incrementing integer primary key.
  - `lessons`: A relation field. `Lesson[]` indicates that a `Course` can have many `Lesson` records.
- **`Lesson` model**:
  - `id`: An auto-incrementing integer primary key.
  - `course`: A relation field that connects back to a single `Course`. The `@relation` attribute defines the foreign key (`courseId`) and what it references (`id` on the `Course` model).
  - `courseId`: The actual foreign key column in the database table.

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Course {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  lessons     Lesson[] // Relation field
}

model Lesson {
  id      Int     @id @default(autoincrement())
  title   String
  content String?

  // Relation fields
  course   Course @relation(fields: [courseId], references: [id])
  courseId Int
}
```

With a SQL database, you need to sync your schema with the database. Prisma Migrate handles this. Run the following command to create the SQL migration files and apply them to your database.

```bash
npx prisma migrate dev
```

This command does two things:

1.  **Creates a new SQL migration file:** It compares your `schema.prisma` file to the database schema and generates the SQL needed to make the database match your schema.
2.  **Applies the migration:** It runs the generated SQL against your database.

After any changes to your `schema.prisma` file, you need to generate the Prisma Client to update its types. The `prisma migrate dev` command does this for you automatically. However, you can also run it manually:

```bash
npx prisma generate
```

You typically run `npx prisma generate` after changing the schema file or after installing dependencies (`npm install`).

## 7. Using Relations in Prisma

**Relations** in Prisma are connections between models. Unlike Mongoose's population (which runs a separate query), Prisma's `include` option typically translates to a single, efficient SQL `JOIN` operation at the database level. This can be more performant for complex queries.

When you query for a `Course`, you can use `include: { lessons: true }` to fetch the course and all its related lessons in one go.

### 7.1 Add a Lesson to a Course

When creating a `Lesson`, you can connect it to an existing `Course` by providing its foreign key.

```javascript
// addLesson.js
async function addLesson(courseId) {
  const lesson = await prisma.lesson.create({
    data: {
      title: "Lesson with Prisma",
      content: "CRUD operations via Prisma on PostgreSQL",
      course: { connect: { id: courseId } },
    },
  });
  console.log("Added Lesson:", lesson);
}
```

### 7.2 Retrieve a Course with Lessons

To fetch a course and all its associated lessons, use the `include` option. Prisma handles the SQL JOIN for you.

```javascript
// fetchCourse.js
async function fetchCourse(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }, // Include the related lessons
  });
  console.log("Course with Lessons:", course);
}
```

The `include` call tells Prisma to fetch the `Course` record and join the related `Lesson` records.

## 9. ✅ Preparation Checklist

- IDE of your choice
- Node.js installed
- MongoDB Atlas account or a local setup
- PostgreSQL running locally or via a cloud provider
- `npm install` to pull in dependencies

## 10. 🎓 Next Steps & Q/A

- **Assignment (optional):** Build a mini blog API using Prisma+PostgreSQL or Mongoose+MongoDB—implement full CRUD and populate relational data.
- **Q/A:** Clarify any schema, migration, or query-related questions.
