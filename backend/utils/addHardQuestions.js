import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { Category } from "../models/category.model.js";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config({});

// Function to randomize correct answer positions
function randomizeCorrectAnswers(questions) {
    return questions.map((q, index) => {
        const prime = 17;
        const position = (index * prime + Math.floor(index / 4)) % 4;
        const correctAnswer = q.options[0];
        const newOptions = [...q.options];
        newOptions[0] = newOptions[position];
        newOptions[position] = correctAnswer;
        return {
            ...q,
            options: newOptions,
            correctAnswer: position
        };
    });
}

// 50 Hard Questions for each category
const hardQuestionsByCategory = {
    "Frontend Developer": [
        {
            question: "What is the time complexity of React's reconciliation algorithm when diffing two virtual DOM trees?",
            options: [
                "O(n^3) where n is the number of nodes",
                "O(n) where n is the number of nodes",
                "O(n log n) where n is the number of nodes",
                "O(2^n) where n is the number of nodes"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "In React, what is the difference between useMemo and useCallback hooks?",
            options: [
                "useMemo memoizes values, useCallback memoizes functions",
                "They are identical",
                "useCallback memoizes values, useMemo memoizes functions",
                "Neither memoizes anything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of React's Error Boundaries and what are their limitations?",
            options: [
                "They catch JavaScript errors in component tree but not in event handlers, async code, or SSR",
                "They catch all errors including event handlers and async code",
                "They only catch syntax errors",
                "They prevent all errors from occurring"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does React Fiber architecture improve performance compared to the old stack reconciler?",
            options: [
                "It enables incremental rendering and task prioritization",
                "It reduces bundle size by 50%",
                "It eliminates the need for virtual DOM",
                "It compiles JavaScript to native code"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between controlled and uncontrolled components in React?",
            options: [
                "Controlled components have form data handled by React state, uncontrolled use DOM refs",
                "Controlled components are faster",
                "Uncontrolled components are always better",
                "There is no difference"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain the concept of 'lifting state up' in React and when it's necessary.",
            options: [
                "Moving state to common ancestor when multiple components need it",
                "Moving state to child components",
                "Deleting state entirely",
                "Storing state in localStorage"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of React's Concurrent Mode and how does it work?",
            options: [
                "It allows React to interrupt rendering work for higher priority updates",
                "It enables multi-threaded rendering",
                "It compiles React to WebAssembly",
                "It eliminates re-renders completely"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does React's key prop optimization work and why is it important?",
            options: [
                "Keys help React identify which items changed, preventing unnecessary re-renders",
                "Keys are only for styling",
                "Keys are required for all components",
                "Keys slow down React"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between React.memo, useMemo, and useCallback?",
            options: [
                "React.memo memoizes components, useMemo memoizes values, useCallback memoizes functions",
                "They are all identical",
                "They all memoize the same thing",
                "None of them memoize anything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how React's Suspense component works with code splitting and data fetching.",
            options: [
                "Suspense allows components to wait for async operations before rendering",
                "Suspense only works with images",
                "Suspense prevents all loading states",
                "Suspense is deprecated"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between CSS Grid and Flexbox, and when should each be used?",
            options: [
                "Grid is for 2D layouts, Flexbox is for 1D layouts",
                "They are identical",
                "Flexbox is always better",
                "Grid is always better"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does the CSS cascade and specificity work when multiple rules target the same element?",
            options: [
                "Specificity determines which rule wins, with !important having highest priority",
                "The last rule always wins",
                "The first rule always wins",
                "Rules are randomly selected"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between CSS transforms, transitions, and animations?",
            options: [
                "Transforms change appearance, transitions animate changes, animations are keyframe-based",
                "They are identical",
                "Only animations work",
                "Only transitions work"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain the concept of CSS containment and how it optimizes rendering performance.",
            options: [
                "Containment limits scope of layout/paint/style recalculation to specific subtree",
                "Containment prevents all rendering",
                "Containment is only for animations",
                "Containment doesn't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between block, inline, and inline-block display values in CSS?",
            options: [
                "Block takes full width, inline flows with text, inline-block flows but respects width/height",
                "They are identical",
                "Only block exists",
                "Only inline exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does JavaScript's event loop handle asynchronous operations and promises?",
            options: [
                "Event loop processes call stack, then callback queue, microtasks have priority",
                "Everything runs synchronously",
                "Promises run before callbacks",
                "There is no event loop"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between var, let, and const in JavaScript?",
            options: [
                "var is function-scoped, let/const are block-scoped; const prevents reassignment",
                "They are identical",
                "Only var exists",
                "Only let exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain JavaScript closures and how they relate to scope and memory management.",
            options: [
                "Closures allow inner functions to access outer function variables even after outer returns",
                "Closures prevent memory leaks",
                "Closures don't exist in JavaScript",
                "Closures are only for classes"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between == and === in JavaScript, and why does it matter?",
            options: [
                "== performs type coercion, === checks value and type without coercion",
                "They are identical",
                "Only == exists",
                "Only === exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does JavaScript's prototypal inheritance work compared to classical inheritance?",
            options: [
                "Objects inherit directly from other objects via prototype chain, not classes",
                "JavaScript uses classical inheritance like Java",
                "JavaScript has no inheritance",
                "Inheritance is only for functions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between null, undefined, and undeclared in JavaScript?",
            options: [
                "null is assigned value, undefined is default, undeclared doesn't exist",
                "They are identical",
                "Only null exists",
                "Only undefined exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Webpack's code splitting and tree shaking work to optimize bundle size.",
            options: [
                "Code splitting creates separate chunks, tree shaking removes unused code",
                "They are identical",
                "Only code splitting exists",
                "Only tree shaking exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Webpack, Vite, and Parcel bundlers?",
            options: [
                "Webpack is configurable, Vite uses native ESM, Parcel is zero-config",
                "They are identical",
                "Only Webpack exists",
                "Only Vite exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does TypeScript's type system differ from JavaScript and what are its benefits?",
            options: [
                "TypeScript adds static typing, interfaces, and compile-time error checking",
                "TypeScript is just JavaScript with different syntax",
                "TypeScript doesn't compile",
                "TypeScript is slower"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between TypeScript's type and interface?",
            options: [
                "type can use unions/intersections, interface can be extended/merged",
                "They are identical",
                "Only type exists",
                "Only interface exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how GraphQL differs from REST APIs and when to use each.",
            options: [
                "GraphQL allows clients to request specific fields, REST returns fixed structures",
                "They are identical",
                "Only REST exists",
                "Only GraphQL exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of Redux middleware like Redux-Thunk or Redux-Saga?",
            options: [
                "They enable async actions and side effects in Redux",
                "They replace Redux entirely",
                "They are only for testing",
                "They don't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does React's Context API differ from Redux for state management?",
            options: [
                "Context is built-in but can cause re-render issues, Redux has better dev tools",
                "They are identical",
                "Only Context exists",
                "Only Redux exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server-side rendering (SSR) and static site generation (SSG)?",
            options: [
                "SSR renders on each request, SSG pre-renders at build time",
                "They are identical",
                "Only SSR exists",
                "Only SSG exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Progressive Web Apps (PWAs) work and their key features.",
            options: [
                "PWAs use service workers for offline support, app-like experience, push notifications",
                "PWAs are native apps",
                "PWAs don't work offline",
                "PWAs are deprecated"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of Web Workers and when should they be used?",
            options: [
                "Web Workers run scripts in background threads to avoid blocking main thread",
                "They are only for styling",
                "They don't exist",
                "They are deprecated"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does the browser's rendering pipeline work from HTML to pixels?",
            options: [
                "Parse HTML → Build DOM → Render Tree → Layout → Paint → Composite",
                "It renders instantly",
                "Only CSS matters",
                "Only JavaScript matters"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between repaint and reflow in browser rendering?",
            options: [
                "Repaint changes visual properties, reflow recalculates layout",
                "They are identical",
                "Only repaint exists",
                "Only reflow exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how CSS custom properties (variables) work and their advantages.",
            options: [
                "Custom properties cascade and can be changed at runtime, enabling theming",
                "They are identical to Sass variables",
                "They don't cascade",
                "They don't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between CSS preprocessors (Sass, Less) and PostCSS?",
            options: [
                "Preprocessors add features, PostCSS transforms CSS with plugins",
                "They are identical",
                "Only Sass exists",
                "Only PostCSS exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does lazy loading work in React and what are its performance benefits?",
            options: [
                "React.lazy loads components on-demand, reducing initial bundle size",
                "It loads everything immediately",
                "It doesn't exist",
                "It only works with images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between React's Portals and regular component rendering?",
            options: [
                "Portals render children into DOM node outside parent hierarchy",
                "They are identical",
                "Portals don't exist",
                "Portals are only for modals"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how React's useReducer hook differs from useState and when to use each.",
            options: [
                "useReducer is better for complex state logic with multiple sub-values",
                "They are identical",
                "Only useState exists",
                "Only useReducer exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of React's useLayoutEffect hook and when should it be used?",
            options: [
                "useLayoutEffect runs synchronously after DOM mutations, before paint",
                "It's identical to useEffect",
                "It doesn't exist",
                "It's deprecated"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does React's Context API handle performance issues with frequent updates?",
            options: [
                "Context can cause unnecessary re-renders; split contexts or use selectors",
                "Context has no performance issues",
                "Context is always fast",
                "Context doesn't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between React's forwardRef and useImperativeHandle?",
            options: [
                "forwardRef passes refs to child components, useImperativeHandle customizes ref value",
                "They are identical",
                "Only forwardRef exists",
                "Only useImperativeHandle exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how React's concurrent features (Suspense, useTransition) improve UX.",
            options: [
                "They allow React to keep UI responsive during expensive updates",
                "They don't exist",
                "They make everything slower",
                "They are only for animations"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between CSS-in-JS solutions (styled-components, emotion) and CSS modules?",
            options: [
                "CSS-in-JS scopes styles via JS, CSS modules scope via class names",
                "They are identical",
                "Only CSS-in-JS exists",
                "Only CSS modules exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does the browser's same-origin policy affect frontend security?",
            options: [
                "It prevents scripts from accessing resources from different origins",
                "It doesn't exist",
                "It allows all access",
                "It's only for cookies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between CORS, CSP, and XSS protection mechanisms?",
            options: [
                "CORS controls cross-origin requests, CSP prevents XSS, XSS is the attack",
                "They are identical",
                "Only CORS exists",
                "Only CSP exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how WebAssembly (WASM) can be used in frontend development.",
            options: [
                "WASM allows running high-performance code in browser, near-native speed",
                "WASM replaces JavaScript entirely",
                "WASM doesn't exist",
                "WASM is only for backend"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of HTTP/2 and HTTP/3 in modern web development?",
            options: [
                "HTTP/2 multiplexes requests, HTTP/3 uses QUIC for better performance",
                "They are identical to HTTP/1.1",
                "They don't exist",
                "They are slower"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does browser caching work and what are the different cache strategies?",
            options: [
                "Browser cache stores resources; strategies include cache-first, network-first, stale-while-revalidate",
                "Caching doesn't exist",
                "Only one strategy exists",
                "Caching is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Backend Developer": [
        {
            question: "What is the difference between ACID and BASE properties in database transactions?",
            options: [
                "ACID ensures consistency, BASE prioritizes availability and partition tolerance",
                "They are identical",
                "Only ACID exists",
                "Only BASE exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain the difference between horizontal and vertical scaling in distributed systems.",
            options: [
                "Horizontal adds more servers, vertical adds more resources to existing server",
                "They are identical",
                "Only horizontal exists",
                "Only vertical exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the CAP theorem and how does it affect distributed system design?",
            options: [
                "CAP states you can only guarantee 2 of 3: Consistency, Availability, Partition tolerance",
                "CAP doesn't exist",
                "CAP guarantees all three",
                "CAP is only for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database indexing work and what are its trade-offs?",
            options: [
                "Indexes speed up queries but slow down writes and use extra storage",
                "Indexes only speed up writes",
                "Indexes have no trade-offs",
                "Indexes don't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between SQL injection and NoSQL injection attacks?",
            options: [
                "SQL injection targets SQL databases, NoSQL injection targets document/NoSQL databases",
                "They are identical",
                "Only SQL injection exists",
                "Only NoSQL injection exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection pooling improves application performance.",
            options: [
                "Connection pooling reuses existing connections instead of creating new ones",
                "It doesn't improve performance",
                "It creates more connections",
                "It doesn't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between optimistic and pessimistic locking in databases?",
            options: [
                "Optimistic assumes no conflicts, pessimistic locks resources immediately",
                "They are identical",
                "Only optimistic exists",
                "Only pessimistic exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does message queue architecture work for asynchronous processing?",
            options: [
                "Messages are queued and processed asynchronously by workers",
                "Messages are processed synchronously",
                "Messages don't queue",
                "Queues don't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between microservices and monolithic architecture?",
            options: [
                "Microservices split app into independent services, monolith is single unit",
                "They are identical",
                "Only microservices exist",
                "Only monolith exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how API rate limiting works and common strategies.",
            options: [
                "Rate limiting restricts requests per time period; strategies include token bucket, sliding window",
                "Rate limiting doesn't exist",
                "Only one strategy exists",
                "Rate limiting is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between JWT tokens and session-based authentication?",
            options: [
                "JWT is stateless, stored client-side; sessions are stateful, stored server-side",
                "They are identical",
                "Only JWT exists",
                "Only sessions exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database sharding work and what are its challenges?",
            options: [
                "Sharding splits data across multiple databases; challenges include cross-shard queries",
                "Sharding doesn't exist",
                "Sharding has no challenges",
                "Sharding is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between eventual consistency and strong consistency?",
            options: [
                "Eventual consistency allows temporary inconsistencies, strong consistency requires immediate consistency",
                "They are identical",
                "Only eventual exists",
                "Only strong exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database replication works and different replication strategies.",
            options: [
                "Replication copies data to multiple servers; strategies include master-slave, master-master",
                "Replication doesn't exist",
                "Only one strategy exists",
                "Replication is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database transactions and isolation levels?",
            options: [
                "Transactions ensure ACID properties; isolation levels control concurrent access visibility",
                "Transactions don't exist",
                "Isolation levels don't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does caching work at different levels (application, database, CDN)?",
            options: [
                "Application cache stores computed results, database cache stores queries, CDN caches static assets",
                "They are identical",
                "Only application cache exists",
                "Only database cache exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between REST and GraphQL APIs?",
            options: [
                "REST uses multiple endpoints, GraphQL uses single endpoint with flexible queries",
                "They are identical",
                "Only REST exists",
                "Only GraphQL exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how load balancing works and different load balancing algorithms.",
            options: [
                "Load balancing distributes requests across servers; algorithms include round-robin, least connections",
                "Load balancing doesn't exist",
                "Only one algorithm exists",
                "Load balancing is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between synchronous and asynchronous processing?",
            options: [
                "Synchronous blocks until complete, asynchronous continues without waiting",
                "They are identical",
                "Only synchronous exists",
                "Only asynchronous exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database normalization work and when is denormalization acceptable?",
            options: [
                "Normalization reduces redundancy; denormalization improves read performance at cost of consistency",
                "They are identical",
                "Only normalization exists",
                "Only denormalization exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API versioning and common versioning strategies?",
            options: [
                "Versioning maintains backward compatibility; strategies include URL, header, query parameter versioning",
                "Versioning doesn't exist",
                "Only one strategy exists",
                "Versioning is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database deadlocks occur and how to prevent them.",
            options: [
                "Deadlocks occur when transactions wait for each other; prevent with timeout, ordering, or detection",
                "Deadlocks don't exist",
                "Deadlocks are automatic",
                "Only one prevention method exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between stateless and stateful APIs?",
            options: [
                "Stateless doesn't store client state, stateful maintains client state on server",
                "They are identical",
                "Only stateless exists",
                "Only stateful exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query optimization work and what techniques are used?",
            options: [
                "Optimization uses indexes, query plans, and execution strategies to improve performance",
                "Optimization doesn't exist",
                "Only indexes matter",
                "Optimization is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database migrations and how are they managed?",
            options: [
                "Migrations version database schema changes; managed with migration tools and rollback strategies",
                "Migrations don't exist",
                "Migrations are automatic",
                "Only one migration tool exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how distributed tracing works in microservices architecture.",
            options: [
                "Distributed tracing tracks requests across services using correlation IDs and trace context",
                "Tracing doesn't exist",
                "Tracing is automatic",
                "Only one service can be traced"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between eventual consistency patterns (CQRS, Event Sourcing)?",
            options: [
                "CQRS separates read/write models, Event Sourcing stores events as source of truth",
                "They are identical",
                "Only CQRS exists",
                "Only Event Sourcing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database backup and recovery work in production systems?",
            options: [
                "Backups copy data periodically; recovery restores from backups with point-in-time recovery options",
                "Backups don't exist",
                "Recovery doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API gateways in microservices architecture?",
            options: [
                "API gateways provide single entry point, routing, authentication, rate limiting, and aggregation",
                "Gateways don't exist",
                "Gateways only route",
                "Gateways are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection management works in high-concurrency applications.",
            options: [
                "Connection pooling, connection limits, and timeout management handle concurrent connections efficiently",
                "Connections are unlimited",
                "Only pooling exists",
                "Connections are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between SQL and NoSQL databases and when to use each?",
            options: [
                "SQL is relational with ACID, NoSQL is flexible schema; SQL for structured data, NoSQL for scale",
                "They are identical",
                "Only SQL exists",
                "Only NoSQL exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database partitioning work and different partitioning strategies?",
            options: [
                "Partitioning splits tables; strategies include range, hash, list partitioning",
                "Partitioning doesn't exist",
                "Only one strategy exists",
                "Partitioning is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database views and materialized views?",
            options: [
                "Views are virtual tables, materialized views store computed results for performance",
                "They are identical",
                "Only views exist",
                "Only materialized views exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database triggers work and their use cases.",
            options: [
                "Triggers execute automatically on data changes; used for auditing, validation, denormalization",
                "Triggers don't exist",
                "Triggers are manual",
                "Triggers are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between horizontal partitioning and vertical partitioning?",
            options: [
                "Horizontal splits rows across tables, vertical splits columns across tables",
                "They are identical",
                "Only horizontal exists",
                "Only vertical exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query caching work and what are its limitations?",
            options: [
                "Query cache stores results; limitations include invalidation complexity and memory usage",
                "Caching doesn't exist",
                "Caching has no limitations",
                "Caching is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database stored procedures and their advantages?",
            options: [
                "Stored procedures execute on database server; advantages include reduced network traffic, security",
                "Stored procedures don't exist",
                "Stored procedures are slower",
                "Stored procedures are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection failover works in high-availability setups.",
            options: [
                "Failover automatically switches to backup database when primary fails",
                "Failover doesn't exist",
                "Failover is manual",
                "Failover is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between database clustering and replication?",
            options: [
                "Clustering shares storage and resources, replication copies data to separate servers",
                "They are identical",
                "Only clustering exists",
                "Only replication exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query plan optimization work?",
            options: [
                "Query optimizer analyzes queries and selects best execution plan based on indexes and statistics",
                "Optimization doesn't exist",
                "Optimization is random",
                "Optimization is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database connection string encryption?",
            options: [
                "Encryption protects credentials in connection strings from unauthorized access",
                "Encryption doesn't exist",
                "Encryption is automatic",
                "Encryption slows everything down"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection timeout and retry mechanisms work.",
            options: [
                "Timeouts prevent indefinite waits; retry mechanisms attempt reconnection with exponential backoff",
                "Timeouts don't exist",
                "Retries don't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between database read replicas and write replicas?",
            options: [
                "Read replicas handle queries, write replicas handle updates; master handles writes, replicas handle reads",
                "They are identical",
                "Only read replicas exist",
                "Only write replicas exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database connection pooling prevent connection exhaustion?",
            options: [
                "Pooling reuses connections, limiting total connections and preventing resource exhaustion",
                "Pooling doesn't exist",
                "Pooling creates more connections",
                "Pooling is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database query result pagination?",
            options: [
                "Pagination limits result sets, improving performance and reducing memory usage",
                "Pagination doesn't exist",
                "Pagination is automatic",
                "Pagination slows queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection health checks work.",
            options: [
                "Health checks verify connection validity before use, removing dead connections from pool",
                "Health checks don't exist",
                "Health checks are automatic",
                "Health checks slow connections"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between database hot backups and cold backups?",
            options: [
                "Hot backups occur during operation, cold backups require database shutdown",
                "They are identical",
                "Only hot backups exist",
                "Only cold backups exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query result streaming work for large datasets?",
            options: [
                "Streaming processes results incrementally, reducing memory usage for large result sets",
                "Streaming doesn't exist",
                "Streaming loads everything",
                "Streaming is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Data Science": [
        {
            question: "What is the difference between supervised and unsupervised learning?",
            options: [
                "Supervised uses labeled data, unsupervised finds patterns in unlabeled data",
                "They are identical",
                "Only supervised exists",
                "Only unsupervised exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain the bias-variance tradeoff in machine learning models.",
            options: [
                "High bias underfits, high variance overfits; optimal model balances both",
                "Bias and variance are identical",
                "Only bias matters",
                "Only variance matters"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is cross-validation and why is it important in model evaluation?",
            options: [
                "Cross-validation splits data into folds to assess model performance on unseen data",
                "Cross-validation doesn't exist",
                "Cross-validation is only for training",
                "Cross-validation is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does gradient descent work and what are its variants?",
            options: [
                "Gradient descent minimizes loss by following gradient; variants include SGD, Adam, RMSprop",
                "Gradient descent doesn't exist",
                "Only one variant exists",
                "Gradient descent is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between overfitting and underfitting?",
            options: [
                "Overfitting learns training data too well, underfitting fails to capture patterns",
                "They are identical",
                "Only overfitting exists",
                "Only underfitting exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how regularization techniques (L1, L2) prevent overfitting.",
            options: [
                "L1 adds absolute penalty, L2 adds squared penalty; both reduce model complexity",
                "They are identical",
                "Only L1 exists",
                "Only L2 exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature engineering in machine learning?",
            options: [
                "Feature engineering creates/transforms features to improve model performance",
                "Feature engineering doesn't exist",
                "Feature engineering is automatic",
                "Feature engineering slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does ensemble learning work and what are common ensemble methods?",
            options: [
                "Ensemble combines multiple models; methods include bagging, boosting, stacking",
                "Ensemble doesn't exist",
                "Only one method exists",
                "Ensemble is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between precision and recall in classification?",
            options: [
                "Precision measures true positives / (true positives + false positives), recall measures true positives / (true positives + false negatives)",
                "They are identical",
                "Only precision exists",
                "Only recall exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural networks learn through backpropagation.",
            options: [
                "Backpropagation calculates gradients and updates weights using chain rule",
                "Backpropagation doesn't exist",
                "Backpropagation is only forward",
                "Backpropagation is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the curse of dimensionality and how does it affect machine learning?",
            options: [
                "Curse of dimensionality: data becomes sparse in high dimensions, requiring more samples",
                "Curse doesn't exist",
                "Curse only affects low dimensions",
                "Curse is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does principal component analysis (PCA) work for dimensionality reduction?",
            options: [
                "PCA finds orthogonal directions of maximum variance, reducing dimensions while preserving information",
                "PCA doesn't exist",
                "PCA only increases dimensions",
                "PCA is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between correlation and causation?",
            options: [
                "Correlation shows relationship, causation shows one causes the other",
                "They are identical",
                "Only correlation exists",
                "Only causation exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how time series forecasting differs from regular regression.",
            options: [
                "Time series considers temporal dependencies and seasonality, regression assumes independence",
                "They are identical",
                "Only time series exists",
                "Only regression exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of A/B testing in data science?",
            options: [
                "A/B testing compares two variants to determine which performs better statistically",
                "A/B testing doesn't exist",
                "A/B testing is automatic",
                "A/B testing is only for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does k-means clustering work and what are its limitations?",
            options: [
                "K-means partitions data into k clusters; limitations include need to specify k, assumes spherical clusters",
                "K-means doesn't exist",
                "K-means has no limitations",
                "K-means is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between batch gradient descent and stochastic gradient descent?",
            options: [
                "Batch uses all data per update, SGD uses one sample per update",
                "They are identical",
                "Only batch exists",
                "Only SGD exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how decision trees work and what is information gain.",
            options: [
                "Decision trees split data based on features; information gain measures reduction in entropy",
                "Decision trees don't exist",
                "Information gain doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature scaling in machine learning?",
            options: [
                "Feature scaling normalizes features to similar ranges, improving convergence and performance",
                "Feature scaling doesn't exist",
                "Feature scaling is automatic",
                "Feature scaling slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does random forest differ from a single decision tree?",
            options: [
                "Random forest combines multiple trees with bootstrapping and feature randomness",
                "They are identical",
                "Only random forest exists",
                "Only decision tree exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between classification and regression problems?",
            options: [
                "Classification predicts categories, regression predicts continuous values",
                "They are identical",
                "Only classification exists",
                "Only regression exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how support vector machines (SVM) work and kernel trick.",
            options: [
                "SVM finds optimal hyperplane; kernel trick maps data to higher dimensions for non-linear separation",
                "SVM doesn't exist",
                "Kernel trick doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of hyperparameter tuning in machine learning?",
            options: [
                "Hyperparameter tuning optimizes model parameters not learned during training",
                "Hyperparameter tuning doesn't exist",
                "Hyperparameter tuning is automatic",
                "Hyperparameter tuning slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does deep learning differ from traditional machine learning?",
            options: [
                "Deep learning uses neural networks with multiple layers to learn hierarchical features",
                "They are identical",
                "Only deep learning exists",
                "Only traditional ML exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between R-squared and adjusted R-squared?",
            options: [
                "R-squared measures fit, adjusted R-squared penalizes for number of predictors",
                "They are identical",
                "Only R-squared exists",
                "Only adjusted R-squared exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how convolutional neural networks (CNN) work for image processing.",
            options: [
                "CNNs use convolutional layers to detect spatial patterns and features in images",
                "CNNs don't exist",
                "CNNs only work for text",
                "CNNs are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data normalization and standardization?",
            options: [
                "Normalization scales to 0-1 range, standardization scales to mean 0, std 1",
                "They are identical",
                "Only normalization exists",
                "Only standardization exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does natural language processing (NLP) handle text data?",
            options: [
                "NLP uses techniques like tokenization, embeddings, and language models to process text",
                "NLP doesn't exist",
                "NLP only works for numbers",
                "NLP is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between training, validation, and test sets?",
            options: [
                "Training set trains model, validation set tunes hyperparameters, test set evaluates final performance",
                "They are identical",
                "Only training set exists",
                "Only test set exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how reinforcement learning differs from supervised learning.",
            options: [
                "Reinforcement learning learns from rewards/penalties through interaction, supervised learns from labeled examples",
                "They are identical",
                "Only reinforcement learning exists",
                "Only supervised learning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature selection in machine learning?",
            options: [
                "Feature selection chooses relevant features to reduce dimensionality and improve performance",
                "Feature selection doesn't exist",
                "Feature selection is automatic",
                "Feature selection slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does logistic regression work for binary classification?",
            options: [
                "Logistic regression uses sigmoid function to model probability of binary outcomes",
                "Logistic regression doesn't exist",
                "Logistic regression only works for regression",
                "Logistic regression is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between bagging and boosting ensemble methods?",
            options: [
                "Bagging trains models in parallel, boosting trains sequentially with error correction",
                "They are identical",
                "Only bagging exists",
                "Only boosting exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how recurrent neural networks (RNN) handle sequential data.",
            options: [
                "RNNs maintain hidden state to process sequences with temporal dependencies",
                "RNNs don't exist",
                "RNNs only work for images",
                "RNNs are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of confusion matrix in classification evaluation?",
            options: [
                "Confusion matrix shows true/false positives and negatives to calculate metrics",
                "Confusion matrix doesn't exist",
                "Confusion matrix is automatic",
                "Confusion matrix only shows accuracy"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does feature importance work in tree-based models?",
            options: [
                "Feature importance measures how much each feature contributes to model predictions",
                "Feature importance doesn't exist",
                "Feature importance is automatic",
                "Feature importance is random"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between parametric and non-parametric models?",
            options: [
                "Parametric models assume fixed parameters, non-parametric adapt to data complexity",
                "They are identical",
                "Only parametric exists",
                "Only non-parametric exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how gradient boosting works and its advantages.",
            options: [
                "Gradient boosting sequentially adds models that correct previous errors, often achieving high accuracy",
                "Gradient boosting doesn't exist",
                "Gradient boosting is automatic",
                "Gradient boosting is slow"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cross-entropy loss in classification?",
            options: [
                "Cross-entropy measures difference between predicted and true probability distributions",
                "Cross-entropy doesn't exist",
                "Cross-entropy is automatic",
                "Cross-entropy only works for regression"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data imputation handle missing values?",
            options: [
                "Imputation fills missing values using statistical methods like mean, median, or model predictions",
                "Imputation doesn't exist",
                "Imputation deletes missing values",
                "Imputation is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between precision-recall curve and ROC curve?",
            options: [
                "PR curve shows precision vs recall, ROC shows true positive rate vs false positive rate",
                "They are identical",
                "Only PR curve exists",
                "Only ROC curve exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how attention mechanisms work in transformer models.",
            options: [
                "Attention mechanisms weight input features to focus on relevant parts for predictions",
                "Attention doesn't exist",
                "Attention is automatic",
                "Attention only works for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of early stopping in neural network training?",
            options: [
                "Early stopping prevents overfitting by stopping when validation performance stops improving",
                "Early stopping doesn't exist",
                "Early stopping is automatic",
                "Early stopping slows training"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does batch normalization improve neural network training?",
            options: [
                "Batch normalization normalizes layer inputs, stabilizing training and allowing higher learning rates",
                "Batch normalization doesn't exist",
                "Batch normalization is automatic",
                "Batch normalization slows training"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between LSTM and GRU in recurrent networks?",
            options: [
                "LSTM has separate forget/input/output gates, GRU combines gates for simpler architecture",
                "They are identical",
                "Only LSTM exists",
                "Only GRU exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how transfer learning works in deep learning.",
            options: [
                "Transfer learning uses pre-trained models on new tasks, leveraging learned features",
                "Transfer learning doesn't exist",
                "Transfer learning is automatic",
                "Transfer learning only works for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of dropout regularization in neural networks?",
            options: [
                "Dropout randomly deactivates neurons during training to prevent overfitting",
                "Dropout doesn't exist",
                "Dropout is automatic",
                "Dropout speeds up training"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Graphic Designer": [
        {
            question: "What is the difference between vector and raster graphics?",
            options: [
                "Vector uses mathematical equations (scalable), raster uses pixels (fixed resolution)",
                "They are identical",
                "Only vector exists",
                "Only raster exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain the importance of color theory in graphic design.",
            options: [
                "Color theory guides color selection for harmony, contrast, and emotional impact",
                "Color theory doesn't exist",
                "Color theory is automatic",
                "Color theory only matters for print"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between CMYK and RGB color modes?",
            options: [
                "CMYK is for print (subtractive), RGB is for screen (additive)",
                "They are identical",
                "Only CMYK exists",
                "Only RGB exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does typography hierarchy guide user attention?",
            options: [
                "Typography hierarchy uses size, weight, spacing to create visual order and importance",
                "Typography hierarchy doesn't exist",
                "Typography hierarchy is automatic",
                "Typography hierarchy only matters for text"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of grid systems in layout design?",
            options: [
                "Grid systems provide structure and consistency for organizing content",
                "Grid systems don't exist",
                "Grid systems are automatic",
                "Grid systems slow design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how negative space (whitespace) affects design composition.",
            options: [
                "Negative space creates breathing room, improves readability, and emphasizes elements",
                "Negative space doesn't exist",
                "Negative space is wasted space",
                "Negative space is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between serif and sans-serif fonts?",
            options: [
                "Serif has decorative strokes, sans-serif is clean without strokes",
                "They are identical",
                "Only serif exists",
                "Only sans-serif exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does visual balance work in design composition?",
            options: [
                "Visual balance distributes visual weight evenly through symmetry or asymmetry",
                "Visual balance doesn't exist",
                "Visual balance is automatic",
                "Visual balance only matters for photos"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of brand identity design?",
            options: [
                "Brand identity creates visual system representing company values and personality",
                "Brand identity doesn't exist",
                "Brand identity is automatic",
                "Brand identity only matters for logos"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how contrast enhances design readability and impact.",
            options: [
                "Contrast creates visual distinction through color, size, or style differences",
                "Contrast doesn't exist",
                "Contrast is automatic",
                "Contrast only matters for text"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between print and web design considerations?",
            options: [
                "Print uses CMYK, fixed size, high resolution; web uses RGB, responsive, screen resolution",
                "They are identical",
                "Only print exists",
                "Only web exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does color psychology influence design decisions?",
            options: [
                "Color psychology uses color associations to evoke emotions and influence behavior",
                "Color psychology doesn't exist",
                "Color psychology is automatic",
                "Color psychology only matters for art"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design systems and style guides?",
            options: [
                "Design systems ensure consistency across all brand touchpoints and applications",
                "Design systems don't exist",
                "Design systems are automatic",
                "Design systems slow design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how alignment creates visual order in design.",
            options: [
                "Alignment organizes elements along edges or axes for clean, professional appearance",
                "Alignment doesn't exist",
                "Alignment is automatic",
                "Alignment only matters for text"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between leading, kerning, and tracking in typography?",
            options: [
                "Leading is line spacing, kerning is letter spacing, tracking is word spacing",
                "They are identical",
                "Only leading exists",
                "Only kerning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does visual hierarchy guide user attention through design?",
            options: [
                "Visual hierarchy uses size, color, position to create order of importance",
                "Visual hierarchy doesn't exist",
                "Visual hierarchy is automatic",
                "Visual hierarchy only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mockups and prototypes in design workflow?",
            options: [
                "Mockups show final appearance, prototypes demonstrate functionality and interactions",
                "They are identical",
                "Only mockups exist",
                "Only prototypes exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how responsive design adapts to different screen sizes.",
            options: [
                "Responsive design uses flexible layouts and media queries to adapt to devices",
                "Responsive design doesn't exist",
                "Responsive design is automatic",
                "Responsive design only works for mobile"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between UI and UX design?",
            options: [
                "UI focuses on visual interface, UX focuses on user experience and usability",
                "They are identical",
                "Only UI exists",
                "Only UX exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does color accessibility affect design inclusivity?",
            options: [
                "Color accessibility ensures sufficient contrast and doesn't rely solely on color for information",
                "Color accessibility doesn't exist",
                "Color accessibility is automatic",
                "Color accessibility only matters for print"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design thinking methodology?",
            options: [
                "Design thinking uses human-centered approach to solve problems creatively",
                "Design thinking doesn't exist",
                "Design thinking is automatic",
                "Design thinking only matters for products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how gestalt principles guide visual perception in design.",
            options: [
                "Gestalt principles describe how humans perceive visual patterns and groupings",
                "Gestalt principles don't exist",
                "Gestalt principles are automatic",
                "Gestalt principles only matter for art"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between rasterization and vectorization?",
            options: [
                "Rasterization converts vectors to pixels, vectorization converts pixels to vectors",
                "They are identical",
                "Only rasterization exists",
                "Only vectorization exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does image resolution affect print quality?",
            options: [
                "Higher resolution (DPI/PPI) produces sharper print output, typically 300 DPI for print",
                "Resolution doesn't matter",
                "Resolution is automatic",
                "Resolution only matters for screen"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design critique and feedback?",
            options: [
                "Design critique improves work through constructive feedback and iteration",
                "Design critique doesn't exist",
                "Design critique is automatic",
                "Design critique slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how color harmony creates pleasing color combinations.",
            options: [
                "Color harmony uses color wheel relationships (complementary, analogous, triadic) for balance",
                "Color harmony doesn't exist",
                "Color harmony is automatic",
                "Color harmony only matters for art"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between bitmap and vector graphics editing?",
            options: [
                "Bitmap edits pixels directly, vector edits mathematical paths and shapes",
                "They are identical",
                "Only bitmap exists",
                "Only vector exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does design consistency build brand recognition?",
            options: [
                "Consistent design elements create memorable brand identity across touchpoints",
                "Consistency doesn't matter",
                "Consistency is automatic",
                "Consistency slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of wireframing in design process?",
            options: [
                "Wireframing creates structural layout without visual design to plan functionality",
                "Wireframing doesn't exist",
                "Wireframing is automatic",
                "Wireframing only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how typography pairing creates visual interest.",
            options: [
                "Typography pairing combines complementary fonts for hierarchy and contrast",
                "Typography pairing doesn't exist",
                "Typography pairing is automatic",
                "Typography pairing only matters for print"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between spot color and process color printing?",
            options: [
                "Spot color uses pre-mixed inks, process color uses CMYK combination",
                "They are identical",
                "Only spot color exists",
                "Only process color exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does design accessibility ensure inclusive user experience?",
            options: [
                "Accessibility ensures designs are usable by people with disabilities through contrast, sizing, alternatives",
                "Accessibility doesn't exist",
                "Accessibility is automatic",
                "Accessibility only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design research in the creative process?",
            options: [
                "Design research informs decisions through user insights, market analysis, and testing",
                "Design research doesn't exist",
                "Design research is automatic",
                "Design research slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how visual rhythm creates flow in design composition.",
            options: [
                "Visual rhythm uses repetition and pattern to guide eye movement through design",
                "Visual rhythm doesn't exist",
                "Visual rhythm is automatic",
                "Visual rhythm only matters for motion"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between design trends and timeless design?",
            options: [
                "Trends reflect current styles, timeless design focuses on enduring principles and functionality",
                "They are identical",
                "Only trends exist",
                "Only timeless exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does color temperature affect mood in design?",
            options: [
                "Warm colors (reds, oranges) feel energetic, cool colors (blues, greens) feel calm",
                "Color temperature doesn't exist",
                "Color temperature is automatic",
                "Color temperature only matters for photos"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design iteration and refinement?",
            options: [
                "Iteration improves designs through cycles of creation, feedback, and refinement",
                "Iteration doesn't exist",
                "Iteration is automatic",
                "Iteration slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how composition rules (rule of thirds, golden ratio) guide layout.",
            options: [
                "Composition rules provide mathematical guidelines for balanced, pleasing arrangements",
                "Composition rules don't exist",
                "Composition rules are automatic",
                "Composition rules only matter for photography"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between design mockup and design prototype?",
            options: [
                "Mockup shows static visual design, prototype demonstrates interactive functionality",
                "They are identical",
                "Only mockup exists",
                "Only prototype exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does design storytelling communicate brand narrative?",
            options: [
                "Design storytelling uses visual elements to convey brand story and connect emotionally",
                "Design storytelling doesn't exist",
                "Design storytelling is automatic",
                "Design storytelling only matters for advertising"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design asset management?",
            options: [
                "Asset management organizes and maintains design files for efficiency and consistency",
                "Asset management doesn't exist",
                "Asset management is automatic",
                "Asset management slows workflow"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how design scalability ensures consistency across applications.",
            options: [
                "Scalable design systems maintain quality and consistency as they expand to new uses",
                "Scalability doesn't exist",
                "Scalability is automatic",
                "Scalability only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between design aesthetics and design functionality?",
            options: [
                "Aesthetics focuses on visual appeal, functionality focuses on usability and purpose",
                "They are identical",
                "Only aesthetics exists",
                "Only functionality exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does design collaboration improve creative outcomes?",
            options: [
                "Collaboration brings diverse perspectives and skills to create better solutions",
                "Collaboration doesn't exist",
                "Collaboration is automatic",
                "Collaboration slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design version control?",
            options: [
                "Version control tracks design changes and enables collaboration without losing work",
                "Version control doesn't exist",
                "Version control is automatic",
                "Version control only matters for code"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Full Stack Developer": [
        {
            question: "What is the difference between server-side rendering (SSR) and client-side rendering (CSR)?",
            options: [
                "SSR renders HTML on server, CSR renders in browser; SSR better for SEO, CSR better for interactivity",
                "They are identical",
                "Only SSR exists",
                "Only CSR exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how microservices architecture differs from monolithic architecture.",
            options: [
                "Microservices split app into independent services, monolith is single deployable unit",
                "They are identical",
                "Only microservices exist",
                "Only monolith exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API gateway in microservices?",
            options: [
                "API gateway provides single entry point, routing, authentication, rate limiting for microservices",
                "API gateway doesn't exist",
                "API gateway only routes",
                "API gateway is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database connection pooling improve application performance?",
            options: [
                "Connection pooling reuses existing connections instead of creating new ones for each request",
                "Pooling doesn't improve performance",
                "Pooling creates more connections",
                "Pooling doesn't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between RESTful and GraphQL APIs?",
            options: [
                "REST uses multiple endpoints with fixed responses, GraphQL uses single endpoint with flexible queries",
                "They are identical",
                "Only REST exists",
                "Only GraphQL exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how JWT authentication works and its advantages over session-based auth.",
            options: [
                "JWT is stateless token with claims, stored client-side; advantages include scalability and statelessness",
                "JWT doesn't exist",
                "JWT is identical to sessions",
                "JWT is only for frontend"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database migrations in full-stack applications?",
            options: [
                "Migrations version database schema changes, enabling version control and rollback capabilities",
                "Migrations don't exist",
                "Migrations are automatic",
                "Migrations only work for SQL"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does caching work at different layers (browser, CDN, application, database)?",
            options: [
                "Browser caches resources, CDN caches static assets, application caches computed results, database caches queries",
                "They are identical",
                "Only browser cache exists",
                "Only database cache exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between horizontal and vertical scaling?",
            options: [
                "Horizontal adds more servers, vertical adds more resources to existing server",
                "They are identical",
                "Only horizontal exists",
                "Only vertical exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how load balancing distributes traffic across servers.",
            options: [
                "Load balancing uses algorithms (round-robin, least connections) to distribute requests across servers",
                "Load balancing doesn't exist",
                "Load balancing is automatic",
                "Load balancing only works for one server"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of message queues in distributed systems?",
            options: [
                "Message queues enable asynchronous processing, decoupling services and handling traffic spikes",
                "Message queues don't exist",
                "Message queues are automatic",
                "Message queues only work for email"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database replication ensure high availability?",
            options: [
                "Replication copies data to multiple servers, enabling failover and read scaling",
                "Replication doesn't exist",
                "Replication is automatic",
                "Replication only works for backups"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between SQL and NoSQL databases?",
            options: [
                "SQL is relational with ACID, NoSQL is flexible schema; SQL for structured, NoSQL for scale",
                "They are identical",
                "Only SQL exists",
                "Only NoSQL exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database sharding works and its challenges.",
            options: [
                "Sharding splits data across multiple databases; challenges include cross-shard queries and balancing",
                "Sharding doesn't exist",
                "Sharding has no challenges",
                "Sharding is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API versioning and common strategies?",
            options: [
                "Versioning maintains backward compatibility; strategies include URL, header, query parameter versioning",
                "Versioning doesn't exist",
                "Only one strategy exists",
                "Versioning is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database indexing improve query performance?",
            options: [
                "Indexes create data structures that speed up lookups but slow down writes and use storage",
                "Indexes don't improve performance",
                "Indexes only speed up writes",
                "Indexes don't exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between optimistic and pessimistic locking?",
            options: [
                "Optimistic assumes no conflicts and checks at commit, pessimistic locks immediately",
                "They are identical",
                "Only optimistic exists",
                "Only pessimistic exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database transactions ensure data consistency.",
            options: [
                "Transactions group operations with ACID properties ensuring all-or-nothing execution",
                "Transactions don't exist",
                "Transactions are automatic",
                "Transactions only work for reads"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of rate limiting in APIs?",
            options: [
                "Rate limiting prevents abuse by restricting requests per time period per client",
                "Rate limiting doesn't exist",
                "Rate limiting is automatic",
                "Rate limiting only works for authentication"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does CORS work and why is it necessary?",
            options: [
                "CORS allows cross-origin requests by setting headers; necessary for web security",
                "CORS doesn't exist",
                "CORS is automatic",
                "CORS only works for same origin"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between stateless and stateful APIs?",
            options: [
                "Stateless doesn't store client state, stateful maintains client state on server",
                "They are identical",
                "Only stateless exists",
                "Only stateful exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection management works in high-concurrency apps.",
            options: [
                "Connection pooling, limits, and timeout management handle concurrent connections efficiently",
                "Connections are unlimited",
                "Only pooling exists",
                "Connections are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API documentation?",
            options: [
                "API documentation explains endpoints, parameters, responses for developer integration",
                "Documentation doesn't exist",
                "Documentation is automatic",
                "Documentation only matters for internal APIs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database normalization reduce redundancy?",
            options: [
                "Normalization organizes data into tables to eliminate duplicate information",
                "Normalization doesn't exist",
                "Normalization increases redundancy",
                "Normalization is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between database views and materialized views?",
            options: [
                "Views are virtual tables, materialized views store computed results for performance",
                "They are identical",
                "Only views exist",
                "Only materialized views exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database triggers work and their use cases.",
            options: [
                "Triggers execute automatically on data changes; used for auditing, validation, denormalization",
                "Triggers don't exist",
                "Triggers are manual",
                "Triggers are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database stored procedures?",
            options: [
                "Stored procedures execute on database server, reducing network traffic and improving security",
                "Stored procedures don't exist",
                "Stored procedures are slower",
                "Stored procedures are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query optimization work?",
            options: [
                "Query optimizer analyzes queries and selects best execution plan using indexes and statistics",
                "Optimization doesn't exist",
                "Optimization is random",
                "Optimization is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between horizontal and vertical database partitioning?",
            options: [
                "Horizontal splits rows across tables, vertical splits columns across tables",
                "They are identical",
                "Only horizontal exists",
                "Only vertical exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database backup and recovery work.",
            options: [
                "Backups copy data periodically; recovery restores from backups with point-in-time recovery",
                "Backups don't exist",
                "Recovery doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database connection failover?",
            options: [
                "Failover automatically switches to backup database when primary fails",
                "Failover doesn't exist",
                "Failover is manual",
                "Failover is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database clustering differ from replication?",
            options: [
                "Clustering shares storage and resources, replication copies data to separate servers",
                "They are identical",
                "Only clustering exists",
                "Only replication exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database query result pagination?",
            options: [
                "Pagination limits result sets, improving performance and reducing memory usage",
                "Pagination doesn't exist",
                "Pagination is automatic",
                "Pagination slows queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database connection health checks work.",
            options: [
                "Health checks verify connection validity before use, removing dead connections from pool",
                "Health checks don't exist",
                "Health checks are automatic",
                "Health checks slow connections"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between hot and cold database backups?",
            options: [
                "Hot backups occur during operation, cold backups require database shutdown",
                "They are identical",
                "Only hot backups exist",
                "Only cold backups exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query result streaming work?",
            options: [
                "Streaming processes results incrementally, reducing memory usage for large result sets",
                "Streaming doesn't exist",
                "Streaming loads everything",
                "Streaming is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of API middleware?",
            options: [
                "Middleware processes requests/responses, enabling cross-cutting concerns like logging, auth",
                "Middleware doesn't exist",
                "Middleware is automatic",
                "Middleware only works for errors"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database read replicas improve performance.",
            options: [
                "Read replicas distribute read queries across multiple servers, reducing load on primary",
                "Read replicas don't exist",
                "Read replicas slow performance",
                "Read replicas are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between database connection pooling and connection multiplexing?",
            options: [
                "Pooling reuses connections, multiplexing shares single connection for multiple requests",
                "They are identical",
                "Only pooling exists",
                "Only multiplexing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query plan caching work?",
            options: [
                "Query plan cache stores execution plans, avoiding re-optimization for similar queries",
                "Query plan caching doesn't exist",
                "Query plan caching is automatic",
                "Query plan caching slows queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database connection timeout?",
            options: [
                "Connection timeout prevents indefinite waits, freeing resources from dead connections",
                "Connection timeout doesn't exist",
                "Connection timeout is automatic",
                "Connection timeout slows connections"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how database query result caching works.",
            options: [
                "Result cache stores query results, serving cached data for identical queries",
                "Result caching doesn't exist",
                "Result caching is automatic",
                "Result caching slows queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between database connection pooling and connection string encryption?",
            options: [
                "Pooling manages connections, encryption protects credentials in connection strings",
                "They are identical",
                "Only pooling exists",
                "Only encryption exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does database query result pagination prevent memory issues?",
            options: [
                "Pagination limits results per page, preventing loading entire result sets into memory",
                "Pagination doesn't exist",
                "Pagination loads everything",
                "Pagination is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of database connection retry mechanisms?",
            options: [
                "Retry mechanisms attempt reconnection with exponential backoff when connections fail",
                "Retry mechanisms don't exist",
                "Retry mechanisms are automatic",
                "Retry mechanisms slow connections"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "DevOps Engineer": [
        {
            question: "What is the difference between Kubernetes, Docker Swarm, and Apache Mesos?",
            options: [
                "Kubernetes provides comprehensive orchestration, Docker Swarm is simpler, Mesos offers two-level scheduling",
                "They are identical",
                "Only Kubernetes exists",
                "Only Docker Swarm exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Infrastructure as Code (IaC) improves DevOps practices.",
            options: [
                "IaC manages infrastructure through code, enabling version control, consistency, and automation",
                "IaC doesn't exist",
                "IaC is only for applications",
                "IaC is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between blue-green and canary deployments?",
            options: [
                "Blue-green switches entire traffic, canary gradually rolls out to subset of users",
                "They are identical",
                "Only blue-green exists",
                "Only canary exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does containerization differ from virtualization?",
            options: [
                "Containers share OS kernel, VMs have separate OS; containers lighter, VMs more isolated",
                "They are identical",
                "Only containers exist",
                "Only VMs exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of service mesh in microservices architecture?",
            options: [
                "Service mesh handles service-to-service communication, security, and observability",
                "Service mesh doesn't exist",
                "Service mesh is only for networking",
                "Service mesh is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how CI/CD pipelines automate software delivery.",
            options: [
                "CI/CD automates build, test, and deployment processes, reducing manual errors and time",
                "CI/CD doesn't exist",
                "CI/CD is only for testing",
                "CI/CD is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Docker and container runtimes (containerd, CRI-O)?",
            options: [
                "Docker includes runtime and tools, containerd/CRI-O are minimal runtimes for Kubernetes",
                "They are identical",
                "Only Docker exists",
                "Only containerd exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does Kubernetes horizontal pod autoscaling work?",
            options: [
                "HPA automatically scales pods based on CPU, memory, or custom metrics",
                "HPA doesn't exist",
                "HPA only scales manually",
                "HPA is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of GitOps in DevOps workflows?",
            options: [
                "GitOps uses Git as source of truth for infrastructure and application deployments",
                "GitOps doesn't exist",
                "GitOps is only for code",
                "GitOps is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how container image scanning improves security.",
            options: [
                "Image scanning detects vulnerabilities in container images before deployment",
                "Image scanning doesn't exist",
                "Image scanning is automatic",
                "Image scanning only works for Docker"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between stateful and stateless applications in Kubernetes?",
            options: [
                "Stateful apps require persistent storage and identity, stateless apps don't",
                "They are identical",
                "Only stateful exists",
                "Only stateless exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does Kubernetes service discovery work?",
            options: [
                "Kubernetes DNS provides service discovery through DNS names and service endpoints",
                "Service discovery doesn't exist",
                "Service discovery is manual",
                "Service discovery is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration in distributed systems?",
            options: [
                "Orchestration manages container lifecycle, scaling, networking, and health across clusters",
                "Orchestration doesn't exist",
                "Orchestration is only for single containers",
                "Orchestration is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes ConfigMaps and Secrets differ.",
            options: [
                "ConfigMaps store non-sensitive config, Secrets store sensitive data with encryption",
                "They are identical",
                "Only ConfigMaps exist",
                "Only Secrets exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Dockerfile and Docker Compose?",
            options: [
                "Dockerfile builds images, Docker Compose orchestrates multi-container applications",
                "They are identical",
                "Only Dockerfile exists",
                "Only Docker Compose exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does Kubernetes resource quotas and limits work?",
            options: [
                "Resource quotas limit namespace resources, limits restrict container resource usage",
                "They are identical",
                "Only quotas exist",
                "Only limits exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container registry in DevOps?",
            options: [
                "Container registry stores and distributes container images for deployment",
                "Container registry doesn't exist",
                "Container registry is only for Docker",
                "Container registry is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes deployments ensure high availability.",
            options: [
                "Deployments manage replica sets, ensuring desired number of pods are running",
                "Deployments don't exist",
                "Deployments are manual",
                "Deployments are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Kubernetes Jobs and CronJobs?",
            options: [
                "Jobs run once, CronJobs run on schedule; both complete and terminate",
                "They are identical",
                "Only Jobs exist",
                "Only CronJobs exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container networking work in Kubernetes?",
            options: [
                "Kubernetes networking uses CNI plugins to provide pod-to-pod and service networking",
                "Networking doesn't exist",
                "Networking is manual",
                "Networking is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of monitoring and observability in DevOps?",
            options: [
                "Monitoring tracks metrics, logs, and traces to ensure system health and performance",
                "Monitoring doesn't exist",
                "Monitoring is only for errors",
                "Monitoring is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes persistent volumes work.",
            options: [
                "Persistent volumes provide storage that survives pod restarts and deletions",
                "Persistent volumes don't exist",
                "Persistent volumes are temporary",
                "Persistent volumes are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Docker volumes and bind mounts?",
            options: [
                "Volumes are managed by Docker, bind mounts mount host directories directly",
                "They are identical",
                "Only volumes exist",
                "Only bind mounts exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does Kubernetes rolling updates work?",
            options: [
                "Rolling updates gradually replace old pods with new ones, maintaining availability",
                "Rolling updates don't exist",
                "Rolling updates are manual",
                "Rolling updates are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container health checks?",
            options: [
                "Health checks verify container status, enabling automatic restart of unhealthy containers",
                "Health checks don't exist",
                "Health checks are manual",
                "Health checks are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes namespaces provide resource isolation.",
            options: [
                "Namespaces create virtual clusters within physical cluster, isolating resources",
                "Namespaces don't exist",
                "Namespaces are only for organization",
                "Namespaces are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Docker Hub and private container registries?",
            options: [
                "Docker Hub is public, private registries provide security and control for proprietary images",
                "They are identical",
                "Only Docker Hub exists",
                "Only private registries exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container image layering optimize storage?",
            options: [
                "Image layers are cached and shared, reducing storage and build time",
                "Layering doesn't exist",
                "Layering increases storage",
                "Layering is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration scheduling?",
            options: [
                "Scheduling assigns containers to nodes based on resources, constraints, and policies",
                "Scheduling doesn't exist",
                "Scheduling is manual",
                "Scheduling is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes ingress controllers work.",
            options: [
                "Ingress controllers manage external access to services, providing load balancing and SSL",
                "Ingress controllers don't exist",
                "Ingress controllers are manual",
                "Ingress controllers are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between container runtime and container engine?",
            options: [
                "Runtime executes containers, engine includes runtime plus management tools",
                "They are identical",
                "Only runtime exists",
                "Only engine exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container image tagging work for versioning?",
            options: [
                "Tags label image versions, enabling version control and rollback capabilities",
                "Tagging doesn't exist",
                "Tagging is automatic",
                "Tagging only works for Docker"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container security scanning in CI/CD?",
            options: [
                "Security scanning detects vulnerabilities in images before deployment to production",
                "Security scanning doesn't exist",
                "Security scanning is manual",
                "Security scanning is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes cluster autoscaling works.",
            options: [
                "Cluster autoscaling adds/removes nodes based on resource demand and pod scheduling needs",
                "Cluster autoscaling doesn't exist",
                "Cluster autoscaling is manual",
                "Cluster autoscaling is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Docker build context and Dockerfile?",
            options: [
                "Build context is files sent to Docker daemon, Dockerfile contains build instructions",
                "They are identical",
                "Only build context exists",
                "Only Dockerfile exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container image optimization reduce size?",
            options: [
                "Optimization uses multi-stage builds, minimal base images, and layer caching",
                "Optimization doesn't exist",
                "Optimization increases size",
                "Optimization is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration service discovery?",
            options: [
                "Service discovery enables containers to find and communicate with each other dynamically",
                "Service discovery doesn't exist",
                "Service discovery is manual",
                "Service discovery is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes resource requests and limits work.",
            options: [
                "Requests guarantee minimum resources, limits cap maximum resources for containers",
                "They are identical",
                "Only requests exist",
                "Only limits exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between container orchestration and container management?",
            options: [
                "Orchestration manages multiple containers across nodes, management handles single containers",
                "They are identical",
                "Only orchestration exists",
                "Only management exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container image distribution work across clusters?",
            options: [
                "Images are pulled from registries to nodes when pods are scheduled",
                "Distribution doesn't exist",
                "Distribution is manual",
                "Distribution is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration load balancing?",
            options: [
                "Load balancing distributes traffic across container instances for high availability",
                "Load balancing doesn't exist",
                "Load balancing is manual",
                "Load balancing is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes pod disruption budgets work.",
            options: [
                "PDBs ensure minimum available pods during voluntary disruptions like updates",
                "PDBs don't exist",
                "PDBs are manual",
                "PDBs are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between container orchestration and serverless?",
            options: [
                "Orchestration manages containers, serverless abstracts infrastructure completely",
                "They are identical",
                "Only orchestration exists",
                "Only serverless exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container image vulnerability management work?",
            options: [
                "Vulnerability management scans images, tracks CVEs, and updates base images",
                "Vulnerability management doesn't exist",
                "Vulnerability management is manual",
                "Vulnerability management is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration networking policies?",
            options: [
                "Network policies control pod-to-pod communication for security and isolation",
                "Network policies don't exist",
                "Network policies are manual",
                "Network policies are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Kubernetes stateful sets manage stateful applications.",
            options: [
                "StatefulSets provide stable network identities and ordered deployment for stateful apps",
                "StatefulSets don't exist",
                "StatefulSets are manual",
                "StatefulSets are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between container orchestration and container platforms?",
            options: [
                "Orchestration manages containers, platforms provide complete container ecosystem",
                "They are identical",
                "Only orchestration exists",
                "Only platforms exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does container image signing ensure authenticity?",
            options: [
                "Image signing uses cryptographic signatures to verify image integrity and source",
                "Image signing doesn't exist",
                "Image signing is manual",
                "Image signing is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of container orchestration service meshes?",
            options: [
                "Service meshes provide observability, security, and traffic management for microservices",
                "Service meshes don't exist",
                "Service meshes are manual",
                "Service meshes are automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Mobile App Developer": [
        {
            question: "What is the difference between native and cross-platform mobile development?",
            options: [
                "Native uses platform-specific languages (Swift/Kotlin), cross-platform uses shared codebase (React Native/Flutter); native better performance, cross-platform faster development",
                "They are identical",
                "Only native exists",
                "Only cross-platform exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how React Native bridges JavaScript and native code.",
            options: [
                "React Native bridge translates JavaScript calls to native modules, enabling cross-platform development",
                "Bridge doesn't exist",
                "Bridge is automatic",
                "Bridge only works for iOS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between Flutter and React Native?",
            options: [
                "Flutter uses Dart and compiles to native, React Native uses JavaScript with bridge; Flutter better performance, React Native larger ecosystem",
                "They are identical",
                "Only Flutter exists",
                "Only React Native exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app state management work in complex applications?",
            options: [
                "State management (Redux, MobX, Provider) centralizes app state for predictable updates",
                "State management doesn't exist",
                "State management is automatic",
                "State management only works for simple apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app performance optimization?",
            options: [
                "Performance optimization improves app speed, battery usage, and user experience",
                "Optimization doesn't exist",
                "Optimization is automatic",
                "Optimization only matters for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app navigation works in different frameworks.",
            options: [
                "Navigation manages screen transitions; React Navigation for React Native, Navigator for Flutter",
                "Navigation doesn't exist",
                "Navigation is automatic",
                "Navigation only works for web"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app testing strategies?",
            options: [
                "Unit tests test logic, integration tests test flows, E2E tests test complete user journeys",
                "They are identical",
                "Only unit tests exist",
                "Only E2E tests exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app offline functionality work?",
            options: [
                "Offline functionality uses local storage, sync mechanisms, and cached data for offline access",
                "Offline functionality doesn't exist",
                "Offline functionality is automatic",
                "Offline functionality only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app push notifications?",
            options: [
                "Push notifications engage users with timely updates and messages when app is closed",
                "Push notifications don't exist",
                "Push notifications are automatic",
                "Push notifications only work for iOS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app deep linking works.",
            options: [
                "Deep linking opens specific app screens from URLs, enabling seamless navigation",
                "Deep linking doesn't exist",
                "Deep linking is automatic",
                "Deep linking only works for web"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app build configurations (debug, release)?",
            options: [
                "Debug includes debugging tools, release is optimized for production with minification",
                "They are identical",
                "Only debug exists",
                "Only release exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app memory management work?",
            options: [
                "Memory management prevents leaks through proper lifecycle handling and resource cleanup",
                "Memory management doesn't exist",
                "Memory management is automatic",
                "Memory management only matters for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app analytics and crash reporting?",
            options: [
                "Analytics track user behavior, crash reporting identifies and fixes app errors",
                "Analytics don't exist",
                "Crash reporting doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app security works (certificate pinning, encryption).",
            options: [
                "Security uses certificate pinning, data encryption, and secure storage to protect user data",
                "Security doesn't exist",
                "Security is automatic",
                "Security only matters for banking apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app architectures (MVC, MVVM, Clean)?",
            options: [
                "MVC separates model/view/controller, MVVM uses view models, Clean separates business logic",
                "They are identical",
                "Only MVC exists",
                "Only MVVM exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app dependency injection work?",
            options: [
                "Dependency injection provides dependencies externally, improving testability and modularity",
                "Dependency injection doesn't exist",
                "Dependency injection is automatic",
                "Dependency injection only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app code splitting and lazy loading?",
            options: [
                "Code splitting reduces initial bundle size, lazy loading loads components on demand",
                "They don't exist",
                "They are automatic",
                "They only work for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app background processing works.",
            options: [
                "Background processing runs tasks when app is inactive, with platform-specific limitations",
                "Background processing doesn't exist",
                "Background processing is automatic",
                "Background processing only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app local and remote data storage?",
            options: [
                "Local storage (SQLite, AsyncStorage) is on-device, remote storage (APIs) is server-based",
                "They are identical",
                "Only local exists",
                "Only remote exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app gesture handling work?",
            options: [
                "Gesture handling recognizes touch patterns (swipe, pinch, tap) for user interactions",
                "Gesture handling doesn't exist",
                "Gesture handling is automatic",
                "Gesture handling only works for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app accessibility features?",
            options: [
                "Accessibility enables apps for users with disabilities through screen readers and assistive tech",
                "Accessibility doesn't exist",
                "Accessibility is automatic",
                "Accessibility only matters for iOS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app versioning and updates work.",
            options: [
                "Versioning tracks app versions, updates distribute new features through app stores",
                "Versioning doesn't exist",
                "Updates are automatic",
                "Versioning only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app hot reload and live reload?",
            options: [
                "Hot reload updates UI without losing state, live reload restarts app completely",
                "They are identical",
                "Only hot reload exists",
                "Only live reload exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app image optimization work?",
            options: [
                "Image optimization reduces file size through compression, caching, and lazy loading",
                "Image optimization doesn't exist",
                "Image optimization is automatic",
                "Image optimization only matters for photo apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app error boundaries?",
            options: [
                "Error boundaries catch and handle errors, preventing app crashes and improving UX",
                "Error boundaries don't exist",
                "Error boundaries are automatic",
                "Error boundaries only work for React Native"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app platform-specific code works.",
            options: [
                "Platform-specific code uses conditional logic or native modules for iOS/Android differences",
                "Platform-specific code doesn't exist",
                "Platform-specific code is automatic",
                "Platform-specific code only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app synchronous and asynchronous operations?",
            options: [
                "Synchronous blocks execution, asynchronous uses callbacks/promises for non-blocking operations",
                "They are identical",
                "Only synchronous exists",
                "Only asynchronous exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app network request handling work?",
            options: [
                "Network requests use HTTP clients with error handling, retries, and caching strategies",
                "Network requests don't exist",
                "Network requests are automatic",
                "Network requests only work for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app performance monitoring?",
            options: [
                "Performance monitoring tracks metrics (FPS, memory, network) to identify bottlenecks",
                "Performance monitoring doesn't exist",
                "Performance monitoring is automatic",
                "Performance monitoring only matters for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app biometric authentication works.",
            options: [
                "Biometric auth uses fingerprint/face recognition APIs for secure user authentication",
                "Biometric auth doesn't exist",
                "Biometric auth is automatic",
                "Biometric auth only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app development and mobile web development?",
            options: [
                "Mobile apps are native/compiled, mobile web uses responsive web design in browsers",
                "They are identical",
                "Only mobile apps exist",
                "Only mobile web exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app state persistence work?",
            options: [
                "State persistence saves app state to storage, restoring it when app restarts",
                "State persistence doesn't exist",
                "State persistence is automatic",
                "State persistence only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app code obfuscation?",
            options: [
                "Code obfuscation makes code harder to reverse engineer, protecting intellectual property",
                "Code obfuscation doesn't exist",
                "Code obfuscation is automatic",
                "Code obfuscation only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app widget development works.",
            options: [
                "Widgets display app information on home screen, using platform-specific widget APIs",
                "Widgets don't exist",
                "Widgets are automatic",
                "Widgets only work for iOS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app foreground and background execution?",
            options: [
                "Foreground has full resources, background has limited resources and time constraints",
                "They are identical",
                "Only foreground exists",
                "Only background exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app location services work?",
            options: [
                "Location services use GPS/network location APIs with permission handling and accuracy settings",
                "Location services don't exist",
                "Location services are automatic",
                "Location services only work for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app A/B testing?",
            options: [
                "A/B testing compares app variations to optimize user experience and conversion",
                "A/B testing doesn't exist",
                "A/B testing is automatic",
                "A/B testing only works for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app in-app purchases work.",
            options: [
                "In-app purchases use platform payment APIs (StoreKit/Google Play Billing) for monetization",
                "In-app purchases don't exist",
                "In-app purchases are automatic",
                "In-app purchases only work for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app development and mobile game development?",
            options: [
                "App development focuses on UI/UX, game development focuses on graphics, physics, and gameplay",
                "They are identical",
                "Only app development exists",
                "Only game development exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app camera integration work?",
            options: [
                "Camera integration uses platform APIs to capture photos/videos with permission handling",
                "Camera integration doesn't exist",
                "Camera integration is automatic",
                "Camera integration only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app crash reporting and error tracking?",
            options: [
                "Crash reporting captures errors and stack traces, enabling quick bug fixes",
                "Crash reporting doesn't exist",
                "Crash reporting is automatic",
                "Crash reporting only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app database integration works (SQLite, Realm).",
            options: [
                "Database integration uses local databases (SQLite, Realm) for structured data storage",
                "Database integration doesn't exist",
                "Database integration is automatic",
                "Database integration only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app development and PWA development?",
            options: [
                "Mobile apps are installed, PWAs are web apps with app-like features and offline support",
                "They are identical",
                "Only mobile apps exist",
                "Only PWAs exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app animation and transitions work?",
            options: [
                "Animations use platform animation APIs (Animated, Lottie) for smooth UI transitions",
                "Animations don't exist",
                "Animations are automatic",
                "Animations only work for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app continuous integration and deployment?",
            options: [
                "CI/CD automates building, testing, and deploying mobile apps to app stores",
                "CI/CD doesn't exist",
                "CI/CD is automatic",
                "CI/CD only works for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how mobile app memory profiling works.",
            options: [
                "Memory profiling identifies memory leaks and optimization opportunities using profiling tools",
                "Memory profiling doesn't exist",
                "Memory profiling is automatic",
                "Memory profiling only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between mobile app development and hybrid app development?",
            options: [
                "Native uses platform languages, hybrid uses web technologies wrapped in native container",
                "They are identical",
                "Only native exists",
                "Only hybrid exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile app cloud integration work?",
            options: [
                "Cloud integration connects apps to cloud services (Firebase, AWS) for backend functionality",
                "Cloud integration doesn't exist",
                "Cloud integration is automatic",
                "Cloud integration only works for native apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of mobile app localization and internationalization?",
            options: [
                "Localization adapts app for regions, internationalization prepares app for multiple languages",
                "Localization doesn't exist",
                "Internationalization doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "UX/UI Designer": [
        {
            question: "What is the difference between user experience and user interface design?",
            options: [
                "UX focuses on overall experience and usability, UI focuses on visual design and interaction",
                "They are identical",
                "Only UX exists",
                "Only UI exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how information architecture organizes content for users.",
            options: [
                "Information architecture structures content hierarchically for intuitive navigation",
                "Information architecture doesn't exist",
                "Information architecture is automatic",
                "Information architecture only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of user personas in UX design?",
            options: [
                "Personas represent target users, guiding design decisions based on user needs",
                "Personas don't exist",
                "Personas are automatic",
                "Personas only matter for marketing"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does usability testing improve product design?",
            options: [
                "Usability testing identifies user pain points and validates design assumptions",
                "Usability testing doesn't exist",
                "Usability testing is automatic",
                "Usability testing only matters for apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between wireframing and prototyping?",
            options: [
                "Wireframes show structure, prototypes demonstrate interactions and functionality",
                "They are identical",
                "Only wireframes exist",
                "Only prototypes exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how design systems ensure consistency across products.",
            options: [
                "Design systems provide reusable components and guidelines for consistent UI",
                "Design systems don't exist",
                "Design systems are automatic",
                "Design systems only matter for large teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of accessibility in UX/UI design?",
            options: [
                "Accessibility ensures designs are usable by people with disabilities",
                "Accessibility doesn't exist",
                "Accessibility is automatic",
                "Accessibility only matters for government sites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does user journey mapping improve UX?",
            options: [
                "Journey mapping visualizes user experience across touchpoints, identifying pain points",
                "Journey mapping doesn't exist",
                "Journey mapping is automatic",
                "Journey mapping only matters for e-commerce"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between responsive and adaptive design?",
            options: [
                "Responsive uses fluid layouts, adaptive uses fixed breakpoints for different devices",
                "They are identical",
                "Only responsive exists",
                "Only adaptive exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how micro-interactions enhance user experience.",
            options: [
                "Micro-interactions provide feedback and delight through small, meaningful animations",
                "Micro-interactions don't exist",
                "Micro-interactions are automatic",
                "Micro-interactions only matter for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of A/B testing in UX design?",
            options: [
                "A/B testing compares design variations to optimize user experience",
                "A/B testing doesn't exist",
                "A/B testing is automatic",
                "A/B testing only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cognitive load affect interface design?",
            options: [
                "High cognitive load overwhelms users; design should minimize mental effort",
                "Cognitive load doesn't exist",
                "Cognitive load is automatic",
                "Cognitive load only matters for complex apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between skeuomorphic and flat design?",
            options: [
                "Skeuomorphic mimics real objects, flat design uses minimal, abstract elements",
                "They are identical",
                "Only skeuomorphic exists",
                "Only flat exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how color psychology influences design decisions.",
            options: [
                "Color psychology uses color associations to evoke emotions and guide behavior",
                "Color psychology doesn't exist",
                "Color psychology is automatic",
                "Color psychology only matters for art"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design thinking methodology?",
            options: [
                "Design thinking uses human-centered approach to solve problems creatively",
                "Design thinking doesn't exist",
                "Design thinking is automatic",
                "Design thinking only matters for products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does visual hierarchy guide user attention?",
            options: [
                "Visual hierarchy uses size, color, position to create order of importance",
                "Visual hierarchy doesn't exist",
                "Visual hierarchy is automatic",
                "Visual hierarchy only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between usability and user experience?",
            options: [
                "Usability measures ease of use, UX encompasses entire user experience",
                "They are identical",
                "Only usability exists",
                "Only UX exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how gestalt principles guide visual perception.",
            options: [
                "Gestalt principles describe how humans perceive visual patterns and groupings",
                "Gestalt principles don't exist",
                "Gestalt principles are automatic",
                "Gestalt principles only matter for art"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design patterns in UI development?",
            options: [
                "Design patterns provide reusable solutions to common interface problems",
                "Design patterns don't exist",
                "Design patterns are automatic",
                "Design patterns only matter for developers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does progressive disclosure improve interface usability?",
            options: [
                "Progressive disclosure shows information gradually, reducing cognitive load",
                "Progressive disclosure doesn't exist",
                "Progressive disclosure is automatic",
                "Progressive disclosure only matters for complex apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between task flow and user flow?",
            options: [
                "Task flow shows single task completion, user flow shows multiple paths and decisions",
                "They are identical",
                "Only task flow exists",
                "Only user flow exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how error handling improves user experience.",
            options: [
                "Error handling provides clear messages and recovery paths when things go wrong",
                "Error handling doesn't exist",
                "Error handling is automatic",
                "Error handling only matters for forms"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design tokens in design systems?",
            options: [
                "Design tokens store design values (colors, spacing) for consistency",
                "Design tokens don't exist",
                "Design tokens are automatic",
                "Design tokens only matter for developers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does mobile-first design approach work?",
            options: [
                "Mobile-first designs for small screens first, then enhances for larger screens",
                "Mobile-first doesn't exist",
                "Mobile-first is automatic",
                "Mobile-first only matters for mobile apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between affordance and signifiers in UI?",
            options: [
                "Affordance is action possibility, signifiers indicate affordance to users",
                "They are identical",
                "Only affordance exists",
                "Only signifiers exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how Fitts's Law affects interface design.",
            options: [
                "Fitts's Law states larger, closer targets are easier to click, affecting button placement",
                "Fitts's Law doesn't exist",
                "Fitts's Law is automatic",
                "Fitts's Law only matters for touch screens"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design critique in UX process?",
            options: [
                "Design critique improves work through constructive feedback and iteration",
                "Design critique doesn't exist",
                "Design critique is automatic",
                "Design critique slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does dark mode affect user experience?",
            options: [
                "Dark mode reduces eye strain in low light and can save battery on OLED screens",
                "Dark mode doesn't exist",
                "Dark mode is automatic",
                "Dark mode only matters for apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between heuristic evaluation and user testing?",
            options: [
                "Heuristic evaluation uses expert review, user testing involves actual users",
                "They are identical",
                "Only heuristic exists",
                "Only user testing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how content strategy supports UX design.",
            options: [
                "Content strategy ensures content supports user goals and business objectives",
                "Content strategy doesn't exist",
                "Content strategy is automatic",
                "Content strategy only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design handoff in design-to-development workflow?",
            options: [
                "Design handoff provides specifications and assets for developers to implement",
                "Design handoff doesn't exist",
                "Design handoff is automatic",
                "Design handoff only matters for large teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does emotional design influence user behavior?",
            options: [
                "Emotional design creates positive feelings, building user loyalty and engagement",
                "Emotional design doesn't exist",
                "Emotional design is automatic",
                "Emotional design only matters for consumer apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between quantitative and qualitative UX research?",
            options: [
                "Quantitative uses numbers/metrics, qualitative uses observations/interviews",
                "They are identical",
                "Only quantitative exists",
                "Only qualitative exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how design systems scale across products and teams.",
            options: [
                "Design systems maintain consistency and efficiency as products and teams grow",
                "Design systems don't scale",
                "Design systems are automatic",
                "Design systems only work for small teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of user feedback loops in UX design?",
            options: [
                "Feedback loops collect user input to continuously improve product experience",
                "Feedback loops don't exist",
                "Feedback loops are automatic",
                "Feedback loops only matter for apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does accessibility compliance (WCAG) affect design decisions?",
            options: [
                "WCAG guidelines ensure designs are accessible to users with disabilities",
                "WCAG doesn't exist",
                "WCAG is automatic",
                "WCAG only matters for government sites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between UI design and visual design?",
            options: [
                "UI design focuses on interface structure, visual design focuses on aesthetics",
                "They are identical",
                "Only UI exists",
                "Only visual exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how design iteration improves product quality.",
            options: [
                "Iteration refines designs through cycles of creation, testing, and improvement",
                "Iteration doesn't exist",
                "Iteration is automatic",
                "Iteration slows design"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design documentation?",
            options: [
                "Documentation preserves design decisions and guides implementation",
                "Documentation doesn't exist",
                "Documentation is automatic",
                "Documentation only matters for large teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does user onboarding affect product adoption?",
            options: [
                "Effective onboarding guides users to value, improving retention and satisfaction",
                "Onboarding doesn't exist",
                "Onboarding is automatic",
                "Onboarding only matters for complex apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between design mockup and design prototype?",
            options: [
                "Mockup shows static visual design, prototype demonstrates interactive functionality",
                "They are identical",
                "Only mockup exists",
                "Only prototype exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how design thinking empathize phase works.",
            options: [
                "Empathize phase involves understanding users' needs through research and observation",
                "Empathize doesn't exist",
                "Empathize is automatic",
                "Empathize only matters for consumer products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design system component libraries?",
            options: [
                "Component libraries provide reusable UI elements for consistent implementation",
                "Component libraries don't exist",
                "Component libraries are automatic",
                "Component libraries only matter for developers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does responsive typography improve readability?",
            options: [
                "Responsive typography adapts size and spacing for optimal reading across devices",
                "Responsive typography doesn't exist",
                "Responsive typography is automatic",
                "Responsive typography only matters for mobile"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between user testing and usability testing?",
            options: [
                "User testing is broader, usability testing focuses specifically on ease of use",
                "They are identical",
                "Only user testing exists",
                "Only usability testing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how design patterns solve common UI problems.",
            options: [
                "Design patterns provide proven solutions to recurring interface challenges",
                "Design patterns don't exist",
                "Design patterns are automatic",
                "Design patterns only matter for complex apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design system governance?",
            options: [
                "Governance ensures design system consistency and quality across organization",
                "Governance doesn't exist",
                "Governance is automatic",
                "Governance only matters for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does empty state design improve user experience?",
            options: [
                "Empty states guide users when content is missing, reducing confusion",
                "Empty states don't exist",
                "Empty states are automatic",
                "Empty states only matter for new users"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between design system and style guide?",
            options: [
                "Design system includes components and code, style guide focuses on visual guidelines",
                "They are identical",
                "Only design system exists",
                "Only style guide exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how user research informs design decisions.",
            options: [
                "User research provides insights about user needs, informing design choices",
                "User research doesn't exist",
                "User research is automatic",
                "User research only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of design system versioning?",
            options: [
                "Versioning tracks design system changes, enabling controlled updates",
                "Versioning doesn't exist",
                "Versioning is automatic",
                "Versioning only matters for large teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Cloud Solutions Architect": [
        {
            question: "What is the difference between IaaS, PaaS, and SaaS?",
            options: [
                "IaaS provides infrastructure, PaaS provides platform, SaaS provides software; different levels of abstraction",
                "They are identical",
                "Only IaaS exists",
                "Only SaaS exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud elasticity differs from scalability.",
            options: [
                "Elasticity automatically adjusts resources, scalability is ability to handle growth",
                "They are identical",
                "Only elasticity exists",
                "Only scalability exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud regions and availability zones?",
            options: [
                "Regions are geographic areas, availability zones are isolated data centers within regions for redundancy",
                "They are identical",
                "Only regions exist",
                "Only availability zones exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud load balancing distribute traffic?",
            options: [
                "Load balancing distributes requests across multiple servers for high availability",
                "Load balancing doesn't exist",
                "Load balancing is automatic",
                "Load balancing only works for one server"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between public, private, and hybrid cloud?",
            options: [
                "Public cloud is shared, private is dedicated, hybrid combines both",
                "They are identical",
                "Only public exists",
                "Only private exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud auto-scaling works.",
            options: [
                "Auto-scaling automatically adjusts resources based on demand metrics",
                "Auto-scaling doesn't exist",
                "Auto-scaling is manual",
                "Auto-scaling is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud CDN (Content Delivery Network)?",
            options: [
                "CDN caches content at edge locations, reducing latency and bandwidth",
                "CDN doesn't exist",
                "CDN is automatic",
                "CDN only works for static content"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud disaster recovery work?",
            options: [
                "Disaster recovery replicates data and systems to backup locations for business continuity",
                "Disaster recovery doesn't exist",
                "Disaster recovery is automatic",
                "Disaster recovery only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud storage types (object, block, file)?",
            options: [
                "Object storage for unstructured data, block for databases, file for shared storage",
                "They are identical",
                "Only object exists",
                "Only block exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud serverless computing works.",
            options: [
                "Serverless runs code without managing servers, scaling automatically and charging per execution",
                "Serverless doesn't exist",
                "Serverless is automatic",
                "Serverless only works for simple functions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud networking (VPC, subnets, security groups)?",
            options: [
                "Cloud networking provides isolated networks, subnets, and firewall rules for security",
                "Cloud networking doesn't exist",
                "Cloud networking is automatic",
                "Cloud networking only works for public clouds"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud database as a service (DBaaS) work?",
            options: [
                "DBaaS provides managed databases with automated backups, scaling, and maintenance",
                "DBaaS doesn't exist",
                "DBaaS is automatic",
                "DBaaS only works for SQL databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud migration strategies (lift-and-shift, refactor)?",
            options: [
                "Lift-and-shift moves apps unchanged, refactor optimizes for cloud-native features",
                "They are identical",
                "Only lift-and-shift exists",
                "Only refactor exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud monitoring and observability work.",
            options: [
                "Cloud monitoring tracks metrics, logs, and traces for system health and performance",
                "Cloud monitoring doesn't exist",
                "Cloud monitoring is automatic",
                "Cloud monitoring only works for applications"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud identity and access management (IAM)?",
            options: [
                "IAM controls who can access cloud resources and what actions they can perform",
                "IAM doesn't exist",
                "IAM is automatic",
                "IAM only works for users"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud container orchestration work?",
            options: [
                "Container orchestration manages container lifecycle, scaling, and networking across clusters",
                "Container orchestration doesn't exist",
                "Container orchestration is automatic",
                "Container orchestration only works for Docker"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud reserved instances and spot instances?",
            options: [
                "Reserved instances provide discounts for commitment, spot instances use spare capacity at lower cost",
                "They are identical",
                "Only reserved exists",
                "Only spot exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud multi-tenancy works.",
            options: [
                "Multi-tenancy allows multiple customers to share infrastructure while maintaining isolation",
                "Multi-tenancy doesn't exist",
                "Multi-tenancy is automatic",
                "Multi-tenancy only works for SaaS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud API gateways?",
            options: [
                "API gateways provide single entry point, routing, authentication, and rate limiting",
                "API gateways don't exist",
                "API gateways are automatic",
                "API gateways only work for REST APIs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud data encryption work (at rest and in transit)?",
            options: [
                "Encryption at rest protects stored data, encryption in transit protects data during transmission",
                "They are identical",
                "Only at rest exists",
                "Only in transit exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud managed services and unmanaged services?",
            options: [
                "Managed services handle operations automatically, unmanaged require manual management",
                "They are identical",
                "Only managed exists",
                "Only unmanaged exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud cost optimization works.",
            options: [
                "Cost optimization uses right-sizing, reserved instances, and resource scheduling to reduce costs",
                "Cost optimization doesn't exist",
                "Cost optimization is automatic",
                "Cost optimization only works for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud infrastructure as code (IaC)?",
            options: [
                "IaC manages infrastructure through code, enabling version control and automation",
                "IaC doesn't exist",
                "IaC is automatic",
                "IaC only works for networking"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud event-driven architecture work?",
            options: [
                "Event-driven architecture uses events to trigger functions, enabling decoupled, scalable systems",
                "Event-driven architecture doesn't exist",
                "Event-driven architecture is automatic",
                "Event-driven architecture only works for serverless"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud cold storage and hot storage?",
            options: [
                "Cold storage is cheaper for infrequent access, hot storage is faster for frequent access",
                "They are identical",
                "Only cold exists",
                "Only hot exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud microservices architecture works.",
            options: [
                "Microservices split applications into independent services, enabling independent scaling and deployment",
                "Microservices don't exist",
                "Microservices are automatic",
                "Microservices only work for small apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud service mesh?",
            options: [
                "Service mesh provides observability, security, and traffic management for microservices",
                "Service mesh doesn't exist",
                "Service mesh is automatic",
                "Service mesh only works for Kubernetes"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud backup and restore work?",
            options: [
                "Cloud backup copies data to cloud storage, restore recovers data from backups",
                "Cloud backup doesn't exist",
                "Cloud restore doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud horizontal and vertical scaling?",
            options: [
                "Horizontal adds more instances, vertical increases instance size; horizontal preferred for cloud",
                "They are identical",
                "Only horizontal exists",
                "Only vertical exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud compliance and governance work.",
            options: [
                "Compliance ensures adherence to regulations, governance enforces policies and controls",
                "They are identical",
                "Only compliance exists",
                "Only governance exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud edge computing?",
            options: [
                "Edge computing processes data closer to users, reducing latency and bandwidth",
                "Edge computing doesn't exist",
                "Edge computing is automatic",
                "Edge computing only works for IoT"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud database replication work?",
            options: [
                "Database replication copies data to multiple locations for availability and performance",
                "Database replication doesn't exist",
                "Database replication is automatic",
                "Database replication only works for SQL"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud synchronous and asynchronous processing?",
            options: [
                "Synchronous blocks until complete, asynchronous continues without waiting",
                "They are identical",
                "Only synchronous exists",
                "Only asynchronous exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud message queues work.",
            options: [
                "Message queues enable asynchronous communication between services, decoupling producers and consumers",
                "Message queues don't exist",
                "Message queues are automatic",
                "Message queues only work for email"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud function as a service (FaaS)?",
            options: [
                "FaaS runs code without managing servers, scaling automatically and charging per execution",
                "FaaS doesn't exist",
                "FaaS is automatic",
                "FaaS only works for simple functions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud data lake architecture work?",
            options: [
                "Data lake stores raw data in any format, enabling analytics and machine learning",
                "Data lake doesn't exist",
                "Data lake is automatic",
                "Data lake only works for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud blue-green and canary deployments?",
            options: [
                "Blue-green switches entire traffic, canary gradually rolls out to subset of users",
                "They are identical",
                "Only blue-green exists",
                "Only canary exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud infrastructure monitoring works.",
            options: [
                "Infrastructure monitoring tracks resource usage, performance, and health of cloud resources",
                "Infrastructure monitoring doesn't exist",
                "Infrastructure monitoring is automatic",
                "Infrastructure monitoring only works for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud resource tagging?",
            options: [
                "Resource tagging organizes and tracks cloud resources for cost allocation and management",
                "Resource tagging doesn't exist",
                "Resource tagging is automatic",
                "Resource tagging only works for EC2"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud data warehousing work?",
            options: [
                "Data warehousing stores structured data optimized for analytics and business intelligence",
                "Data warehousing doesn't exist",
                "Data warehousing is automatic",
                "Data warehousing only works for SQL"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud public IP and private IP?",
            options: [
                "Public IP is internet-accessible, private IP is internal-only for security",
                "They are identical",
                "Only public exists",
                "Only private exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud serverless architecture scales.",
            options: [
                "Serverless scales automatically from zero to thousands of concurrent executions",
                "Serverless doesn't scale",
                "Serverless scaling is manual",
                "Serverless scaling is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud disaster recovery planning?",
            options: [
                "DR planning ensures business continuity through backup strategies and recovery procedures",
                "DR planning doesn't exist",
                "DR planning is automatic",
                "DR planning only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud data archiving work?",
            options: [
                "Data archiving moves infrequently accessed data to cheaper storage tiers",
                "Data archiving doesn't exist",
                "Data archiving is automatic",
                "Data archiving only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud managed Kubernetes and self-managed?",
            options: [
                "Managed Kubernetes handles control plane, self-managed requires managing everything",
                "They are identical",
                "Only managed exists",
                "Only self-managed exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud infrastructure automation works.",
            options: [
                "Infrastructure automation uses scripts and tools to provision and manage resources programmatically",
                "Infrastructure automation doesn't exist",
                "Infrastructure automation is automatic",
                "Infrastructure automation only works for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud security groups and network ACLs?",
            options: [
                "Security groups control instance-level traffic, network ACLs control subnet-level traffic",
                "They are identical",
                "Only security groups exist",
                "Only network ACLs exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud data streaming work?",
            options: [
                "Data streaming processes data in real-time as it arrives, enabling real-time analytics",
                "Data streaming doesn't exist",
                "Data streaming is automatic",
                "Data streaming only works for logs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud object storage and block storage?",
            options: [
                "Object storage for unstructured data, block storage for databases and file systems",
                "They are identical",
                "Only object exists",
                "Only block exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud multi-region deployment works.",
            options: [
                "Multi-region deployment replicates applications across regions for global availability",
                "Multi-region deployment doesn't exist",
                "Multi-region deployment is automatic",
                "Multi-region deployment only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud cost allocation tags?",
            options: [
                "Cost allocation tags track spending by department, project, or environment",
                "Cost allocation tags don't exist",
                "Cost allocation tags are automatic",
                "Cost allocation tags only work for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud infrastructure provisioning work?",
            options: [
                "Infrastructure provisioning creates and configures cloud resources automatically",
                "Infrastructure provisioning doesn't exist",
                "Infrastructure provisioning is manual",
                "Infrastructure provisioning is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud serverless and container-based architectures?",
            options: [
                "Serverless abstracts infrastructure completely, containers provide more control and portability",
                "They are identical",
                "Only serverless exists",
                "Only containers exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud data governance works.",
            options: [
                "Data governance ensures data quality, security, and compliance across cloud resources",
                "Data governance doesn't exist",
                "Data governance is automatic",
                "Data governance only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cloud infrastructure as code tools (Terraform, CloudFormation)?",
            options: [
                "IaC tools define infrastructure in code, enabling version control and repeatable deployments",
                "IaC tools don't exist",
                "IaC tools are automatic",
                "IaC tools only work for networking"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does cloud auto-healing work?",
            options: [
                "Auto-healing automatically replaces unhealthy instances to maintain availability",
                "Auto-healing doesn't exist",
                "Auto-healing is manual",
                "Auto-healing is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between cloud cold, warm, and hot data tiers?",
            options: [
                "Cold for archival, warm for occasional access, hot for frequent access; different costs and speeds",
                "They are identical",
                "Only cold exists",
                "Only hot exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how cloud infrastructure resilience works.",
            options: [
                "Infrastructure resilience uses redundancy, failover, and disaster recovery for high availability",
                "Infrastructure resilience doesn't exist",
                "Infrastructure resilience is automatic",
                "Infrastructure resilience only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Cybersecurity Specialist": [
        {
            question: "What is the difference between encryption and hashing?",
            options: [
                "Encryption is reversible, hashing is one-way; encryption for confidentiality, hashing for integrity",
                "They are identical",
                "Only encryption exists",
                "Only hashing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how symmetric and asymmetric encryption differ.",
            options: [
                "Symmetric uses same key for encryption/decryption, asymmetric uses public/private key pairs",
                "They are identical",
                "Only symmetric exists",
                "Only asymmetric exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of digital signatures in cybersecurity?",
            options: [
                "Digital signatures verify message authenticity and integrity using asymmetric cryptography",
                "Digital signatures don't exist",
                "Digital signatures are automatic",
                "Digital signatures only work for emails"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does public key infrastructure (PKI) work?",
            options: [
                "PKI manages digital certificates and keys, enabling secure communication and authentication",
                "PKI doesn't exist",
                "PKI is automatic",
                "PKI only works for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between authentication and authorization?",
            options: [
                "Authentication verifies identity, authorization determines access permissions",
                "They are identical",
                "Only authentication exists",
                "Only authorization exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how multi-factor authentication (MFA) enhances security.",
            options: [
                "MFA requires multiple authentication factors, significantly reducing unauthorized access risk",
                "MFA doesn't exist",
                "MFA is automatic",
                "MFA only works for passwords"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of intrusion detection systems (IDS)?",
            options: [
                "IDS monitors network traffic for suspicious activity and potential security breaches",
                "IDS doesn't exist",
                "IDS is automatic",
                "IDS only works for firewalls"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does penetration testing differ from vulnerability scanning?",
            options: [
                "Penetration testing simulates attacks, vulnerability scanning identifies potential weaknesses",
                "They are identical",
                "Only penetration testing exists",
                "Only vulnerability scanning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between SQL injection and XSS attacks?",
            options: [
                "SQL injection targets databases, XSS injects malicious scripts into web pages",
                "They are identical",
                "Only SQL injection exists",
                "Only XSS exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how firewall rules control network traffic.",
            options: [
                "Firewall rules allow or block traffic based on source, destination, port, and protocol",
                "Firewall rules don't exist",
                "Firewall rules are automatic",
                "Firewall rules only work for HTTP"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security information and event management (SIEM)?",
            options: [
                "SIEM collects and analyzes security logs to detect and respond to threats",
                "SIEM doesn't exist",
                "SIEM is automatic",
                "SIEM only works for networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does zero-trust security model work?",
            options: [
                "Zero-trust assumes no trust, verifying every access request regardless of location",
                "Zero-trust doesn't exist",
                "Zero-trust is automatic",
                "Zero-trust only works for cloud"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between vulnerability assessment and risk assessment?",
            options: [
                "Vulnerability assessment identifies weaknesses, risk assessment evaluates business impact",
                "They are identical",
                "Only vulnerability assessment exists",
                "Only risk assessment exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how certificate pinning enhances mobile app security.",
            options: [
                "Certificate pinning hardcodes trusted certificates, preventing man-in-the-middle attacks",
                "Certificate pinning doesn't exist",
                "Certificate pinning is automatic",
                "Certificate pinning only works for iOS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security incident response procedures?",
            options: [
                "Incident response procedures guide actions during security breaches to minimize damage",
                "Incident response doesn't exist",
                "Incident response is automatic",
                "Incident response only works for malware"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data loss prevention (DLP) work?",
            options: [
                "DLP monitors and prevents unauthorized data access, transmission, or exfiltration",
                "DLP doesn't exist",
                "DLP is automatic",
                "DLP only works for emails"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between network segmentation and micro-segmentation?",
            options: [
                "Network segmentation divides networks, micro-segmentation isolates individual workloads",
                "They are identical",
                "Only network segmentation exists",
                "Only micro-segmentation exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security orchestration, automation, and response (SOAR) works.",
            options: [
                "SOAR automates security operations, orchestrating tools and responses to threats",
                "SOAR doesn't exist",
                "SOAR is automatic",
                "SOAR only works for SIEM"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security awareness training?",
            options: [
                "Security training educates users about threats and best practices to prevent breaches",
                "Security training doesn't exist",
                "Security training is automatic",
                "Security training only matters for IT staff"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does endpoint detection and response (EDR) work?",
            options: [
                "EDR monitors endpoints for threats, providing detection and response capabilities",
                "EDR doesn't exist",
                "EDR is automatic",
                "EDR only works for Windows"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between threat intelligence and threat hunting?",
            options: [
                "Threat intelligence provides information about threats, threat hunting actively searches for threats",
                "They are identical",
                "Only threat intelligence exists",
                "Only threat hunting exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how secure coding practices prevent vulnerabilities.",
            options: [
                "Secure coding uses best practices, input validation, and security frameworks to prevent flaws",
                "Secure coding doesn't exist",
                "Secure coding is automatic",
                "Secure coding only matters for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security compliance frameworks (ISO 27001, NIST)?",
            options: [
                "Compliance frameworks provide standards and controls for information security management",
                "Compliance frameworks don't exist",
                "Compliance frameworks are automatic",
                "Compliance frameworks only matter for government"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security patch management work?",
            options: [
                "Patch management identifies, tests, and deploys security updates to fix vulnerabilities",
                "Patch management doesn't exist",
                "Patch management is automatic",
                "Patch management only works for operating systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between white-box and black-box security testing?",
            options: [
                "White-box has full system knowledge, black-box tests without internal knowledge",
                "They are identical",
                "Only white-box exists",
                "Only black-box exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security tokenization protects sensitive data.",
            options: [
                "Tokenization replaces sensitive data with tokens, reducing exposure of actual data",
                "Tokenization doesn't exist",
                "Tokenization is automatic",
                "Tokenization only works for credit cards"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security access control lists (ACLs)?",
            options: [
                "ACLs define permissions for resources, controlling who can access what",
                "ACLs don't exist",
                "ACLs are automatic",
                "ACLs only work for files"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security encryption key management work?",
            options: [
                "Key management generates, stores, rotates, and revokes encryption keys securely",
                "Key management doesn't exist",
                "Key management is automatic",
                "Key management only works for symmetric encryption"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security threat and vulnerability?",
            options: [
                "Threat is potential danger, vulnerability is weakness that could be exploited",
                "They are identical",
                "Only threat exists",
                "Only vulnerability exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security sandboxing isolates untrusted code.",
            options: [
                "Sandboxing runs code in isolated environment, preventing access to system resources",
                "Sandboxing doesn't exist",
                "Sandboxing is automatic",
                "Sandboxing only works for browsers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security audit logs?",
            options: [
                "Audit logs record security events for compliance, forensics, and threat detection",
                "Audit logs don't exist",
                "Audit logs are automatic",
                "Audit logs only work for authentication"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security web application firewall (WAF) work?",
            options: [
                "WAF filters HTTP traffic, protecting web applications from attacks",
                "WAF doesn't exist",
                "WAF is automatic",
                "WAF only works for SQL injection"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security encryption at rest and in transit?",
            options: [
                "Encryption at rest protects stored data, encryption in transit protects data during transmission",
                "They are identical",
                "Only at rest exists",
                "Only in transit exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security privilege escalation attacks work.",
            options: [
                "Privilege escalation exploits vulnerabilities to gain higher access levels",
                "Privilege escalation doesn't exist",
                "Privilege escalation is automatic",
                "Privilege escalation only works for Windows"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security security operations center (SOC)?",
            options: [
                "SOC monitors and responds to security threats 24/7, coordinating incident response",
                "SOC doesn't exist",
                "SOC is automatic",
                "SOC only works for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security behavioral analytics detect threats?",
            options: [
                "Behavioral analytics identifies anomalies in user behavior that may indicate threats",
                "Behavioral analytics doesn't exist",
                "Behavioral analytics is automatic",
                "Behavioral analytics only works for networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security denial of service (DoS) and distributed DoS (DDoS)?",
            options: [
                "DoS comes from single source, DDoS comes from multiple sources simultaneously",
                "They are identical",
                "Only DoS exists",
                "Only DDoS exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security secure software development lifecycle (SDLC) works.",
            options: [
                "Secure SDLC integrates security practices throughout development process",
                "Secure SDLC doesn't exist",
                "Secure SDLC is automatic",
                "Secure SDLC only matters for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security identity and access management (IAM)?",
            options: [
                "IAM manages user identities and access permissions across systems",
                "IAM doesn't exist",
                "IAM is automatic",
                "IAM only works for cloud"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security network intrusion prevention system (IPS) work?",
            options: [
                "IPS actively blocks malicious traffic, preventing attacks before they reach targets",
                "IPS doesn't exist",
                "IPS is automatic",
                "IPS only works for firewalls"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security vulnerability and exploit?",
            options: [
                "Vulnerability is weakness, exploit is code that takes advantage of vulnerability",
                "They are identical",
                "Only vulnerability exists",
                "Only exploit exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security secure boot process works.",
            options: [
                "Secure boot verifies firmware and OS integrity before system startup",
                "Secure boot doesn't exist",
                "Secure boot is automatic",
                "Secure boot only works for UEFI"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security data classification?",
            options: [
                "Data classification categorizes data by sensitivity, applying appropriate security controls",
                "Data classification doesn't exist",
                "Data classification is automatic",
                "Data classification only works for documents"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security threat modeling work?",
            options: [
                "Threat modeling identifies potential threats and vulnerabilities in system design",
                "Threat modeling doesn't exist",
                "Threat modeling is automatic",
                "Threat modeling only matters for new systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security security policy and security procedure?",
            options: [
                "Policy defines what to do, procedure defines how to do it",
                "They are identical",
                "Only policy exists",
                "Only procedure exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security secure coding standards (OWASP) prevent vulnerabilities.",
            options: [
                "Secure coding standards provide guidelines to prevent common security flaws",
                "Secure coding standards don't exist",
                "Secure coding standards are automatic",
                "Secure coding standards only matter for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security security awareness programs?",
            options: [
                "Security awareness educates users about threats and security best practices",
                "Security awareness doesn't exist",
                "Security awareness is automatic",
                "Security awareness only matters for IT staff"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security network traffic analysis detect threats?",
            options: [
                "Traffic analysis examines network packets to identify malicious patterns and anomalies",
                "Traffic analysis doesn't exist",
                "Traffic analysis is automatic",
                "Traffic analysis only works for HTTP"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security security control and security countermeasure?",
            options: [
                "Control is preventive measure, countermeasure is response to specific threat",
                "They are identical",
                "Only control exists",
                "Only countermeasure exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security secure communication protocols (TLS/SSL) work.",
            options: [
                "TLS/SSL encrypts data in transit, ensuring secure communication between parties",
                "TLS/SSL doesn't exist",
                "TLS/SSL is automatic",
                "TLS/SSL only works for HTTPS"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security security risk assessment?",
            options: [
                "Risk assessment evaluates threats and vulnerabilities to determine security priorities",
                "Risk assessment doesn't exist",
                "Risk assessment is automatic",
                "Risk assessment only matters for new systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security security information sharing work?",
            options: [
                "Security information sharing enables organizations to share threat intelligence",
                "Security information sharing doesn't exist",
                "Security information sharing is automatic",
                "Security information sharing only works for government"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between security security incident and security event?",
            options: [
                "Event is any occurrence, incident is event that compromises security",
                "They are identical",
                "Only event exists",
                "Only incident exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how security secure development practices prevent vulnerabilities.",
            options: [
                "Secure development uses code reviews, testing, and security tools throughout lifecycle",
                "Secure development doesn't exist",
                "Secure development is automatic",
                "Secure development only matters for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of security security architecture?",
            options: [
                "Security architecture designs systems with security built-in from the start",
                "Security architecture doesn't exist",
                "Security architecture is automatic",
                "Security architecture only matters for networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security security monitoring and alerting work?",
            options: [
                "Security monitoring tracks systems for threats, alerting when suspicious activity detected",
                "Security monitoring doesn't exist",
                "Security monitoring is automatic",
                "Security monitoring only works for networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Quality Assurance (QA) Engineer": [
        {
            question: "What is the difference between unit testing and integration testing?",
            options: [
                "Unit testing tests individual components, integration testing tests component interactions",
                "They are identical",
                "Only unit testing exists",
                "Only integration testing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test-driven development (TDD) works.",
            options: [
                "TDD writes tests before code, ensuring code meets requirements and is testable",
                "TDD doesn't exist",
                "TDD is automatic",
                "TDD only works for simple functions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test coverage metrics?",
            options: [
                "Test coverage measures percentage of code executed by tests, indicating test thoroughness",
                "Test coverage doesn't exist",
                "Test coverage is automatic",
                "Test coverage only matters for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does behavior-driven development (BDD) differ from TDD?",
            options: [
                "BDD uses natural language specifications, TDD uses code-level tests",
                "They are identical",
                "Only BDD exists",
                "Only TDD exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between functional and non-functional testing?",
            options: [
                "Functional tests verify features work, non-functional tests verify performance, security, usability",
                "They are identical",
                "Only functional exists",
                "Only non-functional exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how regression testing prevents bugs.",
            options: [
                "Regression testing verifies existing functionality still works after changes",
                "Regression testing doesn't exist",
                "Regression testing is automatic",
                "Regression testing only matters for new features"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test automation frameworks?",
            options: [
                "Test frameworks provide structure and tools for writing and executing automated tests",
                "Test frameworks don't exist",
                "Test frameworks are automatic",
                "Test frameworks only work for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does performance testing work?",
            options: [
                "Performance testing measures system speed, scalability, and resource usage under load",
                "Performance testing doesn't exist",
                "Performance testing is automatic",
                "Performance testing only matters for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between smoke testing and sanity testing?",
            options: [
                "Smoke testing verifies basic functionality, sanity testing verifies specific fixes work",
                "They are identical",
                "Only smoke testing exists",
                "Only sanity testing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test data management works.",
            options: [
                "Test data management creates, maintains, and cleanses data for testing scenarios",
                "Test data management doesn't exist",
                "Test data management is automatic",
                "Test data management only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test case design techniques?",
            options: [
                "Test design techniques (equivalence partitioning, boundary value) ensure comprehensive testing",
                "Test design techniques don't exist",
                "Test design techniques are automatic",
                "Test design techniques only matter for manual testing"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does continuous testing work in CI/CD pipelines?",
            options: [
                "Continuous testing runs automated tests at every code change, ensuring quality gates",
                "Continuous testing doesn't exist",
                "Continuous testing is automatic",
                "Continuous testing only works for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between positive and negative testing?",
            options: [
                "Positive testing verifies expected behavior, negative testing verifies error handling",
                "They are identical",
                "Only positive exists",
                "Only negative exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test stubs and mocks work.",
            options: [
                "Stubs provide minimal implementations, mocks verify interactions with dependencies",
                "They are identical",
                "Only stubs exist",
                "Only mocks exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test reporting and metrics?",
            options: [
                "Test reporting tracks test results and metrics to measure quality and progress",
                "Test reporting doesn't exist",
                "Test reporting is automatic",
                "Test reporting only matters for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does security testing work?",
            options: [
                "Security testing identifies vulnerabilities and ensures applications are secure",
                "Security testing doesn't exist",
                "Security testing is automatic",
                "Security testing only matters for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between alpha and beta testing?",
            options: [
                "Alpha testing is internal, beta testing involves external users before release",
                "They are identical",
                "Only alpha exists",
                "Only beta exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test environment management works.",
            options: [
                "Environment management maintains test environments that mirror production",
                "Environment management doesn't exist",
                "Environment management is automatic",
                "Environment management only works for cloud"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test planning and strategy?",
            options: [
                "Test planning defines scope, approach, and resources for testing activities",
                "Test planning doesn't exist",
                "Test planning is automatic",
                "Test planning only matters for large projects"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does load testing differ from stress testing?",
            options: [
                "Load testing uses expected load, stress testing exceeds capacity to find breaking points",
                "They are identical",
                "Only load testing exists",
                "Only stress testing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between manual and automated testing?",
            options: [
                "Manual testing is human-executed, automated testing uses scripts and tools",
                "They are identical",
                "Only manual exists",
                "Only automated exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test defect management works.",
            options: [
                "Defect management tracks, prioritizes, and resolves bugs found during testing",
                "Defect management doesn't exist",
                "Defect management is automatic",
                "Defect management only works for critical bugs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test traceability?",
            options: [
                "Test traceability links tests to requirements, ensuring coverage and compliance",
                "Test traceability doesn't exist",
                "Test traceability is automatic",
                "Test traceability only matters for regulated industries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does API testing work?",
            options: [
                "API testing verifies API functionality, performance, and integration",
                "API testing doesn't exist",
                "API testing is automatic",
                "API testing only works for REST APIs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test execution and test design?",
            options: [
                "Test design creates test cases, test execution runs tests and reports results",
                "They are identical",
                "Only test design exists",
                "Only test execution exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test data privacy and security work.",
            options: [
                "Test data security protects sensitive data used in testing, ensuring compliance",
                "Test data security doesn't exist",
                "Test data security is automatic",
                "Test data security only matters for production data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test metrics and KPIs?",
            options: [
                "Test metrics measure testing effectiveness, quality, and efficiency",
                "Test metrics don't exist",
                "Test metrics are automatic",
                "Test metrics only matter for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does exploratory testing work?",
            options: [
                "Exploratory testing simultaneously designs and executes tests, learning the system",
                "Exploratory testing doesn't exist",
                "Exploratory testing is automatic",
                "Exploratory testing only works for manual testing"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test pyramid and test ice cream cone?",
            options: [
                "Test pyramid emphasizes unit tests, ice cream cone emphasizes UI tests",
                "They are identical",
                "Only test pyramid exists",
                "Only test ice cream cone exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test parallelization improves efficiency.",
            options: [
                "Test parallelization runs multiple tests simultaneously, reducing execution time",
                "Test parallelization doesn't exist",
                "Test parallelization is automatic",
                "Test parallelization only works for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test maintenance?",
            options: [
                "Test maintenance updates tests as code changes, keeping tests relevant and passing",
                "Test maintenance doesn't exist",
                "Test maintenance is automatic",
                "Test maintenance only matters for automated tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does accessibility testing work?",
            options: [
                "Accessibility testing ensures applications are usable by people with disabilities",
                "Accessibility testing doesn't exist",
                "Accessibility testing is automatic",
                "Accessibility testing only matters for government sites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test validation and verification?",
            options: [
                "Verification checks if built correctly, validation checks if right product built",
                "They are identical",
                "Only verification exists",
                "Only validation exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test risk-based testing works.",
            options: [
                "Risk-based testing prioritizes testing based on business impact and likelihood of failure",
                "Risk-based testing doesn't exist",
                "Risk-based testing is automatic",
                "Risk-based testing only matters for large projects"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test data masking?",
            options: [
                "Test data masking anonymizes sensitive data for safe testing use",
                "Test data masking doesn't exist",
                "Test data masking is automatic",
                "Test data masking only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does test-driven design (TDD) improve code quality?",
            options: [
                "TDD forces better design, testability, and prevents over-engineering",
                "TDD doesn't improve quality",
                "TDD is automatic",
                "TDD only works for simple functions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test script and test scenario?",
            options: [
                "Test script is detailed steps, test scenario is high-level user journey",
                "They are identical",
                "Only test script exists",
                "Only test scenario exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test flakiness affects reliability.",
            options: [
                "Flaky tests pass/fail inconsistently, reducing trust and wasting time",
                "Test flakiness doesn't exist",
                "Test flakiness is automatic",
                "Test flakiness only matters for UI tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test code review?",
            options: [
                "Test code review ensures test quality, maintainability, and best practices",
                "Test code review doesn't exist",
                "Test code review is automatic",
                "Test code review only matters for automated tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does test-driven bug fixing work?",
            options: [
                "Test-driven bug fixing writes test that reproduces bug, then fixes code",
                "Test-driven bug fixing doesn't exist",
                "Test-driven bug fixing is automatic",
                "Test-driven bug fixing only works for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test isolation and test dependencies?",
            options: [
                "Test isolation ensures tests don't affect each other, dependencies create coupling",
                "They are identical",
                "Only test isolation exists",
                "Only test dependencies exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test data generation works.",
            options: [
                "Test data generation creates realistic test data automatically for various scenarios",
                "Test data generation doesn't exist",
                "Test data generation is automatic",
                "Test data generation only works for simple data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test documentation?",
            options: [
                "Test documentation records test plans, cases, and results for traceability",
                "Test documentation doesn't exist",
                "Test documentation is automatic",
                "Test documentation only matters for manual testing"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does test-driven refactoring work?",
            options: [
                "Test-driven refactoring uses tests as safety net when improving code structure",
                "Test-driven refactoring doesn't exist",
                "Test-driven refactoring is automatic",
                "Test-driven refactoring only works for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test assertion and test expectation?",
            options: [
                "Assertion checks condition, expectation defines what should happen",
                "They are identical",
                "Only assertion exists",
                "Only expectation exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test continuous improvement works.",
            options: [
                "Continuous improvement analyzes test results and processes to enhance quality",
                "Continuous improvement doesn't exist",
                "Continuous improvement is automatic",
                "Continuous improvement only matters for large teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test quality gates?",
            options: [
                "Quality gates enforce minimum test requirements before code can be merged",
                "Quality gates don't exist",
                "Quality gates are automatic",
                "Quality gates only work for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does test-driven acceptance criteria work?",
            options: [
                "Acceptance criteria define testable requirements, enabling test-driven development",
                "Acceptance criteria don't exist",
                "Acceptance criteria are automatic",
                "Acceptance criteria only matter for user stories"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between test false positives and false negatives?",
            options: [
                "False positive is test fails when should pass, false negative is test passes when should fail",
                "They are identical",
                "Only false positives exist",
                "Only false negatives exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how test-driven bug prevention works.",
            options: [
                "Test-driven development prevents bugs by catching issues early in development cycle",
                "Test-driven bug prevention doesn't exist",
                "Test-driven bug prevention is automatic",
                "Test-driven bug prevention only works for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of test performance benchmarking?",
            options: [
                "Performance benchmarking establishes baseline metrics for performance testing",
                "Performance benchmarking doesn't exist",
                "Performance benchmarking is automatic",
                "Performance benchmarking only matters for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does test-driven documentation work?",
            options: [
                "Tests serve as executable documentation, showing how code should behave",
                "Test-driven documentation doesn't exist",
                "Test-driven documentation is automatic",
                "Test-driven documentation only works for unit tests"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Artificial Intelligence (AI) Engineer": [
        {
            question: "What is the difference between machine learning and deep learning?",
            options: [
                "Deep learning uses neural networks with multiple layers, machine learning includes broader algorithms",
                "They are identical",
                "Only machine learning exists",
                "Only deep learning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural networks learn through backpropagation.",
            options: [
                "Backpropagation calculates gradients and updates weights using chain rule",
                "Backpropagation doesn't exist",
                "Backpropagation is only forward",
                "Backpropagation is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of activation functions in neural networks?",
            options: [
                "Activation functions introduce non-linearity, enabling networks to learn complex patterns",
                "Activation functions don't exist",
                "Activation functions are automatic",
                "Activation functions only work for output layers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does gradient descent optimize neural network training?",
            options: [
                "Gradient descent minimizes loss by following gradient direction to find optimal weights",
                "Gradient descent doesn't exist",
                "Gradient descent is automatic",
                "Gradient descent only works for linear models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between supervised and unsupervised learning?",
            options: [
                "Supervised uses labeled data, unsupervised finds patterns in unlabeled data",
                "They are identical",
                "Only supervised exists",
                "Only unsupervised exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how convolutional neural networks (CNN) work for image processing.",
            options: [
                "CNNs use convolutional layers to detect spatial patterns and features in images",
                "CNNs don't exist",
                "CNNs only work for text",
                "CNNs are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of regularization in machine learning?",
            options: [
                "Regularization prevents overfitting by penalizing complex models",
                "Regularization doesn't exist",
                "Regularization is automatic",
                "Regularization only works for neural networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does recurrent neural networks (RNN) handle sequential data?",
            options: [
                "RNNs maintain hidden state to process sequences with temporal dependencies",
                "RNNs don't exist",
                "RNNs only work for images",
                "RNNs are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between LSTM and GRU in recurrent networks?",
            options: [
                "LSTM has separate forget/input/output gates, GRU combines gates for simpler architecture",
                "They are identical",
                "Only LSTM exists",
                "Only GRU exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how transfer learning works in deep learning.",
            options: [
                "Transfer learning uses pre-trained models on new tasks, leveraging learned features",
                "Transfer learning doesn't exist",
                "Transfer learning is automatic",
                "Transfer learning only works for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of dropout regularization in neural networks?",
            options: [
                "Dropout randomly deactivates neurons during training to prevent overfitting",
                "Dropout doesn't exist",
                "Dropout is automatic",
                "Dropout speeds up training"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does attention mechanism work in transformer models?",
            options: [
                "Attention mechanisms weight input features to focus on relevant parts for predictions",
                "Attention doesn't exist",
                "Attention is automatic",
                "Attention only works for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between batch normalization and layer normalization?",
            options: [
                "Batch normalization normalizes across batch, layer normalization normalizes across features",
                "They are identical",
                "Only batch normalization exists",
                "Only layer normalization exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how reinforcement learning differs from supervised learning.",
            options: [
                "Reinforcement learning learns from rewards/penalties through interaction, supervised learns from labeled examples",
                "They are identical",
                "Only reinforcement learning exists",
                "Only supervised learning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of hyperparameter tuning in machine learning?",
            options: [
                "Hyperparameter tuning optimizes model parameters not learned during training",
                "Hyperparameter tuning doesn't exist",
                "Hyperparameter tuning is automatic",
                "Hyperparameter tuning slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does ensemble learning improve model performance?",
            options: [
                "Ensemble learning combines multiple models, reducing variance and improving accuracy",
                "Ensemble learning doesn't exist",
                "Ensemble learning is automatic",
                "Ensemble learning only works for classification"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between bias and variance in machine learning?",
            options: [
                "Bias is error from oversimplification, variance is error from sensitivity to training data",
                "They are identical",
                "Only bias exists",
                "Only variance exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how generative adversarial networks (GANs) work.",
            options: [
                "GANs use generator and discriminator networks competing to create realistic data",
                "GANs don't exist",
                "GANs are automatic",
                "GANs only work for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature engineering in machine learning?",
            options: [
                "Feature engineering creates/transforms features to improve model performance",
                "Feature engineering doesn't exist",
                "Feature engineering is automatic",
                "Feature engineering slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does natural language processing (NLP) handle text data?",
            options: [
                "NLP uses techniques like tokenization, embeddings, and language models to process text",
                "NLP doesn't exist",
                "NLP only works for numbers",
                "NLP is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between word embeddings and one-hot encoding?",
            options: [
                "Word embeddings capture semantic relationships, one-hot encoding is sparse binary vectors",
                "They are identical",
                "Only word embeddings exist",
                "Only one-hot encoding exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how transformer architecture revolutionized NLP.",
            options: [
                "Transformers use self-attention to process sequences in parallel, enabling better context understanding",
                "Transformers don't exist",
                "Transformers are automatic",
                "Transformers only work for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of early stopping in neural network training?",
            options: [
                "Early stopping prevents overfitting by stopping when validation performance stops improving",
                "Early stopping doesn't exist",
                "Early stopping is automatic",
                "Early stopping slows training"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does batch normalization improve neural network training?",
            options: [
                "Batch normalization normalizes layer inputs, stabilizing training and allowing higher learning rates",
                "Batch normalization doesn't exist",
                "Batch normalization is automatic",
                "Batch normalization slows training"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between precision and recall in classification?",
            options: [
                "Precision measures true positives / (true positives + false positives), recall measures true positives / (true positives + false negatives)",
                "They are identical",
                "Only precision exists",
                "Only recall exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how gradient boosting works and its advantages.",
            options: [
                "Gradient boosting sequentially adds models that correct previous errors, often achieving high accuracy",
                "Gradient boosting doesn't exist",
                "Gradient boosting is automatic",
                "Gradient boosting is slow"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of cross-validation in model evaluation?",
            options: [
                "Cross-validation splits data into folds to assess model performance on unseen data",
                "Cross-validation doesn't exist",
                "Cross-validation is automatic",
                "Cross-validation only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does reinforcement learning Q-learning algorithm work?",
            options: [
                "Q-learning learns optimal action-value function through exploration and exploitation",
                "Q-learning doesn't exist",
                "Q-learning is automatic",
                "Q-learning only works for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between overfitting and underfitting?",
            options: [
                "Overfitting learns training data too well, underfitting fails to capture patterns",
                "They are identical",
                "Only overfitting exists",
                "Only underfitting exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how principal component analysis (PCA) works for dimensionality reduction.",
            options: [
                "PCA finds orthogonal directions of maximum variance, reducing dimensions while preserving information",
                "PCA doesn't exist",
                "PCA only increases dimensions",
                "PCA is automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of learning rate in neural network training?",
            options: [
                "Learning rate controls step size in gradient descent, affecting convergence speed and stability",
                "Learning rate doesn't exist",
                "Learning rate is automatic",
                "Learning rate only works for SGD"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does support vector machines (SVM) work and kernel trick?",
            options: [
                "SVM finds optimal hyperplane; kernel trick maps data to higher dimensions for non-linear separation",
                "SVM doesn't exist",
                "Kernel trick doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between bagging and boosting ensemble methods?",
            options: [
                "Bagging trains models in parallel, boosting trains sequentially with error correction",
                "They are identical",
                "Only bagging exists",
                "Only boosting exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how autoencoders work for unsupervised learning.",
            options: [
                "Autoencoders compress and reconstruct data, learning efficient representations",
                "Autoencoders don't exist",
                "Autoencoders are automatic",
                "Autoencoders only work for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data augmentation in deep learning?",
            options: [
                "Data augmentation creates variations of training data to improve generalization",
                "Data augmentation doesn't exist",
                "Data augmentation is automatic",
                "Data augmentation only works for images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does reinforcement learning policy gradient methods work?",
            options: [
                "Policy gradient methods optimize policy directly using gradient ascent on expected reward",
                "Policy gradient doesn't exist",
                "Policy gradient is automatic",
                "Policy gradient only works for discrete actions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between classification and regression problems?",
            options: [
                "Classification predicts categories, regression predicts continuous values",
                "They are identical",
                "Only classification exists",
                "Only regression exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how random forest differs from decision trees.",
            options: [
                "Random forest combines multiple trees with bootstrapping and feature randomness",
                "They are identical",
                "Only random forest exists",
                "Only decision tree exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of feature selection in machine learning?",
            options: [
                "Feature selection chooses relevant features to reduce dimensionality and improve performance",
                "Feature selection doesn't exist",
                "Feature selection is automatic",
                "Feature selection slows models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does neural network weight initialization affect training?",
            options: [
                "Proper weight initialization prevents vanishing/exploding gradients, improving convergence",
                "Weight initialization doesn't matter",
                "Weight initialization is automatic",
                "Weight initialization only works for small networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between training, validation, and test sets?",
            options: [
                "Training set trains model, validation set tunes hyperparameters, test set evaluates final performance",
                "They are identical",
                "Only training set exists",
                "Only test set exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how BERT and GPT models work for NLP.",
            options: [
                "BERT uses bidirectional context, GPT uses autoregressive generation; both use transformer architecture",
                "They are identical",
                "Only BERT exists",
                "Only GPT exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model interpretability in AI?",
            options: [
                "Model interpretability explains model decisions, important for trust and debugging",
                "Model interpretability doesn't exist",
                "Model interpretability is automatic",
                "Model interpretability only matters for simple models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does federated learning work?",
            options: [
                "Federated learning trains models across distributed devices without sharing raw data",
                "Federated learning doesn't exist",
                "Federated learning is automatic",
                "Federated learning only works for mobile devices"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between parametric and non-parametric models?",
            options: [
                "Parametric models assume fixed parameters, non-parametric adapt to data complexity",
                "They are identical",
                "Only parametric exists",
                "Only non-parametric exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how reinforcement learning exploration vs exploitation tradeoff works.",
            options: [
                "Exploration tries new actions, exploitation uses known best actions; balance needed for learning",
                "They are identical",
                "Only exploration exists",
                "Only exploitation exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model versioning and MLOps?",
            options: [
                "Model versioning tracks model iterations, MLOps automates ML lifecycle",
                "Model versioning doesn't exist",
                "MLOps doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does computer vision object detection work?",
            options: [
                "Object detection identifies and locates objects in images using bounding boxes",
                "Object detection doesn't exist",
                "Object detection is automatic",
                "Object detection only works for simple images"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between supervised, unsupervised, and semi-supervised learning?",
            options: [
                "Supervised uses labeled data, unsupervised uses unlabeled, semi-supervised uses both",
                "They are identical",
                "Only supervised exists",
                "Only unsupervised exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural network architecture search (NAS) works.",
            options: [
                "NAS automatically finds optimal network architectures using search algorithms",
                "NAS doesn't exist",
                "NAS is automatic",
                "NAS only works for small networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model compression and quantization?",
            options: [
                "Model compression reduces model size and inference time for deployment",
                "Model compression doesn't exist",
                "Model compression is automatic",
                "Model compression only works for small models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does reinforcement learning actor-critic methods work?",
            options: [
                "Actor-critic combines policy (actor) and value function (critic) for better learning",
                "Actor-critic doesn't exist",
                "Actor-critic is automatic",
                "Actor-critic only works for discrete actions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between discriminative and generative models?",
            options: [
                "Discriminative models classify, generative models create new data samples",
                "They are identical",
                "Only discriminative exists",
                "Only generative exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how few-shot learning works.",
            options: [
                "Few-shot learning learns from very few examples using meta-learning or transfer learning",
                "Few-shot learning doesn't exist",
                "Few-shot learning is automatic",
                "Few-shot learning only works for simple tasks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model monitoring and drift detection?",
            options: [
                "Model monitoring tracks performance, drift detection identifies when data distribution changes",
                "Model monitoring doesn't exist",
                "Drift detection doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does neural network pruning work?",
            options: [
                "Pruning removes unnecessary connections or neurons to reduce model size",
                "Pruning doesn't exist",
                "Pruning is automatic",
                "Pruning only works for small networks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between online and batch learning?",
            options: [
                "Online learning updates incrementally, batch learning processes all data at once",
                "They are identical",
                "Only online exists",
                "Only batch exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural network gradient clipping prevents exploding gradients.",
            options: [
                "Gradient clipping limits gradient magnitude, preventing unstable training",
                "Gradient clipping doesn't exist",
                "Gradient clipping is automatic",
                "Gradient clipping only works for RNNs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model explainability techniques (SHAP, LIME)?",
            options: [
                "Explainability techniques provide insights into model predictions for transparency",
                "Explainability doesn't exist",
                "Explainability is automatic",
                "Explainability only matters for simple models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does reinforcement learning multi-agent systems work?",
            options: [
                "Multi-agent systems involve multiple agents learning and interacting in shared environment",
                "Multi-agent systems don't exist",
                "Multi-agent systems are automatic",
                "Multi-agent systems only work for games"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between model accuracy and model robustness?",
            options: [
                "Accuracy measures correctness, robustness measures performance under perturbations",
                "They are identical",
                "Only accuracy exists",
                "Only robustness exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural network knowledge distillation works.",
            options: [
                "Knowledge distillation transfers knowledge from large teacher model to smaller student model",
                "Knowledge distillation doesn't exist",
                "Knowledge distillation is automatic",
                "Knowledge distillation only works for classification"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model serving and inference optimization?",
            options: [
                "Model serving deploys models for production, inference optimization speeds up predictions",
                "Model serving doesn't exist",
                "Inference optimization doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does neural network architecture affect model capacity?",
            options: [
                "Architecture determines model capacity; deeper/wider networks can learn more complex patterns",
                "Architecture doesn't matter",
                "Architecture is automatic",
                "Architecture only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between model training and model inference?",
            options: [
                "Training learns from data, inference makes predictions on new data",
                "They are identical",
                "Only training exists",
                "Only inference exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural network attention mechanisms improve performance.",
            options: [
                "Attention mechanisms focus on relevant parts of input, improving context understanding",
                "Attention doesn't exist",
                "Attention is automatic",
                "Attention only works for NLP"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model evaluation metrics (F1, AUC-ROC)?",
            options: [
                "Evaluation metrics measure model performance, F1 balances precision/recall, AUC-ROC measures classification quality",
                "Evaluation metrics don't exist",
                "Evaluation metrics are automatic",
                "Evaluation metrics only matter for classification"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does neural network batch processing affect training?",
            options: [
                "Batch processing processes multiple samples together, improving efficiency and gradient estimates",
                "Batch processing doesn't exist",
                "Batch processing is automatic",
                "Batch processing only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between model overfitting and model underfitting?",
            options: [
                "Overfitting memorizes training data, underfitting fails to learn patterns",
                "They are identical",
                "Only overfitting exists",
                "Only underfitting exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how neural network residual connections (ResNet) work.",
            options: [
                "Residual connections skip layers, enabling training of very deep networks",
                "Residual connections don't exist",
                "Residual connections are automatic",
                "Residual connections only work for CNNs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of model hyperparameter optimization?",
            options: [
                "Hyperparameter optimization finds best model configuration for optimal performance",
                "Hyperparameter optimization doesn't exist",
                "Hyperparameter optimization is automatic",
                "Hyperparameter optimization only works for simple models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does neural network model deployment work in production?",
            options: [
                "Model deployment serves trained models via APIs or services for real-time predictions",
                "Model deployment doesn't exist",
                "Model deployment is automatic",
                "Model deployment only works for simple models"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Product Manager (Tech)": [
        {
            question: "What is the difference between product roadmap and product strategy?",
            options: [
                "Strategy defines vision and goals, roadmap shows execution plan and timeline",
                "They are identical",
                "Only strategy exists",
                "Only roadmap exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product-market fit is achieved.",
            options: [
                "Product-market fit occurs when product satisfies strong market demand",
                "Product-market fit doesn't exist",
                "Product-market fit is automatic",
                "Product-market fit only matters for startups"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of user stories in product development?",
            options: [
                "User stories describe features from user perspective, guiding development priorities",
                "User stories don't exist",
                "User stories are automatic",
                "User stories only matter for agile teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product prioritization work (RICE, MoSCoW)?",
            options: [
                "Prioritization frameworks (RICE, MoSCoW) rank features by value, effort, and impact",
                "Prioritization doesn't exist",
                "Prioritization is automatic",
                "Prioritization only works for small products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product vision and product mission?",
            options: [
                "Vision describes future state, mission describes purpose and reason for existence",
                "They are identical",
                "Only vision exists",
                "Only mission exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product analytics inform decisions.",
            options: [
                "Product analytics track user behavior and metrics to guide product decisions",
                "Product analytics don't exist",
                "Product analytics are automatic",
                "Product analytics only matter for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of A/B testing in product management?",
            options: [
                "A/B testing compares product variations to optimize user experience and metrics",
                "A/B testing doesn't exist",
                "A/B testing is automatic",
                "A/B testing only matters for websites"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product discovery differ from product delivery?",
            options: [
                "Discovery explores problems and solutions, delivery builds and ships features",
                "They are identical",
                "Only discovery exists",
                "Only delivery exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product features and product capabilities?",
            options: [
                "Features are specific functionalities, capabilities are broader abilities products enable",
                "They are identical",
                "Only features exist",
                "Only capabilities exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product OKRs (Objectives and Key Results) work.",
            options: [
                "OKRs set ambitious goals (objectives) with measurable outcomes (key results)",
                "OKRs don't exist",
                "OKRs are automatic",
                "OKRs only matter for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product requirements document (PRD)?",
            options: [
                "PRD defines product requirements, features, and specifications for development",
                "PRD doesn't exist",
                "PRD is automatic",
                "PRD only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product stakeholder management work?",
            options: [
                "Stakeholder management aligns interests and communicates with all product stakeholders",
                "Stakeholder management doesn't exist",
                "Stakeholder management is automatic",
                "Stakeholder management only matters for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product MVP and product prototype?",
            options: [
                "MVP is minimal viable product for users, prototype is early model for validation",
                "They are identical",
                "Only MVP exists",
                "Only prototype exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product user research informs decisions.",
            options: [
                "User research provides insights about user needs, informing product decisions",
                "User research doesn't exist",
                "User research is automatic",
                "User research only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product backlog management?",
            options: [
                "Backlog management prioritizes and maintains list of features and improvements",
                "Backlog management doesn't exist",
                "Backlog management is automatic",
                "Backlog management only matters for agile teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product go-to-market strategy work?",
            options: [
                "Go-to-market strategy defines how product reaches customers and achieves adoption",
                "Go-to-market strategy doesn't exist",
                "Go-to-market strategy is automatic",
                "Go-to-market strategy only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product metrics and product KPIs?",
            options: [
                "Metrics are any measurements, KPIs are key metrics tied to business objectives",
                "They are identical",
                "Only metrics exist",
                "Only KPIs exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product competitive analysis works.",
            options: [
                "Competitive analysis evaluates competitors' products to identify opportunities and threats",
                "Competitive analysis doesn't exist",
                "Competitive analysis is automatic",
                "Competitive analysis only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature flags?",
            options: [
                "Feature flags enable gradual rollouts and A/B testing without code deployments",
                "Feature flags don't exist",
                "Feature flags are automatic",
                "Feature flags only work for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product user segmentation work?",
            options: [
                "User segmentation groups users by characteristics to tailor product experiences",
                "User segmentation doesn't exist",
                "User segmentation is automatic",
                "User segmentation only matters for large user bases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product launch and product release?",
            options: [
                "Launch includes marketing and go-to-market, release is technical deployment",
                "They are identical",
                "Only launch exists",
                "Only release exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer feedback loops work.",
            options: [
                "Feedback loops collect user input to continuously improve product",
                "Feedback loops don't exist",
                "Feedback loops are automatic",
                "Feedback loops only matter for apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product technical debt management?",
            options: [
                "Technical debt management balances feature development with code quality and refactoring",
                "Technical debt management doesn't exist",
                "Technical debt management is automatic",
                "Technical debt management only matters for legacy products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product data-driven decision making work?",
            options: [
                "Data-driven decisions use analytics and metrics instead of assumptions",
                "Data-driven decisions don't exist",
                "Data-driven decisions are automatic",
                "Data-driven decisions only matter for web products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product strategy and product tactics?",
            options: [
                "Strategy is long-term plan, tactics are short-term actions to execute strategy",
                "They are identical",
                "Only strategy exists",
                "Only tactics exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product user journey mapping works.",
            options: [
                "User journey mapping visualizes user experience across touchpoints to identify improvements",
                "User journey mapping doesn't exist",
                "User journey mapping is automatic",
                "User journey mapping only matters for e-commerce"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product release planning?",
            options: [
                "Release planning schedules feature delivery across multiple releases",
                "Release planning doesn't exist",
                "Release planning is automatic",
                "Release planning only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product pricing strategy work?",
            options: [
                "Pricing strategy determines product price based on value, competition, and market",
                "Pricing strategy doesn't exist",
                "Pricing strategy is automatic",
                "Pricing strategy only matters for paid products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product features and product enhancements?",
            options: [
                "Features are new capabilities, enhancements improve existing features",
                "They are identical",
                "Only features exist",
                "Only enhancements exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product market research informs strategy.",
            options: [
                "Market research provides insights about market size, trends, and customer needs",
                "Market research doesn't exist",
                "Market research is automatic",
                "Market research only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product success metrics?",
            options: [
                "Success metrics measure product performance against business objectives",
                "Success metrics don't exist",
                "Success metrics are automatic",
                "Success metrics only matter for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product iteration and experimentation work?",
            options: [
                "Iteration and experimentation test hypotheses to continuously improve product",
                "Iteration doesn't exist",
                "Experimentation doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product vision and product goals?",
            options: [
                "Vision is aspirational future state, goals are specific measurable objectives",
                "They are identical",
                "Only vision exists",
                "Only goals exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer acquisition works.",
            options: [
                "Customer acquisition strategies attract and convert users to product",
                "Customer acquisition doesn't exist",
                "Customer acquisition is automatic",
                "Customer acquisition only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature adoption metrics?",
            options: [
                "Feature adoption metrics measure how many users use new features",
                "Feature adoption metrics don't exist",
                "Feature adoption metrics are automatic",
                "Feature adoption metrics only matter for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product competitive positioning work?",
            options: [
                "Competitive positioning differentiates product from competitors in market",
                "Competitive positioning doesn't exist",
                "Competitive positioning is automatic",
                "Competitive positioning only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product requirements and product specifications?",
            options: [
                "Requirements describe what product should do, specifications describe how it's built",
                "They are identical",
                "Only requirements exist",
                "Only specifications exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product user retention strategies work.",
            options: [
                "Retention strategies keep users engaged and prevent churn through value delivery",
                "Retention strategies don't exist",
                "Retention strategies are automatic",
                "Retention strategies only matter for subscription products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product roadmap prioritization?",
            options: [
                "Roadmap prioritization ranks features by value, effort, and strategic importance",
                "Roadmap prioritization doesn't exist",
                "Roadmap prioritization is automatic",
                "Roadmap prioritization only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product customer success management work?",
            options: [
                "Customer success ensures users achieve desired outcomes, reducing churn",
                "Customer success doesn't exist",
                "Customer success is automatic",
                "Customer success only matters for enterprise products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product innovation and product iteration?",
            options: [
                "Innovation creates new solutions, iteration improves existing solutions",
                "They are identical",
                "Only innovation exists",
                "Only iteration exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product market validation works.",
            options: [
                "Market validation tests product-market fit before full development",
                "Market validation doesn't exist",
                "Market validation is automatic",
                "Market validation only matters for startups"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature lifecycle management?",
            options: [
                "Feature lifecycle management tracks features from ideation to deprecation",
                "Feature lifecycle management doesn't exist",
                "Feature lifecycle management is automatic",
                "Feature lifecycle management only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product user onboarding optimization work?",
            options: [
                "Onboarding optimization improves user activation and time-to-value",
                "Onboarding optimization doesn't exist",
                "Onboarding optimization is automatic",
                "Onboarding optimization only matters for complex products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product growth and product scaling?",
            options: [
                "Growth increases users/revenue, scaling maintains performance as product grows",
                "They are identical",
                "Only growth exists",
                "Only scaling exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer persona development works.",
            options: [
                "Persona development creates detailed user profiles to guide product decisions",
                "Persona development doesn't exist",
                "Persona development is automatic",
                "Persona development only matters for B2C products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature flag management?",
            options: [
                "Feature flag management controls feature rollouts and enables gradual releases",
                "Feature flag management doesn't exist",
                "Feature flag management is automatic",
                "Feature flag management only works for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product value proposition development work?",
            options: [
                "Value proposition defines unique benefits product provides to customers",
                "Value proposition development doesn't exist",
                "Value proposition development is automatic",
                "Value proposition development only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product backlog and product roadmap?",
            options: [
                "Backlog is prioritized feature list, roadmap shows timeline and strategic plan",
                "They are identical",
                "Only backlog exists",
                "Only roadmap exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer feedback integration works.",
            options: [
                "Feedback integration incorporates user input into product development process",
                "Feedback integration doesn't exist",
                "Feedback integration is automatic",
                "Feedback integration only matters for consumer products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product success criteria definition?",
            options: [
                "Success criteria define measurable outcomes that indicate product success",
                "Success criteria don't exist",
                "Success criteria are automatic",
                "Success criteria only matter for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product market segmentation work?",
            options: [
                "Market segmentation divides market into groups with similar needs for targeting",
                "Market segmentation doesn't exist",
                "Market segmentation is automatic",
                "Market segmentation only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product strategy and product execution?",
            options: [
                "Strategy defines what to build and why, execution builds and delivers it",
                "They are identical",
                "Only strategy exists",
                "Only execution exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product user activation metrics work.",
            options: [
                "Activation metrics measure when users first experience product value",
                "Activation metrics don't exist",
                "Activation metrics are automatic",
                "Activation metrics only matter for freemium products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature deprecation strategy?",
            options: [
                "Deprecation strategy manages removal of features while maintaining user satisfaction",
                "Deprecation strategy doesn't exist",
                "Deprecation strategy is automatic",
                "Deprecation strategy only matters for legacy products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product customer lifetime value (LTV) analysis work?",
            options: [
                "LTV analysis calculates total revenue expected from customer over relationship",
                "LTV analysis doesn't exist",
                "LTV analysis is automatic",
                "LTV analysis only matters for subscription products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product vision and product roadmap?",
            options: [
                "Vision describes future state, roadmap shows path to achieve vision",
                "They are identical",
                "Only vision exists",
                "Only roadmap exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer churn analysis works.",
            options: [
                "Churn analysis identifies why users leave and strategies to reduce churn",
                "Churn analysis doesn't exist",
                "Churn analysis is automatic",
                "Churn analysis only matters for subscription products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature usage analytics?",
            options: [
                "Feature usage analytics track how features are used to inform product decisions",
                "Feature usage analytics don't exist",
                "Feature usage analytics are automatic",
                "Feature usage analytics only matter for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product market opportunity analysis work?",
            options: [
                "Opportunity analysis evaluates market size and potential for product success",
                "Opportunity analysis doesn't exist",
                "Opportunity analysis is automatic",
                "Opportunity analysis only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product requirements and user stories?",
            options: [
                "Requirements are detailed specifications, user stories are user-focused descriptions",
                "They are identical",
                "Only requirements exist",
                "Only user stories exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer satisfaction measurement works.",
            options: [
                "Satisfaction measurement (NPS, CSAT) quantifies customer happiness with product",
                "Satisfaction measurement doesn't exist",
                "Satisfaction measurement is automatic",
                "Satisfaction measurement only matters for B2C products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature prioritization frameworks?",
            options: [
                "Prioritization frameworks (RICE, Value vs Effort) rank features systematically",
                "Prioritization frameworks don't exist",
                "Prioritization frameworks are automatic",
                "Prioritization frameworks only work for small products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product go-to-market execution work?",
            options: [
                "Go-to-market execution implements strategy to launch and acquire customers",
                "Go-to-market execution doesn't exist",
                "Go-to-market execution is automatic",
                "Go-to-market execution only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product strategy and product tactics?",
            options: [
                "Strategy is long-term plan, tactics are short-term actions to execute strategy",
                "They are identical",
                "Only strategy exists",
                "Only tactics exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer journey optimization works.",
            options: [
                "Journey optimization improves user experience across all product touchpoints",
                "Journey optimization doesn't exist",
                "Journey optimization is automatic",
                "Journey optimization only matters for e-commerce"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product success metrics tracking?",
            options: [
                "Success metrics tracking monitors product performance against business goals",
                "Success metrics tracking doesn't exist",
                "Success metrics tracking is automatic",
                "Success metrics tracking only matters for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product feature experimentation work?",
            options: [
                "Feature experimentation tests hypotheses to validate product decisions",
                "Feature experimentation doesn't exist",
                "Feature experimentation is automatic",
                "Feature experimentation only works for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product vision and product mission?",
            options: [
                "Vision describes future state, mission describes purpose and reason for existence",
                "They are identical",
                "Only vision exists",
                "Only mission exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer acquisition cost (CAC) analysis works.",
            options: [
                "CAC analysis calculates cost to acquire each customer, informing marketing strategy",
                "CAC analysis doesn't exist",
                "CAC analysis is automatic",
                "CAC analysis only matters for paid products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature adoption tracking?",
            options: [
                "Feature adoption tracking measures how many users use new features",
                "Feature adoption tracking doesn't exist",
                "Feature adoption tracking is automatic",
                "Feature adoption tracking only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product market positioning work?",
            options: [
                "Market positioning defines how product is perceived relative to competitors",
                "Market positioning doesn't exist",
                "Market positioning is automatic",
                "Market positioning only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product requirements and acceptance criteria?",
            options: [
                "Requirements describe what to build, acceptance criteria define when it's done",
                "They are identical",
                "Only requirements exist",
                "Only acceptance criteria exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer retention strategies work.",
            options: [
                "Retention strategies keep users engaged and prevent churn through value delivery",
                "Retention strategies don't exist",
                "Retention strategies are automatic",
                "Retention strategies only matter for subscription products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product roadmap communication?",
            options: [
                "Roadmap communication aligns stakeholders on product direction and timeline",
                "Roadmap communication doesn't exist",
                "Roadmap communication is automatic",
                "Roadmap communication only matters for large teams"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product feature lifecycle management work?",
            options: [
                "Feature lifecycle management tracks features from ideation to deprecation",
                "Feature lifecycle management doesn't exist",
                "Feature lifecycle management is automatic",
                "Feature lifecycle management only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product strategy and product planning?",
            options: [
                "Strategy defines direction, planning creates detailed execution plan",
                "They are identical",
                "Only strategy exists",
                "Only planning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer success metrics work.",
            options: [
                "Customer success metrics measure how well product helps users achieve goals",
                "Customer success metrics don't exist",
                "Customer success metrics are automatic",
                "Customer success metrics only matter for enterprise products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature flagging?",
            options: [
                "Feature flagging enables gradual rollouts and A/B testing without deployments",
                "Feature flagging doesn't exist",
                "Feature flagging is automatic",
                "Feature flagging only works for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product market research inform strategy?",
            options: [
                "Market research provides insights about market size, trends, and customer needs",
                "Market research doesn't exist",
                "Market research is automatic",
                "Market research only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product vision and product goals?",
            options: [
                "Vision is aspirational future state, goals are specific measurable objectives",
                "They are identical",
                "Only vision exists",
                "Only goals exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer feedback loops work.",
            options: [
                "Feedback loops collect user input to continuously improve product",
                "Feedback loops don't exist",
                "Feedback loops are automatic",
                "Feedback loops only matter for apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product success measurement?",
            options: [
                "Success measurement tracks product performance against business objectives",
                "Success measurement doesn't exist",
                "Success measurement is automatic",
                "Success measurement only matters for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product feature prioritization work?",
            options: [
                "Feature prioritization ranks features by value, effort, and strategic importance",
                "Feature prioritization doesn't exist",
                "Feature prioritization is automatic",
                "Feature prioritization only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product strategy and product execution?",
            options: [
                "Strategy defines what to build and why, execution builds and delivers it",
                "They are identical",
                "Only strategy exists",
                "Only execution exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer acquisition strategies work.",
            options: [
                "Acquisition strategies attract and convert users to product through various channels",
                "Acquisition strategies don't exist",
                "Acquisition strategies are automatic",
                "Acquisition strategies only matter for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product roadmap management?",
            options: [
                "Roadmap management maintains and communicates product development timeline",
                "Roadmap management doesn't exist",
                "Roadmap management is automatic",
                "Roadmap management only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product user activation work?",
            options: [
                "User activation ensures users experience product value quickly after signup",
                "User activation doesn't exist",
                "User activation is automatic",
                "User activation only matters for freemium products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product features and product capabilities?",
            options: [
                "Features are specific functionalities, capabilities are broader abilities products enable",
                "They are identical",
                "Only features exist",
                "Only capabilities exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer retention analysis works.",
            options: [
                "Retention analysis identifies patterns in user behavior to improve retention",
                "Retention analysis doesn't exist",
                "Retention analysis is automatic",
                "Retention analysis only matters for subscription products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature usage tracking?",
            options: [
                "Feature usage tracking measures how features are used to inform decisions",
                "Feature usage tracking doesn't exist",
                "Feature usage tracking is automatic",
                "Feature usage tracking only matters for large products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does product market opportunity evaluation work?",
            options: [
                "Opportunity evaluation assesses market size and potential for product success",
                "Opportunity evaluation doesn't exist",
                "Opportunity evaluation is automatic",
                "Opportunity evaluation only matters for new products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between product requirements and product specifications?",
            options: [
                "Requirements describe what product should do, specifications describe how it's built",
                "They are identical",
                "Only requirements exist",
                "Only specifications exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how product customer satisfaction tracking works.",
            options: [
                "Satisfaction tracking (NPS, CSAT) quantifies customer happiness with product",
                "Satisfaction tracking doesn't exist",
                "Satisfaction tracking is automatic",
                "Satisfaction tracking only matters for B2C products"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of product feature experimentation?",
            options: [
                "Feature experimentation tests hypotheses to validate product decisions",
                "Feature experimentation doesn't exist",
                "Feature experimentation is automatic",
                "Feature experimentation only works for web apps"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Systems Administrator": [
        {
            question: "What is the difference between horizontal and vertical scaling?",
            options: [
                "Horizontal adds more servers, vertical adds more resources to existing server",
                "They are identical",
                "Only horizontal exists",
                "Only vertical exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how load balancing distributes traffic across servers.",
            options: [
                "Load balancing uses algorithms (round-robin, least connections) to distribute requests across servers",
                "Load balancing doesn't exist",
                "Load balancing is automatic",
                "Load balancing only works for one server"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server monitoring and alerting?",
            options: [
                "Monitoring tracks server health and performance, alerting notifies of issues",
                "Monitoring doesn't exist",
                "Alerting doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server backup and disaster recovery work?",
            options: [
                "Backup copies data periodically, disaster recovery restores systems after failures",
                "Backup doesn't exist",
                "Disaster recovery doesn't exist",
                "They are automatic"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between RAID levels and their use cases?",
            options: [
                "RAID levels (0,1,5,6,10) provide different redundancy and performance trade-offs",
                "RAID levels are identical",
                "Only RAID 0 exists",
                "Only RAID 1 exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server virtualization works.",
            options: [
                "Virtualization creates multiple virtual machines on single physical server",
                "Virtualization doesn't exist",
                "Virtualization is automatic",
                "Virtualization only works for Windows"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server configuration management?",
            options: [
                "Configuration management automates server setup and maintains consistency",
                "Configuration management doesn't exist",
                "Configuration management is automatic",
                "Configuration management only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server patch management work?",
            options: [
                "Patch management identifies, tests, and deploys security updates systematically",
                "Patch management doesn't exist",
                "Patch management is automatic",
                "Patch management only works for operating systems"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server high availability and fault tolerance?",
            options: [
                "High availability minimizes downtime, fault tolerance continues operation during failures",
                "They are identical",
                "Only high availability exists",
                "Only fault tolerance exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server capacity planning works.",
            options: [
                "Capacity planning forecasts resource needs to ensure adequate performance",
                "Capacity planning doesn't exist",
                "Capacity planning is automatic",
                "Capacity planning only works for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server log management?",
            options: [
                "Log management collects, stores, and analyzes logs for troubleshooting and security",
                "Log management doesn't exist",
                "Log management is automatic",
                "Log management only works for applications"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server network configuration work?",
            options: [
                "Network configuration sets up IP addresses, routing, and firewall rules",
                "Network configuration doesn't exist",
                "Network configuration is automatic",
                "Network configuration only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server clustering and load balancing?",
            options: [
                "Clustering groups servers for high availability, load balancing distributes traffic",
                "They are identical",
                "Only clustering exists",
                "Only load balancing exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server security hardening works.",
            options: [
                "Security hardening reduces attack surface by disabling unnecessary services and applying security best practices",
                "Security hardening doesn't exist",
                "Security hardening is automatic",
                "Security hardening only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server performance tuning?",
            options: [
                "Performance tuning optimizes server settings to improve speed and efficiency",
                "Performance tuning doesn't exist",
                "Performance tuning is automatic",
                "Performance tuning only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server automation and scripting work?",
            options: [
                "Automation uses scripts to perform repetitive tasks, reducing manual work",
                "Automation doesn't exist",
                "Automation is automatic",
                "Automation only works for simple tasks"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server hot and cold backups?",
            options: [
                "Hot backups occur during operation, cold backups require server shutdown",
                "They are identical",
                "Only hot backups exist",
                "Only cold backups exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server resource monitoring works.",
            options: [
                "Resource monitoring tracks CPU, memory, disk, and network usage",
                "Resource monitoring doesn't exist",
                "Resource monitoring is automatic",
                "Resource monitoring only works for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server change management?",
            options: [
                "Change management controls and documents server modifications to prevent issues",
                "Change management doesn't exist",
                "Change management is automatic",
                "Change management only matters for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server failover work?",
            options: [
                "Failover automatically switches to backup server when primary fails",
                "Failover doesn't exist",
                "Failover is manual",
                "Failover is automatic for everything"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server active-passive and active-active clustering?",
            options: [
                "Active-passive has standby server, active-active has multiple active servers",
                "They are identical",
                "Only active-passive exists",
                "Only active-active exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server DNS configuration works.",
            options: [
                "DNS configuration maps domain names to IP addresses for name resolution",
                "DNS configuration doesn't exist",
                "DNS configuration is automatic",
                "DNS configuration only works for web servers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server access control?",
            options: [
                "Access control manages who can access servers and what actions they can perform",
                "Access control doesn't exist",
                "Access control is automatic",
                "Access control only works for SSH"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server storage management work?",
            options: [
                "Storage management allocates, monitors, and optimizes disk space",
                "Storage management doesn't exist",
                "Storage management is automatic",
                "Storage management only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server LVM and traditional partitioning?",
            options: [
                "LVM provides flexible volume management, traditional partitioning is fixed",
                "They are identical",
                "Only LVM exists",
                "Only traditional partitioning exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server process management works.",
            options: [
                "Process management monitors and controls running processes and services",
                "Process management doesn't exist",
                "Process management is automatic",
                "Process management only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server time synchronization (NTP)?",
            options: [
                "NTP synchronizes server clocks for accurate timestamps and coordination",
                "NTP doesn't exist",
                "NTP is automatic",
                "NTP only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server firewall configuration work?",
            options: [
                "Firewall configuration sets rules to allow or block network traffic",
                "Firewall configuration doesn't exist",
                "Firewall configuration is automatic",
                "Firewall configuration only works for HTTP"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server cron jobs and systemd timers?",
            options: [
                "Cron jobs schedule tasks in traditional systems, systemd timers are modern alternative",
                "They are identical",
                "Only cron exists",
                "Only systemd timers exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server network bonding works.",
            options: [
                "Network bonding combines multiple network interfaces for redundancy and performance",
                "Network bonding doesn't exist",
                "Network bonding is automatic",
                "Network bonding only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server performance benchmarking?",
            options: [
                "Performance benchmarking establishes baseline metrics for server performance",
                "Performance benchmarking doesn't exist",
                "Performance benchmarking is automatic",
                "Performance benchmarking only matters for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server container management work?",
            options: [
                "Container management orchestrates containers for deployment and scaling",
                "Container management doesn't exist",
                "Container management is automatic",
                "Container management only works for Docker"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server hot and cold migration?",
            options: [
                "Hot migration moves VMs without downtime, cold migration requires shutdown",
                "They are identical",
                "Only hot migration exists",
                "Only cold migration exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server resource quotas work.",
            options: [
                "Resource quotas limit CPU, memory, and disk usage per user or process",
                "Resource quotas don't exist",
                "Resource quotas are automatic",
                "Resource quotas only work for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server health checks?",
            options: [
                "Health checks verify server status and automatically restart failed services",
                "Health checks don't exist",
                "Health checks are automatic",
                "Health checks only work for web servers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server network segmentation work?",
            options: [
                "Network segmentation divides networks into isolated segments for security",
                "Network segmentation doesn't exist",
                "Network segmentation is automatic",
                "Network segmentation only works for VLANs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server snapshots and backups?",
            options: [
                "Snapshots are point-in-time copies, backups are independent copies for recovery",
                "They are identical",
                "Only snapshots exist",
                "Only backups exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server service management works.",
            options: [
                "Service management controls system services (start, stop, restart, enable, disable)",
                "Service management doesn't exist",
                "Service management is automatic",
                "Service management only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server audit logging?",
            options: [
                "Audit logging records system events for security and compliance",
                "Audit logging doesn't exist",
                "Audit logging is automatic",
                "Audit logging only works for authentication"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server disk I/O optimization work?",
            options: [
                "I/O optimization improves disk performance through tuning and caching",
                "I/O optimization doesn't exist",
                "I/O optimization is automatic",
                "I/O optimization only works for SSDs"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server physical and virtual servers?",
            options: [
                "Physical servers are hardware, virtual servers run on hypervisors",
                "They are identical",
                "Only physical exists",
                "Only virtual exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server network troubleshooting works.",
            options: [
                "Network troubleshooting uses tools (ping, traceroute, netstat) to diagnose connectivity issues",
                "Network troubleshooting doesn't exist",
                "Network troubleshooting is automatic",
                "Network troubleshooting only works for HTTP"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server configuration drift detection?",
            options: [
                "Configuration drift detection identifies unauthorized changes to server configuration",
                "Configuration drift detection doesn't exist",
                "Configuration drift detection is automatic",
                "Configuration drift detection only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server memory management work?",
            options: [
                "Memory management allocates and monitors RAM usage, preventing out-of-memory conditions",
                "Memory management doesn't exist",
                "Memory management is automatic",
                "Memory management only works for applications"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server Active Directory and LDAP?",
            options: [
                "Active Directory is Microsoft's directory service, LDAP is protocol for directory access",
                "They are identical",
                "Only Active Directory exists",
                "Only LDAP exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server certificate management works.",
            options: [
                "Certificate management issues, renews, and revokes SSL/TLS certificates",
                "Certificate management doesn't exist",
                "Certificate management is automatic",
                "Certificate management only works for web servers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server incident response procedures?",
            options: [
                "Incident response procedures guide actions during server outages and security breaches",
                "Incident response doesn't exist",
                "Incident response is automatic",
                "Incident response only works for security issues"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server capacity monitoring work?",
            options: [
                "Capacity monitoring tracks resource usage trends to predict when scaling is needed",
                "Capacity monitoring doesn't exist",
                "Capacity monitoring is automatic",
                "Capacity monitoring only works for compute"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server hot and cold standby?",
            options: [
                "Hot standby is ready immediately, cold standby requires startup time",
                "They are identical",
                "Only hot standby exists",
                "Only cold standby exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server network address translation (NAT) works.",
            options: [
                "NAT translates private IP addresses to public IPs for internet access",
                "NAT doesn't exist",
                "NAT is automatic",
                "NAT only works for routers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server system hardening?",
            options: [
                "System hardening reduces attack surface by disabling unnecessary services and applying security",
                "System hardening doesn't exist",
                "System hardening is automatic",
                "System hardening only works for Linux"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does server resource pooling work?",
            options: [
                "Resource pooling aggregates resources from multiple servers for efficient allocation",
                "Resource pooling doesn't exist",
                "Resource pooling is automatic",
                "Resource pooling only works for virtualization"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between server hot and cold patching?",
            options: [
                "Hot patching applies updates without reboot, cold patching requires reboot",
                "They are identical",
                "Only hot patching exists",
                "Only cold patching exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how server network routing works.",
            options: [
                "Network routing directs packets between networks using routing tables and protocols",
                "Network routing doesn't exist",
                "Network routing is automatic",
                "Network routing only works for routers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of server performance profiling?",
            options: [
                "Performance profiling identifies bottlenecks and optimization opportunities",
                "Performance profiling doesn't exist",
                "Performance profiling is automatic",
                "Performance profiling only works for applications"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ],
    "Business Intelligence (BI) Developer": [
        {
            question: "What is the difference between data warehouse and data lake?",
            options: [
                "Data warehouse stores structured data, data lake stores raw data in any format",
                "They are identical",
                "Only data warehouse exists",
                "Only data lake exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how ETL (Extract, Transform, Load) processes work.",
            options: [
                "ETL extracts data from sources, transforms it, and loads it into target systems",
                "ETL doesn't exist",
                "ETL is automatic",
                "ETL only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of OLAP cubes in business intelligence?",
            options: [
                "OLAP cubes pre-aggregate data for fast multidimensional analysis",
                "OLAP cubes don't exist",
                "OLAP cubes are automatic",
                "OLAP cubes only work for Excel"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data modeling work in BI systems?",
            options: [
                "Data modeling designs database structure (star schema, snowflake) for analytics",
                "Data modeling doesn't exist",
                "Data modeling is automatic",
                "Data modeling only works for SQL"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between star schema and snowflake schema?",
            options: [
                "Star schema has denormalized dimensions, snowflake schema has normalized dimensions",
                "They are identical",
                "Only star schema exists",
                "Only snowflake schema exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehousing supports business intelligence.",
            options: [
                "Data warehousing centralizes data from multiple sources for unified analysis",
                "Data warehousing doesn't exist",
                "Data warehousing is automatic",
                "Data warehousing only works for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data aggregation in BI?",
            options: [
                "Data aggregation summarizes data for high-level analysis and reporting",
                "Data aggregation doesn't exist",
                "Data aggregation is automatic",
                "Data aggregation only works for numbers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data quality management work in BI?",
            options: [
                "Data quality management ensures accuracy, completeness, and consistency of data",
                "Data quality management doesn't exist",
                "Data quality management is automatic",
                "Data quality management only works for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between descriptive and predictive analytics?",
            options: [
                "Descriptive analyzes past data, predictive forecasts future outcomes",
                "They are identical",
                "Only descriptive exists",
                "Only predictive exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how BI dashboards work.",
            options: [
                "Dashboards visualize key metrics and KPIs for decision-making",
                "Dashboards don't exist",
                "Dashboards are automatic",
                "Dashboards only work for managers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data governance in BI?",
            options: [
                "Data governance ensures data quality, security, and compliance across organization",
                "Data governance doesn't exist",
                "Data governance is automatic",
                "Data governance only matters for large companies"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data integration work in BI systems?",
            options: [
                "Data integration combines data from multiple sources into unified view",
                "Data integration doesn't exist",
                "Data integration is automatic",
                "Data integration only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between dimensions and facts in data warehousing?",
            options: [
                "Dimensions are descriptive attributes, facts are measurable business events",
                "They are identical",
                "Only dimensions exist",
                "Only facts exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data profiling works.",
            options: [
                "Data profiling analyzes data to understand structure, quality, and relationships",
                "Data profiling doesn't exist",
                "Data profiling is automatic",
                "Data profiling only works for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of BI reporting tools?",
            options: [
                "Reporting tools create and distribute reports for business decision-making",
                "Reporting tools don't exist",
                "Reporting tools are automatic",
                "Reporting tools only work for Excel"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data mining work in business intelligence?",
            options: [
                "Data mining discovers patterns and relationships in large datasets",
                "Data mining doesn't exist",
                "Data mining is automatic",
                "Data mining only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between real-time and batch data processing?",
            options: [
                "Real-time processes data immediately, batch processes data in scheduled intervals",
                "They are identical",
                "Only real-time exists",
                "Only batch exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data visualization improves BI insights.",
            options: [
                "Data visualization presents data graphically to reveal patterns and trends",
                "Data visualization doesn't exist",
                "Data visualization is automatic",
                "Data visualization only works for charts"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of master data management (MDM)?",
            options: [
                "MDM ensures consistent, accurate master data across organization",
                "MDM doesn't exist",
                "MDM is automatic",
                "MDM only works for customer data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does self-service BI work?",
            options: [
                "Self-service BI enables business users to analyze data without IT assistance",
                "Self-service BI doesn't exist",
                "Self-service BI is automatic",
                "Self-service BI only works for simple queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between KPIs and metrics?",
            options: [
                "KPIs are key metrics tied to business objectives, metrics are general measurements",
                "They are identical",
                "Only KPIs exist",
                "Only metrics exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data lineage tracking works.",
            options: [
                "Data lineage tracks data flow from source to destination for audit and impact analysis",
                "Data lineage doesn't exist",
                "Data lineage is automatic",
                "Data lineage only works for ETL"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data catalog in BI?",
            options: [
                "Data catalog provides inventory and documentation of available data assets",
                "Data catalog doesn't exist",
                "Data catalog is automatic",
                "Data catalog only works for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does OLAP analysis work?",
            options: [
                "OLAP enables multidimensional analysis with drill-down, roll-up, and pivot operations",
                "OLAP doesn't exist",
                "OLAP is automatic",
                "OLAP only works for Excel"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between data warehouse and operational database?",
            options: [
                "Data warehouse is optimized for analysis, operational database for transactions",
                "They are identical",
                "Only data warehouse exists",
                "Only operational database exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data transformation works in ETL.",
            options: [
                "Data transformation cleanses, validates, and formats data for target system",
                "Data transformation doesn't exist",
                "Data transformation is automatic",
                "Data transformation only works for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of BI metadata management?",
            options: [
                "Metadata management documents data definitions, relationships, and business rules",
                "Metadata management doesn't exist",
                "Metadata management is automatic",
                "Metadata management only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data warehouse incremental loading work?",
            options: [
                "Incremental loading only processes changed data, reducing processing time",
                "Incremental loading doesn't exist",
                "Incremental loading is automatic",
                "Incremental loading only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between fact tables and dimension tables?",
            options: [
                "Fact tables store measurable events, dimension tables store descriptive attributes",
                "They are identical",
                "Only fact tables exist",
                "Only dimension tables exist"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehouse partitioning works.",
            options: [
                "Partitioning divides large tables into smaller segments for performance",
                "Partitioning doesn't exist",
                "Partitioning is automatic",
                "Partitioning only works for small tables"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data quality dimensions?",
            options: [
                "Data quality dimensions (accuracy, completeness, consistency) measure data quality",
                "Data quality dimensions don't exist",
                "Data quality dimensions are automatic",
                "Data quality dimensions only work for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does BI ad-hoc reporting work?",
            options: [
                "Ad-hoc reporting enables users to create custom reports on-demand",
                "Ad-hoc reporting doesn't exist",
                "Ad-hoc reporting is automatic",
                "Ad-hoc reporting only works for simple queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between data mart and data warehouse?",
            options: [
                "Data mart is subset for specific department, data warehouse is enterprise-wide",
                "They are identical",
                "Only data mart exists",
                "Only data warehouse exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehouse indexing works.",
            options: [
                "Indexing creates data structures to speed up query performance",
                "Indexing doesn't exist",
                "Indexing is automatic",
                "Indexing only works for small tables"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data warehouse compression?",
            options: [
                "Compression reduces storage space and improves query performance",
                "Compression doesn't exist",
                "Compression is automatic",
                "Compression only works for text data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data warehouse change data capture (CDC) work?",
            options: [
                "CDC captures only changed data from source systems for efficient loading",
                "CDC doesn't exist",
                "CDC is automatic",
                "CDC only works for databases"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between ETL and ELT processes?",
            options: [
                "ETL transforms before loading, ELT loads first then transforms",
                "They are identical",
                "Only ETL exists",
                "Only ELT exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehouse aggregation works.",
            options: [
                "Aggregation summarizes detailed data into higher-level summaries",
                "Aggregation doesn't exist",
                "Aggregation is automatic",
                "Aggregation only works for numbers"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data warehouse staging area?",
            options: [
                "Staging area temporarily stores raw data before transformation and loading",
                "Staging area doesn't exist",
                "Staging area is automatic",
                "Staging area only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data warehouse surrogate keys work?",
            options: [
                "Surrogate keys are system-generated identifiers ensuring uniqueness and performance",
                "Surrogate keys don't exist",
                "Surrogate keys are automatic",
                "Surrogate keys only work for dimensions"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between slowly changing dimensions (SCD) types?",
            options: [
                "SCD types (Type 1, 2, 3) handle historical dimension changes differently",
                "They are identical",
                "Only Type 1 exists",
                "Only Type 2 exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehouse materialized views work.",
            options: [
                "Materialized views store pre-computed query results for faster access",
                "Materialized views don't exist",
                "Materialized views are automatic",
                "Materialized views only work for simple queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data warehouse data archiving?",
            options: [
                "Data archiving moves old data to separate storage for cost and performance",
                "Data archiving doesn't exist",
                "Data archiving is automatic",
                "Data archiving only works for large datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does BI data modeling normalization work?",
            options: [
                "Normalization organizes data to reduce redundancy and improve integrity",
                "Normalization doesn't exist",
                "Normalization is automatic",
                "Normalization only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between data warehouse full load and incremental load?",
            options: [
                "Full load replaces all data, incremental load only adds changed data",
                "They are identical",
                "Only full load exists",
                "Only incremental load exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehouse query optimization works.",
            options: [
                "Query optimization improves performance through indexing, partitioning, and query rewriting",
                "Query optimization doesn't exist",
                "Query optimization is automatic",
                "Query optimization only works for simple queries"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data warehouse data quality checks?",
            options: [
                "Data quality checks validate data accuracy, completeness, and consistency",
                "Data quality checks don't exist",
                "Data quality checks are automatic",
                "Data quality checks only work for structured data"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does BI data discovery work?",
            options: [
                "Data discovery enables users to explore and analyze data interactively",
                "Data discovery doesn't exist",
                "Data discovery is automatic",
                "Data discovery only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the difference between data warehouse and data lakehouse?",
            options: [
                "Data lakehouse combines data lake flexibility with data warehouse structure",
                "They are identical",
                "Only data warehouse exists",
                "Only data lakehouse exists"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "Explain how data warehouse fact table granularity works.",
            options: [
                "Granularity defines level of detail stored in fact table (transaction, daily, monthly)",
                "Granularity doesn't exist",
                "Granularity is automatic",
                "Granularity only works for small fact tables"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the purpose of data warehouse data retention policies?",
            options: [
                "Retention policies define how long data is kept before archival or deletion",
                "Retention policies don't exist",
                "Retention policies are automatic",
                "Retention policies only work for large datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        },
        {
            question: "How does data warehouse dimensional modeling work?",
            options: [
                "Dimensional modeling designs schema optimized for analytical queries",
                "Dimensional modeling doesn't exist",
                "Dimensional modeling is automatic",
                "Dimensional modeling only works for small datasets"
            ],
            correctAnswer: 0,
            difficulty: "hard"
        }
    ]
};

// The script below will add the hard questions defined above to their respective categories.

const addHardQuestions = async () => {
    try {
        await connectDB();
        
        // Get all categories
        const categories = await Category.find();
        console.log(`Found ${categories.length} categories`);
        
        for (const category of categories) {
            const categoryName = category.name;
            
            // Check if we have hard questions for this category
            if (!hardQuestionsByCategory[categoryName]) {
                console.log(`No hard questions defined for "${categoryName}". Skipping...`);
                continue;
            }
            
            // Check existing hard questions
            const existingHardQuestions = await Question.find({ 
                category: category._id, 
                difficulty: "hard" 
            });
            
            if (existingHardQuestions.length >= 50) {
                console.log(`Category "${categoryName}" already has ${existingHardQuestions.length} hard questions. Skipping...`);
                continue;
            }
            
            // Get questions to add
            let questionsToAdd = hardQuestionsByCategory[categoryName];
            
            // Randomize correct answers
            questionsToAdd = randomizeCorrectAnswers(questionsToAdd);
            
            // Add category reference
            const questionsWithCategory = questionsToAdd.map(q => ({
                ...q,
                category: category._id
            }));
            
            // Insert questions
            await Question.insertMany(questionsWithCategory);
            console.log(`✓ Added ${questionsToAdd.length} hard questions to "${categoryName}"`);
        }
        
        console.log("Hard questions addition completed!");
        process.exit(0);
    } catch (error) {
        console.error("Error adding hard questions:", error);
        process.exit(1);
    }
};

// Run the script
addHardQuestions();

// For categories not in hardQuestionsByCategory, we'll need to add them
// Let me extend the script to handle all categories

export default addHardQuestions;

