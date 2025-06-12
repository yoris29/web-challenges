# 🏆 {CHALLENGE_TITLE}

**Master Express.js fundamentals through hands-on backend development!**

Welcome to this exciting Express.js challenge! This experience is designed to help you apply what you've learned in our workshops through practical server-side coding. Below you'll find everything you need to get started, including setup instructions and clear submission guidelines.

---

## 📖 Challenge Overview

- **Challenge Name:** `{CHALLENGE_NAME}`
- **Track:** `Backend`
- **Level:** `{LEVEL}`
- **Technologies:** `{TECHNOLOGIES}` (e.g., Express.js, Node.js, MongoDB, JWT)
- **Goal:** {GOAL_DESCRIPTION}

> ✨ _Example Goal_: Build a REST API for user management, create a middleware authentication system, or develop a real-time chat server with WebSockets.

---

## 🧠 Learning Objectives

By completing this challenge, you'll master:

- ✅ {LEARNING_OBJECTIVE_1}
- ✅ {LEARNING_OBJECTIVE_2}
- ✅ {LEARNING_OBJECTIVE_3}
- ✅ {LEARNING_OBJECTIVE_4}

---

## 📁 Project Structure

```bash
{CHALLENGE_FOLDER_NAME}/
├── starter/              # Your workspace - code here!
│   ├── src/              # Your source code
│   │   ├── routes/       # API route handlers
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Custom middleware functions
│   │   ├── models/       # Database models/schemas
│   │   └── app.js        # Main Express application
│   ├── package.json      # Project dependencies and scripts
│   ├── .env.example      # Environment variables template
│   └── README.md         # Challenge-specific instructions
├── solution/             # Reference solution (unlocked after deadline)
└── README.md             # This file
```

---

## 🚀 Getting Started

### 🛠 Prerequisites

Make sure you have these installed:

- **Node.js** (version 18+) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))
- Git for version control
- {ADDITIONAL_PREREQUISITES} (e.g., MongoDB, Postman for API testing)

### ⚡ Setup Instructions

Navigate to the challenge folder and follow these steps:

```bash
# 1. Navigate to the starter folder
cd {CHALLENGE_FOLDER_NAME}/starter

# 2. Install project dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env file with your configuration

# 4. Start the development server
npm run dev

# 5. Your server will be running at http://localhost:{PORT}
```

**What these commands do:**

- `npm install` - Downloads and installs all the packages your project needs
- `cp .env.example .env` - Creates your local environment configuration file
- `npm run dev` - Starts the server with automatic restart on file changes (using nodemon)

> 🔄 **Troubleshooting:** If you encounter errors, try deleting the `node_modules` folder and `package-lock.json`, then run `npm install` again.

---

## 🎯 Your Mission

{DETAILED_REQUIREMENTS}

### 📋 Requirements Checklist

- [ ] {REQUIREMENT_1}
- [ ] {REQUIREMENT_2}
- [ ] {REQUIREMENT_3}
- [ ] {REQUIREMENT_4}
- [ ] **Bonus:** {BONUS_REQUIREMENT}

---

## 🔌 API Endpoints

{API_ENDPOINTS_DESCRIPTION}

### 📋 Expected Endpoints

- `{HTTP_METHOD} {ENDPOINT_PATH}` - {ENDPOINT_DESCRIPTION}
- `{HTTP_METHOD} {ENDPOINT_PATH}` - {ENDPOINT_DESCRIPTION}
- `{HTTP_METHOD} {ENDPOINT_PATH}` - {ENDPOINT_DESCRIPTION}

### 📝 Request/Response Examples

```javascript
// Example API call
{
  API_EXAMPLE;
}
```

---

## 🧪 Testing Your Solution

Before submitting, make sure to test your API:

```bash
# Start the development server
npm run dev

# Test with curl (example)
curl -X GET http://localhost:{PORT}/api/endpoint

# Or use Postman, Insomnia, or Thunder Client (VS Code extension)
```

### ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] All required endpoints respond correctly
- [ ] Request validation works as expected
- [ ] Error handling returns appropriate status codes
- [ ] Database operations work correctly (if applicable)
- [ ] Authentication/authorization works (if applicable)

### 🛠️ Recommended Testing Tools

- **Postman** - Full-featured API testing
- **Thunder Client** - VS Code extension for API testing
- **curl** - Command-line HTTP client
- **Insomnia** - Lightweight API testing tool

---

## 📋 Challenge Rules

- ❌ **Do not** modify the `solution/` folder — it's only for reference after the challenge deadline
- ✅ Work exclusively inside the `starter/` folder
- ✅ You may install additional npm packages if needed
- ✅ Keep your code clean, well-commented, and organized
- ✅ Follow Express.js best practices and RESTful API conventions
- ✅ Handle errors gracefully with appropriate HTTP status codes

---

## 💡 Helpful Resources

- 📚 [Express.js Documentation](https://expressjs.com/)
- 🛠️ [Node.js Documentation](https://nodejs.org/docs/)
- 🔐 [JWT.io](https://jwt.io/) (for authentication challenges)
- 🗄️ [MongoDB Documentation](https://docs.mongodb.com/) (if using MongoDB)
- 📡 [HTTP Status Codes](https://httpstatuses.com/)
- {ADDITIONAL_RESOURCES}

---

## 🚀 Submission Process

Once your API is ready:

1. **🧪 Test** your endpoints thoroughly
2. **📝 Commit** your changes inside the `starter/` folder:
   ```bash
   git add .
   git commit -m "Complete {CHALLENGE_NAME} challenge"
   ```
3. **🔄 Push** your solution to your forked repository:
   ```bash
   git push origin main
   ```
4. **📤 Create** a **Pull Request** to the original repository

### 🏷️ PR Requirements

Make sure to **label your PR** with:

- `backend`

**PR Title Format:** `[Backend] {CHALLENGE_NAME} - Your Name`

See the complete workflow in the [CONTRIBUTING.md](../../CONTRIBUTING.md) file.

---

## 💬 Get Support & Connect

Need help or want to share your progress?

- 🗣️ **Ask questions** in [GitHub Discussions](https://github.com/Adel2411/web-challenges/discussions)
- 🔍 **Search existing discussions** - someone might have faced the same challenge
- 🤝 **Help others** and learn together
- 💡 **Share your API solutions** and get feedback

Remember: Backend development can be tricky, but every challenge makes you stronger! 💙

---

## 🎉 What's Next?

After completing this challenge:

- ✨ Review the reference solution once it's unlocked
- 🎯 Try the bonus requirements if you haven't already
- 🚀 Move on to the next backend challenge in the series
- 🤝 Help other participants in the discussions
- 📚 Explore advanced Express.js concepts

**Happy coding, and remember - every API you build makes you a better developer!** 🌟
