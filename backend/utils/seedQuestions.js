import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { Category } from "../models/category.model.js";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config({});

// Function to randomize correct answer positions
// Uses a deterministic but varied pattern to distribute answers across all positions
function randomizeCorrectAnswers(questions) {
    return questions.map((q, index) => {
        // Create a varied distribution pattern
        // Use a combination of index and a prime number to create variety
        const prime = 17; // Prime number for better distribution
        const position = (index * prime + Math.floor(index / 4)) % 4;
        
        // Get the correct answer (currently at index 0)
        const correctAnswer = q.options[0];
        
        // Create new options array
        const newOptions = [...q.options];
        
        // Swap the correct answer to the target position
        newOptions[0] = newOptions[position];
        newOptions[position] = correctAnswer;
        
        return {
            ...q,
            options: newOptions,
            correctAnswer: position
        };
    });
}

// Sample questions for each category
const sampleQuestionsRaw = {
    "Frontend Developer": [
        {
            question: "What is React?",
            options: [
                "A JavaScript library for building user interfaces",
                "A database management system",
                "A server-side framework",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "Which hook is used to manage state in functional components?",
            options: [
                "useState",
                "useEffect",
                "useContext",
                "useReducer"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is JSX?",
            options: [
                "JavaScript XML - syntax extension for JavaScript",
                "A database query language",
                "A CSS framework",
                "A testing library"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the virtual DOM?",
            options: [
                "A programming concept where a virtual representation of the UI is kept in memory",
                "A physical component of the browser",
                "A type of database",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "Which method is used to update state in React?",
            options: [
                "setState or useState setter function",
                "updateState",
                "changeState",
                "modifyState"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of useEffect hook?",
            options: [
                "To perform side effects in functional components",
                "To manage component state",
                "To create context",
                "To handle events"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is props in React?",
            options: [
                "Properties passed from parent to child components",
                "A state management library",
                "A routing library",
                "A styling framework"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between controlled and uncontrolled components?",
            options: [
                "Controlled components have their state controlled by React, uncontrolled by DOM",
                "Controlled components are faster",
                "Uncontrolled components are more secure",
                "There is no difference"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is Redux used for?",
            options: [
                "State management in JavaScript applications",
                "API calls",
                "Database operations",
                "File handling"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of keys in React lists?",
            options: [
                "To help React identify which items have changed",
                "To encrypt data",
                "To sort items",
                "To filter items"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is CSS-in-JS?",
            options: [
                "Writing CSS styles using JavaScript",
                "A CSS preprocessor",
                "A JavaScript framework",
                "A database system"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between let, const, and var?",
            options: [
                "let and const are block-scoped, var is function-scoped",
                "They are all the same",
                "var is block-scoped, let and const are function-scoped",
                "const can be reassigned"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is async/await?",
            options: [
                "A way to handle asynchronous operations in JavaScript",
                "A database query method",
                "A CSS property",
                "A React component"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of webpack?",
            options: [
                "A module bundler for JavaScript applications",
                "A database",
                "A server framework",
                "A testing tool"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is TypeScript?",
            options: [
                "A typed superset of JavaScript",
                "A CSS framework",
                "A database language",
                "A server framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between == and === in JavaScript?",
            options: [
                "== compares values with type coercion, === compares values and types",
                "They are identical",
                "=== is deprecated",
                "== is more strict"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the event loop in JavaScript?",
            options: [
                "A mechanism that handles asynchronous operations",
                "A loop in the code",
                "A database operation",
                "A CSS animation"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of npm?",
            options: [
                "Package manager for Node.js",
                "A database system",
                "A web server",
                "A CSS framework"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between null and undefined?",
            options: [
                "null is an assigned value, undefined means a variable has been declared but not assigned",
                "They are the same",
                "undefined is an assigned value",
                "null means not declared"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a closure in JavaScript?",
            options: [
                "A function that has access to variables in its outer scope",
                "A database connection",
                "A CSS property",
                "A React hook"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of React Router?",
            options: [
                "To handle navigation and routing in React applications",
                "To manage state",
                "To handle API calls",
                "To style components"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a Higher Order Component (HOC) in React?",
            options: [
                "A function that takes a component and returns a new component",
                "A component that is higher in the tree",
                "A component with more props",
                "A component with state"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of useMemo hook?",
            options: [
                "To memoize expensive calculations",
                "To manage state",
                "To handle side effects",
                "To create context"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of useCallback hook?",
            options: [
                "To memoize functions to prevent unnecessary re-renders",
                "To manage state",
                "To handle events",
                "To create refs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is CSS Grid?",
            options: [
                "A layout system for creating two-dimensional grid layouts",
                "A database system",
                "A JavaScript framework",
                "A server technology"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Flexbox?",
            options: [
                "A one-dimensional layout method for arranging items",
                "A database system",
                "A JavaScript library",
                "A server framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the box model in CSS?",
            options: [
                "The model that describes how elements are sized and spaced",
                "A database model",
                "A JavaScript pattern",
                "A server architecture"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between display: block and display: inline?",
            options: [
                "Block takes full width and starts on new line, inline only takes needed width",
                "They are identical",
                "Inline takes full width",
                "Block is for text only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of media queries in CSS?",
            options: [
                "To apply styles based on device characteristics",
                "To query databases",
                "To make API calls",
                "To handle events"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the Document Object Model (DOM)?",
            options: [
                "A programming interface for HTML and XML documents",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between let and const?",
            options: [
                "let can be reassigned, const cannot be reassigned",
                "They are identical",
                "const can be reassigned",
                "let is for constants"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is destructuring in JavaScript?",
            options: [
                "Extracting values from arrays or objects into variables",
                "Destroying data",
                "A database operation",
                "A CSS property"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the spread operator in JavaScript?",
            options: [
                "An operator that expands arrays or objects",
                "An operator that compresses data",
                "A database query",
                "A CSS selector"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a promise in JavaScript?",
            options: [
                "An object representing eventual completion of an async operation",
                "A database connection",
                "A CSS animation",
                "A React component"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of map() function in JavaScript?",
            options: [
                "To transform each element of an array",
                "To filter elements",
                "To reduce an array",
                "To sort an array"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of filter() function in JavaScript?",
            options: [
                "To create a new array with elements that pass a test",
                "To transform elements",
                "To reduce an array",
                "To sort an array"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of reduce() function in JavaScript?",
            options: [
                "To reduce an array to a single value",
                "To filter elements",
                "To transform elements",
                "To sort elements"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a callback function?",
            options: [
                "A function passed as an argument to another function",
                "A function that calls back",
                "A database function",
                "A CSS function"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of localStorage?",
            options: [
                "To store data in the browser that persists across sessions",
                "To store data on the server",
                "To store CSS styles",
                "To store JavaScript code"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between localStorage and sessionStorage?",
            options: [
                "localStorage persists until cleared, sessionStorage clears on tab close",
                "They are identical",
                "sessionStorage persists forever",
                "localStorage clears on tab close"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of fetch API?",
            options: [
                "To make HTTP requests in JavaScript",
                "To fetch CSS files",
                "To fetch database data",
                "To fetch user input"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between arrow functions and regular functions?",
            options: [
                "Arrow functions don't have their own 'this' binding",
                "They are identical",
                "Regular functions don't have 'this'",
                "Arrow functions can't be used"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of template literals in JavaScript?",
            options: [
                "To create strings with embedded expressions",
                "To create templates",
                "To create functions",
                "To create objects"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of CSS variables?",
            options: [
                "To store reusable values in CSS",
                "To store JavaScript variables",
                "To store database values",
                "To store API responses"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of CSS preprocessors like SASS?",
            options: [
                "To add features like variables and nesting to CSS",
                "To compile JavaScript",
                "To process databases",
                "To handle API calls"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of Babel?",
            options: [
                "To transpile modern JavaScript to older versions",
                "To compile CSS",
                "To process databases",
                "To handle routing"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of ESLint?",
            options: [
                "To find and fix problems in JavaScript code",
                "To compile code",
                "To run tests",
                "To deploy applications"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of Prettier?",
            options: [
                "To format code automatically",
                "To compile code",
                "To test code",
                "To deploy code"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between margin and padding in CSS?",
            options: [
                "Margin is space outside element, padding is space inside element",
                "They are identical",
                "Padding is outside, margin is inside",
                "They don't exist"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of z-index in CSS?",
            options: [
                "To control the stacking order of elements",
                "To control width",
                "To control height",
                "To control color"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Backend Developer": [
        {
            question: "What is Node.js?",
            options: [
                "A JavaScript runtime built on Chrome's V8 engine",
                "A database system",
                "A CSS framework",
                "A frontend library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Express.js?",
            options: [
                "A web application framework for Node.js",
                "A database",
                "A CSS preprocessor",
                "A testing framework"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is REST API?",
            options: [
                "Representational State Transfer - an architectural style for APIs",
                "A database system",
                "A programming language",
                "A CSS framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is middleware in Express?",
            options: [
                "Functions that execute during the request-response cycle",
                "A database",
                "A CSS file",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is MongoDB?",
            options: [
                "A NoSQL document database",
                "A SQL database",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is JWT?",
            options: [
                "JSON Web Token - a standard for securely transmitting information",
                "A database system",
                "A CSS framework",
                "A server framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of bcrypt?",
            options: [
                "Password hashing library",
                "Database encryption",
                "File compression",
                "API authentication"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between SQL and NoSQL databases?",
            options: [
                "SQL is relational, NoSQL is non-relational",
                "They are the same",
                "NoSQL is faster always",
                "SQL is newer"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is an API endpoint?",
            options: [
                "A specific URL where an API can be accessed",
                "A database table",
                "A CSS class",
                "A JavaScript function"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is CORS?",
            options: [
                "Cross-Origin Resource Sharing - a security feature",
                "A database system",
                "A CSS property",
                "A JavaScript framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of environment variables?",
            options: [
                "To store configuration settings securely",
                "To store database data",
                "To store CSS styles",
                "To store JavaScript code"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is async/await used for in backend development?",
            options: [
                "To handle asynchronous operations",
                "To handle synchronous operations",
                "To handle database connections only",
                "To handle file uploads only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of Mongoose?",
            options: [
                "ODM (Object Data Modeling) library for MongoDB",
                "A CSS framework",
                "A JavaScript runtime",
                "A testing library"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between PUT and PATCH?",
            options: [
                "PUT replaces entire resource, PATCH updates partial resource",
                "They are identical",
                "PATCH replaces entire resource",
                "PUT is for GET requests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is rate limiting?",
            options: [
                "Controlling the number of requests a client can make",
                "Limiting database size",
                "Limiting file size",
                "Limiting memory usage"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of validation in APIs?",
            options: [
                "To ensure data integrity and security",
                "To speed up requests",
                "To compress data",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between authentication and authorization?",
            options: [
                "Authentication verifies identity, authorization verifies permissions",
                "They are the same",
                "Authorization verifies identity",
                "Authentication is for databases only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a database index?",
            options: [
                "A data structure that improves query performance",
                "A database table",
                "A database column",
                "A database row"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of transactions in databases?",
            options: [
                "To ensure data consistency and atomicity",
                "To speed up queries",
                "To compress data",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is microservices architecture?",
            options: [
                "An architectural style where applications are built as independent services",
                "A database design pattern",
                "A CSS architecture",
                "A JavaScript pattern"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of GraphQL?",
            options: [
                "A query language for APIs that allows clients to request specific data",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between GraphQL and REST?",
            options: [
                "GraphQL allows clients to request specific fields, REST returns fixed data",
                "They are identical",
                "REST is newer",
                "GraphQL is only for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of Redis?",
            options: [
                "In-memory data structure store used as cache or database",
                "A CSS framework",
                "A JavaScript library",
                "A server framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of message queues?",
            options: [
                "To enable asynchronous communication between services",
                "To store messages",
                "To send emails",
                "To handle HTTP requests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API versioning?",
            options: [
                "To manage changes to APIs without breaking existing clients",
                "To version code",
                "To version databases",
                "To version CSS"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of database migrations?",
            options: [
                "To manage database schema changes over time",
                "To migrate data",
                "To migrate servers",
                "To migrate code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of connection pooling?",
            options: [
                "To reuse database connections efficiently",
                "To pool resources",
                "To pool data",
                "To pool files"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of load balancing?",
            options: [
                "To distribute incoming requests across multiple servers",
                "To balance databases",
                "To balance files",
                "To balance code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of caching?",
            options: [
                "To store frequently accessed data for faster retrieval",
                "To cache files",
                "To cache code",
                "To cache databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between horizontal and vertical scaling?",
            options: [
                "Horizontal adds more servers, vertical adds more resources to existing server",
                "They are identical",
                "Vertical adds more servers",
                "Horizontal adds more resources"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API documentation?",
            options: [
                "To help developers understand how to use an API",
                "To document code",
                "To document databases",
                "To document CSS"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of error handling in APIs?",
            options: [
                "To gracefully handle and communicate errors to clients",
                "To ignore errors",
                "To hide errors",
                "To create errors"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of logging in backend applications?",
            options: [
                "To track application events and debug issues",
                "To log users in",
                "To log data out",
                "To log files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of unit testing in backend?",
            options: [
                "To test individual components in isolation",
                "To test entire systems",
                "To test databases",
                "To test networks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of integration testing?",
            options: [
                "To test how different components work together",
                "To test individual components",
                "To test databases only",
                "To test networks only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of database normalization?",
            options: [
                "To organize data to reduce redundancy and improve integrity",
                "To normalize code",
                "To normalize files",
                "To normalize servers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database denormalization?",
            options: [
                "To improve read performance by adding redundant data",
                "To remove all data",
                "To normalize data",
                "To delete databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database replication?",
            options: [
                "To copy data across multiple databases for availability",
                "To delete data",
                "To compress data",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database sharding?",
            options: [
                "To partition data across multiple databases",
                "To delete data",
                "To compress data",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API gateways?",
            options: [
                "To act as a single entry point for multiple microservices",
                "To gate APIs",
                "To block APIs",
                "To create APIs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of webhooks?",
            options: [
                "To allow servers to send real-time data to clients",
                "To hook web pages",
                "To hook databases",
                "To hook files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of serverless functions?",
            options: [
                "To run code without managing servers",
                "To run without code",
                "To run without functions",
                "To run without databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of containerization?",
            options: [
                "To package applications with dependencies for consistent deployment",
                "To contain data",
                "To contain files",
                "To contain code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of API throttling?",
            options: [
                "To limit the rate of API requests from clients",
                "To throttle databases",
                "To throttle files",
                "To throttle code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of database backups?",
            options: [
                "To create copies of data for recovery purposes",
                "To back up code",
                "To back up files",
                "To back up servers"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of database clustering?",
            options: [
                "To group multiple database servers for high availability",
                "To cluster data",
                "To cluster files",
                "To cluster code"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API authentication tokens?",
            options: [
                "To verify the identity of API clients",
                "To tokenize data",
                "To tokenize files",
                "To tokenize code"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of database views?",
            options: [
                "To create virtual tables based on query results",
                "To view databases",
                "To view files",
                "To view code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of stored procedures?",
            options: [
                "To store reusable SQL code in the database",
                "To store procedures",
                "To store data",
                "To store files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Data Science": [
        {
            question: "What is Python primarily used for in data science?",
            options: [
                "Data analysis, machine learning, and statistical computing",
                "Web development only",
                "Mobile app development",
                "Game development"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is pandas?",
            options: [
                "A Python library for data manipulation and analysis",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is NumPy?",
            options: [
                "A Python library for numerical computing",
                "A database",
                "A CSS framework",
                "A web framework"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is machine learning?",
            options: [
                "A subset of AI that enables systems to learn from data",
                "A database system",
                "A programming language",
                "A CSS framework"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between supervised and unsupervised learning?",
            options: [
                "Supervised uses labeled data, unsupervised uses unlabeled data",
                "They are the same",
                "Unsupervised uses labeled data",
                "Supervised is faster"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a DataFrame?",
            options: [
                "A two-dimensional data structure in pandas",
                "A database table",
                "A CSS grid",
                "A JavaScript object"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is overfitting in machine learning?",
            options: [
                "When a model performs well on training data but poorly on test data",
                "When a model is too simple",
                "When data is too large",
                "When features are missing"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of train-test split?",
            options: [
                "To evaluate model performance on unseen data",
                "To speed up training",
                "To reduce data size",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is feature engineering?",
            options: [
                "Creating new features from existing data to improve model performance",
                "Building features in software",
                "Designing UI features",
                "Creating database features"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is correlation?",
            options: [
                "A measure of the relationship between two variables",
                "A database operation",
                "A CSS property",
                "A JavaScript function"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data cleaning?",
            options: [
                "To remove errors and inconsistencies from data",
                "To compress data",
                "To encrypt data",
                "To delete data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a neural network?",
            options: [
                "A computing system inspired by biological neural networks",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cross-validation?",
            options: [
                "To assess model performance more reliably",
                "To speed up training",
                "To reduce data size",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is regression in machine learning?",
            options: [
                "Predicting continuous values",
                "Predicting categories",
                "Classifying data",
                "Clustering data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is classification in machine learning?",
            options: [
                "Predicting categories or classes",
                "Predicting continuous values",
                "Clustering data",
                "Reducing dimensions"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of normalization?",
            options: [
                "To scale features to a similar range",
                "To remove features",
                "To add features",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a confusion matrix?",
            options: [
                "A table used to evaluate classification model performance",
                "A database table",
                "A CSS grid",
                "A JavaScript array"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature selection?",
            options: [
                "To choose the most relevant features for modeling",
                "To add more features",
                "To remove all features",
                "To encrypt features"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is deep learning?",
            options: [
                "A subset of machine learning using neural networks with multiple layers",
                "A database system",
                "A CSS framework",
                "A JavaScript framework"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data visualization?",
            options: [
                "To understand and communicate data insights",
                "To compress data",
                "To encrypt data",
                "To delete data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is pandas in Python?",
            options: [
                "A library for data manipulation and analysis",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is NumPy used for?",
            options: [
                "Numerical computing with arrays and matrices",
                "Network programming",
                "Natural language processing",
                "Node.js development"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Matplotlib?",
            options: [
                "A plotting library for creating visualizations in Python",
                "A database system",
                "A web framework",
                "A testing library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of data cleaning?",
            options: [
                "To remove errors and inconsistencies from data",
                "To delete all data",
                "To compress data",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is feature engineering?",
            options: [
                "Creating new features from existing data to improve models",
                "Building features",
                "Designing features",
                "Deleting features"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is cross-validation?",
            options: [
                "A technique to assess model performance on unseen data",
                "A validation method",
                "A testing method",
                "A training method"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of exploratory data analysis (EDA)?",
            options: [
                "To understand data patterns and relationships",
                "To explore databases",
                "To explore files",
                "To explore code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a correlation coefficient?",
            options: [
                "A measure of the strength of relationship between variables",
                "A database coefficient",
                "A CSS coefficient",
                "A JavaScript coefficient"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data preprocessing?",
            options: [
                "To prepare raw data for analysis or modeling",
                "To process databases",
                "To process files",
                "To process code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between supervised and unsupervised learning?",
            options: [
                "Supervised uses labeled data, unsupervised uses unlabeled data",
                "They are identical",
                "Unsupervised uses labeled data",
                "Supervised doesn't use data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of a confusion matrix?",
            options: [
                "To evaluate classification model performance",
                "To confuse data",
                "To confuse models",
                "To confuse users"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature selection?",
            options: [
                "To choose the most relevant features for modeling",
                "To select all features",
                "To delete features",
                "To ignore features"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data sampling?",
            options: [
                "To select a subset of data for analysis",
                "To sample all data",
                "To delete data",
                "To compress data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of outlier detection?",
            options: [
                "To identify unusual data points that may be errors",
                "To detect all data",
                "To delete all data",
                "To compress data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data normalization?",
            options: [
                "To scale data to a common range",
                "To normalize databases",
                "To normalize files",
                "To normalize code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of time series analysis?",
            options: [
                "To analyze data points collected over time",
                "To analyze all data",
                "To analyze databases",
                "To analyze files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of A/B testing?",
            options: [
                "To compare two versions to determine which performs better",
                "To test all versions",
                "To test databases",
                "To test files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of statistical hypothesis testing?",
            options: [
                "To make inferences about populations from sample data",
                "To test hypotheses",
                "To test databases",
                "To test files"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of regression analysis?",
            options: [
                "To model relationships between variables",
                "To regress data",
                "To delete data",
                "To compress data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of clustering algorithms?",
            options: [
                "To group similar data points together",
                "To cluster databases",
                "To cluster files",
                "To cluster code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of dimensionality reduction?",
            options: [
                "To reduce the number of features while preserving information",
                "To reduce data",
                "To delete data",
                "To compress data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of ensemble methods?",
            options: [
                "To combine multiple models for better predictions",
                "To ensemble data",
                "To ensemble files",
                "To ensemble code"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data pipelines?",
            options: [
                "To automate the flow of data through processing steps",
                "To pipe data",
                "To delete data",
                "To compress data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data warehouses?",
            options: [
                "To store and organize large amounts of data for analysis",
                "To store databases",
                "To store files",
                "To store code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of ETL processes?",
            options: [
                "To Extract, Transform, and Load data from various sources",
                "To extract data only",
                "To transform data only",
                "To load data only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data lakes?",
            options: [
                "To store raw data in its native format",
                "To store processed data",
                "To store databases",
                "To store files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data mining?",
            options: [
                "To discover patterns and knowledge from large datasets",
                "To mine databases",
                "To mine files",
                "To mine code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of predictive modeling?",
            options: [
                "To forecast future outcomes based on historical data",
                "To predict databases",
                "To predict files",
                "To predict code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data quality assessment?",
            options: [
                "To evaluate the accuracy and completeness of data",
                "To assess databases",
                "To assess files",
                "To assess code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Graphic Designer": [
        {
            question: "What is Adobe Photoshop primarily used for?",
            options: [
                "Image editing and manipulation",
                "Video editing",
                "Web development",
                "Database management"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between raster and vector graphics?",
            options: [
                "Raster uses pixels, vector uses mathematical equations",
                "They are the same",
                "Vector uses pixels",
                "Raster is always better"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is color theory?",
            options: [
                "The study of how colors interact and affect perception",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is typography?",
            options: [
                "The art and technique of arranging type",
                "A database system",
                "A CSS property",
                "A JavaScript function"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of a design brief?",
            options: [
                "To outline project requirements and objectives",
                "To compress files",
                "To encrypt data",
                "To delete files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the rule of thirds?",
            options: [
                "A composition guideline dividing image into nine equal parts",
                "A database rule",
                "A CSS rule",
                "A JavaScript rule"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Adobe Illustrator used for?",
            options: [
                "Creating vector graphics and illustrations",
                "Video editing",
                "Web development",
                "Database management"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between CMYK and RGB?",
            options: [
                "CMYK is for print, RGB is for digital displays",
                "They are the same",
                "RGB is for print",
                "CMYK is always better"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is white space in design?",
            options: [
                "Empty space that helps balance and organize design elements",
                "White colored space only",
                "A database concept",
                "A CSS property"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a mood board?",
            options: [
                "A collection of images and materials to convey a design concept",
                "A database board",
                "A CSS grid",
                "A JavaScript object"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of branding?",
            options: [
                "To create a unique identity for a product or company",
                "To compress files",
                "To encrypt data",
                "To delete files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a logo?",
            options: [
                "A visual symbol representing a brand or company",
                "A database table",
                "A CSS class",
                "A JavaScript function"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of wireframing?",
            options: [
                "To create a basic layout structure before design",
                "To add colors",
                "To add animations",
                "To compress files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Adobe InDesign used for?",
            options: [
                "Page layout and desktop publishing",
                "Image editing",
                "Video editing",
                "Web development"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between serif and sans-serif fonts?",
            options: [
                "Serif has decorative strokes, sans-serif does not",
                "They are the same",
                "Sans-serif has decorative strokes",
                "Serif is always better"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of a style guide?",
            options: [
                "To maintain consistency in design elements",
                "To compress files",
                "To encrypt data",
                "To delete files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is UI design?",
            options: [
                "User Interface design - designing the visual elements users interact with",
                "Database design",
                "Server design",
                "Network design"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is UX design?",
            options: [
                "User Experience design - designing the overall user experience",
                "Database design",
                "Server design",
                "Network design"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of prototyping?",
            options: [
                "To create a working model of a design before final implementation",
                "To compress files",
                "To encrypt data",
                "To delete files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the golden ratio in design?",
            options: [
                "A mathematical ratio (1:1.618) used for aesthetically pleasing proportions",
                "A database ratio",
                "A CSS ratio",
                "A JavaScript ratio"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is Adobe Illustrator primarily used for?",
            options: [
                "Creating vector graphics and illustrations",
                "Photo editing",
                "Video editing",
                "Web development"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Adobe InDesign used for?",
            options: [
                "Page layout and desktop publishing",
                "Image editing",
                "Video editing",
                "Web design"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of a design mockup?",
            options: [
                "To create a visual representation of a design",
                "To mock up code",
                "To mock up databases",
                "To mock up files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of a style guide?",
            options: [
                "To maintain consistent design standards",
                "To guide styles",
                "To guide code",
                "To guide databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between RGB and CMYK color modes?",
            options: [
                "RGB is for digital, CMYK is for print",
                "They are identical",
                "CMYK is for digital",
                "RGB is for print"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of white space in design?",
            options: [
                "To improve readability and visual hierarchy",
                "To waste space",
                "To fill space",
                "To delete space"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of a grid system in design?",
            options: [
                "To create consistent layouts and alignment",
                "To grid designs",
                "To grid code",
                "To grid databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of brand identity design?",
            options: [
                "To create visual elements that represent a brand",
                "To identify brands",
                "To delete brands",
                "To copy brands"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of a logo?",
            options: [
                "To visually represent a brand or company",
                "To log data",
                "To log files",
                "To log code"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of illustration in design?",
            options: [
                "To create custom artwork that enhances communication",
                "To illustrate code",
                "To illustrate databases",
                "To illustrate files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of infographics?",
            options: [
                "To present information visually in an engaging way",
                "To info graphics",
                "To delete graphics",
                "To copy graphics"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of print design?",
            options: [
                "To create designs for physical media",
                "To print code",
                "To print databases",
                "To print files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of digital design?",
            options: [
                "To create designs for digital media and screens",
                "To digitize code",
                "To digitize databases",
                "To digitize files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of packaging design?",
            options: [
                "To create attractive and functional product packaging",
                "To package code",
                "To package databases",
                "To package files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of layout design?",
            options: [
                "To arrange elements in a visually appealing way",
                "To layout code",
                "To layout databases",
                "To layout files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of visual hierarchy?",
            options: [
                "To guide viewer attention through design elements",
                "To hierarchy visuals",
                "To delete visuals",
                "To copy visuals"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of contrast in design?",
            options: [
                "To create visual interest and improve readability",
                "To contrast designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of balance in design?",
            options: [
                "To create visual stability and harmony",
                "To balance designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of alignment in design?",
            options: [
                "To create order and visual connections between elements",
                "To align designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of repetition in design?",
            options: [
                "To create consistency and strengthen visual identity",
                "To repeat designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of proximity in design?",
            options: [
                "To group related elements together",
                "To proximity designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of a color palette?",
            options: [
                "To define a set of colors used consistently in a design",
                "To palette colors",
                "To delete colors",
                "To copy colors"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of font pairing?",
            options: [
                "To combine fonts that work well together",
                "To pair fonts",
                "To delete fonts",
                "To copy fonts"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of image resolution?",
            options: [
                "To determine the quality and clarity of an image",
                "To resolve images",
                "To delete images",
                "To copy images"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design iteration?",
            options: [
                "To refine and improve designs through multiple versions",
                "To iterate designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of client feedback in design?",
            options: [
                "To improve designs based on client input",
                "To feedback designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design portfolios?",
            options: [
                "To showcase a designer's work and skills",
                "To portfolio designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design trends?",
            options: [
                "To stay current with popular design styles",
                "To trend designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design systems?",
            options: [
                "To create reusable design components and standards",
                "To system designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Full Stack Developer": [
        {
            question: "What is a full stack developer?",
            options: [
                "A developer who works on both frontend and backend",
                "A frontend-only developer",
                "A backend-only developer",
                "A database administrator"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What technologies are typically used in the MERN stack?",
            options: [
                "MongoDB, Express, React, Node.js",
                "MySQL, Express, React, Node.js",
                "MongoDB, Ember, React, Node.js",
                "MongoDB, Express, Ruby, Node.js"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of API integration?",
            options: [
                "To connect frontend and backend systems",
                "To compress data",
                "To encrypt data",
                "To delete data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between frontend and backend?",
            options: [
                "Frontend is user-facing, backend is server-side logic",
                "They are the same",
                "Backend is user-facing",
                "Frontend handles databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is version control?",
            options: [
                "A system for tracking changes in code",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Git?",
            options: [
                "A distributed version control system",
                "A database",
                "A CSS framework",
                "A JavaScript framework"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of testing in full stack development?",
            options: [
                "To ensure code quality and functionality",
                "To compress code",
                "To encrypt code",
                "To delete code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is CI/CD?",
            options: [
                "Continuous Integration/Continuous Deployment",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of environment variables in full stack apps?",
            options: [
                "To store configuration settings securely",
                "To store user data",
                "To store CSS styles",
                "To store JavaScript code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between development and production environments?",
            options: [
                "Development is for testing, production is for live users",
                "They are the same",
                "Production is for testing",
                "Development is always faster"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of database migrations?",
            options: [
                "To manage database schema changes over time",
                "To move databases",
                "To compress databases",
                "To encrypt databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between SQL and NoSQL?",
            options: [
                "SQL is relational, NoSQL is non-relational",
                "They are identical",
                "NoSQL is always better",
                "SQL is newer"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of authentication in full stack apps?",
            options: [
                "To verify user identity",
                "To compress data",
                "To encrypt all data",
                "To delete user data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of authorization?",
            options: [
                "To control user access to resources",
                "To verify identity",
                "To compress data",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between stateful and stateless APIs?",
            options: [
                "Stateful stores session data, stateless does not",
                "They are the same",
                "Stateless stores session data",
                "Stateful is always better"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of caching?",
            options: [
                "To improve performance by storing frequently accessed data",
                "To compress data",
                "To encrypt data",
                "To delete data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between synchronous and asynchronous operations?",
            options: [
                "Synchronous blocks execution, asynchronous does not",
                "They are the same",
                "Asynchronous blocks execution",
                "Synchronous is always faster"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of error handling in full stack apps?",
            options: [
                "To gracefully handle and recover from errors",
                "To ignore errors",
                "To compress errors",
                "To encrypt errors"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of logging?",
            options: [
                "To track application events and debug issues",
                "To compress data",
                "To encrypt data",
                "To delete data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between monolithic and microservices architecture?",
            options: [
                "Monolithic is single application, microservices is multiple independent services",
                "They are the same",
                "Microservices is single application",
                "Monolithic is always better"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API documentation tools like Swagger?",
            options: [
                "To document and test APIs interactively",
                "To document code",
                "To document databases",
                "To document files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of code reviews?",
            options: [
                "To improve code quality through peer feedback",
                "To review code only",
                "To delete code",
                "To copy code"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of testing in full stack development?",
            options: [
                "To ensure code works correctly and prevent bugs",
                "To test databases only",
                "To test files only",
                "To test servers only"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of environment configuration?",
            options: [
                "To manage different settings for development, staging, and production",
                "To configure environments only",
                "To delete environments",
                "To copy environments"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of database migrations?",
            options: [
                "To manage database schema changes over time",
                "To migrate data only",
                "To migrate servers",
                "To migrate code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of API versioning?",
            options: [
                "To manage API changes without breaking existing clients",
                "To version code",
                "To version databases",
                "To version files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of error handling?",
            options: [
                "To gracefully handle and communicate errors",
                "To ignore errors",
                "To hide errors",
                "To create errors"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of logging?",
            options: [
                "To track application events and debug issues",
                "To log users in",
                "To log data out",
                "To log files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of caching strategies?",
            options: [
                "To improve performance by storing frequently accessed data",
                "To cache files only",
                "To cache code only",
                "To cache databases only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security best practices?",
            options: [
                "To protect applications from vulnerabilities and attacks",
                "To secure code only",
                "To secure databases only",
                "To secure files only"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of performance optimization?",
            options: [
                "To improve application speed and efficiency",
                "To optimize code only",
                "To optimize databases only",
                "To optimize files only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of responsive design?",
            options: [
                "To create applications that work on different screen sizes",
                "To respond to users",
                "To respond to databases",
                "To respond to files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of accessibility in web development?",
            options: [
                "To make applications usable by people with disabilities",
                "To access code",
                "To access databases",
                "To access files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of SEO optimization?",
            options: [
                "To improve search engine visibility",
                "To optimize code",
                "To optimize databases",
                "To optimize files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of web security measures?",
            options: [
                "To protect against common web vulnerabilities",
                "To secure code only",
                "To secure databases only",
                "To secure files only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of database optimization?",
            options: [
                "To improve database query performance",
                "To optimize code",
                "To optimize files",
                "To optimize servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of code refactoring?",
            options: [
                "To improve code structure without changing functionality",
                "To refactor databases",
                "To refactor files",
                "To refactor servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of dependency management?",
            options: [
                "To manage external libraries and packages",
                "To manage code",
                "To manage databases",
                "To manage files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of build tools?",
            options: [
                "To automate the process of compiling and bundling code",
                "To build databases",
                "To build files",
                "To build servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of deployment strategies?",
            options: [
                "To safely release applications to production",
                "To deploy code only",
                "To deploy databases only",
                "To deploy files only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of monitoring and analytics?",
            options: [
                "To track application performance and user behavior",
                "To monitor code",
                "To monitor databases",
                "To monitor files"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of backup and recovery strategies?",
            options: [
                "To protect data and enable recovery from failures",
                "To backup code only",
                "To backup files only",
                "To backup servers only"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of scalability planning?",
            options: [
                "To design systems that can handle growth",
                "To plan code",
                "To plan databases",
                "To plan files"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of code organization?",
            options: [
                "To structure code for maintainability and readability",
                "To organize databases",
                "To organize files",
                "To organize servers"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of documentation?",
            options: [
                "To help developers understand and maintain code",
                "To document databases",
                "To document files",
                "To document servers"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of continuous integration?",
            options: [
                "To automatically test and integrate code changes",
                "To integrate databases",
                "To integrate files",
                "To integrate servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of continuous deployment?",
            options: [
                "To automatically deploy code to production",
                "To deploy databases",
                "To deploy files",
                "To deploy servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of feature flags?",
            options: [
                "To enable or disable features without code deployment",
                "To flag features",
                "To delete features",
                "To copy features"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of A/B testing in development?",
            options: [
                "To compare different versions of features",
                "To test code only",
                "To test databases only",
                "To test files only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "DevOps Engineer": [
        {
            question: "What is CI/CD?",
            options: [
                "Continuous Integration and Continuous Deployment",
                "Code Integration and Code Deployment",
                "Computer Interface and Computer Design",
                "Centralized Integration and Centralized Deployment"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Docker?",
            options: [
                "A containerization platform",
                "A database system",
                "A programming language",
                "A cloud service provider"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Kubernetes used for?",
            options: [
                "Container orchestration and management",
                "Database management",
                "Code compilation",
                "Network routing"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Infrastructure as Code (IaC)?",
            options: [
                "Managing infrastructure using code and configuration files",
                "Writing code for infrastructure hardware",
                "A database for infrastructure",
                "A programming language for servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of a pipeline in DevOps?",
            options: [
                "To automate the software delivery process",
                "To transport data",
                "To compress files",
                "To encrypt communications"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "Which tool is commonly used for IaC?",
            options: [
                "Terraform",
                "Docker",
                "Jenkins",
                "Git"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a container?",
            options: [
                "A lightweight, portable package of software",
                "A virtual machine",
                "A physical server",
                "A database instance"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between Docker and Kubernetes?",
            options: [
                "Docker creates containers, Kubernetes orchestrates them",
                "They are the same",
                "Kubernetes creates containers",
                "Docker orchestrates containers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is monitoring in DevOps?",
            options: [
                "Tracking system performance and health",
                "Watching code changes",
                "Managing user access",
                "Compiling applications"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Git used for in DevOps?",
            options: [
                "Version control and code management",
                "Container management",
                "Server configuration",
                "Database queries"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Jenkins?",
            options: [
                "An automation server for CI/CD",
                "A database system",
                "A cloud platform",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of load balancing?",
            options: [
                "To distribute traffic across multiple servers",
                "To increase server speed",
                "To compress data",
                "To encrypt connections"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is blue-green deployment?",
            options: [
                "A deployment strategy with two identical production environments",
                "A color scheme for applications",
                "A database backup method",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is AWS?",
            options: [
                "Amazon Web Services - a cloud platform",
                "A web server",
                "A programming language",
                "A database system"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of a Dockerfile?",
            options: [
                "To define how to build a Docker image",
                "To store Docker containers",
                "To manage Docker networks",
                "To configure Docker volumes"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is horizontal scaling?",
            options: [
                "Adding more servers to handle increased load",
                "Upgrading existing server hardware",
                "Increasing storage capacity",
                "Improving network speed"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a microservice?",
            options: [
                "A small, independent service in a larger application",
                "A database table",
                "A server component",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of configuration management tools like Ansible?",
            options: [
                "To automate server configuration and deployment",
                "To manage user accounts",
                "To compile code",
                "To encrypt data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a deployment strategy?",
            options: [
                "A plan for releasing software updates",
                "A method for writing code",
                "A database design pattern",
                "A network topology"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between staging and production environments?",
            options: [
                "Staging is for testing, production is for live users",
                "They are identical",
                "Production is for testing",
                "Staging is always faster"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of infrastructure monitoring?",
            options: [
                "To track system health and performance metrics",
                "To monitor code",
                "To monitor files",
                "To monitor users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of log aggregation?",
            options: [
                "To collect and centralize logs from multiple sources",
                "To aggregate data",
                "To aggregate files",
                "To aggregate code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of configuration management?",
            options: [
                "To manage and automate system configurations",
                "To manage code",
                "To manage files",
                "To manage users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of secret management?",
            options: [
                "To securely store and manage sensitive information",
                "To manage secrets",
                "To delete secrets",
                "To copy secrets"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of infrastructure as code (IaC)?",
            options: [
                "To manage infrastructure using code and version control",
                "To code infrastructure",
                "To delete infrastructure",
                "To copy infrastructure"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration?",
            options: [
                "To manage and coordinate containerized applications",
                "To orchestrate containers",
                "To delete containers",
                "To copy containers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of service mesh?",
            options: [
                "To manage communication between microservices",
                "To mesh services",
                "To delete services",
                "To copy services"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of chaos engineering?",
            options: [
                "To test system resilience by introducing failures",
                "To create chaos",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of canary deployments?",
            options: [
                "To gradually roll out changes to a small subset of users",
                "To deploy canaries",
                "To delete deployments",
                "To copy deployments"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of infrastructure automation?",
            options: [
                "To automate infrastructure provisioning and management",
                "To automate code",
                "To automate files",
                "To automate users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of performance testing?",
            options: [
                "To evaluate system performance under load",
                "To test code",
                "To test files",
                "To test users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security scanning?",
            options: [
                "To identify security vulnerabilities in code and infrastructure",
                "To scan code only",
                "To scan files only",
                "To scan users only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of dependency scanning?",
            options: [
                "To identify vulnerable dependencies in applications",
                "To scan code",
                "To scan files",
                "To scan users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of infrastructure provisioning?",
            options: [
                "To automatically create and configure infrastructure",
                "To provision code",
                "To provision files",
                "To provision users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of infrastructure deprovisioning?",
            options: [
                "To automatically remove unused infrastructure",
                "To deprovision code",
                "To deprovision files",
                "To deprovision users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cost optimization in cloud?",
            options: [
                "To reduce cloud spending while maintaining performance",
                "To optimize code",
                "To optimize files",
                "To optimize users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of resource tagging?",
            options: [
                "To organize and track cloud resources",
                "To tag code",
                "To tag files",
                "To tag users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of backup automation?",
            options: [
                "To automatically create backups of data and systems",
                "To automate code",
                "To automate files",
                "To automate users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of disaster recovery planning?",
            options: [
                "To prepare for and recover from system failures",
                "To plan disasters",
                "To create disasters",
                "To ignore disasters"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of capacity planning?",
            options: [
                "To predict and plan for future resource needs",
                "To plan capacity",
                "To delete capacity",
                "To copy capacity"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of network security?",
            options: [
                "To protect network infrastructure from threats",
                "To secure code",
                "To secure files",
                "To secure users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of access control in infrastructure?",
            options: [
                "To manage who can access infrastructure resources",
                "To control code",
                "To control files",
                "To control users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of compliance monitoring?",
            options: [
                "To ensure infrastructure meets regulatory requirements",
                "To monitor code",
                "To monitor files",
                "To monitor users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of infrastructure auditing?",
            options: [
                "To track changes and access to infrastructure",
                "To audit code",
                "To audit files",
                "To audit users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of container registry?",
            options: [
                "To store and distribute container images",
                "To register containers",
                "To delete containers",
                "To copy containers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of service discovery?",
            options: [
                "To automatically detect and locate services in a network",
                "To discover code",
                "To discover files",
                "To discover users"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of health checks?",
            options: [
                "To monitor the health and availability of services",
                "To check code",
                "To check files",
                "To check users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of auto-scaling policies?",
            options: [
                "To automatically adjust resources based on demand",
                "To scale code",
                "To scale files",
                "To scale users"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of infrastructure versioning?",
            options: [
                "To track changes to infrastructure configurations",
                "To version code",
                "To version files",
                "To version users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Mobile App Developer": [
        {
            question: "What is React Native?",
            options: [
                "A framework for building mobile apps with JavaScript",
                "A database system",
                "A cloud platform",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the primary language for iOS development?",
            options: [
                "Swift",
                "Java",
                "Python",
                "JavaScript"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the primary language for Android development?",
            options: [
                "Kotlin or Java",
                "Swift",
                "Python",
                "C++"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Flutter?",
            options: [
                "A cross-platform mobile development framework",
                "A database system",
                "A cloud service",
                "A version control system"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is an APK?",
            options: [
                "Android application package file",
                "Apple package file",
                "Application programming kit",
                "Automated process kit"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of a mobile app store?",
            options: [
                "To distribute and sell mobile applications",
                "To store app data",
                "To compile apps",
                "To test apps"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is responsive design in mobile development?",
            options: [
                "Designing apps that work on different screen sizes",
                "Making apps faster",
                "Adding animations",
                "Improving security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a native app?",
            options: [
                "An app built specifically for one platform",
                "An app that works everywhere",
                "A web app",
                "A desktop app"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between native and hybrid apps?",
            options: [
                "Native uses platform-specific code, hybrid uses web technologies",
                "They are the same",
                "Hybrid is always better",
                "Native is always slower"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is Xcode?",
            options: [
                "Apple's IDE for iOS development",
                "A database system",
                "A cloud platform",
                "A version control tool"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Android Studio?",
            options: [
                "Google's IDE for Android development",
                "A mobile app",
                "A cloud service",
                "A database"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is state management in mobile apps?",
            options: [
                "Managing the data and UI state of an application",
                "Managing server states",
                "Managing user accounts",
                "Managing app permissions"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is an API in mobile development?",
            options: [
                "Application Programming Interface for data exchange",
                "A mobile app",
                "A database",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is push notification?",
            options: [
                "Messages sent from server to mobile device",
                "Local app alerts",
                "Email notifications",
                "SMS messages"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is offline-first architecture?",
            options: [
                "Designing apps to work without internet connection",
                "Making apps faster online",
                "Reducing app size",
                "Improving security"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is app performance optimization?",
            options: [
                "Improving app speed and efficiency",
                "Adding more features",
                "Changing app design",
                "Increasing app size"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of mobile app testing?",
            options: [
                "To ensure app works correctly on different devices",
                "To make apps prettier",
                "To increase app downloads",
                "To reduce app size"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a mobile SDK?",
            options: [
                "Software Development Kit for mobile platforms",
                "A mobile app",
                "A database system",
                "A cloud service"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between iOS and Android?",
            options: [
                "Different operating systems with different development approaches",
                "They are the same",
                "iOS is always better",
                "Android is always faster"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is app versioning?",
            options: [
                "Managing different versions of an app",
                "Storing app data",
                "Compiling apps",
                "Testing apps"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of app analytics?",
            options: [
                "To track user behavior and app performance",
                "To analyze code",
                "To analyze files",
                "To analyze databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of crash reporting?",
            options: [
                "To track and fix app crashes",
                "To report crashes only",
                "To delete crashes",
                "To copy crashes"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app store optimization (ASO)?",
            options: [
                "To improve app visibility in app stores",
                "To optimize code",
                "To optimize files",
                "To optimize databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of in-app purchases?",
            options: [
                "To allow users to buy content within the app",
                "To purchase apps",
                "To purchase code",
                "To purchase files"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app permissions?",
            options: [
                "To control what resources the app can access",
                "To permit apps",
                "To delete apps",
                "To copy apps"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of deep linking?",
            options: [
                "To link directly to specific content within an app",
                "To link apps",
                "To delete links",
                "To copy links"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of app indexing?",
            options: [
                "To make app content searchable",
                "To index apps",
                "To delete apps",
                "To copy apps"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of beta testing?",
            options: [
                "To test apps with a limited group of users before release",
                "To test code",
                "To test files",
                "To test databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app monetization?",
            options: [
                "To generate revenue from an app",
                "To monetize code",
                "To monetize files",
                "To monetize databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app localization?",
            options: [
                "To adapt an app for different languages and regions",
                "To localize code",
                "To localize files",
                "To localize databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of app security?",
            options: [
                "To protect app data and user information",
                "To secure code",
                "To secure files",
                "To secure databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app performance monitoring?",
            options: [
                "To track app speed and responsiveness",
                "To monitor code",
                "To monitor files",
                "To monitor databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user onboarding?",
            options: [
                "To guide new users through app features",
                "To onboard code",
                "To onboard files",
                "To onboard databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app updates?",
            options: [
                "To add features and fix bugs",
                "To update code",
                "To update files",
                "To update databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app architecture patterns?",
            options: [
                "To structure app code for maintainability",
                "To architect apps",
                "To delete apps",
                "To copy apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of dependency injection?",
            options: [
                "To provide dependencies to components",
                "To inject code",
                "To inject files",
                "To inject databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of app lifecycle management?",
            options: [
                "To handle app states and transitions",
                "To manage code",
                "To manage files",
                "To manage databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of memory management in mobile apps?",
            options: [
                "To efficiently use device memory",
                "To manage code",
                "To manage files",
                "To manage databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of battery optimization?",
            options: [
                "To reduce app battery consumption",
                "To optimize code",
                "To optimize files",
                "To optimize databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of network optimization?",
            options: [
                "To minimize data usage and improve performance",
                "To optimize code",
                "To optimize files",
                "To optimize databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of app store guidelines compliance?",
            options: [
                "To ensure apps meet store requirements",
                "To comply with code",
                "To comply with files",
                "To comply with databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of app signing?",
            options: [
                "To verify app authenticity and integrity",
                "To sign code",
                "To sign files",
                "To sign databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of code obfuscation?",
            options: [
                "To protect app code from reverse engineering",
                "To obfuscate files",
                "To obfuscate databases",
                "To obfuscate users"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of app bundle optimization?",
            options: [
                "To reduce app download size",
                "To optimize code",
                "To optimize files",
                "To optimize databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of progressive web apps (PWA)?",
            options: [
                "To create web apps that work like native apps",
                "To progress apps",
                "To delete apps",
                "To copy apps"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of app store reviews?",
            options: [
                "To gather user feedback and improve apps",
                "To review code",
                "To review files",
                "To review databases"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of A/B testing in mobile apps?",
            options: [
                "To test different app features with users",
                "To test code",
                "To test files",
                "To test databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of app retention strategies?",
            options: [
                "To keep users engaged and using the app",
                "To retain code",
                "To retain files",
                "To retain databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cross-platform development?",
            options: [
                "To build apps that work on multiple platforms",
                "To cross platforms",
                "To delete platforms",
                "To copy platforms"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "UX/UI Designer": [
        {
            question: "What is UX design?",
            options: [
                "User Experience design - focusing on user satisfaction",
                "User Extension design",
                "Universal Experience design",
                "User Execution design"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is UI design?",
            options: [
                "User Interface design - visual design of interfaces",
                "User Integration design",
                "Universal Interface design",
                "User Interaction design"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Figma?",
            options: [
                "A design and prototyping tool",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is wireframing?",
            options: [
                "Creating a basic layout structure of a design",
                "Drawing wire connections",
                "Creating animations",
                "Writing code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is prototyping?",
            options: [
                "Creating an interactive model of a design",
                "Writing production code",
                "Creating final designs",
                "Testing code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is user research?",
            options: [
                "Understanding user needs and behaviors",
                "Testing code",
                "Designing databases",
                "Writing documentation"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is color theory?",
            options: [
                "The study of how colors interact and affect perception",
                "A database system",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is typography?",
            options: [
                "The art and technique of arranging type",
                "A database system",
                "A CSS property",
                "A JavaScript function"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is information architecture?",
            options: [
                "Organizing and structuring content effectively",
                "Building physical structures",
                "Creating databases",
                "Writing code"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is usability testing?",
            options: [
                "Testing designs with real users",
                "Testing code functionality",
                "Testing server performance",
                "Testing database queries"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a design system?",
            options: [
                "A collection of reusable design components and guidelines",
                "A database system",
                "A programming framework",
                "A cloud service"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is accessibility in design?",
            options: [
                "Designing for users with disabilities",
                "Making designs faster",
                "Reducing design size",
                "Improving colors"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is responsive design?",
            options: [
                "Designing for different screen sizes",
                "Making designs faster",
                "Adding animations",
                "Improving colors"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Adobe XD?",
            options: [
                "A design and prototyping tool",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a user persona?",
            options: [
                "A fictional representation of a target user",
                "A real user account",
                "A design template",
                "A code function"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user journey mapping?",
            options: [
                "To visualize the user's experience through a product",
                "To track user locations",
                "To store user data",
                "To encrypt user information"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is visual hierarchy?",
            options: [
                "Organizing elements to guide user attention",
                "Creating visual effects",
                "Adding colors",
                "Making designs larger"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between UX and UI?",
            options: [
                "UX focuses on experience, UI focuses on visual design",
                "They are the same",
                "UI is always better",
                "UX is only about colors"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is A/B testing?",
            options: [
                "Comparing two versions of a design",
                "Testing code twice",
                "Backing up designs",
                "Archiving files"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is design thinking?",
            options: [
                "A problem-solving approach focused on user needs",
                "A programming methodology",
                "A database design pattern",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user flows?",
            options: [
                "To map out user paths through an interface",
                "To flow users",
                "To delete users",
                "To copy users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of sitemaps in UX?",
            options: [
                "To organize and structure website content",
                "To map sites",
                "To delete sites",
                "To copy sites"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of card sorting?",
            options: [
                "To understand how users organize information",
                "To sort cards",
                "To delete cards",
                "To copy cards"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of heatmaps?",
            options: [
                "To visualize where users click and interact",
                "To heat maps",
                "To delete maps",
                "To copy maps"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of click tracking?",
            options: [
                "To analyze user interaction patterns",
                "To track clicks only",
                "To delete clicks",
                "To copy clicks"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of conversion rate optimization?",
            options: [
                "To improve the percentage of users who complete desired actions",
                "To optimize conversions only",
                "To delete conversions",
                "To copy conversions"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user feedback collection?",
            options: [
                "To gather insights from users about their experience",
                "To collect feedback only",
                "To delete feedback",
                "To copy feedback"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of competitive analysis in UX?",
            options: [
                "To understand competitor designs and identify opportunities",
                "To analyze competitors only",
                "To delete competitors",
                "To copy competitors"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of design handoff?",
            options: [
                "To transfer designs from designers to developers",
                "To hand off designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design tokens?",
            options: [
                "To store design values for consistent implementation",
                "To tokenize designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of micro-interactions?",
            options: [
                "To provide feedback and enhance user experience",
                "To interact with users",
                "To delete interactions",
                "To copy interactions"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of loading states?",
            options: [
                "To inform users that content is being loaded",
                "To load states",
                "To delete states",
                "To copy states"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of error states?",
            options: [
                "To communicate errors clearly to users",
                "To error states",
                "To delete states",
                "To copy states"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of empty states?",
            options: [
                "To guide users when no content is available",
                "To empty states",
                "To delete states",
                "To copy states"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of onboarding flows?",
            options: [
                "To introduce new users to product features",
                "To onboard flows",
                "To delete flows",
                "To copy flows"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user testing?",
            options: [
                "To validate designs with real users",
                "To test users",
                "To delete users",
                "To copy users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of heuristic evaluation?",
            options: [
                "To evaluate interfaces against usability principles",
                "To evaluate heuristics",
                "To delete heuristics",
                "To copy heuristics"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of task analysis?",
            options: [
                "To understand how users complete tasks",
                "To analyze tasks",
                "To delete tasks",
                "To copy tasks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of content strategy?",
            options: [
                "To plan and manage content for user needs",
                "To strategy content",
                "To delete content",
                "To copy content"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of interaction design?",
            options: [
                "To design how users interact with products",
                "To design interactions",
                "To delete interactions",
                "To copy interactions"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of motion design?",
            options: [
                "To use animation to enhance user experience",
                "To motion designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of responsive typography?",
            options: [
                "To adapt text size for different screen sizes",
                "To typography text",
                "To delete text",
                "To copy text"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of design consistency?",
            options: [
                "To maintain uniform design elements across products",
                "To consistent designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design patterns?",
            options: [
                "To use proven solutions for common design problems",
                "To pattern designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of usability metrics?",
            options: [
                "To measure how easy products are to use",
                "To metric usability",
                "To delete usability",
                "To copy usability"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user segmentation?",
            options: [
                "To group users by characteristics and behaviors",
                "To segment users",
                "To delete users",
                "To copy users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of design iteration?",
            options: [
                "To refine designs through multiple versions",
                "To iterate designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design collaboration?",
            options: [
                "To work with team members on design projects",
                "To collaborate designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of design accessibility standards?",
            options: [
                "To ensure designs are usable by people with disabilities",
                "To standardize designs",
                "To delete designs",
                "To copy designs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Cloud Solutions Architect": [
        {
            question: "What is cloud computing?",
            options: [
                "Delivery of computing services over the internet",
                "Physical servers in a data center",
                "Local computer storage",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is AWS?",
            options: [
                "Amazon Web Services - cloud platform",
                "A web server",
                "A database system",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Azure?",
            options: [
                "Microsoft's cloud computing platform",
                "A color scheme",
                "A database system",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Google Cloud Platform (GCP)?",
            options: [
                "Google's cloud computing services",
                "A search engine",
                "A database",
                "A browser"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Infrastructure as Code (IaC)?",
            options: [
                "Managing infrastructure using code",
                "Writing code for hardware",
                "A database system",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Terraform?",
            options: [
                "An IaC tool for building cloud infrastructure",
                "A cloud platform",
                "A database system",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is scalability in cloud architecture?",
            options: [
                "Ability to handle increased load",
                "Making systems faster",
                "Reducing costs",
                "Improving security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is high availability?",
            options: [
                "Ensuring systems are operational most of the time",
                "Making systems faster",
                "Reducing costs",
                "Improving design"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a cloud region?",
            options: [
                "A geographic area with data centers",
                "A database table",
                "A network protocol",
                "A server type"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is disaster recovery?",
            options: [
                "Process of restoring systems after failures",
                "Preventing disasters",
                "Backing up data only",
                "Testing systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is auto-scaling?",
            options: [
                "Automatically adjusting resources based on demand",
                "Manual scaling",
                "Fixed scaling",
                "Random scaling"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a VPC?",
            options: [
                "Virtual Private Cloud - isolated cloud network",
                "Virtual Public Cloud",
                "Visual Private Cloud",
                "Virtual Personal Computer"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is cloud security?",
            options: [
                "Protecting cloud-based systems and data",
                "Making clouds visible",
                "Creating cloud formations",
                "Managing weather"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between IaaS, PaaS, and SaaS?",
            options: [
                "Different levels of cloud service models",
                "They are the same",
                "Different cloud providers",
                "Different programming languages"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is load balancing in cloud?",
            options: [
                "Distributing traffic across multiple servers",
                "Balancing costs",
                "Managing users",
                "Storing data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is cloud migration?",
            options: [
                "Moving systems to cloud infrastructure",
                "Moving clouds",
                "Creating clouds",
                "Deleting clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is cost optimization in cloud?",
            options: [
                "Reducing cloud spending while maintaining performance",
                "Increasing costs",
                "Ignoring costs",
                "Fixed pricing"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a cloud architect?",
            options: [
                "Designs and manages cloud infrastructure",
                "Builds physical servers",
                "Writes application code",
                "Manages databases only"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is multi-cloud strategy?",
            options: [
                "Using multiple cloud providers",
                "Using one cloud",
                "Not using clouds",
                "Using local servers only"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is serverless computing?",
            options: [
                "Running code without managing servers",
                "No servers at all",
                "Physical servers only",
                "Virtual machines only"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud cost management?",
            options: [
                "To optimize and control cloud spending",
                "To manage costs only",
                "To delete costs",
                "To copy costs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud resource tagging?",
            options: [
                "To organize and track cloud resources",
                "To tag resources",
                "To delete resources",
                "To copy resources"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of cloud compliance?",
            options: [
                "To ensure cloud infrastructure meets regulatory requirements",
                "To comply with code",
                "To comply with files",
                "To comply with users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud governance?",
            options: [
                "To establish policies and controls for cloud usage",
                "To govern clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud migration strategies?",
            options: [
                "To plan and execute moving systems to cloud",
                "To migrate clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud-native architecture?",
            options: [
                "To design applications specifically for cloud environments",
                "To native clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud networking?",
            options: [
                "To connect and manage cloud resources",
                "To network clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud storage solutions?",
            options: [
                "To store data in cloud environments",
                "To store clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of cloud database services?",
            options: [
                "To provide managed database solutions in the cloud",
                "To database clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud backup solutions?",
            options: [
                "To automatically backup data in the cloud",
                "To backup clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of cloud disaster recovery?",
            options: [
                "To recover systems from failures using cloud resources",
                "To recover clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud monitoring tools?",
            options: [
                "To track cloud resource performance and health",
                "To monitor clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud automation?",
            options: [
                "To automate cloud resource management",
                "To automate clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud API management?",
            options: [
                "To manage and secure APIs in cloud environments",
                "To manage APIs only",
                "To delete APIs",
                "To copy APIs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud identity management?",
            options: [
                "To manage user access to cloud resources",
                "To manage identity only",
                "To delete identity",
                "To copy identity"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud data encryption?",
            options: [
                "To protect data stored in the cloud",
                "To encrypt clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud compliance frameworks?",
            options: [
                "To ensure cloud infrastructure meets standards",
                "To framework clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud cost allocation?",
            options: [
                "To track cloud costs by department or project",
                "To allocate costs only",
                "To delete costs",
                "To copy costs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud performance optimization?",
            options: [
                "To improve cloud application performance",
                "To optimize clouds only",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud architecture patterns?",
            options: [
                "To use proven solutions for cloud design problems",
                "To pattern clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud service mesh?",
            options: [
                "To manage communication between cloud services",
                "To mesh clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud event-driven architecture?",
            options: [
                "To build systems that respond to events",
                "To event clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud container services?",
            options: [
                "To run containerized applications in the cloud",
                "To container clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud function services?",
            options: [
                "To run serverless functions in the cloud",
                "To function clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud CDN services?",
            options: [
                "To deliver content quickly to users globally",
                "To CDN clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud analytics services?",
            options: [
                "To analyze data and generate insights in the cloud",
                "To analytics clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cloud machine learning services?",
            options: [
                "To build and deploy ML models in the cloud",
                "To ML clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud IoT services?",
            options: [
                "To connect and manage IoT devices in the cloud",
                "To IoT clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud edge computing?",
            options: [
                "To process data closer to where it's generated",
                "To edge clouds",
                "To delete clouds",
                "To copy clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Cybersecurity Specialist": [
        {
            question: "What is cybersecurity?",
            options: [
                "Protecting systems and data from cyber threats",
                "Creating cyber systems",
                "Managing cyber networks",
                "Designing cyber interfaces"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is encryption?",
            options: [
                "Converting data into unreadable format",
                "Compressing data",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a firewall?",
            options: [
                "Network security system controlling traffic",
                "A physical wall",
                "A database system",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a vulnerability?",
            options: [
                "A weakness that can be exploited",
                "A security feature",
                "A database",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is penetration testing?",
            options: [
                "Authorized simulated cyber attacks",
                "Breaking into systems illegally",
                "Creating security systems",
                "Managing networks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a DDoS attack?",
            options: [
                "Distributed Denial of Service attack",
                "Data Download and Storage",
                "Database Design and Structure",
                "Digital Data and Security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is two-factor authentication (2FA)?",
            options: [
                "Security method requiring two verification steps",
                "Two passwords",
                "Two usernames",
                "Two accounts"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a security breach?",
            options: [
                "Unauthorized access to systems or data",
                "A security feature",
                "A backup system",
                "A network connection"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is malware?",
            options: [
                "Malicious software designed to harm systems",
                "Good software",
                "System software",
                "Application software"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a VPN?",
            options: [
                "Virtual Private Network for secure connections",
                "Virtual Public Network",
                "Visual Private Network",
                "Virtual Personal Network"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is intrusion detection?",
            options: [
                "Monitoring for unauthorized access attempts",
                "Preventing all access",
                "Allowing all access",
                "Blocking networks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a security patch?",
            options: [
                "Update to fix security vulnerabilities",
                "A security feature",
                "A backup",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is phishing?",
            options: [
                "Fraudulent attempt to obtain sensitive information",
                "A security protocol",
                "A database system",
                "A network type"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is access control?",
            options: [
                "Restricting access to resources",
                "Allowing all access",
                "Creating access",
                "Deleting access"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a security audit?",
            options: [
                "Systematic evaluation of security measures",
                "A security feature",
                "A backup process",
                "A network test"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the principle of least privilege?",
            options: [
                "Granting minimum necessary access",
                "Granting all access",
                "No access at all",
                "Random access"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a zero-day vulnerability?",
            options: [
                "Unknown vulnerability with no patch available",
                "A fixed vulnerability",
                "A security feature",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is security compliance?",
            options: [
                "Meeting security standards and regulations",
                "Ignoring security",
                "Creating security",
                "Deleting security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a security policy?",
            options: [
                "Guidelines for protecting information",
                "A security tool",
                "A database",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between authentication and authorization?",
            options: [
                "Authentication verifies identity, authorization grants permissions",
                "They are the same",
                "Authorization verifies identity",
                "Authentication grants permissions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security audits?",
            options: [
                "To evaluate security measures and identify vulnerabilities",
                "To audit security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of vulnerability scanning?",
            options: [
                "To identify security weaknesses in systems",
                "To scan vulnerabilities only",
                "To delete vulnerabilities",
                "To copy vulnerabilities"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security incident response?",
            options: [
                "To handle and recover from security breaches",
                "To respond to incidents only",
                "To delete incidents",
                "To copy incidents"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security awareness training?",
            options: [
                "To educate users about security threats",
                "To train security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security policies?",
            options: [
                "To establish rules for protecting information",
                "To policy security",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security monitoring?",
            options: [
                "To continuously watch for security threats",
                "To monitor security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security risk assessment?",
            options: [
                "To identify and evaluate security risks",
                "To assess risks only",
                "To delete risks",
                "To copy risks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security compliance?",
            options: [
                "To meet security standards and regulations",
                "To comply with security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security documentation?",
            options: [
                "To record security procedures and incidents",
                "To document security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security testing?",
            options: [
                "To identify security vulnerabilities through testing",
                "To test security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security architecture?",
            options: [
                "To design secure systems and networks",
                "To architect security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security controls?",
            options: [
                "To implement measures to protect systems",
                "To control security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security frameworks?",
            options: [
                "To provide structured approaches to security",
                "To framework security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security metrics?",
            options: [
                "To measure security program effectiveness",
                "To metric security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security automation?",
            options: [
                "To automate security tasks and responses",
                "To automate security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of threat intelligence?",
            options: [
                "To gather information about security threats",
                "To intelligence threats only",
                "To delete threats",
                "To copy threats"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security awareness programs?",
            options: [
                "To educate employees about security",
                "To program security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security certifications?",
            options: [
                "To validate security knowledge and skills",
                "To certify security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security governance?",
            options: [
                "To oversee and manage security programs",
                "To govern security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security architecture reviews?",
            options: [
                "To evaluate system security design",
                "To review security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security baselines?",
            options: [
                "To establish minimum security standards",
                "To baseline security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security hardening?",
            options: [
                "To strengthen system security configurations",
                "To harden security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security logging?",
            options: [
                "To record security events for analysis",
                "To log security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security forensics?",
            options: [
                "To investigate security incidents",
                "To forensic security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security training programs?",
            options: [
                "To develop security skills in teams",
                "To train security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of security standards?",
            options: [
                "To establish security requirements and guidelines",
                "To standardize security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security risk management?",
            options: [
                "To identify, assess, and mitigate security risks",
                "To manage risks only",
                "To delete risks",
                "To copy risks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security compliance audits?",
            options: [
                "To verify adherence to security standards",
                "To audit compliance only",
                "To delete compliance",
                "To copy compliance"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security awareness campaigns?",
            options: [
                "To promote security awareness among users",
                "To campaign security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        }
    ],
    "Quality Assurance (QA) Engineer": [
        {
            question: "What is QA testing?",
            options: [
                "Quality Assurance - ensuring software meets standards",
                "Quick Access testing",
                "Query Analysis testing",
                "Quality Analysis only"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is manual testing?",
            options: [
                "Testing performed by humans",
                "Testing by machines only",
                "No testing",
                "Automatic testing"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is automated testing?",
            options: [
                "Testing performed by scripts and tools",
                "Testing by humans only",
                "No testing",
                "Manual testing"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Selenium?",
            options: [
                "A tool for automated web testing",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a bug?",
            options: [
                "An error or defect in software",
                "A feature",
                "A database",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is regression testing?",
            options: [
                "Testing to ensure new changes don't break existing features",
                "Testing new features only",
                "Testing databases",
                "Testing networks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is unit testing?",
            options: [
                "Testing individual components in isolation",
                "Testing entire systems",
                "Testing databases",
                "Testing networks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is integration testing?",
            options: [
                "Testing how components work together",
                "Testing individual components",
                "Testing databases only",
                "Testing networks only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a test case?",
            options: [
                "A set of conditions to verify functionality",
                "A bug report",
                "A feature request",
                "A code file"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is JUnit?",
            options: [
                "A testing framework for Java",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a test plan?",
            options: [
                "Document outlining testing strategy",
                "A bug list",
                "A feature list",
                "A code repository"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is performance testing?",
            options: [
                "Testing system speed and efficiency",
                "Testing functionality only",
                "Testing security only",
                "Testing design only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is user acceptance testing (UAT)?",
            options: [
                "Testing by end users before release",
                "Testing by developers only",
                "Testing by QA only",
                "No testing"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a bug tracking system?",
            options: [
                "Tool for managing and tracking bugs",
                "A database",
                "A network",
                "A server"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is smoke testing?",
            options: [
                "Quick test to verify basic functionality",
                "Testing with smoke",
                "Testing fire systems",
                "Testing air quality"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between verification and validation?",
            options: [
                "Verification checks if built correctly, validation checks if meets requirements",
                "They are the same",
                "Validation checks code",
                "Verification checks requirements"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is test coverage?",
            options: [
                "Measure of how much code is tested",
                "Test documentation",
                "Test environment",
                "Test data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is black box testing?",
            options: [
                "Testing without knowing internal code structure",
                "Testing with code knowledge",
                "Testing databases",
                "Testing networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is white box testing?",
            options: [
                "Testing with knowledge of internal code structure",
                "Testing without code knowledge",
                "Testing databases only",
                "Testing networks only"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of QA in software development?",
            options: [
                "To ensure software quality and reliability",
                "To write code",
                "To design interfaces",
                "To manage servers"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of test automation frameworks?",
            options: [
                "To structure and organize automated tests",
                "To framework tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of test data management?",
            options: [
                "To create and manage test data efficiently",
                "To manage data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of defect tracking?",
            options: [
                "To track and manage bugs throughout their lifecycle",
                "To track defects only",
                "To delete defects",
                "To copy defects"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of test reporting?",
            options: [
                "To communicate test results to stakeholders",
                "To report tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of test environment management?",
            options: [
                "To maintain consistent testing environments",
                "To manage environments only",
                "To delete environments",
                "To copy environments"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of test case design?",
            options: [
                "To create effective test scenarios",
                "To design tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of boundary value testing?",
            options: [
                "To test values at the edges of input ranges",
                "To test boundaries only",
                "To delete boundaries",
                "To copy boundaries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of equivalence partitioning?",
            options: [
                "To group similar test cases together",
                "To partition tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test execution?",
            options: [
                "To run tests and collect results",
                "To execute tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of test maintenance?",
            options: [
                "To update tests as software changes",
                "To maintain tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of test metrics?",
            options: [
                "To measure testing effectiveness",
                "To metric tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of test strategy?",
            options: [
                "To plan overall testing approach",
                "To strategy tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of test estimation?",
            options: [
                "To predict testing effort and time",
                "To estimate tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of risk-based testing?",
            options: [
                "To prioritize tests based on risk",
                "To risk tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of exploratory testing?",
            options: [
                "To discover bugs through unscripted testing",
                "To explore tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of ad-hoc testing?",
            options: [
                "To perform informal testing without planning",
                "To ad-hoc tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of monkey testing?",
            options: [
                "To test with random inputs to find unexpected bugs",
                "To monkey tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of fuzz testing?",
            options: [
                "To test with invalid or random data inputs",
                "To fuzz tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of compatibility testing?",
            options: [
                "To test software across different environments",
                "To test compatibility only",
                "To delete compatibility",
                "To copy compatibility"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of localization testing?",
            options: [
                "To test software in different languages and regions",
                "To test localization only",
                "To delete localization",
                "To copy localization"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of accessibility testing?",
            options: [
                "To test software for users with disabilities",
                "To test accessibility only",
                "To delete accessibility",
                "To copy accessibility"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of security testing?",
            options: [
                "To identify security vulnerabilities",
                "To test security only",
                "To delete security",
                "To copy security"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of load testing?",
            options: [
                "To test system behavior under expected load",
                "To test load only",
                "To delete load",
                "To copy load"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of stress testing?",
            options: [
                "To test system behavior under extreme conditions",
                "To test stress only",
                "To delete stress",
                "To copy stress"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of volume testing?",
            options: [
                "To test system with large amounts of data",
                "To test volume only",
                "To delete volume",
                "To copy volume"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of spike testing?",
            options: [
                "To test system response to sudden load increases",
                "To test spikes only",
                "To delete spikes",
                "To copy spikes"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of endurance testing?",
            options: [
                "To test system stability over extended periods",
                "To test endurance only",
                "To delete endurance",
                "To copy endurance"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test documentation?",
            options: [
                "To record test plans, cases, and results",
                "To document tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of test traceability?",
            options: [
                "To link tests to requirements",
                "To trace tests only",
                "To delete tests",
                "To copy tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Artificial Intelligence (AI) Engineer": [
        {
            question: "What is machine learning?",
            options: [
                "AI that learns from data without explicit programming",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is TensorFlow?",
            options: [
                "A machine learning framework",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is PyTorch?",
            options: [
                "A machine learning framework",
                "A database system",
                "A programming language",
                "A cloud service"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a neural network?",
            options: [
                "Computing system inspired by biological neural networks",
                "A physical network",
                "A database",
                "A server"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is deep learning?",
            options: [
                "Machine learning using neural networks with multiple layers",
                "Learning deeply",
                "A database system",
                "A programming method"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is natural language processing (NLP)?",
            options: [
                "AI that understands and processes human language",
                "A database system",
                "A programming language",
                "A network protocol"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is data science?",
            options: [
                "Extracting insights from data",
                "Storing data only",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Scikit-learn?",
            options: [
                "A machine learning library for Python",
                "A database system",
                "A cloud platform",
                "A programming language"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is supervised learning?",
            options: [
                "Learning from labeled training data",
                "Learning without data",
                "Learning from unlabeled data",
                "Learning by watching"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is unsupervised learning?",
            options: [
                "Learning from unlabeled data",
                "Learning from labeled data",
                "Learning without data",
                "Learning by instruction"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a model in machine learning?",
            options: [
                "A mathematical representation learned from data",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is training data?",
            options: [
                "Data used to train machine learning models",
                "Data for testing only",
                "Data for production",
                "Data for backup"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is overfitting?",
            options: [
                "Model performs well on training data but poorly on new data",
                "Model performs poorly on training data",
                "Model performs well on all data",
                "Model doesn't train"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is computer vision?",
            options: [
                "AI that interprets visual information",
                "Computer screens",
                "Visual effects",
                "Graphics design"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is reinforcement learning?",
            options: [
                "Learning through rewards and penalties",
                "Learning from labels",
                "Learning without feedback",
                "Learning by copying"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is feature engineering?",
            options: [
                "Creating relevant input variables for models",
                "Building features",
                "Designing interfaces",
                "Writing code"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is an algorithm in AI?",
            options: [
                "A set of rules for solving problems",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is predictive analytics?",
            options: [
                "Using data to predict future outcomes",
                "Analyzing past data only",
                "Storing data",
                "Deleting data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the difference between AI and machine learning?",
            options: [
                "AI is broader, ML is a subset of AI",
                "They are the same",
                "ML is broader",
                "AI is only robotics"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is model evaluation?",
            options: [
                "Assessing how well a model performs",
                "Creating models",
                "Training models",
                "Deleting models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of neural networks?",
            options: [
                "To model complex patterns using interconnected nodes",
                "To network neurons",
                "To delete neurons",
                "To copy neurons"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of deep learning?",
            options: [
                "To use multi-layer neural networks for learning",
                "To learn deeply",
                "To delete learning",
                "To copy learning"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of natural language processing?",
            options: [
                "To enable computers to understand human language",
                "To process language only",
                "To delete language",
                "To copy language"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of computer vision?",
            options: [
                "To enable computers to interpret visual information",
                "To vision computers",
                "To delete vision",
                "To copy vision"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of reinforcement learning?",
            options: [
                "To learn through trial and error with rewards",
                "To reinforce learning only",
                "To delete learning",
                "To copy learning"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of transfer learning?",
            options: [
                "To apply knowledge from one task to another",
                "To transfer learning only",
                "To delete learning",
                "To copy learning"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model deployment?",
            options: [
                "To put trained models into production use",
                "To deploy models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of model monitoring?",
            options: [
                "To track model performance in production",
                "To monitor models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of A/B testing in ML?",
            options: [
                "To compare different model versions",
                "To test models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of feature engineering in ML?",
            options: [
                "To create informative features from raw data",
                "To engineer features only",
                "To delete features",
                "To copy features"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of hyperparameter tuning?",
            options: [
                "To optimize model parameters for better performance",
                "To tune parameters only",
                "To delete parameters",
                "To copy parameters"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model interpretability?",
            options: [
                "To understand how models make predictions",
                "To interpret models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data preprocessing in ML?",
            options: [
                "To prepare data for machine learning",
                "To preprocess data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of cross-validation?",
            options: [
                "To assess model performance on unseen data",
                "To validate models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of ensemble methods?",
            options: [
                "To combine multiple models for better predictions",
                "To ensemble models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model versioning?",
            options: [
                "To track different versions of models",
                "To version models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of MLOps?",
            options: [
                "To operationalize machine learning workflows",
                "To ops ML only",
                "To delete ML",
                "To copy ML"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data pipelines in ML?",
            options: [
                "To automate data flow for ML processes",
                "To pipeline data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of model serving?",
            options: [
                "To make models available for predictions",
                "To serve models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of feature stores?",
            options: [
                "To store and serve ML features",
                "To store features only",
                "To delete features",
                "To copy features"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model governance?",
            options: [
                "To manage ML models throughout their lifecycle",
                "To govern models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of bias detection in ML?",
            options: [
                "To identify unfair model predictions",
                "To detect bias only",
                "To delete bias",
                "To copy bias"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model retraining?",
            options: [
                "To update models with new data",
                "To retrain models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of active learning?",
            options: [
                "To select most informative data for labeling",
                "To learn actively only",
                "To delete learning",
                "To copy learning"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of federated learning?",
            options: [
                "To train models across distributed data sources",
                "To federate learning only",
                "To delete learning",
                "To copy learning"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model compression?",
            options: [
                "To reduce model size for deployment",
                "To compress models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of automated ML?",
            options: [
                "To automate machine learning workflows",
                "To automate ML only",
                "To delete ML",
                "To copy ML"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model explainability?",
            options: [
                "To provide explanations for model predictions",
                "To explain models only",
                "To delete models",
                "To copy models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of continuous learning?",
            options: [
                "To update models continuously with new data",
                "To learn continuously only",
                "To delete learning",
                "To copy learning"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Product Manager (Tech)": [
        {
            question: "What is a product manager?",
            options: [
                "Person who manages product development lifecycle",
                "A developer",
                "A designer",
                "A tester"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is agile methodology?",
            options: [
                "Iterative approach to software development",
                "A programming language",
                "A database system",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a product roadmap?",
            options: [
                "Strategic plan for product development",
                "A map of products",
                "A database",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a user story?",
            options: [
                "Description of a feature from user perspective",
                "A story about users",
                "A database record",
                "A code function"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a sprint?",
            options: [
                "Time-boxed period for completing work",
                "Running fast",
                "A database operation",
                "A network speed"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a product backlog?",
            options: [
                "List of features and tasks to be done",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is MVP?",
            options: [
                "Minimum Viable Product - basic version with core features",
                "Most Valuable Player",
                "Maximum Viable Product",
                "Minimum Variable Product"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is stakeholder management?",
            options: [
                "Managing relationships with people affected by product",
                "Managing stocks",
                "Managing servers",
                "Managing databases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is product-market fit?",
            options: [
                "Product satisfies strong market demand",
                "Product fits in market physically",
                "Product is in market",
                "Product is out of market"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a feature?",
            options: [
                "A functionality or capability of a product",
                "A bug",
                "A database",
                "A server"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is prioritization?",
            options: [
                "Ranking tasks by importance",
                "Creating tasks",
                "Deleting tasks",
                "Ignoring tasks"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a release?",
            options: [
                "Making a product version available to users",
                "Deleting a product",
                "Testing a product",
                "Designing a product"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is cross-functional collaboration?",
            options: [
                "Working with different teams and departments",
                "Working alone",
                "Working with one team",
                "Working without teams"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a product requirement?",
            options: [
                "Specification of what a product should do",
                "A bug report",
                "A code file",
                "A database"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is analytics in product management?",
            options: [
                "Using data to make product decisions",
                "Writing code",
                "Designing interfaces",
                "Managing servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is A/B testing in product management?",
            options: [
                "Comparing two versions to see which performs better",
                "Testing code",
                "Testing servers",
                "Testing databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product and project management?",
            options: [
                "Product focuses on ongoing value, project on specific deliverables",
                "They are the same",
                "Project is always better",
                "Product is always temporary"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a product strategy?",
            options: [
                "Long-term plan for product success",
                "A product feature",
                "A product design",
                "A product code"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is customer feedback?",
            options: [
                "Input from users about product",
                "Customer data only",
                "Customer complaints only",
                "Customer purchases only"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the role of a tech product manager?",
            options: [
                "Bridge between business and technical teams",
                "Only write code",
                "Only design",
                "Only test"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product roadmaps?",
            options: [
                "To plan product development over time",
                "To roadmap products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of user stories?",
            options: [
                "To describe features from user perspective",
                "To story users only",
                "To delete users",
                "To copy users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of product metrics?",
            options: [
                "To measure product success and performance",
                "To metric products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product backlog?",
            options: [
                "To prioritize and manage product features",
                "To backlog products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of sprint planning?",
            options: [
                "To plan work for development sprints",
                "To plan sprints only",
                "To delete sprints",
                "To copy sprints"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of stakeholder management?",
            options: [
                "To manage relationships with product stakeholders",
                "To manage stakeholders only",
                "To delete stakeholders",
                "To copy stakeholders"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of market research?",
            options: [
                "To understand market needs and opportunities",
                "To research markets only",
                "To delete markets",
                "To copy markets"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of competitive analysis?",
            options: [
                "To understand competitor products and strategies",
                "To analyze competitors only",
                "To delete competitors",
                "To copy competitors"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product launch planning?",
            options: [
                "To plan product releases and launches",
                "To plan launches only",
                "To delete launches",
                "To copy launches"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of feature prioritization?",
            options: [
                "To decide which features to build first",
                "To prioritize features only",
                "To delete features",
                "To copy features"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product requirements documents?",
            options: [
                "To document product features and requirements",
                "To document requirements only",
                "To delete requirements",
                "To copy requirements"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of user acceptance testing?",
            options: [
                "To validate products with end users",
                "To test users only",
                "To delete users",
                "To copy users"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product analytics?",
            options: [
                "To analyze product usage and behavior",
                "To analytics products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of customer feedback?",
            options: [
                "To gather insights from customers",
                "To feedback customers only",
                "To delete customers",
                "To copy customers"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of product strategy?",
            options: [
                "To define product vision and direction",
                "To strategy products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of go-to-market strategy?",
            options: [
                "To plan product launch and marketing",
                "To strategy markets only",
                "To delete markets",
                "To copy markets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product lifecycle management?",
            options: [
                "To manage products from conception to retirement",
                "To lifecycle products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of minimum viable product (MVP)?",
            options: [
                "To launch products with core features",
                "To MVP products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product-market fit?",
            options: [
                "To ensure products meet market needs",
                "To fit markets only",
                "To delete markets",
                "To copy markets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of user personas?",
            options: [
                "To represent target user groups",
                "To persona users only",
                "To delete users",
                "To copy users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of wireframing?",
            options: [
                "To create low-fidelity product layouts",
                "To wireframe products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of prototyping?",
            options: [
                "To create interactive product mockups",
                "To prototype products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product demos?",
            options: [
                "To showcase product features to stakeholders",
                "To demo products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of release management?",
            options: [
                "To manage product releases and versions",
                "To manage releases only",
                "To delete releases",
                "To copy releases"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of product documentation?",
            options: [
                "To document product features and usage",
                "To document products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of product training?",
            options: [
                "To educate users and teams about products",
                "To train products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of product support?",
            options: [
                "To help users with product issues",
                "To support products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of product iteration?",
            options: [
                "To improve products through continuous updates",
                "To iterate products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of A/B testing in product management?",
            options: [
                "To test different product features with users",
                "To test products only",
                "To delete products",
                "To copy products"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ],
    "Systems Administrator": [
        {
            question: "What is a systems administrator?",
            options: [
                "Person who manages IT infrastructure",
                "A developer",
                "A designer",
                "A tester"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Linux?",
            options: [
                "An open-source operating system",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is server management?",
            options: [
                "Maintaining and configuring servers",
                "Creating servers only",
                "Deleting servers only",
                "Designing servers"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is network administration?",
            options: [
                "Managing network infrastructure",
                "Creating networks only",
                "Deleting networks",
                "Designing networks only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a server?",
            options: [
                "Computer that provides services to other computers",
                "A database",
                "A programming language",
                "A cloud service"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is system monitoring?",
            options: [
                "Tracking system performance and health",
                "Watching systems",
                "Creating systems",
                "Deleting systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is backup?",
            options: [
                "Copying data for recovery purposes",
                "Deleting data",
                "Moving data",
                "Creating data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is disaster recovery?",
            options: [
                "Process of restoring systems after failures",
                "Preventing disasters",
                "Creating disasters",
                "Ignoring disasters"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is user management?",
            options: [
                "Managing user accounts and permissions",
                "Creating users only",
                "Deleting users only",
                "Designing users"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a database administrator?",
            options: [
                "Person who manages databases",
                "A developer",
                "A designer",
                "A tester"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is performance tuning?",
            options: [
                "Optimizing system performance",
                "Slowing down systems",
                "Breaking systems",
                "Deleting systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is patch management?",
            options: [
                "Managing software updates and fixes",
                "Creating patches",
                "Deleting patches",
                "Ignoring patches"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a shell?",
            options: [
                "Command-line interface for operating systems",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is SSH?",
            options: [
                "Secure Shell - protocol for remote access",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is virtualization?",
            options: [
                "Creating virtual versions of resources",
                "Making things real",
                "Deleting resources",
                "Copying resources"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is load balancing?",
            options: [
                "Distributing traffic across multiple servers",
                "Increasing load",
                "Decreasing load",
                "Ignoring load"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is system security?",
            options: [
                "Protecting systems from threats",
                "Breaking systems",
                "Deleting systems",
                "Ignoring systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is troubleshooting?",
            options: [
                "Identifying and fixing problems",
                "Creating problems",
                "Ignoring problems",
                "Deleting problems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the difference between Windows and Linux servers?",
            options: [
                "Different operating systems with different management approaches",
                "They are the same",
                "Windows is always better",
                "Linux is always faster"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is system documentation?",
            options: [
                "Recording system configuration and procedures",
                "Deleting information",
                "Ignoring information",
                "Creating problems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system monitoring?",
            options: [
                "To track system performance and health",
                "To monitor systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of log management?",
            options: [
                "To collect and analyze system logs",
                "To manage logs only",
                "To delete logs",
                "To copy logs"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of backup strategies?",
            options: [
                "To protect data from loss",
                "To backup strategies only",
                "To delete backups",
                "To copy backups"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of disaster recovery planning?",
            options: [
                "To prepare for system failures",
                "To plan disasters only",
                "To delete disasters",
                "To copy disasters"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of patch management?",
            options: [
                "To keep systems updated with security patches",
                "To manage patches only",
                "To delete patches",
                "To copy patches"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of user account management?",
            options: [
                "To manage user access and permissions",
                "To manage accounts only",
                "To delete accounts",
                "To copy accounts"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of network configuration?",
            options: [
                "To set up and manage network settings",
                "To configure networks only",
                "To delete networks",
                "To copy networks"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of server hardening?",
            options: [
                "To secure servers against threats",
                "To harden servers only",
                "To delete servers",
                "To copy servers"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of capacity planning?",
            options: [
                "To plan for future resource needs",
                "To plan capacity only",
                "To delete capacity",
                "To copy capacity"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of performance tuning?",
            options: [
                "To optimize system performance",
                "To tune performance only",
                "To delete performance",
                "To copy performance"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system automation?",
            options: [
                "To automate repetitive system tasks",
                "To automate systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of configuration management?",
            options: [
                "To manage system configurations",
                "To manage configurations only",
                "To delete configurations",
                "To copy configurations"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system security?",
            options: [
                "To protect systems from threats",
                "To secure systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of access control?",
            options: [
                "To control who can access systems",
                "To control access only",
                "To delete access",
                "To copy access"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system updates?",
            options: [
                "To keep systems current and secure",
                "To update systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system maintenance?",
            options: [
                "To keep systems running smoothly",
                "To maintain systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system troubleshooting?",
            options: [
                "To diagnose and fix system problems",
                "To troubleshoot systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system auditing?",
            options: [
                "To track system changes and access",
                "To audit systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system compliance?",
            options: [
                "To ensure systems meet standards",
                "To comply with systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system virtualization?",
            options: [
                "To run multiple systems on one server",
                "To virtualize systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of system clustering?",
            options: [
                "To group servers for high availability",
                "To cluster systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of system load balancing?",
            options: [
                "To distribute load across multiple servers",
                "To balance systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of system scaling?",
            options: [
                "To adjust system resources as needed",
                "To scale systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system redundancy?",
            options: [
                "To provide backup systems for reliability",
                "To redundant systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of system change management?",
            options: [
                "To manage system changes safely",
                "To manage changes only",
                "To delete changes",
                "To copy changes"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of system inventory?",
            options: [
                "To track system assets and resources",
                "To inventory systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system health checks?",
            options: [
                "To verify system status and health",
                "To check systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system alerts?",
            options: [
                "To notify about system issues",
                "To alert systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of system reporting?",
            options: [
                "To generate system status reports",
                "To report systems only",
                "To delete systems",
                "To copy systems"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        }
    ],
    "Business Intelligence (BI) Developer": [
        {
            question: "What is Business Intelligence?",
            options: [
                "Using data to make business decisions",
                "Storing data only",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a data warehouse?",
            options: [
                "Central repository for integrated data",
                "A physical warehouse",
                "A database only",
                "A server only"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is Power BI?",
            options: [
                "Microsoft's business analytics tool",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is Tableau?",
            options: [
                "Data visualization and analytics platform",
                "A database system",
                "A programming language",
                "A cloud service"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is SQL?",
            options: [
                "Structured Query Language for databases",
                "A programming language",
                "A database system",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is data modeling?",
            options: [
                "Designing data structures and relationships",
                "Creating data only",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a dashboard?",
            options: [
                "Visual display of key metrics and data",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is ETL?",
            options: [
                "Extract, Transform, Load - data integration process",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is data visualization?",
            options: [
                "Presenting data in graphical format",
                "Storing data",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a report?",
            options: [
                "Formatted presentation of data insights",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is data analysis?",
            options: [
                "Examining data to find patterns and insights",
                "Storing data only",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is a KPI?",
            options: [
                "Key Performance Indicator - measurable value",
                "A database",
                "A server",
                "A network"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is OLAP?",
            options: [
                "Online Analytical Processing for complex queries",
                "A database system",
                "A programming language",
                "A cloud platform"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is data mining?",
            options: [
                "Discovering patterns in large datasets",
                "Storing data",
                "Deleting data",
                "Copying data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is a data mart?",
            options: [
                "Subset of data warehouse for specific department",
                "A physical store",
                "A database only",
                "A server only"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of BI tools?",
            options: [
                "To help organizations make data-driven decisions",
                "To store data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is real-time analytics?",
            options: [
                "Analyzing data as it is generated",
                "Analyzing old data only",
                "Storing data",
                "Deleting data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is data governance?",
            options: [
                "Managing data quality and policies",
                "Storing data only",
                "Deleting data",
                "Ignoring data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between BI and data science?",
            options: [
                "BI focuses on reporting, data science on predictions",
                "They are the same",
                "Data science is only reporting",
                "BI is only predictions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is a BI developer responsible for?",
            options: [
                "Creating reports, dashboards, and data solutions",
                "Only storing data",
                "Only deleting data",
                "Only copying data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of data warehousing?",
            options: [
                "To store and organize data for analysis",
                "To warehouse data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of ETL processes?",
            options: [
                "To Extract, Transform, and Load data",
                "To ETL data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of OLAP cubes?",
            options: [
                "To enable multidimensional data analysis",
                "To cube data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data modeling?",
            options: [
                "To design data structures for analysis",
                "To model data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of star schema?",
            options: [
                "To organize data in a dimensional model",
                "To schema data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of snowflake schema?",
            options: [
                "To normalize dimensional data model",
                "To schema data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data quality management?",
            options: [
                "To ensure data accuracy and completeness",
                "To manage quality only",
                "To delete quality",
                "To copy quality"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data profiling?",
            options: [
                "To analyze data structure and quality",
                "To profile data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data cleansing?",
            options: [
                "To remove errors and inconsistencies from data",
                "To cleanse data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data integration?",
            options: [
                "To combine data from multiple sources",
                "To integrate data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of master data management?",
            options: [
                "To manage core business data consistently",
                "To manage data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data governance?",
            options: [
                "To manage data policies and standards",
                "To govern data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data lineage?",
            options: [
                "To track data flow and transformations",
                "To lineage data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data cataloging?",
            options: [
                "To organize and document data assets",
                "To catalog data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of self-service BI?",
            options: [
                "To enable users to create their own reports",
                "To service BI only",
                "To delete BI",
                "To copy BI"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of embedded analytics?",
            options: [
                "To integrate analytics into applications",
                "To embed analytics only",
                "To delete analytics",
                "To copy analytics"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of predictive analytics?",
            options: [
                "To forecast future trends and outcomes",
                "To predict analytics only",
                "To delete analytics",
                "To copy analytics"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of prescriptive analytics?",
            options: [
                "To recommend actions based on data",
                "To prescribe analytics only",
                "To delete analytics",
                "To copy analytics"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data storytelling?",
            options: [
                "To communicate insights through narratives",
                "To story data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of KPI dashboards?",
            options: [
                "To track key performance indicators",
                "To dashboard KPIs only",
                "To delete KPIs",
                "To copy KPIs"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of drill-down analysis?",
            options: [
                "To explore data at different levels of detail",
                "To drill data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of slice and dice analysis?",
            options: [
                "To view data from different perspectives",
                "To slice data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data refresh schedules?",
            options: [
                "To keep data current in reports",
                "To refresh data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of data security in BI?",
            options: [
                "To protect sensitive data in reports",
                "To secure data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data access controls?",
            options: [
                "To control who can view data",
                "To control access only",
                "To delete access",
                "To copy access"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data archiving?",
            options: [
                "To store historical data for future use",
                "To archive data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data retention policies?",
            options: [
                "To define how long data is kept",
                "To retain data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the purpose of data backup in BI?",
            options: [
                "To protect BI data from loss",
                "To backup data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "easy"
        },
        {
            question: "What is the purpose of data recovery in BI?",
            options: [
                "To restore BI data after failures",
                "To recover data only",
                "To delete data",
                "To copy data"
            ],
            correctAnswer: 0,
            difficulty: "medium"
        }
    ]
};

// Apply randomization to all categories
const sampleQuestions = {};
for (const [categoryName, questions] of Object.entries(sampleQuestionsRaw)) {
    sampleQuestions[categoryName] = randomizeCorrectAnswers(questions);
}

const seedQuestions = async () => {
    try {
        await connectDB();
        
        for (const [categoryName, questions] of Object.entries(sampleQuestions)) {
            // Find category by name
            const category = await Category.findOne({ name: categoryName });
            
            if (!category) {
                console.log(`Category "${categoryName}" not found. Skipping...`);
                continue;
            }

            // Check if questions already exist for this category
            const existingQuestions = await Question.find({ category: category._id });
            if (existingQuestions.length > 0) {
                console.log(`Questions for "${categoryName}" already exist. Updating with randomized answers...`);
                
                // Delete existing questions
                await Question.deleteMany({ category: category._id });
            }

            // Create questions with randomized answers
            const questionsToCreate = questions.map(q => ({
                ...q,
                category: category._id
            }));

            await Question.insertMany(questionsToCreate);
            console.log(`✓ Created/Updated ${questions.length} questions for "${categoryName}"`);
        }

        console.log("Question seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding questions:", error);
        process.exit(1);
    }
};

seedQuestions();

