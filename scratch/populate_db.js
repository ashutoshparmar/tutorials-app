const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../UI/public/data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Define Course updates
const courseUpdates = {
  'ef-core': [
    {
      id: 'ef-core-dbcontext-tracking',
      title: 'DbContext & Change Tracking',
      viewType: 'high-level',
      content: 'The DbContext is the primary class that coordinates Entity Framework Core functionality for a given data model. It is responsible for querying from the database, tracking changes made to entities, and persisting changes back using SaveChanges(). Change tracking monitors state changes (Added, Unchanged, Modified, Deleted) to generate corresponding INSERT, UPDATE, or DELETE SQL statements.',
      example: 'using var db = new AppDbContext();\nvar user = db.Users.First(u => u.Id == 1);\nuser.Name = "Updated Name"; // EF tracks state as Modified\ndb.SaveChanges(); // Commits changes to DB',
      definition: 'DbContext acts as the gateway to the database, combining the Unit of Work and Repository patterns to manage entity lifecycles.',
      why: 'It eliminates manual database connection management, query creation, and change detection, allowing developers to interact with data as C# objects.',
      problem: 'Without DbContext and change tracking, developers would have to manually write ADO.NET connections, map datasets, track dirty records, and compose custom UPDATE queries for every table.',
      realWorldExample: 'An administration panel where user profiles are loaded, modified, and saved. The developer only edits C# objects, and EF Core automatically issues precise SQL updates.',
      syntax: 'public class AppDbContext : DbContext\n{\n    public DbSet<User> Users { get; set; }\n}',
      practicalExample: 'public class AppDbContext : DbContext\n{\n    public DbSet<User> Users { get; set; }\n    protected override void OnConfiguring(DbContextOptionsBuilder options)\n        => options.UseSqlServer("Server=localhost;Database=TutorialDb;Trusted_Connection=True;");\n}',
      commonMistakes: 'Keeping DbContext instances alive too long (e.g. static or Singleton registration) which leads to memory bloat and concurrency issues. Best practice is to use scoped or transient registration.',
      questions: [
        {
          id: 'ef-core-dbcontext-q1',
          question: 'What is the purpose of AsNoTracking() in EF Core?',
          answer: 'AsNoTracking() tells EF Core not to track the returned entities in the change tracker. This reduces memory footprint and CPU overhead, making it ideal for read-only queries.'
        },
        {
          id: 'ef-core-dbcontext-q2',
          question: 'What are the main entity states in EF Core?',
          answer: 'The states are Detached, Unchanged, Added, Modified, and Deleted.'
        }
      ]
    },
    {
      id: 'ef-core-migrations-schema',
      title: 'Migrations & Code-First Schema',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>Migrations & Code-First Schema Design</h1>
  <p class="lead">Migrations allow EF Core to incrementally update the database schema to keep it in sync with the application's C# model while preserving existing data.</p>
  
  <div class="highlight-box">
    <strong>Key Command Lifecycle:</strong>
    <ol>
      <li><code>dotnet ef migrations add InitialCreate</code> - Generates a migration class in C#.</li>
      <li><code>dotnet ef database update</code> - Executes the migration SQL scripts on the target database.</li>
    </ol>
  </div>

  <h2>Model Configuration Methods</h2>
  <p>You can configure models using Data Annotations (attributes) or the Fluent API (recommended for complex rules inside <code>OnModelCreating</code>).</p>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Feature</th>
        <th>Data Annotations</th>
        <th>Fluent API</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Location</strong></td>
        <td>On the entity classes directly</td>
        <td>Inside the DbContext class</td>
      </tr>
      <tr>
        <td><strong>Capabilities</strong></td>
        <td>Basic validation & keys</td>
        <td>Full database configuration (Composite keys, Indexes, Cascades)</td>
      </tr>
      <tr>
        <td><strong>Separation of Concerns</strong></td>
        <td>Poor (mixes database and logic)</td>
        <td>Excellent (keeps entities clean)</td>
      </tr>
    </tbody>
  </table>

  <h3>Fluent API Example</h3>
  <pre><code>protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity&lt;Product&gt;()
        .HasIndex(p =&gt; p.Sku)
        .IsUnique();

    modelBuilder.Entity&lt;Product&gt;()
        .Property(p =&gt; p.Price)
        .HasPrecision(18, 2);
}</code></pre>
</div>
      `,
      questions: [
        {
          id: 'ef-core-migrations-q1',
          question: 'How do you roll back a migration in EF Core?',
          answer: 'You can roll back by running "dotnet ef database update <migration_name>" targeting a previous migration. To revert all migrations, target "0".'
        }
      ]
    },
    {
      id: 'ef-core-performance-loading',
      title: 'Performance & Loading Styles',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>Query Performance & Loading Strategies</h1>
  <p class="lead">How entities are loaded from the database directly impacts performance. EF Core supports three primary loading patterns for related data.</p>
  
  <div class="card-grid">
    <div class="card bg-success-light">
      <h3>1. Eager Loading</h3>
      <p>Loads related data as part of the initial query using the <code>.Include()</code> and <code>.ThenInclude()</code> methods. Translates into SQL JOINs.</p>
      <pre><code>var orders = context.Orders
    .Include(o =&gt; o.Items)
    .ToList();</code></pre>
    </div>

    <div class="card bg-warning-light">
      <h3>2. Explicit Loading</h3>
      <p>Related data is loaded explicitly from the database at a later time using the Entry API.</p>
      <pre><code>context.Entry(order)
    .Collection(o =&gt; o.Items)
    .Load();</code></pre>
    </div>

    <div class="card bg-danger-light">
      <h3>3. Lazy Loading</h3>
      <p>Related data is transparently loaded from the database the first time a navigation property is accessed. Requires virtual properties and proxies.</p>
      <pre><code>// Automatically queries DB on access
var items = order.Items; </code></pre>
    </div>
  </div>

  <h2>N+1 Query Problem in Lazy Loading</h2>
  <div class="alert-box alert-danger">
    <strong>Warning:</strong> Lazy loading can lead to the <strong>N+1 query problem</strong>. If you fetch 100 orders and iterate over them accessing their items, EF Core will issue 1 query for the orders, and then 100 separate queries for the items of each order.
  </div>

  <h2>Best Practices for High Performance</h2>
  <ul>
    <li>Use <strong>AsNoTracking()</strong> for read-only scenarios to save memory.</li>
    <li>Use projections (<code>.Select(...)</code>) to fetch only the required columns, avoiding loading whole entities.</li>
    <li>Avoid executing queries inside loops. Collect parameters and run a single bulk query.</li>
  </ul>
</div>
      `,
      questions: [
        {
          id: 'ef-core-perf-q1',
          question: 'What is the N+1 query problem and how do you prevent it?',
          answer: 'The N+1 query problem occurs when an application executes N additional queries to fetch related data for a collection of items. You prevent it by using Eager Loading (.Include()) to fetch all required data in a single SQL query.'
        }
      ]
    }
  ],
  'linq': [
    {
      id: 'linq-deferred-immediate',
      title: 'Deferred vs. Immediate Execution',
      viewType: 'high-level',
      content: 'LINQ queries are executed in two ways. Deferred execution means the evaluation of the query expression is delayed until the value is actually iterated over (e.g. using a foreach loop). Immediate execution forces the query to evaluate immediately and caches the results, which is done by calling methods like ToList(), ToArray(), First(), or Count().',
      example: 'var numbers = new List<int> { 1, 2, 3 };\nvar query = numbers.Where(n => n > 1); // Deferred: not executed yet\nnumbers.Add(4);\nforeach (var n in query) // Query runs HERE: returns 2, 3, 4',
      definition: 'Deferred execution evaluates queries at iteration time, allowing query reuse, while immediate execution evaluates instantly and stores results.',
      why: 'Deferred execution allows building dynamic query criteria incrementally without making redundant roundtrips to databases before data is needed.',
      problem: 'Without deferred execution, every query modification or filter would execute instantly, causing severe database load and wasting memory on temporary query results.',
      realWorldExample: 'Building a search page filter. The filter query is composed over several steps based on user input, and the query is sent to SQL Server only when calling ToList() to display the final page.',
      syntax: 'var query = source.Where(item => condition); // Deferred\nvar list = query.ToList(); // Immediate',
      practicalExample: 'var students = new List<string> { "Alice", "Bob" };\nvar startsWithA = students.Where(s => s.StartsWith("A"));\nstudents.Add("Andy");\nvar result = startsWithA.ToList(); // Evaluates to ["Alice", "Andy"]',
      commonMistakes: 'Accidentally calling .ToList() mid-query, which pulls all records into local memory and runs subsequent filters locally instead of translating them to SQL.',
      questions: [
        {
          id: 'linq-exec-q1',
          question: 'Which LINQ methods trigger immediate execution?',
          answer: 'Methods that return a single value (e.g., First, Count, Max, Average) or collections materialized using conversion methods (e.g., ToList, ToArray, ToDictionary) trigger immediate execution.'
        }
      ]
    },
    {
      id: 'linq-operators',
      title: 'Filtering, Projection, and Joining',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>LINQ Query Operators & Methods</h1>
  <p class="lead">LINQ provides query operators to filter, project, order, and join data across collections or database sources.</p>

  <h2>1. Filtering with <code>Where</code></h2>
  <p>Filters a sequence of values based on a boolean predicate.</p>
  <pre><code>var activeUsers = users.Where(u =&gt; u.IsActive && u.Age &gt; 18);</code></pre>

  <h2>2. Projection with <code>Select</code> & <code>SelectMany</code></h2>
  <ul>
    <li><code>Select</code>: Projects each element of a sequence into a new form (1-to-1 mapping).</li>
    <li><code>SelectMany</code>: Projects and flattens a sequence of sequences (1-to-many mapping).</li>
  </ul>
  <pre><code>// Select (Get list of names)
var names = users.Select(u =&gt; u.Name);

// SelectMany (Get all orders from all users in one flat list)
var allOrders = users.SelectMany(u =&gt; u.Orders);</code></pre>

  <h2>3. Joining Collections (<code>Join</code> & <code>GroupJoin</code>)</h2>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Operator</th>
        <th>Purpose</th>
        <th>SQL Equivalent</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Join</strong></td>
        <td>Correlates elements of two sequences based on matching keys.</td>
        <td>INNER JOIN</td>
      </tr>
      <tr>
        <td><strong>GroupJoin</strong></td>
        <td>Correlates two sequences and groups the results by matching key.</td>
        <td>LEFT OUTER JOIN</td>
      </tr>
    </tbody>
  </table>

  <h3>Method Join Example</h3>
  <pre><code>var innerJoin = context.Employees.Join(
    context.Departments,
    emp =&gt; emp.DeptId,
    dept =&gt; dept.Id,
    (emp, dept) =&gt; new { emp.Name, DeptName = dept.Name }
);</code></pre>
</div>
      `,
      questions: [
        {
          id: 'linq-ops-q1',
          question: 'What is the difference between Select and SelectMany in LINQ?',
          answer: 'Select maps each source element to a single result element, resulting in a collection of output objects. SelectMany projects each source element to an IEnumerable and flattens the resulting sequences into a single sequence.'
        }
      ]
    }
  ],
  'signalr': [
    {
      id: 'signalr-realtime-hubs',
      title: 'Real-time Communication & Hubs',
      viewType: 'high-level',
      content: 'ASP.NET Core SignalR is an open-source library that simplifies adding real-time web functionality to applications. Real-time web functionality is the ability of server-side code to push content to connected clients instantly. A Hub is a high-level pipeline that allows the client and server to call methods on each other directly using Remote Procedure Calls (RPC).',
      example: 'public class ChatHub : Hub\n{\n    public async Task SendMessage(string user, string message)\n    {\n        await Clients.All.SendAsync("ReceiveMessage", user, message);\n    }\n}',
      definition: 'SignalR Hubs act as communication gateways facilitating bi-directional RPC calls between servers and connected client groups.',
      why: 'It eliminates the need for clients to continuously poll the server for updates, reducing HTTP overhead and enabling instant communications.',
      problem: 'Without SignalR, developers had to use AJAX long-polling, which created high connection overhead, wasted bandwidth, and caused lag in collaborative apps.',
      realWorldExample: 'A live chat application or collaborative spreadsheet editor where updates from one user instantly propagate to everyone on the page.',
      syntax: 'public class MyHub : Hub { ... }',
      practicalExample: 'public class NotificationHub : Hub\n{\n    public async Task SendToUser(string userId, string message)\n    {\n        await Clients.User(userId).SendAsync("ReceiveNotification", message);\n    }\n}',
      commonMistakes: 'Storing state directly inside the Hub class. Hub instances are transient (created and disposed per invocation), so any state must be stored in external databases or caches like Redis.',
      questions: [
        {
          id: 'signalr-hubs-q1',
          question: 'What is a Hub in SignalR?',
          answer: 'A Hub is a high-level class that manages connections, groups, and implements communication pathways (RPC) enabling servers and clients to call each other.'
        }
      ]
    },
    {
      id: 'signalr-transports-scaleout',
      title: 'Connection Transports & Scaleout',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>Connection Transports & Scaleout Architecture</h1>
  <p class="lead">SignalR automatically falls back through three transports based on browser and server capabilities.</p>

  <div class="card-grid">
    <div class="card bg-success-light">
      <h3>1. WebSockets</h3>
      <p>The only true full-duplex, persistent connection transport. Uses standard TCP sockets under the hood. Optimal performance.</p>
    </div>
    <div class="card bg-warning-light">
      <h3>2. Server-Sent Events (SSE)</h3>
      <p>Semi-duplex transport where the server pushes updates over a persistent HTTP connection. Clients send actions via separate HTTP posts.</p>
    </div>
    <div class="card bg-danger-light">
      <h3>3. Long Polling</h3>
      <p>Simulates real-time. The client makes a request, the server holds the request until data arrives, returns the response, and the client instantly triggers another request.</p>
    </div>
  </div>

  <h2>Scaling Out SignalR (Multi-Server Setup)</h2>
  <p>In a load-balanced environment, a client connecting to server A needs to receive messages sent by a client connected to server B. This requires a **Backplane**.</p>

  <div class="highlight-box">
    <strong>Common Backplane Solutions:</strong>
    <ul>
      <li><strong>Redis Backplane:</strong> Uses Redis Pub/Sub to broadcast messages across all server nodes.</li>
      <li><strong>Azure SignalR Service:</strong> Offloads connection management completely from the app servers to a fully-managed Azure service.</li>
    </ul>
  </div>
</div>
      `,
      questions: [
        {
          id: 'signalr-scale-q1',
          question: 'Why is sticky sessions/affinity required for SignalR when scaling out?',
          answer: 'Sticky sessions ensure that all HTTP requests for a specific connection reach the same server node until the WebSocket upgrade is established, preventing handshaking and state errors.'
        }
      ]
    }
  ],
  'c#': [
    {
      id: 'csharp-value-reference',
      title: 'Value Types vs. Reference Types',
      viewType: 'high-level',
      content: 'C# types are divided into two main categories: Value Types (allocated on the Stack or inline in objects, storing data directly) and Reference Types (allocated on the Managed Heap, storing a reference or pointer to the memory location). Value types include structs, enums, and primitives like int, float, bool. Reference types include classes, interfaces, delegates, arrays, and strings.',
      example: 'int val1 = 10; int val2 = val1; // Copied by value\nMyClass obj1 = new MyClass(); MyClass obj2 = obj1; // Copied by reference (same memory location)',
      definition: 'Value types hold actual values in stack memory, whereas reference types hold pointers to objects allocated on heap memory.',
      why: 'Understanding this distinction prevents memory bloat, avoids unexpected side effects in variable copies, and minimizes GC cycles.',
      problem: 'Without this distinction, copying tiny variables would trigger heavy heap allocations, overloading the garbage collector and drastically slowing execution.',
      realWorldExample: 'Creating a Point(x,y) struct. As a value type, it loads and unloads on the stack instantly, whereas a class instance would trigger heap memory allocation.',
      syntax: 'struct Point { public int X; public int Y; } // Value type\nclass Person { public string Name; } // Reference type',
      practicalExample: 'public struct Point { public int X; public int Y; }\npublic class Person { public string Name; }\n// Point behaves as copy-by-value; Person behaves as copy-by-reference.',
      commonMistakes: 'Boxing value types (converting to object/interface references) which implicitly allocates memory on the heap and creates performance bottlenecks.',
      questions: [
        {
          id: 'csharp-val-ref-q1',
          question: 'What is boxing and unboxing in C#?',
          answer: 'Boxing is the process of converting a value type to the reference type (object). Unboxing is extracting the value type from the object. Both operations carry CPU/heap overhead.'
        },
        {
          id: 'csharp-val-ref-q2',
          question: 'Are structs always stored on the Stack?',
          answer: 'No. Structs are stored where they are declared. If a struct is a field inside a class (reference type), it is stored on the Heap as part of that class object.'
        }
      ]
    },
    {
      id: 'csharp-pattern-matching',
      title: 'Pattern Matching & Switch Expressions',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>Modern Pattern Matching in C#</h1>
  <p class="lead">Pattern matching provides a concise syntax to inspect and branch code flow based on data shapes, types, and properties.</p>

  <h2>1. Type & Declaration Pattern</h2>
  <pre><code>if (obj is string text)
{
    Console.WriteLine($"String of length: {text.Length}");
}</code></pre>

  <h2>2. Switch Expressions (C# 8+)</h2>
  <p>Replaces verbose switch statements with a streamlined, expression-oriented format.</p>
  <pre><code>public decimal GetDiscount(Customer customer) =&gt; customer switch
{
    { IsPremium: true, SpendAmount: &gt; 1000 } =&gt; 0.20m, // Property pattern
    { IsPremium: true } =&gt; 0.10m,
    { SpendAmount: &gt; 500 } =&gt; 0.05m,
    _ =&gt; 0.0m // Discard pattern (default)
};</code></pre>

  <h2>3. Relational & Logical Patterns (C# 9+)</h2>
  <p>Allows using operators like <code>&gt;</code>, <code>&lt;=</code>, <code>and</code>, <code>or</code>, and <code>not</code> inside switch logic.</p>
  <pre><code>public string DescribeTemperature(double temp) =&gt; temp switch
{
    &lt; 0 =&gt; "Freezing",
    &gt;= 0 and &lt; 15 =&gt; "Cold",
    &gt;= 15 and &lt; 30 =&gt; "Warm",
    _ =&gt; "Hot"
};</code></pre>
</div>
      `,
      questions: [
        {
          id: 'csharp-match-q1',
          question: 'What is the discard pattern (_) in C# switch expressions?',
          answer: 'The discard pattern acts as the default catch-all case, matching any input that was not caught by previous patterns.'
        }
      ]
    }
  ],
  'oop': [
    {
      id: 'oop-four-pillars',
      title: 'The Four Pillars of OOP',
      viewType: 'high-level',
      content: 'Object-Oriented Programming (OOP) is a paradigm built on four primary pillars: 1. Encapsulation: Hiding internal state and requiring all interaction to occur through public methods. 2. Inheritance: Sharing behavior and properties from parent classes to child classes. 3. Polymorphism: Performing a single action in different ways (method overloading and overriding). 4. Abstraction: Hiding complex implementation details and showing only essential features.',
      example: 'public abstract class Animal { public abstract void Sound(); } // Abstraction\npublic class Dog : Animal { public override void Sound() => Console.WriteLine("Bark"); } // Inheritance & Polymorphism',
      definition: 'OOP is a design philosophy where programs are organized around data (objects) rather than logic and actions.',
      why: 'It structures large systems cleanly, allows code reuse, makes maintenance manageable, and models real-world entities accurately.',
      problem: 'Without OOP, large procedural codebases become complex arrays of global variables, massive switch statements, and fragile dependencies.',
      realWorldExample: 'A bank account class that encapsulates the balance variable, preventing direct manipulation and only allowing changes via Deposit() and Withdraw() methods.',
      syntax: 'public class Animal { ... }\npublic class Dog : Animal { ... }',
      practicalExample: 'public class BankAccount\n{\n    private decimal _balance; // Encapsulation\n    public void Deposit(decimal amount) { if (amount > 0) _balance += amount; }\n}',
      commonMistakes: 'Overusing inheritance (creating deep hierarchies) instead of using composition, which leads to fragile base-class bugs.',
      questions: [
        {
          id: 'oop-pillars-q1',
          question: 'What is the difference between method overloading and method overriding?',
          answer: 'Overloading (compile-time polymorphism) is defining multiple methods with the same name but different signatures. Overriding (runtime polymorphism) is re-defining a base class method inside a subclass.'
        }
      ]
    },
    {
      id: 'oop-solid-principles',
      title: 'SOLID Principles',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>SOLID Principles of Object-Oriented Design</h1>
  <p class="lead">These five principles guide developers in creating software that is easy to maintain, extend, and scale over time.</p>

  <div class="solid-box card-grid">
    <div class="card">
      <h3>S - Single Responsibility</h3>
      <p>A class should have one, and only one, reason to change. Keep classes small and focused on a single task.</p>
    </div>
    <div class="card">
      <h3>O - Open/Closed</h3>
      <p>Software entities should be open for extension but closed for modification. Extend class functionality via inheritance or interfaces instead of changing source code.</p>
    </div>
    <div class="card">
      <h3>L - Liskov Substitution</h3>
      <p>Subtypes must be substitutable for their base types without altering correctness. Derived classes must not violate base class constraints or throw unexpected exceptions.</p>
    </div>
    <div class="card">
      <h3>I - Interface Segregation</h3>
      <p>Clients should not be forced to depend on interfaces they do not use. Split large interfaces into smaller, specialized ones.</p>
    </div>
    <div class="card">
      <h3>D - Dependency Inversion</h3>
      <p>Depend on abstractions (interfaces), not concretions (classes). High-level modules should not depend on low-level modules; both should depend on abstractions.</p>
    </div>
  </div>

  <h2>Dependency Inversion Example</h2>
  <pre><code>// BAD: High-level class depends on low-level SQL service
public class Car { private SqlDatabase _db = new SqlDatabase(); }

// GOOD: Class depends on abstraction interface
public interface IDatabase { void Save(); }
public class Car 
{
    private IDatabase _db;
    public Car(IDatabase db) { _db = db; } // Injected
}</code></pre>
</div>
      `,
      questions: [
        {
          id: 'oop-solid-q1',
          question: 'What does Liskov Substitution Principle mean in practice?',
          answer: 'It means if class B inherits class A, anywhere class A is used should accept class B without errors. If class B throws a NotImplementedException for a base class method, it violates LSP.'
        }
      ]
    }
  ],
  'microservices': [
    {
      id: 'microservices-patterns',
      title: 'Microservices Design Patterns',
      viewType: 'high-level',
      content: 'Microservices architecture decomposes a large application into a set of loosely coupled, collaborative services. Each service represents a distinct business capability, is independently deployable, and manages its own database (Database-per-Service). Major communication and consistency patterns include CQRS (Command Query Responsibility Segregation), API Gateway, and Saga (orchestrating distributed transactions across databases).',
      example: 'Instead of monolithic DB:\nOrderService DB -> Order Tables\nCustomerService DB -> Customer Tables\nCommunicate via HTTP REST or Event Bus (RabbitMQ/Kafka)',
      definition: 'Microservices architecture builds software as a suite of small, autonomous services modeled around business domains.',
      why: 'It allows teams to scale development, choose different technology stacks per service, deploy features independently, and isolate system failures.',
      problem: 'In a monolith, a bug in a single feature (e.g., PDF reports) can crash the entire system, and scaling requires duplicating the entire application stack.',
      realWorldExample: 'Netflix or Amazon. Different microservices handle billing, user authentication, recommendations, and streaming, communicating over APIs.',
      syntax: 'APIGateway -> [AuthService, OrderService, PaymentService]',
      practicalExample: 'User requests /orders/1 -> APIGateway -> routes to OrderService (port 5001) -> responds to user.',
      commonMistakes: 'Creating distributed monoliths (tight coupling between microservices via synchronous API requests) or ignoring distributed tracing from the start.',
      questions: [
        {
          id: 'ms-patterns-q1',
          question: 'What is the Saga Pattern in microservices?',
          answer: 'The Saga pattern coordinates a sequence of local transactions across services to maintain data consistency in distributed systems, using compensating transactions to roll back steps if a failure occurs.'
        }
      ]
    },
    {
      id: 'microservices-gateway-discovery',
      title: 'Service Discovery & API Gateway',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>API Gateways & Service Discovery</h1>
  <p class="lead">Essential components to route, secure, and manage communication inside distributed microservice applications.</p>

  <h2>1. The API Gateway Pattern</h2>
  <p>Acts as the single entry point for all clients. Routes client requests to target microservices, aggregates payloads, and offloads infrastructure tasks.</p>

  <div class="highlight-box">
    <strong>API Gateway Responsibilities:</strong>
    <ul>
      <li><strong>Request Routing:</strong> Matches client requests with matching service hosts.</li>
      <li><strong>Authentication & Authorization:</strong> Inspects JWT tokens at the boundary.</li>
      <li><strong>Rate Limiting & Throttling:</strong> Protects services from excessive traffic.</li>
      <li><strong>SSL Termination:</strong> Handles HTTPS handshakes at the edge.</li>
    </ul>
  </div>

  <h2>2. Service Discovery (Consul / Eureka)</h2>
  <p>In a dynamic cloud environment, service instances scale up and down, changing IP addresses. **Service Discovery** registers service instances dynamically.</p>

  <pre><code>Service A (Register IP: 10.0.0.5) ──&gt; [Service Registry]
API Gateway ──&gt; Queries Registry for 'Service A' ──&gt; Resolves to 10.0.0.5</code></pre>
</div>
      `,
      questions: [
        {
          id: 'ms-gateway-q1',
          question: 'What is the difference between Service Discovery registry and an API Gateway?',
          answer: 'Service Discovery acts as a database tracking active instances and IP addresses of services. An API Gateway is a proxy that routes incoming client traffic to those services using information from the registry.'
        }
      ]
    }
  ],
  'docker': [
    {
      id: 'docker-containers-vm',
      title: 'Containers vs. Virtual Machines',
      viewType: 'high-level',
      content: 'Docker uses containers to bundle an application and its dependencies into a single deployment package. Unlike Virtual Machines (which require a complete Guest Operating System running on top of a hypervisor), Docker containers share the host operating system kernel and run as isolated processes. This makes containers extremely lightweight, portable, and fast to start.',
      example: 'Virtual Machine: OS Kernel + App (Size: GigaBytes, Startup: Minutes)\nDocker Container: Shared Kernel + App (Size: MegaBytes, Startup: Seconds)',
      definition: 'Containers wrap applications in isolated user spaces sharing the host kernel, while VMs virtualize physical hardware.',
      why: 'It eliminates the "it works on my machine" problem, ensuring applications execute identically across development, staging, and cloud production environments.',
      problem: 'Before containers, deploying apps required installing runtimes on virtual machines manually, leading to version conflicts and heavy resource overhead.',
      realWorldExample: 'Running a C# .NET app, a Node.js background process, and a PostgreSQL database in isolated containers on a single developer laptop.',
      syntax: 'docker run -d -p 8080:80 mcr.microsoft.com/dotnet/aspnet:8.0',
      practicalExample: 'docker build -t myapp .\ndocker run -d -p 5000:80 myapp',
      commonMistakes: 'Running containers with root access, or storing application state inside the container itself instead of mounting persistent volumes.',
      questions: [
        {
          id: 'docker-vm-q1',
          question: 'Why do Docker containers start faster than Virtual Machines?',
          answer: 'Because containers do not boot a full guest operating system; they share the host OS kernel and run instantly as isolated processes.'
        }
      ]
    },
    {
      id: 'docker-dockerfile-builds',
      title: 'Dockerfiles & Multi-Stage Builds',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>Dockerfile Design & Multi-Stage Builds</h1>
  <p class="lead">Learn how to write optimized Dockerfiles using multi-stage builds to create tiny, secure production images.</p>

  <h2>The Concept of Multi-Stage Builds</h2>
  <p>In a standard build, compile-time SDK tools (like MSBuild, compilers, npm) are included in the final image, bloating its size. Multi-stage builds use separate <code>FROM</code> stages to compile code in a heavy image and copy only the compiled artifacts to a lightweight runtime image.</p>

  <h3>Optimized .NET Core Dockerfile Example</h3>
  <pre><code># Stage 1: Build & Compile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy remaining code and publish release
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Create runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "MyTutorialAPI.dll"]</code></pre>

  <h2>Best Practices for Image Optimization</h2>
  <ul>
    <li>Place commands that change frequently (like copying source code) towards the bottom of the Dockerfile to leverage Docker's build cache.</li>
    <li>Use <code>.dockerignore</code> to prevent copying <code>bin</code>, <code>obj</code>, and <code>node_modules</code> folders.</li>
    <li>Always run containers as non-root users in production.</li>
  </ul>
</div>
      `,
      questions: [
        {
          id: 'docker-builds-q1',
          question: 'What is the purpose of the Workdir instruction in a Dockerfile?',
          answer: 'Workdir sets the working directory for subsequent instructions (RUN, CMD, ENTRYPOINT, COPY) inside the container image.'
        }
      ]
    }
  ],
  'sql-server': [
    {
      id: 'sql-joins-operators',
      title: 'Relational Joins & Set Operators',
      viewType: 'high-level',
      content: 'Relational databases store data in tables linked by keys. To query data from multiple tables, you use SQL Joins: Inner Join (matching rows in both tables), Left Join (all rows from left, matches from right), Right Join (all rows from right, matches from left), Full Outer Join (all rows from both). Set operators like UNION and UNION ALL combine outputs from multiple queries, with UNION filtering duplicates and UNION ALL retaining all records.',
      example: 'SELECT e.Name, d.DeptName \nFROM Employees e \nINNER JOIN Departments d ON e.DeptId = d.Id',
      definition: 'Joins correlate columns between related tables, while set operators combine rows from queries with matching schemas.',
      why: 'It allows databases to store data efficiently in normalized structures without duplicate data, while enabling queries to retrieve combined data sets.',
      problem: 'Without joins, data would have to be stored in massive, flat, de-normalized tables, leading to data redundancy, anomalies, and storage waste.',
      realWorldExample: 'An e-commerce order query that joins the Orders table, Customers table, and OrderDetails table to print a customer receipt.',
      syntax: 'SELECT * FROM TableA A INNER JOIN TableB B ON A.Id = B.RefId',
      practicalExample: 'SELECT u.Name, o.OrderDate\nFROM Users u\nLEFT JOIN Orders o ON u.Id = o.UserId;',
      commonMistakes: 'Forgetting matching join conditions (creating Cartesian products / Cross Joins) or using UNION instead of UNION ALL when duplicates are not a concern (UNION is slower due to sorting for uniqueness).',
      questions: [
        {
          id: 'sql-joins-q1',
          question: 'What is the difference between UNION and UNION ALL?',
          answer: 'UNION combines query results and filters out duplicate rows (requiring an extra sorting step), whereas UNION ALL combines all rows including duplicates and runs faster.'
        }
      ]
    },
    {
      id: 'sql-indexing-tuning',
      title: 'Indexes & Query Optimization',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>SQL Indexing & Performance Optimization</h1>
  <p class="lead">Indexes are specialized database structures that speed up query data retrieval. Proper indexing is key to database scaling.</p>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Aspect</th>
        <th>Clustered Index</th>
        <th>Non-Clustered Index</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Physical Order</strong></td>
        <td>Re-orders table rows physically on disk by index key.</td>
        <td>Physical order is unaffected. Stores index keys and pointers to actual rows.</td>
      </tr>
      <tr>
        <td><strong>Limit</strong></td>
        <td>Only 1 per table.</td>
        <td>Multiple per table (up to 999 in SQL Server).</td>
      </tr>
      <tr>
        <td><strong>Default</strong></td>
        <td>Created automatically on the Primary Key column.</td>
        <td>Created manually for search filter columns.</td>
      </tr>
    </tbody>
  </table>

  <h2>Query Plans: Scan vs. Seek</h2>
  <div class="highlight-box">
    <ul>
      <li><strong>Index Scan:</strong> The query engine searches through every index page because it has no filter parameters. Similar to reading a book cover-to-cover. Slow.</li>
      <li><strong>Index Seek:</strong> The query engine navigates index tree branches directly to matching rows using filter parameters. Similar to looking up a term in the index of a book. Fast.</li>
    </ul>
  </div>

  <h2>Optimization Steps</h2>
  <ol>
    <li>Create indexes on columns frequently used in <code>WHERE</code>, <code>JOIN</code>, and <code>ORDER BY</code> clauses.</li>
    <li>Use <strong>Covering Indexes</strong> (adding <code>INCLUDE</code> columns) to prevent SQL Server from jumping to data tables to resolve values.</li>
    <li>Avoid functions on indexed columns in <code>WHERE</code> clauses (e.g., write <code>WHERE Date &gt;= '2026-01-01'</code> instead of <code>WHERE YEAR(Date) = 2026</code>) because it disables Index Seeks (renders query non-SARGable).</li>
  </ol>
</div>
      `,
      questions: [
        {
          id: 'sql-index-q1',
          question: 'What is a composite index?',
          answer: 'A composite index is an index created on two or more columns of a table. The order of columns in the index is critical; queries must filter by the leftmost columns to use the index effectively.'
        }
      ]
    }
  ],
  'design-patterns': [
    {
      id: 'patterns-creational-structural',
      title: 'Creational & Structural Patterns',
      viewType: 'high-level',
      content: 'Design patterns are typical solutions to common software design problems. Creational patterns handle object creation mechanisms (e.g. Singleton: ensuring a class has only one instance; Factory Method: defining an interface for creating objects but letting subclasses decide). Structural patterns deal with class and object composition (e.g. Adapter: allowing incompatible interfaces to work together; Decorator: dynamically adding behavior to objects).',
      example: 'Singleton Pattern:\npublic sealed class Database\n{\n    private static readonly Database _instance = new Database();\n    private Database() { }\n    public static Database Instance => _instance;\n}',
      definition: 'Design patterns are reusable templates to solve software architectural challenges in a standardized way.',
      why: 'They provide battle-tested solutions to software design, speed up development, establish architectural standards, and clarify team communications.',
      problem: 'Without design patterns, developers create ad-hoc solutions that lead to tight coupling, poor modularity, and systems that break easily when expanded.',
      realWorldExample: 'A logging service registered as a Singleton, so all components in the app write logs to a single resource.',
      syntax: 'public class Singleton { private static readonly Singleton instance = new Singleton(); ... }',
      practicalExample: 'public sealed class CacheManager\n{\n    private static readonly CacheManager instance = new CacheManager();\n    private CacheManager() { }\n    public static CacheManager Instance => instance;\n}',
      commonMistakes: 'Overusing design patterns for trivial tasks, adding unnecessary complexity (over-engineering) when simple solutions would suffice.',
      questions: [
        {
          id: 'patterns-cs-q1',
          question: 'What is the difference between Singleton and Static class?',
          answer: 'A Singleton is a normal class instance that can implement interfaces, support lazy initialization, be passed as parameters, and manage state lifecycles, whereas a static class is a compiler construct containing only static members.'
        }
      ]
    },
    {
      id: 'patterns-behavioral',
      title: 'Behavioral Patterns',
      viewType: 'detailed',
      content: '',
      example: '',
      html: `
<div class="detailed-container">
  <h1>Behavioral Design Patterns</h1>
  <p class="lead">Behavioral patterns focus on algorithms and assignments of responsibilities between objects.</p>

  <div class="card-grid">
    <div class="card bg-success-light">
      <h3>1. Strategy Pattern</h3>
      <p>Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.</p>
      <pre><code>public interface IPaymentStrategy { void Pay(decimal amount); }
public class CreditCardPay : IPaymentStrategy { ... }
public class BitcoinPay : IPaymentStrategy { ... }</code></pre>
    </div>

    <div class="card bg-warning-light">
      <h3>2. Observer Pattern</h3>
      <p>Defines a 1-to-many dependency where when one object changes state, all its dependents are notified automatically.</p>
      <pre><code>public interface IObserver { void Update(); }
public class Subject { 
    private List&lt;IObserver&gt; _observers;
    public void Notify() =&gt; _observers.ForEach(o =&gt; o.Update());
}</code></pre>
    </div>

    <div class="card bg-danger-light">
      <h3>3. State Pattern</h3>
      <p>Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.</p>
      <pre><code>public interface IState { void Handle(Context context); }
public class OrderContext { public IState CurrentState { get; set; } }</code></pre>
    </div>
  </div>

  <h2>Comparison Table</h2>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Pattern</th>
        <th>Core Motivation</th>
        <th>Real-World Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Strategy</strong></td>
        <td>Swapping algorithms at runtime.</td>
        <td>Selecting between UPS and FedEx shipping rate calculations.</td>
      </tr>
      <tr>
        <td><strong>Observer</strong></td>
        <td>Publish-Subscribe event notification.</td>
        <td>Updating GUI elements or sending emails when a user places an order.</td>
      </tr>
      <tr>
        <td><strong>State</strong></td>
        <td>Polymorphic behavior based on internal state.</td>
        <td>Transitioning an Order object from 'Placed' to 'Shipped' to 'Delivered'.</td>
      </tr>
    </tbody>
  </table>
</div>
      `,
      questions: [
        {
          id: 'patterns-behavioral-q1',
          question: 'How does the Strategy pattern enforce Open/Closed principle?',
          answer: 'It lets you introduce new algorithms (strategies) by adding new classes implementing the interface, without modifying the context class that executes the strategy.'
        }
      ]
    }
  ]
};

// Apply updates
Object.keys(courseUpdates).forEach((courseId) => {
  const course = db.courses.find((c) => c.id === courseId);
  if (course) {
    course.topics = courseUpdates[courseId];
    console.log(`Updated course "${course.title}" (${courseId}) with ${courseUpdates[courseId].length} topics.`);
  } else {
    console.warn(`Course "${courseId}" not found in db.json!`);
  }
});

// Save updated db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully saved updated db.json.');
